/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.bus.StateMessage");

dojo.require("idxx.events"); // for event constants
dojo.require("idxx.bus.Message");

/**
 * @name idxx.bus.StateMessage
 * @class Class that wraps the state event messages used by this application. 
 * @augments idxx.bus.Message
 */
dojo.declare("idxx.bus.StateMessage", 
		[idxx.bus.Message], 
		/**@lends idxx.bus.StateMessage#*/	
 {

	 /**
     * Gives single view for host if all items OK
     * @type boolean
     * @default true
     */
	statusOK: true,//TODO replace with use of "level"
	
    /**
     * The type state object, including:
     * 		engines
     * 		system
     * 		services
     * @type String
     * @default "system"
     */
    typeState:/*String*/ "system",
	
	/**
	 * Details array of components with following elements:
	 * 		statusCode - choices for an "OK" status include: 
	 * 			OK, QUICK_OK DISABLED, FULL_OK, NOT_CHECKED
	 * 		displayName or localizedDisplayName 
	 * 		statusMessage or localizedStatusMessage
	 * @type Array
	 * @default [  {statusCode: "OK", displayName: "TBD", statusMessage: "TBD"} ],
	 */
	details: [  {statusCode: "OK", displayName: "TBD", statusMessage: "TBD"} ],

    /**
     * Indicates if this state item is the
     * currently selected item
     * @type boolean
     * @default true
     */
	isCurrent: true,
	
    /**
	 * Default constructor
	 * @param {Object} args
	 */
	constructor: function(args) {  
		this.id = this._generateEventNumber();
		this.topic = idxx.events.TOPIC_STATE;
		this.timestamp = new Date();
		if (args) {
		  dojo.mixin(this,args);
		}
	}
	
});

