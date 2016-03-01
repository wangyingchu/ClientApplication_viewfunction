/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.app.AlertPane");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("dijit.form.NumberSpinner");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.layout.ContentPane");

// IDX includes
dojo.require("idx.bus"); // for event constants

// IDX eXperimental includes 
dojo.require("idxx.layout.LinkWithPopup");
dojo.require("idxx.events"); // for event constants
dojo.require("idxx.bus.Message"); // for UML generator only
dojo.require("idxx.app.AlertSummary");

//NLS includes
dojo.requireLocalization("idxx.app","AlertMessages");

/**
 * @name idxx.app.AlertPane
 * @class Class that implements dashboard view of alert pane with 
 * 3 views: dashboard, summary, and details.
 * @augments dijit._LayoutWidget
 * @augments dijit._Templated
 */
dojo.declare("idxx.app.AlertPane", [
		dijit._Widget, dijit._Templated ], 
		/**@lends idxx.app.AlertPane#*/
{
	templateString : dojo.cache("idxx.app","templates/AlertPane.html"),
	/* boolean */ widgetsInTemplate : true,
	
	/**
   	 * Number of alerts (counter)
   	 * @type int
   	 * @default 0
   	 */
	/* int */_numAlerts: 0,
	
	/**
	 * Alert by number spinner
	 * @type dijit.form.NumberSpinner
	 */
	/*NumberSpinner*/ _spinner: null, 

	/**
	 * Event list store for the grid
	 * @type dojo.data.ItemFileWriteStore
	 * @default null
	 */
	 /*ItemFileWriteStore*/ _store: null,
	
	/**
	 * Default data for the event list grid store
	 * @type Object
	 * @default {identifier: 'id',label: 'name', items: [] },
	 */
	_data:  {identifier: 'id',label: 'name', items: [] },
	
	/**
	 * Event that is showing in status line
	 * @type Object
	 * @default {}
	 */
	/*Message*/ _selectedEvent: {}, 

	/**
   	 * Label for number of alerts msg
   	 * @type string
   	 * @default "0 of 0"
   	 */
	/* String*/ _numAlertsMsg: "",
	
	/**
	 * NLS messages
	 * @type Object
	 * @default {}
	 */
    msg : {},
    
	/**
	 * Keep all connections made so they can be cleaned up
	 * @type Array
	 * @private
	 * @default []
	 */
	 /*Object[]*/connections: [],
    
	/**
	 * Dojo Topic name to subscribe to for alert events.
	 * @type String
	 * @default "idx.bus"
	 * @see idx.bus.DEFAULT_BUS_TOPIC
	 */
    topic: idx.bus.DEFAULT_BUS_TOPIC,
   
   
	/**
	 * Default constructor
	 * @param {Object} args
	 * Subscribes to topic idx.bus.DEFAULT_BUS_TOPIC , 
	 * calling method 'onAlertUpdated' to handle.
	 * Sets object instance data fields:
	 *    store - with a dojo.data.ItemFileWriteStore
	 *    using the default 'data' contents.
	 * @private
	 */
	constructor: function(/*Object */args) {  
		var MN = this.declaredClass+".<constructor> ";

		// bring in NLS messages
		dojo.mixin( this.msg, dojo.i18n.getLocalization("idxx.app","AlertMessages") );
		this._numAlertsMsg = dojo.string.substitute(this.msg.alertNum,{num: '0',total: '0' });
		
		if (args) {
		  dojo.mixin(this,args);
		}
		dojo.subscribe(
				this.topic ,
				dojo.hitch(this, this.onAlertUpdated)
		);
				
		this._store = new dojo.data.ItemFileWriteStore( {data: this._data} );
	},
  
	/**
	 * Post template init method. Connect to popup link
	 * open and close events.
	 * @private
	 */
    postCreate : function() {
    	this.inherited(arguments);
		// Connect popup events
    	this.connections.push(
    		dojo.connect(this.alertLinkNode, "onPopupOpened", this, this.onPopupOpened)
    	);
    	this.connections.push(
    		dojo.connect(this.alertLinkNode, "onPopupClosed", this, this.onPopupClosed)
    	);
	},
	
	/**
	 * Prepares this object to be garbage-collected
	 * @private
	 */
	destroy: function(){
		this.inherited(arguments);
		dojo.forEach(this.connections, dojo.disconnect);
		// placeholder for cleanup actions
	},
	
	/**
	 * Callers or subclassers implement this handler.
	 * Provides detailed alert data whenever needed.
	 * @returns ItemFileWriteStore _store of alerts
	 */
	getData: function() { 
		var MN = this.declaredClass+".getData";
		//console.debug(MN,"_store: ",this._store);//tmp		
		return this._store;			
	},
	
	/**
	 * Called when alert event received. Updates dashboard
	 * summary in alert pane link text. Calls "getData" to get
	 * alert store, which this new alert is added to. 
	 * @param {Message} event  
	 * 	Example event message:
	 *  	{
	 *  		id:          1, 
	 *  		topic:    "topicConsoleAlert",
	 *  		source:   "idx.app.ConsoleFrame.onComplete "
	 *  		name:     "loaded",
	 *  		msg:      "NLS version of message",
	 *  		scope:    "local",
	 *  		level:    "INFO",
	 *  		args:     {},
	 *  		timestamp:<timestamp> 
	 *  	}
	 * Sets object instance data field(s):
	 *  	_numAlerts - increments by one
	 *  	_store - adds item event to event grid/list
	 *  	_spinner - sets value to incremented 'numAlerts'
	 */
	onAlertUpdated: function(/*Message*/ event) {
		var MN = this.declaredClass+".onAlertUpdated ";
		
		var store = this.getData();
		
		this._selectedEvent = event;
		
		if( event.msg == null )
			event.msg = dojo.string.substitute(this.msg[event.name], event.args ) ;
		
		console.debug(MN+"event="+event.msg,"event: ",event);
		this._numAlerts++;	
		store.newItem(event);
		this._spinner.set('value',this._numAlerts); // triggers on change below
	},

	
    /**
 	 * Event: onPopupOpened - called when link clicked
 	 * and popup dialog is opened. User can catch this event
 	 * and provide their additional handling or content.
 	 * Calls "getData". Sets store of alerts into alertSummmary widget.
 	 * @type Function
 	 * @param {Object} source - ignored
 	 */
	onPopupOpened: function() {
		this.alertSummary.setStore( this.getData() );	
	},
	
	/**
 	 * Event: onPopupClosed - called when popup closed
 	 * User can catch this event and provide their 
 	 * additional cleanup.
 	 * Performs cleanup when dialog closed.
 	 * Checks number of alerts (in case any removed) and
 	 * resets spinner on statusbar accordingly.
 	 * @type Function
 	 * @param {Object} source
 	 */
	onPopupClosed: function(/*Object*/source) {
		this._store.fetch({onComplete: dojo.hitch(this,function(items,request) {
			if( items.length != this._numAlerts ) { // # alerts changed?
				this._numAlerts = items.length;	        		
        		this._spinner.set('value',this._numAlerts); // triggers on change below
			}
		})});// end fetch
	},
	
	
	//-----------------------------------------------------	
	// Private worker methods
	//-----------------------------------------------------
	/**
	 * Alert spinner changed. Update current alert shown
	 * Sets object instance data field(s):
	 * 	_selectedEvent
	 *  _status
	 *  _spinner - sets new value
	 *  @private
	 */
	_onChangeSpinner: function() {
		var MN = this.declaredClass+"._onChangeSpinner ";
		var num = this._spinner.value;		
		//console.debug(MN+"ENTRY num="+num);	
		if (isNaN(num) ) return; // sometimes is Nan if bad # entered
		
		if(this._numAlerts==0) {
			num = 0;
			this._selectedEvent = null;
		}
		this.alertLinkNode.set("linkLabel",dojo.string.substitute(this.msg.alertNum,{num: num,total:this._numAlerts} ) );
		this._spinner.constraints={max: this._numAlerts, min: this._numAlerts>0 ? 1 : 0 };
		this._store.fetch({onComplete: dojo.hitch(this,function(items,request) {
			//console.debug(MN+"fetch-#items"+items.length);
			if( items.length > 0) {
				this._selectedEvent = items.length>0 ? items[ num-1 ]            : null;
				var msg            = items.length>0 ? this._selectedEvent.msg : this._noMessages;			
			}				
		})});// end fetch
		//console.debug(MN+" EXIT spinner num="+num+" #alerts="+this._numAlerts);		
	}
		

});