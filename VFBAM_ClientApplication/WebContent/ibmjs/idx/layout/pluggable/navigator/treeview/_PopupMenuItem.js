/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/PopupMenuItem",
    "./_ActionMenuItem"
], function( lang, declare, domClass, domStyle, PopupMenuItem, _ActionMenuItem ){
    var _PopupMenuItem = declare([PopupMenuItem], {
        _openPopup: function(/*Object*/ params, /*Boolean*/ focus){
            var popup = this.popup;

            var menu = this.getParent();
            if(!menu){return;}

            if(menu && menu.menuContainer){
                if(!this.popupContentMenu){
                    menu.menuContainer.addChild(this.popup);
                    domClass.add(this.popup.domNode, "popupContentMenu slideOut");
                    domStyle.set(this.popup.domNode, "display", "");

                    this.popupContentMenu = this.popup;
                    this.popupContentMenu.addChild(new _ActionMenuItem({
                        label:"< Back",
                        onClick: lang.hitch(this, function(evt){
                            domClass.remove(menu.domNode, "slideOut");
                            domClass.add(this.popupContentMenu.domNode, "slideOut");
                        })
                    }), 0);
                }
                domClass.add(menu.domNode, "slideOut");
                domClass.remove(this.popupContentMenu.domNode, "slideOut");
            }
        },

        _closePopup: function(){
            //TODO
        }
    });

    return _PopupMenuItem;
});