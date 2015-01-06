require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/RelatedCollectionListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.RelatedCollectionListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeCollectionInfoList:null,
        postCreate: function(){
            this.knowledgeCollectionInfoList=[];
            this.renderSimilarCollectionsList();
        },
        renderSimilarCollectionsList:function(tagsArray){
            dojo.empty(this.knowledgeItemRelatedCollectionInfoContainer);
            dojo.forEach(this.knowledgeCollectionInfoList,function(currentCollectionInfo){
                currentCollectionInfo.destroy();
            });
            var that=this;
            var contentTagsArray;
            if(tagsArray&&tagsArray.length>0){
                contentTagsArray=tagsArray;
            }else{
                contentTagsArray=this.knowledgeCollectionInfo.projectTags;
            }
            var contentTagsQueryStr="";
            dojo.forEach(contentTagsArray,function(currentTag,idx){
                contentTagsQueryStr=contentTagsQueryStr+currentTag;
                if(idx<contentTagsArray.length-1){
                    contentTagsQueryStr=contentTagsQueryStr+",";
                }
            });
            var resturl="";
            if(contentTagsArray.length>0){
                resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getSimilarCollections/"+this.knowledgeCollectionInfo.projectId+"/"+contentTagsQueryStr+"/";
            }else{
                resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getSimilarCollections/"+this.knowledgeCollectionInfo.projectId+"/NA/";
            }
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            resturl=resturl+"?userId="+userId+"&limitCount=50";
            var projectInfoObj = {};
            projectInfoObj.userId = userId;
            projectInfoObj.limitCount = 50;
            var projectInfoObjectContent = dojo.toJson(projectInfoObj);
            var errorCallback = function (data) {
                UI.showSystemErrorMessage(data);
            };
            var loadCallback = function (data) {
                if(data.projects){
                    that.renderSimilarCollections(data.projects);
                }
            };
            if(contentTagsArray.length>0){
                Application.WebServiceUtil.postJSONData(resturl, projectInfoObjectContent, loadCallback, errorCallback);
            }
        },
        renderSimilarCollections:function(collectionList){
            var that=this;
            dojo.forEach(collectionList,function(collectionInfo){
                var currentCollectionInfo=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionInfoWidget({knowledgeCollectionInfo:collectionInfo,popupDialog:that.popupDialog});
                that.knowledgeItemRelatedCollectionInfoContainer.appendChild(currentCollectionInfo.domNode);
                that.knowledgeCollectionInfoList.push(currentCollectionInfo);
            });
        },
        destroy:function(){
            dojo.empty(this.knowledgeItemRelatedCollectionInfoContainer);
            dojo.forEach(this.knowledgeCollectionInfoList,function(currentCollectionInfo){
                currentCollectionInfo.destroy();
            });
            this.knowledgeCollectionInfoList.splice(0, this.knowledgeCollectionInfoList.length);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});