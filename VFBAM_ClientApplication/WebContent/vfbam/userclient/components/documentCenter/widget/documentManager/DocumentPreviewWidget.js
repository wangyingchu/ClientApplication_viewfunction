require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/documentCenter/widget/documentManager/template/DocumentPreviewWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.documentCenter.widget.documentManager.DocumentPreviewWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        creatorNamecardWidget:null,
        lastUpdatePersonNamecardWidget:null,
        postCreate: function(){
            this.renderInitInfo();
        },
        renderDocumentPreview:function(documentInfo,documentsOwnerType,documentExtalInfo){
            dojo.style(this.previewContainer,"display","");
            dojo.style(this.initInfoContainer,"display","none");
            this.documentNameText.innerHTML= documentInfo.documentName;

            if(documentInfo.isFolder){
                this.documentSizeTxt.innerHTML="子文件数量";
                this.documentSizeText.innerHTML= documentInfo.childrenNumber;
            }else{
                var num;
                var fileSize;
                if(documentInfo.documentSize>1024000){
                    num = new Number(documentInfo.documentSize/1024000);
                    fileSize=num.toFixed(2)+" MB";
                }else{
                    num = new Number(documentInfo.documentSize/1024);
                    fileSize=num.toFixed(0)+" KB";
                }
                this.documentSizeTxt.innerHTML="文件大小";
                this.documentSizeText.innerHTML=fileSize;
            }
            this.documentVersionText.innerHTML="v "+ documentInfo.version;

            if(this.creatorNamecardWidget){
                this.creatorNamecardWidget.destroy();
            }
            if(documentInfo.documentCreator){
                this.creatorNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:documentInfo.documentCreator});
                this.documentCreatorText.set("label",documentInfo.documentCreator.participantName);
                this.documentCreatorText.set("dropDown",this.creatorNamecardWidget);
                dojo.style(this.creatorRootContainer,"display","");

            }else{
                dojo.style(this.creatorRootContainer,"display","none");
            }
            if(documentInfo.documentCreateDate&documentInfo.documentCreateDate.getTime()!=0){
                this.documentCreateDateText.innerHTML= dojo.date.locale.format(documentInfo.documentCreateDate);
                dojo.style(this.creatorDateRootContainer,"display","");
            }else{
                dojo.style(this.creatorDateRootContainer,"display","none");
            }
            if(this.lastUpdatePersonNamecardWidget){
                this.lastUpdatePersonNamecardWidget.destroy();
            }
            if(documentInfo.isFolder){
                dojo.style(this.lastUpdatePersonRootContainer,"display","none");
                dojo.style(this.lastUpdateDateRootContainer,"display","none");
            }else{
                if(documentInfo.documentLastUpdatePerson){
                    this.lastUpdatePersonNamecardWidget=
                        new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:documentInfo.documentLastUpdatePerson});
                    this.documentLastUpdatePersonText.set("label",documentInfo.documentLastUpdatePerson.participantName);
                    this.documentLastUpdatePersonText.set("dropDown",this.lastUpdatePersonNamecardWidget);
                    this.documentLastUpdateDateText.innerHTML=dojo.date.locale.format(documentInfo.documentLastUpdateDate);
                    dojo.style(this.lastUpdatePersonRootContainer,"display","");
                    dojo.style(this.lastUpdateDateRootContainer,"display","");
                }else{
                    dojo.style(this.lastUpdatePersonRootContainer,"display","none");
                    dojo.style(this.lastUpdateDateRootContainer,"display","none");
                }
            }
            if(!documentInfo.isFolder&&DocumentHandleUtil.isThumbnailable(documentInfo.documentType,documentInfo.documentName)){
                this.renderPreviewPicture(documentInfo,documentsOwnerType,documentExtalInfo);
            }else{
                this.documentPreviewPicture.src=DocumentHandleUtil.getPreviewPicURL(documentInfo.documentType,documentInfo.isFolder);
            }
        },
        renderInitInfo:function(){
            if(this.creatorNamecardWidget){
                this.creatorNamecardWidget.destroy();
            }
            if(this.lastUpdatePersonNamecardWidget){
                this.lastUpdatePersonNamecardWidget.destroy();
            }
            dojo.style(this.previewContainer,"display","none");
            dojo.style(this.initInfoContainer,"display","");
        },
        renderPreviewPicture:function(documentInfo,documentsOwnerType,documentExtalInfo){
            this.documentPreviewPicture.src="vfbam/userclient/css/image/loading.gif";
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
            /*
            if(documentsOwnerType=="ACTIVITY"){
                previewTempFileGenerateObj.activityTypeFileInfo={};
                previewTempFileGenerateObj.activityTypeFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.activityTypeFileInfo.activityName=this.documentMetaInfo.taskItemData.activityName;
                previewTempFileGenerateObj.activityTypeFileInfo.activityId=this.documentMetaInfo.taskItemData.activityId;
                previewTempFileGenerateObj.activityTypeFileInfo.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                previewTempFileGenerateObj.activityTypeFileInfo.fileName=documentInfo.documentName;
            }
            */
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
            var previewTempFileGenerateInfoContent=dojo.toJson(previewTempFileGenerateObj);
            var resturl=CONTENT_SERVICE_ROOT+"generateThumbnailFile/";
            Application.WebServiceUtil.postJSONData(resturl,previewTempFileGenerateInfoContent,loadCallback,errorCallback);
        },
        _endOfCode: function(){}
    });
});