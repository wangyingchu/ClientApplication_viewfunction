define([
"jquery",
"jui/util",
"text!jquery-ui/ui/jquery.ui.widget.js"
],function(jq, util, code){
	if (!$.widget) {
		util.execute(code);
	}
	
});