require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/CategorySelectorWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategorySelectorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categoryTree:null,
        postCreate: function(){
            this.categoryTree=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategoryItemSelectorWidget({advancedSearchWidget:this.advancedSearchWidget},this.categoryTreeContainer);
        },
        _endOfCode: function(){}
    });
});