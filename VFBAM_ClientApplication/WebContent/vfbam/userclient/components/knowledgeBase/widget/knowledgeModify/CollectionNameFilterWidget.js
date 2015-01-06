require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/CollectionNameFilterWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNameFilterWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
        },
        doFilterCollectionName: function(){
            this.filterCallback();
        },
        getFilterValue:function(){
            return this.collectionNameFilterInput.get("value");
        },
        clearFilterValue:function(){
            return this.collectionNameFilterInput.set("value","");
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});