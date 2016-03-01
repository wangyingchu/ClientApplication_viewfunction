require([
	'dijit/form/Button',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'idx/gridx/tests/support/data/MusicData',
	'idx/gridx/tests/support/stores/Memory',
	'idx/gridx/tests/support/modules',
	'idx/form/TextBox',
	'idx/widget/Menu',
	'dojo/domReady!'
], function(Button, Grid, Cache, dataSource, storeFactory, modules){
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: dataSource.layouts[1],
		filterBarMaxRuleCount: 5,
		modules: [
			modules.Focus,
			modules.ExtendedSelectRow,
			modules.ToolBar,
			modules.Filter,
			modules.FilterBar,
			modules.QuickFilter,
			modules.ColumnResizer,
			modules.VirtualVScroller
		],
		paginationBarGotoButton: false,
		selectRowTriggerOnCell: true
	});
	grid.placeAt('gridContainer');
	grid.startup();
	
	grid.toolBar.widget.addChild(new Button({
		showLabel: false,
		label: 'Cut',
		iconClass: 'testToolbarButtonCut'
	}));
	grid.toolBar.widget.addChild(new Button({
		showLabel: false,
		label: 'Copy',
		iconClass: 'testToolbarButtonCopy'
	}));
	grid.toolBar.widget.addChild(new Button({
		showLabel: false,
		label: 'Paste',
		iconClass: 'testToolbarButtonPaste'
	}));

});



