require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemMainCategoryTagWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemMainCategoryTagWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        removeTagEventConnectionHandler:null,
        postCreate: function(){
            var that=this;
            var categoryTagNameArrayLength=this.categoryTagNameArray.length;
            var shortDisplayName=this.categoryTagNameArray[this.categoryTagNameArray.length-1];
            var displayName=dojo.create("span",{style:"font-size: 0.9em;color: #555555;",innerHTML:shortDisplayName},that.tagDisplayName);
            /*
            dojo.forEach(this.categoryTagNameArray,function(currentName,idx){
                var displayName=dojo.create("span",{style:"font-size: 0.9em;color: #555555;",innerHTML:currentName},that.tagDisplayName);
                if(idx<categoryTagNameArrayLength-1){
                    dojo.create("i",{style:"padding-left: 3px;padding-right: 3px;color: #BBBBBB;",class:"icon-caret-right"},that.tagDisplayName);
                }
            });
            */
            this.removeTagEventConnectionHandler=dojo.connect(this.removeButton,"onclick",dojo.hitch(this,this.removeCurrentCategoryTag));
            if(this.readonly){
                dojo.style(this.removeButton,"display","none");
            }
        },
        removeCurrentCategoryTag:function(){
            this.advancedSearchWidget.removeSearchCategory(this.categoryData.id);
        },
        doSingleTagSearch:function(){
            var selectedCategories=[];
            selectedCategories.push(this.categoryId);
            var searchTitle="自选标签搜索 ("+this.categoryTagNameArray[this.categoryTagNameArray.length-1]+" )";
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
        },
        destroy:function(){
            dojo.disconnect(this.removeTagEventConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});