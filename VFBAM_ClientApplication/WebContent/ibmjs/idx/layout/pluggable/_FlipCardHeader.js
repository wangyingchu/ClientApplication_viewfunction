/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare", // declare
    "dojo/_base/window",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/on",
    "dojo/touch",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/keys",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Contained",
    "dijit/_Container",
    "dijit/form/Button", 
    "dojo/text!./templates/_FlipCardHeader.html"
],function( declare, winUtil, lang, array, on, touch, dom, domAttr, domConstruct, domClass, domStyle, keys, 
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Contained, _Container, Button, 
		templateString ){
	
    return declare("idx/layout/_FCContainerHeader", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        // label: String
        //		A title text of the heading. If the label is not specified, the
        //		innerHTML of the node is used as a label.
        label: "",

        // iconBase: String
        //		The default icon path for child items.
        iconBase: "",

        // tag: String
        //		A name of HTML tag to create as domNode.
        tag: "h1",

        // baseClass: String
        //		The name of the CSS class of this widget.
        baseClass: "idxFlipCardHeader",

        templateString: templateString,

        // rootContainer: Object
        //		flip card container reference.
        rootContainer: null,

        postMixInProperties: function(){
            this.inherited(arguments);
            //TODO
        },
        /**
         *
         */
        buildRendering__: function(){
            if(!this.templateString){ // true if this widget is not templated
                // Create root node if it wasn't created by _TemplatedMixin
                this.domNode = this.containerNode = this.srcNodeRef || winUtil.doc.createElement(this.tag);
            }
            this.inherited(arguments);

            if(!this.templateString){ // true if this widget is not templated
                if(!this.label){
                    array.forEach(this.domNode.childNodes, function(n){
                        if(n.nodeType == 3){
                            var v = lang.trim(n.nodeValue);
                            if(v){
                                this.label = v;
                                this.labelNode = domConstruct.create("span", {innerHTML:v}, n, "replace");
                            }
                        }
                    }, this);
                }
                if(!this.labelNode){
                    this.labelNode = domConstruct.create("span", null, this.domNode);
                }
                this.labelNode.className = "idxFlipCardHeaderSpanTitle";
                this.labelDivNode = domConstruct.create("div", {
                    className: "idxFlipCardHeaderTitle",
                    innerHTML: this.labelNode.innerHTML
                }, this.domNode);
            }

            if(this.labelDivNode){
                domAttr.set(this.labelDivNode, "role", "heading"); //a11y
                domAttr.set(this.labelDivNode, "aria-level", "1");
            }

            dom.setSelectable(this.domNode, false);
        },

        /**
         * Event Delegate for User Click or KeyDown on the ToggleButton
         */
        onToggleButtonClick: function(){

        },

        /**
         * create a icon node and catch the event to toggle the navigator
         */
        postCreate: function(){
            this.inherited(arguments);
            
        },

        startup: function(){
            if(this._started){ return; }

            this.inherited(arguments);

            //a11y
            domAttr.set(this.domNode, {
                tabIndex: -1
            });
        },

        resize: function(){
            if(this.labelNode){
                // find the rightmost left button (B), and leftmost right button (C)
                // +-----------------------------+
                // | |A| |B|             |C| |D| |
                // +-----------------------------+
                var leftBtn, rightBtn;
                var children = this.containerNode.childNodes;
                for(var i = children.length - 1; i >= 0; i--){
                    var c = children[i];
                    if(c.nodeType === 1 && domStyle.get(c, "display") !== "none"){
                        if(!rightBtn && domStyle.get(c, "float") === "right"){
                            rightBtn = c;
                        }
                        if(!leftBtn && domStyle.get(c, "float") === "left"){
                            leftBtn = c;
                        }
                    }
                }

                if(!this.labelNodeLen && this.label){
                    this.labelNode.style.display = "inline";
                    this.labelNodeLen = this.labelNode.offsetWidth;
                    this.labelNode.style.display = "";
                }

                var bw = this.domNode.offsetWidth; // bar width
                var rw = rightBtn ? bw - rightBtn.offsetLeft + 5 : 0; // rightBtn width
                var lw = leftBtn ? leftBtn.offsetLeft + leftBtn.offsetWidth + 5 : 0; // leftBtn width
                var tw = this.labelNodeLen || 0; // title width
                domClass[bw - Math.max(rw,lw)*2 > tw ? "add" : "remove"](this.domNode, "mblHeadingCenterTitle");
            }
            array.forEach(this.getChildren(), function(child){
                if(child.resize){ child.resize(); }
            });
        },
        /**
         *
         * @param label
         * @private
         */
        _setLabelAttr: function(/*String*/label){
            this._set("label", label);
            //this.labelNode.innerHTML = this.labelDivNode.innerHTML = this._cv ? this._cv(label) : label;
        }
    });

})