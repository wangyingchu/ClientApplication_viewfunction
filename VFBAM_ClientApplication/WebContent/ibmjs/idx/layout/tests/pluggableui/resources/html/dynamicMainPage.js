require([
	'dojo/parser',
	'dojo/dom',
	'dojo/dom-attr',
	'dojo/dom-style',
	'dojo/dom-construct',
	'dojo/topic',
	'dojo/aspect',
	'dojo/on',
	'dojo/store/Memory',
	'dijit/registry'
], function(parser, dom, domAttr, domStyle, domConstruct, topic, aspect, on, Memory, registry){

	var rootNode = dom.byId("dynamic_main_page");
	
	window.addNavigationItemHierarchical = function(){
        var dt = new Date(), flipCard = dijit.byId("flipcardNode");
        flipCard.addNavigationItem({
        	item: {
        		id: "newrootitem", 
        		name: "newrootitem", 
        		title: "New Root Item", 
        		type: "nav", 
        		children: []
        	}
    	});

        flipCard.addNavigationItem({
    	    item: {id: "newitem", name: "newitem", title: "New Item", type: "nav"},
    	    parent: {id: "newrootitem"},
    	    rootNavItem: {id: "newrootitem"}
    	});
	};
	
	window.addNavigationItem = function(){
		var headerContent = dom.byId("sample_grid_action").innerHTML.toString();
        var dt = new Date(), flipCard = dijit.byId("flipcardNode");
		flipCard.addNavigationItem({
			item: {
				id:"sample_nav" ,
                name:"sample_nav" ,
                title:"Added_Navigation",
                icon:"resources/images/blank.png",
                type:"nav"
			}
		},{
			props: {
				headerParams: {
					content: headerContent
				}
			},
			cntType: "grid",
			forceOverride: true
		});
		
		flipCard.addNavigationItem({
			item: {
				id:"sample_nav_2" + dt.getTime(),
                name:"sample_nav_2" + dt.getTime(),
                title:"Added_Navigation_2" + dt.getTime(),
                icon:"resources/images/blank.png", type:"nav"
			},
			parent: {id:"monitor"}, 
			insertIndex: 2, 
			rootNavItem: {id:"monitor"}
		},{});
	}
	
	window.removeNavigationItem = function(){
		var flipCard = dijit.byId("flipcardNode");
		flipCard.removeNavigationItem({
			itemId: "sample_nav"
		});
		
		flipCard.removeNavigationItem({
			itemId: "sample_nav_2",
			parent: {id:"monitor"},
			rootNavItem: {id:"monitor"}
		});
	}
	
	
});