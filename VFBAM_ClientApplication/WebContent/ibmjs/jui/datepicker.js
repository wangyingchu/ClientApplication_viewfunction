define([
	"jui/core",
	"jui/util",
	"text!jquery-ui/ui/jquery.ui.datepicker.js"
], function(core, util, code){
	if (!$.datepicker) {
		util.execute(code);
	}
	// Add browser rtl support
	var isLanguageRTL = $.datepicker._defaults.isRTL;
	$.datepicker.setDefaults({
		isRTL: util.isRtlMode() || isLanguageRTL
	});
	
	/*
	 * No localizatin automation for first release.
	 * 
	 *function localize(locale){
		util.localize("jquery.ui.i18n/jquery.ui.datepicker", locale, $.noop);
	}
	localize("");*/
		
	var baseUpdateDatepicker = $.datepicker.constructor.prototype._updateDatepicker;
	
	$.extend($.datepicker.constructor.prototype, {
		// Enale keyboard navigation for inline datepicker.
		_inlineDatepicker: function(target, inst){
			var divSpan = $(target);
			if (divSpan.hasClass(this.markerClassName)) {
				return;
			}
			divSpan.addClass(this.markerClassName).append(inst.dpDiv);
			// Apply keyboard support for inline datepicker.
			var _this = this;
			divSpan.attr("tabindex", 0).focus(function(){
				$.datepicker._datepickerShowing = true;
			}).blur(function(){
				$.datepicker._datepickerShowing = false;
			}).keydown(function(event){
				// All inner date cell is not focusable.
				divSpan.find("td a").attr("tabindex", -1);
				_this._doKeyDown(event);
			});
			// Keep keyboard enablement after date selected.
			inst.settings.onSelect = $.noop;
			$.data(target, "datepicker", inst);
			this._setDate(inst, this._getDefaultDate(inst), true);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
			//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
			if (inst.settings.disabled) {
				this._disableDatepicker(target);
			}
			inst.dpDiv.css("display", "inline-block");
			divSpan.find("td a").attr("tabindex", -1);
		},
		_updateDatepicker: function(inst){
			this.setDefaults({
				isRTL: util.isRtlMode() || this._defaults.isRTL
			});
			
			baseUpdateDatepicker.apply(this, arguments);
			
			//var isRTL = this._get(inst, "isRTL");
			//inst.dpDiv.toggleClass("ui-datepicker-rtl", isRTL);
			
			var targetId = inst.input.attr("id");
			if(!inst._a11yEnabled){
				$("<div class='ui-helper-hidden-accessible' id='" + targetId +"_a11y_announce' role='log' aria-live='assertive'></div>")
					.appendTo($("body"));
				inst.input.attr({
					"aria-labelledby":targetId + "_a11y_announce", 
				});
				inst._a11yEnabled = true;
			}
			var focusedDay = inst.dpDiv.find(".ui-datepicker-days-cell-over a").eq(0).html() || 
				inst.dpDiv.find(".ui-datepicker-current-day a").eq(0).html() ||
				inst.dpDiv.find(".ui-datepicker-today a").eq(0).html() || "";
			$("#"+targetId+"_a11y_announce").html(
				inst.dpDiv.find(".ui-datepicker-month").html() + " " + 
				focusedDay + " " + inst.dpDiv.find(".ui-datepicker-year").html()
			)
		}
	});
	
});
