define(["dojo/_base/declare",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/Stateful",
		"dojo/Deferred",
		"dojo/promise/all",
		"dojo/when",
		"idx/app/NavModel",
		"idx/util"],
	   function (dDeclare, dLang, dArray, dStateful, dDeferred, dPromiseAll, 
				 dWhen, iNavModel, iUtil) {

	return dDeclare("idx.app.mixins._NavAppMixinNavModel", [iNavModel, dStateful], {
		/**
		 * The application with which this was constructed.
		 */
		app: null,
				
		/**
		 * The application constraint for this model.
		 */
		constraint: "",

		/** @private */
		getItemByPath: function(path) {
			var index = 0;
			var parts = null;
			var storeAncestors = null;
			var storeContext = null;
			var reversed = path.concat([]).reverse();			
			var children = this.app._nav[this.constraint].rootLookup;
			
			return this._getChild(children,
								  path,
								  reversed,
								  storeAncestors,
								  storeContext)
		},
		
		/** @private */
		_getChild: function(children, fullPath, path, storeAncestors, storeContext) {
			var decoded = this.app._decodeNavPart(path.pop());
			var partName = decoded.name;
			var storeItemID = decoded.storeItemID;
			var child = children[partName];
			var source = null;
			var promise = null;
			var itemPath = null, itemID = null, parentPath = null, parentID = null;
			var deferred = null;
			var itemID = null, itemPath = null, parentID = null, parentPath = null;
			if (!child) return null;
			if (storeItemID && !navStore) return null;
			if (navStore && (!storeItemID)) return null;
			var navStore = child.navStore;
			if (path.length == 0) {
				itemPath = fullPath.concat([]);
				itemID = this.encodePathAsIdentifier(itemPath);
				parentPath = itemPath.concat([]);
				parentPath.pop();
				parentID = this.encodePathAsIdentifier(parentPath);
			}
			if (storeItemID) {
				deferred = new dDeferred();
				source = this.app._navStores[navStore.sourceName];
				promise = source.store.get(storeItemID);
				dWhen(promise, dLang.hitch(this, function(storeItem) {
					if (!storeItem) deferred.resolve(null);
					return;
					var result = null;
					if (path.length == 0) {						
						result = {pathComponent: child, 
								  storeItem: storeItem,
								  storeAncestors: ancestors, 
								  storeContext: context, 
								  id: itemID,
								  path: itemPath,
								  parentID: parentID,
								  parentPath: parentPath};
						deferred.resolve(result);
					}
					
					storeAncestors = storeAncestors || [];
					storeAncestors.push({navStore: navStore, item: storeItem});
				
					// update the context
					storeContext = storeContext || {};
					storeContext[navStore.name] = storeItem;
					var promise = this._getChild(child.children, 
								 				 fullPath, 
												 path, 
												 storeAncestors, 
												 storeContext);
					dWhen(promise, dLang.hitch(this, function(child) {
						deferred.resolve(child);
					}));
				}));
				return deferred;
				
			} else if (path.length == 0) {
				return {pathComponent: child, 
						storeItem: null,
						storeAncestors: storeAncestors, 
						storeContext: storeContext, 
						id: itemID,
						path: itemPath,
						parentID: parentID,
						parentPath: parentPath};				
			} else {
				return this._getChild(child.children,
									  fullPath,
									  path,
									  storeAncestors,
									  storeContext);
			}
		},
		
		/** @private */
		getPath: function(item) {
			return item.path.concat([]);
		},

		/**
		 * Builds the path from the current parts and the parent path.
		 */
		_getPath: function(pathComponent, storeItem, parentPath) {
			var result = [];
			if (parentPath) {
				result = parentPath.concat([]);
			}
			var part = this.app._toEncodedNavPart(pathComponent, storeItem);
			
			result.push(part);
			
			return result;
		},
		
		/** @private */
		getParentPath: function(item) {
			return item.parentPath.concat([]);
		},
		
		/** @private */
		getIdentity: function(item) {
			return item.id;
		},
		
		/** @private */
		getParentIdentity: function(item) {
			return item.parentID;
		},
		
		/** @private */
		isSelectable: function(item) { 
			if (this.isHeading(item)) return false;
			var view = (item.pathComponent.view?item.pathComponent.view[this.app.targetPlatform]:null);
			return (view ? true : false);
		},
				
		/** @private */
		isHeading: function(item) { 
			return (this._isHeading(item.pathComponent));
		},

		/** @private */
		_isHeading: function(comp) {
			if (!comp.heading) return false;
			if (comp.view && comp.view[this.app.targetPlatform] 
				&& ((!comp.parentalMode[this.app.targetPlatform].contains)
				    || (comp.parentalMode[this.app.targetPlatform].truncates))) {
				return false;
			}
			return true;
		},
		
		/** @private */
		getLabel: function(item) { 
			var text = item.pathComponent.label;
			if (!text) return null;
			if (item.storeItem) {
				text = this.app._formatStoreText(text, item.storeItem, item.storeContext);
			} 
			
			return text;
		},

		/** @private */
		getHelpMessage: function(item) { 
			var text = item.pathComponent.help;
			if (!text) return null;
			if (item.storeItem) {
				text = this.app._formatStoreText(text, item.storeItem, item.storeContext);
			} 
			
			return text;
		},
		
		/** @private */
		getA11yIconSymbol: function(item) { 
			var text = item.pathComponent.iconSymbol;
			if (!text) return null;
			if (item.storeItem) {
				text = this.app._formatStoreText(text, item.storeItem, item.storeContext);
			} 
			
			return text;
		},
		
		/** @private */
		getIconClass: function(item) { 
			return item.pathComponent.iconClass;
		},
		
		/** @private */
		getStyleClass: function(item) { 
			return item.pathComponent.styleClass;
		},
		
		/** @private */
		hasChildren: function(item) { 
			if (!item) {
				return (this.app._nav[this.constraint].hierarchy.length > 0);
			}
			var comp = item.pathComponent;
			var modes = comp.parentalMode;
			var mode = (modes?modes[this.app.targetPlatform]:null);
			if (mode && mode.truncates) return false;
			if (comp.children.length == 0) return false;
			return true;
		},
		
		/** @private */
		getChildren: function(parent, options) { 
			var comp = null, item = null, ancestors = null, 
				children = null, parentID = null, parentPath = null;
			if (! this.hasChildren(parent)) return [];
			if (parent) {
				comp = parent.pathComponent;
				item = parent.storeItem;
				ancestors = parent.storeAncestors;
				children = comp.children;
				context = parent.storeContext;
				parentPath = parent.path;
				parentID = parent.id;
			} else {
				comp = null;
				item = null;
				parentPath = null;
				parentID = null;
				ancestors = [];
				context = {};
				children = this.app._nav[this.constraint].hierarchy;
			}
			// update the ancestors and context to pass down
			if (item) {
				// update the ancestors
				ancestors = (parent.storeAncestors?parent.storeAncestors.concat([]):[]);
				ancestors.push({navStore: comp.navStore, item: item});
				
				// update the context
				context = {};
				dLang.mixin(context, parent.storeContext);
				context[comp.navStore.name] = item;
			}
			var deferred = new dDeferred();
			var promises = [];
			dArray.forEach(children, dLang.hitch(this, function(child) {
				if (this._isHeading(child)) return;
				var itemPath = [];
				var itemID = "";
				if (child.navStore) {
					promises.push(this._getStoreItems(deferred, child, parent, ancestors, context));
				} else {
					itemPath = this._getPath(child, null, parentPath);
					itemID = this.encodePathAsIdentifier(itemPath);
					promises.push([{pathComponent: child, 
									storeItem: null, 
									storeAncestors: ancestors, 
									storeContext: context, 
									id: itemID, 
									path: itemPath,
									parentID: parentID,
									parentPath: parentPath}]);
				}
			}));
			dArray.forEach(children, dLang.hitch(this, function(child) {
				if (!this._isHeading(child)) return;
				var itemID = null;
				if (child.navStore) {
					promises.push(this._getStoreItems(deferred, child, parent, ancestors, context));
				} else {
					itemPath = this._getPath(child, null, parentPath);
					itemID = this.encodePathAsIdentifier(itemPath);
					promises.push([{pathComponent: child, 
									storeItem: null, 
									storeAncestors: ancestors, 
									storeContext: context, 
									id: itemID, 
									path: itemPath,
									parentID: parentID,
									parentPath: parentPath}]);
				}
			}));
			var allPromise = dPromiseAll(promises);
			dWhen(allPromise, dLang.hitch(this, function(allResults) {
				var index1 = 0, index2 = 0, index3 = 0;
				var results = [];
				for (index1 = 0; index1 < allResults.length; index1++) {
					for (index2 = 0; index2 < allResults[index1].length; index2++) {
						results[index3++] = allResults[index1][index2];
					}
				}
				deferred.resolve(results);
			}));
			return deferred;
		},

		/**
		 * Handle store-based navigation elements.
		 */
		_getStoreItems: function(parentDeferred, comp, parent, ancestors, context) {
			ancestors = ancestors ? ancestors : [];
			context = context ? context : {};
			var results = [];
			var navStore = comp.navStore;
			var source = this.app._navStores[navStore.sourceName];
			var index = 0;
			var parentItem = null;
			var items = null;
			var query = undefined;
			var value = null;
			var field = null;
			var options = undefined;
			var format = null, sub = null;
			var parentID = (parent?parent.id:null);
			var parentPath = (parent?parent.path:null);
			var deferred = new dDeferred();
			
			if (navStore.parentID) {
				// prepare the options
				options = this.app._resolveNavStoreValues(navStore.options,context);
				
				// we are getting children - discover how
				if (navStore.dependent) {
					// we need a parent to use -- find it
					for (index = ancestors.length-1; index >=0; index--) {
						if (ancestors[index].navStore.internalID == navStore.parentID) {
							parentItem = ancestors[index].item;
							break;
						}
					}
					
					// get the children using the "getChildren()" function
					items = source.store.getChildren(parentItem, options);
					
				} else {
					// resolve the query
					query = this.app._resolveNavStoreValues(navStore.query, context);
					
					// get the items
					items = source.store.query((query?query:null), options);
				}
			} else {
				if (navStore.filter) {
					// prepare the options and query
					options = this.app._resolveNavStoreValues(navStore.filter.options, context);
					query = this.app._resolveNavStoreValues(navStore.filter.query, context);
				}
				
				// get the items
				items = source.store.query((query?query:null), options);
			}	
						
			dWhen(items, dLang.hitch(this, function(storeItems) {
				var storeItem = null;
				var field = null;
				var index = 0;
				var itemID = null;
				var itemPath = null;
				for (index = 0; index < storeItems.length; index++) {
					storeItem = storeItems[index];
					itemPath = this._getPath(comp, storeItem, parentPath);
					itemID = this.encodePathAsIdentifier(itemPath);
					results.push({pathComponent: comp, 
								  storeItem: storeItem, 
								  storeAncestors: ancestors, 
								  storeContext: context, 
								  id: itemID, 
								  path: itemPath,
								  parentID: parentID,
								  parentPath: parentPath});
				}
				parentDeferred.progress({pathComponent: comp, items: storeItems, results: results});
				deferred.resolve(results);
			}));
			
			return deferred;
		},
		
		/** @private */
		_logSelf: function() {
			var promise = this.getChildren(null);
			var deferred = new dDeferred();
			dWhen(promise, dLang.hitch(this, function(roots) {
				var index = 0;
				var promises = [];
				for (index = 0; index < roots.length; index++) {
					promises.push(new dDeferred());
				}
				promises.push(deferred);
				
				for (index = 0; index < roots.length; index++) {
					dWhen(promises[index], dLang.hitch(this, function(myIndex) {
						var itemPromise = this._logItem(roots[myIndex], null, "");
						dWhen(itemPromise, dLang.hitch(this, function() {
							var nextIndex = myIndex+1;		
							var nextPromise = promises[nextIndex];
							nextPromise.resolve(nextIndex);
						}));
					}));
				}
				promises[0].resolve(0);
			}));
			
			return deferred;
		},
		
		/** @private */
		_logItem: function(item, parentItem, prefix) {
			var index = 0;
			var platform = "";
			var sep = "";
			var deferred = new dDeferred();
			var heading = (parentItem?this.isHeading(parentItem):true);
			var logMsg = "*" + prefix + (heading?"|":">") + this.getLabel(item) 
						+ " (" + this.getIdentity(item) + ")";
			var viewSuffix = "";
			var navPart = item.pathComponent;
			if (navPart.viewName && navPart.viewName[this.app.targetPlatform]) {
				viewSuffix = "   [ " + sep + navPart.viewName[this.app.targetPlatform] + "(" 
							+ this.app.targetPlatform +") ]";	
			}
			console.log(logMsg + viewSuffix);
			
			var promise = this.getChildren(item);
			dWhen(promise, dLang.hitch(this, function(children) {
				var index = 0;
				var promises = [];
				for (index = 0; index < children.length; index++) {
					promises.push(new dDeferred());
				}
				promises.push(deferred);
				
				for (index = 0; index < children.length; index++) {
					dWhen(promises[index], dLang.hitch(this, function(myIndex) {
						var itemPromise = this._logItem(children[myIndex], item, prefix + "  ");
						dWhen(itemPromise, dLang.hitch(this, function() {
							var nextIndex = myIndex+1;		
							var nextPromise = promises[nextIndex];
							nextPromise.resolve(nextIndex);
						}));
					}));
				}
				promises[0].resolve(0);
			}));
			return deferred;
		}
	});

});