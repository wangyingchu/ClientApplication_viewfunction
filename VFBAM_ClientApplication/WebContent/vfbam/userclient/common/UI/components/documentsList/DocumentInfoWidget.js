require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/DocumentInfoWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.DocumentInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        documentsOwnerType:null,
        postCreate: function(){
            this.documentName.innerHTML=this.documentInfo.documentName;
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
                //console.log(this.documentInfo.documentType);
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
        _endOfCode: function(){}
    });
});