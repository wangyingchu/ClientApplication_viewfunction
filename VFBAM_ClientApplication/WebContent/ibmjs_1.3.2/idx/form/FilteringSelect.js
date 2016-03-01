/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/window",
	"dijit/form/FilteringSelect",
	"idx/widget/HoverHelpTooltip",
	"./_CompositeMixin",
	"./_CssStateMixin",
	"./_AutoCompleteA11yMixin",
	"dojo/text!./templates/ComboBox.html"
], function(declare, lang, domClass, domStyle, winUtils, FilteringSelect, HoverHelpTooltip, _CompositeMixin, _CssStateMixin, _AutoCompleteA11yMixin, template) {
	var iForm = lang.getObject("idx.oneui.form", true); // for backward compatibility with IDX 1.2

	/**
	 * @name idx.form.FilteringSelect
	 * @class idx.form.FilteringSelect is implemented according to IBM One UI(tm) <b><a href="http://dleadp.torolab.ibm.com/uxd/uxd_oneui.jsp?site=ibmoneui&top=x1&left=y27&vsub=*&hsub=*&openpanes=0000010000">Combo Boxes Standard</a></b>.
	 * It is a composite widget which enhanced dijit.form.FilteringSelect with following features:
	 * <ul>
	 * <li>Built-in label</li>
	 * <li>Built-in label positioning</li>
	 * <li>Built-in hint</li>
	 * <li>Built-in hint positioning</li>
	 * <li>Built-in required attribute</li>
	 * <li>One UI theme support</li>
	 * </ul>
	 * @augments dijit.form.FilteringSelect
	 * @augments idx.form._CompositeMixin
	 * @augments idx.form._CssStateMixin
	 */
	return iForm.FilteringSelect = declare("idx.form.FilteringSelect", [FilteringSelect, _CompositeMixin, _CssStateMixin,_AutoCompleteA11yMixin],
	/**@lends idx.form.FilteringSelect.prototype*/
	{
		
		baseClass: "idxFilteringSelectWrap",
		
		oneuiBaseClass: "dijitTextBox dijitComboBox",
		
		templateString: template,
		
		selectOnClick: true,
		
		cssStateNodes: {
			"_buttonNode": "dijitDownArrowButton"
		},
		
		postCreate: function() {
			this.inherited(arguments);
			this.connect(this, "_onFocus", function(){
				if (this.message && this._hasBeenBlurred && (!this._refocusing)) {
					this.displayMessage(this.message);
				}
			});
			this._resize();
		},
		/**
		 * Provides a method to return focus to the widget without triggering
		 * revalidation.  This is typically called when the validation tooltip
		 * is closed.
		 */
		refocus: function() {
			this._refocusing = true;
			this.focus();
			this._refocusing = false;
		},
		
			
		_isEmpty: function(){
			return (/^\s*$/.test(this.textbox.value || ""));
		},

		_onBlur: function(){
			
			this.inherited(arguments);
			this.validate(this.focused);
		},

		_openResultList: function(/*Object*/ results, /*Object*/ query, /*Object*/ options){
			//	Overwrite dijit.form.FilteringSelect._openResultList to focus the selected
			//	item when open the menu.

			// #3285: tap into search callback to see if user's query resembles a match
			if(query[this.searchAttr] !== this._lastQuery){
				return;
			}

			this._fetchHandle = null;
			if(	this.disabled ||
				this.readOnly ||
				(query[this.searchAttr] !== this._lastQuery)	// TODO: better way to avoid getting unwanted notify
			){
				return;
			}
			var wasSelected = this.dropDown.getHighlightedOption();
			this.dropDown.clearResultList();
			if(!results.length && options.start == 0){ // if no results and not just the previous choices button
				this.closeDropDown();
				return;
			}
	
			// Fill in the textbox with the first item from the drop down list,
			// and highlight the characters that were auto-completed. For
			// example, if user typed "CA" and the drop down list appeared, the
			// textbox would be changed to "California" and "ifornia" would be
			// highlighted.
			
			// This method does not return any value in 1.8.
			this.dropDown.createOptions(
				results,
				options,
				lang.hitch(this, "_getMenuLabelFromItem")
			);
			
			// Use following code to get child nodes.
			var nodes = this.dropDown.containerNode.childNodes;
	
			// show our list (only if we have content, else nothing)
			this._showResultList();
			
			// Focus the selected item
			if(!this._lastInput && this.focusNode.value){
				for(var i = 0; i < nodes.length; i++){
					var item = this.dropDown.items[nodes[i].getAttribute("item")];
					if(item){
						var value = this.store._oldAPI ?	// remove getValue() for 2.0 (old dojo.data API)
								this.store.getValue(item, this.searchAttr) : item[this.searchAttr];
						value = value.toString();
						if(value == this.displayedValue){
							this.dropDown._setSelectedAttr(nodes[i]);
							winUtils.scrollIntoView(this.dropDown.selected);
							break;
						}
					}
				}
			}
			
			// #4091:
			//		tell the screen reader that the paging callback finished by
			//		shouting the next choice
			if(options.direction){
				if(1 == options.direction){
					this.dropDown.highlightFirstOption();
				}else if(-1 == options.direction){
					this.dropDown.highlightLastOption();
				}
				if(wasSelected){
					this._announceOption(this.dropDown.getHighlightedOption());
				}
			}else if(this.autoComplete && !this._prev_key_backspace
				// when the user clicks the arrow button to show the full list,
				// startSearch looks for "*".
				// it does not make sense to autocomplete
				// if they are just previewing the options available.
				&& !/^[*]+$/.test(query[this.searchAttr].toString())){
					this._announceOption(nodes[1]); // 1st real item
			}

			if(this.item === undefined){ // item == undefined for keyboard search
				// If the search returned no items that means that the user typed
				// in something invalid (and they can't make it valid by typing more characters),
				// so flag the FilteringSelect as being in an invalid state
				this.validate(true);
			}
		},
		
		_onInputContainerEnter: function(){
			domClass.toggle(this.oneuiBaseNode, "dijitComboBoxInputContainerHover", true);
		},
		
		_onInputContainerLeave: function(){
			domClass.toggle(this.oneuiBaseNode, "dijitComboBoxInputContainerHover", false);
		},
		
		displayMessage: function(/*String*/ message, /*Boolean*/ force){
			if(message){
				if(!this.messageTooltip){
					this.messageTooltip = new HoverHelpTooltip({
						connectId: [this.iconNode],
						label: message,
						position: this.tooltipPosition,
						forceFocus: false
					});
				}else{
					this.messageTooltip.set("label", message);
				}
				if(this.focused || force){
					var node = domStyle.get(this.iconNode, "visibility") == "hidden" ? this.oneuiBaseNode : this.iconNode;
					this.messageTooltip.open(node);
				}
			}else{
				this.messageTooltip && this.messageTooltip.close();
			}
		}
	});

});
