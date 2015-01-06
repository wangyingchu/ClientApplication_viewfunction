require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/documentCenter/widget/documentManager/template/DocumentDetailInfoWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.documentCenter.widget.documentManager.DocumentDetailInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        clickEventConnectionHandler:null,
        doubleClickEventConnectionHandler:null,
        isCurrentDocumentLocked:null,
        lockerNamecardWidget:null,
        currentDocumentLocker:null,
        postCreate: function(){
            this.documentName.innerHTML=this.documentInfo.documentName;
            if(DocumentHandleUtil.isPreviewable(this.documentInfo.documentType,this.documentInfo.documentName)||this.documentInfo.isFolder){
                dojo.style(this.documentName,{"color": "#00475B"});
                dojo.style(this.documentName,{"cursor": "pointer"});
            }else{
                dojo.style(this.documentName,{"color": "#444444"});
            }
            this.documentTypeIcon.src=DocumentHandleUtil.getFileTypeIcon(this.documentInfo.documentType,this.documentInfo.isFolder,this.documentInfo.documentName);
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            if(this.documentInfo.isFolder){
                dojo.style(this.createDateContainer,{"display": "none"});
            }else{
                this.createDate.innerHTML=dojo.date.locale.format(this.documentInfo.documentCreateDate,dateDisplayFormat)+" "+
                    dojo.date.locale.format(this.documentInfo.documentCreateDate,timeDisplayFormat);
            }
            if(this.documentInfo.isDocumentLocked){
                this.isCurrentDocumentLocked=true;
            }else{
                this.isCurrentDocumentLocked=false;
            }
            if(this.documentInfo.documentLockPerson){
                this.currentDocumentLocker=this.documentInfo.documentLockPerson;
            }else{
                this.currentDocumentLocker=null;
            }
            this._setDocumentLockStatusUIElement();
            if(this.documentInfo.isFolder){
                dojo.style(this.openFolderButton,{"display": "inline"});
                dojo.style(this.previewDocumentButton,{"display": "none"});
                dojo.style(this.downloadDocumentButton,{"display": "none"});
                this.folderChildrenNumber.innerHTML="("+this.documentInfo.childrenNumber+")";
            }
            this.documentVersion.innerHTML=this.documentInfo.version;
            if(this.documentInfo.isFolder){
                dojo.style(this.openFolderButton,{"display": "inline"});
                dojo.style(this.previewDocumentButton,{"display": "none"});
                dojo.style(this.downloadDocumentButton,{"display": "none"});
                this.folderChildrenNumber.innerHTML="("+this.documentInfo.childrenNumber+")";
            }
            if(!DocumentHandleUtil.isPreviewable(this.documentInfo.documentType,this.documentInfo.documentName)){
                dojo.style(this.previewDocumentButton,{"display": "none"});
            }
            this.clickEventConnectionHandler=dojo.connect(this.domNode,"onclick",dojo.hitch(this,this.selectDocumentItem));
            this.doubleClickEventConnectionHandler=dojo.connect(this.domNode,"ondblclick",dojo.hitch(this,this.previewDocument));
        },
        deleteDocument:function(){
            var that=this;
            var documentDeleteCallback=function(){
                that.documentListWidget.refreshCurrentFolder();
            };
            this.documentInfo["callback"]= documentDeleteCallback;
            if(this.documentsOwnerType=="ROLE"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                    documentsOwnerType:this.documentsOwnerType,roleName:this.documentListWidget.roleName});
            }else{
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType});
            }
        },
        updateDocument:function(){
            var that=this;
            var documentLockCallback=function(){
                that.documentListWidget.refreshCurrentFolder();
            };
            this.documentInfo["callback"]= documentLockCallback;
            if(this.documentListWidget.roleName){
                this.documentInfo.roleName=this.documentListWidget.roleName;
            }
            Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_UPDATEDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                documentsOwnerType:this.documentsOwnerType});
        },
        lockDocument:function(){
            var that=this;
            var documentDeleteCallback=function(){
                UI.showToasterMessage({
                    type:"info",
                    message:"锁定操作成功"
                });
                that.isCurrentDocumentLocked=true;
                var currentDocumentLockerObj={};
                currentDocumentLockerObj.participantAddress=Application.AttributeContext.getAttribute(USER_PROFILE).address;
                currentDocumentLockerObj.participantDesc=Application.AttributeContext.getAttribute(USER_PROFILE).description;
                currentDocumentLockerObj.participantEmail=Application.AttributeContext.getAttribute(USER_PROFILE).emailAddress;
                currentDocumentLockerObj.participantId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                currentDocumentLockerObj.participantName=Application.AttributeContext.getAttribute(USER_PROFILE).displayName;
                currentDocumentLockerObj.participantPhone=Application.AttributeContext.getAttribute(USER_PROFILE).fixedPhone;
                currentDocumentLockerObj.participantTitle=Application.AttributeContext.getAttribute(USER_PROFILE).title;
                currentDocumentLockerObj.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+
                    Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                that.currentDocumentLocker=currentDocumentLockerObj;
                that._setDocumentLockStatusUIElement();
            };
            this.documentInfo["callback"]= documentDeleteCallback;
            if(this.documentsOwnerType=="ROLE"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_LOCKDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                    documentsOwnerType:this.documentsOwnerType,roleName:this.documentListWidget.roleName});
            }else{
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_LOCKDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType});
            }
        },
        unLockDocument:function(){
            var that=this;
            var documentDeleteCallback=function(){
                UI.showToasterMessage({
                    type:"info",
                    message:"解锁操作成功"
                });
                that.isCurrentDocumentLocked=false;
                that.currentDocumentLocker=null;
                that._setDocumentLockStatusUIElement();
            };
            this.documentInfo["callback"]= documentDeleteCallback;
            if(this.documentsOwnerType=="ROLE"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_UNLOCKDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                    documentsOwnerType:this.documentsOwnerType,roleName:this.documentListWidget.roleName});
            }else{
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_UNLOCKDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType});
            }
        },
        addChildDocument:function(){
            console.log("addChildDocument");
        },
        downloadDocument:function(){
            if(this.documentsOwnerType=="ROLE"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                    documentsOwnerType:this.documentsOwnerType,roleName:this.documentListWidget.roleName});
            }else{
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType});
            }
        },
        previewDocument:function(){
            if(this.documentInfo.isFolder){
                var currentFolderPath=this.documentInfo.documentFolderPath;
                var subFolderName=this.documentInfo.documentName;
                this.documentListWidget.goToSubFolderByPath(currentFolderPath,subFolderName);
            }else{
                if(DocumentHandleUtil.isPreviewable(this.documentInfo.documentType,this.documentInfo.documentName)){
                    if(this.documentsOwnerType=="ROLE"){
                        Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT,{documentInfo:this.documentInfo,
                            documentsOwnerType:this.documentsOwnerType,roleName:this.documentListWidget.roleName});
                    }else{
                        Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType});
                    }
                }
            }
        },
        selectDocumentItem:function(){
            if(this.currentSelectedDocumentItemArray&&this.currentSelectedDocumentItemArray.length>0){
                domClass.remove(this.currentSelectedDocumentItemArray[0].documentItemRootContainer, "app_magazineView_item_selected");
                this.currentSelectedDocumentItemArray.splice(0, this.currentSelectedDocumentItemArray.length);
            }
            domClass.add(this.documentItemRootContainer, "app_magazineView_item_selected");
            this.currentSelectedDocumentItemArray.push(this);
            var previewFileExtraInfo={};
            if(this.documentListWidget.parentFolderPath=="/"){
                previewFileExtraInfo["parentFolderPath"]=this.documentListWidget.parentFolderPath+ this.documentListWidget.currentFolderName;
            }else{
                previewFileExtraInfo["parentFolderPath"]=this.documentListWidget.parentFolderPath+"/"+ this.documentListWidget.currentFolderName;
            }
            if(this.documentsOwnerType=="ROLE"){
                previewFileExtraInfo["roleName"]=this.documentListWidget.roleName;
                this.documentPreviewWidget.renderDocumentPreview(this.documentInfo,this.documentsOwnerType,previewFileExtraInfo);
            }else{
                this.documentPreviewWidget.renderDocumentPreview(this.documentInfo,this.documentsOwnerType,previewFileExtraInfo);
            }
        },
        _setDocumentLockStatusUIElement:function(){
            dojo.style(this.documentUnlockButton,{"display": "none"});
            dojo.style(this.documentUnlockButtonDisabled,{"display": "none"});
            dojo.style(this.documentLockButton,{"display": "none"});
            dojo.style(this.deleteDocumentButton,{"display": "none"});
            dojo.style(this.deleteDocumentButtonDisabled,{"display": "none"});
            dojo.style(this.updateDocumentButton,{"display": "none"});
            dojo.style(this.updateDocumentButtonDisabled,{"display": "none"});
            //dojo.style(this.addNewChildDocumentButton,{"display": "none"});
            //dojo.style(this.addNewChildDocumentButtonDisabled,{"display": "none"});
            if(this.lockerNamecardWidget){
                this.lockerNamecardWidget.destroy();
            }
            if(this.isCurrentDocumentLocked){
                dojo.style(this.deleteDocumentButtonDisabled,{"display": "inline"});
                if(this.documentInfo.isFolder){
                    //dojo.style(this.addNewChildDocumentButtonDisabled,{"display": "inline"});
                }else{
                    dojo.style(this.updateDocumentButtonDisabled,{"display": "inline"});
                }
                if(this.currentDocumentLocker){
                    var lockerInfoLabel=this.currentDocumentLocker.participantName;
                    this.documentLockerDropDown.set("label",lockerInfoLabel);
                    this.lockerNamecardWidget=
                        new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:this.currentDocumentLocker});
                    this.documentLockerDropDown.set("dropDown",this.lockerNamecardWidget);
                    var lockerId=this.currentDocumentLocker.participantId;
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    dojo.style(this.lockedDocumentPromptContainer,{"display": ""});
                    if(lockerId==userId){
                        dojo.style(this.documentUnlockButton,{"display": "inline"});
                    }else{
                        dojo.style(this.documentUnlockButtonDisabled,{"display": "inline"});
                    }
                }
            }else{
                dojo.style(this.documentLockButton,{"display": "inline"});
                dojo.style(this.deleteDocumentButton,{"display": "inline"});
                if(this.documentInfo.isFolder){
                    //dojo.style(this.addNewChildDocumentButton,{"display": "inline"});
                    dojo.style(this.documentUnlockButton,{"display": "none"});
                    dojo.style(this.documentLockButton,{"display": "none"});

                }else{
                    dojo.style(this.updateDocumentButton,{"display": "inline"});
                    dojo.style(this.lockedDocumentPromptContainer,{"display": "none"});
                }
            }
        },
        destroy:function(){
            dojo.disconnect(this.clickEventConnectionHandler);
            dojo.disconnect(this.doubleClickEventConnectionHandler);
            if(this.lockerNamecardWidget){
                this.lockerNamecardWidget.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});