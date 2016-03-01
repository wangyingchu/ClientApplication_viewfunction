/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

({
	
    // Common dialog and/or button messages     
	closeTitleBtn:		"Close",
	yesTitleBtn:		"Yes",
	noTitleBtn:			"No",	
	okTitleBtn:			"OK",
	cancelTitleBtn:		"Cancel",
	applyBtn:			"Apply",
	viewBtn:			"View",
	removeBtn:			"Remove",
	clearBtn:			"Clear",
	statusOK:			"All Servers OK",
	statusNotOK:		"${num} server(s) has issues.",
	
	// search box input field
	searchDefaultText:	"Enter Search Term...",
	helpTextEvents:		"Help text for events goes here.",
	helpLinkEvents:		"http://www.ibm.com", // placeholder for event help link

    // Alert/event messages
    noAlerts: "0 Alerts",
    numAlerts: "${num} Alerts",
	statusLabel: "Status:",
	alertLabel:  "Alerts:",
	alertById:   "Alert: ${id}",
	statusEnginesOK:"All Engines OK",
	alertNum:		"${num} of ${total}",
	statusListDialogTitle: "Server Status",
	eventListTableTitle:"Alerts",
	eventListDialogTitle: "Alert Summary",
	eventListDialogText: "Use this page to view runtime alerts.",
	eventListDialogTextLong: "Runtime alerts have been enabled for display by default. To filter an event level please select from the list and then click the apply button.",

	// Event message detail
	eventDetailsTitle:"Message Details",
	msgID:     		"ID",
	msgTimestamp:   "Time Occurred",
	msgDate:   		"Date",
	msgTime:   		"Time",
	msgSource:      "Message Originator", // id of originator
	msgSourceObject:"Source Object",
	msgLevel:       "Level",
	msgNLS:    		"Message",
	msgName:		"Name",
	msgHost: 	  	"Server",
	msgNode:		"Node",
	msgScope:		"Event Scope",
	threadId:		"Thread ID",	
	explanation:    "Explanation",
	action:			"User Action",
	
	//---------------------------------------------------------------	
	// STATIC CONSTANTS - LEVEL MESSAGES
	//---------------------------------------------------------------	
    /**
     * No Message severity level filtering
     * @type String
     * @default "NONE"
     */
     NONE :	"NONE",
     
     /**
      * Message severity level for info
      * @type String
      * @default "Info"
      */
      INFO :	"INFO",
    /**
     * Message severity level for warning
     * @type String
     * @default "Warn"
     */
     WARN :	"WARN",
    /**
     * Message severity level for error
     * @type String
     * @default "Error"
     */
     ERROR :  "ERROR",
    /**
     * Message severity level for debug
     * @type String
     * @default "Debug"
     */
     DEBUG :  "DEBUG",
 	//---------------------------------------------------------------	
 	// STATIC CONSTANTS - EVENT MESSAGES
 	//---------------------------------------------------------------	
     /**
     * Message for alert event when registry loaded 
     * @constant
     * @type String
     * @default "The component registry has loaded."
     */
     loadedRegistry: "The component registry located at '${url}' has loaded.",
 	/**
     * Message for alert event when component loaded 
     * @constant
     * @type String
     * @default "The component '${comp}' has loaded."
     */
     loaded : "The component '${comp}' has loaded as type '${type}' in container '${containerId}' with id '${id}'.",
 	/**
   	 * Message for alert event when component UNloaded 
   	 * @constant
   	 * @type String
   	 * @default "The component '${comp}' has un loaded.",
   	 */
     unloaded: "The component '${comp}' has un loaded.",
     /**
      * Message for alert event when focus gained 
      * @constant
      * @type String
      * @default "The component '${name}' with id '${id}' has lost focus. Its help URL is '${helpUrl}'."
      */
     focusGained : "The component '${name}' with id '${id}' has gained focus. Its help URL is '${helpUrl}'.",
     
     /**
      * Message for alert event when focus lost 
      * @constant
      * @type String
      * @default "The component '${name}' with id ${id} has lost focus."
      */
     focusLost : "The component '${name}' with id '${id}' has lost focus.",
     
 	/**
   	 * Message alert event for state change: starting
   	 * @constant
   	 * @type String
   	 * @default "The component '${comp}' is starting."
   	 */
     starting : "The component '${comp}' is starting.",
 	/**
 	 * Message alert event for state change: stopping
 	 * @constant
 	 * @type String
 	 * @default "The component '${comp}' is stopping."
 	 */
     stopping : "The component '${comp}' is stopping.",
 	
 	/**
   	 * Message alert event for state change: stopped
   	 * @constant
   	 * @type String
   	 * @default "The component '${comp}' is stopped.",
   	 */
     stopped: "The component '${comp}' is stopped.",
 	
 	/**
   	 * Message alert event for state change: running
   	 * @constant
   	 * @type String
   	 * @default "The component '${comp}' is running."
   	 */
     running : "The component '${comp}' is running.",

	lastitem:			null    	
})
