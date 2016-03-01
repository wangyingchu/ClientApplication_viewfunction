define([
	"jui/util",
	"text!jquery-ui/ui/jquery.ui.tooltip.js",
	"jui/core",
	"jui/widget",
	"jui/position",
], function(util, code){
	if (!$.ui.tooltip) {
		util.execute(code);
	}
	
	return $.ui.tooltip;
});
