define([
"jui/util",
"text!jquery-ui/ui/jquery.ui.mouse.js",
"jui/widget",
"jui/core"
],function( util, code){
	if (!$.ui.mouse) {
		util.execute(code);
	}
	
	$.widget( "ui.mouse", $.ui.mouse, {
		//TODO
	});
});
