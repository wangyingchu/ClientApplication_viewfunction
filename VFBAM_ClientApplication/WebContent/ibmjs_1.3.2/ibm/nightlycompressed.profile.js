//build.bat profile=idxdojocompress.profile.js 
function timestamp(){
    // this function isn't really necessary...
    // just using it to show you can call a function to get a profile property value
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + "-" + d.getDate() + "-" +
        d.getHours() + ':' + d.getMinutes() + ":" + d.getSeconds();
}


var profile = {
 releaseDir: "../../../../../../idxdojocompress",
 action: 'release',
 buildTimestamp: timestamp(),
 cssOptimize: "comments",
 optimize: "shrinksafe",
 stripConsole: "all",
 layerOptimize: "shrinksafe",
 selectorEngine: 'acme',
 packages: [
		{
			name: 'dojo',
			location: '../../../dojo',
			resourceTags: {

			}			
		},
		{
			name: 'dijit',
			location: '../../../dijit',
			resourceTags: {

			}
		},
		{
			name: 'dojox',
			location: '../../../dojox',
			resourceTags: {

			}
		},
		{
			name: 'gridx',
			location: '../../../gridx',
			resourceTags: {

			}
		},
		{
			name: 'idx',
			location: '../../../../ibmjs/idx', 
			resourceTags: {

			}
		}
 ],
 layers: {
 }//end layers
};
