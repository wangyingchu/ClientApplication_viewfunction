define([
	"dojo/_base/lang", 
	"dojo/aspect", 
	"dojo/dom", 
	"dijit/registry", 
	"idx/layout/FlipCardItem",
],function( lang, aspect, dom, registry, FlipCardItem ){
	var item = {},
		cardItem = null,
		bindEvent = function(){
			window.portletHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).getParent();
				portlet.switchCardSkin("blueSkin");
			};
			
			window.flipCardHandler = function(context){
				var portlet = registry.getEnclosingWidget(context).getParent();
				portlet.processFlip();
			};
			
			
			//Card Actions
			addCardAction = function(){
				var actId = dom.byId("sample_add").value || "sample_action";
				cardItem.addCardAction({id:actId,name:actId,title:actId}, {forceAdjustPos:true});
			}
			addCardActionLeft = function(){
				var actId = dom.byId("sample_add").value || "sample_action";
				cardItem.addCardAction({id:actId,name:actId,title:actId}, {forceAdjustPos:true,left:true});
			}
			removeCardAction = function(){
				var actId = dom.byId("sample_remove").value || "sample_action";
				cardItem.removeCardAction(actId, {forceAdjustPos:true});
			}
			updateCardAction = function(){
				var actId = dom.byId("sample_update").value || "sample_action";
				cardItem.updateCardAction({id:actId,iconClass:"sampleCardIcon"});
			}
			defaultActionHandler = function(actItem){
				if(actItem && actItem.id){
					alert(actItem.id + " Clicked!!");
				}
			}
			aspect.after(cardItem, "handle_action_stub", defaultActionHandler, true);
			
			//card batch actions 
			clearCardActions = function(){
				cardItem.clearCardActions();
			}
			clearCardMainContentActions = function(){
				cardItem.mainContent.clearContentActions();
			}
			buildCardActions = function(){
				// cardItem.addCardAction({id: "close",name: "close",title: "close"}, {extraClass:"actionsMain"});
				
				cardItem.set("minable", true);
				cardItem.set("closable", true);
				
				cardItem.addCardActions([
					{id: "action_sample_1",name: "action_sample_1",title: "action sample 1"},
					{id: "action_sample_2",name: "action_sample_2",title: "action sample 2"},
					{id: "action_sample_left_1",name: "action_sample_left_1",title: "action sample left 1"},
					{id: "action_sample_left_2",name: "action_sample_left_2",title: "action sample left 2"},
					{id: "action_sample_left_3",name: "action_sample_left_3",title: "action sample left 3"}
				],{
					action_sample_left_1:{left:true},
					action_sample_left_2:{left:true},
					action_sample_left_3:{left:true,fixed:true}
				});
			}
			buildCardMainContentActions = function(){
				cardItem.mainContent.addContentActions([
					{id:"exec", name:"exec", label:"Exec",type:"icon"},
					{id:"macro", name:"macro", label:"Macro"},
					{id:"plugins", name:"plugins", label:"Plugins",children:[
						{id:"converter", name:"converter", label:"Converter"},
						{id:"debugger", name:"debugger", label:"Debugger"},
						{id:"sensor", name:"sensor", label:"Sensor"}
					]},
					{id:"window", name:"window", label:"Window",children:[
						{id:"horizontal", name:"horizontal", label:"Horizontal"},
						{id:"vertical", name:"vertical", label:"Vertical"}
					]}
				]);
			}
			
			
			//Card Content Actions
			addCardContentActionMain = function(){
				var actCntId = dom.byId("sample_content_add").value || "sample_ca";
				cardItem.mainContent.addContentAction({id:actCntId,type:"icon",label:actCntId});
			}
			addCardContentActionDetail = function(){
				var actCntId = dom.byId("sample_content_add").value || "sample_ca";
				cardItem.detailContent.addContentAction({id:actCntId,type:"text",label:actCntId});
			}
			removeCardContentActionMain = function(){
				var actCntId = dom.byId("sample_content_remove").value || "sample_ca";
				cardItem.mainContent.removeContentAction(actCntId);
			}
			removeCardContentActionDetail = function(){
				var actCntId = dom.byId("sample_content_remove").value || "sample_ca";
				cardItem.detailContent.removeContentAction(actCntId);
			}
			updateCardContentActionMain = function(){
				var actCntId = dom.byId("sample_content_update").value || "sample_ca";
				cardItem.mainContent.updateContentAction({id:actCntId,actionClass:"sampleCardContentIcon"});
			}
			updateCardContentActionDetail = function(){
				var actCntId = dom.byId("sample_content_update").value || "sample_ca";
				cardItem.detailContent.updateContentAction({id:actCntId,label:"changed"});
			}
			defaultMainContentActionHandler = function(actItem){
				if(actItem.id != "help"){
					alert("Main side: " + actItem.id + " Clicked!!");
				}else{
					window.open("http://idx.ibm.com");
				}
			}
			defaultDetailContentActionHandler = function(actItem){
				if(actItem.id == "refresh"){
					this.refreshCard();
				}else if(actItem.id == "load"){
					this.set("href", "resources/html/flipCardContentChanged.html");
					this.refreshCard();
				}else{
					alert("Detail side: " + actItem.id + " Clicked!!");
				}
			}
			
			flipContentActionHandler = function(cardContent, args, e){
				if(args && args.flipActType == "detail"){ //back to main content flip action
					console.log("Back to main content flip action clicked!!");
				}
			}
			
			aspect.after(cardItem.mainContent, "handle_content_action_stub", defaultMainContentActionHandler, true);
			aspect.after(cardItem.detailContent, "handle_content_action_stub", defaultDetailContentActionHandler, true);
			aspect.after(cardItem.detailContent, "handle_parent_flip_action", flipContentActionHandler, true);
			
			
			addCardSettingsActionMain = function(){
				cardItem.mainContent.addContentSettings({
					title: "Test Settings",
					type: "dialog",
					content: "<div> Settings Test </div>"
				});
			}
			addCardSettingsActionDetail = function(){
				cardItem.detailContent.addContentSettings({
					title: "Detail Test Settings",
					type: "normal",
					content: "<div> Detail Settings Test </div>"
				});
			}
			removeCardSettingsActionMain = function(){
				cardItem.mainContent.removeContentSettings();
			}
			removeCardSettingsActionDetail = function(){
				cardItem.detailContent.removeContentSettings();
			}
			
			
			
			setCardContent = function(){
				cardItem.mainContent.set("content", dom.byId("sampleCardContent").value);
			}
			
			setCardHref = function(){
				cardItem.mainContent.set("href", dom.byId("sampleCardHref").value);
			}
			
			
			var signal_resize = aspect.after(cardItem, "onResizeHandleEnd", function(evt, size){
				console.log(size);
			}, true);
			
		},
		startLoading = function(){
			item = {
				name: "flip_card_sample",
				props: {
					// maxable: true,
					// stackable: true,
					// closable: true,
					itemContentScroll: true,
					// flipableAction: true,
					main_props: {
						title: "flip_card_sample_main",
						content: "<img alt='sample_image' src='resources/images/portlet1.png' style='width:100%; height: 100%'/>" + 
									"<a role='button' tabindex='0'" + 
										"onclick='flipCardHandler(this)'" + 
										"onkeydown='if(event.keyCode == 13){flipCardHandler(this)}'" + 
										"style='position:absolute;top:30px;right:20px;cursor:pointer;font-size:13px;font-weight:bold;text-decoration:underline;color:blue'>" + 
										"detail" + 
									"</a>",
						contentActions:[
							{id:"file", name:"file", label:"File",type:"text",children:[
								{id:"new", name:"new", label:"New"},
								{id:"open", name:"open", label:"Open"},
								{id:"exit", name:"exit", label:"Exit"}
							]},
							{id:"edit", name:"edit", label:"Edit",type:"text",children:[
								{id:"copy", name:"copy", label:"Copy"},
								{id:"paste", name:"paste", label:"Paste"}
							]},
							{id:"card", name:"card", label:"Card",type:"text"},
							{id:"help", name:"help", label:"Help",type:"text"}
						]
					},
					detail_props: {
						title: "flip_card_sample_detail",
						href: "resources/html/flipCardContent.html",
						preload: false,
						contentActions:[
							{id:"refresh", name:"refresh",label:"Refresh",type:"icon",actionClass:"refreshActionNode"},
							{id:"load", name:"load",label:"Load",type:"icon",actionClass:"loadActionNode"}
						],
						settingsAction: {
							type: "normal",
							content: "<div> Settings for main <button onclick='portletHandler(this)'>Switch Skin</button></div>"
						}
					}
				}
			};
		},
		
		startup = function(){
			var cardProps = lang.mixin({
				initItemHeight: 320,
    			initItemWidth: 380,
				flipToMainAction: true,
				// flipToDetailAction: true,
				// css3AnimationDisabled: true,
				// actionsInMainSide: true,
				itemName: item.name
			}, item.props);
			cardItem = new FlipCardItem(cardProps, "flipCardItem"); 
			
			cardItem.startup();
		}
	
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