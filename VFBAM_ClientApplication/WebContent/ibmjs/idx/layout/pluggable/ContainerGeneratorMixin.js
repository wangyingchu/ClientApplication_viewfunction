define([
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/aspect",
	"idx/layout/FlipCardGridContainer",
	"./_ContainerContentPane",
	"./_FlipCardFeatureDetector"
], function( lang, domClass, domStyle, aspect, FlipCardGridContainer, _ContainerContentPane ){
	return {
		/**
		 * 
		 */
		createGridContainer: function( key, item ){
			var gridProps = lang.mixin({}, {
				containerId: key,
				containerName: item.name,
				containerTitle: item.title,
				containerType: "grid",
				items: item.items,
				relations: item.relations,
				rootContainer: this,
				nbZones: 3,
				minColWidth: 50,
				minChildWidth: 50,
				isAutoOrganized: true,
				hasResizableColumns: false,
				liveResizeColumns: false,
				css3AnimationDisabled: this.css3AnimationDisabled_container,
				// dragHandleClass:"dojoxPortletTitle",
				acceptTypes: ["Portlet", "ContentPane"],
				editDisabled: (this.model == "view"),
                sizeReferenceNode: this.containerNode.domNode
			}, item.props);
			var cntContainer = new FlipCardGridContainer(gridProps);
			aspect.after(cntContainer, "startup",function(){
                //
                // initialize the css feature after startup
                //
				domStyle.set(cntContainer.domNode, "display", "none");
            });
			
			return cntContainer;
		},
		/**
		 * 
		 */
		createPaneContainer: function( key, item ){
			var paneProps = lang.mixin({}, {
				containerId: key,
				containerName: item.name,
				containerTitle: item.title,
				containerType: "pane",
				rootContainer: this,
				css3AnimationDisabled: this.css3AnimationDisabled_container,
				executeScripts: true,
				scriptHasHooks: true
			}, item.props);
			var cntContainer = new _ContainerContentPane(paneProps);

            aspect.after(cntContainer,"startup", function(){
                //
                // initialize the css feature after startup
                //
                domClass.add(cntContainer.domNode, "centerPaneContainer centerGridContainer borderBox");
                if(_supportCSS3Animation){
                    domClass.add(cntContainer.domNode, "css3Animations");
                }

                domStyle.set(cntContainer.domNode, "display", "none");
            });

            return cntContainer;
		},
		/**
		 * 
		 */
		addCntContainer: function(key, item, cntType, forceOverride){
			if(!key || !this.fcContentContainers)
				return;
			
			if(this.fcContentContainers[key]){
				if(forceOverride){
					this.removeCntContainer(key);
				}
				else{
					return;
				}
			}

			var cntContainer = null;
			cntType = cntType || this.defaultCntContainerType;
			if(cntType == "grid"){
				cntContainer = this.createGridContainer( key, item );
			}
			else{ //default is "pane"
				cntContainer = this.createPaneContainer( key, item );
			}
			
			this.fcContentItems[key] = item;
			
			// cntContainer.startup();
			return this.fcContentContainers[key] = cntContainer;
		}
	}
});