require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemBelongedCollectionInfoWidget.html","dijit/popup"
],function(lang,declare, _Widget, _Templated, template,popup){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        clickEventConnectionHandler:null,
        postCreate: function(){
            var coverKnowledgeItem=this.knowledgeCollectionInfo.docs[0];
            var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+coverKnowledgeItem.bucketName+"/"+coverKnowledgeItem.contentName+"?contentMimeType="+
                coverKnowledgeItem.contentMimeType;
            if(KNOWLEDGEMODIFICATION_PREVIEW_UPDATED_ITEM[coverKnowledgeItem.contentLocation]){
                var timeStamp=new Date().getTime();
                previewFileLocation=previewFileLocation+"&timestamp="+timeStamp;
            }
            this.collectionMainPicture.src=previewFileLocation;
            this.collectionName.innerHTML=this.knowledgeCollectionInfo.projectName;
            this.knowledgeItemNumber.innerHTML=this.knowledgeCollectionInfo.docTotalCountPerProject;
            this.publisherName.innerHTML=this.knowledgeCollectionInfo.projectCreatedBy;
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var uploadDate=new Date(this.knowledgeCollectionInfo.projectCreatedTime);
            var dateString=dojo.date.locale.format(uploadDate,dateDisplayFormat);
            this.publishDate.innerHTML=dateString;
            this.clickEventConnectionHandler=dojo.connect(this.domNode,"onclick",dojo.hitch(this,this.openCollectionDetail));
        },
        openCollectionDetail:function(){
            popup.close(this.popupDialog);
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
                KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_SINGLE,
                KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_COLLECTION,
                KNOWLEDGE_VIEW_DATA:{
                    DISPLAY_TITLE:this.knowledgeCollectionInfo.projectName,
                    VIEW_METADATA:this.knowledgeCollectionInfo
                }
            });
        },
        destroy:function(){
            dojo.disconnect(this.clickEventConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});