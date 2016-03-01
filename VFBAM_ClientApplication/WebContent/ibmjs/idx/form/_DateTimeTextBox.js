/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare", 
	"dojo/_base/lang",
	"dojo/sniff",
	"dojo/i18n", // i18n.getLocalization
	"dojo/date", 
	"dojo/date/locale", 
	"dojo/date/stamp", 
	"dijit/_base/wai",
	"dojo/dom-attr",
	"dijit/form/RangeBoundTextBox",
	"dijit/form/ValidationTextBox", 
	"dijit/_HasDropDown",
	"./TextBox",
	"dojo/text!./templates/DropDownBox.html",
	"dojo/i18n!./nls/_DateTimeTextBox"
], function(declare, lang, has, i18n, date, locale, stamp, wai, domAttr, RangeBoundTextBox, ValidationTextBox, _HasDropDown, 
		TextBox, template) {

	new Date("X"); // workaround for #11279, new Date("") == NaN
	
	/*=====
	dojo.declare(
		"dijit.form._DateTimeTextBox.__Constraints",
		[dijit.form.RangeBoundTextBox.__Constraints, dojo.date.locale.__FormatOptions], {
		// summary:
		//		Specifies both the rules on valid/invalid values (first/last date/time allowed),
		//		and also formatting options for how the date/time is displayed.
		// example:
		//		To restrict to dates within 2004, displayed in a long format like "December 25, 2005":
		//	|		{min:'2004-01-01',max:'2004-12-31', formatLength:'long'}
	});
	=====*/

	return declare("idx.form._DateTimeTextBox", [RangeBoundTextBox, _HasDropDown], {
		// summary:
		//		Base class for validating, serializable, range-bound date or time text box.

		templateString: template,

		// hasDownArrow: [const] Boolean
		//		Set this textbox to display a down arrow button, to open the drop down list.
		hasDownArrow: false,

		// openOnClick: [const] Boolean
		//		Set to true to open drop down upon clicking anywhere on the textbox.
		openOnClick: true,

		/*=====
		// constraints: dijit.form._DateTimeTextBox.__Constraints
		//		Despite the name, this parameter specifies both constraints on the input
		//		(including starting/ending dates/times allowed) as well as
		//		formatting options like whether the date is displayed in long (ex: December 25, 2005)
		//		or short (ex: 12/25/2005) format.  See `dijit.form._DateTimeTextBox.__Constraints` for details.
		constraints: {},
		======*/

		// Override ValidationTextBox.regExpGen().... we use a reg-ex generating function rather
		// than a straight regexp to deal with locale  (plus formatting options too?)
		regExpGen: locale.regexp,

		// datePackage: String
		//		JavaScript namespace to find calendar routines.	 Uses Gregorian calendar routines
		//		at dojo.date, by default.
		datePackage: "dojo.date",

		// Override _FormWidget.compare() to work for dates/times
		compare: function(/*Date*/ val1, /*Date*/ val2){
			var isInvalid1 = this._isInvalidDate(val1);
			var isInvalid2 = this._isInvalidDate(val2);
			// Defect 13686 enable time compare or it will cause onchange fire error 
			//// Don't do compare time, since time value losts details in parse&&format. 
			return isInvalid1 ? 
				(isInvalid2 ? 0 : -1) : (isInvalid2 ? 
					1 : date.compare(val1, val2, this._selector));
		},

		// flag to _HasDropDown to make drop down Calendar width == <input> width
		forceWidth: true,

		format: function(/*Date*/ value, /*dojo.date.locale.__FormatOptions*/ constraints){
			// summary:
			//		Formats the value as a Date, according to specified locale (second argument)
			// tags:
			//		protected
			return value ? this.dateLocaleModule.format(value, constraints) : '';
		},

		"parse": function(/*String*/ value, /*dojo.date.locale.__FormatOptions*/ constraints){
			// summary:
			//		Parses as string as a Date, according to constraints
			// tags:
			//		protected

			return this.dateLocaleModule.parse(value, constraints) || (this._isEmpty(value) ? null : undefined);	 // Date
		},

		// Overrides ValidationTextBox.serialize() to serialize a date in canonical ISO format.
		serialize: function(/*anything*/ val, /*Object?*/ options){
			if(val.toGregorian){
				val = val.toGregorian();
			}
			return stamp.toISOString(val, options);
		},

		// dropDownDefaultValue: Date
		//		The default value to focus in the popupClass widget when the textbox value is empty.
		dropDownDefaultValue : new Date(),

		// value: Date
		//		The value of this widget as a JavaScript Date object.  Use get("value") / set("value", val) to manipulate.
		//		When passed to the parser in markup, must be specified according to `dojo.date.stamp.fromISOString`
		value: new Date(""),	// value.toString()="NaN"

		_blankValue: null,	// used by filter() when the textbox is blank

		// popupClass: [protected extension] String
		//		Name of the popup widget class used to select a date/time.
		//		Subclasses should specify this.
		popupClass: "", // default is no popup = text only


		// _selector: [protected extension] String
		//		Specifies constraints.selector passed to dojo.date functions, should be either
		//		"date" or "time".
		//		Subclass must specify this.
		_selector: "",

		constructor: function(/*Object*/ args){
			var dateClass = args.datePackage ? args.datePackage + ".Date" : "Date";
			this.dateClassObj = lang.getObject(dateClass, false);
			this.value = new this.dateClassObj("");

			this.datePackage = args.datePackage || this.datePackage;
			this.dateLocaleModule = lang.getObject(this.datePackage + ".locale", false);
			this.regExpGen = this.dateLocaleModule.regexp;
			this._invalidDate = idx.form._DateTimeTextBox.prototype.value.toString();
		},
		
		postMixInProperties: function(){
			this._nlsResources = i18n.getLocalization("idx.form", "_DateTimeTextBox", this.lang);
			this.inherited(arguments);
		},

		buildRendering: function(){
			this.inherited(arguments);

			if(!this.hasDownArrow){
				this._buttonNode.style.display = "none";
			}

			// If openOnClick is true, we basically just want to treat the whole widget as the
			// button.  We need to do that also if the actual drop down button will be hidden,
			// so that there's a mouse method for opening the drop down.
			if(this.openOnClick || !this.hasDownArrow){
				this._buttonNode = this.oneuiBaseNode;
				this.oneuiBaseClass += " dijitComboBoxOpenOnClick";
			}
			
			if(has("mobile") && this.textbox){
				domAttr.set(this.textbox, "readOnly", true);
			}
		},

		_setConstraintsAttr: function(/*Object*/ constraints){
			constraints.selector = this._selector;
			constraints.fullYear = true; // see #5465 - always format with 4-digit years
			var fromISO = stamp.fromISOString;
			if(typeof constraints.min == "string"){ constraints.min = fromISO(constraints.min); }
 			if(typeof constraints.max == "string"){ constraints.max = fromISO(constraints.max); }
			this.inherited(arguments, [constraints]);
		},

		_isInvalidDate: function(/*Date*/ value){
			// summary:
			//		Runs various tests on the value, checking for invalid conditions
			// tags:
			//		private
			return !value || isNaN(value) || typeof value != "object" || value.toString() == this._invalidDate;
		},
		_isEmpty: function(value){
			return (this.trim ? /^\s*$/ : /^$/).test(value) || (value&&value.toString() == this._invalidDate);
		},

		_setValueAttr: function(/*Date|String*/ value, /*Boolean?*/ priorityChange, /*String?*/ formattedValue){
			// summary:
			//		Sets the date on this textbox. Note: value can be a JavaScript Date literal or a string to be parsed.
			if(value){
				if(typeof value == "string"){
					value = stamp.fromISOString(value);
				}
				if(this._isInvalidDate(value)){
					value = null;
				}
				if(value instanceof Date && !(this.dateClassObj === Date)){
					value = new this.dateClassObj(value);
				}
			}
			this.inherited(arguments, [value, priorityChange, formattedValue]);
			//wai.setWaiState(this.focusNode, "valuenow", value);
			//TextBox.prototype._setValueAttr.apply(this, arguments);
			if(this.dropDown){
				this.dropDown.set('value', value, false);
			}
		},

		_set: function(attr, value){
			// Avoid spurious watch() notifications when value is changed to new Date object w/the same value
			if(attr == "value" && this.value instanceof Date && this.compare(value, this.value) == 0){
				return;
			}
			this.inherited(arguments);
		},

		_setDropDownDefaultValueAttr: function(/*Date*/ val){
			this.dropDownDefaultvalue = this._isInvalidDate(val) ? new this.dateClassObj() : val;
		},

		openDropDown: function(/*Function*/ callback){
			// rebuild drop down every time, so that constraints get copied (#6002)
			if(this.dropDown){
				this.dropDown.destroy();
			}
			var PopupProto = lang.isString(this.popupClass) ? lang.getObject(this.popupClass, false) : this.popupClass,
				textBox = this,
				value = this.get("value");
			this.dropDown = new PopupProto({
				onChange: function(value){
					// this will cause InlineEditBox and other handlers to do stuff so make sure it's last
					textBox.set('value', value, true);
				},
				id: this.id + "_popup",
				dir: textBox.dir,
				lang: textBox.lang,
				value: value,
				textDir: textBox.textDir,
				currentFocus: !this._isInvalidDate(value) ? value : this.dropDownDefaultValue,
				constraints: textBox.constraints,
				filterString: textBox.filterString, // for TimeTextBox, to filter times shown
				datePackage: textBox.params.datePackage,
				isDisabledDate: function(/*Date*/ date){
					// summary:
					//	disables dates outside of the min/max of the _DateTimeTextBox
					return !textBox.rangeCheck(date, textBox.constraints);
				}
			});
			
			// Defect 14155
			// TODO fix for dl theme temporarily
			var dp = this.dropDown;
			dp.focus = lang.hitch(dp, function(){
				this.inherited("focus", arguments);
				this.focused = true;
			});
			
			//13587 set aria-own only when dropdwon existed
			this.stateNode.setAttribute("aria-owns", this.dropDown.id);

			this.inherited(arguments);
		},

		_getDisplayedValueAttr: function(){
			return this.textbox.value;
		},

		_setDisplayedValueAttr: function(/*String*/ value, /*Boolean?*/ priorityChange){
			this._setValueAttr(this.parse(value, this.constraints), priorityChange, value);
		},
		_onDropDownMouseUp: function(){
			this.inherited(arguments);
			if((!this.dropDown.focus) || (!this.dropDown.autoFocus)){
				setTimeout(lang.hitch(this, "focus"), 0);
			}
		}
	});
});
