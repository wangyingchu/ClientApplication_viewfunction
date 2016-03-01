/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/lang",
    "dojo/_base/connect",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dijit/registry",
    "dojox/fx/flip",
    "../_FlipCardUtils",
    "../_FlipCardFeatureDetector",
    "../TransitionUtil"
], function( lang, connect, domClass, domConstruct, domStyle, registry, flip, _FlipCardUtils, _FlipCardFeatureDetector, TransitionUtil){
	
	var defaultAnimationConfig = {
		duration: 1500,
		onAfterEnd: function(){

		},
		beforeStart: function(){
			
		},
		beforeClear: function(){
			
		}
	};
    /**
     * This function can not be used independently, as a function call for FlipCardContainer
     */
    return {
    	animationType: "flip",
    	
    	
    	animateMutex: 0,        
        
        /**
         * Check the Flip Animation finished or not
         */
        isInAnimation: function(){
        	return (this.animateMutex !== 0);
        },
        /**
         * @param outItem the data structure for the navigation which will be hidden in the next step
         * @param inItem the data structure for the navigation which will be showed in the next step
         */
        changeItemState: function( outItem, inItem ){
        	var outItemNode = null,
				inItemNode = null;
        	if(!_FlipCardUtils.isObjectEmpty(outItem)){
                var crntGrid = this.fcContentContainers[outItem[this.idProperty]];
                if(crntGrid){
                    outItemNode = crntGrid.domNode;
                	domStyle.set(outItemNode, {
                		"opacity": 1,
                   	 	"zIndex" : 100
                    });
                }
            }
            // new current item to be flip in
            this.navigatorAdapter.doWithAdapter("set", ["currentNavItem", inItem]);
            
        	var gContainer = this.fcContentContainers[inItem[this.idProperty]];
            if( gContainer ){
            	inItemNode = gContainer.domNode;
                var gItem = this.fcContentItems[inItem[this.idProperty]];
                gContainer.startup();
                this.showContentPane(gItem, gContainer);
                this.currentCntContainer = gContainer;
            	domStyle.set( inItemNode, {
            		"opacity": 1,
               	 	"zIndex" : 100
                });
            }
            for(var gItemId in this.fcContentContainers){
            	var gridItemWidget = this.fcContentContainers[gItemId];
            	if(gridItemWidget.domNode == inItemNode || gridItemWidget.domNode == outItemNode){
            		domStyle.set(gridItemWidget.domNode, {
						"display": "",
						"zIndex" : 0
					});
            	}
            	else{
            		domStyle.set(gridItemWidget.domNode, {
						"display": "none",
						"zIndex" : 0
					});
        		}
        	}
        	return {
        		"out": outItemNode,
        		"in": inItemNode
        	}
        },
        
        /**
         * @param outNode
         * @param inNode
         */
        doFlipNotCss3: function( outNode, inNode  ){
            var inWidget, outWidget;

        	if ( outNode ){
                outWidget = registry.byNode(outNode);

        		domStyle.set(outNode, {
					"display": "none",
					"zIndex" : 0
				});

                if (outWidget && outWidget.onHide)
                    outWidget.onHide();
        	}
        	
        	if ( inNode ){
    			var inWidget = registry.byNode( inNode );
    			if (inWidget && inWidget.resize)
    				inWidget.resize();
                if (inWidget && inWidget.onShow)
                    inWidget.onShow();
        	}
        },
        /**
         * 
         */
        doFlipCss3: function( transition, outNode, inNode ){
        	
        	var flipTransArray = [], self = this,
                inWidget, outWidget;

        	if ( outNode ){
                outWidget = registry.byNode(outNode);
        		var animationConfig = lang.mixin( defaultAnimationConfig, {
        			"in": false,
        			onAfterEnd: function(){
            			if (self.animateMutex > 0 ){
            				self.animateMutex--;
            			}
                        if (outWidget && outWidget.onHide)
                            outWidget.onHide();
            			console.log("flip out trans finished");
            		}
        		});
        		var outTrans = transition( outNode, animationConfig );
        		flipTransArray.push( outTrans );
        	}

        	if ( inNode ){
        		var animationConfig = lang.mixin( defaultAnimationConfig, {
        			"in": true,
        			onAfterEnd: function(){
            			if (self.animateMutex > 0 ){
            				self.animateMutex--;
            			}
            			//
            			// Temporary Solve the size change between the different FlipCard Container Flip Process( hide and show )
            			//
            			var inWidget = registry.byNode( this.node );
            			if (inWidget && inWidget.resize)
            				inWidget.resize();
                        if (inWidget && inWidget.onShow)
                            inWidget.onShow();
            		}
        		});
        		var inTrans = transition( inNode, animationConfig );

            	flipTransArray.push(inTrans);
        	}
        	
        	this.animateMutex = flipTransArray.length;
        	TransitionUtil.groupedPlay(flipTransArray);
        },
        /**
         * 
         */
        doSlipCss3: function( transition, outNode, inNode ){
        	var flipTransArray = [], self = this;
        	if ( inNode ){
        		var animationConfig = lang.mixin( defaultAnimationConfig, {
        			"in": true,
        			onAfterEnd: function(){
        				if ( outNode ){
            				domStyle.set( outNode, {
            					"zIndex": 0,
            					"display": "none"
            				});
        				}

        			if (self.animateMutex > 0 ){
        				self.animateMutex--;
        			}
        			//
        			// Temporary Solve the size change between the different FlipCard Container Flip Process( hide and show )
        			//
        			var inWidget = registry.byNode( this.node );
        			if (inWidget && inWidget.resize) {
        				inWidget.resize();
                    }
                    if (inWidget && inWidget.onShow) {
                        inWidget.onShow();
                    }
        		}
        		});
        		var inTrans = transition( inNode, animationConfig );

            	flipTransArray.push(inTrans);
        	}
        	
        	this.animateMutex = flipTransArray.length;
        	
        	
        	if ( inNode ){
				domStyle.set( inNode, {
					"zIndex": 1
				});
			}

        	TransitionUtil.groupedPlay(flipTransArray);

        	
        },
        /**
         * @param outNode
         * @param inNode
         */
        doTranslateCss3: function( outNode, inNode ){

        	var transition = TransitionUtil.flip;
        	
        	if ( this.animationType == "slip" )
        		this.doSlipCss3( TransitionUtil.slip, outNode, inNode );
        	else 
        		this.doFlipCss3( TransitionUtil.flip, outNode, inNode );
        	
        	
            this.animating = false;
        },
        /**
         * @param fcContainerWidget
         * @param inItem this item will become the displayed item after transition
         * @param outItem  this item should be invisible after transition
         */
        doFlip: function( outItem, inItem, disabled ){
        	if ( this.isInAnimation() )
        		return;
        	var nodePair = this.changeItemState(outItem, inItem);
        	if ( !_supportCSS3Animation || disabled){
        		this.doFlipNotCss3( nodePair["out"], nodePair["in"] );
        	}
        	else{
        		this.doTranslateCss3( nodePair["out"], nodePair["in"] );
        	}
        }
    }
})