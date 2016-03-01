/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/array", // array.forEach array.indexOf array.map
	"dojo/_base/declare", // declare
	"dojo/_base/connect",
	"dojo/_base/event", // event.stop
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dojo/_base/sniff", 
	"dojo/dom", // attr.set
	"dojo/dom-attr", // attr.set
	"dojo/dom-class", // domClass.add domClass.contains
	"dojo/dom-style", // domStyle.set
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/i18n", // i18n.getLocalization
	"dojo/keys",
	"dojo/on",
	"dojo/query",
	"dojo/touch",
	"dijit/registry",
	"dijit/focus",
	"dijit/_CssStateMixin",
	"dijit/form/Button",
	"dijit/layout/ContentPane", 
	"dojox/fx/flip",
    "./pluggable/_FlipCardFeatureDetector",
	"./pluggable/_FlipCardUtils",
	"./pluggable/_Portlet",
    "./pluggable/_FlipCardResize",
    "./pluggable/carditem/StackActionMixin",
    "./pluggable/carditem/MinMaxActionMixin",
	"dojo/i18n!./nls/FlipCard"
	
], function( array, declare, connect, event, lang, has, dom, domAttr, domClass, domStyle, domConstruct, domGeom, i18n, keys, on, query, touch, 
		registry, focus, _CssStateMixin, Button, ContentPane, 
		flip, 
		_FlipCardFeatureDetector, _FlipCardUtils, _Portlet, _FlipCardResize, StackActionMixin, MinMaxActionMixin
	){
	// module:
	//		idx/layout/FlipCardItem
	// summary:
	//		A resizable, flippable, range-bound container with customizable actions

	/**
	* @name idx.layout.FlipCardItem
	* @class A resizable, flippable, range-bound container with customizable actions
	* @augments dijit.layout.ContentPane
	* @augments dijit._CssStateMixin
	*/
	var FlipCardItem = declare("idx/layout/FlipCardItem", [ContentPane, _CssStateMixin], {
		/**@lends idx.layout.FlipCardItem*/ 
		// summary:
		//		A validating, serializable, range-bound date text box with a drop down calendar
		//
		//		Example:
		// |	new FlipCardItem({maxable: true,flipable:true})
		//
		//		Example:
		// |	<div data-dojo-type='idx.layout.FlipCardItem' data-dojo-props='maxable:true,flipable:true'></div>
		
		
		// flipable: Boolean
		//		whether the card widget can be flipped 
		flipable: true,
		
		// flipToDetailAction: Boolean
		//		whether to have the flip action item in the card's action bar of main content
		flipToDetailAction: false,
		
		// flipToMainAction: Boolean
		//		whether to have the flip action item in the card's action bar of detail content
		flipToMainAction: true,
		
		
		// cardFlipAction: Boolean
		//		whether to have a flip button on both side of the card
		cardFlipAction: false,
		
		// itemResizable: Boolean
		//		whether the card widget can be resized 
		itemResizable: true,
		
		// settingsAct: Boolean
		//		whether the card widget can have actions
		settingsAct: true,
		
		// minable: Boolean
		//		whether the card widget can be minimized 
		minable: true,
		
		// maxable: Boolean
		//		whether the card widget can be maximized 
		maxable: false,
		
		// stackable: Boolean
		//		whether the card widget can be hided 
		stackable: false,
		
		// closable: Boolean
		//		whether the card widget can be closed / deleted 
		closable: false,
		
		// actionsInMainSide: Boolean
		//		whether the card actions located in main side 
		actionsInMainSide: false,
		
		// flipCardModel: String
        //      card model, sync with the flip card container, "view" will disable the settings 
		flipCardModel: "edit",
		
		// initItemStatus: String
        //      card initial status 
		initItemStatus: "normal", //"max", "min", "normal", "stacked"
		
		// itemContentScroll: Boolean
        //      whether to have the scrollbar for card content
		itemContentScroll: false,
		
		// initItemHeight: Integer / String
        //      Card Item initial height in px.
		initItemHeight: 280,
		
		// initItemWidth: Integer
        //      Card Item initial height in px.
        initItemWidth: "auto",
        
        // initDndBar: Boolean
        //      init fresh dnd bar right under the card title instead using card title for dnd.
        initDndBar: false,
        
        // hideActionsInMaxMode: Boolean
        //      hide the disabled actions when card switched to max mode.
        hideActionsInMaxMode: true,
        
        itemName: "",
        
        animationDuration: 1000,
        css3AnimationDisabled: false,
        
        // tabIndex: -1,

        //
        // Preserved Size value for FlipCardItem
        normalSize: null,
        baseClass: "dijitContentPane portletItemPane",
        //
        // according to this node to calculate size of every flipcard item
        // remove the rootContainer
        sizeReferenceNode: null,

        /**
         *
         */
		postMixInProperties: function(){
			this.inherited(arguments);
			this._nlsResources = i18n.getLocalization("idx/layout", "FlipCard");
		},

        /**
         *
         */
		postCreate: function(){
			this.inherited(arguments);
			
			this.commonActionMap = {};
			
			this.itemMode = "main", //"main", "detail"
			this.itemStatus = "normal", //"max", "min", "normal", "stacked"
			
			this.itemName = this.itemName || _FlipCardUtils.generateGUID();
			
			this.actionDisplayed = false;
			this.actionDisplayedInMain = false;
			
			this.animationDurationHeritage = this.animationDuration;
			
			//main and detail portlet content
            domClass.add(this.domNode, "portletItem");
            if(_supportCSS3Animation){
                domClass.add(this.domNode, "css3Animations");
            }
            
            domAttr.set(this.domNode, "itemName", this.itemName);
            
            //initial flip side status
            domClass.add(this.domNode, "portletItemMainContent");
            
            this.itemActionBarNode = domConstruct.create("div", {
                className: "itemActionBar",
                "data-dojo-attach-point": "itemActionBarNode"
            }, this.domNode);

		},
        /**
         *
         */
        startup: function(){
            if(this._started){return;}

            this.inherited(arguments);

            if ( !this.sizeReferenceNode ){
                // find the parent node which contians this domNode as the referenceNode
                var self = this;
                query(".centerGridContainer").forEach(function( node ){
                    if ( node.contains( self.domNode ) ){
                        self.sizeReferenceNode = node;
                    }

                });
            }

            //set initial size of the card item
            domStyle.set(this.domNode, {
                width: (typeof this.initItemWidth != 'number') ? this.initItemWidth : (this.initItemWidth + "px"),
                height: (typeof this.initItemHeight != 'number') ? this.initItemHeight : (this.initItemHeight + "px")
            });

            //create maximum node
            if(this.settingsAct){
                this.addCardAction({id:"settings",name:"settings",title:"Settings Action"}, {fixed:true,extraClass:"actionsMain"});
                this.addCardAction({id:"settingsDetail",name:"settingsDetail",title:"Detail Settings Action"}, {fixed:true,extraClass:(this.actionsInMainSide?"actionsMain":"")});
                domClass.toggle(this.commonActionMap["settingsDetail"].widget.domNode, "mainActDetail", this.actionsInMainSide);
            }

            this.closable && this.addCardAction({id: "close",name: "close",title: "close"}, {extraClass:(this.actionsInMainSide?"actionsMain":"")});

            if(this.gridContainer || (this.getParent() && this.getParent().declaredClass == "idx/layout/FlipCardGridContainer")){
                this.maxable && this.addCardAction({id:"max",name:"max",title:"Max"}, {extraClass:(this.actionsInMainSide?"actionsMain":"")});
                this.stackable && this.addCardAction({id:"stack",name:"stack",title:"Stack"}, {extraClass:(this.actionsInMainSide?"actionsMain":"")});

                //dnd handler
                if(this.initDndBar){
                    this.dndNode = domConstruct.create("div", {
                        className: "dndBarNode"
                    }, this.domNode);
                }
            }

            this.minable && this.addCardAction({id:"min",name:"min",title:"Minimize"}, {extraClass:(this.actionsInMainSide?"actionsMain":"")});

            if(this.flipable && this.cardFlipAction){
                this.addCardAction({id:"flipAction",name:"flipAction",title:"Card Flip Action"},{extraClass:"portletItemFlipNode " + (this.actionsInMainSide?"actionsMain":"")});
            }

            var mainProps = lang.mixin({}, {
                contentType: "main",
                toggleable: false,
                closable: false
            }, this.main_props);
            var mainContent = new _Portlet(mainProps);
            domClass.add(mainContent.domNode, "mainContent");

            //create a default detail content anyway
            var detailProps = lang.mixin({}, {
                contentType: "detail",
                toggleable: false,
                closable: false
            }, this.detail_props);
            var detailContent = new _Portlet(detailProps);
            domClass.add(detailContent.domNode, "detailContent");

            if(_supportCSS3Animation){
                domClass.add(mainContent.domNode, "css3Animations");
                domClass.add(detailContent.domNode, "css3Animations");
                domStyle.set(detailContent.domNode, "visibility", "hidden");
            }else{
                domStyle.set(detailContent.domNode, "display", "none");
            }

            this.mainContent = mainContent;
            this.addChild(mainContent);
            this.detailContent = detailContent;
            this.addChild(detailContent);

            //content scrollbar
            this.resizeScrollContent();

            this.initResizer();


            //handle css3 animation flag
            this.toggleCSS3Animation(this.css3AnimationDisabled);


            this.initStartupViews();


            this._started = true;

            //a11y
            domAttr.set(this.domNode, {
                tabIndex: -1
            });
            // console.log(this.domNode.tabIndex);
        },


        /**
		 * show the actions.
		 * @param {Boolean} show
		 */
		displayActions: function(show, e){
			
			if(show === undefined){
				this.actionDisplayed = !this.actionDisplayed;
			}else{
				this.actionDisplayed = show;
			}
			if(this.itemMode == "main"){
				this.actionDisplayedInMain = this.actionDisplayed;
			}
			
			// domClass.toggle(this[this.itemMode+"Content"].titleBarNode, "settings", this.actionDisplayed);
			if(this.mainContent){
				domClass.toggle(this["mainContent"].titleBarNode, "settings", this.actionDisplayed);
			}
			if(this.detailContent){
				domClass.toggle(this["detailContent"].titleBarNode, "settings", this.actionDisplayed);
			}
			
			for(var actionId in this.commonActionMap){
				var aItem = this.commonActionMap[actionId];
				domClass.toggle(aItem.widget.domNode, "actionsDetail", this.actionDisplayed);
				if (actionId === "settingsDetail" && this.actionsInMainSide) {
					domClass.toggle(aItem.widget.domNode, "mainActDetail", !this.actionDisplayed);
				}else if(domClass.contains(aItem.widget.domNode, "actionsMain")){
					domClass.toggle(aItem.widget.domNode, "mainActDetail", this.actionDisplayed);
				}
			}
			
			//transform animation extra effect
			domClass.add(this.domNode, "contentTitleAnimating");
			setTimeout(lang.hitch(this, function(){
				if(this && this.domNode){
					domClass.remove(this.domNode, "contentTitleAnimating");
				}
				//a11y
				var settingsBtn = this.actionDisplayed ? this["settingsDetailBtn"] : this["settingsBtn"];
				settingsBtn.domNode.setAttribute("tabindex", "-1");
				focus.focus(settingsBtn.domNode);
			}),this.animationDuration);
			
			e && event.stop(e);
		},
		
		displayCardActions: function(include, exclude, show){
			for(var actionId in this.commonActionMap){
				if(exclude && exclude.length && array.indexOf(exclude, actionId) > -1){
					continue;
				}
				var aItem = this.commonActionMap[actionId];
				var aWidget = aItem.widget;
				var aNode = aWidget.domNode;
				domClass.toggle(aNode, "FlipCardHiddenElement", !show);
			}
			
			if(include && include.length){
				array.forEach(include, function(actId){
					if(this[actId + "Btn"]){
						domClass.toggle(this[actId + "Btn"].domNode, "FlipCardHiddenElement", !show);
					}
				}, this);
			}
		},
        resizer:  null,


        /**
         * Get the GridContainer's Geometry
         * usually, the GridContainer is full of the screen except header and navbar
         * @returns {*}
         */
		getStableContainerSize: function(){
			if(this.gridContainer){
				var gridGeom = domGeom.position(this.gridContainer.containerNode);

                if ( this.gridContainer.dockContainer){
                    var dockGeom = domGeom.position(this.gridContainer.dockContainer.domNode);
                    gridGeom.h = gridGeom.h - dockGeom.h;
                }

                if ( this.gridContainer.headerContainer){
                    var headerGeom = domGeom.position(this.gridContainer.headerContainer.domNode);
                    gridGeom.h = gridGeom.h - headerGeom.h;
                }

	            var containerGeom = {
                    w: gridGeom.w,
                    h: gridGeom.h
                }
	            return containerGeom;
			}else{
				return domGeom.position(this.domNode);
			}
		},
		
		getStableCardItemSize: function(){
			if(this.gridContainer){
				var containerGeom = this.getStableContainerSize();
				var itemGeom = {
                    w: ((containerGeom.w-15)/this.gridContainer.nbZones - 20),
                    h: this.initItemHeight
                }
                return itemGeom;
			}else{
				return domGeom.position(this.domNode);
			}
		},
		
		toggleCSS3Animation: function(forceDisable){
			if(forceDisable !== undefined){
				this.css3AnimationDisabled = forceDisable ? true : false;
			}else{
				this.css3AnimationDisabled = !this.css3AnimationDisabled;
			}
			
			if(this.css3AnimationDisabled){
				domClass.add(this.domNode, "css3AnimationsDisabled");
				this.animationDuration = 1;
			}else{
				domClass.remove(this.domNode, "css3AnimationsDisabled");
				this.animationDuration = this.animationDurationHeritage;
			}
		},
		
	
		clearCardActions: function(){
			for(var actId in this.commonActionMap){
				if(actId == "settings" || actId == "settingsDetail"){
					//TODO for special action
				}else{
					this.removeCardAction(actId);
				}
			}
		},
		/*
		 * publish card action manipulate APIa
		 */
		addCardActions: function(actionItems, args){
			if(actionItems && actionItems.length){
				array.forEach(actionItems, function(actionItem){
					var actionItemArgs = args;
					if(args && args[actionItem.id]){
						actionItemArgs = args[actionItem.id];
					}
					this.addCardAction(actionItem, actionItemArgs);
				}, this);

			}
		},
		/**
		 * 
		 */
		addCardAction: function(actionItem, args){
			var self = this;
			
			if(actionItem && actionItem.id){
				var actId = actionItem.id;
				if(this.commonActionMap[actId]){
					console.log(actId + " ard Action Already Exist!")
					return;
				}
				var btn = new Button({
					label: actionItem["title"],
					showLabel: false,
					title: this._nlsResources[actId + "ActionTitle"] || actionItem["name"] || actionItem["title"] || this._nlsResources["defaultActionTitle"],
					iconClass: "actionIcon " + actId + "Icon"
				});
				domStyle.set( btn.valueNode, "display", "none" );
				btn.placeAt( this.itemActionBarNode, "first" );
				btn.startup();
				
				
				this[actId + "Btn"] = btn;
				this[actId + "Node"] = this[actId + "Btn"].domNode;
				domClass.add(this[actId + "Node"], "portletItemNode_"+actId + " portletAction portletItemAction " + ((args&&args.extraClass)?args.extraClass:""));
				if(this.actionDisplayed){
					domClass.add(this[actId + "Node"], "actionsDetail");
				}
				
				if(this["handle_" + actId]){
					
					this.own(on(this[actId + "Btn"], touch.press, lang.hitch(this, this["handle_" + actId])));

					//a11y
					this.own(on(this[actId + "Btn"], "keydown", lang.hitch(this, function(actId, evt){
						if(evt.keyCode == keys.ENTER){
							this["handle_" + actId](evt);
						}
					}, actId)));
				}else{
					this.own(on(this[actId + "Btn"], touch.press, lang.hitch(this, this["handle_action"], actionItem)));
					//a11y
					this.own(on(this[actId + "Btn"], "keydown", lang.hitch(this, function(actionItem, evt){
						if(evt.keyCode == keys.ENTER){
							this["handle_action"](actionItem, evt);
						}
					}, actionItem)));
				}
				if(args && args.left){
					this[actId + "Btn"].left = true;
				}
				if(args && args.fixed){
					this[actId + "Btn"].fixed = true;
				}
				this.commonActionMap[actId] = {
					item: actionItem,
					widget: this[actId + "Btn"]
				}
				
				
				return this[actId + "Btn"];
			}
		},
		
		handle_action: function(actionItem, e){
			//TODO default action things
			if(actionItem.pressHandler && lang.isFunction(actionItem.pressHandler)){
				actionItem.pressHandler.apply(this, arguments);
			}
			
			this.handle_action_stub(actionItem, e);
		},
		
		handle_action_stub: function(actionItem, e){
			//stub function
		},
		
		updateCardAction: function(actionItem){
			if(actionItem.id && this.commonActionMap[actionItem.id]){
				var aItem = this.commonActionMap[actionItem.id];
				var aWidget = aItem.widget;
				var aNode = aWidget.domNode;
				//do update things
				if(actionItem.label){
					aWidget.set("label", actionItem.label);
				}
				if(actionItem.iconClass){
					aWidget.set("iconClass", "actionIcon " + actionItem.iconClass);
				}
				//TODO
				
			}
		},
		
		removeCardAction: function(actionId){
			if(actionId){
				//for map
				if(this.commonActionMap[actionId]){
					var actionWidget = this.commonActionMap[actionId].widget;
					actionWidget.destroy && actionWidget.destroy();
					delete this.commonActionMap[actionId];
				}

			}
		},
		
		
		_setMinableAttr: function(minable){
			this._handleNativeActionSet("min", minable);
		},
		_setMaxableAttr: function(maxable){
			this._handleNativeActionSet("max", maxable);
		},
		_setStackableAttr: function(stackable){
			this._handleNativeActionSet("stack", stackable);
		},
		_setClosableAttr: function(closable){
			this._handleNativeActionSet("close", closable);
		},
		_setCardFlipActionAttr: function(cardFlipAction){
			this._handleNativeActionSet("flipAction", cardFlipAction);
		},
				
		
		_handleNativeActionSet: function(actionName, actionOn){
			if(!this.commonActionMap || !actionName){return}
			if(actionOn){
				if(this.commonActionMap[actionName]){
					//TODO
				}else{
					this.addCardAction({id: actionName,name: actionName,title: actionName})
				}
			}else{
				if(this.commonActionMap[actionName]){
					this.removeCardAction(actionName);
				}else{
					//TODO
				}
			}
			
			this._set(actionName, actionOn);
		},
		
		handle_close: function(e){
			if(this.itemStatus == "normal"){
				//for parent grid
				var parentGrid = this.gridContainer || this.getParent();
				if(parentGrid){
					parentGrid.removeChild(this);
				}
				this.destroyRecursive && this.destroyRecursive();
			}else{
				console.log(this._nlsResources.statusIssueMessage);
			}
			
			this.handle_close_completed_stub(this);
		},
		
		handle_close_completed_stub: function(cardItem){
			//stub function
		},
		/**
		 * Almost the targetSize is undefined, except in the 
		 * state switch between normal and max
		 */
		resizeScrollContent: function( targetSize ){
			if( this.itemContentScroll ){
				var mainContentWidget = this.mainContent,
					detailContentWidget = this.detailContent;
				var mainTitleNode = mainContentWidget.titleBarNode,
					mainContentHeight = domStyle.get( mainContentWidget.domNode, "height" ),
					mainBarNodeHeight = domStyle.get( mainTitleNode, "height" ),
					mainContentBorder = domGeom.getBorderExtents( mainContentWidget.domNode );
					
				var detailTitleNode = detailContentWidget.titleBarNode,
					detailContentHeight = domStyle.get( detailContentWidget.domNode, "height" ),
					detailTitleNodeHeight = domStyle.get( detailTitleNode, "height" ),
					detailContentBorder = domGeom.getBorderExtents( detailContentWidget.domNode );
				
				
				if ( !targetSize ){
					var height = domStyle.get( this.domNode, "height");
					domStyle.set( 
						mainContentWidget.hideNode, 
						{
							"height": (height -  mainBarNodeHeight - mainContentBorder.h) + "px",
							"overflowY": "auto"
						}
					);

					domStyle.set( 
							detailContentWidget.hideNode, 
							{
								"height": (height -  detailTitleNodeHeight - detailContentBorder.h ) + "px",
								"overflowY": "auto"
							}
						);
				}
				else{
					height = parseInt( targetSize.height );
					domStyle.set( 
						mainContentWidget.hideNode, 
						{
							"height": ( height -  mainBarNodeHeight - mainContentBorder.h) + "px",
							"overflowY": "auto"
						}
					);
					domStyle.set( 
						detailContentWidget.hideNode, 
						{
							"height": ( height -  detailTitleNodeHeight - detailContentBorder.h) + "px",
							"overflowY": "auto"
						}
					);
				}
				
			}
		},
		/**
		 * 
		 */		
		onResizeHandleEnd: function(e, size){
			this.resizeScrollContent();
		},
		

        //
        // this function comes from parent, in order to calculate the size of
        // GridContainer minus header and dock container
        calBeforeResize: null,
        
        getMaxSize: function(){
        	//
            // when resize happenend, the size of window do no changed finished
            // so put the resize process into the UI thread queue
            //
            var targetSize = {};
            if ( this.calBeforeResize ){
                var geom = this.calBeforeResize( this.sizeReferenceNode );
                var marginHeight = domStyle.get(this.domNode, "marginTop") + domStyle.get(this.domNode, "marginBottom");
                // evans comment 20140724
                //var parentNode = this.domNode.parentNode;
                //parentPadding = domStyle.get(parentNode,"paddingTop") + domStyle.get(parentNode,"paddingBottom");

                targetSize = {
                    width: 'auto',
                    height:  (geom.h - marginHeight ) + "px"
                };
            }
            else{
                var refNode = this.sizeReferenceNode;
                var gridGeom = domGeom.position( refNode );

                targetSize = {
                    width: 'auto',
                    height: ( gridGeom.h-( 34 + 26 + 20 + 2 ) ) + "px"
                    //h: gridGeom.h - ( headerGeom.h + 26 + 20 + 2 )
                };
            }
            
            return targetSize;
        },
        /**
         * rewrite the resize function in ContentPane, for special case when the FlipCardItem is maximum
         */
		resize: function(){
		    //window resize when in item max mode, should be aligned
		    if( this.itemStatus == "max" || arguments[0] === true){
                var targetSize = this.getMaxSize();
                domStyle.set(this.domNode, targetSize);
		    }

            this.inherited(arguments);
		},

		getContentSize: function(){
			var width = domStyle.get(this.domNode, "width"),
				height = domStyle.get(this.domNode, "height");
				
			if((typeof width == "number") && (typeof height == "number")){
				return {w: width, h: height};
			}else{
				return domGeom.position(this.domNode);
			}
		},

		
		handle_settings: function(e){
			this.handle_sts(e);
		},
		handle_settingsDetail: function(e){
			this.handle_sts(e);
		},
		
		handle_sts: function(e){
			if(this.itemStatus == "min"){
				this.handle_min(e);
			}else{
				this.displayActions(undefined, e);
			}
		},
		
		refreshCardContent: function(cardContentWidget){
		    if(cardContentWidget && !cardContentWidget.isLoaded){
		        cardContentWidget.refreshCard();
		    }
		}
	});
    /**
     * Initialize the widget when in the life cycle of dojo.Widget
     */
    lang.extend(FlipCardItem, {
        /**
         * According to the configuration initItemStatus
         * Set every flipcard item size
         */
        initStartupViews: function(){

            // Toggle init status
            // Do Not Set the initItemStatus when startup
            setTimeout(lang.hitch(this, function(){
                if(this.initItemStatus != "normal"){
                    if(this.initItemStatus == "min"){
                        this.handle_min();
                    }else if(this.initItemStatus == "max"){
                        var containerGeom = this.getStableContainerSize();
                        var itemGeom = this.getStableCardItemSize();

                        this.handle_max();
                    }else if(this.initItemStatus == "stacked"){
                        this.handle_stack();
                    }
                }
            }), 100);
        },


        /**
         * According to the itemResizable, create the  _FlipCardResize object
         * in order to resize every FlipCardItem use mouse dnd
         */
        initResizer: function(){
            //resizer
            if(this.itemResizable){
                this.resizer = new _FlipCardResize({
                    targetContainer: this.domNode,
                    activeResize: true,
                    resizeAxis: "xy"
                });
                this.own(on(this.resizer, "resize", lang.hitch(this, function(evt){
                    this.onResizeHandleEnd(evt, this.resizer.get("targetSize"));
                })));
                domClass.add(this.resizer.domNode, "contentResizer");
                if(_supportCSS3Animation){
                    domClass.add(this.resizer.domNode, "css3Animations");
                }
                this.addChild(this.resizer);
            }
        }
    });
    /**
     * Handle Min and Max Process in the FlipCardItem
     */
    lang.extend(FlipCardItem, MinMaxActionMixin );
    /**
     * Handle the Stack Action on FlipCardItem Action Bar
     */
    lang.extend(FlipCardItem, StackActionMixin);

    /**
     * Handle the Flip Action on FlipCardItem
     */
    lang.extend(FlipCardItem,{
        /**
         * flip the card widget.
         */
        processFlip: function(e){
            //Stub for manually handle flip
            this.handle_flip(e);
        },

        //stub function to connect to
        handle_flipAction: function(e){
            this.handle_flip(e);
        },
        /**
         *
         * @param e
         */
        handle_flip: function(e){
            if(!this.flipable){return;}
            if(this.animating){
                //|| (e && e.target && !dom.isDescendant(e.target, this[this.itemMode+"Content"].titleBarNode))){
                return;
            }
            var anim = null;
            this.animating = true;
            if(_supportCSS3Animation){ //css3 supported
                clearTimeout(this.clearFlipCSS3Anim);
                domClass.add(this.domNode, "css3AnimationsFlipping");
                this.clearFlipCSS3Anim = setTimeout(lang.hitch(this, function(){
                    if(this && this.domNode){
                        domClass.remove(this.domNode, "css3AnimationsFlipping");
                    }
                }), this.animationDuration);
                if(this.itemMode == "main"){
                	domStyle.set(this.detailContent.domNode, "visibility", "visible");
                    domClass.add(this.domNode, "portletItemFlip");
                    this.resizer && domClass.add(this.resizer.domNode, "contentResizerFlip");

                    if(this.detailContent){
                        this.refreshCardContent(this.detailContent);
                    }

                    this.animating = false;
                    this.itemMode = "detail";
                    domClass.remove(this.domNode, "portletItemMainContent");
                    domClass.add(this.domNode, "portletItemDetailContent");
                    this.displayActions(false);

                    //a11y
                    this.detailContent.doFocusNodeItem();
                }else if(this.itemMode == "detail"){
                	domStyle.set(this.mainContent.domNode, "visibility", "visible");
                    domClass.remove(this.domNode, "portletItemFlip");
                    this.resizer && domClass.remove(this.resizer.domNode, "contentResizerFlip");

                    this.animating = false;
                    this.itemMode = "main";
                    domClass.remove(this.domNode, "portletItemDetailContent");
                    domClass.add(this.domNode, "portletItemMainContent");
                    this.displayActions(this.actionDisplayedInMain);

                    //a11y
                    this.mainContent.doFocusNodeItem();
                }
            }else{
                if(this.mainContent){
                    domStyle.set(this.mainContent.domNode, "display", "none");
                }
                if(this.detailContent){
                    domStyle.set(this.detailContent.domNode, "display", "none");
                }

                if(this.itemMode == "main"){
                    anim = flip["flip"]({
                        node: this.domNode,
                        dir: "right",
                        depth: .5,
                        duration: this.animationDuration
                    });
                    connect.connect(anim, "onEnd", this, function(){
                        if(this.mainContent){
                            domStyle.set(this.mainContent.domNode, "display", "none");
                        }
                        if(this.detailContent){
                            domStyle.set(this.detailContent.domNode, "display", "");
                            this.refreshCardContent(this.detailContent);
                        }

                        this.itemMode = "detail";
                        domClass.remove(this.domNode, "portletItemMainContent");
                        domClass.add(this.domNode, "portletItemDetailContent");
                        this.animating = false;
                        this.displayActions(false);

                        //a11y
                        this.detailContent.doFocusNodeItem();
                    });
                    anim.play();
                }else if(this.itemMode == "detail"){
                    anim = flip["flip"]({
                        node: this.domNode,
                        dir: "left",
                        depth: .5,
                        duration: this.animationDuration
                    });
                    connect.connect(anim, "onEnd", this, function(){
                        if(this.mainContent){
                            domStyle.set(this.mainContent.domNode, "display", "");
                        }
                        if(this.detailContent){
                            domStyle.set(this.detailContent.domNode, "display", "none");
                        }

                        this.itemMode = "main";
                        domClass.remove(this.domNode, "portletItemDetailContent");
                        domClass.add(this.domNode, "portletItemMainContent");
                        this.animating = false;
                        this.displayActions(this.actionDisplayedInMain);

                        //a11y
                        this.mainContent.doFocusNodeItem();
                    });
                    anim.play();
                }
            }
            e && event.stop(e);

            setTimeout(lang.hitch(this, function(){
                this.handle_flip_completed_stub(this);
                if(_supportCSS3Animation){
                	if(this.itemMode == "detail"){
                    	domStyle.set(this.mainContent.domNode, "visibility", "hidden");
                    }
                    else if(this.itemMode == "main"){
                    	domStyle.set(this.detailContent.domNode, "visibility", "hidden");
                    }
                }
            }),this.animationDuration);
        },
        /**
         *
         * @param cardItem
         */
        handle_flip_completed_stub: function(cardItem){
            //stub function
        }
    });
    /**
     * Meta Data Handler
     */
    lang.extend(FlipCardItem, {
        getMetadata: function(context){
            this.metadata = {
                name: this.itemName,
                props: {
                    flipable: this.flipable,
                    flipToDetailAction: this.flipToDetailAction,
                    flipToMainAction: this.flipToMainAction,
                    cardFlipAction: this.cardFlipAction,
                    itemResizable: this.itemResizable,
                    settingsAct: this.settingsAct,
                    minable: this.minable,
                    maxable: this.maxable,
                    stackable: this.stackable,
                    closable: this.closable,
                    flipCardModel: this.flipCardModel,
                    initItemStatus: this.initItemStatus,
                    itemContentScroll: this.itemContentScroll,
                    initItemHeight: this.initItemHeight,
                    initItemWidth: this.initItemWidth,
                    initDndBar: this.initDndBar,
                    hideActionsInMaxMode: this.hideActionsInMaxMode,
                    animationDuration: this.animationDuration,
                    css3AnimationDisabled: this.css3AnimationDisabled
                }
            };

            if(this.mainContent){
                this.metadata.props.main_props = this.mainContent.getMetadata();
            }

            if(this.detailContent){
                this.metadata.props.detail_props = this.detailContent.getMetadata();
            }

            if(context){
                return baseJson.toJson(this.metadata);
            }else{
                return this.metadata;
            }
        }

    });
    return FlipCardItem;
});