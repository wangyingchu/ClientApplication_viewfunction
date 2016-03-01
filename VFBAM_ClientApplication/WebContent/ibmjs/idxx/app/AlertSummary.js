/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.app.AlertSummary");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.Button"); 
dojo.require("dojox.grid.DataGrid"); 
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ComboBox");
//dojo.require("dijit.Tooltip");

// IDX includes
dojo.require("idx.widget.HoverHelp");
dojo.require("idx.layout.ButtonBar"); //for event grid buttons
//idx one not working with bc... dojo.require("idx.layout.HeaderPane");
dojo.require("idxx.layout.HeaderPane"); //idx one not working with bc...
dojo.require("idx.bus"); // for event constants
dojo.require("idx.grid.cells");
dojo.require("dijit.layout.StackContainer");
dojo.require("idx.layout.BreadcrumbController");

// IDX eXperimental includes 
dojo.require("idxx.events"); // for event constants
dojo.require("idxx.bus.Message"); // for UML generator only
dojo.require("idxx.app.AlertDetails"); // for popup individual msg detail

//NLS includes
dojo.requireLocalization("idxx.app","AlertMessages");

/**
 * @name idxx.app.AlertSummary
 * @class Class that implements summary view of alert pane with 
 * 3 views: dashboard, summary, and details.
 * @augments dijit._LayoutWidget
 * @augments dijit._Templated
 */
