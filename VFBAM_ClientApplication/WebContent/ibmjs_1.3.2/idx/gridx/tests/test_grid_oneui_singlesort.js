require([
	'dojo/_base/lang',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'idx/gridx/tests/support/data/MusicData',
	'idx/gridx/tests/support/stores/Memory',
	'idx/gridx/tests/support/modules',
	'dojo/domReady!'
], function(lang, Grid, Cache, dataSource, storeFactory, mods){
	
	var create = function(id, container, size, modArr, attrs){
		var grid = new Grid(lang.mixin({
			id: id,
			cacheClass: Cache,
			store: storeFactory({
				dataSource: dataSource,
				size: size
			}),
			structure: dataSource.layouts[5],
			selectRowTriggerOnCell: true,
			sortNested: false,
			modules: [
				mods.Sort,
				mods.Focus,
				mods.ExtendedSelectRow,
				mods.ColumnResizer,
				mods.VirtualVScroller
			].concat(modArr || [])
		}, attrs || {}));
		grid.placeAt(container);
		grid.startup();
		return grid;
	};
	create('grid1', 'grid1Container', 100, []);
});



