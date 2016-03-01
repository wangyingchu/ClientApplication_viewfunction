/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/_base/xhr",
    "dojo/_base/lang",
    "dojo/_base/sniff",
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/_base/event",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/on",
    "dojo/touch",
    "dojo/dom-geometry",
    "dojo/_base/fx",
    "dojo/fx",
    "dijit/registry",
    "dijit/a11y",
    "dijit/_Contained",
    "dijit/_Container",
    "dijit/layout/ContentPane",
    "dijit/_TemplatedMixin",
    "dojox/html/_base",
    "dojo/text!../templates/NavigationPane.html",
    "dojox/html/entities"
],function(declare, xhrUtil, lang, has, array, connect, event, domAttr, domClass, domStyle, on, touch, domGeom, baseFx, coreFx, registry, a11y, _Contained, _Container, ContentPane, _TemplatedMixin, dojoxHtmlUtil, navTemplate, entities){

    var _ContentPane = declare("idx/layout/_ContentPane", ContentPane, {
        adjustPaths: false,
        cleanContent: false,
        renderStyles: false,
        executeScripts: true,
        scriptHasHooks: false,

        _setFocusAttr: "domNode",

        ioMethod: xhrUtil.get,

        ioArgs: {},

        postCreate: function(){
            this.inherited(arguments);

        },

        startup: function(){
            this.inherited(arguments);

            // this.own(on(this.domNode, "keydown", lang.hitch(this, "_onKey")));

            //a11y
            domAttr.set(this.domNode, {
                tabIndex: -1
            });
        },

        _getFocusItems: function(){
            // summary:
            //      Finds focusable items in pane container,
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

        destroy: function(){
            //TODO

            this.inherited(arguments);
        },

        onExecError: function(/*Event*/ e){
        },

        _setContent: function(cont){
            var setter = this._contentSetter;
            if(! (setter && setter instanceof dojoxHtmlUtil._ContentSetter)) {
                setter = this._contentSetter = new dojoxHtmlUtil._ContentSetter({
                    node: this.containerNode,
                    _onError: lang.hitch(this, this._onError),
                    onContentError: lang.hitch(this, function(e){
                        var errMess = this.onContentError(e);
                        try{
                            this.containerNode.innerHTML = errMess;
                        }catch(e){
                            console.error('Fatal '+this.id+' could not change content due to '+e.message, e);
                        }
                    })
                });
            };

            this._contentSetterParams = {
                adjustPaths: Boolean(this.adjustPaths && (this.href||this.referencePath)),
                referencePath: this.href || this.referencePath,
                renderStyles: this.renderStyles,
                executeScripts: this.executeScripts,
                scriptHasHooks: this.scriptHasHooks,
                scriptHookReplacement: "dijit.byId('"+this.id+"')"
            };

            this.inherited("_setContent", arguments);
        }
    });



    var _ExpandoPane = declare("idx/layout/_ExpandoPane", [_ContentPane, _TemplatedMixin, _Contained, _Container], {
        attributeMap: lang.delegate(ContentPane.prototype.attributeMap, {
            title: { node: "titleNode", type: "innerHTML" }
        }),
        templateString: navTemplate,
        easeOut: "baseFx._DefaultEasing",
        easeIn: "baseFx._DefaultEasing",
        duration: 420,
        startExpanded: true,
        previewOpacity: 0.75,
        previewOnDblClick: false,
        tabIndex: "0",
        _setTabIndexAttr: "iconNode",
        baseClass: "dijitExpandoPane",
        miniModeHeight: "50%",

        displayCloseIcon: false,
        displayPersistenceIcon: true,
        /**
         *
         */
        postCreate: function(){
            this.inherited(arguments);
            this._animConnects = [];
            this._isHorizontal = true;

            if(lang.isString(this.easeOut)){
                this.easeOut = lang.getObject(this.easeOut);
            }
            if(lang.isString(this.easeIn)){
                this.easeIn = lang.getObject(this.easeIn);
            }

            var thisClass = "", rtl = !this.isLeftToRight();
            if(this.region){
                switch(this.region){
                    case "trailing" :
                    case "right" :
                        thisClass = rtl ? "Left" : "Right";
                        this._needsPosition = "left";
                        break;
                    case "leading" :
                    case "left" :
                        thisClass = rtl ? "Right" : "Left";
                        break;
                    case "top" :
                        thisClass = "Top";
                        break;
                    case "bottom" :
                        this._needsPosition = "top";
                        thisClass = "Bottom";
                        break;
                }
                domClass.add(this.domNode, "dojoxExpando" + thisClass);
                domClass.add(this.iconNode, "dojoxExpandoIcon" + thisClass);
                this._isHorizontal = /top|bottom/.test(this.region);
            }
            domStyle.set(this.domNode, {
                overflow: "hidden",
                padding:0
            });

            this.connect(this.domNode, "ondblclick", this.previewOnDblClick ? "preview" : "toggle");
            this.iconNode.setAttribute("aria-controls", this.id);
            if(this.previewOnDblClick){
                this.connect(this.getParent(), "_layoutChildren", lang.hitch(this, function(){
                    this._isonlypreview = false;
                }));
            }

            this.own(on(this.iconPersistenceNode, touch.press, lang.hitch(this, function(evt){
                this.togglePersistence();
            })));
            //a11y
            this.own(on(this.iconPersistenceNode, "keydown", lang.hitch(this, function(evt){
                if(evt.keyCode == keys.ENTER){
                    this.togglePersistence();
                }
            })));

            this.toggleDisplayCloseIcon(this.displayCloseIcon);
            this.toggleDisplayPersistenceIcon(this.displayPersistenceIcon);

            //a11y
            this.domNode.setAttribute("role", "tabpanel");


        },

        startup: function(){
            this.inherited(arguments);
            //
            // hide the ExpandoPane before startup
            //
            this._startupSizes();
            domStyle.set( this.domNode, "display", "none");
        },

        togglePersistence: function(force){
            if(force !== undefined){
                this.persistence = force;
            }else{
                this.persistence = !this.persistence;
            }
            domClass.toggle(this.iconPersistenceNode, "persistence", this.persistence);
        },

        toggleDisplayPersistenceIcon: function(force){
            if(force !== undefined){
                this.displayPersistenceIcon = force;
            }else{
                this.displayPersistenceIcon = !this.displayPersistenceIcon;
            }
            domClass.toggle(this.iconPersistenceNode, "FlipCardHiddenElement", !this.displayPersistenceIcon);
        },

        toggleDisplayCloseIcon: function(force){
            if(force !== undefined){
                this.displayCloseIcon = force;
            }else{
                this.displayCloseIcon = !this.displayCloseIcon;
            }
            domClass.toggle(this.iconNode, "FlipCardHiddenElement", !this.displayCloseIcon);
        },
        /**
         *
         * @private
         */
        _startupSizes: function(){
            this._container = this.getParent();
            this._titleHeight = domGeom.getMarginBox(this.titleWrapper).h;
            this._closedSize = 0;

            if(this.splitter){
                var myid = this.id;
                array.forEach(registry.toArray(), function(w){
                    if(w && w.child && w.child.id == myid){
                        this.connect(w,"_stopDrag","_afterResize");
                    }
                }, this);
            }
            // TODO: can compute this from passed in value to resize(), see _LayoutWidget for example
            this._currentSize = domGeom.getContentBox(this.domNode);
            this._showSize = this._currentSize[(this._isHorizontal ? "h" : "w")];
            if(has("phone")){
                this._showSize = 200;
            }
            this._setupAnims();

            if(this.startExpanded){
                this._showing = true;
            }else{
                this._showing = false;
                this._hideAnim.gotoPercent(99,true);
            }

            this.domNode.setAttribute("aria-expanded", this._showing);
            this._hasSizes = true;
        },

        _afterResize: function(e){
            var tmp = this._currentSize;						// the old size
            this._currentSize = domGeom.getMarginBox(this.domNode);	// the new size
            var n = this._currentSize[(this._isHorizontal ? "h" : "w")];
            if(n > this._titleHeight){
                if(!this._showing){
                    this._showing = !this._showing;
                    this._showEnd();
                }
                this._showSize = n;
                this._setupAnims();
            }else{
                this._showSize = tmp[(this._isHorizontal ? "h" : "w")];
                this._showing = false;
                this._hideAnim.gotoPercent(89,true);
            }
        },

        _setupAnims: function(){
            array.forEach(this._animConnects, connect.disconnect);

            var _common = {
                    node:this.domNode,
                    duration:this.duration
                },
                isHorizontal = this._isHorizontal,
                showProps = {},
                showSize = this._showSize,
                hideSize = this._closedSize,
                hideProps = {},
                dimension = isHorizontal ? "height" : "width",
                also = this._needsPosition
                ;
                
            showProps[dimension] = {
                end: showSize
            };
            hideProps[dimension] = {
                end: hideSize
            };

            if(also){
                showProps[also] = {
                    end: function(n){
                        var c = parseInt(n.style[also], 10);
                        return c - showSize + hideSize;
                    }
                }
                hideProps[also] = {
                    end: function(n){
                        var c = parseInt(n.style[also], 10);
                        return c + showSize - hideSize;
                    }
                }
            }

            this._showAnim = baseFx.animateProperty(lang.mixin(_common,{
                easing:this.easeIn,
                properties: showProps
            }));
            this._hideAnim = baseFx.animateProperty(lang.mixin(_common,{
                easing:this.easeOut,
                properties: hideProps
            }));

            this._animConnects = [
                connect.connect(this._showAnim, "onEnd", this, "_showEnd"),
                connect.connect(this._hideAnim, "onEnd", this, "_hideEnd")
            ];
        },
        /**
         * do the expand effect according to the navigation bar
         * @param item
         * @param expandoContentPanes
         * @param toggleMethod
         * @param idProperty
         * @param labelAttr
         * @param isCurrent
         */
        doExpand: function( item, expandoContentPanes, toggleMethod, idProperty, labelAttr, isCurrent ){
            //for mobile platform
            var isSettings = (item[this.typeAttr] == "settings");
            if(has("phone")){
                this.setPreviewMode(true, isSettings);
            }else{
                this.setPreviewMode(isSettings, isSettings);
            }
            if( isCurrent ){
                //
                // current menu is open
                this[toggleMethod]();
            }
            else{
                if(this._showing){
                    this[toggleMethod]();
                }
                for(var ecPaneId in expandoContentPanes){
                    var ecPane = expandoContentPanes[ecPaneId];
                    domStyle.set(ecPane.domNode, "display", "none");
                }
                var expandoPane = expandoContentPanes[item[idProperty]];
                if( expandoPane ){
                    domStyle.set( expandoPane.domNode, "display", "");
                    var potencialWidget = registry.byNode( expandoPane.domNode.children[0]);
                    if ( potencialWidget.declaredClass == "gridx.Grid" ){
                        potencialWidget.body.refresh();
                    }
                    this.set("title", entities.encode(item[labelAttr]));
                    this[toggleMethod]();
                }
            }

        },

        preview: function(){
            if(!this._showing){
                // this._isonlypreview = !this._isonlypreview;
                this._isonlypreview = true;
            }
            this.toggle();
        },

        toggle: function(){
            var geom = domGeom.position(this.containerNode);
            console.log("before toggle in _ExpandoPane",geom );
            if(this.persistence && this._showing){
            	domClass.remove( this.domNode, "noBorder" );
                this._hideAnim && this._hideAnim.stop();
                this._showAnim.play();
            	return;
            }
            if(this._showing){
            	domClass.add( this.domNode, "noBorder" );
            	domStyle.set( this.domNode, "display", "none");
                this._showAnim && this._showAnim.stop();
                this._hideAnim.play();
            }else{
            	domClass.remove( this.domNode, "noBorder" );
            	domStyle.set( this.domNode, "display", "");
                this._hideAnim && this._hideAnim.stop();
                this._showAnim.play();
            }
            this._showing = !this._showing;
            this.domNode.setAttribute("aria-expanded", this._showing);
        },
        /**
         * popup the hide status to the parent node to solve
         * nav visibility issue for its own menu item
         * @private
         */
        _showEnd: function(){
            if(!this._isonlypreview){

            }else{
                this._previewShowing = true;
            }
            /**
             * Fix me
             * if the content width is 0 resize,
             * it will cause the content of menu flash to show after startup
             */
            this._layoutChildren();
        },
        /**
         * popup the hide status to the parent node to solve
         * nav visibility issue for its own menu item
         * @private
         */

        _hideEnd: function(){
            this._isonlypreview = false;
           
        },

        resize: function(/*Object?*/newSize){
            this._layoutChildren();
            this._setupAnims();
        },

        _trap: function(/*Event*/ e){
            event.stop(e);
        },

        setPreviewMode: function(preview, mini){
            this._isonlypreview = preview || false;
            this._isMiniMode = mini || false;
            domStyle.set(this.domNode, {
                "top": this._isMiniMode?this.miniModeHeight:0,
                "height": this._isMiniMode?this.miniModeHeight:"100%"
            } );
        }

    });

    return _ExpandoPane;
})