dojo.declare("idxx.app.AlertSummary", [
		dijit._Widget, dijit._Templated ], 
		/**@lends idxx.app.AlertSusmmary#*/
{
	templateString : dojo.cache("idxx.app","templates/AlertSummary.html"),
	/* boolean */ widgetsInTemplate : true,

	/**
	 * Event list store for the grid
	 * @type dojo.data.ItemFileWriteStore
	 * @default null
	 * @private
	 */
	 /*ItemFileWriteStore*/ _store: null,
	
	/**
	 * ComboBox for choosing event level filter
	 * in HTML template.
	 * @type ComboBox
	 * @private
	 */
	/*ComboBox */ _filter: null,
	
	/**
	 * Grid used for event list in HTML template.
	 * @type DataGrid
	 */
	/*DataGrid*/ _grid: null,

	/**
	 * Keep all connections made so they can be cleaned up
	 * @type Array
	 * @private
	 * @default []
	 */
	 /*Object[]*/connections: [],
	
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
	 * Post template init method. 
	 * Connect grid row click to handler
	 * open and close events.
	 */
    postCreate : function() {
    	this.inherited(arguments);
		// Connect events
    	this.connections.push(
    		dojo.connect(this._grid,"onRowClick", dojo.hitch(this,this.rowClicked ) )
    	);
    	/*this.connections.push(
    		dojo.connect(this._grid, "onCellMouseOver",dojo.hitch(this,this._showTooltip ) )
    	);
    	this.connections.push(
    		dojo.connect(this, "onCellMouseOut", dojo.hitch(this,this._hideTooltip) )
    	);*/
	},
  
	/**
	 * Prepares this object to be garbage-collected
	 */
	destroy: function(){
		this.inherited(arguments);
		 dojo.forEach(this.connections, dojo.disconnect);
	},

	/**
	 * Store of events set here before popup shown
	 * @param {ItemFileWriteStore} store
	 */
	setStore: function(/*ItemFileWriteStore*/ store) {
		this._store = store;
	
    	this._grid.setStore(this._store);
		this._grid.render();	
		this._hdrEvents.resize();

    },
	
	/**
	 * Method called when grid row clicked
	 * @param {Event} - the mouse over event 
	 * Sets object instance data field(s):
	 * 	btnView   - sets disabled to false
	 *  btnRemove - "
	 */	
	rowClicked: function(e) {
		this._btnView.set('disabled',false);
		this._btnRemove.set('disabled',false);
    },
        	
    /**
     * Remove the selected item rows 
     * @param items {Array} selected items for removal
     */
	remove: function() {
		this._removeRows ( this._grid.selection.getSelected() );
	},
	
	/**
     * Worker method to remove the selected item rows from the store
     * and saves these changes.
     * @param items {Array} selected items for removal
     * @private
     */
	_removeRows: function(items) {
		MN = this.declaredClass+".removeRows ";
    	console.debug(MN+"items...");console.dir(items);
        if (items.length) {
            // Iterate through the list of selected items.
            // The current item is available in the variable
            // "selectedItem" within the following function:
        	dojo.forEach(items, dojo.hitch(this,function(selectedItem) {
                if (selectedItem !== null) {
                    // Delete the item from the data store:
                    this._store.deleteItem(selectedItem);
                    this._store.save();                 
                } // end if
            })); // end forEach
        } // end if
	},
	
    /**
     * Clear the events out of the console
     * Calls method 'removeRows' for all items
     * in event list grid.
     * @param e {Event}
     */
    clear: function(e) {
    	MN = this.declaredClass+".clear ";
		this._store.fetch({onComplete: dojo.hitch(this,function(items,request) {
			console.debug(MN+"Number of items located: " + items.length);
			if( items.length == 0 ) return;
			this._removeRows(items); 
	    	this._grid.render();	// update grid
		})});// end fetch
    },   
	
    /**
     * Show the event details dialog
     * @param e
     */
    showDetails: function(e) {
    	//var MN = this.declaredClass+".showDetails";	
    	var item = this._grid.selection.getFirstSelected();
    	if(this._details) delete this._details;// cleanup
    	this._details = new idxx.app.AlertDetails( { title:  dojo.string.substitute(this.msg.alertById,{id:item.id}) } );
    	this._details.setData( item );    	
		this._alertStack.addChild(this._details); //not dialog anymore... this._detailsDialog.show();
    },
    
    /**
     * Called to swap the header buttons when the breadcrumb button is pressed
     * as the user selects between a summary or a details view.
     * @param page 
     */
    _onBreadcrumbChange: function(page)
	{
    	//var MN = this.declaredClass+"_onBreadcrumbChange";
		if( page.declaredClass == "idxx.app.AlertDetails")
		{			 		
			this._alertBBStack.selectChild(this._alertBBDetails.id);
		}
		else { 
			this._alertBBStack.selectChild(this._alertBBSummary.id);
		}
	},
	
	/**
	 * Called when user closes details view via close button
	 * Will trigger a bread crumb change event 
	 */
	_close: function() {
		this._alertStack.selectChild(this._grid.id);
	},
    
	/**
	 * Called when users selects level filter enters 
	 * @param {Event} event 
	 */
	_doFilter: function(event) {
		var MN = this.declaredClass+"._doFilter("+this._filter.item.value+") ";
		var value = this._filter.item.value;
		if( value == "" || value == idx.bus.INFO || value == idx.bus.DEBUG) value = "*"
		console.debug(MN,"filter value=["+value+"] event: ",event,"info="+idx.bus.INFO);//tmp
		this._grid.filter({ level: value } );
	},
	
	/* Method to show the tooltip for a grid cell
	 * @param e - the mouse over event
	 * @private 
	 */	
	_showTooltip: function(e) {
		var MN = this.declaredClass+"._showTooltip";//tmp
		console.info(MN,"ENTER");//tmp
        var item = this._grid.getItem(e.rowIndex);
		dijit.showTooltip(item.msg, e.rowNode);
		console.info(MN,"EXIT");//tmp
    },
    
	/* Method to hide the tooltip for a grid cell
	 * @param e - the mouse out event
	 * @private 
	 */	    
    _hideTooltip:  function(e) {
    	var MN = this.declaredClass+"._hideTooltip";//tmp
		console.info(MN,"ENTER");//tmp
		dijit.hideTooltip(e.rowNode);
		// FIXME: make sure that pesky tooltip doesn't reappear!
		// would be nice if there were a way to hide tooltip without regard to aroundNode.
		dijit._masterTT._onDeck=null;  		
	}


});