/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-class",
    "./_MenuItem"
], function( declare, domClass,  _MenuItem ){

    var _MenuExpander = declare([_MenuItem],
        {
            iconClass:"dijitTreeExpando dijitTreeExpandoOpened", //dijitTreeExpandoClosed
            label: '',

            postCreate: function(){
                this.inherited(arguments);

                domClass.add(this.domNode, "fcNavExpanderMenuItem");
            }
        });
    return _MenuExpander;
});