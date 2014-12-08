require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/CategoryEditorWidget.html","dojo/store/Memory"
],function(lang,declare, _Widget, _Templated, template,Memory){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categoryTree:null,
        singleCategoryInfo:null,
        postCreate: function(){
            this.categoryTree=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryTreeWidget({},this.categoryTreeContainer);
            this.singleCategoryInfo=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryInfoWidget({},this.categoryInfoContainer);
        },
        updateBasicProperties:function(){
            this.singleCategoryInfo.updateBasicProperties();
        },
        destroy:function(){
            this.categoryTree.destroy();
            this.singleCategoryInfo.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});