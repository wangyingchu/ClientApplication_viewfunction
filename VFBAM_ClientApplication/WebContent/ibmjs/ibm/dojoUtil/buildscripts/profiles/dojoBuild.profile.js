//build.bat profile=oneuidemos.profile.js -r 

function timestamp(){
    // this function isn't really necessary...
    // just using it to show you can call a function to get a profile property value
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + "-" + d.getDate() + "-" +
        d.getHours() + ':' + d.getMinutes() + ":" + d.getSeconds();
}

var profile = {
	basePath: "../../../",
	releaseDir: "../dojoBuild",
	buildTimestamp: timestamp(),
	cssOptimize: "comments",
	optimize: "shrinksafe",
	layerOptimize: "shrinksafe",
	stripConsole: "all",
	selectorEngine: 'lite',
	mini: false,
	defaultConfig: {
		hasCache: {
			"dojo-built": 1,
			"dojo-loader": 1,
			"dom": 1,
			"host-browser": 1,
			"dojo-bidi": 1,
			"config-selectorEngine": "lite"
		},
		async: 1
	},
    staticHasFeatures: {
        "config-deferredInstrumentation": 0,
        "config-dojo-loader-catches": 0,
        "config-tlmSiblingOfDojo": 1,
        "dojo-amd-factory-scan": 0,
        "dojo-combo-api": 0,
        "dojo-config-api": 1,
        "dojo-config-require": 0,
        "dojo-debug-messages": 0,
        "dojo-dom-ready-api": 1,
        "dojo-firebug": 0,
        "dojo-guarantee-console": 1,
        "dojo-has-api": 1,
        "dojo-inject-api": 1,
        "dojo-loader": 1,
        "dojo-log-api": 0,
        "dojo-modulePaths": 0,
        "dojo-moduleUrl": 0,
        "dojo-publish-privates": 0,
        "dojo-requirejs-api": 0,
        "dojo-sniff": 1,
        "dojo-sync-loader": 0,
        "dojo-test-sniff": 0,
        "dojo-timeout-api": 0,
        "dojo-trace-api": 0,
        "dojo-undef-api": 0,
        "dojo-v1x-i18n-Api": 1,
        "dom": 1,
        "host-browser": 1,
        "extend-dojo": 1
    },
	packages: [
		{
			name: 'dojo',
			location: './dojo',
			resourceTags: {
				ignore: function(filename, mid){
					return (/tests/.test(filename) || /demos/.test(filename) );
				}
			}			
		},
		{
			name: 'dijit',
			location: './dijit',
			destLocation: "./dijit",
			resourceTags: {
				ignore: function(filename, mid){
					return (/tests/.test(filename) || /demos/.test(filename) );
				}
			}
		},
		{
			name: 'dojox',
			location: './dojox',
			destLocation: "./dojox",
			resourceTags: {
				ignore: function(filename, mid){
					return (/tests/.test(filename) || /demos/.test(filename) );
				}
			}
		},
		{
			name: "ibm",
	        location: "../ibmjs/ibm",
			destLocation: "../ibmjs/ibm",
			resourceTags:{
				ignore: function(filename,mid){
					return true;
				}
			}
		},
		{
			name: "idx",
	        location: "../ibmjs/idx",
			destLocation: "../ibmjs/idx",
			resourceTags:{
				ignore: function(filename,mid){
					return true;
				}
			}
		}
	],
	layers: {
		'dojo/dojo':{
			include: [
				'dojo/_base/fx',
				'dojo/dom-form',
				'dojo/i18n',
				'dojo/promise/tracer',
				'dojo/errors/RequestError',
				'dojo/_base/html',
				'dojo/_base/kernel',
				'dojo/io-query',
				'dojo/_base/Deferred',
				'dojo/NodeList-dom',
				'dojo/query',
				'dojo/has',
				'dojo/_base/loader',
				'dojo/json',
				'dojo/_base/declare',
				'dojo/dom',
				'dojo/_base/browser',
				'dojo/selector/acme',
				'dojo/selector/lite',
				'dojo/errors/RequestTimeoutError',
				'dojo/dom-geometry',
				'dojo/dom-style',
				'dojo/dom-prop',
				'dojo/when',
				'dojo/dom-attr',
				'dojo/dom-construct',
				'dojo/request/xhr',
				'dojo/text',
				'dojo/keys',
				'dojo/domReady',
				'dojo/_base/lang',
				'dojo/request/util',
				'dojo/Evented',
				'dojo/mouse',
				'dojo/_base/xhr',
				'dojo/topic',
				'dojo/loadInit',
				'dojo/dojo',
				'dojo/_base/unload',
				'dojo/Deferred',
				'dojo/_base/NodeList',
				'dojo/_base/Color',
				'dojo/promise/instrumentation',
				'dojo/selector/_loader',
				'dojo/promise/Promise',
				'dojo/request/watch',
				'dojo/on',
				'dojo/_base/sniff',
				'dojo/errors/create',
				'dojo/_base/array',
				'dojo/_base/json',
				'dojo/_base/window',
				'dojo/dom-class',
				'dojo/_base/config',
				'dojo/main',
				'dojo/_base/event',
				'dojo/sniff',
				'dojo/request/handlers',
				'dojo/aspect',
				'dojo/ready',
				'dojo/_base/connect',
				'dojo/errors/CancelError',
				'dojo/data/ItemFileReadStore',
				'dojo/data/ItemFileWriteStore',
				'dojo/Stateful',
				'dojo/_base/url',
				'dojo/string',
				'dojo/hash',
				'dojo/DeferredList',
				'dojo/NodeList-traverse',
				'dojo/_base/query'
			],
			customBase: true,
			boot: true
		},
		"dijit/dijit-all":{
			include: [
				"dijit/dijit",
				"dijit/_BidiSupport",
				"dijit/tree/ObjectStoreModel",
				"dijit/_BidiMixin",
				"dijit/dijit-all",
			],
			exclude: [
				"dojo/dojo"
			]
		},
		"dojox/main": {
			include: [
				"dojox/main",
				"dojox/grid/TreeGrid",
				"dojox/grid/_TreeView",
				"dojox/layout/ContentPane",
				"dojox/html/_base",
				"dojox/mobile/common",
				"dojox/mobile/compat",
				"dojox/mobile/_compat",
				"dojox/mobile/mobile-all",
				"dojox/mobile/bidi/Badge",
				"dojox/mobile/bidi/Switch",
				"dojox/mobile/bidi/IconItem",
				"dojox/mobile/bidi/_ItemBase",
				"dojox/mobile/bidi/ToolBarButton",
				"dojox/mobile/bidi/Heading",
				"dojox/mobile/bidi/ListItem",
				"dojox/mobile/bidi/SpinWheelSlot",
				"dojox/mobile/bidi/Tooltip",
				"dojox/fx/scroll",
				"dojox/grid/bidi/_BidiMixin",
				"dojox/highlight/languages/_all",
				"dojox/highlight/widget/Code",
				"dojox/highlight/languages/pygments/_www",
				"dojox/highlight/languages/pygments/html",
				"dojox/highlight/languages/pygments/javascript",
				"dojox/widget/FisheyeListItem",
				"dojox/widget/FisheyeList",
				"dojox/widget/AutoRotator",
				"dojox/widget/rotator/Controller",
				"dojox/widget/rotator/Fade",
				"dojox/widget/rotator/Pan",
				"dojox/widget/Standby",
				"dojox/timing/doLater",
				"dojox/image/Magnifier",
				"dojox/image/MagnifierLite",
				"dojox/layout/TableContainer",
				"dojox/gfx/svg",
				"dojox/dtl/Context",
				"dojox/dtl/tag/logic",
				"dojox/dtl/_base",
				"dojox/html/ellipsis",
				"dojox/html/entities"
				
			],
			exclude: [
				"dojo/dojo",
				"dijit/dijit-all"
			]
		}
	}//end layers
    //end transformJobs
};
