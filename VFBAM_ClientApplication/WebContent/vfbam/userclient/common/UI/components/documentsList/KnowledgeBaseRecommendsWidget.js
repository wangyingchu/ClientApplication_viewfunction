require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/KnowledgeBaseRecommendsWidget.html","dijit/popup"
],function(lang,declare, _Widget, _Templated, template,popup){
    declare("vfbam.userclient.common.UI.components.documentsList.KnowledgeBaseRecommendsWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        creatorNamecardWidget:null,
        lastUpdatePersonNamecardWidget:null,
        documentTagsInfoList:null,
        addNewTagMenuDialog:null,
        addNewTagDropDown:null,
        versionHistoryListMenuDialog:null,
        versionHistoryListDropDown:null,
        documentDetailInfo:null,
        documentInfo:null,
        permissionControlPanel:null,
        postCreate: function(){
            this.documentTagsInfoList=[];
            var documentInfo=this.documentMetaInfo.documentInfo;
            var documentsOwnerType=this.documentMetaInfo.documentsOwnerType;
            this.renderDocumentPreview(documentInfo,documentsOwnerType);
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
            if(this.permissionControlPanel){
                this.permissionControlPanel.persistPermissionConfigChange();
            }
            if(this.creatorNamecardWidget){
                this.creatorNamecardWidget.destroy();
            }
            if(this.lastUpdatePersonNamecardWidget){
                this.lastUpdatePersonNamecardWidget.destroy();
            }
            if(this.addNewTagMenuDialog){
                this.addNewTagMenuDialog.destroy();
            }
            if(this.addNewTagDropDown){
                this.addNewTagDropDown.destroy();
            }
            if(this.versionHistoryListMenuDialog){
                this.versionHistoryListMenuDialog.destroy();
            }
            if(this.versionHistoryListDropDown){
                this.versionHistoryListDropDown.destroy();
            }
            if(this.permissionControlPanel){
                this.permissionControlPanel.destroy();
            }
            if(this.permissionControlPanel){
                this.permissionControlPanel.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});