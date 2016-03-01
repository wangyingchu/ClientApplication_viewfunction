require([
	'dojo/_base/lang',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'idx/gridx/tests/support/data/MusicData',
	'idx/gridx/tests/support/stores/Memory',
	'idx/gridx/tests/support/modules',
	'dojo/domReady!'
], function(lang, Grid, Cache, dataSource, storeFactory, modules){

	var create = function(id, container, size, props){
		var grid = new Grid(lang.mixin({
			id: id,
			cacheClass: Cache,
			store: storeFactory({
				dataSource: dataSource, 
				size: size 
			}),
			structure: dataSource.layouts[5],
			modules: [
				modules.ExtendedSelectRow,
				modules.RowHeader,
				modules.IndirectSelect,
				modules.VirtualVScroller
			]
		}, props || {}));
		grid.placeAt(container);
		grid.startup();
		return grid;
	};
	
	create('grid', 'gridContainer', 100);
});



