var	fs = require("fs"), util = require("util"), exec = require("child_process").exec;

function BuildDeleter(/*String*/ path){
	this.rootPath = path;
}

BuildDeleter.prototype = {
	format: function(formatDate, formatString) {  
	    if(formatDate instanceof Date) {  
	        var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");  
	        var yyyy = formatDate.getFullYear();  
	        var yy = yyyy.toString().substring(2);  
	        var m = formatDate.getMonth() + 1;  
	        var mm = m < 10 ? "0" + m : m;  
	        var mmm = months[m];  
	        var d = formatDate.getDate();  
	        var dd = d < 10 ? "0" + d : d;  
	   
	        var h = formatDate.getHours();  
	        var hh = h < 10 ? "0" + h : h;  
	        var n = formatDate.getMinutes();  
	        var nn = n < 10 ? "0" + n : n;  
	        var s = formatDate.getSeconds();  
	        var ss = s < 10 ? "0" + s : s;  
	   
	        formatString = formatString.replace(/yyyy/i, yyyy);  
	        formatString = formatString.replace(/yy/i, yy);  
	        formatString = formatString.replace(/mmm/i, mmm);  
	        formatString = formatString.replace(/mm/i, mm);  
	        formatString = formatString.replace(/m/i, m);  
	        formatString = formatString.replace(/dd/i, dd);  
	        formatString = formatString.replace(/d/i, d);  
	        formatString = formatString.replace(/hh/i, hh);  
	        formatString = formatString.replace(/h/i, h);  
	        formatString = formatString.replace(/nn/i, nn);  
	        formatString = formatString.replace(/n/i, n);  
	        formatString = formatString.replace(/ss/i, ss);  
	        formatString = formatString.replace(/s/i, s);  
	   
	        return formatString;  
	    } else {  
	        return "";  
	    }  
	  
	} ,
	removeOldBuild: function(){
		console.log( "rootPath:" + this.rootPath );
		var self = this;
		var scanFiles = function (/*String*/ path ){
			
			var dirList = fs.readdirSync(path);
			var dateRange = new Date( (new Date()).getTime() - 30 * 24 * 60 * 60 * 1000 ),
				dateStr = self.format(dateRange, "yyyymmdd");
			console.log(dateStr);
			dirList.forEach(function(item){
				var currPath = path+'\\'+item;
				var fstat = fs.lstatSync(currPath);
				if ( fstat.isDirectory() && item != "nightly" ) {
					if ( item < dateStr ){
						var hasSymbolLink = false;
						fs.readdirSync(currPath).forEach(function(subItem){
							var currSubPath = currPath+"\\" + subItem;
							var subItemLstate = fs.lstatSync(currSubPath);
							if ( subItemLstate.isSymbolicLink() ){
								hasSymbolLink = true;
								(function(symbolLink, buildTarget){
									exec("junction -d "+ symbolLink).on("exit",function(){
										exec("rd /s/q "+ buildTarget).on("exit",function(){
											console.log("delete the buildTarget : "+ buildTarget);
										});
										
									});
								})(currSubPath, currPath);
							}
						});
						if ( !hasSymbolLink ){
							exec("rd /s/q "+ currPath).on("exit",function(){
								console.log("delete the buildTarget : "+ currPath);
							});
						}				
					}
				}
			});
			
		}
		
		if ( fs.existsSync(this.rootPath) ){
			scanFiles(this.rootPath);
		}
	}
};

var instance = null;
exports.initialize = function( path ){
	if ( !instance ){
		instance = new BuildFileChecker( path );
	}
	instance.rootPath = path;
	return instance;
};

var arguments = process.argv.splice(2);
if (arguments.length>0){
	var instance = new BuildDeleter(arguments[0]);
	instance.removeOldBuild();
}

