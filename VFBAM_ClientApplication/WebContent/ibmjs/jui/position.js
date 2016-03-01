define([
"jquery",
"jui/util",
"text!jquery-ui/ui/jquery.ui.position.js",
"jui/core"
],function(jq, util, code){
	if (!$.ui.position) {
		util.execute(code);
	}
});
