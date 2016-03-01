define([
	"dojo/dom", 
	"dojo/aspect", 
	"dijit/registry",
	"dijit/layout/BorderContainer",
	"idx/layout/FlipCardContainer",
	'idx/layout/FlipCardGridContainer'
], function(dom, aspect, registry, BorderContainer, FlipCardContainer, FlipCardGridContainer) {
	aspect.after(FlipCardGridContainer.prototype, 'onShow', function() {
		console.warn('in FlipCardGridContainer onShow');
	});
	aspect.after(FlipCardGridContainer.prototype, 'onHide', function() {
		console.warn('in FlipCardGridContainer onHide');
	});
	
	var contentContainerListParams = {
			welcome: {name:"welcome", title:"Welcome", type:"pane", props: {
				href: "resources/html/staticMainPage.html"
			}},
			analyze: {name:"analyze", title:"analyze", props: {nbZones: 3, 
				showContentHeader:false,
				headerParams: {
					content: "<div> Sample Analysis Page <div>"
				},
				maxItemSwitchMode: "tab",
				dockVisible: false,
				dockBehavior: "fixed"
			}, items:[]},
			
			heading_one_item_1: {name:"heading_one_item_1", title:"Heading One Item 1", props: {
				showContentHeader:true,
				headerParams: {
					content: "<div style='font-size:20px'>Sample Item 1</div>"
				},
				nbZones: 3,
				maxItemSwitchMode: "tab"
			}, items:[]},
			heading_one_item_2: {name:"heading_one_item_2", title:"Heading One Item 2", props: {
				showContentHeader:true,
				headerParams: {
					content: "<div style='font-size:20px'>Sample Item 2</div>"
				},
				nbZones: 2,
				maxItemSwitchMode: "tab"
			}, items:[]},
			heading_one_item_3: {name:"heading_one_item_3", title:"Heading One Item 3", props: {
				showContentHeader:true,
				headerParams: {
					href: "resources/html/samplePageHeader_simple.html"
				},
				nbZones: 1,
				maxItemSwitchMode: "tab"
			}, items:[]}
		}, 
		flipCard = null, 
		startup = function(){
			flipCard = new FlipCardContainer({
				//navList: navigationParams,
				navList: "resources/data/nav_list_fc_static.json",
				navigationProps: {
					toggleNavBarOnHover: false,
					// displayPersistenceIcon: false,
					displayCloseIcon: true
				},
				contentContainerList: contentContainerListParams,
				flipCardModelId: "myFlipCard_static",
				navType: "static",
				includeHeader: true,
				fcCntNavBarToggleAction: true,
				lazyLoading: true,
				//css3AnimationDisabled_nav: false,
				//css3AnimationDisabled_container: false,
				//css3AnimationDisabled_card: false,
				//css3AnimationDisabled: true,
				fcTitle: "Pluggable_UI",
				model: "edit"
			}, "flipcardNode");
			flipCard.startup();
		},
		
		startLoading = function(){
			for(var containerKey in contentContainerListParams){
				for(var i = 0; i < 6; i++){
					var sampleMainContent = "<img src='resources/images/portlet" + (parseInt(Math.random()*10%6)) + ".png' style='width:100%; height: 100%'></div>" + 
											"<a role='button' tabindex='0'" + 
												"onclick='flipCardHandler(this)'" + 
												"onkeydown='if(event.keyCode == 13){flipCardHandler(this)}'" + 
												"style='position:absolute;top:30px;right:20px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:underline;color:blue'>" + 
												"detail" + 
											"</a>";
											
					var sampleDetailContent = "resources/html/flipCardContent.html";
					if(containerKey == "monitor_tasks"){
						sampleMainContent = "<img alt='sample_image' alt='sample_image' src='resources/images/monitor_" + i + ".png' style='width:100%; height: 100%'></div>" + 
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
						props: {
							maxable: true,
							stackable: true,
							initItemStatus: i==0?"max":"normal",
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
					
					if(contentContainerListParams[containerKey].items){
						contentContainerListParams[containerKey].items.push(item);
					}
				}
			}
		};

	bindEvent = function(){
		window.flipCardHandler = function(context){
			var portlet = registry.getEnclosingWidget(context).getParent();
			portlet.processFlip();
		};
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