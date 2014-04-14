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
        postCreate: function(){
            this.documentName.innerHTML=this.documentInfo.documentName;
            this.documentTypeIcon.src=DocumentHandleUtil.getFileTypeIcon(this.documentInfo.documentType,this.documentInfo.isFolder,this.documentInfo.documentName);
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            this.createDate.innerHTML=dojo.date.locale.format(this.documentInfo.documentCreateDate,dateDisplayFormat)+" "+
                dojo.date.locale.format(this.documentInfo.documentCreateDate,timeDisplayFormat);
            this.documentVersion.innerHTML=this.documentInfo.version;
            if(this.documentInfo.isFolder){
                dojo.style(this.previewDocumentButton,{"display": "none"});
                dojo.style(this.downloadDocumentButton,{"display": "none"});
                dojo.style(this.updateDocumentButton,{"display": "none"});
                dojo.style(this.addNewChildDocumentButton,{"display": "inline"});
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
            if(this.documentListWidget.documentsOwnerType=="PARTICIPANT"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType});
            }
        },
        updateDocument:function(){
            console.log("updateDocument");
        },
        lockDocument:function(){
            console.log("lockDocument");
        },
        downloadDocument:function(){
            if(this.documentsOwnerType=="PARTICIPANT"){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType});
            }
        },
        previewDocument:function(){
            if(DocumentHandleUtil.isPreviewable(this.documentInfo.documentType,this.documentInfo.documentName)){
                Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT,{documentInfo:this.documentInfo,documentsOwnerType:this.documentsOwnerType});
            }
        },
        addChildDocument:function(){
            console.log("addChildDocument");
        },
        selectDocumentItem:function(){
            if(this.currentSelectedDocumentItemArray&&this.currentSelectedDocumentItemArray.length>0){
                domClass.remove(this.currentSelectedDocumentItemArray[0].documentItemRootContainer, "app_magazineView_item_selected");
                this.currentSelectedDocumentItemArray.splice(0, this.currentSelectedDocumentItemArray.length);
            }
            domClass.add(this.documentItemRootContainer, "app_magazineView_item_selected");
            this.currentSelectedDocumentItemArray.push(this);
            this.documentPreviewWidget.renderDocumentPreview(this.documentInfo);
        },
        destroy:function(){
            dojo.disconnect(this.clickEventConnectionHandler);
            dojo.disconnect(this.doubleClickEventConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});