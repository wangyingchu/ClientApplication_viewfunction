(function(){
	angular.module('aui.grid')
	.factory('Sync', ['$q', 'GridUtil', '$compile', '$parse', '$timeout', function($q, GridUtil) {

		/*=====
			return declare(_Extension, function(){
				// summary:
				//		Base cache class, providing cache data structure and some common cache functions.
				//		Also directly support client side stores.
			});
		=====*/
	/*=====
		return declare([], {
			// summary:
			//		Abstract base class for all model components (including cache)

			onNew: function(){},
			onDelete: function(){},
			onSet: function(){}
		});
	=====*/

		var _Extension = function(model) {
			var t = this,
				i = t.inner = model._model;
			t._cnnts = [];
			t.model = model;
			t.childField = t.model.childField;
			model._model = t;
			if(i){
				t.aspect(i, 'onDelete', '_onDelete');
				t.aspect(i, 'onNew', '_onNew');
				t.aspect(i, 'onSet', '_onSet');
			}
		};

		_Extension.prototype = {
			destroy: function(){
				for(var i = 0, len = this._cnnts.length; i < len; ++i){
					this._cnnts[i].remove();
				}
			},

			aspect: function(obj, e, method, scope, pos){
				var cnnt = aspect[pos || 'after'](obj, e, lang.hitch(scope || this, method), 1);
				this._cnnts.push(cnnt);
				return cnnt;
			},

			//Events----------------------------------------------------------------------
			//Make sure every extension has the oppotunity to decide when to fire an event at its level.
			_onNew: function(){
				this.onNew.apply(this, arguments);
			},

			_onSet: function(){
				this.onSet.apply(this, arguments);
			},

			_onDelete: function(){
				this.onDelete.apply(this, arguments);
			},

			onNew: function(){},
			onDelete: function(){},
			onSet: function(){},

			//Protected-----------------------------------------------------------------
			_call: function(method, args){
				var t = this,
					m = t[method],
					n = t.inner;
				return m ? m.apply(t, args || []) : n && n._call(method, args);
			},

			_mixinAPI: function(){
				var i,
					m = this.model,
					args = arguments,
					api = function(method){
						return function(){
							return m._model._call(method, arguments);
						};
					};
				for(i = args.length - 1; i >= 0; --i){
					m[args[i]] = api(args[i]);
				}
			}
		};

		var hitch = GridUtil.hitch,
			mixin = GridUtil.mixin,
			indexOf = [].indexOf;

		function fetchChildren(self){
			var s = self._struct,
				pid,
				df,
				pids = s[''].slice(1),
				appendChildren = function(pid){
					[].push.apply(pids, s[pid].slice(1));
				};

			while (pids.length) {
				pid = pids.shift();
				df = self._storeFetch({
					parentId: pid
				});

				appendChildren(pid);
				// df.promise && df.promise.then(hitch(null, appendChildren, pid));
			}
		}

		var Sync = function Sync(model, args) {
			var t = this;
			// t = new _Extension(model);
			_Extension.apply(t, [model]);
			t.setData(args.options.data);
			t.columns = mixin({}, args.columnsById || args._columnsById);
			// provide the following APIs to Model
			t._mixinAPI('byIndex', 'byId', 'indexToId', 'idToIndex', 'size', 'treePath', 'rootId', 'parentId',
				'hasChildren', 'children', 'keep', 'free', 'layerId', 'setLayer', 'layerUp');
		};

		Sync.prototype = {
			// Assumption:
			//		The parent id for root level rows is an empty string.
			//
			// Some internal data structures:
			//
			// _struct: the index structure of data
			//		{
			//			'': [undefined, 'id1', 'id2', ...], // root level
			//			'id1': ['', 'child-id1', ...], // children of id1 
			//			'id2': ['', ...],	// children of id2
			//			'child-id1': ['id1', ...], // children of child-id1
			//			...
			//		}
			//
			// _cache: row data cache hashed by row id
			//		{
			//			'id1': {
			//				data: {}, // formatted grid data, hashed by column id
			//				rawData: {}, // raw store data, hashed by column id
			//				item: {}	// original store item, defined by store, usually hashed by field name
			//			},
			//			'id2': {
			//				data: {},
			//				rawData: {},
			//				item: {}
			//			}
			//		}
			//
			// _size: total size for every layer
			//		{
			//			'': 100		// root layer
			//			'id1': 20		// id1 has 20 direct children
			//		}
			//
			// _priority: array of row ids
			//		provide an ordered list to decide which row to be removed from cache when cacheSize limit is reached.
			//

			constructor: function(model, args){
			},

			destroy: function(){
				// this.inherited(arguments);
				this._layer = '';
				this.clear();
			},

			setData: function(data){
				var t = this,
					c = 'aspect',
					old = data.fetch;
				//Disconnect data events.
				t.destroy();
				t._cnnts = [];
				t.data = data;
				if(!old && data.notify){
					//The data implements the dojo.data.Observable API
					t[c](data, 'notify', function(item, id){
						if(item === undefined){
							t._onDelete(id);
						}else if(id === undefined){
							t._onNew(item);
						}else{
							t._onSet(item);
						}
					});
				}
			},

			when: function(args, callback){
				// For client side store, this method is a no-op
				var d = new $q.defer();
				try{
					if(callback){
						callback();
					}
					d.resolve();
				}catch(e){
					d.reject(e);
				}
				return d;
			},

			//Public----------------------------------------------
			clear: function() {
				var t = this;
				t._filled = 0;
				t._priority = [];
				t._struct = {};
				t._cache = {};
				t._size = {};
				//virtual root node, with id ''.
				t._struct[''] = [];
				t._size[''] = -1;
				t.totalSize = undefined;
			},

			layerId: function(){
				return this._layer;
			},

			setLayer: function(id){
				this._layer = id;
				this.model._msg('storeChange');
				this.model._onSizeChange();
			},

			layerUp: function(){
				var pid = this.parentId(this._layer);
				this.setLayer(pid);
			},

			// Technically, byIndex is based on byId API.
			byIndex: function(index, parentId){
				this._init();
				return this._cache[this.indexToId(index, parentId)];
			},

			byId: function(id){
				this._init();
				var row = this._cache[id];
				if (row && !row.data && typeof row._data === 'function') {
					row.data = row._data();
				}
				return this._cache[id];
			},

			indexToId: function(index, parentId){
				this._init();
				var items = this._struct[this.model.isId(parentId) ? parentId : this.layerId()];
				return typeof index === 'number' && index >= 0 ? items && items[index + 1] : undefined;
			},

			idToIndex: function(id){
				this._init();
				var s = this._struct,
					pid = s[id] && s[id][0],
					index = (s[pid] || []).indexOf(id);
				return index > 0 ? index - 1 : -1;
			},

			treePath: function(id){
				this._init();
				var s = this._struct,
					path = [];
				while(id !== undefined){
					path.unshift(id);
					id = s[id] && s[id][0];
				}
				if(path[0] !== ''){
					path = [];
				}else{
					path.pop();
				}
				return path;
			},

			rootId: function(id){
				var path = this.treePath(id);
				if(path.length > 1){
					return path[1];
				}else if(!path.length){
					return null;
				}
				return id;
			},

			parentId: function(id){
				return this.treePath(id).pop();
			},

			hasChildren: function(id){
				var t = this,
					s = t.data,
					cf = t.childField,
					c;

				t._init();
				c = t.byId(id);
				return c && c.rawData && c.rawData[cf] && c.rawData[cf].length;
				// return s.hasChildren && s.hasChildren(id, c && c.item) && s.getChildren;
			},

			getChildren: function(id) {
				if (!this.hasChildren(id)) return [];

				var cache = this.byId(id),
					cf = this.childField;

				return cache.rawData[cf];
			},

			children: function(parentId){
				this._init();
				parentId = this.model.isId(parentId) ? parentId : '';
				var size = this._size[parentId],
					children = [],
					i = 0;
				for(; i < size; ++i){
					children.push(this.indexToId(i, parentId));
				}
				return children;
			},

			size: function(parentId){
				this._init();
				var s = this._size[this.model.isId(parentId) ? parentId : this.layerId()];
				return s >= 0 ? s : -1;
			},

			keep: function(){},
			free: function(){},

			//Events--------------------------------------------
			onBeforeFetch: function(){},
			onAfterFetch: function(){},
			onLoadRow: function(){},

			onSetColumns: function(columns){
				var t = this, id, c, colId, col;
				t.columns = mixin({}, columns);
				for(id in t._cache){
					c = t._cache[id];
					for(colId in columns){
						col = columns[colId];
						c.data = c._data();
						c.data[colId] = t._formatCell(c.rawData, id, col.id);
					}
				}
			},

			//Protected-----------------------------------------
			_init: function() {
				var t = this;
				if (!t._filled) {
					t._storeFetch({ start: 0 });
					fetchChildren(t);
					t.model._onSizeChange();
				}
			},

			_itemToObject: function(item){
				var s = this.data,
					obj = {};
				if(s.fetch){
					array.forEach(s.getAttributes(item), function(attr){
						obj[attr] = s.getValue(item, attr);
					});
					return obj;
				}
				return item;
			},

			_formatCell: function(rawData, rowId, colId){
				var col = this.columns[colId],
					t = this,
					cellData; 

				cellData = col.formatter ? col.formatter(rawData[col.field], rawData, rowId, colId, t.model) : rawData[col.field || colId];
				return (t.columns[colId] && t.columns[colId].encode === true && typeof cellData === 'string')? entities.encode(cellData) : cellData;
			},

			_formatRow: function(rowData, rowId){
				var cols = this.columns, res = {}, colId;
				for(colId in cols){
					res[colId] = this._formatCell(rowData, rowId, colId);
				}
				return res;
			},

			_addRow: function(id, index, rowData, item, parentId){
				var t = this,
					st = t._struct,
					pr = t._priority,
					pid = t.model.isId(parentId) ? parentId : '',
					ids = st[pid],
					i;
				if(!ids){
					throw new Error("Fatal error of _Cache._addRow: parent item " + pid + " of " + id + " is not loaded");
				}
				var oldId = ids[index + 1];
				if(t.model.isId(oldId) && oldId !== id){
					console.error("Error of _Cache._addRow: different row id " + id + " and " + ids[index + 1] + " for same row index " + index);
				}
				ids[index + 1] = id;
				st[id] = st[id] || [pid];
				if(pid === ''){
					i = pr.indexOf(id);
					if(i >= 0){
						pr.splice(i, 1);
					}
					pr.push(id);
				}
				t._cache[id] = {
					_data: hitch(t, t._formatRow, rowData, id),
					// _data: t._formatRow(rowData, id),
					rawData: rowData,
					item: item
				};
				t.onLoadRow(id);
			},

			_storeFetch: function(options, onFetched){
				var t = this,
					s = t.data,
					d = new $q.defer(),
					parentId = t.model.isId(options.parentId) ? options.parentId : '',
					req = mixin({}, t.options || {}, options),
					onError = hitch(d, d.errback),
					results;

				var onBegin = function(size) {
					t._size[parentId] = parseInt(size, 10);
				};
				var onComplete = function(items) {
					//FIXME: store does not support getting total size after filter/query, so we must change the protocal a little.
					try {
						var start = options.start || 0,
							i = 0,
							item;

						for (; item = items[i]; ++i) {
							t._addRow(item.id, start + i, t._itemToObject(item), item, parentId);
						}
						// d.callback();
						d.resolve();
					} catch(e) {
						// d.errback(e);
						d.reject(e);
					}
				};

				t._filled = 1;
				t.onBeforeFetch(req);

				if (parentId === '') {
					onBegin(s.length);
					onComplete(s);
				} else if (t.hasChildren(parentId)) {
					results = t.getChildren(parentId);

					if (results.length){
						onBegin(results.length);
					}
					//  else {
					// 	Deferred.when(results, function(results){
					// 		onBegin(results.length);
					// 	});
					// }
					// Deferred.when(results, onComplete, onError);
					onComplete(results);
				}
				// else{
				// 	d.callback();
				// }
				d.promise.then(function(){
					t.onAfterFetch();
				});
				return d;
			},

			//--------------------------------------------------------------------------
			_onSet: function(item, option) {
				var t = this,
					id = t.data.getIdentity(item),
					index = t.idToIndex(id),
					path = t.treePath(id),
					old = t._cache[id];

				if (path.length) {
					t._addRow(id, index, t._itemToObject(item), item, path.pop());
				}
				if (!option || option.overwrite !== false) { // In new store, add() is using put().
															 // Here to stop t.onSet when calling store.add()
					t.onSet(id, index, t._cache[id], old);
				}
			},

			_onNew: function(item, parentInfo){
				var t = this,
					s = t.data,
					row = t._itemToObject(item),
					parentItem = parentInfo && parentInfo[s.fetch ? 'item' : 'parent'],
					parentId = parentItem ? s.getIdentity(parentItem) : '',
					id = s.getIdentity(item),
					size = t._size[''];
				t.clear();
				t.onNew(id, 0, {
					_data: hitch(t, t._formatRow, row, id),
					rawData: row,
					item: item
				});
				if(!parentItem && size >= 0){
					t._size[''] = size + 1;
					if(t.totalSize >= 0){
						t.totalSize = size + 1;
					}
					t.model._onSizeChange();
				}
				if (parentItem && parentId) {
					t._size[parentId] = t._size[parentId] + 1;
					t.model._onParentSizeChange(parentId, 1/*isAdd*/);
				}
			},

			_onDelete: function(item){
				var t = this,
					s = t.data,
					st = t._struct,
					id = s.fetch ? s.getIdentity(item) : item,
					path = t.treePath(id);
				if(path.length){
					var children, i, j,
						ids = [id],
						parentId = path[path.length - 1],
						sz = t._size,
						size = sz[''],
						index = st[parentId].indexOf(id);
					//This must exist, because we've already have treePath
					st[parentId].splice(index, 1);
					--sz[parentId];

					for(i = 0; i < ids.length; ++i){
						children = st[ids[i]];
						if(children){
							for(j = children.length - 1; j > 0; --j){
								ids.push(children[j]);
							}
						}
					}
					for(i = ids.length - 1; i >= 0; --i){
						j = ids[i];
						delete t._cache[j];
						delete st[j];
						delete sz[j];
						// only fire onDelete if it is a child
						if (i !== (ids.length - 1)) {
							t.onDelete(j, undefined, t.treePath(j));
						}
					}
					i = t._priority.indexOf(id);
					if(i >= 0){
						t._priority.splice(i, 1);
					}
					t.onDelete(id, index - 1, path);
					if(!parentId && size >= 0){
						sz[''] = size - 1;
						if(t.totalSize >= 0){
							t.totalSize = size - 1;
						}
						t.model._onSizeChange();
					}
					if (parentId) {
						t.model._onParentSizeChange(parentId, 0/*isDelete*/);
					}
				}else{
					//FIXME: Don't know what to do if the deleted row was not loaded.
					t.clear();
					t.onDelete(id);
	//                var onBegin = hitch(t, _onBegin),
	//                    req = mixin({}, t.options || {}, {
	//                        start: 0,
	//                        count: 1
	//                    });
	//                setTimeout(function(){
	//                    if(s.fetch){
	//                        s.fetch(mixin(req, {
	//                            onBegin: onBegin
	//                        }));
	//                    }else{
	//                        var results = s.query(req.query, req);
	//                        Deferred.when(results.total, onBegin);
	//                    }
	//                }, 10);
				}
			}
		};

		GridUtil.mixin(Sync.prototype, _Extension.prototype);

		return Sync;
	}]);
})();