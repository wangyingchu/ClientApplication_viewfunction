/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/array", // array.forEach array.indexOf array.map
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dojo/dom-class", // domClass.add domClass.contains
	"dojo/dom-style", // domStyle.set
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/i18n", // i18n.getLocalization
	"dojo/keys", 
	"dojo/on",
	"dojo/query",
	"dojo/touch",
	"dojo/aspect",
	"dojo/sniff",
	"dijit/a11y",
	"dijit/focus",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_CssStateMixin",
	"dijit/Viewport",
    "dojox/mobile/ScrollablePane",
	"../_FlipCardFeatureDetector",
	"../_FlipCardUtils",
    "./_ExpandoPane",
    "./_Tooltip",
    "./NavigationMixin",
	"dojo/text!../templates/_FlipCardNavBase.html",
	"dojo/i18n!../../nls/FlipCard",
    "dojox/html/entities",
    "idx/layout/pluggable/navigator/_ScrollablePane"
], function( array, declare, lang, domClass, domStyle, domConstruct, domGeom, i18n, keys, on, query, touch, aspect, sniff,
		a11y, focus, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _CssStateMixin, Viewport,
		ScrollablePane,
        _FlipCardFeatureDetector, _FlipCardUtils, _ExpandoPane, _Tooltip, NavigationMixin,
        template, i18nFlipCard, entities, _ScrollablePane
	){
		
	// module:
	//		idx/layout/_FlipCardNavBase
	// summary:
	//		navigation base for different navigator types

	/**
	* @name idx.layout._FlipCardNavBase
	* @class navigation base for different navigator types
	* @augments dijit._Widget
	* @augments dijit._TemplatedMixin
	* @augments dijit._WidgetsInTemplateMixin
	* @augments dijit._CssStateMixin
	*/ 
	var proto = {
		/**@lends idx.layout._FlipCardNavBase*/ 
		// summary:
		//		navigation base for different navigator types
		//
		
		templateString: template,
		
		baseClass: "idxFlipCardNavBase",
		
		
		// idProperty: String
		//		Indicates the property to use as the identity property. The values of this
		//		property should be unique.
		idProperty: "id",
		
		// labelAttr: String
		//		Get label from the model using this attribute
		labelAttr: "name",
		
		// labelType: [const] String
		//		Specifies how to interpret the labelAttr in the data store items.
		//		Can be "html" or "text".
		labelType: "text",
		
		// childrenAttrs: String[]
		//		One or more attribute names (attributes in the store item) that specify that item's children
		childrenAttr: "children",
		
		// typeAttr: String[]
		//		type attribute
		typeAttr: "type",
		
		// pressHandlerAttr: String[]
		//		press handler function name
		pressHandlerAttr: "pressHandler",
		
		// cssStateNodes: {
			// "navBar": "idxFlipCardNavBar"
		// },
		
		// navList: [],
		
		// doInitNavItem: Boolean
        //      whether to setup an init nav item.
		doInitNavItem: true,
		
		// customContent: String | reference
        //      the content that user want to import.
		customContent: "",
		
		// customDistribute: Function
        //      override the event distribute way of navigator.
		customDistribute: null,
		
		// navBarDisplayed: Boolean
		//		current nav bar display status.
		navBarDisplayed: true,
		
		// toggleNavBarAction: Boolean
		//		toggle to show the nav bar.
		toggleNavBarAction: false,
		
		// toggleNavBarOnHover: Boolean
		//		toggle to show the nav bar description when mouse hover, only for desktop device.
		toggleNavBarOnHover: false,
		
		
		// navBarWidth: Integer
		//		width of the navigator.
		navBarWidth: 0,
		
		// navBarExtendedWidth: Integer
		//		toggle to extend the nav bar width in px.
		navBarExtendedWidth: 200,
        // navBar expander width default
        // for dynamic gridx only
        navExpanderWidth: 200,
		
		navBarExtended: false,
		navBarExtendedInitial: false,
		
		// navActionHeight: Integer
		//		action node height (px)
		navActionHeight: 30,
		
		animationDuration: 300,
		css3AnimationDisabled: false,
		
		defaultNavToggleMethod: "preview", //toggle, preview
		
		
		displayCloseIcon: false,
		displayPersistenceIcon: true,
		
		// showHoverNavItemDesc: Boolean
		//		hover to see the nav item's desc
		showHoverNavItemDesc: false,
		
		
		cssStateNodes: {
		 	"navBar": "idxFlipCardNavBar"
		},
		
		tabIndex: "0",
		_setTabIndexAttr: "navBar",
        //
        // Default i18 nlsResource
        _nlsResource: i18nFlipCard,

        /** @ignore */
        expandoNode: null,

        scrollBar: null,
		/** @ignore */
		postMixInProperties: function(){
			this.inherited(arguments);
			
			this._nlsResource = i18n.getLocalization("idx/layout", "FlipCard");
			this.navTitle = this.navTitle || this._nlsResource.FlipCardNavBaseTitle;
			
			this.defaultNavToggleMethod = this.defaultNavToggleMethod || "toggle";
			
			this.navBarExtendedInitial = this.navBarExtendedInitial || false;
			
			this.navActionNodes = {};
			
			this.navListNodes = {};
			this.navItemToNodeMap = {};
			this.expandoContentPanes = {};
			this.currentExpandoItem = {};

			//navigation items' store, should be handle per navigation type
			this.navListData = [];
			
			//root nav item navItemDesc node id
			this.navItemDescIDs = [];
		},
        /**
         *
         */
		postCreate: function(){
			this.inherited(arguments);
            //
            // Fix the defect for dojox.mobile.ScrollblePane not support for _CssStateMixin
            //
            this.scrollablePane._subnodeCssMouseEvent = this._subnodeCssMouseEvent;

			this.animationDurationHeritage = this.animationDuration;
			this.applyAnimationDuration();
			//TODO
            this.initializeMenuItemSelection();

            if ( !this.navBarDisabled ){
                this.createNavigationView();
                this.initializeActionBarView();
                this.initializeMenuItems();
                this.initializeContentView();
                //handle css3 animation flag
                this.toggleCSS3Animation(this.css3AnimationDisabled);
                this.initializeExpandoPaneView();
            }

            this.initializeNavigationBarView();
		},

		
		/** @ignore */
		startup: function(){
			if(this._started){ return; }

            // Do recursive sizing and layout of all my descendants
            // (passing in no argument to resize means that it has to glean the size itself)
            this.resize();

            // Since my parent isn't a layout container, and my style *may be* width=height=100%
            // or something similar (either set directly or via a CSS class),
            // monitor when viewport size changes so that I can re-layout.
            var t = this;
            this.own(Viewport.on("resize", lang.hitch(this, "resize")));
            this.navBar.addEventListener("transitionend", function(){});
            if(t.containerNode && t.containerNode.resize){
            	if(!sniff("safari") || sniff("safari")  > 6 ){
                	this.contentNode.addEventListener("transitionend", function(e) {
                		if(t.contentNode == e.target){
                			t.containerNode.resize();
                		}
                    }, true);
                } else {
                	this.contentNode.addEventListener("webkitTransitionEnd", function(e) {
                		if(t.contentNode == e.target){
                			t.containerNode.resize();
                		}
                    }, true);
                }
            }
            this.inherited(arguments);
		},

        /**
         * This is a stub function which will be override by the Child Class
         * It is aimed to render the dom structure for different kinds of Navigation Bar
         */
        createNavigationView: function(){
            //nav bar position
        },
        /**
         *
         */
        initializeMenuItemSelection: function(){
            if(this.navList){
                array.forEach(this.navList, function(item){
                    if(item[this.childrenAttr]){
                        array.forEach(item[this.childrenAttr], function(mItem){
                            if(!this.initItemId){
                                this.initItemId = mItem[this.idProperty];
                            }
                        }, this);

                    }else{
                        if(!this.initItemId){
                            this.initItemId = item[this.idProperty];
                        }
                    }

                    if(!this.selectedNavItemId){
                        this.selectedNavItemId = item[this.idProperty];
                    }

                }, this);

            }
        },
        /**
         * add hover action for every navigation item node
         */
        initializeMenuItems: function(){
            var navListNodes = this.navListNodes;
            if( !_FlipCardUtils.isObjectEmpty() ){

                return;
            }

            //TODO common initialization
            //nav nodes selection
            for(var navId in navListNodes){
                var navNode = navListNodes[navId];

                var commonFunc = lang.hitch(this, function(node, nId, evt){
                    // this._cssMouseEvent(this.navBar, "idxFlipCardNavBar", evt, true);
                    this.selectedNavItemId = nId;

                }, navNode, navId);
                this.own(on(navNode, touch.press, commonFunc) );
                //a11y
                this.own(on(navNode, "keydown", commonFunc) );

            }


            if( this.doInitNavItem ){
                this.handleNavigationDstrProcessById(this.initItemId);
            }
        },
        /**
         *
         */
        initializeContentView: function(){
            if(this.customContent){
                this.containerNode.set("content", this.customContent);
            }
        },
        /**
         *
         */
        initializeNavigationBarView: function(){

            this.toggleNavBarDisplay(this.navBarDisplayed);

            if ( !this.navBarDisabled ){
                /*
                 * do some configuration accroding to user input parameters
                 *
                 */
                var navBarWidth = parseInt(this.navBarExtended ? this.navBarExtendedWidth : this.navBarWidth); 
                //
                // When the navBarWidth == 0, use the css to set the default value
                //
                if ( navBarWidth ){
                    domStyle.set(this.navBar, {
                        width: navBarWidth + "px"
                    });

                    var contentPaddingRight = domStyle.get(this.contentNode, "paddingRight");
                    if(!contentPaddingRight)
                    	contentPaddingRight = 10
                    domStyle.set(this.contentNode, {
                        "paddingLeft" : navBarWidth + contentPaddingRight + "px"
                    });
                }

            }
            else{
                var navBarWidth = 0;
                domStyle.set(this.navBar, {
                    width: navBarWidth + "px"
                });
                var contentPaddingRight = domStyle.get(this.contentNode, "paddingRight");
                domStyle.set(this.contentNode, {
                    "paddingLeft" : contentPaddingRight + "px"
                });
            }

        },
        /**
         * Currently create only Toggle Action Item in the Action Bar
         */
        initializeActionBarView: function(){
            if(this.toggleNavBarAction){
                var toggleNavBarActNode = this.createMenuItemInActionBar({
                    id:"toggleNavBarAction", name:"toggleNavBarAction", //name: "toggle_action", title:"Toggle Action",
                    iconClass:"toggleNavBarActionIcon",  descClass:"toggleNavBarActionDesc"
                });
                this.own(on(toggleNavBarActNode, touch.press, lang.hitch(this, function(evt){
                    this.toggleNavBarExtend();

                    //a11y
                    toggleNavBarActNode.statusVal = !toggleNavBarActNode.statusVal;
                    toggleNavBarActNode.setAttribute("aria-pressed", String(toggleNavBarActNode.statusVal));
                    toggleNavBarActNode.setAttribute("title", toggleNavBarActNode.statusVal?this._nlsResource["FlipCardNav_collapse"]:this._nlsResource["FlipCardNav_expand"]);
                })));
                if(this.toggleNavBarOnHover){
                    this.own(on(toggleNavBarActNode, touch.enter, lang.hitch(this, function(evt){
                        this.toggleNavBarExtend(true);
                    })));
                }

                //a11y
                this.own(on(toggleNavBarActNode, "keydown", lang.hitch(this, function(evt){
                    if(evt.keyCode == keys.ENTER){
                        this.toggleNavBarExtend();
                    }
                })));
            }
        },
        /**
         *
         */
        initializeExpandoPaneView: function(){
            this.expandoNode.toggleDisplayCloseIcon(this.displayCloseIcon);
            this.expandoNode.toggleDisplayPersistenceIcon(this.displayPersistenceIcon);
            this.toggleNavBarExtend(this.navBarExtendedInitial);
            this.navBarExtendedFlag = this.navBarExtended;        
            //a11y
            this.own(on(this.expandoNode.domNode, "keydown", lang.hitch(this, function(evt){
                if(evt.keyCode == keys.ESCAPE){
                    this.expandoNode[this.defaultNavToggleMethod]();
                }
            })));
            aspect.after(this.expandoNode, "_showEnd", lang.hitch(this, function(){
                this.expandoNode._getFocusItems();
                focus.focus(this.expandoNode._firstFocusItem);
            }), true);

        },


        /**
         *
         * @private
         */
		_getFocusItems: function(){
            // summary:
            //      Finds focusable items in grid container,
            //      and sets this._firstFocusItem and this._lastFocusItem
            // tags:
            //      protected

            var elems = a11y._getTabNavigable(this.navBar);
            this._firstFocusItem = elems.lowest || elems.first || this.navBar;
            this._lastFocusItem = elems.last || elems.highest || this._firstFocusItem;
        },
        /**
         *
         * @param evt
         * @private
         */
        _onKey: function(/*Event*/ evt){
            // summary:
            //      Handles the keyboard events for accessibility reasons
            // tags:
            //      private

            if(evt.keyCode == keys.TAB){
                this._getFocusItems(this.navBar);
                var node = evt.target;
                if(this._firstFocusItem == this._lastFocusItem){
                    // don't move focus anywhere, but don't allow browser to move focus off of the grid container either
                    evt.stopPropagation();
                    evt.preventDefault();
                }else if(node == this._firstFocusItem && evt.shiftKey){
                    // if we are shift-tabbing from first focusable item in the grid container, send focus to last item
                    focus.focus(this._lastFocusItem);
                    evt.stopPropagation();
                    evt.preventDefault();
                }else if(node == this._lastFocusItem && !evt.shiftKey){
                    // if we are tabbing from last focusable item in the grid container, send focus to first item
                    focus.focus(this._firstFocusItem);
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            }
        },

        /**
         *
         * @param forceDisable
         */
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
			
			this.applyAnimationDuration();
		},
        /**
         *
         */
		applyAnimationDuration: function(){
			this.expandoNode.duration = this.animationDuration;
		},
        /**
         *
         * @param forceShowHide
         */
		toggleNavBarExtend: function(forceShowHide){
			if(forceShowHide !== undefined){
				this.navBarExtended = forceShowHide ? true : false;
			}else{
				this.navBarExtended = !this.navBarExtended;
			}
			domClass.toggle(this.domNode, "idxFlipCardNavBarExtended", this.navBarExtended);

            var navBarWidth = (this.navBarExtended ? this.navBarExtendedWidth : this.navBarWidth);
            domStyle.set(this.navBar, {
                width: navBarWidth? (navBarWidth + "px") : "",
                "overflow": "visible"
            }); 
        
            //13877 adding padding-left while nav bar extend
            var contentPaddingRight = domStyle.get(this.contentNode, "paddingRight");
            domStyle.set(this.contentNode, {
                "paddingLeft" : navBarWidth? (navBarWidth + contentPaddingRight + "px") : ""
            });
		},
        /**
         *
         * @param item
         * @param refNode
         * @param position
         * @returns {li}
         */
        createMenuItemInActionBar: function(item, refNode, position){
			var itemId = item[this.idProperty];
			if(!itemId){return}
			
			var parentNode = this.navBarActions;
			var itemNode = domConstruct.create("div", {
				className: "navAction " + (item.itemClass || ""),
				tabIndex: 0
			});
			domStyle.set(itemNode, {
				height: this.navActionHeight + "px"
			});
			if(refNode){
				domConstruct.place(itemNode, refNode, position||"before");
			}else{
				domConstruct.place(itemNode, parentNode);
			}
			
			//a11y
			itemNode.setAttribute("role", "button");
			itemNode.setAttribute("aria-controls", this.expandoNode.id);
			itemNode.statusVal = false;
			itemNode.setAttribute("aria-pressed", String(itemNode.statusVal)); 
			itemNode.setAttribute("title", itemNode.statusVal?this._nlsResource["FlipCardNav_collapse"]:this._nlsResource["FlipCardNav_expand"]);
			
			var descNode = domConstruct.create("span", {
				innerHTML: entities.encode(item[this.labelAttr]) || "",
				className: "navActionDesc " + (item.descClass || "")
			}, itemNode);
			
			var iconContainerNode = domConstruct.create("span", {
				className: "navActionIconContainer " + (item.containerClass || "")
			}, itemNode);
            /**
             * remove the title attribute on the iconNode to fix the tvt promblem
             * @type {div}
             */
			var iconNode = domConstruct.create("div", {
				//title: item[this.labelAttr] || item[this.idProperty] || "",
				className: "navActionIcon " + (item.iconClass || "defaultNavActionIcon")
			}, iconContainerNode);
			//a11y
			var a11yNode = domConstruct.create("div", {
				innerHTML: "->",
				className: "navActionIcon_a11y"
			}, iconNode);
			
			this._trackMouseState(itemNode, "navAction");
			
			this.navActionNodes[itemId] = itemNode;
			
			return itemNode;
		},
        /**
         * According to the Item from Navigation List Model, create the Menu Item in the Navigation
         * Bar in the left side
         * @param item
         * @param refNode
         * @param position
         * @returns {li}
         */
		createMenuItemInNavigationBar: function(item, refNode, position){
			var itemId = this.navListModel.getIdentity(item);
			
			var parentNode = (item[this.typeAttr] == "settings") ? this.navBarBottom : this.navBarTop;
			var itemNode = domConstruct.create("div", {
				className: "navItem borderBox" + (item.itemClass || ""),
				tabIndex: 0
			});
			if(refNode){
				domConstruct.place(itemNode, refNode, position||"before");
			}else{
				domConstruct.place(itemNode, parentNode);
				parentNode.setAttribute("role", "tablist");
			}
			itemNode.setAttribute("role", "tab");
			itemNode.itemType = item[this.typeAttr];
			
			var iconContainerNode = domConstruct.create("span", {
				className: "navItemIconContainer " + (item.containerClass || "")
			}, itemNode);
			var iconNode = domConstruct.create("span", {
				// src: item.icon || this._blankGif,
				// title: item[this.labelAttr] || "",
				className: "navItemIcon " + (item.iconClass || "defaultNavItemIcon")
			}, iconContainerNode);
			
			//iconNode.setAttribute("alt", itemId);
			
			var descNode = domConstruct.create("span", {
				innerHTML: entities.encode(item[this.labelAttr]) || "",
				// title: item[this.labelAttr] || "",
				className: "navItemDesc " + (item.descClass || "")
			}, itemNode);
			
			var itemId = item[this.idProperty];
			if(itemId){
				var descNodeid =  "navItemDesc_" + itemId;
				descNode.setAttribute("id", descNodeid);
				this.navItemDescIDs[itemId] = descNodeid;
			}
			
			this._trackMouseState(itemNode, "navItem");
			
			this.navListNodes[itemId] = itemNode;
			
			
			//nav item tooltip on hover
			if(this.showHoverNavItemDesc){
                var navListModel = this.navListModel,
                    navWidget = this,
                    createTooltip = function(){
                        new _Tooltip({
                            label:entities.encode(item[this.labelAttr]),
                            connectId:[itemNode],
                            onCustomerHover: function() {
                                if (!navWidget.navBarExtended) {
                                    return true;
                                }
                                return false;
                            }
                        });
                    };
				if( navListModel.isRootLevelItem(item) && item[this.childrenAttr]){
					//
                    // Add Hover Description for the Nav Item with fly out menu
                    //
                    if (!this.toggleNavBarOnHover) {
                        createTooltip.call(this);
                    }
				}else{
                    createTooltip.call(this);

				}
			}
			
			//item node event
			this.own(on(itemNode, touch.press, lang.hitch(this, function(itemId, evt){
				this.handleNavigationDistributeById(itemId, evt);
			}, itemId)));
			//a11y
			// Feature request 14226 loop for all navActionBar item
			this.getPreviousElementSibling = function(node){
				var p = node.previousElementSibling;
				if(p)
					return p;
				else {
					if(node.itemType == "settings"){
						return this.navBarTop.lastElementChild;
					} else {
						return this.navBarBottom.lastElementChild;
					}
				}
			}
			
			this.getNextElementSibling = function(node){
				var p = node.nextElementSibling;
				if(p)
					return p;
				else {
					if(node.itemType == "settings"){
						return this.navBarTop.firstElementChild;
					} else {
						return this.navBarBottom.firstElementChild;
					}
				}
			}
			
            this.own(on(itemNode, "focusin", lang.hitch(this, function() {
                this.scrollablePane.scrollIntoItemNode(itemNode);
                if (itemNode === this.navBarBottom.lastElementChild) {
                    this.domNode.parentNode.scrollTop = 0;
                }
            })));

			this.own(on(itemNode, "keydown", lang.hitch(this, function(itemId, evt){
				// Feature request 14226 add right arrow action for navActionBaritem
				if(evt.keyCode == keys.ENTER || evt.keyCode == (this.isLeftToRight() ? keys.RIGHT_ARROW : keys.LEFT_ARROW)){
					this.handleNavigationDistributeById(itemId, evt);
				}
				
				// Feature request 14226 add up and down arrow action for navActionBaritem
                if (evt.keyCode == keys.UP_ARROW || evt.keyCode == keys.DOWN_ARROW || evt.keyCode == keys.TAB) {
                    var up = evt.keyCode == keys.UP_ARROW || (evt.shiftKey && evt.keyCode == keys.TAB) ? true : false;
                    var siblingNode;
                    if (up) {
                        if (evt.target === this.navBarTop.firstElementChild && evt.shiftKey && evt.keyCode == keys.TAB) {
                            return;
                        }
                        siblingNode = this.getPreviousElementSibling(evt.target);
                    } else {
                        if (evt.target === this.navBarBottom.lastElementChild && evt.keyCode == keys.TAB) {
                            return;
                        }
                        siblingNode = this.getNextElementSibling(evt.target);
                    }
                    this.scrollablePane.scrollIntoItemNode(siblingNode);
                    focus.focus(siblingNode);
                    evt.stopPropagation();
                    evt.preventDefault();
                }
			}, itemId)));
			
			
			return itemNode;
		},

        /**
         *
         * @param navList
         * @returns {Array|string|dojo|NodeList|*}
         */
		buildNavListData: function(navList){
			var navListData = [];
			navList = navList || this.navList;
			var navListClone = lang.clone(navList);
			navListData =  navListData.concat(navListClone);
			//build all nav page id store

            var childrenAttr = this.childrenAttr;

            var traverseNavigationList = function( item ){
                var children = item[childrenAttr];
                if( children ){
                    navListData = navListData.concat( children );
                    array.forEach( children, function( dItem ){
                        traverseNavigationList(dItem);
                    });
                }
            };
			array.forEach(navListClone, function(item){
                var children = item[childrenAttr];
				if( children ){
					navListData = navListData.concat( children );
					array.forEach( children, function(dItem){
                        traverseNavigationList(dItem);
					});
				}
				item.rootLevel = true;
			});
			
			return navListData;
		},
		
		//for expando
		handleExpandoAction: function(item, evt, args){
			//TODO
			this.handleExpandoAction_stub(item, evt, args);
		},
		//stub function to be connected
		handleExpandoAction_stub: function(item, evt, args){
			//TODO
		},
        /**
         * Only used for the initialize part when navBarDisplayed === true
         */
        navBarExtendedFlag: false,
        /** @ignore */
		toggleNavBarDisplay: function(forceShow){
			if(forceShow !== undefined){
				this.navBarDisplayed = forceShow ? true : false;
			}else{
				this.navBarDisplayed = !this.navBarDisplayed;
			}

            var contentNode = this.contentNode;
            var paddingRight = domStyle.get(contentNode, "paddingRight");
			if(!this.navBarDisabled && this.navBarDisplayed){
				this.toggleNavBarExtend( this.navBarExtendedFlag );
				domClass.remove( this.domNode, "navBarHidden");
				domStyle.set(this.navBar, {
					"display" : ""
				});
			}
			else{
				this.navBarExtendedFlag = this.navBarExtended;
				domClass.add( this.domNode, "navBarHidden");
				domStyle.set(this.navBar, {
					"display" : "none"
				});
			}
			
            var navBarWidth = (this.navBarExtended ? this.navBarExtendedWidth : this.navBarWidth);
            if(this.navBarDisabled || !this.navBarDisplayed){
                navBarWidth = 0;
            }
            var contentPaddingRight = domStyle.get(this.contentNode, "paddingRight");
            domStyle.set(this.contentNode, {
                "paddingLeft" : navBarWidth? (navBarWidth+ contentPaddingRight + "px") : ""
            });
			
			if(this.expandoNode._showing){
				this.expandoNode[this.defaultNavToggleMethod]();
			}
		},

        /**
         *
         * @param item
         * @param evt
         */
        handleNavigationExpando: function(item, evt){
        	var expandoPane = this.expandoNode;
        	
        	 if (this.currentExpandoItem ) {
        		 var lastExpandoItemId = this.currentExpandoItem[this.idProperty];
        		 if(lastExpandoItemId){
        			 domClass.remove(this.navListNodes[lastExpandoItemId], "navItemViewed");
        		 }
             }
        	 
        	expandoPane.doExpand(
                item,
                this.expandoContentPanes,
                this.defaultNavToggleMethod,
                this.idProperty,
                this.labelAttr,
                this.currentExpandoItem[this.idProperty] == item[this.idProperty]);
            this.currentExpandoItem = item;
            var idProperty = this.idProperty,
				itemId = item[idProperty],
				nlNodes = this.navListNodes;
            if ( expandoPane._showing ){
                domClass.add(nlNodes[itemId], "navItemViewed");
            }
            else{
            	domClass.remove(nlNodes[itemId], "navItemViewed");
            }
        },



        resize: function(){
            var nbPos = domGeom.position(this.navBar);


            var scrollablePane = this.scrollablePane.domNode,
                nbaPos = domGeom.position(this.navBarActions),
                nbtPos = domGeom.position(this.navBarTop),
                nbbPos = domGeom.position(this.navBarBottom);

            var scrolConNode = query(".mblScrollableViewContainer", scrollablePane)[0];
            domStyle.set(scrollablePane, {height: nbPos.h + "px"});
            if ( nbPos.h > nbaPos.h + nbtPos.h + nbbPos.h ){
                domStyle.set(scrolConNode, {height: "100%"});
                this.scrollablePane.set("disableTouchScroll", true);
                if (!sniff("mobile")) {   
                    this.scrollablePane.hideVerticalScrollBar();
                }
            }
            else{
                domStyle.set(scrolConNode, {height: nbaPos.h + nbtPos.h + nbbPos.h + "px"});                
                this.scrollablePane.set("disableTouchScroll", false);
                if (!sniff("mobile")) {
                    domClass.add(this.navBar, "standardScroller");
                    this.scrollablePane.showScrollBar();
                }
            }
        },

        /**
         *
         */
        putIntoMenuItemToRootNavMap: function( id, rootId){
            this.menuItemToRootNavMap[id] = rootId;
        },
        /**
         *
         */
        putIntoNavItemNodeMap: function( id, nodeObject ){
            this.navItemToNodeMap[id] = nodeObject;
        },

        /**
         *
         */
        getNodeToNavItem: function( id ){
            return this.navItemToNodeMap[id];
        }
    };

	lang.mixin( proto, NavigationMixin);
	
	return declare("idx/layout/pluggable/navigator/_FlipCardNavBase", 
		[_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _CssStateMixin],
		proto
	);
});