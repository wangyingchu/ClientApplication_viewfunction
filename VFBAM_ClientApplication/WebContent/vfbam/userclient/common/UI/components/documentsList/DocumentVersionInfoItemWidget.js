require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/DocumentVersionInfoItemWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.DocumentVersionInfoItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        versionUpdatePersonNameCardWidget:null,
        postCreate: function(){
            this.versionNumber.innerHTML="v "+this.documentVersionInfo.versionNumber;
            this.versionUpdateDate.innerHTML= dojo.date.locale.format(new Date(this.documentVersionInfo.versionCreatedDate));

            var versionUpdatePersion=this.documentVersionInfo.documentContent.documentLastUpdatePerson;
            var documentLastModifiedParticipantInfo={};
            documentLastModifiedParticipantInfo.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ versionUpdatePersion.userId;
            documentLastModifiedParticipantInfo.participantId=versionUpdatePersion.userId;
            documentLastModifiedParticipantInfo.participantName=versionUpdatePersion.displayName;
            documentLastModifiedParticipantInfo.participantTitle=versionUpdatePersion.title;
            documentLastModifiedParticipantInfo.participantPhone=versionUpdatePersion.fixedPhone;
            documentLastModifiedParticipantInfo.participantEmail=versionUpdatePersion.emailAddress;
            documentLastModifiedParticipantInfo.participantDesc=versionUpdatePersion.description;
            documentLastModifiedParticipantInfo.participantAddress=versionUpdatePersion.address;
            this.versionUpdatePersonNameCardWidget=
                new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:documentLastModifiedParticipantInfo});
            this.versionUpdatePersonText.set("label",documentLastModifiedParticipantInfo.participantName);
            this.versionUpdatePersonText.set("dropDown",this.versionUpdatePersonNameCardWidget);
        },
        previewVersionDocument:function(){
            if(this.documentMetaInfo.documentsOwnerType=="ACTIVITY"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT,{documentInfo:this.documentMetaInfo.documentInfo,
                    taskItemData:this.documentMetaInfo.taskItemData,documentsOwnerType:this.documentMetaInfo.documentsOwnerType,documentVersionNumber:this.documentVersionInfo.versionNumber});
            }
        },
        downloadVersionDocument:function(){
            if(this.documentMetaInfo.documentsOwnerType=="ACTIVITY"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADHISTORYDOCUMENT_EVENT,{documentInfo:this.documentMetaInfo.documentInfo,
                    taskItemData:this.documentMetaInfo.taskItemData,documentsOwnerType:this.documentMetaInfo.documentsOwnerType,documentVersionNumber:this.documentVersionInfo.versionNumber});
            }
        },
        destroy:function(){
            this.versionUpdatePersonNameCardWidget.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});