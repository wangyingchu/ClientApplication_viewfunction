/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/dom-class",
	"./_FlipCardUtils"
], function(domClass, _FlipCardUtils){
	// module:
	//		idx/layout/pluggable/AnimationOnOffMixin
	// summary:
	//		The animation controll on/off logic, can only be used as a mixin
	
	return {
		css3AnimationDisabled_nav: false,
		css3AnimationDisabled_container: false,
		css3AnimationDisabled_card: false,
		css3AnimationDisabled: false,
		/**
		 * 
		 */
		toggleCSS3Animation: function(forceDisable){
			if(forceDisable !== undefined){
				this.css3AnimationDisabled = forceDisable ? true : false;
			}
			else{
				this.css3AnimationDisabled = !this.css3AnimationDisabled;
			}
			
			if(this.css3AnimationDisabled){
				domClass.add(this.domNode, "css3AnimationsDisabled");
				this.animationDuration = 1;
			}
			else{
				domClass.remove(this.domNode, "css3AnimationsDisabled");
				this.animationDuration = this.animationDurationHeritage;
			}
			
			this.toggleCSS3Animation_nav(this.css3AnimationDisabled);
			this.toggleCSS3Animation_container(this.css3AnimationDisabled);
			this.toggleCSS3Animation_card(this.css3AnimationDisabled);
		},

		/**
		 * 
		 */
		toggleCSS3Animation_container: function(forceDisable){
			if(forceDisable !== undefined){
				this.css3AnimationDisabled_container = forceDisable ? true : false;
			}
			else{
				this.css3AnimationDisabled_container = !this.css3AnimationDisabled_container;
			}
			
			if(this.fcContentContainers && !_FlipCardUtils.isObjectEmpty(this.fcContentContainers)){
				for(var gKey in this.fcContentContainers){
					var gWidget = this.fcContentContainers[gKey];
					gWidget.toggleCSS3Animation(this.css3AnimationDisabled_container);
				}
			}
		},
		/**
		 * 
		 */
		toggleCSS3Animation_card: function(forceDisable){
			if(forceDisable !== undefined){
				this.css3AnimationDisabled_card = forceDisable ? true : false;
			}
			else{
				this.css3AnimationDisabled_card = !this.css3AnimationDisabled_card;
			}
			
			if(this.fcContentContainers && !_FlipCardUtils.isObjectEmpty(this.fcContentContainers)){
				for(var gKey in this.fcContentContainers){
					var gWidget = this.fcContentContainers[gKey];
					if(gWidget.childItemMaps && !_FlipCardUtils.isObjectEmpty(gWidget.childItemMaps)){
						for(var itemName in gWidget.childItemMaps){
							var cardWidget = gWidget.childItemMaps[itemName];
							cardWidget.toggleCSS3Animation(this.css3AnimationDisabled_card);
						}
					}
				}
			}
		},
		/**
		 * 
		 */
		toggleCSS3Animation_nav: function(forceDisable){
			if(forceDisable !== undefined){
				this.css3AnimationDisabled_nav = forceDisable ? true : false;
			}else{
				this.css3AnimationDisabled_nav = !this.css3AnimationDisabled_nav;
			}
			
			if(this.navigatorAdapter ){
				this.navigatorAdapter.doWithAdapter( "toggleCSS3Animation", [this.css3AnimationDisabled_nav] );
			}
		}
	}
});