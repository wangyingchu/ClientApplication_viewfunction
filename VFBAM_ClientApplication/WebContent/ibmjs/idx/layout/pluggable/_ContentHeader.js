/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/window",
    "dojo/_base/array",
    "dojo/_base/xhr",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojox/html/_base",
    "dijit/layout/ContentPane",
    "./_FlipCardUtils"
],function( lang, declare, connect, winUtil, array, xhrUtil, domAttr, domClass,  dojoxHtmlUtil, ContentPane, _FlipCardUtils){
    //header title stuff
    var _ContentHeader = declare([ContentPane],{

        adjustPaths: false,
        cleanContent: false,
        renderStyles: false,
        executeScripts: true,
        scriptHasHooks: false,

        _setFocusAttr: "domNode",

        ioMethod: xhrUtil.get,

        ioArgs: {},

        widgetClass: "",
        widgetParams: {},

        postMixInProperties: function(){
            this.inherited(arguments);

            this.widgetClass = this.widgetClass || "";
            this.widgetParams = this.widgetParams || {};
        },

        postCreate: function(){
            this.inherited(arguments);

            //TODO
        },

        startup: function(){
            this.inherited(arguments);

            domClass.add(this.domNode, "headerContainer");
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

        _getFocusItems: function(){
            var elems = a11y._getTabNavigable(this.domNode);
            this._firstFocusItem = elems.lowest || elems.first || this.domNode;
            this._lastFocusItem = elems.last || elems.highest || this._firstFocusItem;
        },

        _onKey: function(/*Event*/ evt){
            if(evt.keyCode == keys.TAB){
                this._getFocusItems(this.domNode);
                var node = evt.target;
                if(this._firstFocusItem == this._lastFocusItem){
                    evt.stopPropagation();
                    evt.preventDefault();
                }else if(node == this._firstFocusItem && evt.shiftKey){
                    focus.focus(this._lastFocusItem);
                    evt.stopPropagation();
                    evt.preventDefault();
                }else if(node == this._lastFocusItem && !evt.shiftKey){
                    focus.focus(this._firstFocusItem);
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            }
        },

        getMetadata: function(context){
            this.metadata = {
                executeScripts: this.executeScripts,
                scriptHasHooks: this.scriptHasHooks,
                widgetClass: this.widgetClass,
                widgetParams: this.widgetParams
            };

            var href = this.get("href");
            if(href){
                this.metadata.href = href;
            }else{
                this.metadata.content = this.get("content");
            }

            if(context){
                return baseJson.toJson(this.metadata);
            }else{
                return this.metadata;
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
    return _ContentHeader;

})