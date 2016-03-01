/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.layout.HeaderPane");

dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit._Templated");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");

dojo.require("idx.util");
dojo.require("idx.string");

/**
 * @name idxx.layout.HeaderPane
 * @class HeaderPane widget
 * @augments dijit.layout._LayoutWidget
 * @augments dijit._Templated
 */
dojo.declare("idxx.layout.HeaderPane", 
		[dijit.layout._LayoutWidget,dijit._Templated],
		/**@lends idxx.layout.HeaderPane#*/			
{

	/**
   	 * Overrides of the base CSS class.
   	 * Prevent the _LayoutWidget from overriding the "baseClass"
   	 * 
   	 * @private
   	 * @constant
   	 * @type String
   	 * @default "idxHeaderPane"
   	 */
  baseClass: "idxHeaderPane",


	/**
	 * The string for the widget template for the dijit._Templated base class.
	 * @constant
	 * @type String
	 * @private
	 * @default "templates/HeaderPane.html"
	 */
  templateString: dojo.cache("idxx.layout","templates/HeaderPane.html"),


	/**
	 * Constant to indicate if the template has dojo widgets and therefore needs parsing
	 * @private
	 * @constant
	 * @type boolean
	 * @default true
	 */
  widgetsInTemplate: true,

  /**
   * Variable to indicate whether user wants content to be used as the title,
   * if not, the title attribute will be displayed in title area of headerPane
   * 
   * @private
   * @type boolean
   * @default false
   */
  /*boolean*/ _hasTitleContent: false,
  
	/**
	 * Constructor
	 * Handles the reading any attributes passed via markup.
	 * @param {Object} args
	 * @param {Object} node
	 */
  constructor: function(args, node)
  {
    idx.util.mixinCSSDefaults(this, this.baseClass + "Defaults", node);

    this._built             = false;
  },
  
  /**
	* Prepares this object to be garbage-collected
	*/
	destroy: function(){
		this.inherited(arguments);
		// placeholder for cleanup actions
	},
	
  /**
   * Private setter of title
   * @param {String} value
   * @private
   */
  _setTitleAttr: function(/*String*/value) {
    this.title = value;
    this.inherited(arguments);
    if (! this._built) return;
    if(!this._hasTitleContent)
    	//this._titleNode.set("content",this.title); //if contentPane
    	this._titleNode.innerHTML = this.title;
  },


  /**
   * Override dijit.layout._LayoutWidget
   * 
   * "Called after all the widgets have been instantiated and their
   * dom nodes have been inserted somewhere under dojo.doc.body.
   * 
   * Widgets should override this method to do any initialization
   * dependent on other widgets existing, and then call
   * this superclass method to finish things off.
   * 
   * startup() in subclasses shouldn't do anything
   * size related because the size of the widget hasn't been set yet."
   * 
   * @private
   * @see dijit.layout._LayoutWidget.startup
   */
  startup: function()
  {
    if(this._started){ return; }

    dojo.forEach(this.getChildren(), this._setupChild, this);
    
    if(!this._hasTitleContent)
    	//this._titleNode.set("content",this.title);
    	this._titleNode.innerHTML = this.title;
    
    this.inherited(arguments);

  },

  /**
   * 
   * @see dijit.layout._LayoutWidget.layout
   */
  layout: function()
  {
    this._frameContainer.layout();
    this._headerContainer.layout();

    this.inherited(arguments);
  },

  /**
   * Extends parent method by adding in a resize after the 
   * child node is added.
   * @param {Object} child
   * @param {int} index
   * @see dijit.layout._LayoutWidget.addChild
   */
  addChild: function(child, index)
  {
    this.inherited(arguments);
    this.resize();
  },

  /**
   * Extends parent method 
   * @param {Object} child
   * @see dijit.layout._LayoutWidget.removeChild
   */
  removeChild: function(/*_LayoutWidget*/child)
  {
    this.inherited(arguments);
    this.resize();
  },

  /**
   * Extends parent method
   *  
   * @param {Widget} child
   * @private
   * @see dijit.layout._LayoutWidget._setupChild
   */
  _setupChild: function(/*_LayoutWidget*/ child)
  {
	  
    this.inherited(arguments);
    var region  = idx.string.nullTrim(child.region);
    var actions = null;

    var node = null;
    switch( region )
    {
    	case "title":
    		node = this._titleNode;
    		if(!this._hasTitleContent)
    		{
    			this._hasTitleContent = true;
    			node.innerHTML = "";
    		}
    		break;
    	case "titleActions":
    		node = this._titleActionsNode;
    		break;
    	case "majorActions":
    		node = this._majorActionsNode;
    		break;
    	case "minorActions":
    		node = this._minorActionsNode;
    		break;
    	
    	default:
    		node = this.containerNode;
    }
    
    // check if the widget is already where it belongs
    if (node == this.containerNode) return;

    // otherwise move the widget
    var nodeList = new dojo.NodeList(child.domNode);
    nodeList.orphan();
    dojo.place(child.domNode, node, "last");
    //var nodeToMove = new dojo.NodeList(child).orphan();
    //nodeList.orphan();
    //dojo.place(nodeToMove.domNode, node, "last");
    //dojo.NodeList(node).adopt(nodeToMove);
    //node.addChild(nodeToMove);
    
    //if node is a ContentPane
    //note: this replaces ContentPane content, does not append (couldn't get something else to work for ContentPanes)
    //node.set("content", nodeToMove.domNode);

  },

  /**
   * Resize method that extends parent by also sizing the children
   *
   * @param {Object} changeSize
   * @param {Object} resultSize
   * @see dijit.layout._LayoutWidget.resize
   */
  resize: function(changeSize,resultSize)
  {
    if (! this._started) return;
    
    this.inherited(arguments);
    
    this._frameContainer.resize();
    
    // determine the heights for header and actions nodes    
    var ltSize = dojo.contentBox(this._titleNode);
    var rtSize = dojo.contentBox(this._titleActionsNode);
    var laSize = dojo.contentBox(this._majorActionsNode);
    var raSize = dojo.contentBox(this._minorActionsNode);
    
    //console.log("total cb: " + dojo.contentBox(this._headerTitleBar.domNode).h + " cb2: " + dojo.contentBox(this._headerActionsBar.domNode).h + " titlenode: " + ltSize.h + " titleActions: " + rtSize.h + " majornode: " + laSize.h + " minornode: " + raSize.h);
    
    var tHeight = ((ltSize.h > rtSize.h) ? ltSize.h : rtSize.h);
    var aHeight = ((laSize.h > raSize.h) ? laSize.h : raSize.h);
    var hHeight = tHeight + aHeight + 20; //todo: dynamically get padding

    dojo.style(this._headerContainer.domNode, {height: hHeight + "px"});

    this.layout();
    
    // determine if we have a single child
    if (this._singleChild && this._singleChild.resize) {
        var cb = dojo.contentBox(this.containerNode);
        // note: if widget has padding this._contentBox will have l and t set,
        // but don't pass them to resize() or it will doubly-offset the child
        this._singleChild.resize({w: cb.w, h: cb.h});
    }
  },

  /**
   * Private onShow callback
   * @private
   * @see dijit._Widget._onShow
   */
   _onShow: function()
   {
      if (!this._started) return;
      this.inherited(arguments);
   }
});
