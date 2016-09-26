require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/AdvancedDocumentInfoWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.documentsList.AdvancedDocumentInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        documentsOwnerType:null,
        menu_operationCollection:null,
        documentOperationsDropdownButton:null,
        preview_menuItem:null,
        update_menuItem:null,
        lock_menuItem:null,
        unlock_menuItem:null,
        setTag_menuItem:null,
        addComment_menuItem:null,
        detailInfo_menuItem:null,
        documentLockerDropDown:null,
        lockerNamecardWidget:null,
        knowledgeBaseRecommend_menuItem:null,
        postCreate: function(){
            this.documentName.innerHTML=this.documentInfo.documentName;
            this.documentNamePrompt.innerHTML=this.documentInfo.documentName;
            if(DocumentHandleUtil.isPreviewable(this.documentInfo.documentType,this.documentInfo.documentName)||this.documentInfo.isFolder){
                dojo.style(this.documentName,{"color": "#00475B"});
                dojo.style(this.documentName,{"cursor": "pointer"});
            }else{
                dojo.style(this.documentName,{"color": "#444444"});
            }
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            this.lastModifyDate.innerHTML=dojo.date.locale.format(this.documentInfo.documentLastUpdateDate,dateDisplayFormat);
            this.documentTypeIcon.src=DocumentHandleUtil.getFileTypeIcon(this.documentInfo.documentType,this.documentInfo.isFolder,this.documentInfo.documentName);
            if(this.documentInfo.isFolder){
                dojo.style(this.downloadDocumentButton,{"display": "none"});
                dojo.style(this.modifyDateContainer,{"display": "none"});
                dojo.style(this.contentItemNumberContainer,{"display": ""});
                this.contentItemNumber.innerHTML=this.documentInfo.childDocumentNumber;
            }
            if(this.documentInfo.isLocked){
                dojo.style(this.lockedDocumentPromptContainer,{"display": ""});
                dojo.style(this.deleteDocumentButton,{"display": "none"});
                dojo.style(this.disabledDeleteDocumentButton,{"display": ""});
                if(this.documentInfo.documentLockPerson){
                    var lockerInfoLabel="<i class='icon-user'></i>";
                    lockerInfoLabel=this.documentInfo.documentLockPerson.displayName;
                    this.documentLockerDropDown.set("label",lockerInfoLabel);
                    var participantInfo={};
                    participantInfo.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ this.documentInfo.documentLockPerson.userId;
                    participantInfo.participantId=this.documentInfo.documentLockPerson.userId;
                    participantInfo.participantName=this.documentInfo.documentLockPerson.displayName;
                    participantInfo.participantTitle=this.documentInfo.documentLockPerson.title;
                    participantInfo.participantPhone=this.documentInfo.documentLockPerson.fixedPhone;
                    participantInfo.participantEmail=this.documentInfo.documentLockPerson.emailAddress;
                    participantInfo.participantDesc=this.documentInfo.documentLockPerson.description;
                    participantInfo.participantAddress=this.documentInfo.documentLockPerson.address;
                    this.lockerNamecardWidget=
                        new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:participantInfo});
                    this.documentLockerDropDown.set("dropDown",this.lockerNamecardWidget);
                }
            }else{
                dojo.style(this.deleteDocumentButton,{"display": ""});
                dojo.style(this.disabledDeleteDocumentButton,{"display": "none"});
            }
            if(this.documentInfo.isLinked){
                dojo.style(this.linkedDocumentPromptContainer,{"display": ""});
            }
            this.menu_operationCollection=new dijit.DropDownMenu({ style: "display: none;"});
            var label="<i class='icon-caret-down'></i>";
            this.documentOperationsDropdownButton=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:label,dropDown: this.menu_operationCollection},this.documentOperationListDropdownContainer);
            var that=this;
            var previewMenuLabel;
            if(this.documentInfo.isFolder){
                var currentDocumentPermissions=this.documentInfo.documentPermissions;
                var currentDocumentPermissionsObj=this.documentListWidget.getPermissionControlProperties(currentDocumentPermissions,this.documentInfo.documentCreator);
                if(currentDocumentPermissionsObj.displayContentPermission){
                    previewMenuLabel="<i class='icon-folder-open'></i>&nbsp;&nbsp;显示内容";
                    this.preview_menuItem = new dijit.MenuItem({
                        label: previewMenuLabel,
                        onClick: function(){
                            that.doViewDocumentElement();
                        }
                    });
                    this.menu_operationCollection.addChild(this.preview_menuItem);
                }
            }else{
                previewMenuLabel="<i class='icon-eye-open'></i>&nbsp;&nbsp;预览文件";
                if(DocumentHandleUtil.isPreviewable(this.documentInfo.documentType,this.documentInfo.documentName)){
                    this.preview_menuItem = new dijit.MenuItem({
                        label: previewMenuLabel,
                        onClick: function(){
                            that.doViewDocumentElement();
                        }
                    });
                    this.menu_operationCollection.addChild(this.preview_menuItem);
                }
            }
            if(!this.documentInfo.isFolder){
                if(!this.documentInfo.isLocked){
                    this.update_menuItem = new dijit.MenuItem({
                        label: "<i class='icon-edit'></i>&nbsp;&nbsp;更新文件",
                        onClick: function () {
                            that.doUpdateDocumentElement();
                        }
                    });
                    this.menu_operationCollection.addChild(this.update_menuItem);
                }
                if(this.documentInfo.isLocked){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    if(this.documentInfo.lockedBy==userId){
                        this.unlock_menuItem = new dijit.MenuItem({
                            label: "<i class='icon-unlock'></i>&nbsp;&nbsp;&nbsp;解锁文件",
                            onClick: function(){
                                that.doUnLockDocumentElement();
                            }
                        });
                        this.menu_operationCollection.addChild(this.unlock_menuItem);
                    }
                }else{
                    this.lock_menuItem = new dijit.MenuItem({
                        label: "<i class='icon-lock'></i>&nbsp;&nbsp;&nbsp;&nbsp;锁定文件",
                        onClick: function(){
                            that.doLockDocumentElement();
                        }
                    });
                    this.menu_operationCollection.addChild(this.lock_menuItem);
                }
                if(!this.documentInfo.isLocked) {
                    this.addComment_menuItem = new dijit.MenuItem({
                        label: "<i class='icon-comment-alt'></i>&nbsp;&nbsp;编辑备注",
                        onClick: function () {
                            that.doEditComment();
                        }
                    });
                    this.menu_operationCollection.addChild(this.addComment_menuItem);
                }
            }
            this.detailInfo_menuItem = new dijit.MenuItem({
                label: "&nbsp;<i class='icon-info'></i>&nbsp;&nbsp;&nbsp;&nbsp;详细信息",
                onClick: function(){
                    that.showDocumentElementDetail();
                }
            });
            this.menu_operationCollection.addChild(this.detailInfo_menuItem);
            if(!this.documentInfo.isFolder){
                //need check if integrated with knowledgeBase
                this.knowledgeBaseRecommend_menuItem = new dijit.MenuItem({
                    label: "<i class='fa fa-clone'></i>&nbsp;&nbsp;知识推荐",
                    onClick: function(){
                        that.showKnowledgeBaseRecommendInfoPanel();
                    }
                });
                this.menu_operationCollection.addChild(this.knowledgeBaseRecommend_menuItem);
            }
            this.setupPermissionControl();
        },
        doDeleteDocument:function(){
            var that=this;
            var documentDeleteCallback=function(){
                that.documentListWidget.refreshCurrentFolder();
            };
            this.documentInfo["callback"]= documentDeleteCallback;
            if(this.documentListWidget.documentsOwnerType=="PARTICIPANT"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentListWidget.documentsOwnerType});
            }
            if(this.documentListWidget.documentsOwnerType=="ACTIVITY"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                    taskItemData:this.documentListWidget.taskData.taskItemData,documentsOwnerType:this.documentListWidget.documentsOwnerType});
            }
        },
        doDownloadDocument :function(){
            if(this.documentListWidget.documentsOwnerType=="PARTICIPANT"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentListWidget.documentsOwnerType});
            }
            if(this.documentListWidget.documentsOwnerType=="ACTIVITY"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                    taskItemData:this.documentListWidget.taskData.taskItemData,documentsOwnerType:this.documentListWidget.documentsOwnerType});
            }
        },
        doViewDocumentElement:function(){
            if(this.documentInfo.isFolder){
                var currentFolderPath=this.documentInfo.documentFolderPath;
                var subFolderName=this.documentInfo.documentName;
                this.documentListWidget.goToSubFolderByPath(currentFolderPath,subFolderName);
            }else{
                if(DocumentHandleUtil.isPreviewable(this.documentInfo.documentType,this.documentInfo.documentName)){
                    if(this.documentListWidget.documentsOwnerType=="PARTICIPANT"){
                        Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentListWidget.documentsOwnerType});
                    }
                    if(this.documentListWidget.documentsOwnerType=="ACTIVITY"){
                        Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                            taskItemData:this.documentListWidget.taskData.taskItemData,documentsOwnerType:this.documentListWidget.documentsOwnerType});
                    }
                }
            }
        },
        doUpdateDocumentElement:function(){
            var that=this;
            var documentLockCallback=function(){
                that.documentListWidget.refreshCurrentFolder();
            };
            this.documentInfo["callback"]= documentLockCallback;
            Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_UPDATEDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                taskItemData:this.documentListWidget.taskData.taskItemData,documentsOwnerType:this.documentListWidget.documentsOwnerType});
        },
        doLockDocumentElement:function(){
            var that=this;
            var documentLockCallback=function(){
                that.documentListWidget.refreshCurrentFolder();
            };
            this.documentInfo["callback"]= documentLockCallback;
            Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_LOCKDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                taskItemData:this.documentListWidget.taskData.taskItemData,documentsOwnerType:this.documentListWidget.documentsOwnerType});
        },
        doUnLockDocumentElement:function(){
            var that=this;
            var documentUnlockCallback=function(){
                that.documentListWidget.refreshCurrentFolder();
            };
            this.documentInfo["callback"]= documentUnlockCallback;
            Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_UNLOCKDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                taskItemData:this.documentListWidget.taskData.taskItemData,documentsOwnerType:this.documentListWidget.documentsOwnerType});
        },
        doEditComment:function(){
            var updateDocumentCommentWidget=new vfbam.userclient.common.UI.components.documentsList.DocumentCommentsWidget({
                documentMetaInfo:{documentInfo:this.documentInfo,taskItemData:this.documentListWidget.taskData.taskItemData,
                    documentsOwnerType:this.documentListWidget.documentsOwnerType
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
            var taskItemData=this.documentListWidget.taskData.taskItemData;
            var activityDocumentObj={};
            activityDocumentObj.activitySpaceName=APPLICATION_ID;
            activityDocumentObj.activityName=taskItemData.activityName;
            activityDocumentObj.participantName=userId;
            activityDocumentObj.activityId=taskItemData.activityId;
            activityDocumentObj.parentFolderPath=this.documentInfo.documentFolderPath;
            activityDocumentObj.fileName=this.documentInfo.documentName;
            updateDocumentCommentWidget.loadCommentsList(activityDocumentObj,"ACTIVITY_DOCUMENT");
            dialog.show();
        },
        showDocumentElementDetail:function(){
            var currentDocumentPermissions=this.documentInfo.documentPermissions;
            var currentDocumentPermissionsObj=this.documentListWidget.getPermissionControlProperties(currentDocumentPermissions,this.documentInfo.documentCreator);
            Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_SHOWDOCUMENTDETAIL_EVENT,{documentInfo:this.documentInfo,
                taskItemData:this.documentListWidget.taskData.taskItemData,documentsOwnerType:this.documentListWidget.documentsOwnerType,
                currentDocumentPermissions:currentDocumentPermissionsObj
            });
        },
        showKnowledgeBaseRecommendInfoPanel:function(){
            var currentDocumentPermissions=this.documentInfo.documentPermissions;
            var currentDocumentPermissionsObj=this.documentListWidget.getPermissionControlProperties(currentDocumentPermissions,this.documentInfo.documentCreator);
            Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_SHOWKNOWLEDGEBASERECOMMEND_EVENT,{documentInfo:this.documentInfo,
                taskItemData:this.documentListWidget.taskData.taskItemData,documentsOwnerType:this.documentListWidget.documentsOwnerType,
                currentDocumentPermissions:currentDocumentPermissionsObj
            });
        },
        setupPermissionControl:function(){
            var currentParentFolderFolderPermissions=this.documentListWidget.currentFolderPermissions;
            var currentDocumentPermissions=this.documentInfo.documentPermissions;
            var currentParentFolderPermissionsObj=this.documentListWidget.getPermissionControlProperties(currentParentFolderFolderPermissions,this.documentInfo.documentCreator);
            var currentDocumentPermissionsObj=this.documentListWidget.getPermissionControlProperties(currentDocumentPermissions,this.documentInfo.documentCreator);

            if(this.documentInfo.isFolder){
                if(currentParentFolderPermissionsObj.deleteSubFolderPermission){
                    //can delete current document
                    dojo.style(this.deleteDocumentButton,{"display": ""});
                    dojo.style(this.disabledDeleteDocumentButton,{"display": "none"});
                }else{
                    //can't delete current document
                    dojo.style(this.deleteDocumentButton,{"display": "none"});
                    dojo.style(this.disabledDeleteDocumentButton,{"display": ""});
                }
            }else{
                if(!this.documentInfo.isLocked){
                    if(currentParentFolderPermissionsObj.deleteContentPermission){
                        //can delete current document
                        dojo.style(this.deleteDocumentButton,{"display": ""});
                        dojo.style(this.disabledDeleteDocumentButton,{"display": "none"});
                    }else{
                        //can't delete current document
                        dojo.style(this.deleteDocumentButton,{"display": "none"});
                        dojo.style(this.disabledDeleteDocumentButton,{"display": ""});
                    }
                }
            }
            if(this.documentInfo.isFolder){
                if(currentDocumentPermissionsObj.displayContentPermission){
                    dojo.style(this.documentName,{"display": ""});
                    dojo.style(this.documentNamePrompt,{"display": "none"});
                }else{
                    dojo.style(this.documentName,{"display": "none"});
                    dojo.style(this.documentNamePrompt,{"display": ""});
                }
            }else{
                if(currentParentFolderPermissionsObj.editContentPermission){
                    dojo.style(this.documentOperationContainer,{"display": ""});
                    dojo.style(this.documentOperationPrompt,{"display": "none"});
                }else{
                    dojo.style(this.documentOperationContainer,{"display": "none"});
                    dojo.style(this.documentOperationPrompt,{"display": ""});
                }
            }
        },
        destroy:function(){
            if(this.preview_menuItem){
                this.preview_menuItem.destroy();
            }
            if(this.update_menuItem){
                this.update_menuItem.destroy();
            }
            if(this.lock_menuItem){
                this.lock_menuItem.destroy();
            }
            if(this.unlock_menuItem){
                this.unlock_menuItem.destroy();
            }
            if(this.setTag_menuItem){
                this.setTag_menuItem.destroy();
            }
            if(this.addComment_menuItem){
                this.addComment_menuItem.destroy();
            }
            if(this.detailInfo_menuItem){
                this.detailInfo_menuItem.destroy();
            }
            if(this.knowledgeBaseRecommend_menuItem){
                this.knowledgeBaseRecommend_menuItem.destroy();
            }
            if(this.documentLockerDropDown){
                this.documentLockerDropDown.destroy();
            }
            if(this.lockerNamecardWidget){
                this.lockerNamecardWidget.destroy();
            }
            this.menu_operationCollection.destroy();
            this.documentOperationsDropdownButton.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});