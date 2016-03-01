//build.bat profile=idxdojocompress.profile.js 
function timestamp(){
    // this function isn't really necessary...
    // just using it to show you can call a function to get a profile property value
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + "-" + d.getDate() + "-" +
    d.getHours() +
    ':' +
    d.getMinutes() +
    ":" +
    d.getSeconds();
}


var profile = {
    action: 'release',
    basePath: "../../../",
    releaseDir: "../../../idxdojocompress",
    buildTimestamp: timestamp(),
    cssOptimize: "comments",
    
    stripConsole: "all",
	//optimize: "shrinksafe",
	//layerOptimize: "shrinksafe",
	optimize: "closure",
    layerOptimize: "closure",
    selectorEngine: 'acme',
	defaultConfig:{
		hasCache:{
			"platform-plugable": 1,
			"desktop": 1
		},
		async:1
	},
	plugins: {
		"idx/has": "build/plugins/idx-has"
	},
	staticHasFeatures: {
		"dojo-bidi" : 0,
		"desktop": 1,
		"dojo-firebug":0,
		"platform-plugable": 1
	},
    packages: [{
        name: 'dojo',
        location: 'dojo',
        resourceTags: {
            ignore: function(filename, mid){
                return (/tests/.test(filename) || /demos/.test(filename));
            }
        }
    }, {
        name: 'dijit',
        location: 'dijit',
        resourceTags: {
            ignore: function(filename, mid){
                return (/tests/.test(filename) || /demos/.test(filename));
            }
        }
    }, {
        name: 'dojox',
        location: 'dojox',
        resourceTags: {
            ignore: function(filename, mid){
                return (/tests/.test(filename) || /demos/.test(filename));
            }
        }
    }, {
        name: 'gridx',
        location: '../ibmjs/gridx',
        resourceTags: {
            ignore: function(filename, mid){
                return (/tests/.test(filename) || /demos/.test(filename));
            }
        }
    }, {
        name: 'idx',
        location: '../ibmjs/idx',
        resourceTags: {
            ignore: function(filename, mid){
                return (/tests/.test(filename) || /demos/.test(filename));
            }
        }
    }],
    layers: {
		'idx/idx': {
			include: [
				'idx/app/AppFrame',
				'idx/app/AppMarquee',
				'idx/app/Header',
				'idx/app/HighLevelTemplate',
				'idx/app/LoginFrame',
				'idx/app/TabMenuLauncher',
	
				'dijit/layout/AccordionContainer',
				'idx/layout/BorderContainer',
				'idx/layout/BreadcrumbController',
				'idx/layout/HeaderPane',
				'idx/layout/TitlePane',
				'idx/layout/DockTabContainer',
				'idx/layout/MenuTabController',
				'idx/layout/MoveableTabContainer',
				'idx/layout/OpenMenuTabContainer',
				'idx/layout/ListNavController',
				'idx/layout/PartialListNavController',
				'idx/layout/SectionedNavController',
	
				'dijit/form/Button',
				'dijit/form/DropDownButton',
				'dijit/form/ComboButton',
				'dijit/form/ToggleButton',
				'idx/form/CheckBox',
				'idx/form/CheckBoxList',
				'idx/form/CheckBoxSelect',
				'idx/form/TriStateCheckBox',
				'idx/form/RadioButtonSet',
				'idx/form/Select',
				'idx/form/ComboBox',
				'idx/form/FilteringSelect',
				'idx/form/Link',
				'idx/form/ComboLink',
				'idx/form/DropDownLink',
				'idx/form/DropDownSelect',
				'dijit/form/SimpleTextarea',
				'idx/form/TextBox',
				'idx/form/Textarea',
				'idx/form/DropDownSelect',
				'dijit/form/SimpleTextarea',
				'idx/form/NumberSpinner',
				'idx/form/NumberTextBox',
				'idx/form/CurrencyTextBox',
				'idx/form/DateTextBox',
				'idx/form/TimeTextBox',	
				'idx/form/DateTimeTextBox',
				'idx/form/HorizontalSlider',
				'idx/form/VerticalSlider',
	
				'idx/widget/Banner',
				'idx/widget/Breadcrumb',
				'dijit/Calendar',
				'dijit/ColorPalette',
				'dijit/Editor',
				'idx/widget/CheckBoxTree',
				'idx/widget/EditController',
				'dijit/InlineEditBox',
				'dijit/ProgressBar',
				'dijit/Toolbar',
				'dijit/Tree',
				'idx/widget/Menu',
				'idx/widget/MenuBar',
				'idx/widget/ModalDialog',
				'idx/widget/NavTree',
				'idx/widget/ResizeHandle',
				'idx/widget/TypeAhead',
	
				'idx/widget/PersonCard',
				'idx/widget/HoverCard',
				'idx/widget/HoverHelp',
				'idx/widget/HoverHelpTooltip',
	
				'idx/widget/Dialog',
				'idx/widget/ModalDialog',
				'idx/widget/ConfirmationDialog',
				'idx/widget/SingleMessage',
				'idx/widget/Toaster',
					
				'gridx/Grid',
				'gridx/core/model/cache/Async',
				'idx/gridx/modules/dnd/Row',
				'idx/gridx/modules/dnd/Column',
				'idx/gridx/modules/dnd/Avatar',
				'idx/gridx/modules/filter/FilterBar',
				'idx/gridx/modules/filter/FilterPane',
				'idx/gridx/modules/filter/FilterDialogPane',
				'idx/gridx/modules/filter/QuickFilter',
				'idx/gridx/modules/pagination/GotoPagePane',
				'idx/gridx/modules/pagination/PaginationBar',
				'idx/gridx/modules/pagination/PaginationBarDD',
	
				'dojo/date/locale',
				'dojo/data/ItemFileReadStore',
				'dojo/data/ItemFileWriteStore',
				'dojo/dnd/Source',
				'dijit/layout/TabContainer',
				'dijit/layout/LinkPane',
				'dijit/layout/ContentPane',
				'dijit/PopupMenuBarItem',
				'dijit/MenuBarItem',
				'dijit/MenuItem',
				'dijit/form/MultiSelect',
				'dijit/_editor/plugins/TextColor', 
				'dijit/layout/AccordionContainer',
				'idx/dialogs'
			]
		},
		'gridx/gridx': {
			include: [
				'gridx/Grid',
				'gridx/GridCommon',
				'gridx/core/model/cache/Sync',
				'gridx/core/model/cache/Async',
				'gridx/core/model/extensions/FormatSort',
				'gridx/allModules',
				'gridx/support/exporter/toCSV',
				'gridx/support/menu/AZFilterMenu',
				'gridx/support/menu/NumberFilterMenu',
				'gridx/support/printer'
			]
		}
	}//end layers
};
