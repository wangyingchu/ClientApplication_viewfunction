/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
    "dojo/_base/declare",
    "dojo/dom-class",
    "./_AreaManager"
],function( declare, domClass, _AreaManager){
    var _DropIndicator = declare([], {
        node : null,
        constructor: function(){
            var dropIndicator = document.createElement("div");
            var subDropIndicator = document.createElement("div");
            dropIndicator.appendChild(subDropIndicator);
            domClass.add(dropIndicator, "dropIndicator");
            this.node = dropIndicator;
        },

        place: function(/*Node*/area, /*Node*/nodeRef, /*Object*/size){
            if(size){
                this.node.style.height = size.h + "px";
            }
            try{
                if(nodeRef){
                    area.insertBefore(this.node, nodeRef);
                }
                else{
                    // empty target area or last node => appendChild
                    area.appendChild(this.node);
                }
                return this.node;	// DOMNode
            }catch(e){
                return null;
            }
        },

        remove: function(){
            if(this.node){
                //FIX : IE6 problem
                this.node.style.height = "";
                if(this.node.parentNode){
                    this.node.parentNode.removeChild(this.node);
                }
            }
        },

        destroy: function(){
            if(this.node){
                if(this.node.parentNode){
                    this.node.parentNode.removeChild(this.node);
                }
                domConstruct.destroy(this.node);
                delete this.node;
            }
        }
    });

    _AreaManager.areaManager()._dropIndicator = new _DropIndicator();

    return _DropIndicator;
});