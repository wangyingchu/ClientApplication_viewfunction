define([
    "dojo/_base/lang",
    "dojo/dom-class"
], function( lang, domClass ){
	return {
		//
		// The is a stub function from FlipCardContainer, use the lang hitch to change the this to be the instance of FlipCardContainer
		//
		onNavigationChanged: null,
		//
		// The function is to check the animation for page changed finished
		// For stand along Navigation, always return true
		//
		isNavigationFinished: function(){
			return true;
		},
		/**
         * first menu item:
         * secondary menu item: flipCardNavigationMenuItem
         *
         * @param model
         */
        changeMenuItemSelectionView: function(model){
		    //
			// To do the selection in the subclass
			//
		},
		/**
		 * 
		 */
		handleNavigationDistributeById: function(itemId, evt, args){
			if ( this.isNavigationFinished() ){
				var navRootItem = {};
				navRootItem[this.idProperty] = this.selectedNavItemId;
				
			    var currentItem = ((args&&args.model)||this.navListModel)["getItem"](itemId || this.initItemId, navRootItem);
			    this.handleNavigationDistribute(currentItem, evt);
			}
			
        },
		/**
		 * 
		 */
		handleNavigationDistribute: function(item, evt, args){
		    if(item){
    		    if(this.customDistribute && lang.isFunction(this.customDistribute)){
    		        this.customDistribute.apply(this, arguments);
    		        //remember to call these setting in custom method
    		    }else{
    		        this.handleNavigationDstrProcess(item, evt, args);
    		    }
		    }
		    // this.toggleNavBarExtend(false);
		},
		/**
		 * 
		 */
		handleNavigationDstrProcessById: function(itemId, evt, args){
			var navRootItem = {};
			navRootItem[this.idProperty] = this.selectedNavItemId;
			
		    var currentItem = ((args&&args.model)||this.navListModel)["getItem"](itemId || this.initItemId, navRootItem);
            this.handleNavigationDstrProcess(currentItem, evt);
		},
		
 
		/**
		 * 
		 */
		doPageNavAction: function( item, evt, args ){
			if(item["custom"]){
        		this.handleCustomAction(item, evt);
        	}
        	else{
        		
        		var crntItem = this.get("currentNavItem");
        		if(crntItem && crntItem[this.idProperty] == item[this.idProperty]){
				    return;
				}
        		
        		if ( !item.children && this.onNavigationChanged ) {
					//
					// Call the function from NavigationMixin for FlipCard Container
        			// this method is for the FlipCard Container has initialized 
					//
				    this.onNavigationChanged(item, evt);
				}
        		else{
					//
					// Call the function for pressHandlerAttr
        			// this method is for stand alone FlipCard Navigator
					//
                    if(item[this.pressHandlerAttr] && lang.isFunction(item[this.pressHandlerAttr])){
                        item[this.pressHandlerAttr].apply(this, arguments);
                    }
        		}
                this.handleNavAction(item, evt);
        	}
		},
		/**
		 * 
		 */
		doSettingsNavAction: function( item, evt, args ){
			if(item["custom"]){
        		this.handleCustomAction(item, evt);
        	}
        	else{
                if(args && args.customSettingsHandler && lang.isFunction(args.customSettingsHandler)){
                    args.customSettingsHandler.apply(this, arguments);
                }
                else{
                    if(item[this.pressHandlerAttr] && lang.isFunction(item[this.pressHandlerAttr])){
                        item[this.pressHandlerAttr].apply(this, arguments);
                    }
                }
                this.handleSettingsAction(item, evt);
            }
		},
		/**
		 * 
		 */
		doSeparatorNavAction: function( item, evt ){
			if(item["custom"]){
        		this.handleCustomAction(item, evt);
        	}
        	else{
        		this.handleSeparatorAction(item, evt);
        	}
		},
		/**
		 * 
		 */
		doExpandoNavAction: function( item, evt, args ){
			if(this.navListModel.isRootLevelItem(item) && item[this.childrenAttr]){
        		if(args 
        			&& args.customExpandoHandler 
        			&& lang.isFunction(args.customExpandoHandler)){
                    args.customExpandoHandler.apply(this, arguments);
                }
        		else{
                    this.handleNavigationExpando(item, evt);
                }
                this.handleExpandoAction(item, evt, {node:this.expandoNode});
            }
            else{
                if(this.expandoNode && this.expandoNode._showing && item[this.typeAttr] != "separator"){
                    this.expandoNode[this.defaultNavToggleMethod]();
                }
            }
		},
		/**
		 * 
		 */
		handleNavigationDstrProcess: function(item, evt, args){
		    if(item){
		    	this.doExpandoNavAction( item, evt, args);
		    	switch ( item[this.typeAttr] ){
		    		case "nav":
		    			this.doPageNavAction( item ,evt, args );
		    			break;
		    		case "settings":
		    			this.doSettingsNavAction( item ,evt, args );
		    			break;
		    		case "separator":
		    			this.doSeparatorNavAction( item, evt, args );
		    			break;
		    		default:
		    			break;
		    	}

            }
		    else{
                console.log(this.navTitle);
            }
		    
            //
            // Set the Selected Style when the navigation item changed
            //
            this.setSelectedItem( item );
		},
		
        /**
         * 
         */
        setSelectedItem: function( currentNavItem ){
            var idProperty = this.idProperty,
        		currNavItemId = currentNavItem[idProperty];
            
        	if ( currentNavItem.children && currentNavItem.children.length > 0 ){
        		return;
        	}

            this.selectedNavItemId = currNavItemId;
            this.changeMenuItemSelectionView();
        },
        /**
         * Remove the style for all the root nav item in the side bar 
         * before the navigation changed
         */
        resetRootItemView: function(){
            var nlNodes = this.navListNodes;
	    	for(var id in nlNodes){
				domClass.remove(nlNodes[id], "navItemSelected");
				domClass.remove(nlNodes[id], "navItemViewed");
			}
        },
		
				
		//for actions
		handleNavAction: function(item, evt){
			//TODO
			this.handleNavAction_stub(item, evt);
			this.handleAllAction_stub(item, evt);
		},
		//stub function to be connected
		handleNavAction_stub: function(item, evt){
			//TODO
		},
		handleSettingsAction: function(item, evt){
			//TODO
			
			this.handleSettingsAction_stub(item, evt);
			this.handleAllAction_stub(item, evt);
		},
		//stub function to be connected
		handleSettingsAction_stub: function(item, evt){
			//TODO
		},
		//stub function to be connected
		handleAllAction_stub: function(item, evt){
			//TODO
		},
		
		
		handleSeparatorAction: function(item, evt){
			//TODO
			this.handleSeparatorAction_stub(item, evt);
		},
		handleSeparatorAction_stub: function(){
			//TODO
		},
		handleCustomAction: function(item, evt){
			//TODO
			this.handleCustomAction_stub(item, evt);
		},
		handleCustomAction_stub: function(){
			//TODO
		}
	}
});