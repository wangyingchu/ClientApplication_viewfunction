/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-class", // domClass.add domClass.contains
    "dojo/dom-style", // domStyle.set
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-geometry",
    "dojo/_base/window",
    "dojo/_base/xhr",
    "dojo/_base/array",
    "dojo/_base/event",
    "dojo/touch",
    "dojo/keys",
    "dojo/on",
    "dojo/topic", // topic.publish()
    "dijit/_Container",
    "dijit/layout/ContentPane",
    "dijit/TitlePane",
    "dijit/Menu",
    "dijit/MenuBar",
    "dijit/MenuBarItem",
    "dijit/PopupMenuBarItem",
    "dijit/MenuItem",
    "idx/widget/ModalDialog",
    "dijit/a11y",
    "dijit/focus",
    "dojox/fx",
    "dojox/html/_base",
    "./_FlipCardUtils"
], function( declare, lang, domClass, domStyle, domConstruct, domAttr, domGeom, winUtil, xhrUtil, array, event, touch, keys, on, topic, _Container, ContentPane,TitlePane, Menu, MenuBar, MenuBarItem, PopupMenuBarItem, MenuItem, ModalDialog, a11y, focus, dojoxFx, dojoxHtmlUtil, _FlipCardUtils){
    /**
     * Customize the MenuBarItem in Portlet
     * @type {*}
     * @private
     */
    var _MenuBarItem = declare([MenuBarItem],{
        /**
         *
         */
        itemClass: "defaultIconNode",
        /**
         *
         */
        postCreate: function(){
            this.inherited(arguments);

            this.itemClass = this.itemClass||"defaultIconNode";

            domClass.add(this.domNode, "portletAction portletMenuBarAction");

            if(this.itemType == "icon"){
                domConstruct.empty(this.containerNode);
                this.iconNode = domConstruct.create("div",{
                    className: "portletActionIconNode " + this.itemClass,
                    title: this.label || this.title || "Action",
                    src:"",
                    waiRole: "presentation"
                }, this.containerNode);
            }
        },
        /**
         *
         * @param itemClass
         * @private
         */
        _setItemClassAttr: function(itemClass){
            if(this.iconNode){
                domClass.replace(this.iconNode, itemClass, this.itemClass);
            }
            this.itemClass = itemClass;
        }
    });

    /**
     * Helper widget Class
     * @type {*}
     * @private
     */
    var _PortletSettings = declare("idx/layout/_PortletSettings", [ContentPane], {

        portletIconClass: "dojoxPortletSettingsIcon fpPortletSettingsIcon",

        portletIconHoverClass: "dojoxPortletSettingsIconHover fpPortletSettingsIconHover",
        /**
         *
         */
        postCreate: function(){
            this.inherited(arguments);

            this._displayed = false;

            domStyle.set(this.domNode, "display", "none");
            domClass.add(this.domNode, "dojoxPortletSettingsContainer fpPortletSettingsContainer");

            domClass.remove(this.domNode, "dijitContentPane");
        },
        /**
         *
         * @param portlet
         * @private
         */
        _setPortletAttr: function(portlet){
            this.portlet = portlet;
        },
        /**
         *
         */
        toggle: function(){
            var n = this.domNode;
            if(domStyle.get(n, "display") == "none"){
                domStyle.set(n,{
                    "display": "block",
                    "height": "1px",
                    "width": "auto"
                });
                dojoxFx.wipeIn({
                    node: n,
                    onEnd: lang.hitch(this, function(){
                        this._displayed = true;
                    })
                }).play();
            }else{
                dojoxFx.wipeOut({
                    node: n,
                    onEnd: lang.hitch(this, function(){
                        domStyle.set(n,{"display": "none", "height": "", "width":""});
                        this._displayed = false;
                    })
                }).play();
            }
        }
    });
    /**
     * Helper widget Class
     * @type {*}
     * @private
     */
    var _PortletDialogSettings = declare("idx/layout/_PortletDialogSettings", [_PortletSettings], {
        dimensions: null,

        constructor: function(props, node){
            this.dimensions = props.dimensions || [300, 200];
        },

        toggle: function(){
            if(!this.dialog){
                this.dialog = new ModalDialog({
                    type: "information",
                    text: this.title || "Settings",
                    info: this.get("content") || this.domNode.innerHTML.toString(),
                    parentWidget: this
                });

                winUtil.body().appendChild(this.dialog.domNode);

                // Move this widget inside the dialog
                // this.dialog.containerNode.appendChild(this.domNode);

                domStyle.set(this.dialog.domNode,{
                    "width" : this.dimensions[0] + "px",
                    "height" : this.dimensions[1] + "px"
                });
                // domStyle.set(this.domNode, "display", "");
            }
            if(this.dialog.open){
                this.dialog.hide();
            }else{
                this.dialog.show(this.domNode);
            }
        }
    });
    /**
     * Main Widget Class
     * @type {*}
     * @private
     */
    var _Portlet =  declare("idx/layout/_Portlet", [TitlePane, _Container], {

        resizeChildren: true,
        _parents: null,
        _size: null,
        dragRestriction : false,

        //contentpane for script
        adjustPaths: false,
        cleanContent: false,
        renderStyles: false,
        executeScripts: true,
        scriptHasHooks: false,
        ioMethod: xhrUtil.get,
        ioArgs: {},

        preventCache: true,
        preload: true,

        destroySettingsWidget: true,

        //only false is allowed
        closable: false,

        contentType: "main", // "detail"

        defaultCntActLabel: "Default Label",
        defaultCntActType: "text",
        defaultCntActClass: "contentActionIconNode",

        defaultContentSettingsId: "__contentSettings__",

        baseClass: "dijitTitlePane portletItemContentPane",


        // widgetClass: "",
        // widgetParams: {},

        postMixInProperties: function(){
            this.inherited(arguments);

            this.widgetClass = this.widgetClass || "";
            this.widgetParams = this.widgetParams || {};
        },

        _setContent: function(cont){
            this.destroySettingsWidget = false;
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

            return this.inherited("_setContent", arguments);
        },


        onExecError: function(/*Event*/ e){
        },

        /**
         * 
         */
        postCreate: function(){
            this.inherited(arguments);

            this.commonContentActionMap = {};
            this.settingsActionMap = {};

            this.contentActions = this.contentActions || [];

            // Add the portlet classes
            domClass.add(this.domNode, "dojoxPortlet portletItemContent fpPortlet borderBox");
            domClass.remove(this.arrowNode, "dijitArrowNode");
            domClass.add(this.arrowNode, "dojoxPortletIcon dojoxArrowDown fpPortletIcon fpArrowDown");
            domClass.add(this.titleBarNode, "dojoxPortletTitle fpPortletTitle css3Animations borderBox");

            //class with contentType
            domClass.add(this.titleBarNode, "fpPortletTitle_" + this.contentType);

            if(_supportCSS3Animation){
                domClass.add(this.titleBarNode, "css3Animations");
            }
            domClass.add(this.titleNode, "dojoxPortletTextNode fpPortletTextNode");
            domClass.add(this.focusNode, "dojoxPortletTitleFocusNode dojoxPortletTitleFocus fpPortletTitleFocusNode fpPortletTitleFocus");
            domClass.add(this.hideNode, "dojoxPortletContentOuter fpPortletContentOuter fullHeight");

            domClass.add(this.domNode, "dojoxPortlet-" + (!this.dragRestriction ? "movable" : "nonmovable"));
            domClass.add(this.domNode, "fpPortlet-" + (!this.dragRestriction ? "movable" : "nonmovable"));

            var _this = this;
          
            if(this.titleHidden){
                domStyle.set(this.titleNode, "display", "none");
                domStyle.set(this.hideNode, "background", "none");
            }
            
            if ( this.titleHeight ){
            	var height = parseInt( this.titleHeight );
            	domStyle.set( this.titleBarNode, "height", height + "px" );
            }

            this.connect(this.titleBarNode, touch.press, function(evt){
                if (domClass.contains(evt.target, "dojoxPortletIcon")) {
                    event.stop(evt);
                    return false;
                }
                return true;
            });
            //a11y
            this.connect(this.titleBarNode, "onkeydown", function(evt){
                if(evt.keyCode == keys.ENTER){
                    if (domClass.contains(evt.target, "dojoxPortletIcon")) {
                        event.stop(evt);
                        return false;
                    }
                    return true;
                }
            });

            //title focus bar back for card actions
            this.focusNodeBack = domConstruct.create("div", {
                className: "dojoxPortletTitleFocusNode dojoxPortletTitleFocusBack fpPortletTitleFocusNode fpPortletTitleFocusBack"
            }, this.focusNode, "after");

            this.connect(this._wipeOut, "onEnd", function(){_this._publish();});
            this.connect(this._wipeIn, "onEnd", function(){_this._publish();});

            if(this.closable){
                this.addContentAction({id:"close",type:"icon",actionClass:"idxCloseIcon"});
            }

            //settings action
            if(this.settingsAction){
                this.addContentSettings(this.settingsAction);
            }
            
            this.createCustomWidgetAsync();
            
        },
        /**
         * Temporary Initialize the Custom Widget use the async API "setTimeout"
         */
        createCustomWidgetAsync: function(){
        	// widget initialization
            if(this.widgetClass && !this.customWidget){
                var widget = this.widgetClass;
                if(lang.isString(widget)){
                    try{
                        require({async:false}, [widget], lang.hitch(this, function(w){
                            this.customWidget = _FlipCardUtils.buildCustomWidget(w, this, this.widgetParams);
                        }));
                    }catch(e){
                        console.error(e);
                    }
                }else if(lang.isFunction(widget)){
                    //this.customWidget = _FlipCardUtils.buildCustomWidget(widget, this, this.widgetParams);
                	var self = this, _selfFlipCardUtils = _FlipCardUtils;
            		setTimeout( function(){
            			_selfFlipCardUtils.buildCustomWidget(widget, self, self.widgetParams);
            		}, 0);
                }
            }
        },

        addContentSettings: function(settings){
            if(this._settingsWidget){
                console.log(this.contentType + " Content Settings Widget Already Exist!");
                return;
            }
            if(settings && settings.type){
                var type = settings.type || "normal";
                var settingsWidget = (type == "normal" ? _PortletSettings : _PortletDialogSettings);
                var settingsWidgetInstance = new settingsWidget({
                    title: settings.title || "",
                    content: settings.content || ""
                });
                this.addChild(settingsWidgetInstance);

                this.settingsActionMap = {
                    item: settings,
                    widget: settingsWidgetInstance
                }
            }
        },

        removeContentSettings: function(){
            if(this._settingsWidget){
                this._settingsWidget.destroyRecursive();
                this._settingsWidget = null;
                this.removeContentAction(this.defaultContentSettingsId);
                this.settingsActionMap = null;
            }
        },

        _placeSettingsWidgets: function(){
            array.forEach(this.getChildren(), lang.hitch(this, function(child){
                if( child.portletIconClass && child.toggle && !child.get("portlet") ){
                    this.addContentAction({
                            id:this.defaultContentSettingsId,
                            type:"icon",
                            actionClass:child.portletIconClass
                        },
                        {handler:lang.hitch(child, "toggle")}
                    );
                    domConstruct.place(child.domNode, this.containerNode, "before");
                    child.set("portlet", this);
                    this._settingsWidget = child;
                }
            }));
        },

        adjustContentActionsPosition: function(){
            //adjust content actions' position
            if(this.parentPortletItem.leftCardActionPos){
                domClass.add(this.contentActionBar.domNode, "flipCardActionBarAdjust");
                domStyle.set(this.contentActionBar.domNode, "marginLeft", (this.parentPortletItem.leftCardActionPos-10)+"px");
            }
        },

        clearContentActions: function(){
            for(var cActId in this.commonContentActionMap){
                this.removeContentAction(cActId);
            }
        },

        addContentActions: function(contentActions, args){
            if(contentActions && contentActions.length){
                array.forEach(contentActions, function(contentAction){
                    var contentActionArgs = args;
                    if(args && args[contentAction.id]){
                        contentActionArgs = args[contentAction.id];
                    }
                    this.addContentAction(contentAction, contentActionArgs);
                }, this);
                this.adjustContentActionsPosition();
            }
        },

        addContentAction: function(contentAction, args){
            if(this.contentActionBar && contentAction && contentAction.id){
                var cActId = contentAction.id;
                if(this.commonContentActionMap[cActId]){
                    console.log(cActId + " Content Action already exist!");
                    return;
                }

                if(contentAction.children && contentAction.children.length){
                    var rootMenu = new Menu({});
                    array.forEach(contentAction.children, function(item){
                        var menuItem = new MenuItem({
                            label:item.label
                        });

                        this.own(on(menuItem, touch.press, lang.hitch(this, function(it, evt){
                            this.handleContentActions && this.handleContentActions(it, evt);
                            evt && event.stop(evt);
                        }, item)));
                        //a11y
                        this.own(on(menuItem, "keydown", lang.hitch(this, function(it, evt){
                            if(evt.keyCode == keys.ENTER){
                                this.handleContentActions && this.handleContentActions(it, evt);
                                evt && event.stop(evt);
                            }
                        }, item)));

                        rootMenu.addChild(menuItem);
                    }, this);
                    this[cActId + "ContentBtn"] = new PopupMenuBarItem({
                        label: contentAction.label,
                        itemType: contentAction.type || this.defaultCntActType,
                        itemClass: contentAction.actionClass,
                        popup: rootMenu
                    });

                }else{
                    this[cActId + "ContentBtn"] = new _MenuBarItem({
                        label: contentAction.label || this.defaultCntActLabel,
                        itemType: contentAction.type || this.defaultCntActType,
                        itemClass: contentAction.actionClass ||this.defaultCntActClass
                    });
                    if(args && args.handler && lang.isFunction(args.handler)){
                        this.own(on(this[cActId + "ContentBtn"], touch.press, args.handler));
                        //a11y
                        this.own(on(this[cActId + "ContentBtn"], "keydown", lang.hitch(this, function(evt){
                            if(evt.keyCode == keys.ENTER){
                                args.handler.apply(this, arguments);
                            }
                        })));
                    }else{
                        this.own(on(this[cActId + "ContentBtn"], touch.press, lang.hitch(this, function(ca, evt){
                            this.handleContentActions && this.handleContentActions(ca, evt);
                            evt && event.stop(evt);
                        }, contentAction)));
                        //a11y
                        this.own(on(this[cActId + "ContentBtn"], "keydown", lang.hitch(this, function(ca, evt){
                            if(evt.keyCode == keys.ENTER){
                                this.handleContentActions && this.handleContentActions(ca, evt);
                                evt && event.stop(evt);
                            }
                        }, contentAction)));
                    }
                }

                domClass.add(this[cActId + "ContentBtn"].domNode, "portletAction portletContentAction");
                this.contentActionBar.addChild(this[cActId + "ContentBtn"]);
                this.commonContentActionMap[cActId] = {
                    item: contentAction,
                    widget: this[cActId + "ContentBtn"]
                }

                if(args && args.forceAdjustPos){
                    this.adjustContentActionsPosition();
                }

                return this[cActId + "ContentBtn"];
            }
        },

        updateContentAction: function(contentAction){
            if(contentAction.id && this.commonContentActionMap[contentAction.id]){
                var caItem = this.commonContentActionMap[contentAction.id];
                var caWidget = caItem.widget;
                var caNode = caWidget.domNode;
                //do update things
                if(contentAction.label){
                    caWidget.set("label", contentAction.label);
                }
                if(contentAction.actionClass){
                    caWidget.set("itemClass", contentAction.actionClass);
                }
                //TODO
            }
        },

        removeContentAction: function(cActId){
            if(cActId){
                //for map
                if(this.commonContentActionMap[cActId]){
                    var cActionWidget = this.commonContentActionMap[cActId].widget;
                    cActionWidget.destroy && cActionWidget.destroy();
                    delete this.commonContentActionMap[cActId];
                }

                // no need adjust position for content right now
                // this.adjustContentActionsPosition();
            }
        },

        //content action default function for user to connect
        handleContentActions: function(item, e){
            if(item.pressHandler && lang.isFunction(item.pressHandler)){
                item.pressHandler.apply(this, arguments);
            }
            //TODO

            this.handle_content_action_stub(item, e);
        },

        handle_content_action_stub: function(item, e){
            //stub function to bind with
        },

        handleParentFlip: function(e){
            if(!this.parentPortletItem){
                this.parentPortletItem = this.getParent();
            }
            this.parentPortletItem.handle_flip(e);

            this.handle_parent_flip_action(this, {flipActType:this.contentType}, e);
        },

        handle_parent_flip_action: function(){
            //stub function
        },

        buildContentActionBar: function(){
            if(!this.parentPortletItem){
                this.parentPortletItem = this.getParent();
            }

            //always build action for content action
            this.contentActionBar = new MenuBar().placeAt(this.focusNodeBack);
            domClass.add(this.contentActionBar.domNode, "flipCardActionBar");

            if(this.contentActions.length){
                //for parent card configs
                if(this.parentPortletItem.flipToDetailAction && this.contentType == "main"){
                    this.addContentAction({id:"flipToDetail",type:"icon",label:"Card Flip To Detail Content",actionClass:"flipToDetailIcon"},
                        {handler:lang.hitch(this, this.handleParentFlip)});
                }
                if(this.parentPortletItem.flipToMainAction && this.contentType == "detail"){
                    this.addContentAction({id:"flipToMain",type:"icon",label:"Card Flip To Main Content",actionClass:"flipToMainIcon"},
                        {handler:lang.hitch(this, this.handleParentFlip)});
                }

                array.forEach(this.contentActions, function(contentAction){
                    var cActId = contentAction.id;
                    if(cActId){
                        this.addContentAction(contentAction);
                    }
                }, this);

                this.contentActionBar.startup();

                this.adjustContentActionsPosition();
            }
        },

        startup: function(){
            if(this._started){return;}

            //action bar and actions
            this.buildContentActionBar();

            var children = this.getChildren();
            this._placeSettingsWidgets();

            // Start up the children
            array.forEach(children, function(child){
                try{
                    if(!child.started && !child._started){
                        child.startup()
                    }
                }
                catch(e){
                    console.log(this.id + ":" + this.declaredClass, e);
                }
            });

            this.inherited(arguments);

            //this._updateSize();
            //domStyle.set(this.domNode, "visibility", "visible");

            //portlet communication
            this.parentContainer = this.getParent();
            if(this.parentContainer){
                this.topicHead = (this.parentContainer.rootContainer ? (this.parentContainer.rootContainer.get("flipCardModelId") + "_") : "rootId_")
                    + (this.parentContainer.gridContainer ? this.parentContainer.gridContainer.get("containerId") : "containerId");
                this.topicId = this.parentContainer.get("itemName") + "_" + this.contentType;
                this.topicHandler = topic.subscribe(this.topicHead + "_" + this.topicId, lang.hitch(this, this.topicHandlerStub));
            }

            this._started = true;

            //a11y
            this.domNode && domAttr.set(this.domNode, {
                tabIndex: -1
            });
            //a11y
            this.focusNode && domAttr.set(this.focusNode, {
                tabIndex: 0
            });

            
        },

        _getFocusItems: function(node){
            var elems = a11y._getTabNavigable(node || this.domNode);
            this._firstFocusItem = elems.lowest || elems.first || this.domNode;
            this._lastFocusItem = elems.last || elems.highest || this._firstFocusItem;
        },

        doFocusNodeItem: function(widgetNode){
            this._getFocusItems(widgetNode);
            focus.focus(this._firstFocusItem);
            // focus.focus(this.focusNode);
        },

        switchCardSkin: function(skin){
            if(!this.parentPortletItem){
                this.parentPortletItem = this.getParent();
            }
            domClass.toggle(this.parentPortletItem.domNode, skin || "defaultSkin");
        },

        topicHandlerStub: function(data){
            //TODO
            this.topicProcess(data.data);
        },
        topicProcess: function(data){
            //Stub function
        },

        topicPublisherStub: function(data, cardId, contentType){
            topic.publish(this.topicHead + "_" + cardId + "_" + (contentType||"main"), { data: data });
        },


        // addContentIconAction: function(action){
        // if(!this.parentPortletItem){
        // this.parentPortletItem = this.getParent();
        // }
        // var customizedActionNode = this._createIcon(action.normalClass || "fcCustomActionNode",
        // action.hoverClass || "fcCustomActionNodeHover", lang.hitch(this, action.pressHandler), action.title);
        // domClass.add(customizedActionNode, "portletAction portletContentAction");
        // return customizedActionNode;
        // },
        _createIcon: function(clazz, hoverClazz, fn, desc){

            var icon = domConstruct.create("div",{
                "class": "dojoxPortletIcon fpPortletIcon " + clazz,
                "title": desc || "Action",
                "waiRole": "presentation"
            });
            domConstruct.place(icon, this.focusNodeBack);

            //this.connect(icon, "onclick", fn);
            this.own(on(icon, touch.press, lang.hitch(this, function(evt){
                fn.call();
                evt && event.stop(evt);
            })));
            //a11y
            this.own(on(icon, "keydown", lang.hitch(this, function(evt){
                if(evt.keyCode == keys.ENTER){
                    fn.call();
                    evt && event.stop(evt);
                }
            })));

            if(hoverClazz){
                this.connect(icon, touch.over, function(){
                    domClass.add(icon, hoverClazz);
                });
                this.connect(icon, touch.out, function(){
                    domClass.remove(icon, hoverClazz);
                });
            }
            return icon;
        },

        refreshCard: function(){
            if(this.content){
                this.set("content", this.get("content"));
            }else if(this.href){
                this.refresh();
            }
        },

        onClose: function(evt){
            domStyle.set(this.domNode, "display", "none");
        },
        /**
         * 
         * add back for user requirement #13914
         */
        getContentSize: function(){
            if(!this.parentPortletItem){
                this.parentPortletItem = this.getParent();
            }

            var parentSize = this.parentPortletItem.getContentSize();
            var contentSize = lang.clone(parentSize);
            contentSize.w = parentSize.w - 20;
            contentSize.h = parentSize.h - this.titleHeight - 20;

            return contentSize;
        },

        updateContentSize: function(){
            this._updateSize();
        },

        onSizeChange: function(widget){
            if(widget == this){
                return;
            }
            this._updateSize();
        },

        /**
         * connect to window, when the window size changed, call this function to resize every FlipCardItem
         * @private
         */
        _updateSize: function(){
            if(!this.open || !this._started || !this.resizeChildren){
                return;
            }

            if(this._timer){
                clearTimeout(this._timer);
            }
            this._timer = setTimeout(lang.hitch(this, function(){
                var size ={
                    w: domStyle.get(this.domNode, "width"),
                    h: domStyle.get(this.domNode, "height")
                };

                if ( this._parents ){
                    for(var i = 0; i < this._parents.length; i++){
                        var p = this._parents[i];
                        var sel = p.parent.selectedChildWidget
                        if(sel && sel != p.child){
                            return;
                        }
                    }
                }



                if(this._size){
                    if(this._size.w == size.w && this._size.h == size.h){
                        return;
                    }
                }
                this._size = size;

                //
                // Call resize and layout functions of every widget in this Portlet
                //
                var fns = ["resize", "layout"];
                this._timer = null;
                var kids = this.getChildren();
                array.forEach(kids, function(child){
                    for(var i = 0; i < fns.length; i++){
                        if(lang.isFunction(child[fns[i]])){
                            try{
                                child[fns[i]]();
                            } catch(e){
                                console.log(e);
                            }
                            break;
                        }
                    }
                });
                this.onUpdateSize();
            }), 100);
        },

        onUpdateSize: function(){
        },

        _publish: function(){
            topic.publish("/Portlet/sizechange",[this]);
        },

        _onTitleClick: function(evt){
            if(evt.target == this.arrowNode){
                this.inherited(arguments);
            }
        },

        addChild: function(child){
            this._size = null;
            this.inherited(arguments);

            if(this._started){
                this._placeSettingsWidgets();
                this._updateSize();
            }
            if(this._started && !child.started && !child._started){
                child.startup();
            }
        },

        getMetadata: function(context){
            this.metadata = {
                titleHeight: this.titleHeight,
                title: this.title,
                preload: this.preload,
                widgetClass: this.widgetClass,
                widgetParams: this.widgetParams
            };

            var href = this.get("href");
            if(href){
                this.metadata.href = href;
            }else{
                this.metadata.content = this.get("content");
            }

            if(this.commonContentActionMap && !_FlipCardUtils.isObjectEmpty(this.commonContentActionMap)){
                this.metadata.contentActions = [];
                for(var cActId in this.commonContentActionMap){
                    var contentActionMap = this.commonContentActionMap[cActId];
                    this.metadata.contentActions.push(contentActionMap.item);
                }
            }

            if(this.settingsActionMap && this.settingsActionMap.item){
                this.metadata.settingsAction = this.settingsActionMap.item;
                var settingsHref = this.settingsActionMap.widget.get("href");
                if(settingsHref){
                    this.metadata.settingsAction.href = settingsHref;
                }else{
                    this.metadata.settingsAction.content = this.settingsActionMap.widget.get("content");
                }
            }

            if(context){
                return baseJson.toJson(this.metadata);
            }else{
                return this.metadata;
            }
        },

        destroyDescendants: function(/*Boolean*/ preserveDom){
            this.inherited(arguments);
            if(this._settingsWidget && this.destroySettingsWidget){
                this._settingsWidget.destroyRecursive(preserveDom);
            }
        },

        destroy: function(){
            if(this._timer){
                clearTimeout(this._timer);
            }
            this.inherited(arguments);
        },

        _setCss: function(){
            this.inherited(arguments);
            domStyle.set(this.arrowNode, "display", this.toggleable ? "":"none");
        }
    });

    return _Portlet;
})