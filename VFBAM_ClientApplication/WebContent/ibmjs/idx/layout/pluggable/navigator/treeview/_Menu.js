/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-class",
    "dijit/Menu"
],function( declare, domClass, Menu ){
    //Menu stub
    var _Menu = declare( [Menu], {
        //TODO
        postCreate: function(){
            this.inherited(arguments);

            domClass.add(this.domNode, "flipCardNavigationMenu");
        }
    });

    return _Menu;
});