define([
	"jui/util",
	"text!jquery-ui/ui/jquery.ui.button.js",
	"jui/core",
	"jui/widget"
],function(util, code){
	if (!$.ui.button) {
		util.execute(code);
	}
	
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
	
	
	return $.ui.button;
});
