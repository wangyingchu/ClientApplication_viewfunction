/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/dom-class",
    "dojo/_base/event"
], function( domClass, event ){    
	/**
     * Handle the Stack Action on FlipCardItem Action Bar
     */
	return {

        /**
         * handle the hidden action.
         */
        handle_stack: function(e){
            var parentGrid = this.gridContainer || this.getParent();
            if(!parentGrid || !parentGrid.domNode){
                return;
            }
            if(this.itemStatus == "normal"){
                if(this.stackable && parentGrid.dockContainer){
                    parentGrid.stackCardItem(this);

                }
            }
            else if(this.itemStatus == "stacked"){
                if(this.stackable && parentGrid.dockContainer){
                    parentGrid.unStackCardItem(this);
                }
            }
            else{
                console.log(this._nlsResources.statusIssueMessage);
            }
  
            e && event.stop(e);

            this.handle_stack_completed_stub(this);
        },
        /**
         * Provide an user interface for user to handle customer Event
         * @param cardItem
         */
        handle_stack_completed_stub: function(cardItem){
            //stub function
        },

        /**
         * hide the card widget.
         */
        stackItem: function(pItem){
            pItem = pItem || this;
            domClass.add(pItem.domNode, "portletItemDisappear");

            this.displayActions(false);

            pItem.previousItemStatus = pItem.itemStatus;
            this.itemStatus = "stacked";
        },

        /**
         * show the card widget when in hidden.
         */
        unStackItem: function(pItem){
            pItem = pItem || this;
            domClass.remove(pItem.domNode, "portletItemDisappear");

            this.itemStatus = pItem.previousItemStatus || "normal";
        }
	}
	
});