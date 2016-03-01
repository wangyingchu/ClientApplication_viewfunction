/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define(["dojo/_base/lang","idx/main","dojo/_base/kernel"],
	   function(dLang,iMain,dKernel) {
	dKernel.deprecated("idx.form.comboButtons","idx.form.comboButtons deprecated. The idx/form/comboButtons module is no longer needed since Dojo 1.8");
	/**
	 * @name idx.form.comboButtons
	 * @class Extension to dijit.form.ComboButton to add the "idxDropDownOpen" CSS class whenever
	 *        the ComboButton is opened to allow for alternate styling when the ComboButton is in the 
	 *        open state.  This also adds proper tab stops in ComboButtons for keyboard navigation.
	 *        This is included with "idx.ext".
	 */
	var iComboButtons = dLang.getObject("form.comboButtons", true, iMain);
	return iComboButtons;
});	
