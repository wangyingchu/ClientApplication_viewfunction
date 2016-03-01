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
	"dojo/_base/window",
	"dojo/_base/sniff",
	"dojo/dom-class", // domClass.add domClass.contains
	"dojo/dom-style", // domStyle.set
	"dojo/i18n", // i18n.getLocalization
	"dojo/keys",
	"dojo/on",
	"dojo/hash",
	"dijit/a11y",
	"dijit/focus",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_CssStateMixin",
	"./pluggable/_FlipCardUtils",
    "./pluggable/FlipCardNavigatorAdapter",
	"./pluggable/_FlipCardFeatureDetector",
    "./pluggable/_FlipCardHeader",
    "./pluggable/container/AnimationMixin",
    "./pluggable/AnimationOnOffMixin",
    "./pluggable/MetaDataMixin",
    "./pluggable/ContainerGeneratorMixin",
    "./pluggable/container/NavigationMixin",
	"dojo/text!./templates/FlipCardContainer.html",
	"dojo/i18n!./nls/FlipCard"
	
], function( array, declare, lang, winUtil, has, domClass, domStyle,  i18n, keys, on, hash, 
		a11y, focus, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _CssStateMixin, 
		_FlipCardUtils, FlipCardNavigatorAdapter, _FlipCardFeatureDetector, _FCContainerHeader, AnimationMixin, AnimationOnOffMixin, MetaDataMixin, ContainerGeneratorMixin, NavigationMixin,
		template, i18nFlipCard
	){
	// module:
	//		idx/layout/FlipCardContainer
	// summary:
	//		navigation bar for different page content, each page can be an FlipCardGridContainer or a contentPane

	/**
	* @name idx.layout.FlipCardContainer
	* @class navigation bar for different page content, each page can be an FlipCardGridContainer or a contentPane
	* @augments dijit._Widget
	* @augments dijit._TemplatedMixin
	* @augments dijit._WidgetsInTemplateMixin
	* @augments dijit._CssStateMixin
	*/ 
	
	var proto = {
			/**@lends idx.layout.FlipCardContainer*/ 
			// summary:
			//		navigation bar for different page content, each page can be an FlipCardGridContainer or a contentPane
			//
			//		Example:
			// |	new FlipCardContainer({navList: navigationParams, contentContainerList: contentContainerListParams})
			//
			//		Example:
			// |	<div data-dojo-type='idx.layout.FlipCardContainer' data-dojo-props='navList: navigationParams, contentContainerList: contentContainerListParams'></div>
			
			templateString: template,
			
			baseClass: "idxFlipCardContainer",
			
			// model: String
			//		if equals to view, it will disable the dnd feature.
			model: "edit", //"view", "edit"
			
			// flipCardModelId: String
			//		the key to save the current card layout, e.g. the key to cookie or localStorage/globalStorage.
			flipCardModelId: null,
			
			// includeHeader: Boolean
			//		whether to have header for flip card container.
			includeHeader: false,
			
			// fcContainerTitleHeight: Integer
			//		flip card container's header height.
			//		default value is configured by css
			fcContainerHeaderHeight: 0,
			
			// fcContainerNavBarWidth: Integer
			//		width of flip card's navigator.
			//		default value is configured by css
			fcContainerNavBarWidth: 0,
			
			// navType: String
			//		navigation type.
			navType: "static", //static, dynamic
			


	        // fcContainerNavBarHidden: Boolean
	        //		whether to initialize nav bar.
	        fcContainerNavBarDisabled: false,
			
			// fcContainerNavBarDisplayed: Boolean
			//		whether to have nav bar displayed.
			fcContainerNavBarDisplayed: true,
			
			// fcCntNavBarToggleAction: Boolean
			//		whether to have nav bar displayed.
			fcCntNavBarToggleAction: false,
			
			defaultCntContainerType: "pane", //pane, grid
			
			// navList: [],
			// contentContainerList: {},
			
			// ignoreInitHash: Boolean
			//		whether to ignore the url hash for initialization.
			ignoreInitHash: false,
			
			// idProperty: String
			//		Indicates the property to use as the identity property. The values of this
			//		property should be unique.
			idProperty: "id",
			
			animationDuration: 1000,

	        //
	        // Default Resource for i18n
	        _nlsResource: i18nFlipCard,

	        // instance for NavigatorAdapter
	        navigatorAdapter: null,
			
			// navigationProps: Object
			//		Navigation Parameters for the navigator of this pluggable ui widget
			// navigationProps: {},
			
			// initItemId: "",
			
			/** @ignore */
			postMixInProperties: function(){
				this.inherited(arguments);
				this._nlsResource = i18n.getLocalization("idx/layout", "FlipCard");
				this.fcTitle = this.fcTitle || this._nlsResource.fcTitle;
				this.defaultPageCnt = this.defaultPageCnt || this._nlsResource.DefaultPageContent;
				
				this.navType = this.navType || "static";
				this.navStyle = this.navStyle || "layer";
				
				this.defaultCntContainerType = this.defaultCntContainerType || "pane";
				
				this.idProperty = this.idProperty || "id";
				
				this.navigationProps = this.navigationProps || {};
				
				if(has("mobile")){
					this.includeHeader = true;
				}
				
				this.navigatorAdapter = null;
				
				this.contentContainerList = this.contentContainerList || {};
				
				this.fcContentItems = {};
				this.fcContentContainers = {};
				
				this.initItemId = this.initItemId || "";
				
				this.flipCardModelId = this.flipCardModelId || "flipCardModel_" + this.id;
			},

			/** @ignore */
			postCreate: function(){
				this.inherited(arguments);
				
				this.initFCContainer();
				
				this.animationDurationHeritage = this.animationDuration;
			},
	        /**
	         * Initialize the FlipCard related widget
	         * FlipCardHeader
	         * FlipCardContainers
	         * Do Not append the widget into dom node
	         */
			initFCContainer: function(){
	            if(this.includeHeader){
	                this.initHeader();
	            }

				this.initNavigationWidget();
				
				if(this.contentContainerList){
					this.initContentContainerItems();
				}
			},
	        /**
	         * Header Widget in FlipCard
	         */
			flipCardHeader: null,
			/** @ignore */
			initHeader: function(){
	            var self = this;
				this.flipCardHeader = new _FCContainerHeader({
					label: this.fcTitle,
					rootContainer: this,
	                onToggleButtonClick: function(){

	                    var navigatorAdapter = self.navigatorAdapter;
	                    if ( navigatorAdapter )
	                        navigatorAdapter.doWithAdapter("toggleNavBarDisplay");
	                }
				});

			},
			
			/** @ignore */
			startup: function(){
				if(this._started){ return; }
				
				this.inherited(arguments);

	            if(this.navigatorAdapter ){
	                this.viewport = _FlipCardUtils.getPageViewPort(winUtil.doc);
	                var barWidth = this.fcContainerNavBarWidth;
	                if ( this.fcContainerNavBarDisabled ){
	                    barWidth = 0;
	                }

	                var navigatorAdapter = this.navigatorAdapter,
	                    flipCardHeader = this.flipCardHeader,
	                    navDomNode = navigatorAdapter.doWithAdapter("domNode"),
	                    headerHeight = this.fcContainerHeaderHeight;
	                if(this.includeHeader  ){
	                    var headerNode = this.flipCardHeader.domNode;
	                    if ( headerHeight > 0 ){
	                    	domStyle.set( navDomNode, {
		                        "paddingTop": headerHeight + "px"
		                    });
		                    domStyle.set( headerNode, {
		                        height: headerHeight + "px"
		                    });
	                    } 
	                    
	                    flipCardHeader.placeAt(this.domNode, "first");
	                    flipCardHeader.startup();
	                }
	                else{
	                    domStyle.set( navDomNode, {
	                        "paddingTop": 0
	                    });
	                }


	                navigatorAdapter.doWithAdapter("placeAt", [this.domNode]);
	                navigatorAdapter.doWithAdapter("startup");

	                navigatorAdapter.initHashNavigator( lang.hitch( this, this.handleNavigation) );
	            }


	            //handle css3 animation flag
				this.toggleCSS3Animation(this.css3AnimationDisabled);
				this.own(on(this.domNode, "keydown", lang.hitch(this, "_onKey")));
			},
			
			
			_getFocusItems: function(){
	            // summary:
	            //      Finds focusable items in grid container,
	            //      and sets this._firstFocusItem and this._lastFocusItem
	            // tags:
	            //      protected

	            var elems = a11y._getTabNavigable(this.domNode);
	            this._firstFocusItem = elems.lowest || elems.first || this.domNode;
	            this._lastFocusItem = elems.last || elems.highest || this._firstFocusItem;
	        },
	        /**
	         * Remove Css3 Animation control in the _onKey event handler
	         * @param evt
	         * @private
	         */
	        _onKey: function(/*Event*/ evt){
	            // summary:
	            //      Handles the keyboard events for accessibility reasons
	            // tags:
	            //      private
	            if(evt.keyCode == keys.TAB){
	                this._getFocusItems(this.domNode);
	                var node = evt.target,
	                    firstFocusItem = this._firstFocusItem,
	                    lastFocusItem = this._lastFocusItem;
	                if( firstFocusItem == lastFocusItem ){
	                    // don't move focus anywhere, but don't allow browser to move focus off of the grid container either
	                    evt.stopPropagation();
	                    evt.preventDefault();
	                }else if(node == firstFocusItem && evt.shiftKey){
	                    // if we are shift-tabbing from first focusable item in the grid container, send focus to last item
	                    focus.focus(lastFocusItem);
	                    evt.stopPropagation();
	                    evt.preventDefault();
	                }else if(node == lastFocusItem && !evt.shiftKey){
	                    // if we are tabbing from last focusable item in the grid container, send focus to first item
	                    focus.focus(firstFocusItem);
	                    evt.stopPropagation();
	                    evt.preventDefault();
	                }
	            }

	        },

			
			/** @ignore */
			initNavigationWidget: function(){
				if(this.navList){
					
	                var self = this,
	                	params = lang.mixin({},{
	                    navList: this.navList,
	                    idProperty: this.idProperty,
	                    customDistribute: lang.hitch(this, this.customDistribute),
	                    onNavigationChanged: function(item, e){
	                    	self.handleNavigation(item, e);
	                    },
	                    isNavigationFinished: function(){
	                    	return !self.isInAnimation();
	                    },
	                    doInitNavItem: false,
	                    navBarDisplayed: this.fcContainerNavBarDisplayed,
	                    navBarWidth: this.fcContainerNavBarWidth,
	                    navBarDisabled: this.fcContainerNavBarDisabled,
	                    navExpanderWidth: this.navExpanderWidth,
	                    toggleNavBarAction: this.fcCntNavBarToggleAction,
	                    css3AnimationDisabled: this.css3AnimationDisabled_nav,
	                    initItemId: this.initItemId,
	                    rootContainer: this,
	                    navType: this.navType
	                }, this.navigationProps);

	                this.navigatorAdapter = new FlipCardNavigatorAdapter( params );

	                //this.navigatorAdapter.doWithAdapter("placeAt", [this.domNode, "first"]);
					//this.navigatorAdapter.doWithAdapter("startup");

					this.contentNode = this.navigatorAdapter.doWithAdapter("contentNode");
					this.containerNode = this.navigatorAdapter.doWithAdapter("containerNode");
				}
			},
			
			/** @ignore */
			initContentContainerItems: function(){
				if(_supportCSS3Animation){
					domClass.add(this.containerNode.domNode, "css3Animations");
				}

				if(this.lazyLoading){
					//TODO
				}else{
					for(var key in this.contentContainerList){
						var item = this.contentContainerList[key];
						
						if(item.type == "pane"){
							var paneContainer = this.addCntContainer(key, item, "pane");
							this.containerNode.addChild(paneContainer);
	                        // add the content pane into FlipCardCenterPane
	                        // call resize immediatly to show the pane content
	                        paneContainer.resize();
						}else{ //default is type="grid"
							if(has("phone")){
								item.props.nbZones = 1;
								item.props.editDisabled = true;
							}
							
							var gridContainer = this.addCntContainer(key, item, "grid");
							
							this.containerNode.addChild(gridContainer);
						}
					}
				}

	            //
				//setup default page for nav item which does not have a page
				var navListDataClone = lang.clone( this.navigatorAdapter.doWithAdapter( "buildNavListData" ) );
				array.forEach(navListDataClone, function(navItem){
					if(navItem[this.idProperty] && !this.fcContentContainers[navItem[this.idProperty]]){
	                    var navTypeAttr = this.navigatorAdapter.doWithAdapter("typeAttr");
						if(navItem[navTypeAttr] == "settings"){
							//TODO
						}else if(navItem[navTypeAttr] == "separator"){
							//TODO
						}else{
							if(this.lazyLoading){
								//TODO
							}else{
								this.buildDefaultCntContainer(navItem[this.idProperty], {}, this.defaultCntContainerType);
							}
						}
					}
				}, this);
			},
			
			removeCntContainer: function(key){
				if(!key || !this.fcContentContainers){return}
				if(this.fcContentContainers[key] && this.fcContentContainers[key].destroyRecursive){
					this.fcContentContainers[key].destroyRecursive();
					delete this.fcContentContainers[key];
				}
			},
	        
			buildDefaultCntContainer: function(key, props, cntType, forceOverride){
				var cntContainer = null;
				cntType = cntType || this.defaultCntContainerType;
				if(cntType == "grid"){
					cntContainer = this.addCntContainer(key, {props: lang.mixin({}, {
						nbZones: 2,
						editDisabled: false,
						showContentHeader:true,
						headerParams: {
							content: this.defaultPageCnt
						}
					}, props)}, "grid", forceOverride);
				}else{ //default is "pane"
					cntContainer = this.addCntContainer(key, {props: lang.mixin({}, {
						content: this.defaultPageCnt
					}, props)}, "pane", forceOverride);
				}

	            if ( cntContainer ){
	                //
	                // Fix me!!
	                // for dynamic add FlipCardContainer of default
	                // need to remove the centerGridFlipOut effect in the domNode of cntContainer
	                //
	                this.containerNode.addChild(cntContainer);
	                if(cntContainer.resize){
	                    cntContainer.resize();
	                }
	            }

			},

	        /**
	         *
	         * @param navItemProps
	         * @param cntItemProps
	         */
	        addNavigationItem: function( navItemProps, cntItemProps ){
	            var navigatorAdapter = this.navigatorAdapter;
	            if ( !navigatorAdapter )
	                return;
	            var key = navigatorAdapter.addNavItem( navItemProps );
	            if ( key ){
	            	if (!this.lazyLoading) {
		                if(lang.isObject(cntItemProps) && !_FlipCardUtils.isObjectEmpty(cntItemProps)){
		                    this.buildDefaultCntContainer(key, cntItemProps.props, cntItemProps.cntType, cntItemProps.forceOverride);
		                }else{
		                    this.buildDefaultCntContainer(key, {}, this.defaultCntContainerType);
		                }
	            	}
					this.contentContainerList[key] = cntItemProps;	            }
	        },
	        /**
	         *
	         * @param itemProps
	         */
			removeNavigationItem: function(itemProps){
				if(lang.isObject(itemProps)){
					if(itemProps.itemId){
						this.removeCntContainer(itemProps.itemId);
	                    if ( !this.navigatorAdapter )
	                        return;
	                    var navListModel = this.navigatorAdapter.doWithAdapter("navListModel");
						if( navListModel ){
	                        navListModel.deleteItem(
								itemProps.itemId,
								itemProps.parent,
								itemProps.rootNavItem
							);
						}
					}
				}
			},

			/*
			 * main distribute customization
			 */
			customDistribute: function(item, e){
	            var navListModel = this.navigatorAdapter.doWithAdapter("navListModel"),
	                childrenAttr = this.navigatorAdapter.doWithAdapter("childrenAttr"),
	                typeAttr = this.navigatorAdapter.doWithAdapter("typeAttr");

			    if( navListModel.isRootLevelItem(item) && item[childrenAttr] ){
			        this.navigatorAdapter.doWithAdapter("handleNavigationDstrProcess", [item, e]);
			    }
			    else{
			    	if(item["custom"]){
	                    this.navigatorAdapter.doWithAdapter("handleNavigationDstrProcess",[item, e]);
			    	}
			    	else{
			    		if ( item && item[typeAttr] == "settings" ){
				            this.customSettingsHandler(item, e);
				        }
			    		else{
			    						    			
			    			var id = item[this.idProperty];
			    			if ( id != hash() ) {
			    				hash(id);
			    			}
			    			else{
			    				this.navigatorAdapter.doWithAdapter("handleNavAction", [item]);
			    				var expandoNode = this.navigatorAdapter.doWithAdapter("expandoNode");
			    				if(expandoNode && expandoNode._showing){
			    					expandoNode.toggle();
			    				}
			    			}  
			    		}
	    			  
			    	}
			        
			    }
			},
			
			
			/*
			 * special distribute customization
			 */
			customExpandoHandler: function(item, e){
			    //TODO
			},
	        /**
	         *
	         * @param item
	         * @param e
	         */
			customSettingsHandler: function(item, e){
			    var crntItem = this.navigatorAdapter.doWithAdapter("get",["currentNavItem"]);
			    if(this.fcContentContainers[item[this.idProperty]] && crntItem && crntItem[this.idProperty] != item[this.idProperty]){
			        this.handleNavigation(item, e);
			    }else{

	                var pressHandlerAttr = this.navigatorAdapter.doWithAdapter("pressHandlerAttr"),
	                    expandoNode = this.navigatorAdapter.doWithAdapter("expandoNode");
			        if(item[pressHandlerAttr] && lang.isFunction(item[pressHandlerAttr])){
	                    item[pressHandlerAttr].apply(this, arguments);
	                }
	                if(expandoNode && expandoNode._showing){
	                    expandoNode.toggle();
	                }
	                this.navigatorAdapter.doWithAdapter("handleSettingsAction", [item, e]);
			    }
			},
			
			
			/** @ignore */			
			hideContentPane: function(gItem, gContainer){
				//TODO
				
				this.onContentHide(gItem, gContainer);
			},
			//stub function to connect to
			onContentHide: function(gItem, gContainer){
				//TODO
			},
			
			
			showContentPane: function(gItem, gContainer){
				//TODO
				
				this.onContentShow(gItem, gContainer);
			},
			//stub function to connect to
			onContentShow: function(gItem, gContainer){
				//TODO
			},
			
			/**
			 * flip all the cards in current page.
			 */
			processFlipForCurrentPage: function(e){
				//Stub for flip current page
				if(this.currentCntContainer && this.currentCntContainer.processFlips){
					this.currentCntContainer.processFlips(e);
				}
			},
						
			buildFlipCardContainer: function(fccData){
				if(fccData){
					var preserverNode = this.domNode.parentNode;
					//destroy
					// this.destroyRecursive();
					this.destroyDescendants();
					//build 
					lang.mixin(this, fccData);
					this.initFCContainer();
					this.startup();
					// this = new FlipCardContainer(fccData, preserverNode);
					// this.startup();
				}
			},
			
			destroy: function(){
	            //TODO            
	            this.inherited(arguments);
	            
	            if(this.hashChangeTopic && this.hashChangeTopic.remove){
	            	this.hashChangeTopic.remove();
	            }
	        },
	        
	        
	        destroyDescendants: function(){
	        	if(this.flipCardHeader){
	        		this.flipCardHeader.destroy();
	        		this.flipCardHeader = null;
	        	}
	        	if(this.navigatorAdapter){
	        		this.navigatorAdapter.destroy();
	        		this.navigatorAdapter = null;
	        	}
	        	if(this.fcContentContainers && !_FlipCardUtils.isObjectEmpty(this.fcContentContainers)){
	        		for(var gKey in this.fcContentContainers){
						var gWidget = this.fcContentContainers[gKey];
						gWidget.destroy();
						delete this.fcContentContainers[gKey];
					}
					this.fcContentContainers = {};
	        	}
	        	this._started = false;
	        	
	        	this.inherited(arguments);
	        }
	};
	
	lang.mixin( proto, AnimationOnOffMixin );
	lang.mixin( proto, MetaDataMixin);
	lang.mixin( proto, AnimationMixin);
	lang.mixin( proto, ContainerGeneratorMixin);
	lang.mixin( proto, NavigationMixin);
	
	return declare("idx/layout/FlipCardContainer", 
		[_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _CssStateMixin], 
		proto
	);
});