define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-class",
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	"gridx/modules/filter/DistinctComboBoxMenu",
	"dojo/text!../../templates/FilterPane.html",
	'idx/gridx/support/DateTimeRange'
], function(declare, lang, array, css, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, DistinctComboBoxMenu, template){

	var ANY_COLUMN_VALUE = '_gridx_any_column_value_';
	
	function isAnyColumn(colid){
		return colid == ANY_COLUMN_VALUE;
	}

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,

		module: null,
		
		postMixInProperties: function(){
			this.inherited(arguments);
			
			this.i18n = this.module.nls;
			this._columnAriaLabel = this.i18n.columnSelectAriaLabel.replace('${0}', 1).replace('${1}', 3);
			this._conditionAriaLabel = this.i18n.conditionSelectAriaLabel.replace('${0}', 2).replace('${1}', 3);
			this._valueAriaLabel = this.i18n.valueBoxAriaLabel.replace('${0}', 3).replace('${1}', 3);
			
		},

		postCreate: function(){
			this.inherited(arguments);
			this._initFields();
			this._initSltCol();
			this.comboText.dropDownClass = DistinctComboBoxMenu;
			this._onConditionChange();//In the latest dijit, onChange event is no longer fired after creation
		},
	
		getData: function(){
			// summary:
			//	Get the filter defined by this filter pane.
			var value = this._getValue(), 
				colId = this.sltColumn.get('value'),
				condition = this.sltCondition.get('value');
			
			//change on 2013/9/9 add isNotEmpty condition to string type
			//support BTT
			if(condition == 'isEmpty' || condition == 'isNotEmpty' || (value !== null && (condition != 'range' || (value.start && value.end)))){
				return {
					colId: isAnyColumn(colId) ? '' : colId,
					condition: condition,
					//fix defect #10741
					//set('value', '') on DateTimeBox will set date to 1/1/1970
					//so, set('value', null) when condition is empty on a DateTimeBoxs
					value: (condition === 'isEmpty' || condition === 'isNotEmpty')? ( this._getType() === 'Date'? null : '') : value,
					type: this._getType()
				};
			}
			return null;
		},

		setData: function(data){
			// summary:
			//	Set the data of the pane to restore UI.
			if(data){
				var t = this;
				t.sltColumn.set('value', data.colId, null);
				t._onColumnChange();
				setTimeout(function(){
					t.sltCondition.set('value', data.condition, null);
					t._onConditionChange();
					t._setValue(data.value);
				}, 10);
			}
		},

		close: function(){
			var dn = this.domNode,
				m = this.module,
				ac = dn.parentNode,
				c = m.arg('maxRuleCount');
			ac.removeChild(dn);
			this.destroyRecursive();
			m._filterDialogPane._updateButtons();
		},

		onChange: function(){
			// summary:
			//	event: fired when column, condition or value is changed
		},

		_initFields: function(){
			var t = this,
				name = 'rb_name_' + Math.random();
			t.rbTrue.domNode.nextSibling.htmlFor = t.rbTrue.id;
			t.rbFalse.domNode.nextSibling.htmlFor = t.rbFalse.id;
			t.rbTrue.set('name', name);
			t.rbFalse.set('name', name);

			t._fields = [
				t.tbSingle,
				t.tbNumber,
				t.tbNumberStart,
				t.tbNumberEnd,
				
				t.tbHex,
				t.tbHexStart,
				t.tbHexEnd,
				
				t.comboText,
				t.sltSingle,
				t.dtbSingle,
				t.dtbStart,
				t.dtbEnd,
				t.ttbSingle,
				
				t.tbDatePast,
				t.sltDateInterval,

				t.tbTimePast,
				t.sltTimeInterval,

				t.dtbDatetimeSingle,
				t.ttbDatetimeSingle,
				t.dtbDatetimeRange,
				// t.dtbDatetimeStart,
				// t.ttbDatetimeStart,
				// t.dtbDatetimeEnd,
				// t.ttbDatetimeEnd,
				t.tbDatetimePast,
				
				t.ttbStart,
				t.ttbEnd,
				t.rbTrue,
				t.rbFalse
			];
			array.forEach(t._fields, function(field){
				t.connect(field, 'onChange', 'onChange');
			});
		},

		_initSltCol: function(){
			var colOpts = [{label: this.module.arg('anyColumnOption', this.module.nls.anyColumnOption), value: ANY_COLUMN_VALUE}],
				fb = this.module,
				grid = fb.grid,
				sltCol = this.sltColumn;
			array.forEach(grid.columns(), function(col){
				if(col.isFilterable()){
					var colName = col.name();
					if(grid.bidi){
						colName = grid.bidi.enforceTextDirWithUcc(col.id, colName);
					}
					colOpts.push({value: col.id, label: colName});
				}
			});
			sltCol.addOption(colOpts);
		},

		_insertRule: function(){
			this.module._filterDialogPane.addRule(this.domNode);
		},

		_onColumnChange: function(){
			var t = this,
				colId = t.sltColumn.get('value'),
				opt = t.module._getConditionOptions(isAnyColumn(colId) ? '' : colId),
				slt = t.sltCondition;
			if(slt.options && slt.options.length){
				slt.removeOption(slt.options);
			}
			slt.addOption(lang.clone(opt));
			t._onConditionChange();
		},

		_onConditionChange: function(){
			this._updateValueField();
			this.onChange();
		},

		_getDataType: function(){
			// summary:
			//		Get current column data type
			var colId = this.sltColumn.get('value');
			return isAnyColumn(colId) ? 'string' : this.module.grid.column(colId).dataType();
		},

		_getType: function(){
			// summary:
			//	Get current filter type, determined by data type and condition.
			var type = {
					'string': 'Text',
					number: 'Number',
					hex: 'Hex',
					date: 'Date',
					datetime: 'Datetime',
					time: 'Time',
					'enum': 'Select',
					'boolean': 'Radio'
				}[this._getDataType()];
			if('range' == this.sltCondition.get('value')){
				type += 'Range';
			}
			if('past' === this.sltCondition.get('value')){
				type += 'Past';
			}

			return type;
		},

		_needComboBox: function(){
			// summary:
			//	Whether current state needs a combo box for string input, may rewrite to support virtual column
			var colId = this.sltColumn.get('value');
			return this._getType() == 'Text' && !isAnyColumn(colId) && this.module.grid._columnsById[colId].field;
		},

		_updateValueField: function(){
			// summary:
			//	Update the UI for field to show/hide fields.
			var t = this,
				g = t.module.grid,
				dn = t.domNode,
				type = t._getType(),
				colId = t.sltColumn.get('value'),
				combo = t._needComboBox(),
				disabled = t.sltCondition.get('value') == 'isEmpty' || t.sltCondition.get('value') === 'isNotEmpty';
			array.forEach(['Text','Combo',
							'Number', 'NumberRange', 'Hex', 'HexRange',
							'Date', 'DatePast', 'DateRange',
							'Datetime', 'DatetimeRange', 'DatetimePast',
							'Time', 'TimeRange', 'TimePast', 'Select', 'Radio'], function(k){
				css.remove(dn, 'gridxFilterPane' + k);
			});
			css.add(dn, 'gridxFilterPane' + (combo ? 'Combo' : type));
			array.forEach(t._fields, function(f){
				f.set('disabled', disabled);
				//FIXME: this is due to "fieldWidth" not effecitve for "display:none" widgets.
				//This work around should be removed if the issue is fixed in idx/form
				if(f._resize){
					f._resize();
				}
			});
			var col = g._columnsById[colId];
			if(combo){
				if(!t._dummyCombo){
					//HACK: mixin query, get, etc methods to store, remove from 2.0.
					t._dummyCombo = new dijit.form.ComboBox({store: g.store});
				}
				//init combobox
				if(col.autoComplete !== false){
					lang.mixin(t.comboText, {
						store: g.store,
						searchAttr: col.field,
						fetchProperties: {
							sort: [{attribute: col.field, descending: false}]
						}
					});
				}
			}
			if(type == 'Select'){
				var sltSingle = t.sltSingle;
				sltSingle.removeOption(sltSingle.getOptions());
				sltSingle.addOption(array.map(col.enumOptions || [], function(option){
					return lang.isObject(option) ? option : {
						label: option,
						value: option
					};
				}));
			}
			var valueBox = t._getValueBox();
			g.filterBar.onUpdateValueField(valueBox, colId, type, combo);
		},

		_getValueBox: function(){
			var t = this;
			return {
				'Text': t._needComboBox() ? t.comboText : t.tbSingle,
				
				'Number': t.tbNumber,
				'NumberRange': {start: t.tbNumberStart, end: t.tbNumberEnd},
				'Hex': t.tbHex,
				'HexRange': {start: t.tbHexStart, end: t.tbHexEnd},
				
				'Select': t.sltSingle,
				'Date': t.dtbSingle,
				'DatePast': {value: t.tbDatePast, interval: t.sltDateInterval},

				'Time': t.ttbSingle,
				'TimePast': {value: t.tbTimePast, interval: t.sltTimeInterval},

				'Datetime': {date: t.dtbDatetimeSingle, time: t.ttbDatetimeSingle},
				'DatetimeRange': t.dtbDatetimeRange,
				'DatetimePast': {value: t.tbDatetimePast, interval: t.sltDatetimeInterval},
				'Radio': t.rbTrue,
				'DateRange': {start: t.dtbStart, end: t.dtbEnd},
				'TimeRange': {start: t.ttbStart, end: t.ttbEnd}
			}[t._getType()];
		},

		_getValue: function(){
			// summary:
			//		Get current filter value
			var t = this,
				type = t._getType(),
				combo = t._needComboBox(),
				_getDatetime = function(date, time){
					var datetime = new Date(date);

					if(date && time){
						datetime.setMinutes(time.getMinutes());
						datetime.setHours(time.getHours());
						return datetime;
					}
					return null;
				};
			
			switch(type){
				case 'Text':
					return (combo ? t.comboText : t.tbSingle).isValid() && (combo ? t.comboText : t.tbSingle).get('value') || null;
				
				case 'Number':
					return (isNaN(t.tbNumber.get('value')) || !t.tbNumber.isValid()) ? null : t.tbNumber.get('value');
				case 'NumberRange':
					return {
						start: (isNaN(this.tbNumberStart.get('value')) || !this.tbNumberStart.isValid())? null : this.tbNumberStart.get('value'),
						end: (isNaN(this.tbNumberEnd.get('value')) || !this.tbNumberEnd.isValid())? null : this.tbNumberEnd.get('value')
					};
				case 'Hex':
					return (!t.tbHex.isValid()) ? null : t.tbHex.get('value');
				case 'HexRange':
					return {
						start: (!this.tbHexStart.isValid())? null : this.tbHexStart.get('value'),
						end: (!this.tbHexEnd.isValid())? null : this.tbHexEnd.get('value')
					};
				
				case 'Select':
					return t.sltSingle.get('value') || null;
				case 'Date':
					return t.dtbSingle.get('value') || null;
				case 'DatePast':
					val = this.tbDatePast.get('value');
					if(isNaN(val) || !this.tbDatePast.isValid()){
						return null;
					}
					var cur = new Date(),
						past = new Date(),
						interval = this.sltDateInterval.get('value');

					switch(interval){
						case 'hour':
							past.setHours(cur.getHours() - val);
							break;
						case 'day':
							past.setDate(cur.getDate() - val);
							break;
						case 'month':
							past.setMonth(cur.getMonth() - val);
							break;
						case 'year':
							past.setFullYear(cur.getFullYear() - val);
							break;
					}

					return {start: past, end: cur, amount: val, interval: interval};
				case 'DateRange':
					return {start: t.dtbStart.get('value'), end: t.dtbEnd.get('value')};
					
				case 'Datetime':
					var date = this.dtbDatetimeSingle.get('value'),
						time = this.ttbDatetimeSingle.get('value');

					return _getDatetime(date, time);
				case 'DatetimeRange':
					// return null;
					var dateTimeRangeValue = this.dtbDatetimeRange.get('value');

					if(!dateTimeRangeValue){
						return null;
					}
					var startDate = dateTimeRangeValue.startDate,
						startTime = dateTimeRangeValue.startTime,
						endDate = dateTimeRangeValue.endDate,
						endTime = dateTimeRangeValue.endTime;
					
					return {start: _getDatetime(startDate, startTime), end: _getDatetime(endDate, endTime)};
				case 'DatetimePast':
					val = this.tbDatetimePast.get('value');
					if(isNaN(val) || !this.tbDatetimePast.isValid()){
						return null;
					}
					var cur = new Date(),
						past = new Date(),
						interval = this.sltDatetimeInterval.get('value');

					switch(interval){
						case 'hour':
							past.setHours(cur.getHours() - val);
							break;
						case 'day':
							past.setDate(cur.getDate() - val);
							break;
						case 'month':
							past.setMonth(cur.getMonth() - val);
							break;
						case 'year':
							past.setFullYear(cur.getFullYear() - val);
							break;
					}

					return {start: past, end: cur, amount: val, interval: interval};
				case 'Time':
					return t.ttbSingle.get('value') || null;
				case 'TimePast':
					val = this.tbTimePast.get('value');
					if(isNaN(val) || !this.tbTimePast.isValid()){
						return null;
					}
					var cur = new Date(),
						past = new Date(),
						interval = this.sltTimeInterval.get('value');

					switch(interval){
						case 'hour':
							if (cur.getHours() < val) {
								past.setHours(0);
								past.setMinutes(0);
							} else {
								past.setHours(cur.getHours() - val);
							}
							break;
					}

					return {start: past, end: cur, amount: val, interval: interval};
				case 'TimeRange':
					return {start: t.ttbStart.get('value'), end: t.ttbEnd.get('value')};
				case 'Radio':
					return !!t.rbTrue.get('checked');
				default:
					return null;
			}
		},

		_setValue: function(value){
			if(this._isValidValue(value)){
				var t = this,
					type = t._getType(),
					combo = t._needComboBox();
				switch(type){
					case 'Text':
						(combo ? t.comboText : t.tbSingle).set('value', value);
						break;
					case 'Number':
						t.tbNumber.set('value', value);
						break;
					case 'NumberRange':
						t.tbNumberStart.set('value', value.start);
						t.tbNumberEnd.set('value', value.end);
						break;
					case 'Hex':
						t.tbHex.set('value', value);
						break;
					case 'HexRange':
						t.tbHexStart.set('value', value.start);
						t.tbHexEnd.set('value', value.end);
						break;
					case 'Select':
						t.sltSingle.set('value', value);
						break;
					case 'Date':
						value = typeof value === 'object' ? value : new Date(value);
						t.dtbSingle.set('value', value);
						break;
					case 'DatePast':
						this.tbDatePast.set('value', value.amount);
						this.sltDateInterval.set('value', value.interval);
						break;
					case 'DateRange':
						value.start = typeof value.start === 'object' ? value.start : new Date(value.start);
						value.end = typeof value.end === 'object' ? value.end : new Date(value.end);
						t.dtbStart.set('value', value.start);
						t.dtbEnd.set('value', value.end);
						break;
					case 'Datetime':
						tempDate = new Date(value);
						this.dtbDatetimeSingle.set('value', tempDate);
						tempDate.setFullYear(1970);
						tempDate.setMonth(0);
						tempDate.setDate(1);
						this.ttbDatetimeSingle.set('value', tempDate);
						break;
					case 'DatetimeRange':
						// tempDate = new Date(value);
						// tempDate.setFullYear(1970);
						// tempDate.setMonth(0);
						// tempDate.setDate(1);
						// this.dtbDatetimeSingle.set('value', value);
						// this.ttbDatetimeSingle.set('value', tempDate);
						value.start = typeof value.start === 'object' ? value.start : new Date(value.start); 
						value.end = typeof value.end === 'object' ? value.end: new Date(value.end); 
						this.dtbDatetimeRange.set('value', value);
						break;
					case 'DatetimePast':
						this.tbDatetimePast.set('value', value.amount);
						this.sltDatetimeInterval.set('value', value.interval);
						break;
					case 'Time':
						t.ttbSingle.set('value', value);
						break;
					case 'TimePast':
						this.tbTimePast.set('value', value.amount);
						this.sltTimeInterval.set('value', value.interval);
						break;
					case 'TimeRange':
						t.ttbStart.set('value', value.start);
						t.ttbEnd.set('value', value.end);
						break;
					case 'Radio':
						if(value){
							t.rbTrue.set('checked', true);
						}else{
							t.rbFalse.set('checked', true);
						}
				}
			}
		},

		_isValidValue: function(value){
			return value !== null && value != undefined;
		},

		uninitialize: function(){
			this.inherited(arguments);
			if(this._dummyCombo){
				this._dummyCombo.destroyRecursive();
			}
		}
	});
});
