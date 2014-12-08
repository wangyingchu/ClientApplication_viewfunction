require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeQueryHistoryItemWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeQueryHistoryItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        deleteButtonClicked:false,
        postCreate: function(){
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_NAVIGATION){
                dojo.style(this.NAVIGATION_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_RECOMMENDED){
                dojo.style(this.RECOMMENDED_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_POP){
                dojo.style(this.POP_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_LATEST){
                dojo.style(this.LATEST_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_ALL){
                dojo.style(this.ALL_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_FAVORITE){
                dojo.style(this.FAVORITE_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_SAVEDSEARCH){
                dojo.style(this.SAVEDSEARCH_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_PEOPLE){
                dojo.style(this.PEOPLE_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_COLLECTION){
                dojo.style(this.COLLECTION_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_MATERIAL){
                dojo.style(this.MATERIAL_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH){
                dojo.style(this.KEYWORDSEARCH_ICON,"display","");
            }
            if(this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_TAGSEARCH){
                dojo.style(this.TAGSEARCH_ICON,"display","");
            }
            this.queryDisplayTitle.innerHTML=this.historyItemInfo[KNOWLEDGE_VIEW_DATA][DISPLAY_TITLE];
        },
        showKnowledgeContent:function(){
            if(!this.deleteButtonClicked){
                this.knowledgeQueryHistoryList.showHistoryItem(this);
            }
        },
        deleteCurrentItem:function(){
            this.deleteButtonClicked=true;
            this.knowledgeQueryHistoryList.removeHistoryItem(this);
        },
        updateHistoryItemTitle:function(data){
            var newContentDisplayName=data.KNOWLEDGE_VIEW_DATA.DISPLAY_TITLE;
            var changedContentObject=data.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            if(this.historyItemInfo.KNOWLEDGE_VIEW_TYPE==KNOWLEDGE_VIEW_TYPE_MATERIAL &&
                this.historyItemInfo.KNOWLEDGE_VIEW_MODE== KNOWLEDGE_VIEW_MODE_SINGLE &&
                this.historyItemInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_MATERIAL){
                if(this.historyItemInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.sequenceNumber==changedContentObject.sequenceNumber){
                    this.historyItemInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.contentDescription=newContentDisplayName;
                    this.historyItemInfo.KNOWLEDGE_VIEW_DATA.DISPLAY_TITLE=newContentDisplayName;
                    this.queryDisplayTitle.innerHTML=newContentDisplayName;
                }
            }
        },
        _endOfCode: function(){}
    });
});