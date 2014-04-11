define([
	'gridx/modules/Focus',
	'gridx/modules/VScroller',
	'gridx/modules/ColumnResizer',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/SingleSort',
	'gridx/modules/NestedSort',
	'gridx/modules/ColumnLock',
	'gridx/modules/select/Row',
	'gridx/modules/select/Column',
	'gridx/modules/select/Cell',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/extendedSelect/Column',
	'gridx/modules/extendedSelect/Cell',
	'gridx/modules/move/Row',
	'gridx/modules/move/Column',
	'gridx/modules/dnd/Row',
	'gridx/modules/dnd/Column',
	'gridx/modules/AutoScroll',
	'gridx/modules/pagination/Pagination',
	'gridx/modules/pagination/PaginationBar',
	'gridx/modules/pagination/PaginationBarDD',
	'gridx/modules/filter/Filter',
	'gridx/modules/filter/FilterBar',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
	'gridx/modules/RowHeader',
	'gridx/modules/IndirectSelect',
	'gridx/modules/Persist',
	'gridx/modules/exporter/Exporter',
	'gridx/modules/exporter/CSV',
	'gridx/modules/exporter/Table',
	'gridx/modules/Printer',
	'gridx/modules/Menu',
	'gridx/modules/Dod',
	'gridx/modules/TitleBar',
	'gridx/modules/Tree',
	'gridx/modules/RowLock',
	'gridx/modules/ToolBar',
	'gridx/modules/SummaryBar',
	'gridx/modules/Bar'
], function(
	Focus, VScroller, ColumnResizer, VirtualVScroller,
	SingleSort, NestedSort, ColumnLock,
	SelectRow, SelectColumn, SelectCell,
	ExtendedSelectRow, ExtendedSelectColumn, ExtendedSelectCell,
	MoveRow, MoveColumn,
	DndRow, DndColumn, AutoScroll,
	Pagination,
	PaginationBar, PaginationBarDD,
	Filter, FilterBar,
	CellWidget, Edit,
	RowHeader, IndirectSelect,
	Persist, Exporter, CSV, Table, Printer,
	Menu, Dod, TitleBar, Tree, RowLock, ToolBar, SummaryBar, Bar){
return {
	Focus: Focus,
	VScroller: VScroller,
	ColumnResizer: ColumnResizer, 
	VirtualVScroller: VirtualVScroller,
	SingleSort: SingleSort,
	NestedSort: NestedSort,
	ColumnLock: ColumnLock,
	SelectRow: SelectRow,
	SelectColumn: SelectColumn,
	SelectCell: SelectCell,
	ExtendedSelectRow: ExtendedSelectRow,
	ExtendedSelectColumn: ExtendedSelectColumn,
	ExtendedSelectCell: ExtendedSelectCell,
	MoveRow: MoveRow,
	MoveColumn: MoveColumn,
	DndRow: DndRow,
	DndColumn: DndColumn,
	AutoScroll: AutoScroll,
	Pagination: Pagination,
	PaginationBar: PaginationBar,
	PaginationBarDD: PaginationBarDD,
	Filter: Filter,
	FilterBar: FilterBar,
	CellWidget: CellWidget,
	Edit: Edit,
	RowHeader: RowHeader,
	IndirectSelect: IndirectSelect,
	Persist: Persist,
	Exporter: Exporter,
	ExportCSV: CSV,
	ExportTable: Table,
	Printer: Printer,
	Menu: Menu,
	Dod: Dod,
	TitleBar: TitleBar,
	Tree: Tree,
	RowLock: RowLock,
	ToolBar: ToolBar,
	SummaryBar: SummaryBar,
	Bar: Bar
};
});
