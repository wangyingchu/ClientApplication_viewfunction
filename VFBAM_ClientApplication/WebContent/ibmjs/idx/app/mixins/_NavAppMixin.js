define(["dojo/_base/declare",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/string",
		"dojo/Deferred",
		"dojo/promise/all",
		"dojo/when",
		"dojo/aspect",
		"idx/app/NavModel",
		"idx/util",
		"idx/string",
		"./_PlatformAppMixin",
		"./_NavAppMixinNavModel"],
	   function (dDeclare, dLang, dArray, dString, 
				 dDeferred, dPromiseAll, dWhen, dAspect,
				 iNavModel, iUtil, iString, 
				 iPlatformAppMixin, iNavAppMixinNavModel) {

	var navConstraints = { "application": 	true, 
						   "settings": 		true, 
						   "user":          true, 
						   "help":          true, 
						   "sharing":       true };
	
	return dDeclare("idx.app.mixins._NavAppMixin", [iPlatformAppMixin], {		
		/**
		 * The format to use for building the label key from the nav item ID.
		 * @default "nav_label_${key}"
		 * @type String
		 */
		labelKeyFormat: "nav_label_${key}",
		
		/**
		 * The format to use for building the help key from the nav item ID.
		 * @default "nav_help_${key}"
		 * @type String
		 */
		helpKeyFormat: "nav_help_${key}",
		
		/** 
		 * The format to use for building the CSS icon class from the nav item ID.
		 * @default "idxNavIcon_${key}"
		 * @type String
		 */
		iconClassFormat: "idxNavIcon_${key}",
		
		/** 
		 * The format to use for building the CSS class from the nav item ID.
		 * @default "idxNav_${key}"
		 * @type String
		 */
		styleClassFormat: "idxNav_${key}",
		
		/**
		 * The format to use for building the key for looking up the A11y icon symbol from the nav item ID.
		 */
		symbolKeyFormat: "nav_symbol_${key}",
		
		/**
		 * Constructor to setup navigation.
		 */
		constructor: function(app, events) {			
			// prepare the navigation
			dAspect.before(this, "startup", dLang.hitch(this,function() {
				this._prepareNavigation();
			}));
		},


		/**
		 * Override to handle adoptive parents.
		 * TODO: Make this verify the lineage is allowed.
		 */
		_getViewConfig: function(parent, childID) {
			var decoded = this._decodeViewID(childID);
			if (decoded.root) {
				parent = this.views[decoded.root];
			}
			return parent.views[decoded.name];
		},
		
		/**
		 * Tries to obtain the title for a view if available.
		 * If not available, returns empty-string.
		 */
		_getViewTitle: function(view) {
			// try for a title attribute on the view
			var title = iString.nullTrim(view.title);
			if (title) return title;
			
			// try for a "_navTitle" attribute on the view
			title = iString.nullTrim(view._navTitle);
			if (title) return title;
			
			// get the view ID and decode it
			var viewID = view.id;
			var parts = iString.unescapedSplit(viewID, "_");
			var last = parts[parts.length-1];
			var decoded = this._decodeViewID(last);
			
			// if this is not a nav view then delegate to inherited 
			if ((!decoded.root)&&(parts.length!=3)) {
				return this.inherited(arguments);
			}
			
			// get the first view name
			var firstViewName = (decoded.root?decoded.root:parts[1]);
			console.log("FIRST VIEW NAME: " + firstViewName);
			
			// get the constraint for the first view
			var constraint = this._navConstraintsByView[firstViewName];	
			console.log("NAV CONSTRAINT: " + constraint);
			if (!constraint) return this.inherited(arguments);
			
			// get the hierarchy information for the constraint
			var nav = this._nav[constraint];
			
			// lookup the nav part by the view name
			console.log("VIEW NAME: " + decoded.name);
			
			var navPart = nav.lookupByView[decoded.name];
			if (!navPart) return this.inherited(arguments);
			console.log("VIEW NAME: " + navPart.name);
			
			// if no store item IDs to worry about, then return our label
			if (!navPart.storeItemIDs) {
				// save label for future
				view._navTitle = navPart.label;
				return view._navTitle;
			}
			
			// we have store IDs, so try to build a context
			var storeContext = {};
			var current = navPart;
			var storeItemIDs = decoded.storeItemIDs.concat([]);
			var source = null, store = null;
			var storeCount = 0;
			
			// count how many store items we need at most
			while (current) {
				if (current.navStore) storeCount++;
				current = nav[current.parentKey];
			}
			
			// if we don't have enough store items then try to
			// pull them only for views until we run out
			var viewsOnly = (storeItemIDs.length < storeCount);
			var item = null;
			var currentID = null, currentItem = null;
			current = navPart;
			while (current && (storeItemIDs.length>0)) {
				if (current.navStore && (current.viewName || (!viewsOnly))) {
					currentID = storeItemIDs.pop();
					source = this._navStores[current.navStore.sourceName];
					store = source.store;
					currentItem = store.get(currenID);
					if (current === navPart) item = currentItem;
					else {
						storeContext[current.navStore.name] = currentItem;
					}
				}
			}
			
			// see if we have enough store items to format the title (we may not)
			try {
				view._navTitle = this.formatStoreText(navPart.label, item, storeContext);
			} catch (e) {
				console.log("FAILED TO FORMAT VIEW TITLE WITH STORE ITEMS: " + e);
				return this.inherited(arguments);
			}
			
			// if we get here then return the saved navigation title
			return view._navTitle;
		},
		
		/**
		 * Overridden to exclude the lineage prefix for default views
		 * that begin with a caret ("^").
		 * 
		 * @param {Object} view The view from which the default views are extracted.
		 * @param {Boolean} fullyQualified true if views should be fully qualified, otherwise false.
		 * @return The array of view paths as described above.
		 */
		_decodeDefaultViews: function(view, fullyQualified) {
			if (!view.defaultView) return null;
			var lineage = [ ];
			var parent = view;
			while(parent !== this){
				lineage.push(parent.name);
				parent = parent.parent;
			}
			lineage.reverse();
			var prefix = (lineage.length==0) ? "" : lineage.join(",") + ",";
			var encodedPaths = view.defaultView;
			var sepIndices = iString.unescapedIndexesOf(encodedPaths, "+-");
			var siblings = iString.unescapedSplit(encodedPaths, "+-");
			var result = [];
			var index = 0;
			var removes = [];
			var sepIndex = 0;
			var sep = "";
			var encodedDefault = "";
			for (index = 0; index < sepIndices.length; index++) {
				sepIndex = sepIndices[index];
				sep = encodedPaths.charAt(sepIndex);
				removes.push(sep== "-" ? true : false);
			}
			if ((sepIndices.length > 0) && (sepIndices[0]==0)) {
				// we begin with a separator so ignore first sibling
				// which should be empty-string
				siblings.shift();
			} else {
				// the first character is not a plus or minus, so assume
				// it is a plus by default so the first sibling is an add
				removes.unshift(false);
			}
			for (index = 0; index < siblings.length; index++) {
				encodedDefault = siblings[index];
				if (encodedDefault.length > 1 && encodedDefault.charAt(0) == "^") {
					encodedDefault = encodedDefault.substring(1);
				} else if (fullyQualified) {
					encodedDefault = prefix + encodedDefault;
				}
				result.push({
					id: encodedDefault,
					remove: removes[index],
					lineage: iString.unescapedSplit(encodedDefault, ",")
				});
			}
			return result;
		},
		
		/**
		 * Overridden to resolve the paths with adoptive
		 * parents as needed in order to handle navigationally
		 * up-stream views which are "containers" or "consumers".
		 */
		_decodeViewPaths: function(encodedPaths) {
			var viewPaths = this.inherited(arguments);
			if (!viewPaths || viewPaths.length == 0) return null;
			
			// iterate through the parts and fully qualify them
			// this means we have to resolve adoptive parents in the chain
			var resolvedPaths = [];
			dArray.forEach(viewPaths,dLang.hitch(this, function(path) {
				// resolve the path
				path = this._resolveViewPath(path);

				// only include paths that resolve
				if (path) resolvedPaths.push(path);
			}));
			// retrurn the resolved paths
			return resolvedPaths;
		},

		/**
		 * Method to obtain the navigation model (if any)
		 * associated with the given constraint.
		 */
		getNavModel: function(constraint) {
			if (!this._navModels) return null;
			return this._navModels[constraint];
		},
		
		/**
		 * This method is automatically called form the idx/app/Load
		 * controller.
		 *
		 * @param rootView The root view for the application.
		 */
		_initRootView: function(rootView) {
			this._navigator = rootView.navigator;
			this._navigator.set("primaryModel", this.getNavModel("application"));
			this._navigator.set("helpModel", this.getNavModel("help"));
			this._navigator.set("settingsModel", this.getNavModel("settings"));
			this._navigator.set("userModel", this.getNavModel("user"));
			this._navigator.set("sharingModel", this.getNavModel("sharing"));
			
			this._navigator.own(
				dAspect.after(this._navigator, "onSelection", dLang.hitch(this, function(navModel,item,event) {
				this._onNavSelection(navModel,item,event);
			}), true));					
		},
		
		/**
		 *
		 */
		_onNavSelection: function(navModel, item, event) {
			var navPath = navModel.getPath(item);
			var parsedPath = [];
			dArray.forEach(navPath, dLang.hitch(this, function(navPart) {
				parsedPath.push(this._decodeNavPart(navPart));
			}));
			var navStoreContext = {};
			var storeItemIDs = [];
			var navStore = null;
			var source = null;
			var store = null;
			dArray.forEach(parsedPath, dLang.hitch(this, function(part) {
				if ("storeItemID" in part) {
					storeItemIDs.push(part.storeItemID);
					navStore = this._navStores[part.name];
					source = this._navStores[navStore.sourceName];
					store = source.store;
					navStoreContext[part.name] = store.get(part.storeItemID);
				}
			}));
			var platform = this.targetPlatform;
			var viewName = item.pathComponent.viewName[platform];
			var constraint = item.pathComponent.constraint;
			var navViewName = this._navViewNames[constraint];
			var encodedViewID = this._encodeViewID(viewName, storeItemIDs);
			var viewLineage = [ navViewName, encodedViewID ];
			encodedViewID = this._encodeViewLineage(viewLineage);
			
			// transition to itemDetails view with the &cursor=index
			var title = navModel.getLabel(item);
			var transOpts = {
				title : title,
				target : encodedViewID,
				data: { navStoreContext: navStoreContext }
			};
			this.transitionToView(this.domNode,transOpts,event);
		},
		
		/**
		 * Handles preparing the application navigation.
		 *
		 * @private
		 */
		_prepareNavigation: function() {
			if (this._preparedNav) return;
			this._preparedNav = true;
			var index = 0;
			var navItem = null;
			
			// initialize internal variables
			this._nav = {};
			this._navViews = {};
			this._navViewNames = {};
			this._navConstraintsByView = {};
			
			// process navigation stores
			this._processNavStores();
			
			// traverse the paths
			this._buildHierarchies();
			
			// get the icons and labels
			this._prepareNavElements();
		
			// create the nav model
			this._navModels = {};
			var constraint = null;
			for (constraint in this._nav) {
				this._navModels[constraint]= new iNavAppMixinNavModel({app: this, constraint: constraint});
			}			
		},
		
		/**
		 * Processes the navigation store configuration for use in processing the navigation hierarchy.
		 * @private
		 */
		_processNavStores: function() {
			var config = null, navStore = null, field = null,
				store = null, child = null;
			
			this._nextNavStoreID = 1;
			this._navStores = {};
			this._navStoreLookup = {};
			// iterate through the configured nav stores
			for (field in this.navStores) {
				navStore = {internalID: ("" + (this._nextNavStoreID++))};
				this._navStores[field] = navStore;
				this._navStoreLookup[navStore.internalID] = navStore;
			}
			
			// iterate through the configured nav stores
			for (field in this.navStores) {
				// skip the "__parent" field if the parser inserted
				if (field == "__parent") continue;
				
				// set the current config and construct the navStore object
				config = this.navStores[field];
				navStore = this._navStores[field];
				
				// check if the store associated with the current exists
				if (! (config.store in this.stores)) {
					throw "NavStore (" + field + ") has an unrecognized store name: " + config.storeName;
				}
				
				// record the relevant fields form the config
				navStore.storeName 		= config.store;	
				navStore.storeConfig 	= this.stores[config.store];
				navStore.navStoreConfig = config;
				navStore.store 			= navStore.storeConfig.store;
				navStore.filter 		= (config.filter ? config.filter : null);
				navStore.children 		= {};
				navStore.name 			= field;
				navStore.path 			= field;
				navStore.sourceName		= field;
				
				// check for children
				if (config.children) {
					for (child in config.children) {
						// skip the __parent field if inserted by parser
						if (child == "__parent") continue;
						
						// process the child
						navStore.children[child] = this._processNavStoreChild(child, config.children[child], navStore);
					}
				}				
			}
		},

		/**
		 * Processes a field in the "children" sub-section of a defined navStore.
		 * Children can be of two types:
		 *	  - Relational: Connecting to another store's "query" function with a query object.
		 *    - Hierarchical: Using the "getChildren()" function of the current store.
		 * @private
		 */
		_processNavStoreChild: function(name, config, parent) {
			// get the current child and construct the child store
			var childStore = {}, child = null, navStore = null;
			childStore.children = {};
			childStore.internalID = "" + (this._nextNavStoreID++);
			this._navStoreLookup[childStore.internalID] = childStore;
			
			childStore.parentID   = parent.internalID;
			childStore.path       = parent.path + "/" + name;
			childStore.name       = name
			childStore.options    = config.options ? config.options : null
			
			if (config.query) {
				// check if the navStore is defined
				if (! (name in this._navStores)) {
					throw "NavStore child (" + parent.path + ") has a child that specifies "
						  + "a query, but child name is not a navStore: " + name;
				}
						
				// record the name, the query and the options
				childStore.query     	= config.query;
				childStore.dependent 	= false;
				childStore.sourceName	= name;
				
			} else {
				// get the source navStore with the "store" field
				navStore = this._navStores[parent.sourceName];
				
				// we may have a store leveraging "getChildren()" function
				if ((!navStore.store.getChildren) || (! dLang.isFunction(navStore.store.getChildren))) {
					throw "NavStore (" + field + ") has a child (" + child + ") configured to use getChildren() "
					      + "function, but the associated store (" + navStore.storeName + ") has no such function.";
				}
				
				// record the options
				childStore.dependent 	= true;
				childStore.sourceName   = parent.sourceName;
				
				// check for children
				if (config.children) {
					for (child in config.children) {
						if (child == "__parent") continue;
						childStore.children[child] = this._processNavStoreChild(child, config.children[child], childStore);
					}
				}
			}
			
			// return the child store
			return childStore;
		},

		/**
		 * Extracts the navigation platforms from the constraint.
		 * @private
		 */
		_parseNavigationPlatforms: function(path, origPath) {
			if (!origPath) origPath = path;
			var platformLookup = {};
			var platforms = [];
			
			// check for target platforms in the path
			var platformIndex = path.lastIndexOf('@');
			if ((platformIndex > 0)&&(platformIndex == path.length - 1)) {
				// trailing "@" -- assume all platforms
				constriant = path.substring(0, platformIndex);
				platformLookup = { "desktop": true, "phone": true, "tablet": true };
							
			} else if (platformIndex > 0) {
				// specific platforms specified
				platforms = path.substring(platformIndex+1).split(",");
				for (index = 0; index < platforms.length; index++) {
					// get the next platform
					platform = platforms[index] = iString.nullTrim(platforms[index]);
								
					// check if the platform is not recognized
					if ((!platform)
						||((platform!="desktop") && (platform!="mobile") && (platform!="tablet") && (platform!="phone"))) {
						throw  ("Navigation path(" + origPath + ") contains unrecognized platform: " + platforms[index]);
					}
								
					// check if this platform is already specified
					if (platformLookup[platform] || ((platform == "mobile") && (platformLookup["tablet"]||platformLookup["phone"]))) {
						throw ("Navigation path(" + origPath + ") contains redundant platforms: " + platform);
					}
								
					// if "mobile", splice in "tablet", "phone" and substitute "tablet" instead for this iteration
					if (platform == "mobile") {
						platformLookup.phone = true;
						platformLookup.tablet = true;
					} else {								
						// set the platform lookup flag to true for this platform
						platformLookup[platform] = true;
					}
				}
							
				// strip the platforms from the path
				path = path.substring(0, platformIndex);
							
			} else {
				platformLookup = { "desktop": true, "phone": true, "tablet": true };
			}
			platforms = [];
			for (platform in platformLookup) platforms.push(platform);
			return { path: path, platforms: platforms, platformLookup: platformLookup };
		},

		/**
		 * Internal method to parse and strip the modifiers that can follow 
		 * the name of a navigational component in a navigation path.  This 
		 * includes parsing of platform scoping as well as consumption and
		 * truncation markers.
		 * @private
		 */
		_parseNavigationModifiers: function(path, origPath) {
			 if (!origPath) origPath = path;
			var parseResult = this._parseNavigationPlatforms(path, origPath);
			var truncates = false, contains = false;
			path = parseResult.path;
			
			// check if the path has parental mode
			if (path.length == 0) {
				throw "Navigation path missing name for path component: " + origPath; 
			}
			switch (path.charAt(path.length-1)) {
				case '{':
					contains = true;
					truncates = false;
					path = path.substring(0, path.length-1);
					break;
				case '[':
					truncates = true;
					contains = true;
					path = path.substring(0, path.length-1);
					break;
				case '|':
					truncates = true;
					contains = false;
					path = path.substring(0, path.length-1);
					break;
				default: 
					truncates = false;
					contains = false;
			}
			if (path.length == 0) {
				throw "Navigation path missing name for path component: " + origPath; 
			}
			
			// update the parse result and return it
			parseResult.path		 = path;
			parseResult.truncates 	 = truncates;
			parseResult.contains     = contains;
			return parseResult;
		},
		
		/**
		 * For each navigational constraint, finds the associated
		 * view and finds the navigational views and builds a hierarchy
		 * for each.
		 *
		 * @private
		 */
		_buildHierarchies: function() {
			var navConstraint = null;
			for (navConstraint in navConstraints) {
				this._buildHierarchy(navConstraint);
			}
		},
		
		/**
		 * Traverses the views under the view for the specified 
		 * navigational constraint and builds the hierarchy.
		 * @private
		 */
		_buildHierarchy: function(navConstraint) {
			// examine the configuration
			var config = this;
			var heading = false;
			var navHierarchy = [ ];
			var navLookup = {};
			var navLookupByKey = {};
			var navLookupByView = {};
			var viewName = null;
			var navView = null;
			var navViewName = null;
			var path = null;
			var view = null;
			var navPartName = null;
			var navPartNamess = null;
			var index = 0;
			var parseResult = null;
			var parentPart = null;
			var parentArray = null;
			var parentLookup = null;
			var navPart = null;
			var pathViews = {};
			var parentKey = "";
			var prefix = "";
			var platformIndex = 0;
			var platform = "";
			var platforms = null;
			var platformLookup = null;
			var navigable = null;
			var navStoreConfig = null;
			var source = null;
			var navStore = null;
			
			var navStoreStack = null, tempStack = null;
			if (config["views"]) {
				for (viewName in config.views) {
					// skip if not in navConstraints
					if ((config.views[viewName].constraint == navConstraint)) {
						if (navView) {
							throw "View (" + viewName + ") cannot have the same application "
								  + "constraint (" + navConstraint + ") as previously found "
								  + "view (" + navViewName + ")";
						}
						navView = config.views[viewName];
						navViewName = viewName;
					}
				}
				this._navViews[navConstraint] = navView;
				this._navViewNames[navConstraint] = navViewName;
				this._navConstraintsByView[navViewName] = navConstraint;
				
				if (navView && navView["views"]) {
					// determine the navigation hierarchy
					for (viewName in navView.views) {
						if (viewName == "__parent") continue;
						view = navView.views[viewName];
						path = view.navigation;
						if (!iString.nullTrim(path)) continue;

						// parse terminating character
						parseResult = this._parseNavigationModifiers(path, view.path);
						path = parseResult.path;
						platforms = parseResult.platforms;
						platformLookup = parseResult.platformLookup;
						contains = parseResult.contains;
						truncates = parseResult.truncates;
						
						// check if we have already seen this path / platform combination
						if (pathViews[path]) {
							// the path is NOT unique -- check if specified for alternate platform-specific views
							for (index = 0; index < platforms.length; index++) {
								if (pathViews[path].platformLookup[platforms[index]]) {
									throw ("Navigation path (" + view.path + ") is not unique for view (" + viewName
											+ ") and target platforms.  Previously defined path & platform "
											+ "combination found for view: " 
											+ pathViews[path].viewName[platforms[index]]);
								}
							}
						}
						
						// split the path into its parts
						navPartNames = path.split(/[\/>]/);	
						navSplitters = path.replace(/([^\/>])/g,"");
						if (navPartNames.length != navSplitters.length + 1) {
							throw "Unable to parse navigation path: " + path;
						}
						parentPart = null;
						parentLookup = navLookup;
						parentArray = navHierarchy;
						parentKey = "";
						prefix = "";
						navStoreStack = [ ];
						navStore = null;
						heading = false;
						
						// loop thorough the parts of the navigation path
						for (index = 0; index < navPartNames.length; index++) {
							navPartName = dString.trim(navPartNames[index]);
							if (navPartName.length == 0) {
								throw "Empty path component detected in path: " + path;
							}
							
							// check for a navStore
							navStore = null;
							if (navPartName.charAt(navPartName.length-1) == "*") {
								// strip off the "*"
								navPartName = navPartName.substring(0, navPartName.length-1);
								if (navPartName.length == 0) {
									throw "Empty navStore path component detected in path: "
										+ path;
								}
								// we are referencing a navigation store
								navStore = this._pushNavStore(navPartName, navStoreStack);
								if (!navStore) {
									throw "Navigation path (" + path +") has unrecognized "
									      + "navStore name: " + navPartName;
								}
							}
							
							// get the parent object associated with the part of the path
							navPart = parentLookup[navPartName];
							heading = ((index < navPartNames.length-1) && (navSplitters.charAt(index)=='>')) ? true : false;
							// check if the part was not found and create an object for it
							if (! navPart) {
								if (navStore) {
									tempStack = navStoreStack.concat([]);
								}
								// if not found then create this part
								navPart = { constraint: navConstraint,
											name: navPartName, 
											children: [], 
											childLookup: {},
											navStore: navStore,
											navStores: (navStore?tempStack:null),
											heading: heading,
											parentKey: parentKey,
											originator: {view: viewName, path: view.path},
											key: parentKey + prefix + navPartName };
											
								// save the part in the global navigation lookup by key
								navLookupByKey[navPart.key] = navPart;
								navLookupByView[viewName] = navPart;
								
								// if this is the last part then create the view information
								if (index == navPartNames.length - 1) {
									navPart.viewName = { };
									navPart.view = { };
									navPart.platforms = [];
									navPart.platformLookup = {};
									navPart.parentalMode = { };
									navPart.viewLookup = {};
									pathViews[path] = navPart;
								}
								parentLookup[navPartName] = navPart;
								parentArray.push(navPart);
							}
							// double-check for heading consistency
							if (navPart.heading != heading) {
								throw "Path inconsitency for navigation path (" + path + ") with path component '" + navPartName
									+ "' defined as a " + (heading?"heading":"child") + " by the '" + viewName + "' view.  The same "
									+ "path component was previously defined as a " + ((navPart.heading)?"heading":"child") 
									+ " by the '" + navPart.originator.view + "' with path '" + navPart.originator.path + "'";
							}
							// double-check for navStore consistency
							if (navStore !== navPart.navStore) {
								if (!navPart.navStore) {
									throw "View (" + viewName + ") has path (" + path + ") with path "
										 + "component (" + navPartName + ") defined as a navStore (" + navStore.path 
										 + "), but the same component was previously defined as static by the '"
										 + navPart.originator.view + "' view using path '"
										 + navPart.originator.path + "'";
									
								} else if (!navStore) {
									throw "View (" + viewName + ") has path (" + path + ") with path "
										 + "component (" + navPartName + ") defined as static, but the same component "
										 + "was previously defined as a navStore (" + navPart.navStore.path + ") by the '"
										 + navPart.originator.view + "' view using path '"
										 + navPart.originator.path + "'";
										 
								} else {
									throw "View (" + viewName + ") has path (" + path + ") with path "
										 + "component (" + navPartName + ") defined as a navStore (" + navStore.path 
										 + "), but the same component was previously resolved to a different navStore ("
										 + navPart.navStore.path + ") by the '" + navPart.originator.view 
										 + "' view using path '" + navPart.originator.path + "'";
								}
							}
							// set the view information if this is the last part
							if (index == navPartNames.length - 1) {
								dArray.forEach(platforms, function(platform) {
									// double check we are not being redundant (this should have been caught above)
									if (navPart.viewName[platform] || navPart.view[platform]) {
										throw "Failed to detect redundant path & platform combination: "
											  + platforms.length + " / " + path + " / " + navPartName + " / " + platform + " / " + navPart.viewName[platform];
									}
									navPart.platforms.push(platform);
									navPart.platformLookup[platform] = true;
									if (!navPart.viewLookup[viewName]) navPart.viewLookup[viewName] = [];
									navPart.viewLookup[viewName].push(platform);
									navPart.viewName[platform] = viewName;
									navPart.parentalMode[platform] = { truncates: truncates, contains: contains };
									navPart.view[platform] = view;
								});									
							}
							
							parentLookup = navPart.childLookup;
							parentArray = navPart.children;
							parentPart = navPart;
							parentKey = navPart.key;
							prefix = "_";
						}
					}
				}
			}
			this._nav[navConstraint] = {
				hierarchy: navHierarchy,
				lookupByKey: navLookupByKey,
				lookupByView: navLookupByView,
				rootLookup: navLookup
			};
		},
		
		/**
		 * Used during initialization, this function augments all navigational
		 * parts with their proper label, icon class, help message, etc....
		 * @private
		 */
		_prepareNavElements: function() {
			var index = 0;
			var constraint = null;
			var hierarchy = null;
			for (constraint in this._nav) {
				hierarchy = this._nav[constraint].hierarchy;
				
				// iterate through the nav elements (recursively)
				for (index = 0; index < hierarchy.length; index++) {
					this._prepareNavElement(hierarchy[index]);
				}
			}
		},
		
		/**
		 * Used during initialization, this function augments a navigational
		 * part with its proper label, icon class, help message, etc....
		 * @private
		 */
		_prepareNavElement: function(navPart) {
			// get the label
			var labelKey = dString.substitute(this.labelKeyFormat, navPart);
			var label = this.nls[labelKey];
			if (!label) label = navPart.name;
			
			// get the icon class
			var iconClass = dString.substitute(this.iconClassFormat, navPart);

			// get the style class
			var styleClass = dString.substitute(this.styleClassFormat, navPart);
			
			// get the icon sybol
			var symbolKey = dString.substitute(this.symbolKeyFormat, navPart);
			var iconSymbol = this.nls[symbolKey];
			if (!iconSymbol && label && label.length > 0) iconSymbol = label.charAt(0).toLocaleUpperCase();
			
			// get the help message
			var helpKey = dString.substitute(this.helpKeyFormat, navPart);
			var help = this.nls[helpKey];
			if (!help) help = null;
			
			// add fields to navPart
			navPart.label = label;
			navPart.iconClass = iconClass;
			navPart.styleClass = styleClass;
			navPart.help = help;
			navPart.iconSymbol = iconSymbol;
			
			// prepare the children
			var index = 0;
			for (index = 0; index < navPart.children.length; index++) {
				this._prepareNavElement(navPart.children[index]);
			}
		},

		/**
		 * Internal method for logging navigation parts.
		 * @private
		 */
		_logNavPart: function(navPart, prefix, storeAncestors, storeContext) {
			var index = 0;
			var platform = "";
			var sep = "";
			var parentPart = this._nav[navPart.constraint].lookupByKey[navPart.parentKey];
			var heading = (parentPart?parentPart.heading:true);
			var logMsg = "*" + prefix + (heading?"|":">") + navPart.name + " / " + navPart.label 
						+ " (" + navPart.key + ")";
			var viewSuffix = "";
			if (navPart.viewName) {
				viewSuffix = "   [ ";
				for (index = 0; index < navPart.platforms.length; index++) {
					platform = navPart.platforms[index];
					viewSuffix = viewSuffix + sep + navPart.viewName[platform] + "(" +platform+")";
					sep = ", ";
				}
				viewSuffix = viewSuffix + " ]";				
			}
			if (navPart.navStore) {
				this._logStoreItems(navPart, storeAncestors, prefix, viewSuffix, storeContext);
			} else {
				console.log(logMsg + viewSuffix);
				// log the non-headings first
				for (index = 0; index < navPart.children.length; index++) {
					if (navPart.children[index].heading) continue;
					this._logNavPart(navPart.children[index], prefix + "  ", storeAncestors, storeContext);
				}
				// log the headings second
				for (index = 0; index < navPart.children.length; index++) {
					if (!navPart.children[index].heading) continue;
					this._logNavPart(navPart.children[index], prefix + "  ", storeAncestors, storeContext);
				}
			}
		},
		
		/**
		 * Internal method for logging store items in the navigation.
		 * @private
		 */
		_logStoreItems: function(navPart, ancestors, prefix, viewSuffix, context) {
			ancestors = ancestors ? ancestors : [];
			context = context ? context : {};
			var navStore = navPart.navStore;
			var source = this._navStores[navStore.sourceName];
			var index = 0;
			var parentItem = null;
			var items = null;
			var query = undefined;
			var value = null;
			var field = null;
			var options = undefined;
			var format = null, sub = null;
						
			if (navStore.parentID) {
				// prepare the options
				options = this._resolveNavStoreValues(navStore.options,context);
				
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
					query = this._resolveNavStoreValues(navStore.query, context);
					
					// get the items
					items = source.store.query((query?query:null), options);
				}
			} else {
				if (navStore.filter) {
					// prepare the options and query
					options = this._resolveNavStoreValues(navStore.filter.options, context);
					query = this._resolveNavStoreValues(navStore.filter.query, context);
				}
				
				// get the items
				items = source.store.query((query?query:null), options);
			}	
			
			var index = 0;
			dWhen(items, dLang.hitch(this, function(nodes) {
				var node = null;
				var nodeID = "";
				var newContext = null;
				var newAncestors = ancestors.concat([]);
				var field = null;
				var index = 0;
				var parentPart = this._nav[navPart.constraint].lookupByKey[navPart.parentKey];
				var heading = (parentPart?parentPart.heading:true);
				for (index = 0; index < nodes.length; index++) {
					node = nodes[index];
					newAncestors.push({navStore: navStore, item: node});
					nodeID = node[source.store.idProperty];
					newContext = {};
					dLang.mixin(newContext, context);
					newContext[navStore.name] = node;
					
					console.log("*" + prefix + (heading?"|":">") + nodeID + " / " 
								+ this._formatStoreText(navPart.label, node, context) + " (" + navPart.key + ")" 
								+ viewSuffix);
								
					dArray.forEach(navPart.children, dLang.hitch(this, function(child) {
						if (child.heading) return;
						this._logNavPart(child, prefix + "  ", newAncestors, newContext);
					}));
					dArray.forEach(navPart.children, dLang.hitch(this, function(child) {
						if (!child.heading) return;
						this._logNavPart(child, prefix + "  ", newAncestors, newContext);
					}));
				}
			}));
		},
		
		/**
		 * Formats a piece of text using a store item and context.
		 * @private
		 */
		_formatStoreText: function(template, item, context) {
			var values = {};
			if (item) dLang.mixin(values, item);
			if (context) dLang.mixin(values, context);
			return dString.substitute(template, values);
		},
					
		/**
		 * Clones an object while removing the "__parent" field.
		 * @private
		 */
		_cleansedCopy: function(object) {
			var result = dLang.mixin({}, object);
			if ("__parent" in result) {
				result.__parent = "";
				delete result.__parent;
			}
			for (var key in result) {
				if (! result[key]) continue;
				if (dLang.isObject(result[key])) {
					result[key] = this._cleansedCopy(result[key]);
				}
			}
			return result;
		},
		
		/**
		 * Pushes the next nav store on to the stack after resolving
		 * it against the stack.
		 * @private
		 */
		_pushNavStore: function(name, navStoreStack) {
			var index = 0, navStore = null, child = null;
			for (index = navStoreStack.length-1; index >= 0; index--) {
				navStore = navStoreStack[index];
				if (navStore.children[name]) {
					child = navStore.children[name];
					break;
				}
			}
			navStore = child ? child : this._navStores[name];
			if (navStore) {
				navStoreStack.push(navStore);
			}
			return navStore;
		},
		
		/**
		 * Resolves a map of nav store values using the specified context.
		 * This is typically done so it can be used in a query or as options
		 * to a backing store.
		 * @private
		 */
		_resolveNavStoreValues: function(map, context) {
			var result = null, field = null, value = null;
			if (map) {
				result = {};
				for (field in map) {
					if (field == "__parent") continue;
					value = this._resolveNavStoreValue(map[field],context);
					result[field] = value;
				}
			}
			return result;
		},
		
		/**
		 * Resolves an attribute value for a store query or store options
		 * using the current navigational store context.
		 *
		 * @param value The value to be resolved.
		 * @param context The context with which to resolve it.
		 * @private
		 */
		_resolveNavStoreValue: function(value, context) {
			var result = value, format = null;
			if (value && dLang.isObject(value) && value["$resolve"]) {
				format = value["$resolve"];
				result = (format) ? dString.substitute("" + format, context) : format;
				if (value.type) {
					result = iUtil.parseObject(result, value.type);
				}
			}
			return result;
		},
		
		/**
		 * This function encodes a nav part for the corresponding NavModel 
		 * implementation (_NavAppMixinNavModel).
		 */
		_toEncodedNavPart: function(navPart, storeItem) {
			var navStore = null, source = null, storeItemID = null;
			var result = "";
			
			if (storeItem) {
				navStore = navPart.navStore;
				source = this._navStores[navStore.sourceName];
				storeItemID = storeItem[source.store.idProperty];
			}
			
			try {
				result= this._encodeNavPart(navPart.name, storeItemID);
				
			} catch (e) {
				throw ("Failed to encode path component.  "
						+ "navPart=[ " 
						+ navPart.name + " ]"
						+ (navStore
							? (", navStore=[ " + navStore.name 
						       + " ], sourceNavStore=[ " 
							   + navStore.sourceName
							   + " ], storeName=[ " 
						       + source.storeName 
							   + " ], storeItemID=[ " 
							   + storeItemID + " ]")
							: ""));
			}
			
			return result;		
		},
		
		/**
		 * This function encodes a nav part for the corresponding NavModel 
		 * implementation (_NavAppMixinNavModel).
		 * @private
		 */
		_encodeNavPart: function(navPartName, storeItemID) {
			var result = navPartName.replace(/([\\:])/g, "\\$1");
			
			if (storeItemID) {
				type = iUtil.typeOfObject(storeItemID);
				if ((type != "string")&&(type != "number")) {
					throw "Unsupported store item type.  navPartName=[ "
						+ navPartName + " ], storeItemID=[ "
						+ storeItemID + " ], type=[ " + type + " ]";
				}
				storeItemID = ("" + storeItemID).replace(/([\\:])/g, "\\$1");
				result = result + ":" + (type=="string"?"$":"#") + storeItemID;
			}
			return result;
		},

		
		/**
		 * This function decodes a nav part for the corresponding NavModel 
		 * implementation (_NavAppMixinNavModel).
		 *
		 * @private
		 */
		_decodeNavPart: function(pathComponent) {
			var parts = this._parseNamedParts(pathComponent);
			if (parts.length == 0) {
				throw "Unable to parse nav part: " + pathComponent;
			}
			if (parts.length > 2) {
				throw "Too many unescaped colons in nav part: " + pathComponent;
			}
			if (parts.length > 1) {
				return { name: parts[0], storeItemID: parts[1] };
			} else {
				return { name: parts[0] };
			}
		},

		/**
		 * Encodes a view ID using a view name and store item IDs.
		 *
		 * @private
		 */
		_encodeViewID: function(viewName, storeItemIDs) {
			var result = viewName.replace(/([\\:])/g, "\\$1");
			if (storeItemIDs) {
				dArray.forEach(storeItemIDs, dLang.hitch(this, function(storeItemID) {
					var type = iUtil.typeOfObject(storeItemID);
					if ((type != "string")&&(type != "number")) {
						throw "Unsupported store item type.  viewName=[ "
							+ viewName + " ], storeItemID=[ "
							+ storeItemID + " ], type=[ " + type + " ]";
					}
					storeItemID = ("" + storeItemID).replace(/([\\:|\+\-,])/g, "\\$1");
					result = result + ":" + (type=="string"?"$":"#") + storeItemID;
				}));
			}
			return result;
		},
		
		/**
		 * Decodes the view ID and extracts the view name and
		 * store item ID array (which may be empty).  Any escaped
		 * characters in the encoded view ID are resolved.  The
		 * returned object has two fields: "name" and "storeItemIDs".
		 * 
		 * @private
		 */
		_decodeViewID: function(encodedViewID) {
		    var split = null;
			var root = null;
			if (encodedViewID.charAt(0) == "^" && encodedViewID.length>1) {
				split = iString.unescapedSplit(encodedViewID.substring(1), "|");
				if (split.length == 2) {
					root = split[0];
					encodedViewID = split[1];
				}
			}
			var parts = this._parseNamedParts(encodedViewID);
			if (parts.length == 0) {
				throw "Unable to parse encoded view ID: " + encodedViewID;
			}
			var viewName = parts.shift();
			if (parts.length == 0) {
				return { root: root, name: viewName, storeItemIDs: [] };
			} else {
				return { root: root, name: viewName, storeItemIDs: parts }
			};		
		},

		/**
		 * Parses the view identifier expecting a colon-separated
		 * list where the first element of that list is the view key
		 * and is required, followed by an optional additonal parts
		 * representing the store IDs needed for resolving the path.
		 * The store IDs must begin with "$" if they are to be interpretted
		 * as a string and with "#" if they are to be interpreted as a number.
		 * The returned array will contain a string for the first element
		 * with additional elements (if any) being strings or numbers.
		 * @private
		 */
		_parseNamedParts: function(identifier) {
			var parts = iString.parseTokens(identifier, ":", "\\");
			var index = 0;
			var result = [];
			var part = null;
			var typeToken = null;
			for (index = 0; index < parts.length; index++) {
				part = parts[index];
				if (!part || part.length == 0) {
					throw "Unrecognized identifier has empty-string component: " + identifier;
				}
				if (index > 0) {
					typeToken = part.charAt(0);
					if ((typeToken != "$")&&(typeToken != "#")) {
						throw "Unrecognized type token.  Expected '$' or '#' and received '"
							  + typeToken + "'.  identifier=[ " + identifier + " ]";
					}
					part = iUtil.parseObject(
								part.substring(1,part.length),
								(part.charAt(0)=='$'?'string':'number'));
					result.push(part);		
				} else {
					result.push(part);
				}
			}
			return result;
		},		
		
		/**
		 * Resolves a view path for the given view to include adoptive parents.
		 */
		_resolveViewPath: function(path) {
			// app,primaryRepo:prod1_transactions
			//
			// app,^app|repos,^app|primaryRepo:center1:production1:prod1_transactions
			//
			// data/repos/dataCenter*/primaryGroups>primaryGroup*/repository*
			//
			// app,customerOrder:cust01:order1226010
			//
			// DESKTOP: app,^app|customerDesktop:cust01,^app|customerOrder:cust01:order1226010
			// MOBILE: app,customerOrder:cust01:order1226010
			//
			if (path.lineage.length < 2) return path;
			
			// get the parts
			var parts = path.lineage.concat([]);
			
			// get the first part
			var first = parts.shift();
			// check if the first view represents a navigation view
			var constraint = this._navConstraintsByView[first];
			
			// if not a view that is a child of a navigation view then return as-is
			if (!constraint) {
				return path;
			}
			
			// parse the second part as needed
			var second = parts.shift();
			var parsedViewID = this._decodeViewID(second);
			
			// get the descriptor for the view's navigation
			var nav = this._nav[constraint];
			var navPart = nav.lookupByView[parsedViewID.name];
			
			// if the view is not navigational then return the original parts
			if (!navPart) {
				return path;
			}
			
			// walk the parents of the navPart and find the containers
			var viewPath = [];
			var storePath = [];
			var partPath = [];
			var parentKey = null;
			var current = navPart;
			var parentalMode = null;
			var viewName = null;
			var platform = this.targetPlatform;
			var storeItemIDs = parsedViewID.storeItemIDs.concat([]);
			var storeItemCount = 0;
			var currentStoreItemIDs = [];
			var truncated = false;
			var adoptivePrefix = "^" + iString.escapeChars(first, "|") + "|";
			while (current) {
				partPath.push(current);
				parentKey = current.parentKey;
				current = parentKey ? nav.lookupByKey[parentKey] : null;
			};
			partPath.reverse();
			// handle the virtual parents
			for (index = 0; (!truncated && (index < partPath.length)); index++) {
				// get the current part
				current = partPath[index];
				
				// get the view name for THIS platform (may be different)
				viewName = (current.viewName?current.viewName[platform]:null);
					
				parentalMode = (current.parentalMode?current.parentalMode[platform]:null);
				if (viewName) {
					// check if we need to obtain an additional store item
					if (current.navStore && current.viewName) {
						// if we need more store item IDs but we don't have 
						// them then we have to break out early
						if (!storeItemIDs || storeItemIDs.length == 0) {
							// we have a mismatch so give up
							console.warn("Too few store item IDs in view ID (" + first
										 + "," + second + ")");
							return null;
						}
						
						// add the next store item ID to the current array
						currentStoreItemIDs.push(storeItemIDs.shift());
					}
					// if we are on the last view or an up-stream container then
					// we need to add that view to the lineage
					if ((index == partPath.length-1) || parentalMode.contains) {
						// this up-stream view is a container for down-stream 
						// views so we need to add it to the lineage
						viewName = this._encodeViewID(viewName, currentStoreItemIDs);
						
						// check if we have a view name and if so add it to array
						viewPath.push(((viewPath.length>0)?adoptivePrefix:"")+viewName);
					}
					
					// chceck if the named view is obscuring downstream views
					if ((index < partPath.length-1) && parentalMode.truncates
						&& (!parentalMode.contains)) {
						// we have an upstream view that truncates navigation
						// but is NOT a container for down-stream views
						// we are masking the down-stream view and this view
						// will be the last
						truncated = true;
					}
				}
			}
			// check for left-over store item IDs
			if (!truncated && (storeItemIDs.length > 0)) {
				console.warn("Too many store item IDs in view ID (" + first
							 + "," + second + ")");
				return null;
				
			} else if (truncated) {
				// return the truncated view path because of missing store item IDs
				viewPath.unshift(first);
				
			} else {
				// join the resolved view path with the remaining parts and return it
				viewPath.unshift(first);
				viewPath = viewPath.concat(parts);
			}
			return {
				id: viewPath.join(","),
				remove: path.remove,
				lineage: viewPath
			};
		}
	});
});
