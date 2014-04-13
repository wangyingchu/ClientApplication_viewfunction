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
            if(documentInfo.documentCreator){
                this.creatorNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:documentInfo.documentCreator});
                this.documentCreatorText.set("label",documentInfo.documentCreator.participantName);
                this.documentCreatorText.set("dropDown",this.creatorNamecardWidget);
                dojo.style(this.creatorRootContainer,"display","");

            }else{
                dojo.style(this.creatorRootContainer,"display","none");
            }
            if(documentInfo.documentCreateDate&&documentInfo.documentCreateDate.getTime()!=0){
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
        _endOfCode: function(){}
    });
});