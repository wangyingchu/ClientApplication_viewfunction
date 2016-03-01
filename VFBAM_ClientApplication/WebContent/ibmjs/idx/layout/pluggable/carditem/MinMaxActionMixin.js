/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
    "dojo/_base/lang",
	"dojo/_base/event",
	"dojo/_base/array",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/query",
    "dijit/registry"
], function( lang, event, array, domClass, domStyle, query, registry ){
    /**
     * Handle Min and Max Process in the FlipCardItem
     */
	return {
		/**
         * This function should be called before the maximum the FlipCardItem
         * preserve the size of the item to restore in when back into normal phrase
         * @private
         */
        _recordNormalSize: function(){
            this.normalSize = {
                w: domStyle.get(this.domNode, "width"),
                h: domStyle.get(this.domNode, "height")
            }
        },
        
        /**
         * record the stacked item in normal state and restore these item after the resiezToNormal function
         */
        stackedItemKeysInNormal: [],
        /**
         * resize the FlipCardItem from Normal Size to Maximum Size
         * @param parentGrid
         * @param props
         * @private
         */
        _resizeToMax: function( parentGrid, props ){
            //record stacked item
            this.stackedItemKeysInNormal = [];

            domStyle.set(parentGrid.gridContainerDiv, "height", "auto");
            this._recordNormalSize();
            for(var itemId in parentGrid.stackedCardItems){
                this.stackedItemKeysInNormal.push(itemId);
            }

            if(props && props.itemGeom){
                this.itemGeom = props.itemGeom;
            }
            else{
                this.itemGeom = {
                    w: domStyle.get(this.domNode, "width"),
                    h: domStyle.get(this.domNode, "height")
                }
            }
            // console.log(this.itemGeom);
            parentGrid.disableDnd();
            domClass.add(parentGrid.domNode, "gridContainerMaximum");
            
            //
            //  set the fpGridContainerZone of the max CardItem to show and others to be disappear
            //
            query("> .fpGridContainerZone", parentGrid.gridNode).forEach(lang.hitch(this, function(tdNode, index){
                if(this.column!=index){
                    domClass.add(tdNode, "gridColumnDisappear");
                }else{
                    domClass.add(tdNode, "gridColumnMaximum");
                }
                query(".portletItem", tdNode).forEach(lang.hitch(this, function(portletNode){
                    var portletItemWidget = registry.byNode(portletNode);
                    if(portletItemWidget != this){
                        //add to minimum dock bar
                        if(portletItemWidget.stackable && parentGrid.dockContainer){
                            parentGrid.stackCardItem(portletItemWidget, true);
                        }
                    }
                }));
            }));

            this.resize(true);
            
            var maxSize = this.getMaxSize();
            this.resizeScrollContent( maxSize );
            
            if(parentGrid.layoutMode == "absolute"){
                domStyle.set(this.domNode, {
                    left: 0 + "px",
                    top: 0 + "px"
                });
            }

            domClass.add(this.domNode, "portletItemMaximum");


            if(this.hideActionsInMaxMode){
                this.displayCardActions(null, ["max", "settings", "settingsDetail"], false);
            }

            var maxbtn = this.maxBtn;
            maxbtn.titleNode.title = "Restore";
            domClass.remove(maxbtn.iconNode, "maxIcon");
            domClass.add(maxbtn.iconNode, "restoreIcon");

            parentGrid.currentMaxItemName = this.itemName;
            this.itemStatus = "max";
        },
        /**
         *
         * @param parentGrid
         * @param props
         * @private
         */
        _resizeToNormal: function(parentGrid, props ){
        	var self = this,
        		stackedItemKeysInNormal = this.stackedItemKeysInNormal;
            query("> .fpGridContainerZone", parentGrid.gridNode).forEach(lang.hitch(this, function(tdNode, index){
                if(this.column!=index){
                    domClass.remove(tdNode, "gridColumnDisappear");
                }else{
                    domClass.remove(tdNode, "gridColumnMaximum");
                }
                query(".portletItem", tdNode).forEach(lang.hitch(this, function(portletNode){
                    var portletItemWidget = registry.byNode(portletNode);
                    if(portletItemWidget != this){
                        //clear minimum dock bar, remain stacked items before
                        if(portletItemWidget.stackable && parentGrid.dockContainer){
                            if(array.indexOf( stackedItemKeysInNormal, portletItemWidget.itemName)==-1){
                                parentGrid.unStackCardItem(portletItemWidget, true);
                            }
                        }
                    }
                }));
            }));

            domClass.remove(parentGrid.domNode, "gridContainerMaximum");
            //show dock container when max to normal
            if( stackedItemKeysInNormal && stackedItemKeysInNormal.length){
                parentGrid.toggleDockContainer(true);
            }

            domClass.remove(this.domNode, "portletItemMaximum");

            console.log("FlipCarItem ResizeToNormal");
            console.log(this.normalSize);
            /**
             * Do not set the with with every FlipCardItem during resize to normal
             * use the defecut percentage with for every one
             */
            var targetSize = {
                //
                // when the size is shrink to normal state
                // the width should be auto to ajust the percentage width with dnd
                width: "auto",
                height: this.normalSize.h + "px"
            }
            domStyle.set(this.domNode, targetSize);
            this.resizeScrollContent(targetSize);

            parentGrid.enableDnd();

            //title bar
            if(this.hideActionsInMaxMode){
                this.displayCardActions(null, ["max", "settings", "settingsDetail"], true);
            }

            var maxbtn = this.maxBtn;
            maxbtn.titleNode.title = this._nlsResources.maxActionTitle || maxbtn.label;
            domClass.remove(maxbtn.iconNode, "maxIcon");
            domClass.add(maxbtn.iconNode, "restoreIcon");

            parentGrid.currentMaxItemName = "";
            this.itemStatus = "normal";
            parentGrid.resize();
        },
        
        onMaxComplete: function(){
        	this.resizeScrollContent();
        },
        /**
         *
         * @param e
         * @param props
         */
        handle_max: function(e, props){
            var parentGrid = this.gridContainer || this.getParent();
            if(parentGrid && parentGrid.domNode){
                //append CSS3 animation for max/min resize
                if(_supportCSS3Animation){
                    clearTimeout(this.clearResizeCSS3Anim);
                    domClass.add(parentGrid.domNode, "css3AnimationsForResize");
                    this.clearResizeCSS3Anim = setTimeout(lang.hitch(this, function(){
                        if(parentGrid && parentGrid.domNode){
                            domClass.remove(parentGrid.domNode, "css3AnimationsForResize");
                        }
                        
                        
                    }), this.animationDuration);
                }

                if(this.itemStatus == "normal"){
                    if(domClass.contains(parentGrid.domNode, "gridContainerMaximum")){
                        console.log(this._nlsResources.gridMaximumStatus);
                        return;
                    }
                    this._resizeToMax(parentGrid, props);
                    
                }else if(this.itemStatus == "max"){
                    this._resizeToNormal(parentGrid ,props);
                    
                }else{
                    console.log(this._nlsResources.statusIssueMessage);
                }
            }
            e && event.stop(e);

            setTimeout(lang.hitch(this, function(){
            	
                this.handle_max_completed_stub(this);
            }),this.animationDuration);
        },
        /**
         *
         * @param cardItem
         */
        handle_max_completed_stub: function(cardItem){
            //stub function
        },

        /**
         *
         * @param e
         */
        handle_min: function(e){
            var parentGrid = this.gridContainer || this.getParent();

            if(_supportCSS3Animation){
                clearTimeout(this.clearResizeCSS3Anim);
                domClass.add(this.domNode, "css3AnimationsForResize");
                this.clearResizeCSS3Anim = setTimeout(lang.hitch(this, function(){
                    if(this && this.domNode){
                        domClass.remove(this.domNode, "css3AnimationsForResize");
                    }
                    // this.resize("current");
                }), this.animationDuration);
            }

            if(parentGrid){
                parentGrid.disableDnd();
            }

            if(this.itemStatus == "normal"){
                domClass.add(this.domNode, "portletItemMinimum");
                this.displayActions(false);
                this.itemStatus = "min";

                //a11y
                domClass.add(this.mainContent.hideNode, "contentNoVisible");
                domClass.add(this.detailContent.hideNode, "contentNoVisible");
            }else if(this.itemStatus == "min"){
                domClass.remove(this.domNode, "portletItemMinimum");
                this.itemStatus = "normal";

                //a11y
                domClass.remove(this.mainContent.hideNode, "contentNoVisible");
                domClass.remove(this.detailContent.hideNode, "contentNoVisible");
            }else{
                console.log(this._nlsResources.statusIssueMessage);
            }

            if(parentGrid){
                parentGrid.enableDnd();
            }

            e && event.stop(e);

            setTimeout(lang.hitch(this, function(){
                this.handle_min_completed_stub(this);
            }),this.animationDuration);
        },
        /**
         *
         * @param cardItem
         */
        handle_min_completed_stub: function(cardItem){
            //stub function
        },
        /**
         *
         * @param e
         */
        toggle_to_normal: function(e){
            // this.toggleCSS3Animation(true);
            switch(this.itemStatus){
                case "max":
                    this.handle_max(e);
                    break;
                case "min":
                    this.handle_min(e);
                    break;
                case "stacked":
                    this.handle_stack(e);
                    break;
                case "normal":
                    //TODO
                    break;
            }
        }
	}
});