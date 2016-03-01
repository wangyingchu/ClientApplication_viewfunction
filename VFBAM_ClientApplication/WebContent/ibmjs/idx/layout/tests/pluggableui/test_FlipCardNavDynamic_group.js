define([
	"dojo/_base/lang", // lang.mixin lang.hitch
	"dojo/aspect",
	"dojo/dom", 
	"dojo/data/ItemFileWriteStore",
	"dijit/registry", 
	"idx/layout/FlipCardNavDynamic"
],function( lang, aspect, dom, ItemFileWriteStore, registry, FlipCardNavDynamic ){
	var startLoading = function(){
		
		},
		startup = function(){
			var flipCardNav = new FlipCardNavDynamic({
				// navList: navStore,
				navList: "resources/data/nav_list_group.json",
				navStyle: "tree",
				labelAttr: "title",
				toggleNavBarAction: true,
				toggleNavDetailItemOnHover: true,
				customContent: dom.byId("custom_content")
			}, "flipcardNavNode");
			
			var navActionHandler = function(item, e){
				if(item.id == "welcome"){
					dom.byId("user_content").innerHTML = dom.byId("welcome_content").innerHTML.toString();
				}else{
					dom.byId("user_content").innerHTML = (item.title || item.name) + " Nav Item Selected !";
				}
			}
			var navSettingsActionHandler = function(item, e){
				switch(item.id){
					case "user_add_navitem":
						this.navListModel.addItem({id:"welcome_2", name:"welcome_2", title:"Welcome 2", icon:"resources/images/blank.png", type:"nav"}, 
							null, 1);
						this.navListModel.addItem({id:"monitor_2", name:"monitor_2", title:"Monitor 2", icon:"resources/images/blank.png", type:"nav"}, 
							null, null, {id:"monitor"});
						this.navListModel.addItem({id:"analyze_2", name:"analyze_2", title:"Analyze 2", icon:"resources/images/blank.png", type:"nav"});
						
						alert("Operation Finished");
						
						break;
					
					case "user_update_navitem":
						this.navListModel.updateItem({id:"welcome_2", name:"welcome_2_changed", title:"W2 Changed", icon:"resources/images/blank.png", iconClass:"welcomeIcon", type:"nav"});
						this.navListModel.updateItem({id:"monitor_2", name:"monitor_2_changed", title:"M2 Changed", icon:"resources/images/blank.png", iconClass:"monitorIcon", type:"nav"});
						this.navListModel.updateItem({id:"analyze_2", name:"analyze_2_changed", title:"A2 Changed", icon:"resources/images/blank.png", iconClass:"analyzeIcon", type:"nav"});
						
						alert("Operation Finished");
						
						break;
					
					case "user_delete_navitem":
						this.navListModel.deleteItem("welcome_2");
						this.navListModel.deleteItem("monitor_2");
						this.navListModel.deleteItem("analyze_2");
						
						alert("Operation Finished");
						
						break;
						
					case "advanced_add_navitem":
						this.navListModel.addItem({id:"monitor_dynamic", name:"monitor_dynamic", title:"Dynamic Added Monitor", icon:"resources/images/blank.png", type:"nav"},
							{id:"monitor"}, 2, null, {id:"monitor"});
						this.navListModel.addItem({id:"monitor_dynamic_special", name:"monitor_dynamic_special", title:"Dynamic Added Monitor Special", icon:"resources/images/blank.png", type:"nav"},
							{id:"monitor_special"}, 2, null, {id:"monitor"});
						this.navListModel.addItem({id:"monitor_dynamic_special_3_x", name:"monitor_dynamic_special_3_x", title:"Dynamic Added Monitor Special 3.x", icon:"resources/images/blank.png", type:"nav"},
							{id:"monitor_special_3"}, null, {id:"monitor_special_3_2"}, {id:"monitor"});
						
						this.navListModel.addItem({id:"analyze_dynamic", name:"analyze_dynamic", title:"Dynamic Added Analyze", icon:"resources/images/blank.png", type:"nav"},
							{id:"analyze_2"}, null, null, {id:"analyze"});
						this.navListModel.addItem({id:"analyze_dynamic_detail", name:"analyze_dynamic_detail", title:"Dynamic Added Analyze Detail", icon:"resources/images/blank.png", type:"nav"},
							{id:"analyze_2_2"}, null, null, {id:"analyze"});
							
						alert("Operation Finished");
						//TODO add support for root nav to expando
						
						break;
					
					case "advanced_update_navitem":
						this.navListModel.updateItem({id:"monitor_tasks", name:"monitor_tasks", title:"Task Updated", icon:"resources/images/blank.png", type:"nav"},
							null, null, null, null, {id:"monitor"});
						this.navListModel.updateItem({id:"monitor_ways", name:"monitor_ways", title:"Ways Updated", icon:"resources/images/blank.png", type:"nav"},
							null, null, null, null, {id:"monitor"});
							this.navListModel.updateItem({id:"monitor_common", name:"monitor_common", title:"Common Updated", icon:"resources/images/blank.png", type:"nav"},
							null, null, null, null, {id:"monitor"});
							
						this.navListModel.updateItem({id:"monitor_dynamic", name:"monitor_dynamic", title:"Monitor Updated", icon:"resources/images/blank.png", type:"nav"},
							null, null, null, null, {id:"monitor"});
						this.navListModel.updateItem({id:"monitor_dynamic_special", name:"monitor_dynamic_special", title:"Monitor Special Updated", icon:"resources/images/blank.png", type:"nav"},
							null, null, null, null, {id:"monitor"});
						this.navListModel.updateItem({id:"monitor_dynamic_special_3_x", name:"monitor_dynamic_special_3_x", title:"Monitor Special 3.x Updated", icon:"resources/images/blank.png", type:"nav"},
							null, null, null, null, {id:"monitor"});
							
						alert("Operation Finished");
						
						break;
					
					case "advanced_delete_navitem":
						this.navListModel.deleteItem("monitor_special_3_2_1", {id:"monitor_special_3_2"}, {id:"monitor"});
						this.navListModel.deleteItem("monitor_special_3_1", {id:"monitor_special_3"}, {id:"monitor"});
						this.navListModel.deleteItem("monitor_special_3", {id:"monitor_special"}, {id:"monitor"});
						this.navListModel.deleteItem("monitor_special_2", {id:"monitor_special"}, {id:"monitor"});
						this.navListModel.deleteItem("monitor_special", {id:"monitor"}, {id:"monitor"});
						this.navListModel.deleteItem("monitor_dynamic", {id:"monitor"}, {id:"monitor"});
						
						this.navListModel.deleteItem("analyze_dynamic_detail", {id:"analyze_2_2"}, {id:"analyze"});
						this.navListModel.deleteItem("analyze_dynamic", {id:"analyze_2"}, {id:"analyze"});
						
						alert("Operation Finished");
						
						break;
						
					case "advanced_delete_root":
						// this.navListModel.deleteItem("monitor");
						this.navListModel.addItem({id:"monitor_dynamic", name:"monitor_dynamic", title:"Dynamic Added Monitor", icon:"resources/images/blank.png", type:"nav"},
							{id:"monitor"}, 2, null, {id:"monitor"});
						// this.navListModel.addItem({id:"monitor_dynamic_special", name:"monitor_dynamic_special", title:"Dynamic Added Monitor Special", icon:"resources/images/blank.png", type:"nav"},
							// {id:"monitor_special"}, 2, null, {id:"monitor"});
						
						alert("Operation Finished");
						
						break;
						
					default:
						//TODO
						break;
				}
			}
			var navAllActionHandler = function(item, e){
				console.log(item);
			}
			
			aspect.after(flipCardNav, "handleNavAction_stub", navActionHandler, true);
			aspect.after(flipCardNav, "handleSettingsAction_stub", navSettingsActionHandler, true);
			aspect.after(flipCardNav, "handleAllAction_stub", navAllActionHandler, true);
			
			
			flipCardNav.startup();
		},
		
		bindEvent = function(){
			
		};
	/**
	 * Export some functions to the page 
	 */
	return {
		init: function() {
			startLoading();

			// register callback for when dependencies have loaded
			startup();
			
			bindEvent();

		}
	}
});