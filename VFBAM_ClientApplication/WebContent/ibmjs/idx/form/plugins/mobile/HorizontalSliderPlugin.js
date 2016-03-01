/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/text!idx/form/mobileTemplates/HorizontalSlider.html"
], function(declare,template){
	return declare("idx.form.plugins.mobile.HorizontalSliderPlugin", [], {
		templateString: template
		
	});
});
