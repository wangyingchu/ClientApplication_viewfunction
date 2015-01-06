require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/documentCenter/widget/documentManager/template/DocumentPreviewWidget.html",
    "dijit/popup","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,popup,Dialog){
    declare("vfbam.userclient.components.documentCenter.widget.documentManager.DocumentPreviewWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        creatorNamecardWidget:null,
        lastUpdatePersonNamecardWidget:null,
        documentTagsInfoList:null,
        addNewTagMenuDialog:null,
        addNewTagDropDown:null,
        documentDetailInfo:null,
        documentInfo:null,
        versionHistoryListMenuDialog:null,
        versionHistoryListDropDown:null,
        addNewTagMenuDialog:null,
        addNewTagDropDown:null,
        documentsOwnerType:null,
        documentExtalInfo:null,
        postCreate: function(){
            this.documentTagsInfoList=[];
            this.renderInitInfo();
        },
        renderDocumentPreview:function(documentInfo,documentsOwnerType,documentExtalInfo){
            this.documentInfo=documentInfo;
            this.documentsOwnerType=documentsOwnerType;
            this.documentExtalInfo=documentExtalInfo;
            this.buildDocumentDetailInfo(documentInfo,documentsOwnerType,documentExtalInfo);
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
            if(documentInfo.documentCreateDate&documentInfo.documentCreateDate.getTime()){
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
            dojo.empty(this.documentTagsContainer);
            dojo.forEach(this.documentTagsInfoList,function(documentTag){
                documentTag.destroy();
            });
            if(documentInfo.isFolder){
                dojo.style(this.documentTagsRootContainer,"display","none");
                dojo.style(this.documentTypeRootContainer,"display","none");
                dojo.style(this.documentVersionInfoContainer,"display","none");
                dojo.style(this.documentCommentContainer,"display","none");
            }else{
                dojo.style(this.documentTagsRootContainer,"display","");
                dojo.style(this.documentTypeRootContainer,"display","");
                dojo.style(this.documentVersionInfoContainer,"display","");
                dojo.style(this.documentCommentContainer,"display","");
                if(documentInfo.documentTags){
                    this.renderDocumentTag(documentInfo.documentTags);
                }
                if(this.addNewTagMenuDialog){
                    this.addNewTagMenuDialog.destroy();
                }
                if(this.addNewTagDropDown){
                    this.addNewTagDropDown.destroy();
                }
                this.documentTypeText.innerHTML=DocumentHandleUtil.getDocumentMainType(documentInfo);
                this.addNewTagMenuDialog=new idx.widget.MenuDialog();
                this.addNewTagDropDown=new vfbam.userclient.common.UI.components.documentsList.AddNewTagWidget({documentPreviewer:this});
                dojo.place(this.addNewTagDropDown.domNode, this.addNewTagMenuDialog.containerNode);
                this.addTagLink.set("dropDown",this.addNewTagMenuDialog);

                var documentMetaInfo={};
                documentMetaInfo.documentsOwnerType=documentsOwnerType;
                documentMetaInfo.documentInfo=documentInfo;
                if(documentExtalInfo.roleName){
                    documentMetaInfo.roleName=documentExtalInfo.roleName;
                }
                if(this.versionHistoryListMenuDialog){
                    this.versionHistoryListMenuDialog.destroy();
                }
                if(this.versionHistoryListDropDown){
                    this.versionHistoryListDropDown.destroy();
                }
                this.versionHistoryListMenuDialog=new idx.widget.MenuDialog();
                this.versionHistoryListDropDown=new vfbam.userclient.common.UI.components.documentsList.DocumentVersionHistoryListWidget({documentMetaInfo:documentMetaInfo,documentExtalInfo:documentExtalInfo});
                dojo.place(this.versionHistoryListDropDown.domNode, this.versionHistoryListMenuDialog.containerNode);
                this.showVersionHistoryLink.set("dropDown",this.versionHistoryListMenuDialog);
            }
        },
        renderDocumentTag:function(documentTags){
            dojo.empty(this.documentTagsContainer);
            dojo.forEach(this.documentTagsInfoList,function(documentTag){
                documentTag.destroy();
            });
            var that=this;
            dojo.forEach(documentTags,function(tagName){
                var tagInfoWidget=new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentTagInfoWidget({tagName:tagName,documentPreviewer:that});
                that.documentTagsContainer.appendChild(tagInfoWidget.domNode);
                that.documentTagsInfoList.push(tagInfoWidget);
            });
        },
        removeDocumentTag:function(tagValue){
            var that=this;
            var callbackFunction=function(newTags){
                that.documentInfo.documentTags=newTags;
                that.renderDocumentTag(newTags);
            };
            Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_REMOVETAG_EVENT,{tag:tagValue,
                documentMetaInfo:this.documentDetailInfo,callback:callbackFunction});
        },
        addDocumentTag:function(tagValue){
            var that=this;
            var callbackFunction=function(newTags){
                that.documentInfo.documentTags=newTags;
                that.renderDocumentTag(newTags);
            };
            Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_ADDTAG_EVENT,{
                tag:tagValue,documentMetaInfo:this.documentDetailInfo,callback:callbackFunction
            });
            popup.close(this.addNewTagMenuDialog);
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
        showCommentsEditor:function(){
            if(this.documentExtalInfo){
                if(this.documentExtalInfo.roleName){
                    this.documentInfo.roleName=this.documentExtalInfo.roleName;
                }
            }
            var updateDocumentCommentWidget=new vfbam.userclient.common.UI.components.documentsList.DocumentCommentsWidget({
                documentMetaInfo:{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType
                }
            });
            var	dialog = new Dialog({
                style:"width:800px;height:490px;",
                title: "<i class='icon-comment-alt'></i>&nbsp;&nbsp;文件备注",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var closeDialogCallBack=function(){
                updateDocumentCommentWidget.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dojo.place(updateDocumentCommentWidget.containerNode, dialog.containerNode);

            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            if(this.documentsOwnerType=="PARTICIPANT"){
                var documentCommentsObj={};
                documentCommentsObj.activitySpaceName=APPLICATION_ID;
                documentCommentsObj.participantName=userId;
                documentCommentsObj.parentFolderPath=this.documentInfo.documentFolderPath;
                documentCommentsObj.fileName=this.documentInfo.documentName;
                updateDocumentCommentWidget.loadCommentsList(documentCommentsObj,"PARTICIPANT_DOCUMENT");
            }
            if(this.documentsOwnerType=="APPLICATIONSPACE"){
                var documentCommentsObj={};
                documentCommentsObj.activitySpaceName=APPLICATION_ID;
                documentCommentsObj.participantName=userId;
                documentCommentsObj.parentFolderPath=this.documentInfo.documentFolderPath;
                documentCommentsObj.fileName=this.documentInfo.documentName;
                updateDocumentCommentWidget.loadCommentsList(documentCommentsObj,"APPLICATIONSPACE_DOCUMENT");
            }
            if(this.documentsOwnerType=="ROLE"){
                var documentCommentsObj={};
                documentCommentsObj.activitySpaceName=APPLICATION_ID;
                documentCommentsObj.participantName=userId;
                documentCommentsObj.parentFolderPath=this.documentInfo.documentFolderPath;
                documentCommentsObj.fileName=this.documentInfo.documentName;
                documentCommentsObj.roleName=this.documentExtalInfo.roleName;
                updateDocumentCommentWidget.loadCommentsList(documentCommentsObj,"ROLE_DOCUMENT");
            }
            dialog.show();
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
            this.documentDetailInfo=previewTempFileGenerateObj;
        },
        _endOfCode: function(){}
    });
});