require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/CollectionNewAddedKnowledgeItemInfoListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNewAddedKnowledgeItemInfoListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        collectionKnowledgeItemWidgetList:null,
        knowledgeCategoryInheritDataStore:null,
        postCreate: function(){
            this.collectionKnowledgeItemWidgetList=[];
            this.collectionName.innerHTML=this.collectionInfo.collectionName;
            this._loadKnowledgeCategoryInheritDataStore();
        },
        renderCollectionKnowledgeItems:function(){
            var collectionId=this.collectionInfo.collectionId;
            var that=this;
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByProjectId/"+collectionId+"?pageSize=1000&currentPageNumber=1";
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(returnData){
                console.log(returnData);
                that._renderKnowledgeInfoList(returnData);
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        _renderKnowledgeInfoList:function(collectionInfo){
            var that=this;
            var knowledgeItemsArray=collectionInfo.docs;
            dojo.forEach(knowledgeItemsArray,function(knowledgeItemInfo){
                var currentKnowledge=new vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNewAddedKnowledgeItemInfoWidget({knowledgeContentInfo:knowledgeItemInfo,knowledgeCategoryInheritDataStore:that.knowledgeCategoryInheritDataStore});
                that.knowledgeItemListContainer.appendChild(currentKnowledge.domNode);
                that.collectionKnowledgeItemWidgetList.push(currentKnowledge);
            });
        },
        _loadKnowledgeCategoryInheritDataStore:function(){
            var that=this;
            var callBack=function(storeData){
                that.knowledgeCategoryInheritDataStore=storeData;
                that.renderCollectionKnowledgeItems();
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
        destroy:function(){
            dojo.forEach(this.collectionKnowledgeItemWidgetList,function(itemWidget){
                itemWidget.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});