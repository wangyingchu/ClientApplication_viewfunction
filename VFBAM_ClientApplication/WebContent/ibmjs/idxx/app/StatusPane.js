/*
 * Licensed Materials - Property of IBM
 * 5724-Q36
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.app.StatusPane");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("dijit.Toolbar");

dojo.require("dijit.tree.ForestStoreModel");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojox.timing._base");
dojo.require("dojox.grid.TreeGrid");

dojo.require("idxx.layout.LinkWithPopup");
dojo.require("idxx.events"); // for event constants

//NLS includes
dojo.requireLocalization("idxx.app", "StatusMessages");

/**
 * @name idxx.app.StatusPane
 * @class Class that implements dashboard and summary view of status pane.
 * @augments dijit._Widget
 * @augments dijit._Templated
 * 
 */
dojo.declare("idxx.app.StatusPane", 
		[ dijit._Widget, dijit._Templated ],
		/**@lends idxx.app.StatusPane#*/
{
    templateString : dojo.cache("idxx.app", "templates/StatusPane.html"),
    /*boolean*/widgetsInTemplate: true,
	
    /**
	 * Dojo Topic name to subscribe to for state events.
	 * Caller can override the topic
	 * @type String
	 * @default "idx.bus.state"
	 * @see idxx.events.TOPIC_STATE
	 */
    /*String*/topic: idxx.events.TOPIC_STATE,
    
	/**
	 * NLS messages
	 * @type Object
	 * @default {}
	 */
    msg : {},
    
    /**
     * Tree grid for status summary page
     * @type {dojox.grid.TreeGrid}
     * @private
     */
    /*dojox.grid.TreeGrid*/_gridWidget: null,
    
	/**
	 * Field that holds all state messages received
	 * @type Object
	 * @default {}
	 * @private
	 */
	/*Object*/_state: {},

    // Methods

    /**
	 * Default constructor
	 * @param {Object} args
	 * @private
	 */
	constructor: function(/*Object */args) {  
		// bring in NLS messages
		dojo.mixin( this.msg, dojo.i18n.getLocalization("idxx.app","StatusMessages") );
	},
	
	/**
	 * Prepares this object to be garbage-collected
	 * @private
	 */
	destroy: function(){
		this.inherited(arguments);
		// placeholder for cleanup actions
	},
	
    /**
     * Start listening to specified topic.
     * Connect open and close events for state dialog
     * @private
     */
    postCreate : function() {
    	this.inherited(arguments);
    	
		// Connect popup events
		dojo.connect(this.statusLinkNode, "onPopupOpened", this, this.onPopupOpened);
		dojo.connect(this.statusLinkNode, "onPopupClosed", this, this.onPopupClosed);
		
		// If the an engine status is updated we may need to update our link text
    	dojo.subscribe(this.topic, this, this.onStatusUpdated); 
	},
	
	/**
	 * Callers or subclassers implement this handler.
	 * Provides detailed state data whenever needed.
	 * @returns Object composite state info
	 */
	getData: function() { 
		var MN = this.declaredClass+".getData";
		//console.debug(MN,"_state: ",this._state);//tmp		
		return this._state;			
	},
	
	
	/**
	 * Called when status event received. Updates dashboard
	 * summary in status pane link text. Calls "getData" to get
	 * composite state information to build that link message.
	 * @param {Object} event (not used) 
	 */
	onStatusUpdated: function(/*Object*/event) {	
		var MN = this.declaredClass+".onStatusUpdated";
		console.debug(MN,"Event: ",event);//tmp	
		
		var state = this.getData();
		
		// Update our link text
		var probs = 0;
		state[event.host] = event; // TODO at first just replace entire host
		for (var item in this._state ) {
	    	if(state[item].statusOK==false) {
	    		probs++;
	    	}
		} 
	    var txt = null;
	    
	    var key = this.msg.STATUS_ALLSYSTEMSOK;
	    if(probs == 0) {
	    	this.statusLinkNode.set("linkLabel",key );
	    	dojo.removeClass(this.statusIconNode, "iconError_glow_23x24");
	    	dojo.addClass(this.statusIconNode, "iconOK_16x16");
	    	dojo.removeClass(this.statusTextNode, "stateStatusPanelAlertText");	    	
	    	dojo.removeClass(this.containerNode, "stateStatusPanelAlert");
	    }
	    else {	    		    		
	        if (probs == 1) {	
	        	key = this.msg.STATUS_ONEISSUE;
		    }
		    else if (probs > 1) {
		      key = this.msg.STATUS_ISSUES;
		    }
	        this.statusLinkNode.set("linkLabel",dojo.string.substitute(key,{"0":probs}) );
	    	dojo.removeClass(this.statusIconNode, "iconOK_16x16");
	    	dojo.addClass(this.statusIconNode, "iconError_glow_23x24");	    	
	    	dojo.addClass(this.containerNode, "stateStatusPanelAlert");
	    	dojo.addClass(this.statusTextNode, "stateStatusPanelAlertText");
	    }	    
    },

	
    //-----------------------------------------------------
    // Events
    //-----------------------------------------------------
	
	/**
 	 * Event: onPopupClosed - called when popup closed.
 	 * User can catch this event and provide their 
 	 * additional cleanup.
 	 * Performs cleanup when dialog closed, removes grid widget.
 	 * @type Function
 	 * @param {Object} source
 	 */
    onPopupClosed: function(/*Object*/source) {
    	// Clear the grid so next time in it doesn't have old data visible while the refresh is in progress
    	if(this._gridWidget == null) return;
    	this._gridWidget.treeModel.store.data = { items: [] };
    	this._gridWidget.treeModel.store.close();
    	this._gridWidget._refresh();
	},
    
    /**
 	 * Event: onPopupOpened - called when link clicked
 	 * and popup dialog is opened. User can catch this event
 	 * and provide their additional handling or content.
 	 * Calls "getData". Updates info in dialog to show status results.
 	 * @type Function
 	 * @param {Object} source - ignored
 	 */
	onPopupOpened: function(/*Object*/source) {   
		var MN = this.declaredClass+".onPopupOpened";
    	
		// Create the data with which to populate our store
		var allItemsStatus= [];

		var items = this.getData(); 
		for (var key in items ) { 
			var item = items[key];		
			var itemStatus = [];
			if(item.statusOK) {
				itemStatus.push({name: this.msg.STATUS_POPUP_ALLSYSTEMSOK, type: item.typeState, statusOK: true});
			}
			else {
				// Add details of the failing items...
				if(item.details) {
					dojo.forEach(item.details,  dojo.hitch(this,function(det) {						
						var ok = (det.statusCode=="QUICK_OK" || det.statusCode=="DISABLED" || det.statusCode=="FULL_OK" || det.statusCode=="NOT_CHECKED");						
						if(!ok) {
							itemStatus.push({
								statusOK: false,
								name: (det.localizedDisplayName || det.displayName), 
								status: (det.localizedStatusMessage || det.statusMessage),
								type: det.typeState });
						}
					}) );
				}
			}			
			allItemsStatus.push({name: item.host, portNumber: item.port, type: item.typeState, statusOK: item.statusOK, items: itemStatus});
		} 
	   
		if( allItemsStatus.length == 0 ) return ; // nothing to show...
		
		// Now create or update our grid & store
	    if(this._gridWidget == null) {
	    	this._createGrid(allItemsStatus);
	    }
	    else {
	    	// Update
	    	this._gridWidget.treeModel.store.data = {items: allItemsStatus};
	    	this._gridWidget.treeModel.store.close();
	    	this._gridWidget._refresh();
	    }	
    },
    
    /**
     * Worker to create store and grid widget
     * @param {Array} allItemsStatus
     * @private
     */
    _createGrid: function(/*Object[]*/allItemsStatus) {
    	
    	if(this._gridWidget != null) return;
    	
    	// Create
		var store = new dojo.data.ItemFileReadStore({data: {items: allItemsStatus}, clearOnClose: true});
		var treeModel = new dijit.tree.ForestStoreModel({
			store: store,
			rootId: 'root',
			rootLabel: 'root',
			childrenAttrs: ['items']
		});				

    	// Create the grid for the popup
    	var availableStructure = [ 
            { name: this.msg.STATUS_POPUP_NAME,   field: "name",   width: "auto" , formatter: this._gridFmt_Name },
            { name: this.msg.STATUS_POPUP_STATUS, field: "status", width: "150px" }];  	
    	
    	// Create the grid	    
    	this._gridWidget = new dojox.grid.TreeGrid({ 
				structure: availableStructure,			
				treeModel: treeModel, 
				noDataMessage: this.msg.STATUS_POPUP_NODATA, 
				defaultOpen: true},
			this.gridNode);  
    	this._gridWidget.startup();
    },
    
    /**
     * Private grid formatter to show an OK or error icon next
     * to the name, based on status 
     * @param cellValue
     * @param rowIndex
     * @param cellDef
     * @param rowDetails
     * @param preOnClickJS
     * @returns String name to show for this source item
     * @private
     */
	_gridFmt_Name: function(cellValue, rowIndex, cellDef, rowDetails, /*string*/preOnClickJS) {
		//var MN = this.declaredClass+"._gridFmt_Name";
		var item = rowDetails.grid.getItem(cellDef);
		var txt = "<b>" + cellValue + "</b>";	
		var imgClass = "iconOK_16x16";
		var statusOK = item.statusOK && item.statusOK ? item.statusOK[0] : false;
		if(statusOK == false) {
			imgClass = "iconError_16x16";
		}
	    var tmpl = "<div style='width: 16px; height: 16px;' class='dijitInline ${0}'></div><div class='dijitInline' style='margin-left: 4px;'>${1}</div>";
		return dojo.string.substitute(tmpl, [imgClass, txt]);
	}
	
});