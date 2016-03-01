/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.bus.Message");

dojo.require("dojo.date");

dojo.require("idx.bus");
dojo.require("idx.bus.BusMessage");

/**
 * @name idxx.bus.Message
 * @class Class that wraps the events used by this application. 
 * @augments idx.bus.BusMessage
 * Inherits following fields from idx.bus.BusMessage
 *    scope,
 *    messageType,
 *    source,
 *    broadcast, and
 *    args
 */
dojo.declare("idxx.bus.Message", 
		[idx.bus.BusMessage], 
		/**@lends idxx.bus.Message#*/	
 {
	
	//---------------------------------------------------------------
	// iWidget event fields (remove when we extend the IEvent)
	//---------------------------------------------------------------
    	
	 /**
     * The name of the event.
     * From iWidget IEvent interface.
     * @type String
     * @default ""
     */
    name:/*String*/ "",
    
    /**
     * The type of any payload. 
     * From iWidget IEvent interface.
     * If this is set to null, no information is being provided.
     * @type String
     * @default ""
     */
    type:/*String*/ "",
    
    /**
     * The data, if any, being provided by the source of the event.
     * From iWidget IEvent interface.
     * @type Object
     * @default null
     */
    payload:/*Object*/ null,
    
    /**
     * The widget supplied id for the source widget.
     * (IE source originator of the requested action).
     * From iWidget IEvent interface.
     * @type String
     * @default ""
     */
    //source:/*String*/ "",
    
	//---------------------------------------------------------------
	// Additional attributes
	//---------------------------------------------------------------	
	
    /**
     * The topic used for this event, if applicable.
     * @type String
     * @default "" 
     */
    topic:/*String*/ "",
    
	 /**
     * The unique ID for a message.  
     * @type Integer
     * @default result from generateEventNumber() set in constructor
     */
    /* int */id: 0,
    
    /**
     * The scope for the message.  
     * @type String
     * @default ""
     */
   // scope: "local",

    /**
     * Indicates level of event. Possible levels are:
     * 	INFO
     * 	WARN
     * 	ERROR
     *  DEBUG
     * @type String
     * @default "INFO"
     */
    /*String*/ level: idx.bus.INFO,
    
    /**
     * The source object of the requested action.
     * @type String
     * @default null
     */
    sourceObject: null,

    /**
     * The object containing any additional arguments for handling the message.
     *  For example, an event with 2 inserts, 'num' and 'total' would have
     *  msgArgs of: {num: num,total:this.numAlerts} 
     *  to be used with dojo.string.substitute(...) with the actual alert message.
     * @type Object
     * @default {}
     */ 
    //args: {},
    
    /**
     * Timestamp of message
     * @type Date
     * @default <current date/time set in constructor>
     */
    /* date */timestamp: null,
    
    /**
     * NLS version of the event message 
     * intent is for this field to be filled in downstream.
     * @type String
     * @default null
     */
    msg: null,
    
    /**
     * Hostname where error occurred 
     * @type String
     * @default window.location.hostname
     */ 
	/*String*/host: window.location.hostname,
    
	/**
     * Port on host 
     * @type String
     * @default "9080",
     */ 
	/*String*/port:	"9080",

	/**
     * Node where error occurred 
     * @type String
     * @default ""
     */ 
	/*String*/node:  "",
	
	/**
     * Thread id where error occurred 
     * @type String
     * @default "1"
     */ 
	/*String*/threadId:	 "1",
	
	/**
	 * Explanation of this event
	 * Inserted post event receipt
	 */
	/*String*/explanation: "",
	
	/**
	 * User action for this event
	 * Inserted post event receipt
	 */
	/*String*/action:		 "",
	
    /**
	 * Default constructor
	 * @param {Object} args
	 */
	constructor: function(args) {  
		this.id = this._generateEventNumber();
		this.timestamp = new Date();
		if (args) {
		  dojo.mixin(this,args);
		}
	  },
	  
	/**
	 * Prepares this object to be garbage-collected
	 */
	destroy: function(){
		this.inherited(arguments);
		// placeholder for cleanup actions
	},

	/**
	 * Singleton method to return 
	 * the current unique static event number
	 * and increment it.
	 * @returns {int}
	 * @private
	 */
	/*int*/_generateEventNumber: function(){
		return _uniqueEventNum++;
	}
	
});

/**
 * Static number to hold the current
 * unique event id.
 * @type Integer
 * @default 1
 * @private
 */
var _uniqueEventNum = 1;
