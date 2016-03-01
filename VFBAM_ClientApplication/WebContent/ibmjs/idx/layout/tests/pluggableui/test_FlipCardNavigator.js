define([
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dojo/aspect",
	"dojo/dom", 
	"dojo/dom-style",
	"dijit/registry", 
	"idx/layout/FlipCardNavigator"
],function( lang, aspect, dom, domStyle, registry, FlipCardNavigator ){
	var startup = function(){
			var flipCardNav = new FlipCardNavigator({
				// navList: navigationParams,
				navList: "resources/data/nav_list_static.json",
				labelAttr: "title",
				customContent: dom.byId("custom_content")
			}, "flipcardNavNode");
			
			domStyle.set(flipCardNav.domNode, "paddingTop", "0px");
			
			var navActionHandler = function(item, e){
				if(item.id == "welcome"){
					dom.byId("user_content").innerHTML = dom.byId("welcome_content").innerHTML.toString();
				}else{
					dom.byId("user_content").innerHTML = (item.title || item.name) + " Nav Item Selected !";
				}
			}
			var navAllActionHandler = function(item, e){
				console.log(item);
			}
			aspect.after(flipCardNav, "handleNavAction_stub", navActionHandler, true);
			aspect.after(flipCardNav, "handleAllAction_stub", navAllActionHandler, true);
			
			flipCardNav.startup();
		};
		/**
		 * Export some functions to the page 
		 */
		return {
			init: function() {
				// register callback for when dependencies have loaded
				startup();
			}
		}
})