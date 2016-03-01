/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define(["dojo/_base/lang","idx/main","dojo/_base/kernel"],
	   function(dLang,iMain,dKernel) {
	dKernel.deprecated("idx.form.dropDownButtons","idx.form.dropDownButtons deprecated. The idx/form/dropDownButtons module is no longer needed since Dojo 1.8");
	/**
	 * @name idx.form.dropDownButtons
	 * @class Extension to dijit.form.DropDownButton to add the "idxDropDownOpen" CSS class whenever
	 *        the DropDownButton is opened.  This allows for alternate styling on the widget when it is
	 *        has its drop-down in the open state.  This is included with "idx.ext".
	 */
	var iDropDownButtons = dLang.getObject("form.dropDownButtons", true, iMain);
	
	return iDropDownButtons;
});