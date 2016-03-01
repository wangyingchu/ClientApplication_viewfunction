define([
    "dojo/_base/lang",
    "dojo/_base/sniff",
    "dojo/dom-class",
    "dojo/when",
    "dojo/_base/json"
], function( lang, has, domClass, when, baseJson ){
	/**
	 * 
	 */
	return {
		/**
		 * 
		 */
		lazyLoading: false,
		/**
		 * 
		 */
		lazyPaneFunction: null,
		/**
		 * 
		 */
		lazyGridFunction: null,
		/**
		 * 
		 */
		doLazyLoadPane: function( item ){
			if(lang.isFunction(this.lazyPaneFunction)){
				var key = item[this.idProperty];
				when(this.lazyPaneFunction(item), lang.hitch(this, function(data){
					if(data){
						var contentData = baseJson.fromJson(data);
						cntItem = lang.mixin({}, {
							name:key, 
							title:key,
							type:"pane"
						}, contentData);
						cntItem.props.preload = true;
						var paneContainer = this.addCntContainer(key, cntItem, "pane", true);
						this.containerNode.addChild(paneContainer);

                        domClass.remove(paneContainer.domNode, "centerGridFlipOut");
						domClass.add(paneContainer.domNode, "centerGridFlipIn");
					}
				}), lang.hitch(this, function(error){
					console.log(error);
				}));
			}
		},
		/**
		 * 
		 */
		doLazyLoadGrid: function( item ){
			if(lang.isFunction(this.lazyGridFunction)){
				var key = item[this.idProperty];
				when(this.lazyGridFunction(item), lang.hitch(this, function(data){
					if(data){
						var contentData = baseJson.fromJson(data);
						cntItem = lang.mixin({}, {
							name:key, 
							title:key, 
							props: {nbZones: 3}, 
							items:[]
						}, contentData);
						if(has("phone")){
							cntItem.props.nbZones = 1;
							cntItem.props.editDisabled = true;
						}

						var gridContainer = this.addCntContainer(key, cntItem, "grid", true);
						this.containerNode.addChild(gridContainer);

                        domClass.add(gridContainer.domNode, "centerGridFlipOut");
						domClass.add(gridContainer.domNode, "centerGridFlipIn");

					}
				}), lang.hitch(this, function(error){
					console.log(error);
				}));
			}
		},
		/**
		 * 
		 */
		doLazyLoading: function( item ){

			//page not exist
			if( !this.checkExist( item ) ){
				var key = item[this.idProperty];
				var cntItem = this.contentContainerList[key];
				// content pane exist
				if(cntItem){
					if(cntItem.type == "pane"){
						cntItem.props.preload = true;
						var paneContainer = this.addCntContainer(key, cntItem, "pane");
						this.containerNode.addChild(paneContainer);
					}
                    else{
                        //default is type="grid"
						if(has("phone")){
							cntItem.props.nbZones = 1;
							cntItem.props.editDisabled = true;
						}
						var gridContainer = this.addCntContainer(key, cntItem, "grid");
						this.containerNode.addChild(gridContainer);
					}
				}
                else{ 
                	// build default pane
                	this.buildDefaultCntContainer(key, {}, this.defaultCntContainerType);
					//lazy load rewrite
                	this.doLazyLoadPane( item );
                	this.doLazyLoadGrid( item );
				}
			}
			else{
				//TODO
			}
		},

		checkExist: function( item ){
			return (
				this.fcContentContainers && 
				this.fcContentContainers[item[this.idProperty]]
			);
			
		},
		/**
		 * 
		 */
		handleNavigation: function(item, e){

			if( this.isInAnimation() ){
				return;
			}
			if( !item ){
				return;
			}
			this.animating = true;
            var expandoNode = this.navigatorAdapter.doWithAdapter("expandoNode");
			if(expandoNode._showing){
                expandoNode.toggle();
			}
			//handle lazy loading stuff
			if( this.lazyLoading ){
				this.doLazyLoading( item );
			}
			
			//page not exist after lazyLoading
			if( !this.checkExist(item) ){
				return;
			}

			// current item to be flip away
			var crntItem = this.navigatorAdapter.doWithAdapter("get", ["currentNavItem"]),
				disabled = this.css3AnimationDisabled || this.css3AnimationDisabled_nav;
			this.doFlip( crntItem, item, disabled );
		}
	}
});