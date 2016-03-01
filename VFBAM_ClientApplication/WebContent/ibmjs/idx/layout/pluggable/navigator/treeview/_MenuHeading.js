/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare", // declare
    "dijit/MenuSeparator"
], function( declare, MenuSeparator ){
    var _MenuHeading = declare([MenuSeparator],
        {
            label: '',

            templateString: '<tr class="dijitReset oneuiMenuHeading" role="presentation" tabindex="-1">' +
                '<td class="dijitReset oneuiMenuHeadingLabel" colspan="4" data-dojo-attach-point="containerNode"></td>' +
                '</tr>',

            _setLabelAttr: { node: "containerNode", type: "innerHTML" },

            baseClass: "oneuiMenuHeading"
        });

    return _MenuHeading;
});