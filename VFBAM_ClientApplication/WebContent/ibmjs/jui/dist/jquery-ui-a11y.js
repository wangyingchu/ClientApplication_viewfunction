(function( $, undefined ) {
var util = {
		/* Execute code text */
		execute: function(code){
			return eval(code);
		},
		/* HC mode check */
		isHighContrastMode: function(){
			var testDiv = $("<div>").attr("style", "border: 1px solid; border-color:red green; position: absolute; height: 5px; top: -999px;" +
				"background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');")
				.appendTo("body");
	
			var bkImg = testDiv.css("backgroundImage"),
				borderTopColor = testDiv.css("borderTopColor"),
				borderRightColor = testDiv.css("borderRightColor"),
				hc = (borderTopColor == borderRightColor) ||
					(bkImg && (bkImg == "none" || bkImg == "url(invalid-url:)" ));
	
			testDiv.remove();
	
			return hc;
		},
		/* RTL mode check */
		isRtlMode: function(){
			return ($("body").attr("dir") || $("html").attr("dir") || "").toLowerCase() === "rtl";
		},
		localize: function(nlsModulePath, locale, callback){
			if((!locale || typeof locale !== "string") && typeof navigator != "undefined"){
				// Default locale for browsers.
				locale = (navigator.language || navigator.userLanguage).toLowerCase();
			}
			if(locale){
				var temp = locale.split("-");
				if(temp[1]){
					locale = temp[0] + "-" + temp[1].toUpperCase();
				}else{
					locale = temp[0];
				}
				if(locale == "en" || locale == "en-US")return;
				try{
					
					require([nlsModulePath + "-" + locale], callback);
				}catch(e){
					console.warning("Locale " + locale + " is not provided yet.");
				}
				
			}
		}
	}




	
	$(function(){
		if(util.isHighContrastMode()){
			$("body").addClass("jui-a11y");
		}
		if(util.isRtlMode()){
			$("body").addClass("jui-rtl");
		}
	})



	


	
	$.widget("ui.accordion", $.ui.accordion, {
		_create: function(){
			this._superApply(arguments);
			this.element.addClass("jui-accordion");
		}
	});






	
	$.widget( "ui.menu", $.ui.menu, {
		_create: function(){
			this.element
				.uniqueId()
				.add(this.element.find( this.options.menus ))
				.addClass( "jui-menu" );
			if(util.isRtlMode()){
				this.options.position = {
					my: "right top",
					at: "left top"
				}
			}
			
			this._superApply(arguments);
		},
		_keydown: function(){
			if(util.isRtlMode()){
				var temp = $.ui.keyCode.LEFT;
				$.ui.keyCode.LEFT = $.ui.keyCode.RIGHT;
				$.ui.keyCode.RIGHT = temp;
				this._superApply(arguments);
				$.ui.keyCode.RIGHT = $.ui.keyCode.LEFT;
				$.ui.keyCode.LEFT = temp;
			}else{
				this._superApply(arguments);
			}
		}
	});


	
	$.widget( "ui.button", $.ui.button, {
		options: {
			priority: "primary" // primary or secondary, primary by default.
		},
		_create: function(){
			this._superApply(arguments);
			this.buttonElement.addClass("jui-button ui-button-" + this.options.priority);
		},
		_setOption: function(key, value){
			this._superApply(arguments);
			if(key === "priority"){
				this.buttonElement
					.removeClass("ui-button-primary ui-button-secondary")
					.addClass("ui-button-" + value);
			}
		},
		_resetButton: function(){
			this._superApply(arguments);
			this.buttonElement.find(".ui-button-text").html(
				this.options.text ? this.options.label : "&nbsp"
			);
		}
	});
	
	$.widget( "ui.buttonset", $.ui.buttonset, {
		_create: function(){
			this.element.addClass( "ui-buttonset" );
			this.element.find("label[for]")
				.each(function(index, item){
					var input = $("#"+$(item).attr("for"));
					if(input.is("[type=radio]")){
						$(item).addClass("ui-button-radio");
					}else if(input.is("[type=checkbox]")){
						$(item).addClass("ui-button-checkbox");
					}
				})
		},
		_init: function() {
			this.refresh();
			if(util.isRtlMode()){
				//Reverse all radio buttons
				this.element.append(
					this.buttons.filter("[type=radio]").get().reverse());
			}
		},
	})

	
	$.widget( "ui.autocomplete", $.ui.autocomplete, {
		options: {
			minLength: 0,
			autoWidth: false,
			button: null,
			// callback of button click
			action: null
		},
		_create: function(){
			if(this.options.button){
				$("<div><input></input></div>").appendTo(this.element);
				$("<div><button></button></div>").appendTo(this.element);
				this.actionButton = $("button",this.element).button(this.options.button);
				var _this = this;
				this.actionButton.click(function(event){
					_this._trigger("action", event, _this._value());
				});
				var rootElement = this.element;
				this.element = $("input", this.element).eq(0);
				this._superApply(arguments);
				this.searchInput = this.element;
				this.element = rootElement;
				this.menu.element.addClass("jui-autocomplete");
				this.element
					// Add baseClass
					.addClass("jui-autocomplete-input ui-widget");
			}else{
				this.searchInput = this.element;
				this._superApply(arguments);
			}
		},
		_value:function(){
			 return this.valueMethod.apply( this.searchInput, arguments );
		},
		_resizeMenu: function() {
			var ul = this.menu.element,
				elementWidth = this.element.outerWidth(),
				menuWidth = this.options.autoWidth ? 
					Math.max(ul.width( "" ).outerWidth() + 1, elementWidth) :
					elementWidth;
			ul.outerWidth(menuWidth);
		}
	});


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
	





	
	$.widget( "ui.mouse", $.ui.mouse, {
		//TODO
	});







	$.ui.dialog.nls = {}
	
	$.widget( "ui.dialog", $.ui.dialog, {
		options: {
			modal: true,
			autoOpen: false,
			closeText: "Close",
			dialogClass: "jui-dialog",
			locale: ""
		},
		_create: function(){
			this._superApply(arguments);
			this.localize(this.options.locale);
		},
		_setOption: function(key, value){
			this._superApply(arguments);
			if(key === "locale"){
				this.localize(value);
			}
		},
		localize: function(locale){
			var _this = this;
			if(typeof require === "undefined" || !$.isFunction(require)){
				$.ui.dialog.nls[locale] && 
				$.each($.ui.dialog.nls[locale], function(key, value){
					_this._setOption(key, value);
				});
			}else{
				util.localize("jui/i18n/jquery.ui.dialog", locale, function(){
					$.each($.ui.dialog.nls, function(key, value){
						_this._setOption(key, value);
					});
				});
			}
		}
	});


	
	$.widget( "ui.progressbar", $.ui.progressbar, {
		_create: function(){
			this._superApply(arguments);
			this.element.addClass("jui");
			this.element.removeClass("ui-corner-all");
			
			var ariaAttr = {};
			if ( this.options["aria-labelledby"] ) {
				ariaAttr["aria-labelledby"] = this.options["aria-labelledby"];
			}
			else if ( this.options["aria-label"] ){
				ariaAttr["aria-label"] = this.options["aria-label"];
			}
			else{
				ariaAttr["aria-label"] = "Aria Label For Progressbar";
			}

			this.element.attr(ariaAttr);
		}
	});


	
	$.widget( "ui.slider", $.ui.slider, {
		options: {
		},
		_create: function(){
			this._isRtl = util.isRtlMode();
			this._superApply(arguments);
			this.element.addClass("jui-slider");
		},
		_normValueFromMouse: function( position ) {
			var pixelTotal,
				pixelMouse,
				percentMouse,
				valueTotal,
				valueMouse;
	
			if ( this.orientation === "horizontal" ) {
				pixelTotal = this.elementSize.width;
				pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
			} else {
				pixelTotal = this.elementSize.height;
				pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
			}
	
			percentMouse = ( pixelMouse / pixelTotal );
			if ( percentMouse > 1 ) {
				percentMouse = 1;
			}
			if ( percentMouse < 0 ) {
				percentMouse = 0;
			}
			// Add rtl support
			if ( this.orientation === "vertical" || (this._isRtl)) {
				percentMouse = 1 - percentMouse;
			}
	
			valueTotal = this._valueMax() - this._valueMin();
			valueMouse = this._valueMin() + percentMouse * valueTotal;
	
			return this._trimAlignValue( valueMouse );
		},
		// Add a11y support based supper _refreshValue()
		_refreshValue: function() {
			var lastValPercent, valPercent, value, valueMin, valueMax,
				oRange = this.options.range,
				o = this.options,
				that = this,
				animate = ( !this._animateOff ) ? o.animate : false,
				_set = {};
	
			if ( this.options.values && this.options.values.length ) {
				this.handles.each(function( i ) {
					value = that.values(i);
					valueMin = that._valueMin();
					valueMax = that._valueMax();
					valPercent = ( value - valueMin ) / ( valueMax - valueMin ) * 100;
					_set[ that.orientation === "horizontal" ? (that._isRtl ? "right" : "left") : "bottom" ] = valPercent + "%";
					$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
					if ( that.options.range === true ) {
						if ( that.orientation === "horizontal" ) {
							if ( i === 0 ) {
								that.range.stop( 1, 1 )[ animate ? "animate" : "css" ](
									that._isRtl ? { right : valPercent + "%" } : { left : valPercent + "%" }, o.animate );
							}
							if ( i === 1 ) {
								that.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
							}
						} else {
							if ( i === 0 ) {
								that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
							}
							if ( i === 1 ) {
								that.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
							}
						}
					}
					lastValPercent = valPercent;
					// Update aria attribute
					$(this).attr({
						"role": "slider",
						"aria-valuemin": valueMin,
						"aria-valuemax": valueMax,
						"aria-valuenow": value,
						"aria-label": that.element.attr("id") + "_handle_" + (i+1)
					}).empty().html("<img class='ui-helper-hidden-accessible' alt='" + value + "'></img>");
				});
			} else {
				value = this.value();
				valueMin = this._valueMin();
				valueMax = this._valueMax();
				valPercent = ( valueMax !== valueMin ) ?
						( value - valueMin ) / ( valueMax - valueMin ) * 100 :
						0;
				_set[ this.orientation === "horizontal" ? (that._isRtl ? "right" : "left") : "bottom" ] = valPercent + "%";
				this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
	
				if ( oRange === "min" && this.orientation === "horizontal" ) {
					this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
				}
				if ( oRange === "max" && this.orientation === "horizontal" ) {
					this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
				}
				if ( oRange === "min" && this.orientation === "vertical" ) {
					this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
				}
				if ( oRange === "max" && this.orientation === "vertical" ) {
					this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
				}
				// Update aria attributes
				$(this.handle).attr({
					"role": "slider",
					"aria-valuemin": valueMin,
					"aria-valuemax": valueMax,
					"aria-valuenow": value,
					"aria-label": that.element.attr("id") + "_handle"
				}).empty().html("<img class='ui-helper-hidden-accessible' alt='" + value + "'></img>");
			}
		},
		_handleEvents: {
			keydown: function(event){
				var allowed, curVal, newVal, step, index = $(event.target).data("ui-slider-handle-index");
				
				switch (event.keyCode) {
					case $.ui.keyCode.HOME:
					case $.ui.keyCode.END:
					case $.ui.keyCode.PAGE_UP:
					case $.ui.keyCode.PAGE_DOWN:
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						event.preventDefault();
						if (!this._keySliding) {
							this._keySliding = true;
							$(event.target).addClass("ui-state-active");
							allowed = this._start(event, index);
							if (allowed === false) {
								return;
							}
						}
						break;
				}
				
				step = this.options.step;
				if (this.options.values && this.options.values.length) {
					curVal = newVal = this.values(index);
				}
				else {
					curVal = newVal = this.value();
				}
				
				switch (event.keyCode) {
					case $.ui.keyCode.HOME:
						newVal = this._valueMin();
						break;
					case $.ui.keyCode.END:
						newVal = this._valueMax();
						break;
					case $.ui.keyCode.PAGE_UP:
						newVal = this._trimAlignValue(curVal + ((this._valueMax() - this._valueMin()) / numPages));
						break;
					case $.ui.keyCode.PAGE_DOWN:
						newVal = this._trimAlignValue(curVal - ((this._valueMax() - this._valueMin()) / numPages));
						break;
					case $.ui.keyCode.UP:
						if (curVal === this._valueMax()) {
							return;
						}
						newVal = this._trimAlignValue(curVal + step);
						break;
					case $.ui.keyCode.DOWN:
						if (curVal === this._valueMin()) {
							return;
						}
						newVal = this._trimAlignValue(curVal - step);
						break;
					case $.ui.keyCode.RIGHT:
						if (curVal === (this._isRtl ? this._valueMin() : this._valueMax())) {
							return;
						}
						newVal = this._trimAlignValue(curVal + (this._isRtl ? -step : step));
						break;
					case $.ui.keyCode.LEFT:
						if (curVal === (this._isRtl ? this._valueMax() : this._valueMin())) {
							return;
						}
						newVal = this._trimAlignValue(curVal + (this._isRtl ? step : -step));
						break;
				}
				
				this._slide(event, index, newVal);
			}
		}
	});




	
	$.widget( "ui.tabs", $.ui.tabs, {
		_create: function(){
			this._superApply(arguments);
			this.element.addClass("jui-tabs");
			this.element.removeClass('ui-corner-all');
		},
		_tabKeydown: function(){
			if(util.isRtlMode()){
				var temp = $.ui.keyCode.LEFT;
				$.ui.keyCode.LEFT = $.ui.keyCode.RIGHT;
				$.ui.keyCode.RIGHT = temp;
				this._superApply(arguments);
				$.ui.keyCode.RIGHT = $.ui.keyCode.LEFT;
				$.ui.keyCode.LEFT = temp;
			}else{
				this._superApply(arguments);
			}
		}
	});



	

})( jQuery );