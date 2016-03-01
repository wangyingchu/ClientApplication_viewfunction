define([
	"dojo/aspect",
	"dijit/registry", 
	"idx/layout/FlipCardContainer"  
],function( aspect, registry, FlipCardContainer ){
	var navigationParams = {
			identifier: "id",
			items: [
	        	{id:"welcome", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"monitor", name:"monitor", title:"Monitor", icon:"resources/images/blank.png", iconClass:"monitorIcon", type:"nav", children: [
					{id: "monitor_tasks", name:"monitor_tasks", title:"Monitor Tasks", type:"nav"},
					{id: "monitor_ways", name:"monitor_ways", title:"Monitor Ways", type:"separator"},
					{id: "monitor_common", name:"monitor_common", title:"Monitor Common", type:"nav"},
					{id: "monitor_special", name:"monitor_special", title:"Monitor Special", type:"nav", children:[
						{id: "monitor_specials", name:"monitor_specials", title:"Monitor Special Details", type:"separator"},
						{id: "monitor_special_1", name:"monitor_special_1", title:"Monitor Special Item 1", type:"nav"},
						{id: "monitor_special_2", name:"monitor_special_2", title:"Monitor Special Item 2", type:"nav"},
						{id: "monitor_special_3", name:"monitor_special_3", title:"Monitor Special Item 3", type:"nav"}
						// {id: "monitor_special_4", name:"monitor_special_4", title:"Monitor Special Item 4", type:"nav", children: [
							// {id: "monitor_deep_item_1", name:"monitor_deep_item_1", title:"Monitor Deep Item 1", type:"nav"},
							// {id: "monitor_deep_item_2", name:"monitor_deep_item_2", title:"Monitor Deep Item 2", type:"nav"},
						// ]}
					]}
				]},
				{id:"welcome1", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome2", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome3", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome4", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome5", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome6", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome7", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome8", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome9", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome10", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome11", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome12", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome13", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome14", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome15", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome16", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome17", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome18", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome19", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"welcome20", name:"welcome", title:"Welcome", icon:"resources/images/blank.png", containerClass:"welcomeContainer", iconClass:"welcomeIcon", descClass:"welcomeDesc", type:"nav"},
				{id:"analyze", name:"analyze", title:"Analyze", icon:"resources/images/blank.png", containerClass:"analyzeContainer", iconClass:"analyzeIcon", descClass:"analyzeDesc", type:"nav"},
				{id:"search", name:"search", title:"Search", icon:"resources/images/blank.png", iconClass:"searchIcon", type:"nav"},
				{id:"admin", name:"admin", title:"Administer", icon:"resources/images/blank.png", iconClass:"adminIcon", type:"nav", children: [
					{id: "admin_applications", name:"admin_applications", title:"Floating Layout", type:"nav"},
					{id: "admin_alert", name:"admin_alert", title:"Absolute Layout", type:"nav"},
					{id: "admin_cluster", name:"admin_cluster", title:"Cluster", type:"separator"},
					{id: "admin_nodes", name:"admin_nodes", title:"Nodes", type:"nav"},
					{id: "admin_services", name:"admin_services", title:"Services", type:"nav"},
					{id: "admin_data", name:"admin_data", title:"Data", type:"separator"},
					{id: "admin_protection", name:"admin_protection", title:"Protection", type:"nav"},
					{id: "admin_sets", name:"admin_sets", title:"Sets", type:"nav"},
					{id: "admin_sources", name:"admin_sources", title:"Sources", type:"nav"},
					{id: "admin_filesystem", name:"admin_filesystem", title:"File System", type:"nav"}
				]},
				{id:"user", name:"user", title:"User", icon:"resources/images/blank.png", iconClass:"userIcon", type:"settings", children: [
					{id: "user_savelayout", name:"user_savelayout", title:"Save FlipCard Layout", type:"settings", pressHandler:function(){this.saveFlipCard()}},
					{id: "user_savelayout", name:"user_savelayout", title:"Clear Saved FlipCard Layout", type:"settings", pressHandler:function(){this.clearFlipCard()}},
					{id: "flip_page_items", name:"flip_page_items", title:"Flip Cards in Current Page", type:"settings", pressHandler:function(){this.processFlipForCurrentPage()}}
				]},
				{id:"settings", name:"settings", title:"Settings", icon:"resources/images/blank.png", iconClass:"settingsIcon", type:"settings", pressHandler:function(){alert("Settings!")}},
				{id:"help", name:"help", title:"Help", icon:"resources/images/blank.png", iconClass:"helpIcon", type:"settings", children: [
					{id: "help_product", name:"help_product", title:"Product", type:"settings", pressHandler:function(){alert(this.flipCardModelId + "Product Help Settings")}},
					{id: "help_community", name:"help_community", title:"Community", type:"settings", pressHandler:function(){alert(this.flipCardModelId + "Product Help Settings")}}
				]}
			]
		},
		
		contentContainerListParams = {
			monitor_tasks: {name:"monitor_tasks", title:"Monitor Tasks", props: {nbZones: 3, 
				showContentHeader:true,
				headerParams: {
					content: "<div style='font-size:20px'>InfoSphere System Monitor</div>"
				}
			}, items:[]},
			monitor_common: {name:"monitor_common", title:"Monitor Common", props: {nbZones: 2, 
				showContentHeader:true,
				headerParams: {
					content: "<div style='font-size:20px'>System Monitor Common Page</div>"
				}
			}, items:[]},
			monitor_special: {name:"monitor_special", title:"Monitor Special", props: {nbZones: 1, 
				showContentHeader:true,
				headerParams: {
					href: "resources/html/samplePageHeader_simple.html"
				}
			}, items:[]},
			analyze: {name:"analyze", title:"analyze", props: {nbZones: 3, 
				showContentHeader:true,
				headerParams: {
					content: "<div style='font-size:20px'>Analysis Page</div>"
				}
			}, items:[]},
			search: {name:"search", title:"search", props: {nbZones: 5, 
				showContentHeader:true,
				headerParams: {
					href: "resources/html/samplePageHeader_simple.html"
				}
			}, items:[]},
			//floating flip card page layout
			admin_applications: {name:"admin_applications", title:"Floating Layout", props: {nbZones: 5, layoutMode: "floating"}, items:[]},
			//absolute flip card page layout
			admin_alert: {name:"admin_alert", title:"Absolute Layout", props: {nbZones: 6, layoutMode: "absolute"}, items:[]},
			admin_nodes: {name:"admin_nodes", title:"Nodes", props: {nbZones: 2}, items:[]},
			admin_services: {name:"admin_services", title:"Services", props: {nbZones: 2}, items:[]},
			admin_protection: {name:"admin_protection", title:"Protection", props: {nbZones: 2}, items:[]},
			admin_sets: {name:"admin_sets", title:"Sets", props: {nbZones: 2}, items:[]},
			admin_sources: {name:"admin_sources", title:"Sources", props: {nbZones: 2}, items:[]},
			admin_filesystem: {name:"admin_filesystem", title:"FileSystem", props: {nbZones: 2}, items:[]}
		},
		
		flipCard = null, 
		
		loadContainerParams = function(){
			for(var gItem in contentContainerListParams){
				for(var i = 0; i < 6; i++){
					var settingsDialog = {
						type: "dialog",
						title: "Settings in a Dialog",
						content: "<div style='margin-bottom:10px;'> Please add your config elements here </div>" + 
						 "<div><button onclick='portletDialogHandler(this)'>Switch Skin</button></div>"
					};
					var settingsBar = {
						type: "normal",
						content: "<div> Settings for main <button onclick='portletHandler(this)'>Switch Skin</button></div>"
					};
					
					var sampleMainContent = "<img alt='sample_image' src='resources/images/portlet" + (parseInt(Math.random()*10%6)) + ".png' style='width:100%; height: 100%'></div>" + 
											"<a role='button' tabindex='0'" + 
												"onclick='flipCardHandler(this)'" + 
												"onkeydown='if(event.keyCode == 13){flipCardHandler(this)}'" + 
												"style='position:absolute;top:30px;right:20px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:underline;color:blue'>" + 
												"detail" + 
											"</a>";
											
					var sampleDetailContent = "resources/html/flipCardContent.html";
					if(gItem == "monitor_tasks"){
						sampleMainContent = "<img src='resources/images/monitor_" + i + ".png' style='width:100%; height: 100%'></div>" + 
											"<a role='button' tabindex='0'" + 
												"onclick='flipCardHandler(this)'" + 
												"onkeydown='if(event.keyCode == 13){flipCardHandler(this)}'" + 
												"style='position:absolute;top:30px;right:20px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:underline;color:blue'>" + 
												"detail" + 
											"</a>";
											
						sampleDetailContent = "resources/html/monitorDetail_" + i + ".html";
					}
					
					var item = {
						name: contentContainerListParams[gItem].name + "_" + i,
						props: {
							maxable: true,
							stackable: true,
							// itemContentScroll: true,
							// flipableAction: true,
							main_props: {
								title: "Sample_" + contentContainerListParams[gItem].title + "_" + i,
								content: sampleMainContent,
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
								// settingsAction: settingsDialog
							},
							detail_props: {
								// titleHidden: true,
								title: "Detail_" + contentContainerListParams[gItem].title + "_" + i,
								href: sampleDetailContent,
								contentActions:[
									{id:"refresh", name:"refresh",label:"Refresh",type:"icon",actionClass:"refreshActionNode",pressHandler: function(){this.refreshCard()}},
									{id:"load", name:"load",label:"Load",type:"icon",actionClass:"loadActionNode",pressHandler: function(){this.set("href", "resources/html/flipCardContentChanged.html");}}
								],
								settingsAction: settingsBar
							}
						}
						
					};
					contentContainerListParams[gItem].items.push(item);
				}
			}
			
		},
		
		loadWelcomeParams = function(){
			//welcome page customization
			contentContainerListParams.welcome = {name:"welcome", title:"Welcome", props: {
					nbZones: 2,
					showContentHeader:true,
					//customized later
					// headerParams: {
						// content: "<div style='font-size:20px'>Welcome Page</div>"
					// }
				}, items:[]
			};
			contentContainerListParams.welcome.items.push({
				name: "welcome_growth",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "Sample_welcome_growth",
						href: "resources/html/welcomeGrowth.html"
					},
					detail_props: {
						title: "Detail_welcome_growth",
						href: "resources/html/welcomeDetail.html"
					}
				}
			});
			contentContainerListParams.welcome.items.push({
				name: "welcome_gdp",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "Sample_welcome_gdp",
						href: "resources/html/welcomeGDP.html"
					},
					detail_props: {
						title: "Detail_Sample_welcome_gdp",
						href: "resources/html/flipCardContent.html"
					}
				}
			});
			contentContainerListParams.welcome.items.push({
				name: "welcome_center",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "Sample_welcome_center_with_customized_actions",
						href: "resources/html/welcomeCenter.html",
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
						// titleHidden: true,
						title: "Sample_welcome_center_detail",
						href: "resources/html/welcomeCenterDetail.html",
						contentActions:[
							{id:"refresh", name:"refresh",label:"Refresh",type:"icon",actionClass:"refreshActionNode",pressHandler: function(){this.refreshCard()}},
							{id:"load", name:"load",label:"Load",type:"icon",actionClass:"loadActionNode",pressHandler: function(){this.set("href", "resources/html/flipCardContentChanged.html");}}
						]
					}
				}
			});
			contentContainerListParams.welcome.items.push({
				name: "welcome_population",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "Sample_welcome_population",
						href: "resources/html/welcomePopulation.html"
					},
					detail_props: {
						title: "Detail_Sample_welcome_population",
						href: "resources/html/flipCardContent.html"
					}
				}
			});
			contentContainerListParams.welcome.relations = {
				"welcome_center": ["welcome_growth","welcome_gdp","welcome_population"]
			};
			
		},
		
		loadRaveParams = function(){
			//d3js example 2
			contentContainerListParams.rave_example = {name:"rave_example", title:"rave Example", props: {nbZones: 2}, items:[]};
			contentContainerListParams.rave_example.items.push({
				name: "raveVariance",
				props: {
					maxable: true,
					stackable: true,
					style:"height:400px",
					main_props: {
						title: "raveVariance trend",
						href: "resources/html/raveVariance.html"
					}
				}
			});
			contentContainerListParams.rave_example.items.push({
				name: "raveCenter",
				props: {
					maxable: true,
					stackable: true,
					style:"height:400px",
					main_props: {
						title: "raveCenter",
						href: "resources/html/raveCenter.html"
					}
				}
			});
			contentContainerListParams.rave_example.items.push({
				name: "ravePopulation",
				props: {
					maxable: true,
					stackable: true,
					style:"height:400px",
					main_props: {
						title: "ravePopulation trend",
						href: "resources/html/ravePopulation.html"
					}
				}
			});
		},
		
		loadD3Params = function(){
			//embed d3js and rave
			navigationParams.items = navigationParams.items.concat([
				{id:"d3js_example", name:"d3js_example", title:"d3js Example", icon:"resources/images/blank.png", iconClass:"d3chartIcon", type:"nav"},
				{id:"rave_example", name:"rave_example", title:"rave Example", icon:"resources/images/blank.png", iconClass:"ravechartIcon", type:"nav"}
			]);
			
			contentContainerListParams.d3js_example = {name:"d3js_example", title:"d3js Example", props: {nbZones: 3}, items:[]};
			contentContainerListParams.d3js_example.items.push({
				name: "d3jsForce",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "d3jsForce",
						href: "resources/html/d3jsForce.html"
					}
				}
			});
			
			contentContainerListParams.d3js_example.items.push({
				name: "d3jsBarChart",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "d3jsBarChart",
						href: "resources/html/d3jsBarChart.html"
					}
				}
			});
			contentContainerListParams.d3js_example.items.push({
				name: "d3jsTrendDetail",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "d3js_File_Detail",
						href: "resources/html/d3jsTrendDetail.html"
					}
				}
			});
			contentContainerListParams.d3js_example.items.push({
				name: "d3jsCenter",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "d3jsCenter(File System TreeMap Navigation)",
						href: "resources/html/d3jsCenter.html"
					},
					detail_props: {
						title: "d3jsCenter(File System Tree Navigation)",
						href: "resources/html/d3jsCenterDetail.html"
					}
				}
			});
			contentContainerListParams.d3js_example.items.push({
				name: "d3jsTrend",
				props: {
					maxable: true,
					stackable: true,
					main_props: {
						title: "d3jsTrend",
						href: "resources/html/d3jsTrend.html"
					}
				}
			});
		},
		
		
		startLoading = function(){
			loadContainerParams();
			
			loadWelcomeParams();
			
			loadRaveParams();
			
			loadD3Params();
					
		},
		
		bindEvent = function(){
			portletHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).getParent();
				portlet.switchCardSkin("blueSkin");
			};
			portletDialogHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).parentWidget.getParent();
				portlet.switchCardSkin("blueSkin");
			};
			
			window.flipCardHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).getParent();
				portlet.processFlip();
			};
		},
		
		startup = function(){
			//init flipcard widget
			flipCard = new FlipCardContainer({
				navList: navigationParams,
				contentContainerList: contentContainerListParams,
				flipCardModelId: "myFlipCard",
                fcContainerExpanderWidth: "200px",
				// includeHeader: true,
				// fcContainerNavBarDisplayed: false,
				// initItemId: "welcome",
				model: "edit"
			}, "flipcardNode");
			flipCard.startup();
			
			
			//content header manipulate
			var headerContainer = flipCard.fcContentContainers["welcome"].headerContainer;
			if ( headerContainer )
				headerContainer.containerNode.innerHTML = 
				"<div style='font-size:20px'>Welcome Card Message Transfer Sample</div>";
			
		};
	
	/**
	 * Export some functions to the page 
	 */
	return {
		init: function() {
			startLoading();

			// register callback for when dependencies have loaded
			startup();
			
			bindEvent();

		}
	}
})