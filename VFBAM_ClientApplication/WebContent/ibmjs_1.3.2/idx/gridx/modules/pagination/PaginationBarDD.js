define([
	"dojo/_base/declare",
	"gridx/core/_Module",
	"gridx/modules/pagination/PaginationBarDD",
	"dijit/form/FilteringSelect",
	"idx/form/Select"
], function(declare, _Module, PaginationBarDD, FilteringSelect, Select){

	return _Module.register(
	declare(PaginationBarDD, {
		stepperClass: FilteringSelect,

		sizeSwitchClass: Select
	}));
});

