define([
"jui/core",
"jui/widget",
"jui/mouse",
"jui/util",
"text!jquery-ui/ui/jquery.ui.slider.js"
],function(core, widget, mouse, util, code){
	if (!$.ui.slider) {
		util.execute(code);
	}
	
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
	
	return $.ui.slider;
});
