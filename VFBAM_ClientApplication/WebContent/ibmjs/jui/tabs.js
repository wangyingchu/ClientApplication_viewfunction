define([
	"jui/core",
	"jui/widget",
	"jui/util",
	"text!jquery-ui/ui/jquery.ui.tabs.js"
],function(core, widget, util, code){
	if (!$.ui.tabs) {
		util.execute(code);
	}
	
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
	
	return $.ui.tabs;
});
