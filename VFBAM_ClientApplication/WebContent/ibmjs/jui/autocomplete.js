define([
"jui/util",
"text!jquery-ui/ui/jquery.ui.autocomplete.js",
"jui/core",
"jui/widget",
"jui/position",
"jui/menu",
"jui/button"
],function(util, code){
	if (!$.ui.autocomplete) {
		util.execute(code);
	}
	
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
	
	return $.ui.autocomplete;
});
