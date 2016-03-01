require([
	'dojo/parser',
	'dojo/dom',
	'dojo/dom-attr',
	'dojo/dom-style',
	'dojo/dom-construct',
	'dojo/dom-geometry',
	'dojo/topic',
	'dojo/aspect',
	'dojo/on',
	'dojo/query',
	'dojo/store/Memory',
	'dijit/registry',
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane"
], function(parser, dom, domAttr, domStyle, domConstruct, domGeometry, topic, aspect, on, query, Memory, registry,
		BorderContainer, ContentPane){

	var rootNode = dom.byId("sample_card_item_max");
	var cardContent = registry.getEnclosingWidget(rootNode);
	var cardItem = cardContent.getParent();
	var contentSize = domGeometry.position( cardContent.containerNode) ;
	var border = registry.byId("border1");
	border.resize(contentSize);
	
	
});