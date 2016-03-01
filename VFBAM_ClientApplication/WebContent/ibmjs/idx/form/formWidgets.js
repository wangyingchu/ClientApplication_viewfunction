/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define(["dojo/_base/lang","idx/main","dojo/_base/kernel"],
	   function(dLang,iMain,dKernel) {
	dKernel.deprecated("idx.form.formWidgets","idx.form.formWidgets deprecated. The idx/form/formWidgets module is no longer needed since Dojo 1.7");
	var iFormWidgets = dLang.getObject("form.formWidgets", iMain);
	
	return iFormWidgets;
});
