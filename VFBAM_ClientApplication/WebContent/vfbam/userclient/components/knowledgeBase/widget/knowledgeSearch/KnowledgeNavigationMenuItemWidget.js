require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationMenuItemWidget.html",
    "idx/widget/MenuDialog"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function() {
            this.categoryDisplayName.set("label",this.categoryData.categoryDisplayName_cn);
            if(this.isLastMenuItem){
                dojo.style(this.itemDiv,"display","none");
            }
        },
        executeCategorySearch:function(){
            var selectedCategories=[];
            selectedCategories.push(this.categoryData.categoryId);
            var searchTitle="知识导航搜索 ("+this.categoryData.categoryDisplayName_cn+" )";
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_ALL,
                KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_TAGSEARCH,
                KNOWLEDGE_VIEW_DATA:{
                    DISPLAY_TITLE:searchTitle,
                    VIEW_METADATA:{
                        selectedCategories:[this.categoryData]
                    },
                    VIEW_PAGEDATA:{
                        PAGING:true,
                        PAGE_SIZE:50,
                        CURRENT_PAGE_NUMBER:1
                    }
                }
            });
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_CLOSE_GLOBALKNOWLEDGE_NAVIGATION_PANEL_EVENT,{});
        },
        _endOfCode: function(){}
    });
});