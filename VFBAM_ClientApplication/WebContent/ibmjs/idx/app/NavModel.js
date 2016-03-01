define(["dojo/_base/declare",
		"dojo/Stateful",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/Deferred",
		"dojo/when",
		"dojo/store/util/QueryResults",
		"dojo/store/util/SimpleQueryEngine",
		"idx/string",
		"idx/util"],
function(dDeclare, dStateful, dLang, dArray, dDeferred, dWhen, dQueryResults, dSimpleQueryEngine,
		 iString, iUtil) {
	/**
	 * A simple type used to represent a store-item view of a navigation item.
	 * 
	 */
	var StoreItem = dDeclare("idx.app._NavModelStoreItem", [dStateful], {
		id: null,
		parentID: null,
		label: null,
		helpMessage: null,
		iconClasses: null,
		styleClasses: null,
		a11yIconSymbol: null,
		isHeading: false,
		isSelectable: true,
		_modelItem: null, 
		_store: null,
		
		constructor: function(modelItem, store) {
			this._modelItem 	= modelItem;
			this._store 		= store;
			this.id				= this._store.model.getIdentity(modelItem);
			this.parentID		= this._store.model.getParentIdentity(modelItem);
			this.label 			= this._store.model.getLabel(modelItem);
			this.helpMessage 	= this._store.model.getHelpMessage(modelItem),
			this.iconClass 		= this._store.model.getIconClass(modelItem),
			this.styleClass 	= this._store.model.getStyleClass(modelItem),
			this.a11yIconSymbol = this._store.model.getA11yIconSymbol(modelItem),
			this.isHeading 		= this._store.model.isHeading(modelItem),
			this.isSelectable 	= this._store.model.isSelectable(modelItem)
		},
		
		refresh: function() {
			var label 			= this._store.model.getLabel(this._modelItem);
			var helpMessage 	= this._store.model.getHelpMessage(this._modelItem);
			var iconClass   	= this._store.model.getIconClass(this._modelItem);
			var styleClass  	= this._store.model.getStyleClass(this._modelItem);
			var a11yIconSymbol  = this._store.model.getA11yIconSymbol(this._modelItem);
			var isHeading 		= this._store.model.isHeading(this._modelItem);
			var isSelectable 	= this._store.model.isSelectable(this._modelItem);
			
			// set any modified attributes so anybody using "watch" will receive updates
			if (label != this.label) 					this.set("label", label);
			if (helpMessage != this.helpMessage) 		this.set("helpMessage", helpMessage);
			if (iconClass != this.iconClass) 			this.set("iconClass", iconClass);
			if (styleClass != this.styleClass) 			this.set("styleClass", styleClass);
			if (a11yIconSymbol != this.a11yIconSymbol) 	this.set("a11yIconSymbol", a11yIconSymbol);
			if (isHeading != this.isHeading) 			this.set("isHeading", isHeading);
			if (isSelectable != this.isSelectable) 		this.set("isSelectable", isSelectable);
		
		}
	});
	
	/**
	 * A wrapper view that behaves like a store but is backed by a NavModel.
	 */
	var ModelStore = dDeclare("idx.app._NavModelStore", null, {
		root: null,
		options: null,
		model: null,
		idProperty: "id",
		parentIDProperty: "parentID",
		
		queryEngine: dSimpleQueryEngine,
		constructor: function(args){
			dLang.mixin(this, args);
			this._cache = {};
			this._rootID = (this.root?this.model.getIdentity(this.root):null);
		},
		_wrapItem: function(modelItem) {
			var storeItem = this._cache[modelItem.id];
			if (!storeItem) {
				storeItem = new this.model.storeItemType(modelItem, this);
				this._cache[modelItem.id] = storeItem;
			} else {
				storeItem.refresh();
			}
			return storeItem;
		},
		
		get: function(id){
			var promise = this.model.getItem(id);
			var deferred = new dDeferred();
			dWhen(promise, dLang.hitch(this, function(modelItem) {
				deferred.resolve(this._wrapItem(modelItem));
			}));
			return deferred;
		},
		
		getIdentity: function(object){
			if ((! object._modelItem)||(!object._store)||(this !== object._store)) {
				throw ("Attempt to getIdentity() on store item that did not come from this store: " + object.id);
			}
			return this.model.getIdentity(object._modelItem);
		},
		getBackingItem: function(object) {
			if ((! object._modelItem)||(!object._store)||(this !== object._store)) {
				throw ("Attempt to getIdentity() on store item that did not come from this store: " + object.id);
			}
			return object._modelItem;
		},
		put: function(object, options){
			throw "Unsupported operation: put(object,options)";
		},
		add: function(object, options){
			throw "Unsupported operation: add(object,options)";
		},
		remove: function(id){
			throw "Unsupported operation: remove(object,options)";
		},
		query: function(query, options) {
			var parent = this.root;			
			
			// setup the options by merging if needed
			var opts = ((parent===this.root)?(this.options || options):options);
			if (query || (options && (parent===this.root) && this.options)) {
				opts = {};
				// mixin the default root options if root
				if (parent === this.root) dLang.mixin(opts, this.options);
				
				// mixin the specified options
				dLang.mixin(opts, options);
				
				// add the filter
				if (query) opts.filter = query;
			}
			
			// get the children using the options
			var promise = this.model.getChildren(parent, opts);
			var deferred = new dDeferred();
			
			// wrap the model items in store items
			dWhen(promise, dLang.hitch(this, function(children) {
				var storeItems = [];
				dArray.forEach(children, dLang.hitch(this, function(child) {
					storeItems.push(this._wrapItem(child));
				}));
				deferred.resolve(storeItems);				
			}));
			
			// return the query results
			return dQueryResults(deferred);
		},
		
		getChildren: function(parent, options) {
			// check if a parent is provided
			if (parent) {
				// verify the parent
				if ((! parent._modelItem)||(!parent._store)||(this !== parent._store)) {
					throw ("Attempt to call getChildren() on store item that did not come from this store: " + object.id);
				}
			}
			// set the parent to the model item or root model item
			parent = (parent ? parent._modelItem : this.root);
			
			// setup the options by merging if needed
			var opts = ((parent===this.root)?(this.options || options):options);
			if (options && (parent===this.root) && this.options) {
				opts = {};
				// mixin the default root options if root
				if (parent === this.root) dLang.mixin(opts, this.options);
				
				// mixin the specified options
				dLang.mixin(opts, options);
			}
			
			// get the children using the options
			var promise = this.model.getChildren(parent, opts);
			var deferred = new dDeferred();
			
			// wrap the model items in store items
			dWhen(promise, dLang.hitch(this, function(children) {
				var storeItems = [];
				dArray.forEach(children, dLang.hitch(this, function(child) {
					storeItems.push(this._wrapItem(child));
				}));
				deferred.resolve(storeItems);				
			}));
			
			// return the query results
			var query = ((parent===this.root)&&opts&&opts.filter) ? opts.filter: null;
			return dQueryResults(deferred);
		},
		
		hasChildren: function(parent) {
			if ((! parent._modelItem)||(!parent._store)||(this !== parent._store)) {
				throw ("Attempt to call hasChildren() on store item that did not come from this store: " + object.id);
			}
			return this.model.hasChildren(parent._modelItem);
		},

		log: function() {
			var promise = this.query();
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
			var heading = (parentItem?parentItem.get("isHeading"):true);
			var logMsg = "*" + prefix + (heading?"|":">") + item.get("label") 
						+ " (" + this.getIdentity(item) + ")";
			var selectableSuffix = "";
			if (item.get("isSelectable")) {
				selectableSuffix = "   [ selectable ]";
			}
			console.log(logMsg + selectableSuffix);
			
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
	
	/**
	 * Provides a model.
	 */
	return dDeclare("idx.app.NavModel",[], {	
		/**
		 * The type to use for the store item.
		 */
		storeItemType: StoreItem,
		
		/**
		 * The type to use for the store view.
		 */
		storeViewType: ModelStore,
		
		/**
		 * Constructor.
		 */
		constructor: function(args) {
			dLang.mixin(this, args);
		},
		
		/**
		 * Returns the item associated with the specified ID.
		 * @param {String} id The identifier.
		 * @return {Object} The navigation item identified by the specified ID.
		 */
		getItemByID: function(id) { 
			return this.getItemByPath(this.parseIdentifierAsPath(id));
		},
		
		/**
		 * Returns the item associated with the specified path.
		 *
		 * @param {Object[]} path The path identifying the item to retrieve.
		 * @return {Object} The navigation item identified by the specified path.
		 */
		getItemByPath: function(path) { return null; },
		
		/**
		 * Encodes the specified path as a String identifier.
		 * @param {Object[]} path The path to encode.
		 * @return {String} The encoded String identifier encoded form the path.
		 */
		encodePathAsIdentifier: function(path) {
			var result = "";
			var prefix = "";
			dArray.forEach(path, dLang.hitch(this, function(part) {
				var type = iUtil.typeOfObject(part);
				if ((type != "string")&&(type != "number")) {
					throw "Unsupported path identifier type (" + type + "): " + part;
				}
				var id = ("" + part).replace(/([\\\/\$#])/g,"\\$1");
				result = result + prefix + (type=="string"?"$":"#") + id;
				prefix = "/";
			}));
			return result;
		},
		
		/**
		 * Parses the 
		 * @param {String} The identifier to be parsed.
		 * @return {Object[]} The representing the path.
		 */
		parseIdentifierAsPath: function(identifier) {
			var index = 0;
			var result = [];
			var start = 0;
			var escaping = false;
			var part = "";
			var end = -1;
			if ((identifier.length == 0)
			     || (identifier.charAt(0) != '$')
			     || (identifier.charAt(0) != '#')) {
				throw "Unrecognized identifier format.  Should start with "
					  + "'$' or '#': " + identifier;
		    }
			for (index = 0; index < identifier.length; index++) {
				if (!escaping && identifier.charAt(index)=='\\') {
					part = part + identifier.substring(start, index);
					if (index == identifier.length - 1) {
						throw "Unrecognized identifier format.  Should not end "
						      + "with an escaping backslash: " + identifier;
					} 
					start = ++index;
					escaping = true;
					continue;
				}
				if (escaping) {
					escaping = false;
					if (index < identifier.length - 1) {
						continue;
					}
				}
				if (identifier.charAt(index) == '/') end = index;
				if (index == identifier.length-1) end = identifier.length;
				
				if (end > 0) {
					part = part + identifier.substring(start, end);
					index = start = end+1;
					
					if ((start < identifier.length)
					    &&(identifier.charAt(start) != '$')
						&&(identifier.charAt(start) != '#')) {
						throw "Unrecognized identifier format.  Each part should "
							  + "start with '$' or '#': " + identifier;
					}
					part = iUtil.parseObject(part.substring(1,part.length),
											 (part.charAt(0)=='$'?'string':'number'));
											 
					result.push(part);
					part = "";
					end = -1;
				}
			}
			return result;
		},
		
		/**
		 * Returns the navigation path for the item as an array of string and/or 
		 * numeric identifiers.  This can be used to uniquely identify the item
		 * or can be encoded as a string as an identifier.
		 *
		 * @param {Object} The item for which the ID is being requested.
		 * @return {Object[]} The path of identifiers for the item.
		 */
		getPath: function(item) { return null; },
		
		/**
		 * Returns the navigation ID for an item as a string.  This may be used to
		 * uniquely identify the item when it is selected in the navigation.
		 *
		 * @param {Object} The item for which the ID is being requested.
		 * @return {String} The string identifier for the item (including its path).
		 */
		getIdentity: function(item) { 
			return this.encodePathAsIdentifier(this.getPath(item)); 
		},
		
		/**
		 * Returns the array of identifiers for the parent path of this instance
		 * or null if there is no parent for the specified item.  The returned
		 * path may be used to uniquely identify the parent item.
		 *
		 * @param {Object} item The item for which the parent path is being requested.
		 * @return {Object[]} Returns the parent path array for the item.
		 */
		getParentPath: function(item) {
			var path = this.getPath(item);
			if (path.length < 1) return null;
			path.pop();
			return path;
		},
		
		/**
		 * Returns the navigation ID of the parent for the specified item as a string, or
		 * null if there is no parent for the specified item.  This may be used to 
		 * uniquely identify the parent item.
		 *
		 * @param {Object} item The item for which the parent ID is being requested.
		 * @return {String} The string identifier for the item (including its path).
		 */
		getParentIdentity: function(item) {
			var path = this.getPath(item);
			if (path.length < 1) return null;
			path.pop();
			return this.encodePathAsIdentifier(item);
		},
		
		/**
		 * Returns true if the item can be selected in the navigation, otherwise false.
		 * @return {boolean} true if the item is selectable, otherwise false.
		 */
		isSelectable: function(item) { return true; },
				
		/**
		 * Returns true if the item represents a heading for its children and false if not.
		 * @return {boolean} true if the item is a heading, otherwise false.
		 */
		isHeading: function(item) { return false; },
		
		/**
		 * Returns the label for the item.
		 *
		 * @return {String} The label for the item.
		 */
		getLabel: function(item) { return this.getIdentity(item); },

		/**
		 * Returns the help message for the item or null if no help is available.
		 *
		 * @return {String} The label for the item.
		 */
		getHelpMessage: function(item) { return null; },		
		
		/**
	     * Returns the text to use as a symbolic icon for high-contrast a11y mode in which
		 * icons would not otherwise be displayed.
		 *
		 * @return {String} The icon symbol to use or null if no icon.
		 */
		getA11yIconSymbol: function(item) { 
			var iconClass = this.getIconClass(item);
			if (! iconClass) return null;
			var label = this.getLabel(item);
			return (label ? label.charAt(0) : "O");
		},
		
		/**
		 * Returns a single CSS class to apply to the icon for the item (assuming an icon is being shown).
		 * If no icon for the item then null is returned.
		 * @return {String} The String CSS class for the icon, or null if no icon.
		 */
		getIconClass: function(item) { return null; },
		
		/**
		 * Returns a single CSS class to apply to the item for custom styling of item (e.g.: italics).
		 * 
		 * @return {String} The String CSS class to style the item.
		 */
		getStyleClass: function(item) { return null; },
		
		/**
		 * Returns true if the item has children in the navigation, otherwise false.
		 * @return {boolean} true if the item has children, otherwise false.
		 */
		hasChildren: function(item) { return false; },
		
		/**
		 * Returns the objects representing the children of the specified parent.
		 * If the specified parent is null or undefined, then this returns the root
		 * level items.
		 *
		 * @param {Object} parent The parent object or null if the root-level is being queried.
		 * @param {Object} options The options to pass through for paging purposes.
		 * @return {Promise|Object[]} Array of opaque objects representing
		 */
		getChildren: function(parent, options) { return []; },	
		
		/**
		 * Returns a dojox/store/api/Store view of this model with the individual items
		 * having the following properties:
		 *   - label
		 *   - isSelectable
		 *   - isHeading
		 *   - helpMessage
		 *   - iconClass
		 *   - a11yIconSymbol
		 *   - styleClass
		 */
		getStoreView: function(parent, options) {
			return new this.storeViewType({root: parent, options: options, model: this});
		}
	});
	   
});