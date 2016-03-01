require([
	'dojo/parser',
	'idx/gridx/tests/support/data/ComputerData',
	'idx/gridx/tests/support/stores/Memory',
	'dijit/form/Button',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/ColumnResizer',
	'gridx/modules/CellWidget',
	'gridx/modules/Sort',
	'gridx/modules/Filter',
	'gridx/modules/Pagination',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/ToolBar',
	'gridx/modules/SummaryBar',
	'gridx/modules/VirtualVScroller',
	'idx/gridx/modules/filter/QuickFilter',
	'idx/gridx/modules/filter/FilterBar',
	'idx/gridx/modules/pagination/PaginationBar',
	'idx/gridx/modules/pagination/PaginationBarDD',
	'gridx/modules/ColumnLock',
	'gridx/modules/RowHeader',
	'gridx/modules/IndirectSelect',
	'dojo/domReady!'
], function(parser, dataSource, storeFactory, Button){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = dataSource.layouts[0];

	function addToolBarButtons(grid){
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
	}

	parser.parse().then(function(){
		addToolBarButtons(grid1);
		grid1.vLayout.reLayout();
		
		addToolBarButtons(grid2);
		grid2.vLayout.reLayout();
		
		addToolBarButtons(grid3);
		grid3.vLayout.reLayout();
		
		addToolBarButtons(grid4);
		grid4.vLayout.reLayout();
		
		addToolBarButtons(grid5);
		grid5.vLayout.reLayout();
		
		addToolBarButtons(grid6);
		grid6.vLayout.reLayout();
	});
});
