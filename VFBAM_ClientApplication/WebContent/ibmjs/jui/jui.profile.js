var profile = (function(){
	
	var isTest = function(filename, mid){
			return /\/tests\//.test(filename) ||
				/\/demos\//.test(filename) ||
				/lessTests/.test(mid);
		},
		
		isCopyOnly = function(filename, mid){
			return true;
		},

		ignore = function(filename, mid){
			return false;
		},
		isAMD = function(filename, mid){
			return false;
		};

	return {
		resourceTags:{
			copyOnly: isCopyOnly
		}
	};
})();
