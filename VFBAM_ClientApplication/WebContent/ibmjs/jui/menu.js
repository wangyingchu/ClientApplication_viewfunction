define([
"jui/core",
"jui/widget",
"jui/position",
"jui/util",
"text!jquery-ui/ui/jquery.ui.menu.js"
],function(core, widget, position, util, code){
	if (!$.ui.menu) {
		util.execute(code);
	}
	
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
	
	return $.ui.menu;
});
