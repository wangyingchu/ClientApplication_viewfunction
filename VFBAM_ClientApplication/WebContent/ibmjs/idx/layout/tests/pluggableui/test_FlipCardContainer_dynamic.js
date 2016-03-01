define([
	"dojo/dom", 
	"dojo/aspect", 
	"dijit/registry", 
	"idx/layout/FlipCardContainer"
], function( dom, aspect, registry, FlipCardContainer ){
	var contentContainerListParams = {
			welcome: {
				name:"welcome", 
				title:"Welcome", 
				type:"pane", 
				props: {
					nbZones: 2,
					showContentHeader:true,
					headerParams: {
						content: "<div style='font-size:20px'>Welcome Page !!</div>"
					},
					href: "resources/html/dynamicMainPage.html"
				}
			},
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
					href: "resources/html/samplePageHeader_widgets.html"
				}
			}, items:[]}
		},
		
		flipCard = null,
				
	
		startLoading = function(){
			for(var containerKey in contentContainerListParams){
				for(var i = 0, j=5; i < 6, j>=0; i++, j--){
					var sampleMainContent = "<img alt='sample_image' src='resources/images/portlet" + (parseInt(Math.random()*10%6)) + ".png' style='width:100%; height: 100%'></div>" + 
											"<a role='button' tabindex='0'" + 
												"onclick='flipCardHandler(this)'" + 
												"onkeydown='if(event.keyCode == 13){flipCardHandler(this)}'" + 
												"style='position:absolute;top:30px;right:20px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:underline;color:blue'>" + 
												"detail" + 
											"</a>";
										
					var sampleDetailContent = "resources/html/flipCardContent.html";
					if(containerKey == "monitor_tasks"){
						sampleMainContent = "<img alt='sample_image' src='resources/images/monitor_" + i + ".png' style='width:100%; height: 100%'></div>" + 
											"<a role='button' tabindex='0'" + 
												"onclick='flipCardHandler(this)'" + 
												"onkeydown='if(event.keyCode == 13){flipCardHandler(this)}'" + 
												"style='position:absolute;top:30px;right:20px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:underline;color:blue'>" + 
												"detail" + 
											"</a>";
						sampleDetailContent = "resources/html/monitorDetail_" + i + ".html";
					}
					
					var item = {
						name: contentContainerListParams[containerKey].name + "_" + i,
						//itemPosition: {column: j%3, p: i%2},
						props: {

							maxable: true,
							stackable: true,
							// itemContentScroll: true,
							// flipableAction: true,
							main_props: {
								title: "Sample_" + contentContainerListParams[containerKey].title + "_" + i,
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
							},
							detail_props: {
								// titleHidden: true,
								title: "Detail_" + contentContainerListParams[containerKey].title + "_" + i,
								href: sampleDetailContent,
								contentActions:[
									{id:"refresh", name:"refresh",label:"Refresh",type:"icon",actionClass:"refreshActionNode",pressHandler: function(){this.refreshCard()}},
									{id:"load", name:"load",label:"Load",type:"icon",actionClass:"loadActionNode",pressHandler: function(){this.set("href", "resources/html/flipCardContentChanged.html");}}
								]
							}
						}
					};
					if (containerKey == "analyze"){
						item["itemPosition"] = {column: j%3, p: i%2};
						if (item.itemPosition.column == 0) {
							if (item.itemPosition.p == 1) {
								item.itemPosition.p = 0;
							} 
							else {
								item.itemPosition.p = 1;
							}
						}
						console.log("item: " + item.name + ", column: " + item.itemPosition.column + ", p: " + item.itemPosition.p);
					}
					if(contentContainerListParams[containerKey].items){
						contentContainerListParams[containerKey].items.push(item);
					}
				}
			}
		},
		
		initUi = function(){
			flipCard = new FlipCardContainer({
				// navList: navigationParams,
				navList: "resources/data/nav_list_fc_dynamic.json",
                contentContainerList: contentContainerListParams,
				flipCardModelId: "myFlipCard",
				navType: "dynamic",
				includeHeader: true,
                navExpanderWidth: "300px",
                animationType: "slip",
				fcCntNavBarToggleAction: true,
				fcTitle: "Dynamic Pluggable UI (Customizable)",
				// fcContainerNavBarDisplayed: false,
				// initItemId: "welcome",
				// defaultCntContainerType: "grid",
				//css3AnimationDisabled_nav: true,
				//css3AnimationDisabled_container: true,
				//css3AnimationDisabled_card: true,
				//css3AnimationDisabled: true,
				model: "edit",
                navigationProps: {
                    navStyle: "tree",
                    showHoverNavItemDesc: true
                }
			}, "flipcardNode");
			flipCard.startup();
			console.log(flipCard.getMetadata());
			flipCard.buildDefaultCntContainer("load_metadata_as", {
				href: "resources/html/sampleFlipCardLoadAsPage.html",
				style: "display:none"
			}, "pane");
		},
		
		initEvent = function(){
			
			window.flipCardHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).getParent();
				portlet.processFlip();
			};	
			
			navSettingsActionHandler = function(item, e){
				switch(item.id){
					case "save_metadata_as":
						flipCard.saveMetadataAs();
						
						break;
					
					case "load_metadata_as":
						//TODO
						
						break;
						
					case "save_metadata":
						flipCard.saveMetadata();
						break;
					
					case "load_metadata":
						flipCard.loadMetadata();
						
						break;
						
					case "log_page_metadata":
						console.log(flipCard.currentCntContainer.getMetadata_Items());
						
						break;
						
					default:
						//TODO
						break;
				}
			}
            var navigator = flipCard.navigatorAdapter.instance;
			aspect.after( navigator, "handleSettingsAction_stub", navSettingsActionHandler, true);
			
			
			//fully custom nav action item
			navCustomActionHandler = function(item, e){
				switch(item.id){
					case "custom":
                        console.log("Fully Customized Nav Action");
                        var dt = new Date();
                        flipCard.addNavigationItem({
                            item: {
                                id:"sample_nav_2_Group_"+dt.getTime(), name:"sample_nav_2_Group_"+dt.getTime(), title:"Added_Navigation_2_Group", icon:"resources/images/blank.png", type:"nav"
                            },
                            parent: {id:"monitor_group"},
                            rootNavItem: {id:"monitor"}
                        },{});
                        break;
					default:
						//TODO
						break;
				}
			}
			aspect.after( navigator, "handleCustomAction_stub", navCustomActionHandler, true);
			
			
			
		},
		
		startup = function(){
			initUi();
			
			initEvent();		
			
			
		};
	/**
	 * Export some functions to the page 
	 */
	return {
		init: function() {
			startLoading();

			// register callback for when dependencies have loaded
			startup();

		},
		
		addCardItem: function(){
			flipCard.currentCntContainer.addCardItem({
				props: {
					maxable: true,
					stackable: true,
					closable: true,
					flipToDetailAction: true,
					main_props: {
						title: "Sample_Added_Main_Side",
						href: "resources/html/dynamicCardItem.html",
						contentActions:[
							{id:"card", name:"card", label:"Card",type:"text",pressHandler:function(){alert("Card Action!")}},
							{id:"help", name:"help", label:"Help",type:"text",pressHandler:function(){window.open("http://idx.ibm.com")}}
						]
					},
					detail_props: {
						title: "Sample_Added_Detail_Side",
						href: "resources/html/sampleAddedContent.html",
						contentActions:[
							{id:"refresh", name:"refresh",label:"Refresh",type:"icon",actionClass:"refreshActionNode",pressHandler: function(){this.refresh()}},
							{id:"load", name:"load",label:"Load",type:"icon",actionClass:"loadActionNode",pressHandler: function(){this.set("href", "resources/html/flipCardContentChanged.html");}}
						]
					}
				}
			});
		},
		
		addGridColumn: function(){
			flipCard.currentCntContainer.setColumns(flipCard.currentCntContainer.nbZones + 1);
		},
		
		shrinkGridColumn: function(){
			flipCard.currentCntContainer.setColumns(flipCard.currentCntContainer.nbZones - 1);
		},
		
		reOrganizeCardItems: function(){
			flipCard.currentCntContainer.reOrganizeChildren();
		}
	};
})