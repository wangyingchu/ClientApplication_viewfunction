require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/DocumentCommentsWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.DocumentCommentsWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        documentDetailInfo:null,
        advancedCommentsList:null,
        postCreate: function(){
            this.documentTagsInfoList=[];
            var documentInfo=this.documentMetaInfo.documentInfo;
            var documentsOwnerType=this.documentMetaInfo.documentsOwnerType;
            this.renderDocumentPreview(documentInfo,documentsOwnerType);
            this.advancedCommentsList=new vfbam.userclient.common.UI.components.advancedCommentList.AdvancedCommentsListWidget(
                {documentCommentListHeight:285, documentMetaInfo:this.documentMetaInfo},this.documentCommentsListContainer);
        },
        renderDocumentPreview:function(documentInfo,documentsOwnerType,documentExtalInfo){
            this.buildDocumentDetailInfo(documentInfo,documentsOwnerType,documentExtalInfo);
            this.documentNameText.innerHTML= documentInfo.documentName;
            if(DocumentHandleUtil.isThumbnailable(documentInfo.documentType,documentInfo.documentName)){
                this.renderPreviewPicture(documentInfo,documentsOwnerType,documentExtalInfo);
            }else{
                this.documentPreviewPicture.src=DocumentHandleUtil.getPreviewPicURL(documentInfo.documentType,documentInfo.isFolder);
            }
        },
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
                previewTempFileGenerateObj.participantFileInfo.parentFolderPath=documentInfo.documentFolderPath;
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
                previewTempFileGenerateObj.applicationSpaceFileInfo.parentFolderPath=documentInfo.documentFolderPath;
                previewTempFileGenerateObj.applicationSpaceFileInfo.fileName=documentInfo.documentName;
            }
            if(documentsOwnerType=="ROLE"){
                previewTempFileGenerateObj.roleFileInfo={};
                previewTempFileGenerateObj.roleFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.roleFileInfo.participantName=userId;
                previewTempFileGenerateObj.roleFileInfo.roleName=documentInfo.roleName;
                previewTempFileGenerateObj.roleFileInfo.parentFolderPath=documentInfo.documentFolderPath;
                previewTempFileGenerateObj.roleFileInfo.fileName=documentInfo.documentName;
            }
            this.documentDetailInfo=previewTempFileGenerateObj;
        },
        loadCommentsList:function(commentRetriveInfo,commentType){
            this.advancedCommentsList.loadCommentsList(commentRetriveInfo,commentType);
        },
        destroy:function(){
            this.advancedCommentsList.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});