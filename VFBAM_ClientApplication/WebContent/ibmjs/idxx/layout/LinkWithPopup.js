/*
 * Licensed Materials - Property of IBM
 * 5724-Q36
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

dojo.provide("idxx.layout.LinkWithPopup");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.form.Button"); 

/**
 * @name idxx.layout.LinkWithPopup
 * @class Templated Widget for a tooltip dialog triggered by a link click
 * @augments dijit._Widget
 * @augments dijit._Templated 
 */
dojo.declare("idxx.layout.LinkWithPopup", 
		[dijit._Widget, dijit._Templated],
		/**@lends idxx.layout.LinkWithPopup#*/
{    
    templateString : dojo.cache("idxx.layout", "templates/LinkWithPopup.html"),
    widgetsInTemplate: true,
    
    //-----------------------------------------------------
    // Attributes
    //-----------------------------------------------------    
	/**
 	 * Title text for the popup
 	 * @type String
 	 * @default ""
 	 */
    /*String*/popupTitle: "",			
    
	/**
 	 * Text label for clickalbe link
 	 * @type String
 	 * @default ""
 	 */
    /*String*/linkLabel: "",
    
	/**
 	 * attribute map - not used, remove?
 	 * @type Object
 	 * @default {popupTitle: { node: "dialogTitleNode", type: "innerHTML" }}
 	 */
    /*Object*/attributeMap: { popupTitle: { node: "dialogTitleNode", type: "innerHTML" }   },
    
	/**
 	 * Indicates content in inline to add to popup
 	 * @type boolean
 	 * @default false
 	 * @private
 	 */
    /*boolean*/_linkedWithContent: false,
    
    //-----------------------------------------------------
    // Events
    //-----------------------------------------------------
	
    /**
 	 * Event: onPopupOpened - called when link clicked
 	 * and popup dialog is opened. User can catch this event
 	 * and provide their additional handling or content
 	 * @type Function
 	 * @param {Object} source
 	 */
    onPopupOpened: function(/*Object*/source) {},
	/**
 	 * Event: onPopupClosed - called when popup closed
 	 * User can catch this event and provide their 
 	 * additional cleanup.
 	 * @type Function
 	 * @param {Object} source
 	 */
    onPopupClosed: function(/*Object*/source) {},
    
    //-----------------------------------------------------
    // Methods
    //-----------------------------------------------------
    
    /**
     * Post creation processing, apply any
     * additional styling, create connections, etc.
     */
    postCreate : function() {
    	this.inherited(arguments);
    	
    	if(dojo.isIE == null) {
    		// Adjust margin left 3px for all but IE
			dojo.style(this.buttonNode.containerNode, "marginLeft", "-3px");
    	}
    	
    	if(this.buttonNode.get("dropDown") == null) {
    		// Ensure tooltip dialog is set as drop down action (not always the case when creating this class programmatically) 
    		this.buttonNode.set("dropDown", this.dialogNode);
    	}

        dojo.connect(this.dialogNode, "onHide", this, function() { this.onPopupClosed(this); });
        dojo.connect(this.dialogNode, "onShow", this, function() {
        	if(!this.dialogNode._wasShown) {
        		// First time we're clicked we get 2 onShow events - ignore the first
        		return;
        	}
        	this._onPopupOpened(this); 
    	});     
    },
    
	/**
	 * Prepares this Object to be garbage-collected
	 */
	destroy: function(){
		this.inherited(arguments);
		// placeholder for cleanup actions
	},
	
    /**
     * Worker method for when popup dialog opened
     * @param {Object} source
     */
    _onPopupOpened: function(/*Object*/source) {
		// Create any deferred types
		//@wln causing errors! this._createDojoDeferredTypes(this.containerNode);
		 
        if(!this._linkedWithContent) {
            var fec = this._getFirstChildElement(this.containerNode); 
			if(fec != null) {
				var content = dijit.byId(fec.id);
				if(content != null) {
					content.set("LinkWithPopup", this);
				}
			}
			this._linkedWithContent = true;
        }
		this.onPopupOpened(this);
    },

    /**
     * Called when close button clicked on dialog
     * @param {Event} e
     * @Private
     */
    _onCloseClicked : function(/*Object*/ e){
    	dijit.popup.close(this.dialogNode);
	},
	
	/**
	 * Getter for button node disabled state
	 * @returns {boolean} true if button disabled OTW false
	 * @private
	 */
	/*boolean*/_getDisabledAttr: function() {
		return this.buttonNode.get("disabled");
	},
	/**
	 * Getter for link label
	 * @returns {String} link button label
	 * @private
	 */
    /*String*/_getLinkLabelAttr: function() {
        return this.buttonNode.get("label");
    },
	/**
	 * Setter for button node disabled state
	 * @param {boolean} true if button disabled OTW false
	 * @private
	 */
    _setDisabledAttr: function(/*boolean*/ value) {
        this.buttonNode.set("disabled", value);
    },
	/**
	 * Setter for link label
	 * @param {String} link button label
	 * @private
	 */
	_setLinkLabelAttr: function(/*Object*/ value) {
		this.buttonNode.set("label", value);
	},
	
	/**
	 * Return the first child element
	 * @param {DomNode} node
	 * @see datastage.global.util (original imple)
	 * @returns {Object} node
	 * @private
	 */
	/*Object*/_getFirstChildElement: function(/*Object*/node){ //@wln taken from datastage.global.util 
	    var a = node.children;
	    if(!a || a.length == 0) {
	        return null;
	    }
	    for(var i = 0; i < a.length; i++) {
	        if(a[i].nodeType == 1) {
	            return a[i];
	        }
	    }
	    return null;        
	}
});
