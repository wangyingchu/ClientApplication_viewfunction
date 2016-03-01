/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.events");

dojo.require("idx.bus");
dojo.require("idxx.bus.Message");

/**
 * @name idxx.events
 * @class Provides a set of constants for the message bus 
 * as well as some convenience event message factories.
 */
(function()
/**@idxx.events#*/	
{

	//---------------------------------------------------------------	
	// STATIC CONSTANTS - TOPICS
	//---------------------------------------------------------------	
  
	/**
 	 * Dojo pub/sub topic for REST server events
 	 * @constant
 	 * @type String
 	 * @default '"idx.bus.rest"
 	 */
	 /*String*/idxx.events.TOPIC_REST = "idx.bus.rest";
	 
	/**
 	 * Dojo pub/sub topic for STATE events
 	 * @constant
 	 * @type String
 	 * @default 'idx.bus.state'
 	 */
	 /*String*/idxx.events.TOPIC_STATE = "idx.bus.state";

	//---------------------------------------------------------------	
	// STATIC CONSTANTS - EVENT VALUES ARE MESSAGE KEYS IN MSG FILE
	//---------------------------------------------------------------	

	 /**
 	 * Constant alert event for component loaded event
 	 * @constant
 	 * @type String
 	 * @default "loaded"
 	 */
	 /*String*/idxx.events.EVENT_NOTIF_LOADED = "loaded";
	
	 /**
 	 * Constant alert event for component unloaded event
 	 * @constant
 	 * @type String
 	 * @default "unloaded"
 	 */
	 /*String*/idxx.events.EVENT_NOTIF_UNLOADED = "unloaded";
	 
	/**
 	 * Constant alert event for component registry loaded event
 	 * @constant
 	 * @type String
 	 * @default "loadedRegistry"
 	 */
	 /*String*/idxx.events.EVENT_NOTIF_LOADED_REGISTRY = "loadedRegistry";	
	
	/**
 	 * Constant alert event for state change= starting
 	 * @constant
 	 * @type String
 	 * @default "starting"
 	 */
	 /*String*/idxx.events.EVENT_NOTIF_STARTING = "starting";
	 
	/**
	 * Constant alert event for state change= stopping
	 * @constant
	 * @type String
	 * @default "stopping"
	 */
	 /*String*/idxx.events.EVENT_NOTIF_STOPPING = "stopping";
	
	/**
 	 * Constant alert event for state change= stopped
 	 * @constant
 	 * @type String
 	 * @default "stopped"
 	 */
	 /*String*/idxx.events.EVENT_NOTIF_STOPPED = "stopped";
	
	/**
 	 * Constant alert event for state change= running
 	 * @constant
 	 * @type String
 	 * @default "running"
 	 */
	 /*String*/idxx.events.EVENT_NOTIF_RUNNING = "running";
	 
	 /**
 	 * Constant alert event for focus gained event
 	 * @constant
 	 * @type String
 	 * @default "focusGained"
 	 */
	 /*String*/idxx.events.EVENT_NOTIF_FOCUS_GAINED = "focusGained";
	 
	 /**
 	 * Constant alert event for focus lost event
 	 * @constant
 	 * @type String
 	 * @default "focusLost"
 	 */
	 /*String*/idxx.events.EVENT_NOTIF_FOCUS_LOST = "focusLost";

	 //--------------------------------------------------------------	 
	 // Convenience event factory methods
	 //--------------------------------------------------------------

  	/**
  	 * Creates a generic console notification to the
  	 * console notification topic.
  	 * @param {Object} args 
  	 * @returns {idxx.bus.Message}
  	 */
  	/*Message*/idxx.events.createConsoleEvent = function(/*Object*/args) 
  	{
  		if(!args.topic)			args.topic			= idx.bus.DEFAULT_BUS_TOPIC ;
		if(!args.sourceObject)	args.sourceObject	= this.id;
		if(!args.level)			args.level			= idx.bus.INFO;
  		return new idxx.bus.Message(args);
  	};
  	
  	/**
  	 * Creates a generic console notification to the
  	 * console notification topic.
  	 * @param {Object} args 
  	 * @returns {idxx.bus.Message}
  	 */
  	/*Message*/idxx.events.createConsoleNotification = function(/*Object*/args) 
  	{
		if(!args.topic)			args.topic			= idx.bus.NOTIFICATIONS;
		if(!args.level)			args.level			= idx.bus.INFO;
		if(!args.sourceObject)	args.sourceObject	= this.id;
		return new idxx.bus.Message(args);
  	};
  	
  	/**
  	 * Creates a generic console alert to the
  	 * alert console topic.
  	 * @param {Object} args 
  	 * @returns {idxx.bus.Message}
  	 */
  	/*Message*/idxx.events.createConsoleAlert = function(/*Object*/args) 
  	{
		if(!args.topic)			args.topic			= idx.bus.DEFAULT_BUS_TOPIC ;
		if(!args.level)			args.level			= idx.bus.WARN;
		if(!args.sourceObject)	args.sourceObject	= this.id;
		return new idxx.bus.Message(args);
  	};
  	
  	
  	/**
  	 * Create a component loaded event
  	 * @param {Object} args 
  	 * @returns {idxx.bus.Message}
  	 */
  	/*Message*/ idxx.events.createLoadedEvent = function(/*Object*/ args) 
  	{	 
		if(!args.name) args.name = idxx.events.EVENT_NOTIF_LOADED;
		return idxx.events.createConsoleNotification(args);
  	},
  	
  	/**
  	 * Create a focus gained event
  	 * @param {Object} args 
  	 * @returns {idxx.bus.Message}
  	 */
  	/*Message*/idxx.events.createFocusGainedEvent = function(/*Object*/ args) 
  	{	 		
		if(!args.name) args.name = idxx.events.EVENT_NOTIF_FOCUS_GAINED;
		return idxx.events.createConsoleNotification(args);
  	},
  	
  	/**
  	 * Create a focus lost event
  	 * @param {Object} args 
  	 * @returns {idxx.bus.Message}
  	 */
  	/*Message*/idxx.events.createFocusLostEvent = function(/*Object*/ args) 
  	{	 		
		if(!args.name) args.name = idxx.events.EVENT_NOTIF_FOCUS_LOST;
		if(!args.level)			args.level			= idx.bus.WARNING;
		return idxx.events.createConsoleNotification(args);
  	},	
  	
  	/**
  	 * Create a component UNloaded event
  	 * @param {Object} args 
  	 * @returns {idxx.bus.Message}
  	 */
  	/*Message*/idxx.events.createUnloadedEvent= function(/*Object*/ args) 
  	{	 
		if(!args.name) args.name = idxx.events.EVENT_NOTIF_UNLOADED;
		if(!args.level)			args.level			= idx.bus.WARNING;		
		return idxx.events.createConsoleNotification(args);
  	},
  	/**
  	 * Create a registry loaded event
  	 * @param {Object} args 
  	 * @returns {idxx.bus.Message}
  	 */
  	/*Message*/idxx.events.createRegistryLoadedEvent= function(/*Object*/args ) 	
  	{	 		
		if(!args.name) args.name = idxx.events.EVENT_NOTIF_LOADED_REGISTRY;
		return idxx.events.createConsoleNotification(args);
  	};

})();
