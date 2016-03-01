/**
 * After build done, move "portal" folder to NightlyBuild Root, 
 * move "idxResource" folder to NightlyBuild Root, and named as "idx" folder
 **/
var profile = (function(){
	
	var dojoVersion = "dojo_idt";
	
	return {
		releaseName: dojoVersion,
		basePath: "../../../",
		releaseDir: "../../../idxPortal",
		cssOptimize: "comments",
		stripConsole: "warn",
		selectorEngine: "lite",
		action: "release",
		//optimize: "shrinksafe",
		//layerOptimize: "shrinksafe",
		optimize: "closure",
		layerOptimize: "closure",
		copyTests: true,
		dirs: [
	       ["../", "../", /(\/\.)|(~$)/]
	    ],
		trees:[
	       //["../portal/resources", "../portal/resources", /(\/\.)|(~$)/ ]
	       //["../portal/resources/images", "../portal/resources/images", /(\/\.)|(~$)/],
	       //["../portal/resources/css", "../portal/resources/css", /(\/\.)|(~$)/]
	 	],
		packages: [{
	        name: "dojo",
	        location: "./dojo",
			destLocation: "./dojo"
	    },{
	        name: "dijit",
	        location: "./dijit",
			destLocation: "./dijit"
	    },{
	        name: "dojox",
	        location: "./dojox",
			destLocation: "./dojox"
	    },{
	        name: "gridx",
	        location: "../ibmjs/gridx",
			destLocation: "../ibmjs/gridx"
	    },{
	        name: "idx",
	        location: "../ibmjs/idx",
			destLocation: "../ibmjs/idx"
	    },{
	    	name: "jui",
	        location: "../ibmjs/jui",
			destLocation: "../ibmjs/jui"
	    },{
			name: "com",
			location: "../com",
			destLocation: "../com"
		},{
			name: "portal",
			location: "../portal",
			destLocation: "../portal"
		}],
		defaultConfig:{
			hasCache:{
				"platform-plugable": 1,
				"desktop": 1
			},
			async:1
		},
		staticHasFeatures: {
			"dojo-bidi" : 0,
			"dojo-firebug":0,
			"platform-plugable": 1,
			"desktop": 1
		},
		plugins: {
			"idx/has": "build/plugins/idx-has"
		},
		layers: {
	        "dojo/dojo": {
	            include: [
					"dojo/dojo",
					"dojo/ready",
					"dojo/dom-construct",
					"dojo/i18n",
					"dojo/domReady",
					"dojo/hash",
					"dojo/selector/acme",
					"dojo/request",
					"dojo/request/default"
				],
				customBase: true,
				boot: true
	        },
			"com/ibm/idxMain":{
				include: [
					"com/ibm/idxMain",
					"com/ibm/views/welcome/welcome"
				],
				exclude: [
					"dojo/dojo"
				]
			},
			"com/ibm/idxMultichannel":{
				include: [
					"idx/_PlatformPlugableMixin",
					"idx/_TemplatePlugableMixin",
					"com/ibm/views/multichannel/allMultichannelWidgets",
					"dojox/mobile/ValuePicker",
					"dojox/mobile/SpinWheel",
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
					"dojox/fx/flip",
					"dojox/fx/easing"
				],
				exclude: [
					"dojo/dojo"
				]
			},
			"com/ibm/views/widgetref/widgetref": {
	            include: [
					"com/ibm/views/widgetref/widgetref",
					"dojox/gfx/svg",
					"dojox/gfx/vml",
					"com/ibm/views/widgetref/widgetpg",
					"com/ibm/views/widgetref/allControllers"
				],
				exclude: [
					"dojo/dojo",
					"com/ibm/idxMain"
				]
	        },
			"com/ibm/views/mobile/mobile": {
	            include: [
					"com/ibm/views/mobile/mobile"
				],
				exclude: [
					"dojo/dojo",
					"com/ibm/idxMain"
				]
	        },
			"com/ibm/views/templates/templates": {
	            include: [
					"com/ibm/views/templates/templates",
					"idx/app/Header",
					"idx/widget/Menu",
					"idx/layout/MenuTabController",
					"dijit/MenuBarItem",
					"dijit/PopupMenuBarItem",
					"idx/widget/MenuBar",
					"idx/layout/FlipCardContainer"
				],
				exclude: [
					"dojo/dojo",
					"com/ibm/idxMain"
				]
	        },
			"com/ibm/views/multichannel/multichannel": {
	            include: [
					"com/ibm/views/multichannel/multichannel"
				],
				exclude: [
					"dojo/dojo",
					"com/ibm/idxMain"
				]
	        }
	    }
	};
})();
