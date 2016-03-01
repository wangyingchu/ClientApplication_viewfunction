define([
	'dojo/_base/declare',
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dijit/registry',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!../../templates/FilterDialogPane.html',
	'./FilterPane'
], function(declare, query, array, domConstruct, domClass, registry,
	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, FilterPane){

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,

		module: null,

		show: function() {
			this.module._filterDialog.show();
			if (this.module.arg('experimental')) {
				this.matchCaseCheckbox.set('checked', this.module.grid.filter.arg('caseSensitive'));
			} else {
				this.matchCaseCheckbox.domNode.style.display = 'none';
			}
			if (!this._ruleContainer.childNodes.length) {
				this.addRule();
			}
		},

		clear: function() {
			this.module.confirmToClear();
		},

		getData: function() {
			// summary:
			//	Get filter data.
			return {
				type: this._sltMatch.get('value'),
				conditions: array.map(array.map(this._ruleContainer.childNodes, registry.byNode), function(p){
					return p.getData();
				})
			};
		},

		setData: function(data) {
			// summary:
			//	Set filter data.
			var t = this;
			array.forEach(array.map(t._ruleContainer.childNodes, registry.byNode), function(p){
				p.destroyRecursive();
			});
			t._ruleContainer.innerHTML = '';
			if(data && data.conditions.length){
				t._sltMatch.set('value', data.type || 'all');
				array.forEach(data.conditions, function(d){
					t.addRule().setData(d);
				});
			}
		},

		addRule: function(refNode) {
			var ac = this._ruleContainer,
				fp = new FilterPane({
					module: this.module
				});
			if(refNode){
				domConstruct.place(fp.domNode, refNode, 'after');
			}else{
				ac.appendChild(fp.domNode);
			}
			fp.startup();
			fp._onColumnChange();
			try{
				fp.tbSingle.focus();//TODO: this doesn't work now.
			}catch(e){}
			this.connect(fp, 'onChange', '_updateButtons');
			this._updateButtons();
			//scroll to bottom when add a rule
			ac.scrollTop = 100000;
			return fp;
		},

		isValid: function(){
			return array.every(array.map(this._ruleContainer.childNodes, registry.byNode), function(p){
				var type = p._getType(),
					valueBox = p._getValueBox(),
					cond = p.sltCondition.get('value');

				if (/Range/.test(type)) {
					if(type === 'DatetimeRange'){
						// return valueBox.dateStart.isValid() && valueBox.dateEnd.isValid() &&
						// 		valueBox.timeStart.isValid() && valueBox.dateEnd.isValid();
						return valueBox.isValid && valueBox.isValid();
					}
					return valueBox.start.isValid() && valueBox.end.isValid();
				} else if (type === 'Datetime') {
					return cond === 'isEmpty' || cond === 'isNotEmpty' || (valueBox.date.isValid() && valueBox.time.isValid());
				} else if (type === 'DatetimePast' || type === 'DatePast' || type === 'TimePast') {
					return valueBox.value.isValid() && valueBox.interval.isValid();
				} else {
					return cond === 'isEmpty' || cond === 'isNotEmpty' || (valueBox.isValid && valueBox.isValid()) || valueBox.value;
				} 
			});
		},

		_onSubmit: function() {
			if(this.isValid()){
				this.module._filterDialog.hide();
				this.module.applyFilter(this.getData());
			}
			return false;
		},

		_onCheckboxClick: function() {
			var cs = this.matchCaseCheckbox.get('checked'); 
			this.module.grid.filter.caseSensitive = cs;
		},

		_updateButtons: function() {
			var t = this,
				children = t._ruleContainer.childNodes,
				c = t.module.arg('maxRuleCount'),
				singleRule = children.length === 1,
				maxRule = children.length >= c && c > 0;
			//toggle filter button disable
			t._btnFilter.set('disabled', array.some(array.map(children, function(c){
				var p = registry.byNode(c);
				p._removeBtn.set('disabled', singleRule);
				p._addBtn.set('disabled', maxRule);
				return p;
			}), function(p){
				return !p.getData();
			}));
			//toggle add rule button disable
			t._btnClear.set('disabled', !t.module.filterData);
		}
	});
});
