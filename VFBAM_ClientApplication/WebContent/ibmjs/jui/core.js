define([
"jquery",
"jui/util",
"text!jquery-ui/ui/jquery.ui.core.js"
],function($, util, code){
	if (!$.ui) {
		util.execute(code);
	}
	
	$(function(){
		if(util.isHighContrastMode()){
			$("body").addClass("jui-a11y");
		}
		if(util.isRtlMode()){
			$("body").addClass("jui-rtl");
		}
	})
});
