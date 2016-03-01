define(["jquery"],function($){
	
	return {
		/* Execute code text */
		execute: function(code){
			return eval(code);
		},
		/* HC mode check */
		isHighContrastMode: function(){
			var testDiv = $("<div>").attr("style", "border: 1px solid; border-color:red green; position: absolute; height: 5px; top: -999px;" +
				"background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');")
				.appendTo("body");
	
			var bkImg = testDiv.css("backgroundImage"),
				borderTopColor = testDiv.css("borderTopColor"),
				borderRightColor = testDiv.css("borderRightColor"),
				hc = (borderTopColor == borderRightColor) ||
					(bkImg && (bkImg == "none" || bkImg == "url(invalid-url:)" ));
	
			testDiv.remove();
	
			return hc;
		},
		/* RTL mode check */
		isRtlMode: function(){
			return ($("body").attr("dir") || $("html").attr("dir") || "").toLowerCase() === "rtl";
		},
		localize: function(nlsModulePath, locale, callback){
			if((!locale || typeof locale !== "string") && typeof navigator != "undefined"){
				// Default locale for browsers.
				locale = (navigator.language || navigator.userLanguage).toLowerCase();
			}
			if(locale){
				var temp = locale.split("-");
				if(temp[1]){
					locale = temp[0] + "-" + temp[1].toUpperCase();
				}else{
					locale = temp[0];
				}
				if(locale == "en" || locale == "en-US")return;
				try{
					
					require([nlsModulePath + "-" + locale], callback);
				}catch(e){
					console.warning("Locale " + locale + " is not provided yet.");
				}
				
			}
		}
	}
})
