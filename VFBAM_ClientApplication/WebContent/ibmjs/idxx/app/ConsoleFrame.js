/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
dojo.provide("idxx.app.ConsoleFrame");

dojo.require("idx.templates.ConsoleLayout");

/**
 * @name idxx.app.ConsoleFrame
 * @class Templated Widget moved to idx.layout.templates.ConsoleLayout
 * @augments idx.templates.ConsoleLayout
 * @see idx.templates.ConsoleLayout
 * @deprecated
 */
dojo.declare("idxx.app.ConsoleFrame",
		[idx.templates.ConsoleLayout],
		/**@lends idx.app.ConsoleFrame#*/
{
	
	/**
	 * Default constructor
	 */
	constructor: function(args) { 
       	console.warn("DEPRECATED: "+this.declaredClass+" is deprecated. Use idx.templates.ConsoleLayout instead. -- will be removed in next version.");//tmp
	}
});
