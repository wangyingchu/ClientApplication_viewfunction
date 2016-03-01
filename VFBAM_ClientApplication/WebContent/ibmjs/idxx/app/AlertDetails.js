/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.app.AlertDetails");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("dijit.layout.ContentPane");

// IDX includes
dojo.require("idx.grid.PropertyFormatter");
dojo.require("idx.grid.PropertyGrid");
dojo.require("idxx.bus.Message"); // For UML generator only

//NLS includes
dojo.requireLocalization("idxx.app","AlertMessages");

/**
 * @name idxx.app.AlertDetails
 * @class Class that implements details view of alert pane with 
 * 3 views: dashboard, summary, and details.
 * @augments dijit._LayoutWidget
 * @augments dijit._Templated
 */
dojo.declare("idxx.app.AlertDetails", [
		dijit._Widget, dijit._Templated ], 
		/**@lends idxx.app.AlertSusmmary#*/
{
	templateString : dojo.cache("idxx.app","templates/AlertDetails.html"),
	/* boolean */ widgetsInTemplate : true,
	 	
	/**
	 * IDX Property Grid for message details
	 * @type idx.grid.PropertyGrid"
	 * @default null
	 */
	 /*PropertyGrid*/ _pgrid: null, 
	
	/**
	 * NLS messages
	 * @type Object
	 * @default {}
	 */
    msg : {},
    
   
	/**
	 * Default constructor
	 * @param {Object} args
	 * Subscribes to topic idx.bus.DEFAULT_BUS_TOPIC , 
	 * calling method 'receiveAlert' to handle.
	 * Sets object instance data fields:
	 *    store - with a dojo.data.ItemFileWriteStore
	 *    using the default 'data' contents.
	 */
	constructor: function(/*Object */args) {  
		dojo.mixin( this.msg, dojo.i18n.getLocalization("idxx.app","AlertMessages") );	// bring in NLS messages	
		if (args) { dojo.mixin(this,args); }
	},
  
	/**
	 * Prepares this object to be garbage-collected
	 */
	destroy: function(){
		this.inherited(arguments);
		// placeholder for cleanup actions
	},

    /**
     * Show the event details dialog
     * When message clicked on versus row
     * in event list table.
     * @param e
     */
    setData: function(/*Message*/item) {
    	var MN = this.declaredClass+".showMessage ";    	    	
	    this._pgrid._setDataAttr( item );
    }

});