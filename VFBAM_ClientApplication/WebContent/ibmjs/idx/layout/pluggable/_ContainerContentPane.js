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
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dijit/layout/ContentPane",
    "dojox/html/_base",
    "./_FlipCardUtils"
],function(declare, xhrUtil, lang, domClass, domAttr, domStyle, ContentPane, dojoxHtmlUtil, _FlipCardUtils){
    /**
     *
     * @type {*}
     * @private
     */
    var _ContainerContentPane = declare("idx/layout/_ContainerContentPane", ContentPane, {
        adjustPaths: false,
        cleanContent: false,
        renderStyles: false,
        executeScripts: true,
        scriptHasHooks: false,

        _setFocusAttr: "domNode",

        ioMethod: xhrUtil.get,

        containerType: "pane",

        containerId: "",
        containerName: "",
        containerTitle: "",

        ioArgs: {},

        animationDuration: 1000,
        css3AnimationDisabled: false,

        // widgetClass: "",
        // widgetParams: {},

        postMixInProperties: function(){
            this.inherited(arguments);

            this.widgetClass = this.widgetClass || "";
            this.widgetParams = this.widgetParams || {};
            this.animationDurationHeritage = this.animationDuration;
        },

        startup: function(){
            this.inherited(arguments);

            //handle css3 animation flag
            this.toggleCSS3Animation(this.css3AnimationDisabled);

            // this.own(on(this.domNode, "keydown", lang.hitch(this, "_onKey")));

            //a11y
            domAttr.set(this.domNode, {
                tabIndex: -1
            });

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
                    this.customWidget = _FlipCardUtils.buildCustomWidget(widget, this, this.widgetParams);
                }
            }else{
                //TODO
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

        getMetadata_Items: function(context){
            this.metadata_items = {};

            //TODO analysis the content and get more info

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
                props:{
                    executeScripts: this.executeScripts,
                    scriptHasHooks: this.scriptHasHooks,
                    widgetClass: this.widgetClass,
                    widgetParams: this.widgetParams
                }
            };

            var href = this.get("href");
            if(href){
                this.metadata.props.href = href;
            }else{
                this.metadata.props.content = this.get("content");
            }


            if(context){
                return baseJson.toJson(this.metadata);
            }else{
                return this.metadata;
            }
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

    return _ContainerContentPane;
});