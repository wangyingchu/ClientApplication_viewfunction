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
	"dojo/dom-attr", // attr.set
	"dojo/dom-class", // domClass.add domClass.contains
	"dojo/dom-style", // domStyle.set
	"dojo/dom-construct",
	"dojo/i18n", // i18n.getLocalization
	"dojo/keys",
	"dojo/on",
	"dojo/query",
	"dojo/touch",
	"dojo/aspect",
	"dojo/request/xhr",
	"dojo/data/ItemFileReadStore",
	"dojo/data/ItemFileWriteStore",
	"dojo/store/Memory",
	"dojo/store/DataStore",
	'dojo/store/util/QueryResults',
	'dojo/store/util/SimpleQueryEngine',
	"dijit/focus",
	"dijit/layout/ContentPane",
	"gridx/allModules",
	"gridx/Grid",
	"gridx/core/model/cache/Sync",
	"gridx/core/model/cache/Async",
	"./pluggable/navigator/gridxview/FlipCardStoreModel",
	"./pluggable/navigator/gridxview/FlipCardNavModule",
	"./pluggable/navigator/gridxview/FlipCardNavTreeModule",
	"./pluggable/navigator/_FlipCardNavBase",
	"dojox/html/entities",	
	"dojo/i18n!./nls/FlipCard"
	
], function( array, declare, lang, baseJson, domAttr, domClass, domStyle, domConstruct, i18n, keys, on, query, touch, aspect, xhr, ItemFileReadStore, ItemFileWriteStore, Memory, DataStore, QueryResults, SimpleQueryEngine, 
		focus, ContentPane, 
		allModules, Grid, Sync, Async,
		FlipCardStoreModel, FlipCardNavModule, FlipCardNavTreeModule, _FlipCardNavBase, entities
	){	
	// module:
	//		idx/layout/FlipCardNavDynamic
	// summary:
	//		navigation bar for different page content, each page can be an FlipCardGridContainer or a contentPane

	/**
	* @name idx.layout.FlipCardNavDynamic
	* @class navigation bar for different page content, each page can be an FlipCardGridContainer or a contentPane

	*/ 
	
	return declare("idx/layout/FlipCardNavDynamic", [_FlipCardNavBase], {
		/**@lends idx.layout.FlipCardNavDynamic*/ 
		// summary:
		//		navigation bar for different page content, each page can be an FlipCardGridContainer or a contentPane
		//
		//		Example:
		// |	new FlipCardNavDynamic({navList: navigationParams})
		//
		//		Example:
		// |	<div data-dojo-type='idx.layout.FlipCardNavDynamic' data-dojo-props='navList: navigationParams'></div>
		
		baseClass: "idxFlipCardNavBase idxFlipCardNavDynamic",
		
		// cssStateNodes: {
			// "navBar": "idxFlipCardNavBar"
		// },
		
		// labelAttr: String
		//		Get label from the model using this attribute
		labelAttr: "title",
		
		// navStyle: String
		//		navigator's group behavior
		navStyle: "layer", //layer, tree
		
		
		// query: Object
		//		Specifies datastore query to return the root item or top items for the tree.
		//		e.g. {id: "earth"}
		query: null,
		
		// groupItemNavigable: Boolean
		//		whether the group nav item can be used for navigation
		groupItemNavigable: false,
		
		
		/** @ignore */
		postMixInProperties: function(){
			this.inherited(arguments);
			
			this._nlsResources = i18n.getLocalization("idx/layout", "FlipCard");
			this.navTitle = this.navTitle || this._nlsResources.FlipCardNavDynamicTitle;
			
			this.subGridxNavs = {};
			
			this._buildNavModel();
		},
		
		_buildNavModel: function(){
			var store = null;
			if(this.navList instanceof ItemFileReadStore || this.navList instanceof ItemFileWriteStore){
				store = new FlipCardStoreModel._DataStore({store:this.navList});
			}else if(this.navList instanceof Memory || this.navList instanceof DataStore){
				store = this.navList;
			}else{
				if(lang.isObject(this.navList)){
					this.idProperty = this.navList.idProperty || this.idProperty;
					this.navList = lang.clone(this.navList.items);
				}else if(lang.isString(this.navList)){
					xhr.get(this.navList, {
						// handleAs: "json",
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
				store = new Memory({
					idProperty: this.idProperty,
					data: this.navList
				});
			} 
			
			
			// Create the model
			this.navListModel = new FlipCardStoreModel({
				idProperty: this.idProperty,
				labelAttr: this.labelAttr, 
				childrenAttr: this.childrenAttr,
				typeAttr: this.typeAttr,
				store: store, 
				query: this.query
			});
			
			this.own(
				aspect.after(this.navListModel, "onChange", lang.hitch(this, "_onItemChange"), true),
				aspect.after(this.navListModel, "onChildrenChange", lang.hitch(this, "_onItemChildrenChange"), true),
				aspect.after(this.navListModel, "onInsert", lang.hitch(this, "_onItemInsert"), true),
				aspect.after(this.navListModel, "onUpdate", lang.hitch(this, "_onItemUpdate"), true),
				aspect.after(this.navListModel, "onDelete", lang.hitch(this, "_onItemDelete"), true),
				aspect.after(this.navListModel, "onGridUpdate", lang.hitch(this, "_onGridItemUpdate"), true)
			);
				
		},

		/** @ignore */
		postCreate: function(){
			
			this.inherited(arguments);
			//TODO
		},
		
		/** @ignore */
		startup: function(){
			
			this.inherited(arguments);
			//TODO
		},

        /**
         * cItems: Nav Items for NavList Model
         * itemLabel: 
         * itemNode: useless, to delete in future
         */
		genGridxNavigator: function(  cItems, itemLabel, itemNode, pItemId ){
			
			
            var gridNavStore = new Memory({
                data: cItems
            });
            gridNavStore.hasChildren = lang.hitch(this, function(id, item){
                return item && item[this.childrenAttr] && item[this.childrenAttr].length;
            });
            gridNavStore.getChildren = lang.hitch(this, function(item, options){
                return QueryResults(SimpleQueryEngine(options.query, options)(item[this.childrenAttr]));
            });
            var gridNavLayout = [
                {id: this.labelAttr, name: this.labelAttr, field: this.labelAttr, encode:true},
                {id: this.idProperty, name: this.idProperty, field: this.idProperty},
                {id: this.typeAttr, name: this.typeAttr, field: this.typeAttr},
                {id: this.childrenAttr, name: this.childrenAttr, field: this.childrenAttr},
                {id: this.pressHandlerAttr, name: this.pressHandlerAttr, field: this.pressHandlerAttr}
            ];
            var gridxNav = new Grid({
                cacheClass: "gridx/core/model/cache/Sync",
                store: gridNavStore,
                structure: gridNavLayout,
                // touch: true,
                // bodyRowHoverEffect: false,
                headerHidden: true,
                modules: [
                    "gridx/modules/CellWidget",
                    "gridx/modules/select/Row",
                    {
                        moduleClass: "gridx/modules/HiddenColumns",
                        init: [this.idProperty, this.typeAttr, this.childrenAttr, this.pressHandlerAttr]
                    },
                    (this.navStyle=="layer")?{
                        moduleClass: FlipCardNavModule,
                        rootNavName: itemLabel,
                        idProperty: this.idProperty
                    }:(this.navStyle=="tree")?{
                        moduleClass: FlipCardNavTreeModule,
                        rootNavName: itemLabel,
                        idProperty: this.idProperty
                    }:{
                        //TODO
                    }
                ]
            });
            
            // Feature request 14226 add left arrow evt for dynamic nav
            gridxNav.connect(gridxNav.bodyNode, 'onkeydown', lang.hitch(this, function(evt){
            	if(evt.keyCode == (this.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW)){
            		this.handleNavigationDistributeById(pItemId, evt);
            		this.navListNodes[pItemId].focus();
            	}
            }));

            gridxNav.connect(gridxNav.body, 'onCheckCustomRow', lang.hitch(this, function(row, output){
                var rowItem = row.item();
                if(rowItem[this.typeAttr] == "separator"){
                    output[row[this.idProperty]] = true;
                }
            }));
            gridxNav.connect(gridxNav.body, 'onBuildCustomRow', lang.hitch(this, function(row, output){
                var rowItem = row.item();
                output[row[this.idProperty]] = "<div class='gridxCell' colid='" + this.labelAttr + "'>" + entities.encode(rowItem[this.labelAttr]) + "</div>";
            }));


            var onNavItemSelected = function(evt){
                var cell = gridxNav.cell(evt.rowId, evt.columnId, true);
                if(evt.columnId == "__nextLevelButton__"){
                    // cell.node().blur();
                    return;
                }
                if(evt.target && domClass.contains(evt.target, "gridxTreeExpandoIcon")){
                    return;
                }
                var gridNavItem = cell.row.item();
                //disable group item nav capability
                if(this.groupItemNavigable){
                    //TODO
                }else{
                    if(gridNavItem.group == "static" || gridNavItem.children){
                        return;
                    }
                }
                /**
                 * Do Select style work in hash changed
                 */
                var navItemId = gridNavItem[this.idProperty];
                gridNavItem = gridxNav.model.byId(navItemId).item;
                gridxNav.select.row.clear();
                gridxNav.select.row.selectById(navItemId);
                this.handleNavigationDistribute(gridNavItem, evt);

                // var cellData = cell.data();
                // var isRowSelected = cell.row.isSelected();
                // var headerName = cell.column.name();
            }

            if(gridxNav.touch){
                gridxNav.connect(gridxNav, "onCellTouchStart", lang.hitch(this, onNavItemSelected));
            }
            gridxNav.connect(gridxNav, "onCellMouseDown", lang.hitch(this, onNavItemSelected));
            gridxNav.connect(gridxNav, "onCellKeyDown", lang.hitch(this, function(evt){
                if(evt.keyCode == keys.ENTER){
                    onNavItemSelected.apply(this, arguments);
                }
            }));

            //for tree navigation
            if(this.navStyle == "tree"){
                array.forEach(gridxNav.store.data, function(row){
                    var key = row[this.idProperty];
                    if(key && row["group"] && row["group"] == "static"){
                        //specific for tree plugin-in
                        if(gridxNav.tree && gridxNav.tree.expandRecursive){
                            gridxNav.tree.collapseGroupRecursive(key, 1).then(lang.hitch(this, function(){
                                gridxNav.tree.expandGroupRecursive(key, 1);
                                //gridxNav.tree._updateBody(key);
                            }));
                        }
                    }else{
                        //TODO
                    }
                }, this);
            }else{
                //TODO
            }

            return gridxNav;
        },
        
        /**
		 * special case for gridx as the navigator
		 */
		buildNavItemNodeMap: function( items, gridx, rootNavItemId ){
			var self = this, 
				traverseNode = function( item ){
					self.putIntoNavItemNodeMap( item["id"], gridx);
					self.putIntoMenuItemToRootNavMap( item["id"], rootNavItemId );
					if ( item.children && item.children.length > 0){
						for ( var iIndex = 0; iIndex < item.children.length; iIndex ++)
							traverseNode(item.children[iIndex],gridx);
					}
				};
			for ( var jIndex = 0; jIndex < items.length; jIndex ++){
				traverseNode( items[jIndex] );
			}
		},
		/**
		 * 
		 */		
		createSecondaryNavItems: function( cItems, itemId, itemLabel, itemNode ){
			var gridxNav = this.genGridxNavigator( cItems, itemLabel, itemNode, itemId );
            var navListModel = this.navListModel;
            this.buildNavItemNodeMap( cItems, gridxNav, itemId );
            var ecPane = new ContentPane({}).placeAt(this.expandoNode.containerNode);
            domClass.add(ecPane.domNode, "expandoContentPane flipCardMenuContainer");

            domStyle.set(ecPane.domNode, {
                "width": this.navExpanderWidth + "px",
                "height": "100%"
            });

            domClass.add(ecPane.domNode, "expandoContentPane flipCardMenuContainer");
            gridxNav.placeAt(ecPane.containerNode);
            gridxNav.startup();
            ecPane.placeAt(this.expandoNode.containerNode);

            //build sub model
            // gridxNav.model.when();
            navListModel.subStoresAndModels[itemId] = {store:gridxNav.store, model:gridxNav.model, parentId:itemId};
            //build sub nav nodes
            this.subGridxNavs[itemId] = {container: ecPane, nav:gridxNav};
            
            if ( cItems.length > 0 ){
            	var cItemId = navListModel.getIdentity(cItems[0]);
    			if( !this.initItemId ){
    				this.initItemId = cItemId;
    			}
            }
			
			
			this.expandoContentPanes[itemId] = ecPane;
		},
		/**
		 * 
		 */
		createRootNavItem: function( item, refNode ){
			//
			// items are the root navigator on the sidebar
			//
			var navListModel = this.navListModel,
				itemId = navListModel.getIdentity(item),
				itemLabel = navListModel.getLabel(item),
				itemNode = this.createMenuItemInNavigationBar(item, refNode);
			
			this.putIntoNavItemNodeMap( itemId, itemNode );
			if( navListModel.hasChildren(item) ){
				navListModel.getChildren(item, lang.hitch(this, function(cItems){
					//
					// cItems are the secondary navigator menu item in each gridx navigator
					// when the cItems.length is 0, create an empty secondary navigation container
					// 
					this.createSecondaryNavItems( cItems, itemId, itemLabel, itemNode );
				}));
			}
			else{
				if(!this.initItemId){
					this.initItemId = itemId;
				}
			}
			
			if(!this.selectedNavItemId){
                this.selectedNavItemId = itemId;
            }
			
		},
		/**
		 * 
		 */
        createNavigationView: function(){
			this.inherited(arguments);
			this.menuItemToRootNavMap ={};
            var mtrMap = this.menuItemToRootNavMap,
                idProp = this.idProperty;
 
			this.navListModel.getRootChildren(lang.hitch(this, function(items){
				array.forEach(items, function(item){
					this.createRootNavItem(item); 
				}, this);
			}));
		},
		
		/**
		 * 
         * root menu item: menu item on the first level of navigator on sidebar
         * secondary menu item: flipCardNavigationMenuItem in the hirachical gridx or tree navigator
         *
         * @param model
         */
        changeMenuItemSelectionView: function(model){
			if(this.selectedNavItemId){
				
                var nlNodes = this.navListNodes,
                	currNavItemId = this.selectedNavItemId;
                this.resetRootItemView();
		    	
		    	if ( nlNodes[currNavItemId] ){
                	domClass.add( nlNodes[ currNavItemId ], "navItemSelected");
                }
		    	else{
		    		var mtrMap = this.menuItemToRootNavMap;
		    		if ( mtrMap && mtrMap[currNavItemId] ){
		    			domClass.add( nlNodes[ mtrMap[currNavItemId] ], "navItemSelected");
		    		}
		    	}

				//
				// Clear all the sub gridx navigator selected
				//
				var subNavMap = this.subGridxNavs, gridx = null;
				for ( var key in subNavMap ){
					gridx = subNavMap[key].nav;
					gridx.select.row.clear();
				}

				gridx = this.getNodeToNavItem( currNavItemId );
				if ( gridx && gridx.select){

					gridx.select.row.selectById( currNavItemId );
				}
			}
			
			
		},

		
		_onItemChange: function(/*Item*/ item){
			// summary:
			//		Processes notification of a change to an item's scalar values like label
			var itemId = this.navListModel.getIdentity(item);
			if(!itemId){return;}
			
			// var model = this.model,
				// identity = model.getIdentity(item),
				// nodes = this._itemNodesMap[identity];
			// if(nodes){
				// var label = this.getLabel(item),
					// tooltip = this.getTooltip(item);
				// array.forEach(nodes, function(node){
					// node.set({
						// item: item, // theoretically could be new JS Object representing same item
						// label: label,
						// tooltip: tooltip
					// });
					// node._updateItemClasses(item);
				// });
			// }
		},
		
		_onItemChildrenChange: function(/*dojo/data/Item*/ parent, /*dojo/data/Item[]*/ newChildrenList){
			// summary:
			//		Processes notification of a change to an item's children

			console.log(parent);
			console.log(newChildrenList);
			
			
			// var model = this.model,
				// identity = model.getIdentity(parent),
				// parentNodes = this._itemNodesMap[identity];
			// if(parentNodes){
				// array.forEach(parentNodes, function(parentNode){
					// parentNode.setChildItems(newChildrenList);
				// });
			// }
		},
        /**
         *
         * @param item
         * @param args
         * @private
         */
		_onGridItemUpdate: function(/*Item*/ item, /*dojo/data/Item[]*/ args){
			if(args.type){
				if(args.type == "insert"){ // insert root item with children grid
					if(args.rootNavItem){
                        //
                        // Refresh the Sub Gridx Nav bar content after insert
                        //
						//TODO add more UI process
                        var navListModel = this.navListModel, rootNavItem = args.rootNavItem, subGridxNavs = this.subGridxNavs ;
						var rId = navListModel.getIdentity(rootNavItem),
                            subModel = navListModel.subStoresAndModels[rId],
                            gridxStub = subGridxNavs[rId];
						gridxStub.nav.body.refresh();
						this.buildNavItemNodeMap(item, gridxStub.nav, args.rootNavItem["id"]);
					}
				}else if(args.type == "delete"){ // delete root item with children grid
					var rId = this.navListModel.getIdentity(args.rootNavItem);
					var gridxStub = this.subGridxNavs[rId];
					if(gridxStub.container && gridxStub.container.destroyRecursive){
						gridxStub.container.destroyRecursive();
					}
					delete this.subGridxNavs[rId];
				}else if(args.type == "insertItem"){
					if(args.rootNavItem){
						var navListModel = this.navListModel,
                            rId = navListModel.getIdentity(args.rootNavItem),
                            gridxStub = this.subGridxNavs[rId],
                            parentItem = args.parentItem;

                        //Fix defect 13360
                        //if parent item opened
                        //increase the count of opened items
                        if(args.parentItem && args.parentItem.id){
                        	var parentId=args.parentItem.id;
							if(gridxStub.nav.view._openInfo[parentId])
						 		gridxStub.nav.view._openInfo[parentId].count++;
						}

                        //
                        // Expand the static menu item after insertItem
                        // Fix me, used static attribute group and id for simplicity
                        //
                        if ( parentItem && parentItem["group"] == "static"){
                            gridxStub.nav.tree.collapse(parentItem["id"]);
                            gridxStub.nav.tree.expand(parentItem["id"]);
                        }
						//force to refresh
                        gridxStub.nav.body.refresh();
                        this.buildNavItemNodeMap([item], gridxStub.nav, args.rootNavItem["id"]);						
					}
				}else if(args.type == "deleteItem"){
					if(args.rootNavItem){
						var rId = this.navListModel.getIdentity(args.rootNavItem);
						var gridxStub = this.subGridxNavs[rId];

						//Fix defect 13360
						if(args.parentItem && args.parentItem.id){
							var parentId=args.parentItem.id;
							if(gridxStub.nav.view._openInfo[parentId])
								gridxStub.nav.view._openInfo[parentId].count--;
						}

						gridxStub.nav.body.refresh();
					}
				}else if(args.type == "updateItem"){
					if(args.rootNavItem){
						var rId = this.navListModel.getIdentity(args.rootNavItem);
						var gridxStub = this.subGridxNavs[rId];
						gridxStub.nav.body.refresh();
					}
				}
			}
			
			console.log(item.id);
		},
		
		_onItemInsert: function(/*Item*/ item, /*dojo/data/Item[]*/ refItem){
			// summary:
			//		Processes notification of a change to an item's children
			var itemId = this.navListModel.getIdentity(item);
			if(!itemId){return;}
			var targetNode = this.navListNodes[itemId], refNode;
			
			if(refItem){
				var refItemId = this.navListModel.getIdentity(refItem);
				refNode = this.navListNodes[refItemId];
			}
			this.createRootNavItem( item, refNode );

		},
		
		_onItemUpdate: function(/*Item*/ item){
			// summary:
			//		Processes notification of a change to an item's children
			var itemId = this.navListModel.getIdentity(item);
			if(!itemId){return;}
			item = this.navListModel.getItem(itemId);
			if(!item){return;}
			
			var targetNode = this.navListNodes[itemId];
			
			if(targetNode){
				//for icon node
				if(item.iconClass || item.icon){
					var tNode = query(".navItemIcon", targetNode)[0];
					
					if(item.iconClass){
						domClass.remove(tNode);
						domClass.add(tNode, "navItemIcon " + item.iconClass);
					}
					if(item.icon){
						domAttr.set(tNode, "src", item.icon || this._blankGif);
					}
					if(item[this.labelAttr]){
						domAttr.set(tNode, "title", item[this.labelAttr]);
					}
				}
				//for desc node
				if(item.descClass || item[this.labelAttr]){
					var tNode = query(".navItemDesc", targetNode)[0];
					
					if(item.descClass){
						domClass.remove(tNode);
						domClass.add(tNode, "navItemDesc " + item.descClass);
					}
					if(item[this.labelAttr]){
						domAttr.set(tNode, "innerHTML", item[this.labelAttr]);
					}
				}
			}
		},
		
		_onItemDelete: function(/*id*/ itemId, refItem){
			// summary:
			//		Processes notification of a deletion of an item.
			//		Not called from new dojo.store interface but there's cleanup code in setChildItems() instead.

			console.log(itemId);
			
			if(!itemId){return;}
			var targetNode = this.navListNodes[itemId];
			
			if(targetNode){
				//for icon node
				domConstruct.destroy(targetNode);
			}else{
				//TODO
			}
			// var model = this.model,
				// identity = model.getIdentity(item),
				// nodes = this._itemNodesMap[identity];
			// if(nodes){
				// array.forEach(nodes, function(node){
					// // Remove node from set of selected nodes (if it's selected)
					// this.dndController.removeTreeNode(node);
					// var parent = node.getParent();
					// if(parent){
						// // if node has not already been orphaned from a _onSetItem(parent, "children", ..) call...
						// parent.removeChild(node);
					// }
					// node.destroyRecursive();
				// }, this);
				// delete this._itemNodesMap[identity];
			// }
		},
		
		
		destroy: function(){
			//TODO
			
			this.inherited(arguments);
		},
		
		getMetadata: function(context){
			this.metadata = {
				id: this.idProperty,
				items: []
			}
			
			//assume sync currently
			this.navListModel.getRootChildren(lang.hitch(this, function(items){
				this.metadata = {
					id: this.idProperty,
					items: items
				}
			}), lang.hitch(this, function(error){
				console.log(error);
			}), true);
			
			if(context){
				return baseJson.toJson(this.metadata);
			}else{
				return this.metadata;
			}
		}
	
	});
});