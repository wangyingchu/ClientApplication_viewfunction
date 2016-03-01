define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/event",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-geometry",
	"dojo/query",
	"dojo/touch",
	"dojo/on",
	"dojo/keys",
	"dijit/focus",
	"dijit/a11y",
	"gridx/core/_Module"
], function(kernel, declare, lang, array, event, Deferred, DeferredList,
			domConstruct, domClass, domStyle, domAttr, domGeometry, 
            query, touch, on, keys, focus, a11y, _Module){
	kernel.experimental('gridx/modules/FlipCardNavTreeModule');


	function isExpando(cellNode){
		var n = cellNode.firstChild;
		return n && n.className && domClass.contains(n, 'gridxTreeExpandoCell') &&
			!domClass.contains(n, 'gridxTreeExpandoLoading');
	}

	return declare(_Module, {
		name: "tree",
		
		rootNavId: '', //sync to root layer id
		rootNavName: '__ROOT__',
		
		idProperty: "id",

		forced: ['view'],

		preload: function(){
			var t = this,
				g = t.grid;
			g.domNode.setAttribute('role', 'treegrid');
			t.aspect(g.body, 'collectCellWrapper', '_createCellWrapper');
			t.aspect(g.body, 'onAfterRow', '_onAfterRow');
			t.aspect(g.body, 'onCheckCustomRow', function(row, output){
				if(!t.nested && t.mergedParentRow){
					output[row[t.idProperty]] = row.canExpand();
				}
			});
			t.aspect(g.body, 'onBuildCustomRow', function(row, output){
				output[row[t.idProperty]] = row[t.idProperty];
			});
			t.aspect(g, 'onCellClick', '_onCellClick');
			t.aspect(g, "onCellKeyDown", lang.hitch(t, function(evt){
				if(evt.keyCode == keys.ENTER){
					t._onCellClick(evt);
				}
			}));
			t.aspect(g, 'onRowClick', function(e){
				if(!t.nested && t.mergedParentRow){
					if(t.canExpand(e.rowId)){
						if(t.isExpanded(e.rowId)){
							t.collapse(e.rowId);
						}else{
							t.expand(e.rowId);
						}
					}
				}
			});
			t._initExpandLevel();
			t._initFocus();
		},

		rowMixin: {
			canExpand: function(){
				return this.grid.tree.canExpand(this.id);
			},
			isExpanded: function(){
				return this.grid.tree.isExpanded(this.id);
			},
			expand: function(){
				return this.grid.tree.expand(this.id);
			},
			collapse: function(){
				return this.grid.tree.collapse(this.id);
			},
			expandRecursive: function(){
				return this.grid.tree.expandRecursive(this.id);
			},
			collapseRecursive: function(){
				return this.grid.tree.collapseRecursive(this.id);
			}
		},

		nested: false,

		expandoWidth: 16,

		expandoPadding: 18,

		expandLevel: 1 / 0,

		clearOnSetStore: true,

		mergedParentRow: false,

		onExpand: function(id){},

		onCollapse: function(id){},

		canExpand: function(id){
			var t = this,
				m = t.model,
				level = m.treePath(id).length,
				expandLevel = t.arg('expandLevel');
			return m.hasChildren(id) && (!(expandLevel > 0) || level <= expandLevel);
		},

		isExpanded: function(id){
			return this.model.isId(id) && !!this.grid.view._openInfo[id];
		},

		isPaddingCell: function(rowId, colId){
			var t = this,
				level = t.model.treePath(rowId).length,
				c = t.grid._columnsById[colId];
			if(t.arg('nested') && level > 1 && c.padding !== false){
				for(var i = 0; i < t.grid._columns.length; ++i){
					var col = t.grid._columns[i];
					if(col.expandLevel == level){
						return c.index < col.index;
					}
				}
			}
			return false;
		},

		expand: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;
			if(!t.isExpanded(id) && t.canExpand(id)){
				t._beginLoading(id);
				t.grid.view.logicExpand(id).then(function(){
					Deferred.when(t._updateBody(id, skipUpdateBody, true), function(){
						t._endLoading(id);
						d.callback();
						t.onExpand(id);
					});
				});
			}else{
				d.callback();
			}
			return d;
		},
		
		expandGroup: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;

			if(  (!t.isExpanded(id) && t.canExpand(id)) ){
				t._beginLoading(id);
				
				var group = t.model.byId(id);
				var item = group.item;
				if(item && item["group"] && item["group"] == "static"){
					t.grid.view.logicExpand(id).then(function(){
						Deferred.when(t._updateBody(id, skipUpdateBody, true), function(){
							t._endLoading(id);
							d.callback();
							t.onExpand(id);
						});
					});
				}else{
					d.callback();
					// t.onExpand(id);
				}
			}else{
				d.callback();
			}
			return d;
		},

		collapse: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;
			if(t.isExpanded(id)){
				t.grid.view.logicCollapse(id);
				Deferred.when(t._updateBody(id, skipUpdateBody), function(){
					d.callback();
					t.onCollapse(id);
				});
			}else{
				d.callback();
			}
			return d;
		},
		
		collapseGroup: function(id, skipUpdateBody){
			var d = new Deferred(),
				t = this;
			if(t.isExpanded(id)){
				var group = t.model.byId(id);
				var item = group.item;
				if(item && item["group"] && item["group"] == "static"){
					t.grid.view.logicCollapse(id);
					Deferred.when(t._updateBody(id, skipUpdateBody), function(){
						d.callback();
						t.onCollapse(id);
					});
				}else{
					d.callback();
					// t.onCollapse(id);
				}
			}else{
				d.callback();
			}
			return d;
		},
		
		expandRecursive: function(id, skipUpdateBody){
			var t = this,
				m = t.model,
				d = new Deferred();
			t._beginLoading(id);
			t.expand(id, 1).then(function(){
				var i, dl = [], size = m.size(id);
				m.when({start: 0, parentId: id}, function(){
					for(i = 0; i < size; ++i){
						var childId = m.indexToId(i, id);
						dl.push(t.expandRecursive(childId, 1));
					}
				}).then(function(){
					new DeferredList(dl).then(function(){
						Deferred.when(t._updateBody(id, skipUpdateBody), function(){
							t._endLoading(id);
							d.callback();
						});
					});
				});
			});
			return d;
		},
		
		expandGroupRecursive: function(id, skipUpdateBody){
			var t = this,
				m = t.model,
				d = new Deferred();
			t._beginLoading(id);
			t.expandGroup(id, 1).then(function(){
				var i, dl = [], size = m.size(id);
				m.when({start: 0, parentId: id}, function(){
					for(i = 0; i < size; ++i){
						var childId = m.indexToId(i, id);
						dl.push(t.expandGroupRecursive(childId, 1));
					}
				}).then(function(){
					new DeferredList(dl).then(function(){
						Deferred.when(t._updateBody(id, skipUpdateBody), function(){
							t._endLoading(id);
							d.callback();
						});
					});
				});
			});
			return d;
		},
		
		expandGroupDescendents: function(id, skipUpdateBody){
			var t = this,
				m = t.model,
				d = new Deferred();
			t._beginLoading(id);
			t.expand(id, 1).then(function(){
				var i, dl = [], size = m.size(id);
				m.when({start: 0, parentId: id}, function(){
					for(i = 0; i < size; ++i){
						var childId = m.indexToId(i, id);
						dl.push(t.expandGroupRecursive(childId, 1));
					}
				}).then(function(){
					new DeferredList(dl).then(function(){
						Deferred.when(t._updateBody(id, skipUpdateBody), function(){
							t._endLoading(id);
							d.callback();
						});
					});
				});
			});
			return d;
		},

		collapseRecursive: function(id, skipUpdateBody){
			var d = new Deferred(),
				success = lang.hitch(d, d.callback),
				fail = lang.hitch(d, d.errback),
				t = this,
				view = t.grid.view,
				info = view._openInfo[id || ''],
				i, dl = [];
			if(info){
				for(i = info.openned.length - 1; i >= 0; --i){
					dl.push(t.collapseRecursive(info.openned[i], 1));
				}
				new DeferredList(dl).then(function(){
					if(id){
						t.collapse(id, skipUpdateBody).then(success, fail);
					}else{
						Deferred.when(t._updateBody('', skipUpdateBody), success, fail);
					}
				});
			}else{
				success();
			}
			return d;
		},
		
		collapseGroupRecursive: function(id, skipUpdateBody){
			var d = new Deferred(),
				success = lang.hitch(d, d.callback),
				fail = lang.hitch(d, d.errback),
				t = this,
				view = t.grid.view,
				info = view._openInfo[id || ''],
				i, dl = [];
			if(info){
				for(i = info.openned.length - 1; i >= 0; --i){
					dl.push(t.collapseGroupRecursive(info.openned[i], 1));
				}
				new DeferredList(dl).then(function(){
					if(id){
						var group = t.model.byId(id);
						var item = group.item;
						if(item && item["group"] && item["group"] == "static"){
							t.collapseGroup(id, skipUpdateBody).then(success, fail);
						}else{
							if(t.isExpanded(id)){
								t.collapse(id, skipUpdateBody).then(function(){
									t.expand(id, skipUpdateBody).then(success, fail);
								});
							}
						}
					}else{
						Deferred.when(t._updateBody('', skipUpdateBody), success, fail);
					}
				});
			}else{
				success();
			}
			return d;
		},

		//Private-------------------------------------------------------------------------------
		_initExpandLevel: function(){
			var cols = array.filter(this.grid._columns, function(col){
				return !col.ignore;
			});
			if(!array.some(cols, function(col){
				return col.expandLevel;
			})){
				if(this.arg('nested')){
					array.forEach(cols, function(col, i){
						col.expandLevel = i + 1;
					});
				}else if(cols.length){
					cols[0].expandLevel = 1;
				}
			}
		},

		_createCellWrapper: function(wrappers, rowId, colId){
			var t = this,
				col = t.grid._columnsById[colId];
			if(!col || col.expandLevel){
				var isNested = t.arg('nested'),
					level = t.model.treePath(rowId).length,
					expandLevel = t.arg('expandLevel');
				if((!isNested || (col && col.expandLevel == level)) && 
						(!(expandLevel > 0) || level <= expandLevel + 1)){
					var hasChildren = t.model.hasChildren(rowId),
						isOpen = t.isExpanded(rowId),
						pad = 0,
						expandoWidth = t.arg('expandoWidth'),
						singlePad = t.arg('expandoPadding'),
						ltr = t.grid.isLeftToRight();
					if(!isNested){
						pad = (level - 1) * singlePad;
					}
					if(level == expandLevel + 1){
						//This is one level beyond the last level, there should not be expando
						if(isNested){
							//If nested, no indent needed
							return;
						}
						//If not nested, this level still needs indent
						hasChildren = false;
					}
					wrappers.push({
						priority: 0,
						wrap: function(cellData){
							return ["<div class='gridxTreeExpandoCell ",
								isOpen ? "gridxTreeExpandoCellOpen" : "",
								"' style='padding-", ltr ? 'left' : 'right', ": ", pad + expandoWidth, "px;'>",
								"<div class='gridxTreeExpandoIcon ",
								hasChildren ? '' : 'gridxTreeExpandoIconNoChildren',
								"' ",
								"style='margin-", ltr ? 'left' : 'right', ": ", pad, "px;'>",
								"<div class='gridxTreeExpandoInner'>",
								isOpen ? "-" : "+",
								"</div></div><div class='gridxTreeExpandoContent gridxCellContent'>",
								cellData,
								"</div></div>"
							].join('');
						}
					});
				}
			}
		},

		_onCellClick: function(e){
			if(isExpando(e.cellNode)){
				var t = this,
					pos = domGeometry.position(query('.gridxTreeExpandoIcon', e.cellNode)[0]);
				// if(e.clientX >= pos.x && e.clientX <= pos.x + pos.w && e.clientY >= pos.y && e.clientY <= pos.y + pos.h){
					// if(t.isExpanded(e.rowId)){
						// t.collapse(e.rowId);
					// }else{
						// t.expand(e.rowId);
					// }
					// event.stop(e);
				// }
				
				//special handling
                //
                // Do Not Expand the menu item in gridx when group attribute set to be static
                //
				var row = t.model.byId(e.rowId);
				var item = row.item;
				if(item && item["group"] && item["group"] == "static"){
					event.stop(e);
					return;
				}
				
				//handle expand / collapse
				if(t.isExpanded(e.rowId)){
					t.collapse(e.rowId);
				}else{
					// t.expand(e.rowId);
					t.expandGroupDescendents(e.rowId);
				}
				event.stop(e);
			}
		},

		_beginLoading: function(id){
			var rowNode = this.grid.body.getRowNode({rowId: id});
			if(rowNode){
				query('.gridxTreeExpandoCell', rowNode).addClass('gridxTreeExpandoLoading');
				query('.gridxTreeExpandoIcon', rowNode).forEach(function(node){
					node.firstChild.innerHTML = 'o';
				});
			}
		},

		_endLoading: function(id){
			var rowNode = this.grid.body.getRowNode({rowId: id}),
				isOpen = this.isExpanded(id);
			if(rowNode){
				var nls = this.grid.nls;
				query('.gridxTreeExpandoCell', rowNode).
					removeClass('gridxTreeExpandoLoading').
					toggleClass('gridxTreeExpandoCellOpen', isOpen).
					closest('.gridxCell').
					attr('aria-expanded', String(isOpen)).
					attr('aria-label', isOpen ? nls.treeExpanded : nls.treeCollapsed);
				query('.gridxTreeExpandoIcon', rowNode).forEach(function(node){
					node.firstChild.innerHTML = isOpen ? '-' : '+';
				});
				rowNode.setAttribute('aria-expanded', String(isOpen));
			}
		},

		_updateBody: function(id, skip, refreshPartial){
			var t = this,
				view = t.grid.view,
				body = t.grid.body;
			if(!skip){
				var visualIndex = refreshPartial && id ? 
					view.getRowInfo({
						rowIndex: t.model.idToIndex(id),
						parentId: t.model.parentId(id)
					}).visualIndex : -1;
				//When collapsing, the row count in current view decrease, if only render partially,
				//it is possible that the vertical scroll bar disappear, then the upper unrendered rows will be lost.
				//So refresh the whole body here to make the upper row also visible.
				//FIXME: need better solution here.
				return body.refresh(refreshPartial && visualIndex + 1);
			}
			return null;
		},

		_onAfterRow: function(row){
			var t = this,
				view = t.grid.view,
				body = t.grid.body;
				
			var hasChildren = this.model.hasChildren(row[t.idProperty]);
			if(hasChildren){
				var rowNode = row.node(),
					rowItem = row.item(),
					expanded = this.isExpanded();
				
				var key = rowItem[t.idProperty];
				if(rowItem["group"] && rowItem["group"] == "static" && key){
					domClass.add(rowNode, "fcNavItemGroupStatic");
				}else{
					domClass.add(rowNode, "fcNavItemGroupDynamic");
				}
				
				//a11y
				rowNode.setAttribute('aria-expanded', expanded);
				//This is only to make JAWS readk
				var nls = this.grid.nls;
				query('.gridxTreeExpandoCell', rowNode).closest('.gridxCell').
					attr('aria-expanded', String(expanded)).
					attr('aria-label', expanded ? nls.treeExpanded : nls.treeCollapsed);
			}else{
				//TODO
			}
		},

		//Focus------------------------------------------------------------------
		_initFocus: function(){
			this.connect(this.grid, 'onCellKeyDown', '_onKey'); 
		},

		_onKey: function(e){
			var t = this;
			if(e.keyCode == keys.ESCAPE){
				var m = t.model,
					treePath = m.treePath(e.rowId),
					parentId = treePath.pop(),
					parentLevel = treePath.length,
					grid = t.grid;
				if(parentId){
					var i, col, visualIndex;
					for(i = grid._columns.length - 1; i >= 0; --i){
						col = grid._columns[i];
						if(col.expandLevel && (!t.arg('nested') || col.expandLevel == parentLevel)){
							break;
						}
					}
					m.when({id: parentId}, function(){
						visualIndex = grid.view.getRowInfo({
							parentId: treePath.pop(), 
							rowIndex: m.idToIndex(parentId)
						}).visualIndex;
					}).then(function(){
						grid.vScroller.scrollToRow(visualIndex).then(function(){
							grid.body._focusCell(null, visualIndex, col.index);
						});
					});
				}
			}else if(t.grid._isCtrlKey(e) && isExpando(e.cellNode)){
				var ltr = t.grid.isLeftToRight();
				if(e.keyCode == (ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW) && t.isExpanded(e.rowId)){
					t.collapse(e.rowId);
				}else if(e.keyCode == (ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW) && !t.isExpanded(e.rowId)){
					t.expand(e.rowId);
				}
			}
		}
	});
});
