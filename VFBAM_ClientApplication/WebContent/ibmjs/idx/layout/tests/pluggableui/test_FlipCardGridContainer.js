define([
	"dojo/_base/lang", 
	"dojo/aspect", 
	"dojo/dom", 
	"dojo/dom-style", 
	"dojo/dom-geometry", 
	"dijit/registry", 
	"idx/layout/FlipCardItem",
	"idx/layout/FlipCardGridContainer"
], function( lang, aspect, dom, domStyle, domGeometry, registry, FlipCardItem, FlipCardGridContainer ){
	/**
	 * Export some functions to the page 
	 */
	var flipCardGrid = null,
		startLoading = function(){
			for(var i = 0; i < 5; i++){
				var settings = (i%2)?{
					type: "dialog",
					title: "Settings in a Dialog",
					content: "<div style='margin-bottom:10px;'> Please add your config elements here </div>" + 
					 		"<div><button onclick='portletDialogHandler(this)'>Switch Theme</button></div>"
				} : {
					type: "normal",
					content: "<div> Settings for main <button onclick='portletHandler(this)'>Switch Theme</button></div>"
				};
				var item = {
					name: gridCardItemListParams.name + "_" + i,
					props: {
						closable: i%2?false:true,
						initItemStatus: i%2?"normal":"min",
						maxable: true,
						stackable: true,
						// flipableAction: true,
						main_props: {
							title: "Sample_" + gridCardItemListParams.title + "_" + i,
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
							title: "Detail_" + gridCardItemListParams.title + "_" + i,
							href: "resources/html/flipCardContent.html",
							contentActions:[
								{id:"refresh", name:"refresh",label:"Refresh",type:"icon",actionClass:"refreshActionNode",pressHandler: function(){this.refresh()}},
								{id:"load", name:"load",label:"Load",type:"icon",actionClass:"loadActionNode",pressHandler: function(){this.set("href", "resources/html/flipCardContentChanged.html");}}
							],
							settingsAction: settings
						}
					}
				};
				gridCardItemListParams.items.push(item);
			}
			
		},
		//grid content data
		gridCardItemListParams = {
			name: "welcome",
			title: "welcome",
			items:[]
		}, 
		//
		bindEvent = function(){
			window.portletHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).getParent();
				portlet.switchCardSkin("blueSkin");
			};
			window.portletDialogHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).parentWidget.getParent();
				portlet.switchCardSkin("blueSkin");
			};
			
			window.flipCardHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).getParent();
				portlet.processFlip();
			};
			
			//grid container actions
			window.addCardItems = function(){
				flipCardGrid.addCardItem({
					name: "sample_added_card",
					itemPosition: {
						column:2,
						p:0
					},
					props: {
						maxable: true,
						stackable: true,
						closable: true,
						flipToMainAction: true,
						flipToDetailAction: true,
						main_props: {
							title: "Sample_Added_Main_Side",
							content: "<div style='height:250px'>Dynamic Added Card</div>",
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
				
				flipCardGrid.addCardItem({
					name: "sample_added_card_2",
					props: {
						closable: true,
						main_props: {
							title: "Sample_Added_Main_Side_22222",
							content: "<div style='height:250px'>Dynamic Added Card 22222</div>"
						}
					},
					itemPosition: {
						column: 2,
						p: 1
					}
				});
			}
			
			window.updateCardItems = function(){
				flipCardGrid.updateCardItem({
					name: "sample_added_card",
					props: {
						maxable: false,
						stackable: false,
						closable: false,
						main_props: {
							title: "Changed_Main_Side",
							content: "<div style='height:250px'>Changed Content</div>"
						}
					}
				});
				flipCardGrid.updateCardItem({
					name: "sample_added_card_2",
					props: {
						closable: false,
						main_props: {
							title: "Changed_Main_Side_22222",
							content: "<div style='height:250px'>Changed Content 22222</div>"
						}
					}
				});
			}
			
			window.removeCardItems = function(){
				flipCardGrid.removeCardItem("sample_added_card");
				flipCardGrid.removeCardItem("sample_added_card_2");
			}
			
			window.addMaxCardItem = function(){
				
				var cardItem = flipCardGrid.addCardItem({
					name: "sample_added_card_max",
					props: {
						closable: true,
						maxable: true,
						initItemStatus: "max",
						main_props: {
							title: "Sample_Added_Main_Side_Max",
							href: "resources/html/sampleCardItemMax.html"
						}
					},
					itemPosition: {
						column: 0
					}
				});
				setTimeout(function(){
					var rootNode = dom.byId("sample_card_item_max");
					var cardContent = registry.getEnclosingWidget(rootNode);
					
					var contentSize = domGeometry.getContentBox( cardContent.containerNode) ;
					console.log( contentSize );
					var border = registry.byId("border1");
					border.resize( {
						w: contentSize.w,
						h: contentSize.h
					} );
					
				},200);
				

			};
			
			window.addMinCardItem = function(){
				flipCardGrid.addCardItem({
					name: "sample_added_card_min",
					props: {
						closable: true,
						minable: true,
						initItemStatus: "min",
						main_props: {
							title: "Sample_Added_Main_Side_Min",
							content: "<div style='height:250px'>Dynamic Added Card Min</div>"
						}
					},
					itemPosition: {
						column: 1
					}
				});
			}
			
			
			//grid properties
			window.addGridColumn = function(){
				flipCardGrid.setColumns(flipCardGrid.nbZones + 1);
			}
			
			window.shrinkGridColumn = function(){
				flipCardGrid.setColumns(flipCardGrid.nbZones - 1);
			}
			
			window.reOrganizeCardItems = function(){
				flipCardGrid.reOrganizeChildren();
			}
			
			window.printPosition = function(){
				var children = flipCardGrid.getChildren();
				for(var x = 0; x < children.length; x++){
					console.info(children[x].itemName + "  column:" + children[x].get("column") + "  position:" + children[x].get("position"));
	            }      
			};
			
			
			//resize listener
			var signal_resize = aspect.after(flipCardGrid, "onResizeHandleEnd", function(evt, size){
				console.log(size);
			}, true);
			
			
			//dnd listener
			var signal_dnd = aspect.after(flipCardGrid, "grid_container_dnd_end", function(dndObj){
				console.log(dndObj);
			}, true);
			
		},
		
		startup = function(){
			//init flipcard widget
			flipCardGrid = new FlipCardGridContainer(lang.mixin({}, {
				containerId: gridCardItemListParams.name,
				containerName: gridCardItemListParams.name,
				containerTitle: gridCardItemListParams.title,
				containerType: "grid",
				items: gridCardItemListParams.items,
				relations: gridCardItemListParams.relations,
				nbZones: 3,
				minColWidth: 50,
				minChildWidth: 50,
				isAutoOrganized: true,
				// maxItemSwitchMode: "tab",
				// dockVisible: true,
				// dockBehavior: "fixed",
				acceptTypes: ["Portlet", "ContentPane"],
				editDisabled: false
			}, gridCardItemListParams.props), "flipCardGridNode");
			
			flipCardGrid.startup();
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
});