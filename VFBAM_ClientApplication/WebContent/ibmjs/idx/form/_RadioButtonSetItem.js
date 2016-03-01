/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-attr",
	"dojo/dom-construct",
	"dijit/_Widget",
	"dijit/_CssStateMixin",
	"dijit/_TemplatedMixin",
	"idx/form/_InputListItemMixin",
	"dijit/form/RadioButton"
], function(declare, array, domAttr, domConstruct, _Widget, _CssStateMixin, _TemplatedMixin, _InputListItemMixin, RadioButton){

	return declare("idx.form._RadioButtonSetItem", 
		[_Widget, _CssStateMixin, _TemplatedMixin, _InputListItemMixin], {
		// summary:
		//		The individual items for a RadioButtonSet
	
		templateString: "<div class='dijitReset ${baseClass}'><label for='${_inputId}' dojoAttachPoint='labelNode'></label></div>",
	
		baseClass: "idxRadioButtonSetItem",
		
		postMixInProperties:function(){
			this.focusNode = new RadioButton({
				id: this._inputId,
				name: this.name
			});
			this.inherited(arguments);
		},
		postCreate: function(){
			domConstruct.place(this.focusNode.domNode, this.domNode, "first");
			this.inherited(arguments);
		},
		
		_changeBox: function(){
			// summary:
			//		Called to force the select to match the state of the check box
			//		(only on click of the checkbox)	 Radio-based calls _setValueAttr
			//		instead.
			if(this.get("disabled") || this.get("readOnly")){ return; }
				array.forEach(this.parent.options, function(opt){
				opt.selected = false;
			});
			this.option.selected = true;
			this.parent.set("value",  this.parent._getValueFromOpts());
			this.parent.focusChild(this);
		},
		
		destroy: function(){
			this.focusNode.destroy();
			this.inherited(arguments);
		}
	});
});