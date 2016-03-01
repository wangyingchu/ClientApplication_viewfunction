/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.layout.OpenMenuTabContainer");

dojo.require("idx.layout.OpenMenuTabContainer");

/**
 * @name idxx.layout.OpenMenuTabContainer
 * @class idxx.layout.OpenMenuTabContainer Moved to idx.layout.
 * @augments idx.layout.OpenMenuTabContainer
 * @see idx.layout.OpenMenuTabContainer
 * @deprecated
 */	
dojo.declare("idxx.layout.OpenMenuTabContainer", 
		[idx.layout.OpenMenuTabContainer],
		/**@lends idx.layout.OpenMenuTabContainer#*/
{	
    constructor: function(args) { 
    	console.warn("DEPRECATED: "+this.declaredClass+" is deprecated. Use idx.layout.OpenMenuTabContainer instead. -- will be removed in next version.");//tmp
    }
});
