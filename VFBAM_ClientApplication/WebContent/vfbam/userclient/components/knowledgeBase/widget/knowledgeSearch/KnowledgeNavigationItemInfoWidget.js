require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationItemInfoWidget.html",
    "idx/widget/MenuDialog"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationItemInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function() {
            this.searchName.innerHTML=this.knowledgeNavigationItemInfo.searchTitle;
            this.searchDesc.innerHTML=this.knowledgeNavigationItemInfo.searchDescription;
        },
        deleteNavigationItem:function(){
             this.knowledgeNavigationManagementWidget.doDeleteNavigationItem(this.knowledgeNavigationItemInfo);
        },
        editNavigationItem:function(){
            this.knowledgeNavigationManagementWidget.doEditNavigationItem(this.knowledgeNavigationItemInfo);
        },
        _endOfCode: function(){}
    });
});