require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeCollectionMetaInfoWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionMetaInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,

        postCreate: function(){

        },

        destroy:function(){
        },
        _endOfCode: function(){}
    });
});