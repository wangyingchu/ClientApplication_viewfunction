require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/SavedCategorySearchLinkWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.SavedCategorySearchLinkWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.savedSearchLink.set("label",this.savedSearchInfo.searchTitle);
        },
        executeSearch:function(){
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_ALL,
                KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_SAVEDSEARCH,
                KNOWLEDGE_VIEW_DATA:{
                    DISPLAY_TITLE:this.savedSearchInfo.searchTitle,
                    VIEW_METADATA:{
                        selectedCategories:this.savedSearchInfo.selectedTags
                    },
                    VIEW_PAGEDATA:{
                        PAGING:true,
                        PAGE_SIZE:50,
                        CURRENT_PAGE_NUMBER:1
                    }
                }
            });
        },
        _endOfCode: function(){}
    });
});