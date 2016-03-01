//command: node BuildFileCheck_RunChecker.js "Folder Path"
var buildFileCheck = require("./BuildFileCheck");
//var process = require("process");
var arguments = process.argv.splice(2);
if (arguments.length>0){
	var buildFileCheckInstance = buildFileCheck.initialize(arguments[0]);
	buildFileCheckInstance.checkFiles();
}