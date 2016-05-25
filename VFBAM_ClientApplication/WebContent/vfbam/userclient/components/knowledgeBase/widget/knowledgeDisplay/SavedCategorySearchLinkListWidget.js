require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/SavedCategorySearchLinkListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.SavedCategorySearchLinkListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        savedSearchLinkMap:null,
        postCreate: function(){
            this.savedSearchLinkMap={};
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var that=this;
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"getUserSavedCategoryTagsSelections/"+userId+"/"+KNOWLEDGEBASE_ORGANIZATION_ID+"/";
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(returnData){
                that._renderSavedSearchLinks(returnData);
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
            Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_ADDSAVEDSEARCH_EVENT,dojo.hitch(this,this._addSavedSearch));
            Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_DELETESAVEDSEARCH_EVENT,dojo.hitch(this,this._removeSavedSearch));
        },
        _renderSavedSearchLinks:function(searchLinksData){
            var that=this;
            dojo.forEach(searchLinksData,function(searchLinkItem){
                var currentSearchLink=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.SavedCategorySearchLinkWidget({savedSearchInfo:searchLinkItem});
                that.searchLinksContainer.appendChild(currentSearchLink.domNode);
                that.savedSearchLinkMap[searchLinkItem.searchTitle]=currentSearchLink;
            });
        },
        _addSavedSearch:function(payLoad){
            var searchItemMetaData=payLoad.searchItemMetaData;
            var savedSearchInfo={};
            savedSearchInfo.searchTitle=searchItemMetaData.searchName;
            savedSearchInfo.selectedTags=searchItemMetaData.selectedCategories;
            var currentSearchLink=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.SavedCategorySearchLinkWidget({savedSearchInfo:savedSearchInfo});
            this.searchLinksContainer.appendChild(currentSearchLink.domNode);
            this.savedSearchLinkMap[savedSearchInfo.searchTitle]=currentSearchLink;
        },
        _removeSavedSearch:function(payLoad){
            var searchNeedDelete= this.savedSearchLinkMap[payLoad.searchItemName];
            searchNeedDelete.destroy();
        },
        _endOfCode: function(){}
    });
});