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
        renderDocumentPreview:function(documentInfo){
            dojo.style(this.previewContainer,"display","");
            dojo.style(this.initInfoContainer,"display","none");
            this.documentNameText.innerHTML= documentInfo.documentName;

            if(documentInfo.isFolder){
                this.documentSizeTxt.innerHTML="子文件数量";
                this.documentSizeText.innerHTML= documentInfo.childrenNumber;
            }else{
                this.documentSizeTxt.innerHTML="文件大小";
                this.documentSizeText.innerHTML= documentInfo.documentSize;
            }

            this.documentVersionText.innerHTML="v "+ documentInfo.version;
            if(this.creatorNamecardWidget){
                this.creatorNamecardWidget.destroy();
            }
            this.creatorNamecardWidget=
                new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:documentInfo.documentCreator});
            this.documentCreatorText.set("label",documentInfo.documentCreator.participantName);
            this.documentCreatorText.set("dropDown",this.creatorNamecardWidget);
            this.documentCreateDateText.innerHTML= dojo.date.locale.format(documentInfo.documentCreateDate);

            if(this.lastUpdatePersonNamecardWidget){
                this.lastUpdatePersonNamecardWidget.destroy();
            }
            if(documentInfo.isFolder){
                dojo.style(this.lastUpdatePersonRootContainer,"display","none");
                dojo.style(this.lastUpdateDateRootContainer,"display","none");
            }else{
                dojo.style(this.lastUpdatePersonRootContainer,"display","");
                dojo.style(this.lastUpdateDateRootContainer,"display","");
                this.lastUpdatePersonNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:documentInfo.documentLastUpdatePerson});
                this.documentLastUpdatePersonText.set("label",documentInfo.documentLastUpdatePerson.participantName);
                this.documentLastUpdatePersonText.set("dropDown",this.lastUpdatePersonNamecardWidget);
                this.documentLastUpdateDateText.innerHTML=dojo.date.locale.format(documentInfo.documentLastUpdateDate);
                this.documentPreviewPicture.src=this.getPreviewPicURL(documentInfo.documentType,documentInfo.isFolder);
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
        getPreviewPicURL:function(documentType,isFolder){
            if(isFolder){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/folderDocument.png";
            }else{
                if(documentType=="PDF"){
                    return "vfbam/userclient/css/image/fileType/fileTypePreview/pdfDocument.png";
                }
                if(documentType=="PPT"){
                    return "vfbam/userclient/css/image/fileType/fileTypePreview/pptDocument.png";
                }
                if(documentType=="DOC"){
                    return "vfbam/userclient/css/image/fileType/fileTypePreview/wordDocument.png";
                }
                if(documentType=="XLS"){
                    return "vfbam/userclient/css/image/fileType/fileTypePreview/excelDocument.png";
                }
                if(documentType=="TXT"){
                    return "vfbam/userclient/css/image/fileType/fileTypePreview/textDocument.png";
                }
                if(documentType=="JPG"){
                    //load preview
                    return "images/222122my3ue60tnlly68ee.jpg";
                }
                return "vfbam/userclient/css/image/fileType/fileTypePreview/genericDocument.png";
            }
        },
        _endOfCode: function(){}
    });
});