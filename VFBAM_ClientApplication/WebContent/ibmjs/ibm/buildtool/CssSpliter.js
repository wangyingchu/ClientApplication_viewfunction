var	fs = require("fs"), util = require("util");

function CssSpliter(/*String*/ filePath){
	this.filePath = filePath;
}

CssSpliter.prototype = {
	/**
	 * 
	 * @param {Object}  String filePath
	 */
	split: function(/*String*/ filePath){
		fs.readFile(filePath, function(err, data){
			var maxLenPerFile = 277 * 1024 ,
				iStart = 0, iEnd = data.length,
				len = iEnd - iStart,
				fd, iIndex = 0, fileName = "";
			if (maxLenPerFile > data.length)
				return false;
			
			for (var i=filePath.length - 1; i>0; i-- ){
				if (filePath.charAt(i) == "/" || filePath.charAt(i) == "\\") {
					console.log(i);
					fileName = filePath.slice(i+1);
					break;
				}
			}
			console.log("split css file " + fileName);
			var fileDir = filePath.slice(0, -fileName.length);
			
			
			var newFileName = "", fileList = [];
			while ( len > maxLenPerFile){
				iEnd = iStart + maxLenPerFile - 1;
				while ( data[iEnd] != '}'.charCodeAt(0)){
					iEnd--;
				}
				console.log(iEnd);
				newFileName = fileDir + "ie_" + iIndex +  fileName;
				fileList.push("ie_" + iIndex +  fileName);
				console.log(newFileName);
				fd = fs.openSync( newFileName , 'w+' );
				fs.writeSync(fd, data, iStart, iEnd- iStart + 1 );
				
				fs.closeSync(fd);
				iStart = iEnd + 1;
				len = data.length - iStart;
				iIndex++;
			}
			newFileName = fileDir +  "ie_" + iIndex + fileName;
			fileList.push("ie_" + iIndex +  fileName);
			fd = fs.openSync( newFileName, 'w+');
			fs.writeSync(fd, data, iStart, data.length - iStart );
			fs.closeSync(fd);
			
			var filePart = fileName.split(".");
			newFileName = fileDir + filePart[0] + "_ie." + filePart[1] ;
			fd = fs.openSync( newFileName, 'w+');
			for ( var i = 0; i < fileList.length; i++){
				fs.writeSync(fd, "@import url(\""+ fileList[i] + "\");\n" );
			}
			fs.closeSync(fd);
			return true;
		});
	},
	/**
	 * 
	 * @param {Object} String path
	 */
	scanCssFiles : function (/*String*/ path ){
		var pathState = fs.statSync( path ), fileCount = 0;
		if ( pathState.isFile() ){
			this.split( path );
			fileCount++;
		}
		else{
			var dirQueue = [path], head = 0, tail = dirQueue.length,  self = this;
			while ( head< tail){
				path = dirQueue[head];
				var dirList = fs.readdirSync(path);
				dirList.forEach(function(item){
					var currPath = path+'/'+item;
					var fstat = fs.statSync(currPath);
					if ( fstat.isFile() ){
						var iPos = item.indexOf(".css");
						if ( iPos == item.length - 4){
							if (self.split(currPath) )
								fileCount++;
						}
						
					}
					else if ( fstat.isDirectory() && item!='.' && item != '..'){
						dirQueue[tail++] = currPath;
					}
				});
				head++;
			}
		}
		
		console.log("split css file count = " + fileCount);

	}

};

var instance = null;
exports.initialize = function( path ){
	if ( !instance ){
		instance = new CssSpliter( path );
	}
	instance.filePath = path;
	return instance;
};

var arguments = process.argv.splice(2);
console.log(arguments);

if (arguments.length>0){
	var instance = new CssSpliter(arguments[0]);
	instance.scanCssFiles(arguments[0]);
}
