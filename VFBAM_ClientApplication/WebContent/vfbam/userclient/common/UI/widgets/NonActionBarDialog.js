/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "require",
    "dojo/_base/array", // array.forEach array.indexOf array.map
    "dojo/_base/connect", // connect._keypress
    "dojo/_base/declare", // declare
    "dojo/_base/Deferred", // Deferred
    "dojo/dom", // dom.isDescendant
    "dojo/dom-class", // domClass.add domClass.contains
    "dojo/dom-construct",
    "dojo/dom-geometry", // domGeometry.position
    "dojo/dom-style", // domStyle.set
    "dojo/dom-attr", // attr.has
    "dojo/_base/event", // event.stop
    "dojo/_base/fx", // fx.fadeIn fx.fadeOut
    "dojo/i18n", // i18n.getLocalization
    "dojo/_base/kernel", // kernel.isAsync
    "dojo/keys",
    "dojo/_base/lang", // lang.mixin lang.hitch
    "dojo/on",
    "dojo/ready",
    "dojo/_base/sniff", // has("ie") has("opera")
    "dojo/_base/window", // win.body
    "dojo/window", // winUtils.getBox
    "dijit/focus",
    "dijit/a11y",
    "dijit/_base/manager",	// manager.defaultDuration
    "dijit/Dialog",
    "dijit/form/Button",
    "dojo/text!./template/NonActionBarDialog.html",
    "dijit"			// for back-compat, exporting dijit._underlay (remove in 2.0)
], function(require, array, connect, declare, Deferred,
            dom, domClass, domConstruct, domGeometry, domStyle, domAttr, event, fx, i18n, kernel, keys, lang, on, ready, has, win, winUtils,
            focus, a11y, manager, Dialog, Button, template, dijit){
    var oneuiRoot = lang.getObject("idx.oneui", true); // for backward compatibility with IDX 1.2
    var Dialog = declare("vfbam.userclient.common.UI.widgets.NonActionBarDialog", Dialog, {
        /**@lends idx.widget.Dialog.prototype*/
        templateString: template,
        baseClass: "idxDialog",

        draggable: true,
        /**
         * Dialog title
         * @type String
         */
        title: "",
        /**
         * Dialog instruction, just below the title
         * @type String
         */
        instruction: "",
        /**
         * Dialog content
         * @type String | dijit.layout.TabContainer
         */
        content: "",

        /**
         * Referance link of Dialog, reference.name for link name, and reference.link for link url
         * @type Object
         */

        reference: {
            name: "",
            link: ""
        },
        referenceName: "",
        referenceLink: "",

        postCreate: function(){
            this.inherited(arguments);
        },
        startup: function(){
            this.inherited(arguments);
            //display content and make it as tab stop
            if(this.containerNode.innerHTML){
                domAttr.set(this.containerNode, "tabindex", 0);
                domStyle.set(this.contentWrapper, "display", "block");
            }
            //re-style content if it's a tabcontainer
            if(this.containerNode.children[0] &&
                domClass.contains(this.containerNode.children[0], "dijitTabContainer")){
                domStyle.set(this.contentWrapper, {
                    borderTop: "0 none",
                    paddingTop: "0"
                });
            }
        },
        _size: function(){
            this.inherited(arguments);
            //resize the Dialog to wrap the content
            var children = this.containerNode.children,
                innerWidth = 0;
            array.forEach(children, function(child){
                innerWidth = Math.max(domStyle.get(child, "width"), innerWidth);
            });
            if(innerWidth > domStyle.get(this.containerNode, "width")){
                domStyle.set(this.domNode, {
                    width:"auto"
                });
                domStyle.set(this.containerNode, {
                    width:"auto",
                    height:"auto"
                })
            }
        },
        _onKey: function(evt){
            this.inherited(arguments);
            var node = evt.target;
            if(domAttr.has(node, "href")){return;}
            while(node){
                if(node == this.domNode || domClass.contains(node, "dijitPopup")){
                    if(evt.keyCode == keys.ENTER){
                        if(this.isValid()){
                            this.onExecute();
                        }else{
                            this.validate();
                        }
                    }else{
                        return; // just let it go
                    }
                }
                node = node.parentNode;
            }
            event.stop(evt);
        },
        _getFocusItems: function(){
            //	summary:
            //override _DialogMixin._getFocusItems.
            if(this._firstFocusItem){
                this._firstFocusItem = this._getFirstItem();
                if(!this._firstFocusItem){
                    var elems = a11y._getTabNavigable(this.containerNode);
                    this._firstFocusItem = elems.lowest || elems.first || this.domNode;
                }
                return;
            }
            var elems = a11y._getTabNavigable(this.containerNode);
            this._firstFocusItem = elems.lowest || elems.first;
        },
        hide: function(){
            this.inherited(arguments);
            this._firstFocusItem = null;
        },
        _getFirstItem: function(){
            if(this.title){return this.titleNode;}
            if(this.instruction){return this.instructionNode;}
            return null;
        },
        _setTitleAttr: function(title){
            this.titleNode.innerHTML = title;
            domAttr.set(this.titleNode, "tabindex", title ? 0 : -1);
        },
        _setInstructionAttr: function(instruction){
            this.instructionNode.innerHTML = instruction;
            domAttr.set(this.instructionNode, "tabindex", instruction ? 0 : -1);
        },
        _setContentAttr: function(content){
            this.inherited(arguments);
            var isEmpty = this.containerNode.innerHTML;
            domAttr.set(this.containerNode, "tabindex", isEmpty ? 0 : -1);
            domStyle.set(this.contentWrapper, "display", isEmpty ? "block" : "none");
        }
    });

    // Back compat w/1.6, remove for 2.0
    if(!kernel.isAsync){
        ready(0, function(){
            var requires = ["dijit/TooltipDialog"];
            require(requires);	// use indirection so modules not rolled into a build
        });
    }

    // for IDX 1.2 compatibility
    oneuiRoot.Dialog = Dialog;

    return Dialog;
});
