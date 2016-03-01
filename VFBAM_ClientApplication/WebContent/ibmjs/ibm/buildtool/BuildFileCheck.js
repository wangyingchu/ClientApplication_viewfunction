var	fs = require("fs"), util = require("util");

function BuildFileChecker(/*String*/ path){
	this.rootPath = path;
}

BuildFileChecker.prototype = {
	removeUncompressedFile: function(){
		console.log( "rootPath:" + this.rootPath );
		var scanFiles = function (/*String*/ path ){
			var dirQueue = [path], head = 0, tail = dirQueue.length, fileCount = 0;
			while ( head< tail){
				path = dirQueue[head];
				var dirList = fs.readdirSync(path);
				dirList.forEach(function(item){
					var currPath = path+'/'+item;
					var fstat = fs.statSync(currPath);
					
					if ( fstat.isFile() ){
						var iPos = item.indexOf("uncompressed.js");
						if ( iPos == item.length - 15){
							fs.unlink( currPath, null );
							fileCount++;
						}
						
					}
					else if ( fstat.isDirectory() && item!='.' && item != '..'){
						dirQueue[tail++] = currPath;
					}
				});
				head++;
			}
			console.log("remove uncompressed file Count = "+fileCount);

		}
		
		if ( fs.existsSync(this.rootPath) ){
			scanFiles(this.rootPath);
		}
	},
	checkFiles: function(){
		console.log( "rootPath:" + this.rootPath );
		var walkNode = function (/*String*/ path ){
			var dirQueue = [path], head = 0, tail = dirQueue.length, fileCount = 0, errorFileCount = 0;
			while ( head< tail){
				path = dirQueue[head];
				var dirList = fs.readdirSync(path);
				dirList.forEach(function(item){
					var currPath = path+'/'+item;
					var fstat = fs.statSync(currPath);
					
					if ( fstat.isFile() ){
						fileCount++;
						if (fstat.size <= 10 && fstat.size > 2){
							errorFileCount++
							console.log("file:" + currPath + "\n");
						}
			
					}
					else if ( fstat.isDirectory() && item!='.' && item != '..'){
						dirQueue[tail++] = currPath;
					}
				});
				head++;
			}
			console.log("Number of File : "+fileCount + " , Number of Error File : "+ errorFileCount);

		}
		
		if ( fs.existsSync(this.rootPath) ){
			walkNode(this.rootPath);
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
