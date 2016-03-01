var profile = (function(){
	
	var isTest = function(filename, mid){
			return /\/tests\//.test(filename) ||
				/\/demos\//.test(filename) ||
				/lessTests/.test(mid);
		},
		
		isCopyOnly = function(filename, mid){
			var list = {
				"idx/idx.profile":1,
				"idx/package.json":1,
				"idx/themes/dlBlue/dijit/compile": 1
			};
			
			var dlPathRegex = /idx\/themes\/dlBlue\//i,
				isInDlTheme = dlPathRegex.test( mid );
			
			var isDlBlueForIE = /dlBlue_ie\.css/i.test( filename ); 
			return (mid in list) || isDlBlueForIE ||
				isTest(filename, mid) ||
				/(png|jpg|jpeg|gif|tiff)$/.test(filename)||
				/idx\/themes\/oneuiLess/.test(mid);
		},

		ignore = function(filename, mid){
			return false;
		},
		isAMD = function(filename, mid){
			return !isTest(filename, mid) &&
				!isCopyOnly(filename, mid) &&
				/\.js$/.test(filename) &&
				!/oneuiLess/.test(mid);
		};

	return {
		resourceTags:{
			test: isTest,
			copyOnly: isCopyOnly,
			amd: isAMD,
			ignore: ignore
		}
	};
})();
