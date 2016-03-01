define([
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dijit/registry", 
	"idx/layout/FlipCardContainer",  
],function( lang, registry, FlipCardContainer ){
	var navigationParams = {
			identifier: "id",
			items: [
				{id:"welcome", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"analyze", name:"analyze", title:"Analyze", icon:"resources/images/blank.png", containerClass:"analyzeContainer", iconClass:"analyzeIcon", descClass:"analyzeDesc", type:"nav"},
				{id:"search", name:"search", title:"Search", icon:"resources/images/blank.png", iconClass:"searchIcon", type:"nav"},
				{id:"monitor", name:"monitor", title:"Monitor", icon:"resources/images/blank.png", iconClass:"monitorIcon", type:"nav", children: [
					{id: "monitor_tasks", name:"monitor_tasks", title:"Monitor Tasks", type:"nav"},
					{id: "monitor_ways", name:"monitor_ways", title:"Monitor Ways", type:"separator"},
					{id: "monitor_common", name:"monitor_common", title:"Monitor Common", type:"nav"},
					{id: "monitor_special", name:"monitor_special", title:"Monitor Special", type:"nav"}
				]},
				{id:"settings", name:"settings", title:"Settings", icon:"resources/images/blank.png", iconClass:"settingsIcon", type:"settings", pressHandler:function(){alert("Settings!")}},
				{id:"help", name:"help", title:"Help", icon:"resources/images/blank.png", iconClass:"helpIcon", type:"settings", children: [
					{id: "help_product", name:"help_product", title:"Product", type:"settings", pressHandler:function(){alert(this.flipCardModelId + "Product Help Settings")}},
					{id: "help_community", name:"help_community", title:"Community", type:"settings", pressHandler:function(){alert(this.flipCardModelId + "Product Help Settings")}}
				]}
				//{id:"save", name:"save", title:"Save", icon:"resources/images/save.png", iconClass:"saveIcon", type:"settings"}
			]
		},
		
		//grid content data
		paneItemListParams = {
			welcome: {name:"welcome", title:"Welcome"},
			analyze: {name:"analyze", title:"Analyze"},
			search: {name:"search", title:"Search"}
		},
		
		contentContainerListParams = {
			monitor_tasks: {name:"monitor_tasks", title:"Monitor Tasks", items:[]},
			monitor_common: {name:"monitor_common", title:"Monitor Common", items:[]},
			monitor_special: {name:"monitor_special", title:"Monitor Special", items:[]}
		},
		
		flipCard = null,
		
		startLoading = function(){
			var j = 0;
			for(var cItem in paneItemListParams){
				//set container type: different from grid container with flip-able card inside
				paneItemListParams[cItem].type = "pane";
				
				switch(j++%3){
					case 0:
						paneItemListParams[cItem].props = {content: "<img alt='sample_image' src='resources/images/portlet" + (j%6) + ".png' style='width:100%; height: 100%'></div>"};
						break;
					case 1:
						// Test iframe in FlipCard, can not use the dojo page in the same domain, to fix this defect
						//paneItemListParams[cItem].props = {content: "<iframe src='test_ContentPane.html' style='border:none;width:98%;height:97%;overflow:auto' frameborder='0' scrolling='no'></div>"};
						paneItemListParams[cItem].props = {content: "<iframe src='http://idx.ibm.com' style='border:none;width:98%;height:97%;overflow:auto' frameborder='0' scrolling='no'></div>"};
						break;
					case 2:
						paneItemListParams[cItem].props = {href: "resources/html/flipCardContainerContent.html"};
						break;
					default:
						break;
				}
			}
			
			for(var gItem in contentContainerListParams){
				for(var i = 0; i < 6; i++){
					var item = {
						name: contentContainerListParams[gItem].name + "_" + i,
						props: {
							maxable: true,
							stackable: true,
							// itemContentScroll: true,
							main_props: {
								title: "Sample_" + contentContainerListParams[gItem].title + "_" + i,
								content: "<img alt='sample_image' src='resources/images/portlet" + (parseInt(Math.random()*10%6)) + ".png' style='width:100%; height: 100%'></div>" + 
											"<a role='button' tabindex='0'" + 
												"onclick='flipCardHandler(this)'" + 
												"onkeydown='if(event.keyCode == 13){flipCardHandler(this)}'" + 
												"style='position:absolute;top:30px;right:20px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:underline;color:blue'>" + 
												"detail" + 
											"</a>",
								contentActions:[
									{id:"file", name:"file", label:"File",type:"text",children:[
										{id:"new", name:"new", label:"New",pressHandler:function(){alert("New Card!")}},
										{id:"open", name:"open", label:"Open",pressHandler:function(){alert("Open Card!")}},
										{id:"exit", name:"exit", label:"Exit",pressHandler:function(){alert("Exit Card!")}}
									]},
									{id:"edit", name:"edit", label:"Edit",type:"text",children:[
										{id:"copy", name:"copy", label:"Copy",pressHandler:function(){alert("Copy Card!")}},
										{id:"paste", name:"paste", label:"Paste",pressHandler:function(){alert("Paste Card!")}}
									]},
									{id:"card", name:"card", label:"Card",type:"text",pressHandler:function(){alert("Card Action!")}},
									{id:"help", name:"help", label:"Help",type:"text",pressHandler:function(){window.open("http://idx.ibm.com")}}
								]
							},
							detail_props: {
								title: "Detail_" + contentContainerListParams[gItem].title + "_" + i,
								href: "resources/html/flipCardContent.html",
								contentActions:[
									{id:"refresh", name:"refresh",label:"Refresh",type:"icon",actionClass:"refreshActionNode",pressHandler: function(){this.refreshCard()}},
									{id:"load", name:"load",label:"Load",type:"icon",actionClass:"loadActionNode",pressHandler: function(){this.set("href", "resources/html/flipCardContentChanged.html");}}
								]
							}
						}
						
					};
					// if(i == 0){
						// item.props.initItemStatus = "max";
					// }
					contentContainerListParams[gItem].items.push(item);
				}
			}
		},
		

		
		startup = function(){
			var fcItemContainer = lang.mixin({}, 
				paneItemListParams,
				contentContainerListParams
			);
				
			//init flipcard widget
			flipCard = new FlipCardContainer({
				navList: navigationParams,
				// navType: "dynamic",
				contentContainerList: fcItemContainer,
				flipCardModelId: "myFlipCard"
			}, "flipcardNode");
			flipCard.startup();
		};
	
	/**
	 * Export some functions to the page 
	 */
	return {
		init: function() {
			startLoading();

			// register callback for when dependencies have loaded
			startup();

		}
	}
})