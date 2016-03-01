define([
	"jui/util",
	"text!jquery-ui/ui/jquery.ui.spinner.js",
	"jui/core",
	"jui/widget",
	"jui/button"
], function(util, code){
	if (!$.ui.spinner) {
		util.execute(code);
	}
	
	return 	$.ui.spinner;
});
