define([
	"jui/core",
	"jui/widget",
	"jui/util",
	"text!jquery-ui/ui/jquery.ui.progressbar.js"
], function( core, widget, util, code ){
	if (!$.ui.progressbar) {
		util.execute(code);
	}
	
	$.widget( "ui.progressbar", $.ui.progressbar, {
		_create: function(){
			this._superApply(arguments);
			this.element.addClass("jui");
			this.element.removeClass("ui-corner-all");
			
			var ariaAttr = {};
			if ( this.options["aria-labelledby"] ) {
				ariaAttr["aria-labelledby"] = this.options["aria-labelledby"];
			}
			else if ( this.options["aria-label"] ){
				ariaAttr["aria-label"] = this.options["aria-label"];
			}
			else{
				ariaAttr["aria-label"] = "Aria Label For Progressbar";
			}

			this.element.attr(ariaAttr);
		}
	});
	
	return $.ui.progressbar;
});
