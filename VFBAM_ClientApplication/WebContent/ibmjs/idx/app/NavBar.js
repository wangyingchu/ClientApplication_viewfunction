define(["dojo/_base/declare",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/on",
		"dojo/aspect",
		"dojo/Deferred",
		"dojo/when",
		"dojo/dom-construct",
		"dojo/dom-geometry",
		"dijit/_WidgetBase",
		"dijit/_TemplatedMixin",
		"dijit/popup",
		"dijit/TooltipDialog",
		"idx/widget/NavTree",
		"idx/widget/NavTreeObjectModel",
		"idx/util",
		"dojo/text!./templates/NavBar.html",
		"dojo/text!./templates/_NavBarItem.html"],
	function(dDeclare, dLang, dArray, dOn, dAspect, dDeferred, dWhen, dDomConstruct, dDomGeo,
			 dWidgetBase, dTemplatedMixin, dPopup, dTooltipDialog,
			 iNavTree, iNavTreeObjectModel, iUtil, templateText, itemTemplateText) {	
		/**
		 * Internal widget used to represent the navigation bar item.
		 */
		var NavBarItem = dDeclare("idx.app._NavBarItem",[dWidgetBase,dTemplatedMixin], {
			/**
			 * The base class for the item.
			 */
			baseClass: "idxNavBarItem",
			
			/**
			 * The template string for the item.
			 */
			templateString: itemTemplateText,
			
			/**
			 * The item ID for the item.
			 */
			itemID: "",
			
			/**
			 * The label text for the item.
			 */
			label: "",
			
			/**
			 * Setter is implemented to update the DOM.
			 */
			_setLabelAttr: function(value) {
				this.label = value;
				this.labelNode.innerHTML = this.label;
			},
			
			/**
			 * The help text for the item.
			 */
			help: "",
			
			/**
			 * Setter is implemented to update the DOM.
			 */
			_setHelpAttr: function(value) {
				this.help = value;
				if (this.helpNode) this.helpNode.innerHTML = this.help;
			},
			
			/** 
			 * The icon class for the item.
			 */
			iconClass: "",
			
			/**
			 * Setter is implemented to update the DOM.
			 */
			_setIconClassAttr: function(value) {
				var oldIconClass = this.iconClass;
				this.iconClass = value;
				if (this.iconNode && oldIconClass != this.iconClass) {
					dDomClass.remove(this.iconNode, oldIconClass);
					dDomClass.add(this.iconNode, this.iconClass);
				}
			},
			
			/** 
			 * The A11y icon symbol for the item (for high-contrast mode).
			 */
			a11yIconSymbol: "",
			
			/**
			 * Setter is implemented to update the DOM.
			 */
			_setA11yIconSymbolAttr: function(value) {
				this.a11yIconSymbol = value;
				if (this.iconSymbolNode) this.iconSymbolNode.innerHTML = this.a11yIconSymbol;
			}	
		});
		
		return dDeclare("idx.app.NavBar",[dWidgetBase,dTemplatedMixin], {
			/**
			 * The base class for the sidebar.
			 */
			baseClass: "idxNavBar",
			
			/**
			 * The template for the navigation bar.
			 */
			templateString: templateText,
				
			/**
			 * The primary NavModel to use with this instance.
			 */
			primaryModel: null,
			
			/**
			 * The optional NavModel to use for the help menu.
			 */
			helpModel: null,

			/**
			 * The optional NavModel to use for the settings menu.
			 */
			settingsModel: null,

			/**
			 * The optional NavModel to use for the sharing menu.
			 */
			sharingModel: null,

			/**
			 * The optional NavModel to use for the user menu.
			 */
			userModel: null,
			
			/**
			 * Options to pass to the model for retrieving the root items.
			 */
			rootOptions: null,
			
			/**
			 * Options to pass to the model whenever retrieving items (children or root).
			 */
			defaultOptions: null,
			
			/**
			 * The type to use for the NavBarItem.
			 */
			navBarItemType: NavBarItem,
			
			/**
			 * Constructor.
			 */
			constructor: function(params, refNode) {
				this._defaultIconIndex = 0;
				this._navItems = [];
				this._navItemLookup = {};
			},
		
			/**
			 * Post-mixin properties lifecycle method.
			 */
			postMixInProperties: function() {
				this.inherited(arguments);
			},
			
			/**
			 * Startup lifecycle method.
			 */
			startup: function() {
				this.inherited(arguments);
				if (this.primaryModel) this._renderRootItems();
			},
				
			/**
			 *
			 */
			_setPrimaryModelAttr: function(model) {
				if (! this._started) {
					this.primaryModel = model;
					return;
				}
				if (this.primaryModel) this._destroyRootItems();
				this.primaryModel = model;
				if (this.primaryModel) this._renderRootItems();
			},
			
			/**
			 *
			 */
			_renderRootItems: function() {
				if (! this._started) return;
				var options = null;
				var deferred = new dDeferred();
				if (this.rootOptions || this.defaultOptions) {
					options = {};
					dLang.mixin(options, this.defaultOptions);
					dLang.mixin(options, this.rootOptions);
				}
				var promise = this.primaryModel.getChildren(null, options);
				dWhen(promise, dLang.hitch(this, function(items) {
					dArray.forEach(items, dLang.hitch(this, function(item) {
						this._addRootItem(item);
					}));
					deferred.resolve(true);
				}));
				
				return deferred;
			},
			
			/**
			 * Adds a root item to the navigation bar.
			 * @private
			 */
			_addRootItem: function(item) {
				if (! this._started) return;
				var itemID 		= this.primaryModel.getIdentity(item);
				var iconClass 	= this.primaryModel.getIconClass(item);
				var styleClass 	= this.primaryModel.getStyleClass(item);
				var label		= this.primaryModel.getLabel(item);
				var help 		= this.primaryModel.getHelpMessage(item);
				var iconSymbol 	= this.primaryModel.getA11yIconSymbol(item);
				
				// check if it already exists
				if (this._navItemLookup[itemID]) {
					throw "Item by the specified ID already exists: " + itemID;
				}
								
				var navItem = {itemID: itemID, parentID: null, label: label,
							   help: help, iconClass: iconClass, modelItem: item,
							   a11yIconSymbol: iconSymbol, styleClass: styleClass};
				
				this._navItemLookup[itemID] = navItem;
				
				this._navItems.push(navItem);
				navItem.widget = new this.navBarItemType(navItem);	
				navItem.widget.placeAt(this._navNode, "last");
				
				navItem.widget.own(dOn(navItem.widget.domNode, "click", dLang.hitch(this, function(e) {
					this._onRootIconClick(navItem, e);
				})));
			},
			
			/**
			 *
			 */
			_destroyRootItems: function(item) {
				if (! this._started) return;
				if (this._navItems) {
					dArray.forEach(this._navItems, dLang.hitch(this, function(navItem) {
						navItem.widget.destroy();
						delete navItem.widget;
					}));
					delete this._navItems;
				}
				if (this._navItemLookup) delete this._navItemLookup;
				this._navItemLookup = {};
				this._navItems = [];
			},
			
			/**
			 *
			 */
			onSelection: function(navModel, modelItem, evt) {
			
			},
			
			/**
			 *
			 */
			_onRootIconClick: function(navItem, e) {
				var modelItem = navItem.modelItem;
				var height = null;
				if (this.primaryModel.hasChildren(modelItem)) {
					if (!navItem.tooltipDialog) {						
						height = "" + dDomGeo.getMarginBox(this.domNode).h + "px";
						navItem.tooltipDialog = new dTooltipDialog({
							onMouseLeave: function() {
								dPopup.close(navItem.tooltipDialog);
							}
						});
						var div = dDomConstruct.create("div", {style: "width: 200px; height: " + height + ";"},
													   navItem.tooltipDialog.containerNode);
						var store = this.primaryModel.getStoreView(modelItem);
						var navModel = new iNavTreeObjectModel({rootId: this.primaryModel.getIdentity(modelItem),
														       store: store, 
															   query: {},
															   labelAttr: "label", 
															   selectableAttr: "isSelectable",
															   branchingAttr: store.idProperty,
															   brancingAttrMode: "always"
															  });
															  
						var navTree = new iNavTree({showIcons: false, model: navModel});
						navTree.placeAt(div);
						navTree.startup();
						dAspect.after(navTree, "onSelectionChanged", dLang.hitch(this, function(items,nodes,tree,evt) {
							this.onSelection(this.primaryModel, store.getBackingItem(items[0]),evt);
						}), true);
					}
					if (this._openPopup) {
						dPopup.close(this._openPopup);
						this._openPopup = null;
					}
					dPopup.open({
						parent: this,
						popup: navItem.tooltipDialog,
						around: navItem.widget.domNode,
						orient: ["after"]
					});
					this._openPopup = navItem.tooltipDialog;
				} else {
					this.onSelection(this.primaryModel,modelItem, e);
				}
			}
			
		});
		
		
	}
);