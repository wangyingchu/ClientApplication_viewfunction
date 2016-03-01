/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dijit/Tree",
	"dijit/_WidgetsInTemplateMixin",
	"idx/form/TriStateCheckBox",
	"./checkboxtree/_dndSelector",
	"./_CheckBoxTreeNode"
], function(declare, array, lang, Tree, _WidgetsInTemplateMixin, TriStateCheckBox, _dndSelector, _CheckBoxTreeNode){
	var oneuiRoot = lang.getObject("idx.oneui", true); // for backward compatibility with IDX 1.2

	/**
	 * @name idx.widget.CheckBoxTree
	 * @class idx.widget.CheckBoxTree extended dijit.Tree with indirect selection. It supports both
	 * dijit.ForestStoreModel and dijit.TreeStoreModel. The check states of the checkboxes is implemented
	 * according to IBM One UI(tm) <b><a href="http://dleadp.torolab.ibm.com/uxd/uxd_oneui.jsp?site=ibmoneui&top=x1&left=y6&vsub=*&hsub=*&openpanes=0100110000">Check Boxes Standard</a></b>
	 * In addtion, DND feature is avaible for both standard CheckBoxTree and Forest CheckBoxTree .
	 * Note: DND feature is not compliant with server side store such as JSON REST store.<br>
	 * <br>
	 * <b>Example: CheckBoxTree with dijit.tree.TreeStoreModel & DnD feature off</b>
	 * <pre>
	 * &lt;div data-dojo-id="continentStore" data-dojo-type="dojo.data.ItemFileWriteStore" data-dojo-props='url:"_data/countries.json"'>&lt;/div>
	 * &lt;div data-dojo-id="continentModel" data-dojo-type="dijit.tree.TreeStoreModel" data-dojo-props='store:continentStore, query:{id:"ROOT"}, rootId:"continentRoot", rootLabel:"Continents", childrenAttrs:["children"]'>&lt;/div>
	 * &lt;div id="mytree" data-dojo-type="idx.widget.CheckBoxTree" data-dojo-props='model:continentModel, autoExpand:true, openOnClick:true, onLoad:function(){ console.log("loaded mytree (first tree)"); }'>
	 * </pre>
	 * <b>Example: CheckBoxTree with DnD feature on</b>
	 * <pre>
	 * &lt;div data-dojo-id="continentStore" data-dojo-type="dojo.data.ItemFileWriteStore" data-dojo-props='url:"_data/countries.json"'>&lt;/div>
	 * &lt;div data-dojo-id="continentModel" data-dojo-type="dijit.tree.TreeStoreModel" data-dojo-props='store:continentStore, query:{id:"ROOT"}, rootId:"continentRoot", rootLabel:"Continents", childrenAttrs:["children"]'>&lt;/div>
	 * &lt;div id="mytree" data-dojo-type="idx.widget.CheckBoxTree" data-dojo-props='model:continentModel, autoExpand:true, openOnClick:true, dragThreshold:8, betweenThreshold:5, dndController: "idx.widget.checkboxtree.dndSource", onLoad:function(){ console.log("loaded mytree (first tree)"); }'>&lt;/div>
	 * </pre>
	 * @augments dijit.Tree
	 */
	return oneuiRoot.CheckBoxTree = declare("idx.widget.CheckBoxTree", [Tree],
	/**@lends idx.widget.CheckBoxTree.prototype*/
	{
		// summary: extended tree with check boxes
		baseClass: "idxCheckBoxTree",
		
		dndController: _dndSelector,
		
		openOnClick: false,
		
		_itemStatus: null,
		
		postMixInProperties: function(){
			this.inherited(arguments);
			this._itemStatus = {};
		},
		
		_createTreeNode: function(/*Object*/ args){
			// summary:
			//		creates a TreeNode
			// description:
			//		Developers can override this method to define their own TreeNode class;
			//		However it will probably be removed in a future release in favor of a way
			//		of just specifying a widget for the label, rather than one that contains
			//		the children too.
			return new _CheckBoxTreeNode(args);
		},
		
		/**
		 * Toggle the checkbox of the given tree node.
		 * @param {String|oneui._TreeNode} item
		 * @param {Boolean|String} checked
		 */
		toggleNode: function(/*String|oneui._TreeNode*/ item, /*Boolean|String*/ checked){
			if(lang.isString(item)){
				var nodes = this.getNodesByItem(item);
				item = nodes && nodes[0] ? nodes[0] : undefined;
			}
			if(item){
				if(checked == undefined){
					checked = !item.checkboxNode.get("checked");
				}
				if(array.indexOf(item.checkboxNode.states, checked) >= 0){
					item.updateState(checked);
				}
			}
		},
		
		_onNodeStateChange: function(/*oneui._TreeNode*/ node, /*Boolean*/ checked){
			// summary:
			//		Called when select/unselect a node,
			//		this is monitored by the DND code
			this.onNodeStateChange(/*oneui._TreeNode*/ node, /*Boolean*/ checked);
		},
		
		/**
		 * Event triggered when the state of a node changed.
		 * @param {oneui._TreeNode} node
		 * @param {Boolean} checked
		 */
		onNodeStateChange: function(/*oneui._TreeNode*/ node, /*Boolean*/ checked){
			// summary:
			//		Callback function when the state of a node changed.
		},
		
		_onEnterKey: function(/*Object*/ message){
			this._publish("execute", { item: message.item, node: message.node } );
			this.dndController.userSelect(message.node, true, false);
			this.onClick(message.item, message.node, message.evt);
		},
		
		_onItemChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
			// summary:
			//		Processes notification of a change to an item's children
			var model = this.model,
				identity = model.getIdentity(parent),
				parentNodes = this._itemNodesMap[identity];
			
			if(parentNodes){
				array.forEach(parentNodes,function(parentNode){
					parentNode.setChildItems(newChildrenList);
					parentNode.update();
					parentNode.updateParent();
				});
			}
		},
		
		_expandNode: function(/*_TreeNode*/ node, /*Boolean?*/ recursive){
			// summary:
			//		Called when the user has requested to expand the node
			// recursive:
			//		Internal flag used when _expandNode() calls itself, don't set.
			// returns:
			//		Deferred that fires when the node is loaded and opened and (if persist=true) all it's descendants
			//		that were previously opened too
			
			if(node._expandNodeDeferred && !recursive){
				// there's already an expand in progress (or completed), so just return
				return node._expandNodeDeferred;	// dojo.Deferred
			}
			
			var model = this.model,
				item = node.item,
				_this = this;
			
			switch(node.state){
				case "UNCHECKED":
					// need to load all the children, and then expand
					node.markProcessing();
					
					// Setup deferred to signal when the load and expand are finished.
					// Save that deferred in this._expandDeferred as a flag that operation is in progress.
					var def = (node._expandNodeDeferred = new dojo.Deferred());
					var nodeState = node.checkboxNode.get("checked");
					// Get the children
					model.getChildren(
						item,
						function(items){
							node.unmarkProcessing();
							
							// Display the children and also start expanding any children that were previously expanded
							// (if this.persist == true).   The returned Deferred will fire when those expansions finish.
							var scid = node.setChildItems(items);
							scid.addCallback(function(){
								node.updateState(nodeState);
							});
							// Call _expandNode() again but this time it will just to do the animation (default branch).
							// The returned Deferred will fire when the animation completes.
							// TODO: seems like I can avoid recursion and just use a deferred to sequence the events?
							var ed = _this._expandNode(node, true);
							
							// After the above two tasks (setChildItems() and recursive _expandNode()) finish,
							// signal that I am done.
							scid.addCallback(function(){
								ed.addCallback(function(){
									def.callback();
								})
							});
						},
						function(err){
							console.error(_this, ": error loading root children: ", err);
						}
					);
					break;
					
				default:	// "LOADED"
					// data is already loaded; just expand node
					def = (node._expandNodeDeferred = node.expand());
					
					this.onOpen(node.item, node);
					
					this._state(node, true);
			}
			return def;	// dojo.Deferred
		},
		
		_onEnterKey: function(/*Object*/ message){
			/**
			 * Overwrite dijit.Tree._onEnterKey to handle enter, space key.
			 */
			message.node.checkboxNode.click();
			var checked = message.node.checkboxNode.get("checked");
			message.node.updateState(checked);
		},
		
		getSelectedItems: function(){
			var result = [];
			for(var id in this._itemStatus){
				if(this._itemStatus[id] === true){
					result.push(id);
				}
			}
			return result;
		}
	});
});