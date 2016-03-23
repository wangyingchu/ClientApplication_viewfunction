require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/KnowledgeBaseRecommendsWidget.html","dijit/popup","dojo/window"
],function(lang,declare, _Widget, _Templated, template,popup,win){
    declare("vfbam.userclient.common.UI.components.documentsList.KnowledgeBaseRecommendsWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        documentTagsInfoList:null,
        addNewTagMenuDialog:null,
        addNewTagDropDown:null,
        documentDetailInfo:null,
        documentInfo:null,
        knowledgeCategoryInheritDataStore:null,
        knowledgeItemAttachedTagEditorWidget:null,
        knowledgeTagInfoMenuDialog:null,
        knowledgeItemsRecommendsWallWidget:null,
        postCreate: function(){
            this.documentTagsInfoList=[];
            var documentInfo=this.documentMetaInfo.documentInfo;
            var documentsOwnerType=this.documentMetaInfo.documentsOwnerType;
            this.renderDocumentPreview(documentInfo,documentsOwnerType);
            this.loadKnowledgeCategories();
            this.loadRecommendedDocuments();
        },
        loadKnowledgeCategories:function(){
            var documentAttachedTags=this.documentMetaInfo.documentInfo.documentTags;
            var that=this;
            var callBack=function(storeData){
                that.knowledgeCategoryInheritDataStore=storeData;
                var knowledgeContentInfo={};
                knowledgeContentInfo.contentTags=documentAttachedTags;
                that.knowledgeItemAttachedTagEditorWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagEditorWidget({
                    knowledgeContentInfo:knowledgeContentInfo,attachedTags:knowledgeContentInfo.contentTags,knowledgeCategoryInheritDataStore:that.knowledgeCategoryInheritDataStore});
                that.knowledgeTagInfoMenuDialog=new idx.widget.MenuDialog({});
                dojo.connect( that.knowledgeTagInfoMenuDialog,"onOpen",that.knowledgeItemAttachedTagEditorWidget,"renderTagItems");
                dojo.place(that.knowledgeItemAttachedTagEditorWidget.domNode, that.knowledgeTagInfoMenuDialog.containerNode);
                var showTagDialogLinklabel="分类标签 <i class='icon-caret-down'></i>";
                new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:showTagDialogLinklabel,dropDown: that.knowledgeTagInfoMenuDialog},that.knowledgeTagSwitcherContainer);
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
        loadRecommendedDocuments:function(){
            var that=this;
            var documentAttachedTags=this.documentMetaInfo.documentInfo.documentTags;
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                var selectedTags=documentAttachedTags;
                var multiTagSearchObj={};
                multiTagSearchObj.nodeType="Tag";
                multiTagSearchObj.filterPropName="categoryId";
                multiTagSearchObj.orderBy="contentDescription";
                multiTagSearchObj.sort="DESC";

                multiTagSearchObj.pageSize=50;
                multiTagSearchObj.currentPageNumber=1;

                multiTagSearchObj.limitCount=1000;
                multiTagSearchObj.paging=true;
                var tagIdsWithDepthMap=[];
                dojo.forEach(selectedTags,function(currentTagValue){
                    var tagInfoObj={};
                    tagInfoObj.propValue=currentTagValue;
                    tagInfoObj.startPathDepth=0;
                    tagInfoObj.pathDepth=4;
                    tagIdsWithDepthMap.push(tagInfoObj);
                });
                multiTagSearchObj.tagIdsWithDepthMap=tagIdsWithDepthMap;
                var multiTagSearchObjContent=dojo.toJson(multiTagSearchObj);
                var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByTagIds/";
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    dojo.style(that.recommendedKnowledgeIconContainer,"display","none");
                    if(data){
                        if(data.docs&&data.docs.length!=0){
                            dojo.style(that.recommendsResultContainer,"display","");
                        }else{
                            dojo.style(that.noResultContainer,"display","");
                        }
                    }
                    var documentList=data.docs;
                    that.knowledgeItemsRecommendsWallWidget=new vfbam.userclient.common.UI.components.documentsList.KnowledgeItemsRecommendsWallWidget({knowledgeMetaInfo:documentList});
                    that.recommendsResultContainer.appendChild(that.knowledgeItemsRecommendsWallWidget.domNode);
                };
                Application.WebServiceUtil.postJSONData(resturl,multiTagSearchObjContent,loadCallback,errorCallback);
                timer.stop();
            };
            timer.start();
        },
        renderDocumentPreview:function(documentInfo,documentsOwnerType,documentExtalInfo){
            this.documentInfo=documentInfo;
            this.buildDocumentDetailInfo(documentInfo,documentsOwnerType,documentExtalInfo);
            dojo.style(this.previewContainer,"display","");
            this.documentNameText.innerHTML= documentInfo.documentName;
            if(!documentInfo.isFolder&&DocumentHandleUtil.isThumbnailable(documentInfo.documentType,documentInfo.documentName)){
                this.renderPreviewPicture(documentInfo,documentsOwnerType,documentExtalInfo);
            }else{
                this.documentPreviewPicture.src=DocumentHandleUtil.getPreviewPicURL(documentInfo.documentType,documentInfo.isFolder);
            }
            var recommendsFileViewerHeight=win.getBox().h-345;
            this.recommendedKnowledgeFileDisplayZone.style.height=""+recommendsFileViewerHeight+"px";
        },
        showPreviousItems:function(){},
        showNextItems:function(){},
        renderPreviewPicture:function(documentInfo,documentsOwnerType,documentExtalInfo){
            this.documentPreviewPicture.src="vfbam/userclient/css/image/loading.gif";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(resultData){
                if(resultData.generateResult){
                    var previewFilePath=resultData.previewFileLocation+resultData.previewFileName+"&timestamp="+new Date().getTime();
                    that.documentPreviewPicture.src=previewFilePath;
                }else{
                }
            };
            var previewTempFileGenerateInfoContent=dojo.toJson(this.documentDetailInfo);
            var resturl=CONTENT_SERVICE_ROOT+"generateThumbnailFile/";
            Application.WebServiceUtil.postJSONData(resturl,previewTempFileGenerateInfoContent,loadCallback,errorCallback);
        },
        buildDocumentDetailInfo:function(documentInfo,documentsOwnerType,documentExtalInfo){
            var previewTempFileGenerateObj={};
            previewTempFileGenerateObj.documentsOwnerType=documentsOwnerType;
            previewTempFileGenerateObj.activitySpaceName=APPLICATION_ID;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            if(documentsOwnerType=="PARTICIPANT"){
                previewTempFileGenerateObj.participantFileInfo={};
                previewTempFileGenerateObj.participantFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.participantFileInfo.participantName=userId;
                previewTempFileGenerateObj.participantFileInfo.parentFolderPath=documentExtalInfo.parentFolderPath;
                previewTempFileGenerateObj.participantFileInfo.fileName=documentInfo.documentName;
            }
            if(documentsOwnerType=="ACTIVITY"){
                previewTempFileGenerateObj.activityTypeFileInfo={};
                previewTempFileGenerateObj.activityTypeFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.activityTypeFileInfo.activityName=this.documentMetaInfo.taskItemData.activityName;
                previewTempFileGenerateObj.activityTypeFileInfo.activityId=this.documentMetaInfo.taskItemData.activityId;
                previewTempFileGenerateObj.activityTypeFileInfo.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                previewTempFileGenerateObj.activityTypeFileInfo.fileName=documentInfo.documentName;
            }
            if(documentsOwnerType=="APPLICATIONSPACE"){
                previewTempFileGenerateObj.applicationSpaceFileInfo={};
                previewTempFileGenerateObj.applicationSpaceFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.applicationSpaceFileInfo.participantName=userId;
                previewTempFileGenerateObj.applicationSpaceFileInfo.parentFolderPath=documentExtalInfo.parentFolderPath;
                previewTempFileGenerateObj.applicationSpaceFileInfo.fileName=documentInfo.documentName;
            }
            if(documentsOwnerType=="ROLE"){
                previewTempFileGenerateObj.roleFileInfo={};
                previewTempFileGenerateObj.roleFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.roleFileInfo.participantName=userId;
                previewTempFileGenerateObj.roleFileInfo.roleName=documentExtalInfo.roleName;
                previewTempFileGenerateObj.roleFileInfo.parentFolderPath=documentExtalInfo.parentFolderPath;
                previewTempFileGenerateObj.roleFileInfo.fileName=documentInfo.documentName;
            }
            this.documentDetailInfo=previewTempFileGenerateObj;
        },
        destroy:function(){
            if(this.addNewTagMenuDialog){
                this.addNewTagMenuDialog.destroy();
            }
            if(this.addNewTagDropDown){
                this.addNewTagDropDown.destroy();
            }
            if(this.knowledgeItemAttachedTagEditorWidget){
                this.knowledgeItemAttachedTagEditorWidget.destroy();
            }
            if(this.knowledgeTagInfoMenuDialog){
                this.knowledgeTagInfoMenuDialog.destroy();
            }
            if(this.knowledgeItemsRecommendsWallWidget){
                this.knowledgeItemsRecommendsWallWidget.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});