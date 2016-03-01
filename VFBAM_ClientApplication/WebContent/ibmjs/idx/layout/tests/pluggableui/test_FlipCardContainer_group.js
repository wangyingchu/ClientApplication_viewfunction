define([
	"dojo/dom", 
	"dojo/aspect", 
	"dojo/request/xhr",
	"dojo/promise/all",
	"dojo/_base/json",
	"dijit/registry", 
	"idx/widget/Banner",
	"idx/layout/FlipCardContainer" 
], function(dom, aspect, xhr, all, json, registry, Banner, FlipCardContainer){
	var contentContainerListParams = {
			monitor_widget_pane: {name:"monitor_widget_pane", title:"monitor_widget_pane", type:"pane", props: {
				widgetClass: "dijit/TitlePane",
				widgetParams: {
					title:"widget initialization", 
					toggleable: true, 
					content:"this is a widget initialization test."
				}
			}},
			monitor_widget_grid: {
				name:"monitor_widget_grid", 
				title:"monitor_widget_grid", 
				props: {
					dockBehavior: "fixed",
					dockOverlay: false,
					nbZones: 3, 
					showContentHeader:true,
					headerParams: {
						widgetClass: Banner,
						widgetParams: {
							username:"banner", 
							usernameLabel:"banner widget", 
							helpFunc: function() { alert('Help'); }, 
							aboutFunc: function() { alert('About'); },
							logoutFunc: function() { alert('Log out'); }
						}
					}
				}, 
				items:[
				{
					name: "flip_card_widget_sample_1",
					props: {
						maxable: true,
						stackable: true,
						actionsInMainSide: true,
						main_props: {
							title: "flip_card_widget_sample_content_1",
							widgetClass: "dijit/ColorPalette",
							widgetParams: {palette: "3x4"},
							contentActions:[
								{id:"card", name:"card", label:"Card",type:"text",pressHandler:function(){alert("Card Action!")}},
								{id:"help", name:"help", label:"Help",type:"text",pressHandler:function(){window.open("http://idx.ibm.com")}}
							]
						}
					}
				},
				{
					name: "flip_card_widget_sample_2",
					props: {
						maxable: true,
						stackable: true,
						actionsInMainSide: true,
						main_props: {
							title: "flip_card_widget_sample_content_2",
							widgetClass: "dijit/Calendar",
							widgetParams: {},
							contentActions:[
								{id:"card", name:"card", label:"Card",type:"text",pressHandler:function(){alert("Card Action!")}},
								{id:"help", name:"help", label:"Help",type:"text",pressHandler:function(){window.open("http://idx.ibm.com")}}
							]
						}
					}
				}
			]}
		},
		
		flipCard = null,
		
		startLoading = function(){
		
		},
		
				
		startup = function(){
			//init flipcard widget
			flipCard = new FlipCardContainer({
				// navList: navigationParams,
				navList: "resources/data/nav_list_fc_group.json",
				navigationProps: {
					toggleNavBarOnHover: false,
					ignoreInitHash:true,
					displayPersistenceIcon: false,
					displayCloseIcon: false,
					toggleNavDetailItemOnHover: true,
					navBarExtendedInitial: true,
					// showHoverNavItemDesc: true,
					// initItemId: "setup_domainbuilder",
					navStyle: "tree"
				},
				// initItemId: "analyze_2_2_2",
				contentContainerList: contentContainerListParams,
				flipCardModelId: "myFlipCard_group",
				navType: "dynamic",
				includeHeader: true,
				fcCntNavBarToggleAction: true,
				lazyLoading: true,
				lazyPaneFunction: function(navItem){
					if(navItem.id == "admin"){
						return xhr.get("resources/data/content_list_fc_group_pane.json", {
							sync: true
						})
					}
				},
				lazyGridFunction: function(navItem){
					if(navItem.id == "monitor_tasks"){ // single async/ajax call
						return xhr.get("resources/data/content_list_fc_group.json", {
							sync: false
						})
					}
					else if(navItem.id == "monitor_common"){ // multi async/ajax call
						contentPromise = xhr.get("resources/data/content_list_fc_group_2.json", {
							sync: true
						});
						headerCntPromise = xhr.get("resources/html/samplePageHeader_widgets.html", {
							sync: true
						});
						//combine the header content(get from ajax request) into grid content using promise batch
						return all({content:contentPromise, header:headerCntPromise}).then(function(results){
							var contentData = baseJson.fromJson(results.content);
							contentData.props.headerParams = {};
							contentData.props.headerParams.content = results.header;
							var result = baseJson.toJson(contentData);
							return result;
					    });
					}
				},
				fcTitle: "Dynamic Pluggable UI (Group)",
				css3AnimationDisabled_nav: true,
				// css3AnimationDisabled_container: true,
				model: "edit"
			}, "flipcardNode");
			flipCard.startup();
						
			navSettingsActionHandler = function(item, e){
				switch(item.id){
					case "idx_website":
						window.open("http://idx.ibm.com");
						
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
						
						break;
						
					default:
						//TODO
						break;
				}
			}
			aspect.after( navigator, "handleCustomAction_stub", navCustomActionHandler, true);
			
		
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