/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-class",
    "dojo/query",
    "dojo/on",
    "dojo/touch",
    "dojo/keys",
    "dijit/focus",
    "./_Menu",
    "./_MenuItem",
    "./_MenuHeading",
    "./_MenuExpander",
    "./_PopupMenuItem",
    "dojox/html/entities"
], function( lang, array, domClass, query, on, touch, keys, focus,
		_Menu, _MenuItem, _MenuHeading, _MenuExpander, _PopupMenuItem, entities ){
    return {
        /**
         *
         */
        menuItemToRootNavMap: {},

        /**
         *
         */
        menuItemToTreeItemNodeMap: {},
        /**
         *
         * @param menuItem
         * @param menu
         * @param menuContainer
         */
        createMenuItem: function(menuItem, menu, menuContainer){
            var detailMenuItem = new _MenuItem({label: entities.encode(menuItem[this.labelAttr])});
            menu.addChild(detailMenuItem);
            var menuItemSelected = function( evt ){
                this.handleNavigationDistributeById(menuItem[this.idProperty], evt);
                //
                // Record Selected State for the menu
                //
                query(".flipCardNavigationMenuItem", menu.domNode).forEach(function( node ){
                    domClass.remove(node, "navItemSelected");
                });

                domClass.add(detailMenuItem.domNode, "navItemSelected");
            };

            this.own(on(detailMenuItem, touch.press, lang.hitch(this, function(evt){
                menuItemSelected.call(this, evt);
            })));
            //a11y
            this.own(on(detailMenuItem, "keydown", lang.hitch(this, function(evt){
                if(evt.keyCode == keys.ENTER){
                    menuItemSelected.call(this, evt);
                }
                if(evt.keyCode == (this.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW) && menu.parentMenu){
                    this.handleNavigationDistributeById(menu.parentMenuId, evt);
                    focus.focus(menu.parentMenu);
                }
            })));
            this.putIntoNavItemNodeMap( menuItem[this.idProperty], detailMenuItem.domNode );
        },
        /**
         *
         * @param menuItem
         * @param menu
         * @param menuContainer
         */
        buildNavigationMenuItem: function(menuItem, menu, menuContainer){
            if(menuItem[this.typeAttr] == "nav" || menuItem[this.typeAttr] == "settings"){
                if(menuItem[this.childrenAttr] && menuItem[this.childrenAttr].length > 0){
                    var itemSubMenu = new _Menu({parentMenu:menu, menuContainer: menuContainer});
                    array.forEach(menuItem[this.childrenAttr], function(subMenuItem){
                        this.buildNavigationMenuItem(subMenuItem, itemSubMenu, menuContainer);
                    }, this);

                    var popupMenuItem = new _PopupMenuItem({label:entities.encode(menuItem[this.labelAttr]), popup:itemSubMenu})
                    menu.addChild(popupMenuItem);
                    this.putIntoNavItemNodeMap(menuItem[this.idProperty], popupMenuItem);

                }else if(menuItem.expandRef){
                    var detailMenuExpander = new _MenuExpander({label: entities.encode(menuItem[this.labelAttr])});
                    menu.addChild(detailMenuExpander);
                    if(menuItem.handleNav){
                        this.own(on(detailMenuExpander.iconNode.parentNode, touch.press, lang.hitch(this, function(evt){
                            event.stop(evt);
                            this.toggleExpanderMenuItems(menuItem, detailMenuExpander);
                        })));
                        //a11y
                        this.own(on(detailMenuExpander.iconNode.parentNode, "keydown", lang.hitch(this, function(evt){
                            if(evt.keyCode == keys.ENTER){
                                event.stop(evt);
                                this.toggleExpanderMenuItems(menuItem, detailMenuExpander);
                            }
                        })));

                        this.own(on(detailMenuExpander, touch.press, lang.hitch(this, function(evt){
                            this.handleNavigationDistributeById(menuItem[this.idProperty], evt);
                        })));
                        //a11y
                        this.own(on(detailMenuExpander, "keydown", lang.hitch(this, function(evt){
                            if(evt.keyCode == keys.ENTER){
                                this.handleNavigationDistributeById(menuItem[this.idProperty], evt);
                            }
                        })));
                    }else{
                        this.own(on(detailMenuExpander, touch.press, lang.hitch(this, function(evt){
                            this.toggleExpanderMenuItems(menuItem, detailMenuExpander);
                        })));
                        //a11y
                        this.own(on(detailMenuExpander, "keydown", lang.hitch(this, function(evt){
                            if(evt.keyCode == keys.ENTER){
                                this.toggleExpanderMenuItems(menuItem, detailMenuExpander);
                            }
                        })));
                    }
                    this.putIntoNavItemNodeMap( menuItem[this.idProperty], detailMenuExpander );

                }else{
                    //
                    // Create Menu Item for the Navagator Bar
                    //
                    this.createMenuItem(menuItem, menu, menuContainer);

                }
            }else if(menuItem[this.typeAttr] == "separator"){
                var menuHeading = new _MenuHeading({label: entities.encode(menuItem[this.labelAttr])});
                menu.addChild(menuHeading);
                this.putIntoNavItemNodeMap( menuItem[this.idProperty], menuHeading);
            }
        },

        /**
         *
         * @param menuItem
         * @param widget
         * @param forceHide
         */
        toggleExpanderMenuItems: function(menuItem, widget, forceHide){
            if(forceHide !== undefined){
                widget.refExpanderMenuItemsHided = forceHide ? true : false;
            }else{
                widget.refExpanderMenuItemsHided = !widget.refExpanderMenuItemsHided;
            }

            //toggle menu item
            domClass.toggle(widget.iconNode, "dijitTreeExpandoClosed", widget.refExpanderMenuItemsHided);
            domClass.toggle(widget.iconNode, "dijitTreeExpandoOpened", !widget.refExpanderMenuItemsHided);

            //toggle expandRefs
            if(menuItem.expandRef && menuItem.expandRef.length > 0){
                array.forEach(menuItem.expandRef, function(itemId){
                    var targetNode = this.getNodeToNavItem( itemId );
                    if(targetNode){
                        domClass.toggle(targetNode, "menuItemHidden", widget.refExpanderMenuItemsHided);
                    }
                }, this);
            }
        }
    }
});