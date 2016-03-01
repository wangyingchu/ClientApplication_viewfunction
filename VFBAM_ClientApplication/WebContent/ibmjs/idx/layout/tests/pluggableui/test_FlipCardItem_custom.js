define([
	"dojo/_base/lang", 
	"dojo/aspect", 
	"dojo/dom", 
	"dijit/registry", 
	"idx/layout/FlipCardItem",
	"idx/layout/FlipCardGridContainer",
],function( lang, aspect, dom, registry, FlipCardItem, FlipCardGridContainer ){

	
	var item = {},
		cardItem = null,
		startLoading = function(){
			item = {
					name: "flip_card_custom_sample",
					props: {
						actionsInMainSide: true,
						cardFlipAction: true,
						minable: false,
						initItemHeight: 450,
						initItemWidth: 500,
						main_props: {
							title: "flip_card_sample_main",
							widgetClass: "dijit/Calendar",
							widgetParams: {},
							contentActions:[],
							settingsAction: {
								type: "normal",
								content: "<div> Settings for main <button onclick='portletHandler(this)'>Switch Skin</button></div>"
							}
						},
						detail_props: {
							title: "flip_card_sample_detail",
							widgetClass:  
								dojo.declare("mybutton", [dijit.form._FormWidget, dijit.form._ButtonMixin], {
									templateString: "<span class='dijit dijitReset dijitInline' role='presentation'	><span class='dijitReset dijitInline dijitButtonNode' data-dojo-attach-event='ondijitclick:__onClick' role='presentation' ><span class='dijitReset dijitStretch dijitButtonContents' data-dojo-attach-point='titleNode,focusNode' role='button' aria-labelledby='${id}_label'><span class='dijitReset dijitInline dijitIcon' data-dojo-attach-point='iconNode'></span ><span class='dijitReset dijitToggleButtonIconChar'>&#x25CF;</span ><span class='dijitReset dijitInline dijitButtonText'				id='${id}_label' data-dojo-attach-point='containerNode'></span></span></span><input ${!nameAttrSetting} type='${type}' value='${value}' class='dijitOffScreen'		data-dojo-attach-event='onclick:_onClick' tabIndex='-1' role='presentation' aria-hidden='true' data-dojo-attach-point='valueNode'/></span>",
								}),
							widgetParams: {label: "test message", onClick: function(){alert("test message");}},
							preload: false,
							contentActions:[],
							settingsAction: {
								type: "dialog",
								content: "<div> Settings for detail <button onclick='portletDialogHandler(this)'>Switch Skin</button></div>"
							}
						}
					}
				};
		},
		startup = function(){
			var cardProps = lang.mixin({
				initItemHeight: 450,
    			initItemWidth: 550,
				actionsInMainSide: true,
				itemName: item.name
			}, item.props);
			cardItem = new FlipCardItem(cardProps, "flipCardItem"); 
			
			cardItem.startup();
			
			cardItem.addCardAction({id:"card_settings",name:"card_settings",title:"Card Settings"}, {extraClass:"actionsMain", forceAdjustPos:true});
			
			cardItem.addCardAction({id:"card_refresh",name:"card_refresh",title:"Card Refresh"}, {extraClass:"actionsMain", forceAdjustPos:true});
			
			
		},
		
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
			

			//event binding
			defaultActionHandler = function(actItem, evt){
				if(actItem.id == "card_refresh"){
					var content = this[this.itemMode+"Content"]
					if(content){
						content.refreshCard();
					}
				}else if(actItem.id == "card_settings"){
					var content = this[this.itemMode+"Content"]
					if(content && content._settingsWidget){
						content._settingsWidget.toggle(evt);
					}
				}else{
					console.log("Action: " + actItem.id + " Clicked!!");
				}
			}
			aspect.after(cardItem, "handle_action_stub", defaultActionHandler, true);
			
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