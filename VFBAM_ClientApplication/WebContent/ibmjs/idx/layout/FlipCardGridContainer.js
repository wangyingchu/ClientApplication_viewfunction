/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/window",
    "dojo/_base/connect",
    "dojo/_base/event",
    "dojo/aspect",
    "dojo/i18n",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/on",
    "dojo/touch",
    "dojo/ready",
    "dojo/keys",
    "dojo/sniff",
    "./pluggable/_GridContainerLite",
    "./pluggable/_ContentHeader",
    "./pluggable/_Moveable",
    "idx/layout/FlipCardItem",
    "./pluggable/_FlipCardUtils",
    "./pluggable/container/grid/GripMixin",
    "./pluggable/container/grid/DockMixin",
    "dojo/i18n!./nls/FlipCard"

],function( lang, declare, array, winUtil, connect, event, aspect, i18n, dom, domClass, domConstruct, domStyle, domGeom, on, touch, ready, keys, has,
		_GridContainerLite, _ContentHeader, _Moveable, FlipCardItem, _FlipCardUtils, GripMixin, DockMixin){
	// module:
    //		idx/layout/FlipCardGridContainer
    // summary:
    //		A grid layout container, which includes flip card widget in it

    /**
     * @name idx.layout.FlipCardGridContainer
     * @class A grid layout container, which includes flip card widget in it
     * @augments idx.layout._GridContainerLite
     */
	var FlipCardGridContainer = declare("idx/layout/FlipCardGridContainer", [_GridContainerLite], {


        /**@lends idx.layout.FlipCardGridContainer*/
        // summary:
        //		A grid layout container, which includes flip card widget in it
        //
        //		Example:
        // |	new FlipCardGridContainer({nbZones: 3,minColWidth: 100,minChildWidth: 100,isAutoOrganized: true})
        //
        //		Example:
        // |	<div data-dojo-type='idx.layout.FlipCardGridContainer' data-dojo-props='nbZones: 3,minColWidth: 100,minChildWidth: 100,isAutoOrganized: true'>
        //			<div data-dojo-type='idx.layout.FlipCardItem' data-dojo-props='maxable:true,flipable:true'></div>
        //			<div data-dojo-type='idx.layout.FlipCardItem' data-dojo-props='maxable:false,flipable:true'></div>
        //			<div data-dojo-type='idx.layout.FlipCardItem' data-dojo-props='maxable:true,flipable:false'></div>
        //		</div>

        // liveResizeColumns: Boolean
        //		the column take resize effect in real time.
        liveResizeColumns : false,

        // minColWidth: Integer
        //		the minimal column width of the grid layout in px.
        minColWidth: 50,

        // minChildWidth: Integer
        //		the minimal card widget width in px.
        minChildWidth: 50,

        // nbZones: Integer
        //      the number of grid column container
        nbZones: 3,

        // mode: String
        //		Location to add/remove columns, must be set to 'left' or 'right' (default).
        mode: "right",

        // isRightFixed: Boolean
        //		Define if the last right column is fixed.
        //		Used when you add or remove columns by calling setColumns method.
        isRightFixed: false,

        // isLeftFixed: Boolean
        //		Define if the last left column is fixed.
        //		Used when you add or remove columns by calling setColumns method.
        isLeftFixed: false,

        // layoutMode: String
        //		The alignment of card widgets inside the grid layout.
        layoutMode: "relative", //absolute, floating

        // dragHandleClass: Array
        //		CSS class enabling a drag handle on a child.
        dragHandleClass: "fpPortletTitle_main fpPortletTitle_detail", //"fpPortletTitle...", "dndBarNode"

        // defaultCardItemWidth & Height: Integer
        //      Card item default width & height inside grid container.
        defaultCardItemWidth: 300,
        defaultCardItemHeight: 280,

        // showContentHeader: Boolean
        //		Whether to show content header
        showContentHeader: false,

        containerType: "grid",

        containerId: "",
        containerName: "",
        containerTitle: "",


        maxItemSwitchMode: "stable", //"stable", "tab"

        //card items
        // items: [],

        //card item relations
        // relations: {},

        // root widget usually the FlipCardContainer
        // flip card container ref
        rootContainer: null,

        animationDuration: 1000,
        css3AnimationDisabled: false,

        // baseClass: "gridContainer flippableGridContainer",

        /**
         * Header Widget
         */
        headerContainer: null,


        /** @ignore */
        postMixInProperties: function(){
            this.inherited(arguments);
            this._nlsResources = i18n.getLocalization("idx/layout", "FlipCard");

            this.stackedCardItems = {};
            this.childItemMaps = {};
            this.headerParams = this.headerParams || {};

            this.items = this.items || [];
            this.relations = this.relations || {};
        },

        /** @ignore */
        postCreate: function(){
            this.inherited(arguments);

            domClass.add(this.domNode, "centerGridContainer borderBox");
            if(_supportCSS3Animation){
                domClass.add(this.domNode, "css3Animations");
            }

            this.animationDurationHeritage = this.animationDuration;

           
            //dnd drag and drop
            //Fix defect 13991, subscribe to specific topic
            this.subscribe("/dojox/mdnd/drag/start/" + this.id, "gridContainerDndStart");
            this.subscribe("/dojox/mdnd/drop/"  + this.id, "gridContainerDndEnd");
        },

        gridContainerDndStart: function(/*Node*/node, /*Object*/sourceArea, /*Integer*/indexChild){
            //TODO
        },

        gridContainerDndEnd: function(/*Node*/node, /*Object*/targetArea, /*Integer*/indexChild){
            //TODO

            this.grid_container_dnd_end({
                node: node,
                targetArea: targetArea,
                indexChild: indexChild
            });
        },

        grid_container_dnd_end: function(dndObj){
            //Stub function
        },
        
        createHeaderContainer: function(){
        	 //title node
            if( !this.headerContainer ){
                var self = this;
                var params = lang.mixin({},{
                    preload:true
                },this.headerParams);
                this.headerContainer = new _ContentHeader(params,
                    domConstruct.create("div", {}, this.domNode, "first")
                );
               
                aspect.after( this.headerContainer, "startup", function(){
                	/**
                     * When Startup, there is some customized widget in the headerContainer
                     * after initializing widgets, call resize the Center Content Pane
                     */
                	
                    self.resize();
                });
                //Fix defect 13956
                this.headerContainer.startup(); 
            }
        },

        /** @ignore */
        startup: function(){
            if(this._started){ return; }
            
            this.createDockContainer();
            
            //add card items
            array.forEach(this.items, function(cItem){
                lang.mixin(cItem.props, {
                    rootContainer: this.rootContainer,
                    dndType: "Portlet",
                    css3AnimationDisabled: this.rootContainer?this.rootContainer.css3AnimationDisabled_card:false,
                    flipCardModel: this.rootContainer?this.rootContainer.model:"edit"
                });

                this.addCardItem(cItem);
            }, this);

            this.createHeaderContainer();
            this.toggleContentHeader(this.showContentHeader);
            
            this.inherited(arguments);
                        
            if(this.hasResizableColumns){
                for(var i = 0; i < this._grid.length - 1; i++){
                    this._createGrip(i);
                }
                // If widget has a container parent, grips will be placed
                // by method onShow.
                if(!this.getParent()){
                    ready(lang.hitch(this, "_placeGrips"));
                }
                //fixed for CSS3 display
                this.onShow();
            }

            //switch layout mode
            if(this.layoutMode != "relative"){
                this.changeLayoutMode(this.layoutMode);

                //TODO
            }

            //handle css3 animation flag
            this.toggleCSS3Animation(this.css3AnimationDisabled);

            //card relationships
            if(this.relations && !_FlipCardUtils.isObjectEmpty(this.relations)){
                for(var relItemName in this.relations){
                    var targets = this.relations[relItemName];
                    if(targets && targets.length > 0){
                        var sourceWidget = this.childItemMaps[relItemName];

                        var targetWidgets = [];
                        array.forEach(targets, function(relTargetItemName){
                            targetWidgets.push(this.childItemMaps[relTargetItemName]);
                        }, this);

                        this.own(on(this.childItemMaps[relItemName].domNode, touch.press, lang.hitch(this, function(tWidgets, evt){
                            this.buildCardItemRelations(tWidgets, evt);
                        }, targetWidgets)));
                        //a11y
                        this.own(on(this.childItemMaps[relItemName].domNode, "keydown", lang.hitch(this, function(tWidgets, evt){
                            if(evt.keyCode == keys.ENTER){
                                this.buildCardItemRelations(tWidgets, evt);
                            }
                        }, targetWidgets)));

                        this.own(on(winUtil.body(), touch.press, lang.hitch(this, function(sWidget, cWidgets, evt){
                            this.clearCardItemRelations(sWidget, cWidgets, evt);
                        }, sourceWidget, this.childItemMaps)));
                        //a11y
                        this.own(on(winUtil.body(), "keydown", lang.hitch(this, function(sWidget, cWidgets, evt){
                            if(evt.keyCode == keys.ENTER || evt.keyCode == keys.ESCAPE){
                                this.clearCardItemRelations(sWidget, cWidgets, evt);
                            }
                        }, sourceWidget, this.childItemMaps)));
                    }
                }
            }

            // this.own(on(this.domNode, "keydown", lang.hitch(this, "_onKey")));
            /**
             * Fix me
             * Solve no scroll bar when startup
             */
            this.resize();
        },

        buildCardItemRelations: function(tWidgets, evt){
            array.forEach(tWidgets, function(tw){
                domClass.add(tw.domNode, "relationshipFigure");
            }, this);
        },

        clearCardItemRelations: function(sWidget, cWidgets, evt){
            if(dom.isDescendant(evt.target, sWidget.domNode)){
                return;
            }
            for(var cwKey in cWidgets){
                domClass.remove(cWidgets[cwKey].domNode, "relationshipFigure");
            }
        },

        toggleContentHeader: function(forceShow){
            if(forceShow !== undefined){
                this.showContentHeader = forceShow ? true : false;
            }else{
                this.showContentHeader = !this.showContentHeader;
            }

            if(this.showContentHeader){
                domClass.add(this.headerContainer.domNode, "headerContainerVisible");
                domClass.add(this.domNode, "gridHeaderVisible");
            }else{
                domClass.remove(this.headerContainer.domNode, "headerContainerVisible");
                domClass.remove(this.domNode, "gridHeaderVisible");
            }
        },

        getGridContentSize: function(){
            return domGeom.position(this.gridContainerDiv);
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

        _onKey: function(/*Event*/ evt){
            // summary:
            //      Handles the keyboard events for accessibility reasons
            // tags:
            //      private

            if(evt.keyCode == keys.TAB){
                this._getFocusItems(this.domNode);
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


        reOrganizeChildren: function(){
            this.disableDnd();
            this._organizeChildren();
            this.enableDnd();
        },

        /**
         * flip all the cards inside the grid container.
         */
        processFlips: function(e){
            //Stub for manually handle flips inside container
            var childPItemWidgets = this.getChildren();
            array.forEach(childPItemWidgets, function(card){
                card.processFlip(e);
            }, this);
        },

        /**
         * switch layout mode, from default to absolute, floating.....
         */
        changeLayoutMode: function(mode){
            var childPItemWidgets = this.getChildren();
            if(mode == "absolute"){
                this.disableDnd();
                array.forEach(childPItemWidgets, function(card){
                    domClass.add(card.domNode, "layoutAbsolute");
                    //set card item style
                    domStyle.set(card.domNode, {
                        width: this.defaultCardItemWidth + "px",
                        height: this.defaultCardItemHeight + "px"
                    });
                    var mov = new _Moveable({},card.domNode);
                    this.own(on(card.domNode, touch.press, lang.hitch(this, function(evt){
                        this._changeFlipCardItemZIndex(card, childPItemWidgets);
                        evt && event.stop(evt);
                    })));
                    //a11y
                    this.own(on(card.domNode, "keydown", lang.hitch(this, function(evt){
                        if(evt.keyCode == keys.ENTER){
                            this._changeFlipCardItemZIndex(card, childPItemWidgets);
                            evt && event.stop(evt);
                        }
                    })));
                }, this);
                domClass.add(this.gridNode, "layoutAbsolute");
                domClass.add(this.gridContainerTable, "layoutAbsolute");
            }else if(mode == "floating"){
                this.disableDnd();
                //card
                array.forEach(childPItemWidgets, function(card){
                    domClass.add(card.domNode, "layoutFloating");
                    //set card item style
                    domStyle.set(card.domNode, {
                        width: this.defaultCardItemWidth + "px",
                        height: this.defaultCardItemHeight + "px"
                    });
                    this._insertChild(card, 0);
                }, this);
                array.forEach(childPItemWidgets, function(card){
                    card.startup();
                }, this);
                //column
                var zone = this._grid[0].node;
                array.forEach(this._grid, function(dropZone, index){
                    if(index == 0){
                        domClass.add(dropZone.node, "layoutFloating");
                    }else{
                        domClass.add(dropZone.node, "dijitHidden");
                    }
                });
                //grid container
                domClass.add(this.gridNode, "layoutFloating");
                domClass.add(this.gridContainerTable, "layoutFloating");

                //enable dnd at last
                this.enableDnd();
            }else if(mode == "relative"){
                array.forEach(childPItemWidgets, function(card){
                    domClass.remove(card.domNode, "layoutAbsolute layoutFloating");
                }, this);
                domClass.remove(this.gridNode, "layoutAbsolute layoutFloating");
                domClass.remove(this.gridContainerTable, "layoutAbsolute layoutFloating");
                this.enableDnd();
                //TODO
            }
            this.layoutMode = mode || "relative";
            // this._set("layoutMode", mode);
        },

        /**
         * push the card widget to the front.
         * @param {Object} card
         * @param {Array} cardItems
         * @private
         */
        _changeFlipCardItemZIndex: function(card, cardItems){
            cardItems = cardItems || this.getChildren();
            var maxZIndex = 1 + Math.max.apply(null, array.map(cardItems, function(cItem){
                return domStyle.get(cItem.domNode, "zIndex");
            }));
            domStyle.set(card.domNode, {
                zIndex: maxZIndex
            });
        },

        resizeChildAfterDrop : function(/*Node*/node, /*Object*/targetArea, /*Integer*/indexChild){
            if(this.inherited(arguments)){
                this._placeGrips();
            }
        },

        addChild: function(/*Object*/child, /*Integer?*/column, /*Integer?*/p){
            this.inherited(arguments);
            if(child.itemName){
                this.childItemMaps[child.itemName] = child;
            }
            return child;
        },
        /**
         *
         * @param widget
         */
        removeChild: function(/*Widget*/ widget){
            this.inherited(arguments);
            if(widget && widget.itemName){
                if(widget.destroyRecursive){
                    widget.destroyRecursive();
                }
                delete this.childItemMaps[widget.itemName];
            }
        },
        /**
         *
         * @param item
         * @returns {*}
         */
        addCardItem: function(/*Object*/item){
            if(!item){return}
            //
            // Check item exist for dynamically append new Card item to container
            //
            var bExist = this.items.indexOf( item ) >= 0;
            if ( !bExist ){
            	this.items.push( item );
            }
            //generate card name (GUID)
            if(!item.name){
                item.name = _FlipCardUtils.generateGUID();
            }
            if(this.childItemMaps[item.name]){
                //item exist
                return;
            }
            var self = this;
            var portletItemProps = lang.mixin({
                sizeReferenceNode: this.sizeReferenceNode
            }, {
                itemName: item.name,
                // toggleable: false,
                closable: false,
                dndType: "Portlet",
                initItemStatus: "normal",
                findGridContainer: function( ){
                    return self;
                },
                calBeforeResize: function( refNode ){
                    /**
                     * use gridGeom minus header and dock pane size
                     * 34 -- HeaderContainer Height
                     * 26 -- Dock Container Height
                     * 20 -- Top and Bottom Margin Size for FlipCardItem in maximum mode
                     * 2  -- Top and Bottom Border Size for Dock Container
                     * 20 -- Top and Bottom Padding for FlipCardItemWrapper
                     * @type {{w: number, h: number}}
                     *
                     * As can not get the real size of HeaderContainer and DockContainer, so make
                     * them size as a fixed value
                     */
                    var refNode = refNode, headerGeom = {w:0,h:0}, dockGeom = {w:0,h:0};
                    if ( self.headerContainer )
                        headerGeom = domGeom.getMarginBox( self.headerContainer.domNode );
                    if ( self.dockContainer )
                        dockGeom = domGeom.getMarginBox( self.dockContainer.domNode );
                    var refGeom = domGeom.getMarginBox( refNode),
                        gridNode = self.gridContainerDiv,
                        gridMarginHeight = domStyle.get(gridNode, "marginTop") + domStyle.get(gridNode, "marginBottom") ;
                    var targetGeom = {
                        w: 'auto',
                        h: refGeom.h-( headerGeom.h + dockGeom.h + gridMarginHeight )
                    };
                    return targetGeom;
                }
            }, item.props);
            var portletItem = new FlipCardItem(portletItemProps);

            var childCardItem = null;
            if(item.itemPosition && typeof item.itemPosition.column == "number"){
                childCardItem = this.addChild(portletItem, item.itemPosition.column, item.itemPosition.p);
            }else{
                childCardItem = this.addChild(portletItem);
            }
            
            // Defect 13978 reset position in the same column
            var column = childCardItem.get("column");
            if(typeof(column) == "number"){
            	this.resetPositionInColumn(column);
            }

            if(this.layoutMode == "floating" || this.layoutMode == "absolute"){
                if(item.itemGeomProps){
                    domGeom.setMarginBox(childCardItem.domNode, item.itemGeomProps);
                }
            }

            return childCardItem;
        },
        /**
         *
         * @param item
         */
        updateCardItem: function(/*Object*/item){
            if(!item || !item.name){return}
            if(!this.childItemMaps[item.name]){
                //item does not exist
                return;
            }

            var cardWidget = this.childItemMaps[item.name];

            //update card data
            if(item.props.minable !== undefined){
                cardWidget.set("minable", item.props.minable);
            }
            if(item.props.maxable !== undefined){
                cardWidget.set("maxable", item.props.maxable);
            }
            if(item.props.stackable !== undefined){
                cardWidget.set("stackable", item.props.stackable);
            }
            if(item.props.closable !== undefined){
                cardWidget.set("closable", item.props.closable);
            }
            if(item.props.cardFlipAction !== undefined){
                cardWidget.set("cardFlipAction", item.props.cardFlipAction);
            }


            //for main content
            if(item.props.main_props && cardWidget.mainContent){
                if(item.props.main_props.title !== undefined){
                    cardWidget.mainContent.set("title", item.props.main_props.title);
                }
                if(item.props.main_props.content !== undefined){
                    cardWidget.mainContent.set("content", item.props.main_props.content);
                }
                if(item.props.main_props.href !== undefined){
                    cardWidget.mainContent.set("href", item.props.main_props.href);
                }
            }

            //for detail content
            if(item.props.detail_props && cardWidget.detailContent){
                if(item.props.detail_props.title !== undefined){
                    cardWidget.detailContent.set("title", item.props.detail_props.title);
                }
                if(item.props.detail_props.content !== undefined){
                    cardWidget.detailContent.set("content", item.props.detail_props.content);
                }
                if(item.props.detail_props.href !== undefined){
                    cardWidget.detailContent.set("href", item.props.detail_props.href);
                }
            }

            //for main & detail settings
            //TODO

        },
        removeCardItem: function(/*String*/itemName){
            if(!itemName){return}
            if(!this.childItemMaps[itemName]){
                //item does not exist
                return;
            }

            var widget = this.childItemMaps[itemName];
            if(widget){
                this.removeChild(widget);
            }

            if(this.stackedCardItems && this.stackedCardItems[itemName]){
                this.removeStackedCardItem(itemName);
            }

        },

        onShow: function(){
            this.inherited(arguments);
            this._placeGrips();
        },
        /**
         * resize logic:
         *      only resize the height of gridContainerDiv node when in the grid normal(not max) view
         */
        resize: function(){
            // resize logic
            // Fix me!!! There is some code to change the dom node of the GridContainer
            // first to remove the size style
            domStyle.set(this.domNode, {
                width: "auto",
                height: "auto"
            });

            // new layout logic
            // set the dojo-attach-point gridContainerDiv geometry
            // height(gridContainerDiv) = height(this.domNode) - height(this.headerContainer.domNode) - height(this.dockConainer.domNode)

            var gridNode = this.gridContainerDiv,
                domNode = this.domNode,
                headerNode = this.headerContainer.domNode,
                dockNode = this.dockContainer.domNode;
            if ( !domClass.contains(this.domNode, "gridContainerMaximum") ){
                //
                // only resize the GridContainer when the FlipCardItem in normal size
                //
                var totalHeight = domGeom.position(domNode).h,
                    headerHeight = domGeom.getMarginBox(headerNode).h,
                    dockHeight = domGeom.getMarginBox(dockNode).h,
                    gridHeight = totalHeight - headerHeight - dockHeight;

                //
                // The following code is only for resizing feature when debug usage
                //
                /*var node = this.getParent().domNode;
                 console.log("parent node height:" + domGeom.position(node).h );
                 console.log("dom node height:" + totalHeight + "|" +
                 "header node height:" + headerHeight + "|" +
                 "dock node height:" + dockHeight + "|" +
                 "grid height: " + gridHeight
                 );*/
                var gridMarginHeight = domStyle.get(gridNode, "marginTop") + domStyle.get(gridNode, "marginBottom");
                domStyle.set(gridNode, {
                    height: (gridHeight - gridMarginHeight) + "px",
                    "overflowY": true
                })

            }

            this.inherited(arguments);
        },

 
        setColumns: function(/*Integer*/nbColumns){
            var z, j;
            if(nbColumns > 0){
                var length = this._grid.length,
                    delta = length - nbColumns;
                if(delta > 0){
                    var count = [], zone, start, end, nbChildren;
                    // Check if right or left columns are fixed
                    // Columns are not taken in account and can't be deleted
                    if(this.mode == "right"){
                        end = (this.isLeftFixed && length > 0) ? 1 : 0;
                        start = (this.isRightFixed) ? length - 2 : length - 1
                        for(z = start; z >= end; z--){
                            nbChildren = 0;
                            zone = this._grid[z].node;
                            for(j = 0; j < zone.childNodes.length; j++){
                                if(zone.childNodes[j].nodeType == 1 && !(zone.childNodes[j].id == "")){
                                    nbChildren++;
                                    break;
                                }
                            }
                            if(nbChildren == 0){ count[count.length] = z; }
                            if(count.length >= delta){
                                this._deleteColumn(count);
                                break;
                            }
                        }
                        if(count.length < delta){
                            connect.publish("/dojox/layout/gridContainer/noEmptyColumn", [this]);
                        }
                    }
                    else{ // mode = "left"
                        start = (this.isLeftFixed && length > 0) ? 1 : 0;
                        end = (this.isRightFixed) ? length - 1 : length;
                        for(z = start; z < end; z++){
                            nbChildren = 0;
                            zone = this._grid[z].node;
                            for(j = 0; j < zone.childNodes.length; j++){
                                if(zone.childNodes[j].nodeType == 1 && !(zone.childNodes[j].id == "")){
                                    nbChildren++;
                                    break;
                                }
                            }
                            if(nbChildren == 0){ count[count.length] = z; }
                            if(count.length >= delta){
                                this._deleteColumn(count);
                                break;
                            }
                        }
                        if(count.length < delta){
                            //Not enough empty columns
                            connect.publish("/dojox/layout/gridContainer/noEmptyColumn", [this]);
                        }
                    }
                }
                else{
                    if(delta < 0){ this._addColumn(Math.abs(delta)); }
                }
                if(this.hasResizableColumns){ this._placeGrips(); }

                this.onColumnsChange(nbColumns);
            }
        },

        onColumnsChange: function(nbColumns){
            //callback function
        },

        _addColumn: function(/*Integer*/nbColumns){
            var grid = this._grid,
                dropZone,
                node,
                index,
                length,
                isRightMode = (this.mode == "right"),
                accept = this.acceptTypes.join(","),
                m = this._dragManager;

            //Add a grip to the last column
            if(this.hasResizableColumns && ((!this.isRightFixed && isRightMode)
                || (this.isLeftFixed && !isRightMode && this.nbZones == 1) )){
                this._createGrip(grid.length - 1);
            }

            for(var i = 0; i < nbColumns; i++){
                // Fix CODEX defect #53025 :
                //		Apply acceptType attribute on each new column.
                node = domConstruct.create("div", {
                    'class': "gridContainerZone dojoxDndArea fpGridContainerZone" ,
                    'accept': accept,
                    columnIndex: this._grid.length ? this._grid.length + i:i,
                    'id': this.id + "_dz" + this.nbZones
                });

                length = grid.length;

                if(isRightMode){
                    if(this.isRightFixed){
                        index = length - 1;
                        grid.splice(index, 0, {
                            'node': grid[index].node.parentNode.insertBefore(node, grid[index].node)
                        });
                    }
                    else{
                        index = length;
                        grid.push({ 'node': this.gridNode.appendChild(node) });
                    }
                }
                else{
                    if(this.isLeftFixed){
                        index = (length == 1) ? 0 : 1;
                        this._grid.splice(1, 0, {
                            'node': this._grid[index].node.parentNode.appendChild(node, this._grid[index].node)
                        });
                        index = 1;
                    }
                    else{
                        index = length - this.nbZones;
                        this._grid.splice(index, 0, {
                            'node': grid[index].node.parentNode.insertBefore(node, grid[index].node)
                        });
                    }
                }
                if(this.hasResizableColumns){
                    //Add a grip to resize columns
                    if((!isRightMode && this.nbZones != 1) ||
                        (!isRightMode && this.nbZones == 1 && !this.isLeftFixed) ||
                        (isRightMode && i < nbColumns-1) ||
                        (isRightMode && i == nbColumns-1 && this.isRightFixed)){
                        this._createGrip(index);
                    }
                }
                // register tnbZoneshe new area into the areaManager
                m.registerByNode(grid[index].node);
                this.nbZones++;
            }
            this._updateColumnsWidth(m);
        },

        _deleteColumn: function(/*Array*/indices){
            var child, grid, index,
                nbDelZones = 0,
                length = indices.length,
                m = this._dragManager;
            for(var i = 0; i < length; i++){
                index = (this.mode == "right") ? indices[i] : indices[i] - nbDelZones;
                grid = this._grid[index];

                if(this.hasResizableColumns && grid.grip){
                    array.forEach(grid.gripHandler, function(handler){
                        connect.disconnect(handler);
                    });
                    domConstruct.destroy(this.domNode.removeChild(grid.grip));
                    grid.grip = null;
                }

                m.unregister(grid.node);
                domConstruct.destroy(this.gridNode.removeChild(grid.node));
                this._grid.splice(index, 1);
                this.nbZones--;
                nbDelZones++;
            }

            // last grip
            var lastGrid = this._grid[this.nbZones-1];
            if(lastGrid.grip){
                array.forEach(lastGrid.gripHandler, connect.disconnect);
                domConstruct.destroy(this.domNode.removeChild(lastGrid.grip));
                lastGrid.grip = null;
            }

            this._updateColumnsWidth(m);
        },

        _updateColumnsWidth: function(/*Object*/ manager){
            this.inherited(arguments);
            manager._dropMode.updateAreas(manager._areaList);
        },


        getMetadata_Items: function(context){
            this.metadata_items = {};

            //card item positions
            if(this.childItemMaps && !_FlipCardUtils.isObjectEmpty(this.childItemMaps)){
                for(var itemName in this.childItemMaps){
                    var cardWidget = this.childItemMaps[itemName];
                    this.metadata_items[itemName] = this.getCardItemPos(cardWidget);
                }
            }

            if(context){
                return baseJson.toJson(this.metadata_items);
            }else{
                return this.metadata_items;
            }
        },



        getMetadata: function(context){
            this.metadata = {
                id: this.containerId,
                name: this.containerName,
                title: this.containerTitle,
                type: this.containerType,
                relations: this.relations,
                props:{
                    hasResizableColumns: this.hasResizableColumns,
                    liveResizeColumns : this.liveResizeColumns,
                    dockVisible: this.dockVisible,
                    dockBehavior: this.dockBehavior,
                    dockOverlay: this.dockOverlay,
                    minColWidth: this.minColWidth,
                    minChildWidth: this.minChildWidth,
                    nbZones: this.nbZones,
                    mode: this.mode,
                    isRightFixed: this.isRightFixed,
                    isLeftFixed: this.isLeftFixed,
                    layoutMode: this.layoutMode,
                    dragHandleClass:this.dragHandleClass,
                    defaultCardItemWidth: this.defaultCardItemWidth,
                    defaultCardItemHeight: this.defaultCardItemHeight,
                    showContentHeader: this.showContentHeader,
                    containerType: this.containerType,
                    editDisabled: this.editDisabled,
                    maxItemSwitchMode: this.maxItemSwitchMode,
                    animationDuration: this.animationDuration,
                    css3AnimationDisabled: this.css3AnimationDisabled,
                    //positions are saved, no need to re-organize
                    isAutoOrganized: false
                }
            };

            //header
            if(this.headerParams && !_FlipCardUtils.isObjectEmpty(this.headerParams)){
                this.metadata.props.headerParams = this.headerContainer.getMetadata();
            }

            //card item positions
            if(this.childItemMaps && !_FlipCardUtils.isObjectEmpty(this.childItemMaps)){
                this.metadata.items = [];
                for(var itemName in this.childItemMaps){
                    var cardWidget = this.childItemMaps[itemName];
                    var cardItemMetadata = cardWidget.getMetadata();

                    lang.mixin(cardItemMetadata, this.getCardItemPos(cardWidget));

                    this.metadata.items.push(cardItemMetadata);
                }
            }

            if(context){
                return baseJson.toJson(this.metadata);
            }else{
                return this.metadata;
            }
        },

        getCardItemPos: function(cardWidget){
            var itemPos = {};

            //get the new position info after dnd
            itemPos.itemGeomProps = domGeom.getContentBox(cardWidget.domNode);
            if(this.layoutMode == "absolute" || this.layoutMode == "floating"){
                //TODO
            }
            else{
                itemPos.itemPosition = {
                    column: cardWidget.get("column"),
                    p: this.getItemPosIndex(cardWidget)
                }
            }

            return itemPos;
        },
        /**
         * 
         */
        getItemPosIndex: function(item){
            var node = item.domNode, position = 0;
            
            while(node.previousSibling){
                position++;
                node = node.previousSibling;
            }
            item.set("p", position);
            return position;
        }

    });
	
	lang.extend( FlipCardGridContainer, GripMixin );
	lang.extend( FlipCardGridContainer, DockMixin );
	
	return FlipCardGridContainer;

});