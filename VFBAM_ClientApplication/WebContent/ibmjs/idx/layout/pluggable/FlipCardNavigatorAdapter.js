define([
	"dojo/_base/declare", // declare
	"dojo/_base/lang",
    "dojo/topic", // topic.publish()
    "dojo/hash",
    "dojo/dom-class",
	"idx/layout/FlipCardNavigator",
	"idx/layout/FlipCardNavDynamic"
],function( declare, lang, topic, hash, domClass, FlipCardNavigator, FlipCardNavDynamic){

	return declare([], {
		instance: null,
        /**
         * Call back function for Container update content pane
         */
        handleNavigation: null,
		/**
		 * Base constructor for initialize the FlipCardNavagator
		 */
		constructor: function(/*Object*/ params){
			if ( params["navType"] ){

                if ( !params["navExpanderWidth"] ){
                    delete params["navExpanderWidth"];
                }
                else{
                    params["navExpanderWidth"] = parseInt(params["navExpanderWidth"]);
                }
				if ( params["navType"] == "static" ){
					this.instance = new FlipCardNavigator(params);
				}
				else if ( params["navType"] == "dynamic" ){
					this.instance = new FlipCardNavDynamic(params);
				}
                else{
                    this.instance = new FlipCardNavigator(params);
                }
			}
			else{
				this.instance = new FlipCardNavigator(params);
			}
		},
		/**
		 * 
		 */
        destroy: function(){
    	    if (this.hashChangeTopic) {
         		this.hashChangeTopic.remove();
		     }
        },
		/**
		 * 
		 */
		doWithAdapter: function( /*String*/propName, /*Array*/params, /*Boolean*/ bSet ){
			if ( this.instance[propName] ){
				if ( lang.isFunction( this.instance[propName] ) ){
					return this.instance[propName].apply( this.instance, params );
				}
				else {
                    if ( bSet == true){
                        this.instance[propName] = params[0];
                    }
                    else
					    return this.instance[propName];
				}
			}
			else{
				console.log("No Function Found");
			}
			
		},

        /**
         * Base function for hash location for different FlipCardNavigator
         */
        initHashNavigator: function( handleNavigation ){
        	var self = this;
            this.handleNavigation = handleNavigation;
            this.hashChangeTopic = topic.subscribe("/dojo/hashchange", 
            	function( changedHash, isInit ){
            		self.locateHash(changedHash, isInit);
            	}
            );

            var initItemId = this.instance.initItemId;
            this.initExecItemId = this.instance.ignoreInitHash ? initItemId : (hash() || initItemId);

            this.locateHash(this.initExecItemId, true);
        },

        /**
         * locate the page by hash value.
         * @param changedHash
         * @param isInit
         */
        locateHash: function(changedHash, isInit){
            var navRootItem = {},
                selectedNavItemId = this.instance.selectedNavItemId,
                navListModel = this.instance.navListModel,
                initItemId = this.instance.initItemId,
                idProperty = this.instance.idProperty;
            if ( !this.instance.isNavigationFinished() )
            	return;

            navRootItem[idProperty] = selectedNavItemId;
            if ( !navListModel )
                return;
            var currentNavItem = navListModel.getItem(changedHash || initItemId, navRootItem);

            //for init handler: second level item
            if(!currentNavItem){
                //assume sync currently
                navListModel.getRootChildren(lang.hitch(this, function(items){
                    for(var i = 0; i < items.length; i++){
                        navRootItem[idProperty] = items[i][idProperty];
                        currentNavItem = navListModel.getItem(changedHash || initItemId, navRootItem);
                        if(currentNavItem){
                            break;
                        }
                    }
                }), lang.hitch(this, function(error){
                    console.log(error);
                }), true);
            }

            //check for currentNavItem
            if(!currentNavItem){
                console.log("this._nlsResources.noSuchPage");
                return;
            }

            var typeAttr = this.typeAttr,
                childrenAttr = this.childrenAttr;
            if(currentNavItem[typeAttr] == "settings" && !currentNavItem[childrenAttr]){
                console.log(this._nlsResources.settingsPage);
                // return;
            }

            this.instance.handleNavigationDstrProcess( currentNavItem, null);

        },

        /**
         *
         * @param item
         * @param e
         */
        customSettingsHandler: function(item, e){
            var instance = this.instance;
            var crntItem = instance.get("currentNavItem");
            if( crntItem && crntItem[instance.idProperty] != item[instance.idProperty] ){
                this.handleNavigation(item, e);
            }else{

                var pressHandlerAttr = instance.pressHandlerAttr,
                    expandoNode = instance.expandoNode;
                if(item[pressHandlerAttr] && lang.isFunction(item[pressHandlerAttr])){
                    item[pressHandlerAttr].apply(this, arguments);
                }
                if(expandoNode && expandoNode._showing){
                    expandoNode.toggle();
                }
               instance.handleSettingsAction(item, e);
            }
        },
        /**
         *
         * @param navItemProps
         * @returns {string}
         */
        addNavItem: function( navItemProps ){
            var navListModel = this.instance.navListModel,
                key = "";
            if( navListModel ){
                if(lang.isObject(navItemProps)){
                    navListModel.addItem(
                        navItemProps.item,
                        navItemProps.parent,
                        navItemProps.insertIndex,
                        navItemProps.before,
                        navItemProps.rootNavItem
                    );
                    key = navListModel.getIdentity(navItemProps.item);
                }
            }
            return key;
        }
    });
});