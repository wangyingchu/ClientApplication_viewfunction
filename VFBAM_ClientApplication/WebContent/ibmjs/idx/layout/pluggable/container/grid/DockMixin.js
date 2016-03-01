/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/dom-construct",
    "../../_Dock",
    "../../_FlipCardUtils"
], function( declare, lang, domClass, domStyle, domGeom, domConstruct, _Dock, _FlipCardUtils ){
	/**
	 * This Mixin is to handle the DockContainer logic
	 * a. initialize the dock container
	 * b. handle the stack/unstack ui logic
	 */
	return {
        //
        // Dock Widget
        //
        dockContainer: null,
        // dockVisible: Boolean
        //      the dock container will not be hided even when in a maximum mode.
        dockVisible: false,

        // dockBehavior: Boolean
        //      the dock container behavior mode.
        dockBehavior: "collapsed", // "collapsed", "fixed"

        // dockOverlay: Boolean
        //      whether the dock container is at overlay mode.
        dockOverlay: true,
        /*
         * Initialize the Dock Container in FlipCardGridContainer
         */
        createDockContainer: function(){
        	//dock node
            if( !this.dockContainer ){
                this.dockContainer = new _Dock({
                    id: this.id + "_dock",
                    autoPosition: "south",
                    gridRef: this
                }, domConstruct.create("div", {}, this.domNode));
                domClass.add(this.dockContainer.domNode, "dockContainer");
                if(this.dockContainer){
                    this.dockContainer.startup();
                }
                this.toggleDockContainer(false);
            }

            this.toggleDockOverlay(this.dockOverlay);
        },
        
        /**
         * play the animation for card hidden.
         * @param {Object} sourceItem
         * @param {Object} destItem
         */
        playStackAnimation: function(sourceItem, destItem){
            // var stackAnimNode = domConstruct.create("div", {
            // className: "stackAnimationNode"
            // }, this.domNode);
            var stackAnimNode = lang.clone(sourceItem.domNode);
            domClass.add(stackAnimNode, "stackAnimationNode css3FakeAnimationsDisabled");
            // domClass.remove(stackAnimNode, "css3Animations");
            this.domNode.appendChild(stackAnimNode);

            //source
            var sGeom = domGeom.position(sourceItem.domNode);
            domStyle.set(stackAnimNode, {
                left: sGeom.x + "px",
                top: sGeom.y + "px",
                width: sGeom.w + "px",
                height: sGeom.h + "px"
            });

            //dest
            var dGeom = domGeom.position(destItem.domNode);
            var gGeom = domGeom.position(this.domNode);
            if(dGeom.w <= 0 || dGeom.h <= 0){
                domStyle.set(stackAnimNode, {
                    left: (gGeom.x+100) + "px",
                    top: (gGeom.y+gGeom.h-20) + "px",
                    width: "1px",
                    height: "1px"
                });
            }else{
                domStyle.set(stackAnimNode, {
                    left: (dGeom.x+100) + "px",
                    top: (dGeom.y+10) + "px",
                    width: "1px",
                    height: "1px"
                });
            }

            domClass.add(stackAnimNode, "stackAnimationNodeEnd");
            domClass.add(stackAnimNode, "css3FakeAnimations");

            setTimeout(function(){
                domConstruct.destroy(stackAnimNode);
            }, 1000);
        },

        /**
         * play the animation for card un-hide.
         * @param {Object} sourceItem
         * @param {Object} destItem
         */
        playUnStackAnimation: function(sourceItem, destItem){
            //make invisible
            domClass.add(sourceItem.domNode, "portletItemInvisible");

            var stackAnimNode = lang.clone(sourceItem.domNode);
            domClass.add(stackAnimNode, "stackAnimationNode css3FakeAnimationsDisabled");
            // domClass.remove(stackAnimNode, "css3Animations");
            this.domNode.appendChild(stackAnimNode);

            //source
            var sGeom = domGeom.position(destItem.domNode);
            domStyle.set(stackAnimNode, {
                left: (sGeom.x+100) + "px",
                top: (sGeom.y+sGeom.h-20) + "px",
                width: "1px",
                height: "1px"
            });

            //dest
            var dGeom = domGeom.position(sourceItem.domNode);
            domStyle.set(stackAnimNode, {
                left: dGeom.x + "px",
                top: dGeom.y + "px",
                width: dGeom.w + "px",
                height: dGeom.h + "px"
            });

            domClass.add(stackAnimNode, "unStackAnimationNodeEnd");
            domClass.add(stackAnimNode, "css3FakeAnimations");

            setTimeout(function(){
                domConstruct.destroy(stackAnimNode);
                //make visible
                domClass.remove(sourceItem.domNode, "portletItemInvisible");
            }, 1000);
        },

        /**
         * hide card item.
         * @param {Object} cItem
         * @param {Boolean} noAnim
         */
        stackCardItem: function( cItem, noAnim ){
            if( this.stackedCardItems[cItem.itemName] ){
            	return;
            }
            var isResize = _FlipCardUtils.isObjectEmpty(this.stackedCardItems);
            if(!noAnim && _supportCSS3Animation && !this.css3AnimationDisabled){
                this.playStackAnimation(cItem, this.dockContainer);
            }
            cItem.stackItem && cItem.stackItem();
            var dockItem = this.addToDockContainer(cItem);
            this.stackedCardItems[cItem.itemName] = {origin:cItem, dock:dockItem};
            
            domClass.add(this.domNode, "gridContainerStacked");
            
            if ( isResize ){
            	this.toggleDockContainer(true);
            	this.resize();
            }
            	
        },

        /**
         * un-hide card item.
         * @param {Object} cItem
         * @param {Boolean} noAnim
         */
        unStackCardItem: function(cItem, noAnim){
            cItem.unStackItem && cItem.unStackItem();
            if(!noAnim && _supportCSS3Animation && !this.css3AnimationDisabled){
                this.playUnStackAnimation(cItem, this.dockContainer);
            }
            this.removeStackedCardItem(cItem.itemName);
        },

        removeStackedCardItem: function(itemName){
            if(this.stackedCardItems && this.stackedCardItems[itemName]){
                var dockItem = this.stackedCardItems[itemName].dock;
                var originItem = this.stackedCardItems[itemName].origin;
                this.removeFromDockContainer(dockItem, originItem);
                delete this.stackedCardItems[itemName];
                if(_FlipCardUtils.isObjectEmpty(this.stackedCardItems)){
                    this.toggleDockContainer(false);
                    this.resize();
                    domClass.remove(this.domNode, "gridContainerStacked");
                }
            }
        },

        /**
         * clear the hidden bar of the grid container.
         */
        clearStackedItem: function(){
            for(var key in this.stackedCardItems){
                var cItem = this.stackedCardItems[key];
                if(cItem.origin){
                    cItem.origin.unStackItem && cItem.origin.unStackItem();
                }
            }
            this.stackedCardItems = {};
            this.clearDockContainer();
            this.toggleDockContainer(false);
            domClass.remove(this.domNode, "gridContainerStacked");
        },


        toggleDockOverlay: function(dockOverlay){
            if(dockOverlay !== undefined){
                this.dockOverlay = dockOverlay ? true : false;
            }else{
                this.dockOverlay = !this.dockOverlay;
            }

            if(this.dockOverlay){
                domClass.remove(this.dockContainer.domNode, "dockContainerStatic");
                domClass.remove(this.domNode, "gridDockStatic");
            }else{
                domClass.add(this.dockContainer.domNode, "dockContainerStatic");
                domClass.add(this.domNode, "gridDockStatic");
            }
        },

        toggleDockContainer: function(forceShowHide, ignoreDockVisible){
            if(forceShowHide !== undefined){
                this.dockContainerDisplayed = forceShowHide ? true : false;
            }else{
                this.dockContainerDisplayed = !this.dockContainerDisplayed;
            }
            if(this.dockVisible && !ignoreDockVisible){
                this.dockContainerDisplayed = true;
            }
            if (  !this.dockContainerDisplayed ){
                domStyle.set(this.dockContainer.domNode,  {
                    "display": "none"
                });
            }
            else{
                domStyle.set(this.dockContainer.domNode,  {
                    "display": ""
                });
            }

        },

        addToDockContainer: function(widget, container){
            container = container || this.dockContainer;
            if(!container){return;}
            if(!widget.title){
                widget.title = widget.mainContent.title || widget.itemName;
            }
            var dockItem = container.addNode(widget, this);
            domClass.add(dockItem.domNode, "dockItem");

            return dockItem;
        },

        removeFromDockContainer: function(dockItem, widget, container){
            container = container || this.dockContainer;
            if(!container){return;}

            container.removeNode(dockItem, widget, this);
        },

        clearDockContainer: function(container){
            container = container || this.dockContainer;
            if(container){
                container.destroyDescendants();
                // domConstruct.empty(container);
            }
        }
	};
});