require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/RecommendedKnowledgeIconWidget.html"
    ,"dojo/on"
],function(lang,declare, _Widget, _Templated, template,on){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.RecommendedKnowledgeIconWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        mouseClickEventListener:null,
        knowledgeInfoTooltip:null,
        postCreate: function(){
            var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName+"?contentMimeType="+
                this.knowledgeContentInfo.contentMimeType;
            if(KNOWLEDGEMODIFICATION_PREVIEW_UPDATED_ITEM[this.knowledgeContentInfo.contentLocation]){
                var timeStamp=new Date().getTime();
                previewFileLocation=previewFileLocation+"&timestamp="+timeStamp;
            }
            this.knowledgeIconPicture.src=previewFileLocation;
            var that=this;
            var documentType=KnowledgeBaseDataHandleUtil.getDocumentMainType(this.knowledgeContentInfo);
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            var uploadDate=new Date(this.knowledgeContentInfo.contentCreatedTime);
            var dateString=dojo.date.locale.format(uploadDate,dateDisplayFormat);
            var timeString=dojo.date.locale.format(uploadDate,timeDisplayFormat);
            var uploadTimeTxt=dateString+" "+timeString;

            var tooltipLabel='<table  width="100%">'+
                '<tr>'+
                '<td style="text-align: right; font-size: 0.9em;color: #333333;padding-top: 10px;"><i class="icon-comment"></i> 描述：</td>'+
            '<td style="text-align: left; font-size: 0.9em;font-weight:bold;color: #333333;padding-top: 10px;" data-dojo-attach-point="descTxt">'+this.knowledgeContentInfo.contentDescription+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td style="text-align: right; font-size: 0.9em;color: #333333;padding-top: 5px;"><i class="icon-info-sign"></i> 类型：</td>'+
            '<td style="text-align: left; font-size: 0.9em;font-weight:bold;color: #333333;padding-top: 5px;" data-dojo-attach-point="fileTypeTxt">'+documentType+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td style="text-align: right; font-size: 0.9em;color: #333333;padding-top: 5px;"><i class="icon-sort-by-order"></i> 序号：</td>'+
            '<td style="text-align: left; font-size: 0.9em;font-weight:bold;color: #333333;padding-top: 5px;" data-dojo-attach-point="sequenceTxt">'+this.knowledgeContentInfo.sequenceNumber+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td style="text-align: right; font-size: 0.9em;color: #333333;padding-top: 5px;padding-bottom: 10px;"><i class="icon-time"></i> 发布：</td>'+
            '<td style="text-align: left; font-size: 0.9em;font-weight:bold;color: #333333;padding-top: 5px;padding-bottom: 10px;" data-dojo-attach-point="uploadTimeTxt">'+uploadTimeTxt+'</td>'+
            '</tr>'+
            '</table>';

            this.knowledgeInfoTooltip=new dijit.Tooltip({
                connectId: this.knowledgeIconPicture,
                label:tooltipLabel
            });

            this.mouseClickEventListener=on(this.itemContainer, "click", function(evt){
                that.knowledgeInfoTooltip.destroy();
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                    KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
                    KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_SINGLE,
                    KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_MATERIAL,
                    KNOWLEDGE_VIEW_DATA:{
                        DISPLAY_TITLE:that.knowledgeContentInfo.contentDescription,
                        VIEW_METADATA:that.knowledgeContentInfo
                    }
                });
            });
        },
        destroy:function(){
            this.mouseClickEventListener.remove();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});