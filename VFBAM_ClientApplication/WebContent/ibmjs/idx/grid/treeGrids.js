/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define(["dojo/_base/lang",
        "idx/main",
        "dojo/_base/kernel"], 
        function(dLang,iMain,dKernel) {
	dKernel.deprecated("idx.grid.treeGrids","idx.grid.treeGrids deprecated. The idx/grid/treeGrids module is no longer supported since dojox/grid/TreeGrid was removed from IBM Dojo Toolkit v1.10");
	/**
	 * @name idx.grid.treeGrids
	 * @class Extension to dojox.grid.TreeGrid to add a "setOpen" function to programmatically expand
	 *        or collapse a tree node for a given row index path.
	 */
	var iTreeGrids = dLang.getObject("grid.treeGrids", true, iMain);	
	return iTreeGrids;
});