define([
"text!jquery-ui/ui/jquery.ui.dialog.js",
"jui/util",
"jui/core",
"jui/widget",
"jui/button",
"jui/draggable",
"jui/mouse",
"jui/position",
"jui/resizable",
],function(code, util){
	if (!$.ui.dialog) {
		util.execute(code);
	}
	$.ui.dialog.nls = {}
	
	$.widget( "ui.dialog", $.ui.dialog, {
		options: {
			modal: true,
			autoOpen: false,
			closeText: "Close",
			dialogClass: "jui-dialog",
			locale: ""
		},
		_create: function(){
			this._superApply(arguments);
			this.localize(this.options.locale);
		},
		_setOption: function(key, value){
			this._superApply(arguments);
			if(key === "locale"){
				this.localize(value);
			}
		},
		localize: function(locale){
			var _this = this;
			if(typeof require === "undefined" || !$.isFunction(require)){
				$.ui.dialog.nls[locale] && 
				$.each($.ui.dialog.nls[locale], function(key, value){
					_this._setOption(key, value);
				});
			}else{
				util.localize("jui/i18n/jquery.ui.dialog", locale, function(){
					$.each($.ui.dialog.nls, function(key, value){
						_this._setOption(key, value);
					});
				});
			}
		}
	});
	
	return $.ui.dialog;
});

