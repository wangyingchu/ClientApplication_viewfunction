/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/array", // array.forEach array.indexOf array.map
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dojo/_base/json",
	"dojo/dom-class", // domClass.add domClass.contains
	"dojo/dom-style", // domStyle.set
	"dojo/i18n", // i18n.getLocalization
	"dojo/on",
	"dojo/request/xhr",
	"dojo/store/Memory",
    "dijit/layout/ContentPane",
    "./pluggable/navigator/treeview/_Menu",
	"./pluggable/navigator/_FlipCardNavBase",
    "./pluggable/navigator/treeview/MenuTreeViewMixin",
    "./pluggable/navigator/treeview/_TreeStoreModel",
	"dojo/i18n!./nls/FlipCard"
	
], function( array, declare, lang, baseJson, domClass, domStyle, i18n,  on, xhr, Memory,
		ContentPane,
        _Menu, _FlipCardNavBase, MenuTreeViewMixin, _TreeStoreModel
	){

	/**
	* @name idx.layout.FlipCardNavigator
	* @class navigation bar for different page content, each page can be an FlipCardGridContainer or a contentPane
	*/ 
	var FlipCardNavigator = declare("idx/layout/FlipCardNavigator", [_FlipCardNavBase], {
		/**@lends idx.layout.FlipCardNavigator*/ 
		// summary:
		//		navigation bar for different page content, each page can be an FlipCardGridContainer or a contentPane
		//
		//		Example:
		// |	new FlipCardNavigator({navList: navigationParams})
		//
		//		Example:
		// |	<div data-dojo-type='idx.layout.FlipCardNavigator' data-dojo-props='navList: navigationParams'></div>
		
		baseClass: "idxFlipCardNavBase idxFlipCardNavigator",
		
		// cssStateNodes: {
			// "navBar": "idxFlipCardNavBar"
		// },
		
		// labelAttr: String
		//		Get label from the model using this attribute
		labelAttr: "title",

		
		/** @ignore */
		postMixInProperties: function(){
			this.inherited(arguments);
			
			this._nlsResources = i18n.getLocalization("idx/layout", "FlipCard");
			this.navTitle = this.navTitle || this._nlsResources.FlipCardNavigatorTitle;
			this._buildNavModel();
		},
        /**
         *
         * @private
         */
		_buildNavModel: function(){
			if(lang.isObject(this.navList)){
				this.idProperty = this.navList.idProperty || this.idProperty;
				this.navList = lang.clone(this.navList.items);
			}else if(lang.isString(this.navList)){
				xhr.get(this.navList, {
					sync: true,
					data: { query: ""}
				}).then(lang.hitch(this, function(data){
					var navData = baseJson.fromJson(data);
					this.idProperty = navData.idProperty || this.idProperty;
					this.navList = navData.items;
				}), lang.hitch(this, function(error){
					console.log(error);
				}));
			}else{
				//TODO
			}
			
			//build store
			var navListDataClone = lang.clone(this.buildNavListData());
			var store = new Memory({data: navListDataClone});
			
			// Create the model
			this.navListModel = new _TreeStoreModel({
				idProperty: this.idProperty,
				labelAttr: this.labelAttr, 
				childrenAttr: this.childrenAttr,
				typeAttr: this.typeAttr,
				store: store, 
				query: this.query
			});	

		},

       	/**
		 * 
		 */
        createNavigationView: function(){
			this.inherited(arguments);

            this.menuItemToRootNavMap ={};
            var mt2Map = this.menuItemToRootNavMap,
                idProp = this.idProperty;
			
			if(this.navList){
				array.forEach(this.navList, function(item){
					var itemNode = this.createMenuItemInNavigationBar(item);
					
					if(item[this.childrenAttr]){
						var ecPane = new ContentPane({}).placeAt(this.expandoNode.containerNode);
						domClass.add(ecPane.domNode, "expandoContentPane flipCardMenuContainer");
                        domStyle.set(ecPane.domNode, {
                            "width": this.navExpanderWidth + "px",
                            "height": "100%"
                        });
						var itemMenu = new _Menu({
							menuContainer: ecPane,
							parentMenu: this.navListNodes[item.id],
							parentMenuId: item.id
						}).placeAt(ecPane.containerNode);
						var navItemDescID = this.navItemDescIDs[item[idProp]];
						if(navItemDescID){
							itemMenu.domNode.setAttribute("aria-labelledby", navItemDescID);
						}

						array.forEach(item[this.childrenAttr], function(mItem){
							this.buildNavigationMenuItem(mItem, itemMenu, ecPane);
							if(!this.initItemId){
								this.initItemId = mItem[idProp];
							}
                            mt2Map[mItem[idProp]] = item[idProp];
						}, this);
						this.expandoContentPanes[item[idProp]] = ecPane;
					}
					else{
						if(!this.initItemId){
							this.initItemId = item[idProp];
						}
					}
					
					if(!this.selectedNavItemId){
                        this.selectedNavItemId = item[idProp];
                    }
                    
					this.putIntoNavItemNodeMap( item[idProp], itemNode );
					
					// this.borderNode.startup();
				}, this);
				
			}
		},
		
		/**
         * Change the Menu Item selection style in the FlipCardNavigator
         * Need to modify the style both for first and secondary menu Item
         * @param model
         */
        changeMenuItemSelectionView: function( model ){
            if(this.selectedNavItemId){

                var currNavItemId = this.selectedNavItemId,
                    nlNodes = this.navListNodes;
                this.resetRootItemView();

                var menuItemWidget = this.getNodeToNavItem( currNavItemId );
                if ( menuItemWidget && menuItemWidget.domNode){
                    domClass.add(menuItemWidget.domNode, "navItemSelected");
                }

                if ( nlNodes[currNavItemId] ){
                    domClass.add( nlNodes[currNavItemId], "navItemSelected");
                }
                else{
                    var mtrMap = this.menuItemToRootNavMap;
                    if ( mtrMap && mtrMap[currNavItemId] ){
                        domClass.add( nlNodes[ mtrMap[currNavItemId] ], "navItemSelected");
                    }
                }

                //navigation bar
                var selectedNavItem = (model||this.navListModel)["getItem"](this.selectedNavItemId);
                if(selectedNavItem){
                    if(selectedNavItem[this.childrenAttr]){
                        domClass.toggle(this.navBar, "navExpandoSelected", this.expandoNode._showing);
                    }else{
                        domClass.remove(this.navBar, "navExpandoSelected");
                        domClass.add(this.navBar, "navSelected");
                    }
                }
            }
        },


		getMetadata: function(context){
			this.metadata = {
				id: this.idProperty,
				items: this.navList
			}
			if(context){
				return baseJson.toJson(this.metadata);
			}else{
				return this.metadata;
			}
		}
	
	});

    lang.extend( FlipCardNavigator, MenuTreeViewMixin);
    return FlipCardNavigator;
});