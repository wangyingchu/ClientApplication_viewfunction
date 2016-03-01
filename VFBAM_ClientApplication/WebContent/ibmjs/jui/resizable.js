define([
"text!jquery-ui/ui/jquery.ui.resizable.js",
"jui/util",
"jui/core",
"jui/mouse",
"jui/widget"
],function(code, util){
	if (!$.ui.resizable) {
		util.execute(code);
	}
});
