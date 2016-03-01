require([
	'dojo/parser',
	'dojo/_base/array',
	'dijit/form/Button',
	'idx/gridx/tests/support/data/MusicData',
	'idx/gridx/tests/support/stores/Memory',
	'dojo/date/locale',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/ColumnResizer',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/ToolBar',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/Filter',
	'gridx/modules/filter/FilterBar',
	'gridx/modules/RowHeader',
	'gridx/modules/IndirectSelect',
	'idx/gridx/modules/filter/FilterBar',
	'idx/gridx/modules/filter/QuickFilter',
	'idx/gridx/support/DateTimeRange',
	'dojo/domReady!'
], function(parser, array, Button, dataSource, storeFactory, locale){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});
	
	var localDateFormatter = function(rawData) {
		var date = rawData['Download Date'];

		if (rawData === undefined || rawData === null ||
			date === undefined || date === null)
		{
			return "";
		} else {
			var item = new Date(date);
			var localed = locale.format(item, {datePattern: "yyyy/M/d", selector: "date"});
			// return '';
			// return date;
			// console.log(localed);
			return localed;
			return locale.format(item, {datePattern: "yyyy/M/d", selector: "date"});
		}
	};
	// DATE_S_FORMAT_OPTIONS: {datePattern: "yyyy/M/d", selector: "date"},

	layout = [
		{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
		{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'enum', encode: true,
			enumOptions: ['a', 'b', 'c']
		},
		{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'enum',
			enumOptions: ['d', 'e', 'f']
		},
		{id: 'Album', field: 'Album', name: 'Album', dataType: 'string', autoComplete: false},
		{id: 'Name', field: 'Name', name: 'Name', dataType: 'string', autoComplete: false},
		{id: 'Year', field: 'Year', name: 'Year', dataType: 'number'},
		{id: 'Length', field: 'Length', name: 'Length', dataType: 'string'},
		{id: 'Track', field: 'Track', name: 'Track', dataType: 'number'},
		{id: 'Composer', field: 'Composer', name: 'Composer', dataType: 'string'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date', dataType: 'date'},
		{id: 'Date Time', field: 'datetime', name: 'Date Time', dataType: 'datetime',  formatter: localDateFormatter},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played', dataType: 'time'},
		{id: 'Heard', field: 'Heard', name: 'Heard', dataType: 'boolean'}
	];
	
	// layout = dataSource.layouts[10];

	parser.parse().then(function(){
		array.forEach([grid2, grid3], function(grid){
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
	});
});
