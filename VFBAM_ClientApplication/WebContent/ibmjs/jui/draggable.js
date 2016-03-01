define([
"text!jquery-ui/ui/jquery.ui.draggable.js",
"jui/util",
"jui/core",
"jui/mouse",
"jui/widget"
],function(code, util){
	if (!$.ui.draggable) {
		util.execute(code);
	}
});
