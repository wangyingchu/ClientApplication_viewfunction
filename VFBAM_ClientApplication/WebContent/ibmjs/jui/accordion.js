define([
	"jui/util",
	"text!jquery-ui/ui/jquery.ui.accordion.js",
	"jui/core",
	"jui/widget"
], function(util, code){
	if (!$.ui.accordionCode) {
		util.execute(code);
	}
	
	$.widget("ui.accordion", $.ui.accordion, {
		_create: function(){
			this._superApply(arguments);
			this.element.addClass("jui-accordion");
		}
	});
	
	return $.ui.accordion;
});
