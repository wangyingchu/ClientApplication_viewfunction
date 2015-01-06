require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/CollectionSecondaryDisplayItemWidget.html",
    "dojo/dom-class","dojo/on",  "dojo/mouse","dojo/dom", "dojo/dom-style","dojox/dtl/filter/htmlstrings"
],function(lang,declare, _Widget, _Templated, template,domClass,on,mouse,dom, domStyle,htmlstrings){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.CollectionSecondaryDisplayItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        mouseEnterEventListener:null,
        mouseLeaveEventListener:null,
        mouseClickEventListener:null,
        postCreate: function(){
            var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName+"?contentMimeType="+
                this.knowledgeContentInfo.contentMimeType;
            if(KNOWLEDGEMODIFICATION_PREVIEW_UPDATED_ITEM[this.knowledgeContentInfo.contentLocation]){
                var timeStamp=new Date().getTime();
                previewFileLocation=previewFileLocation+"&timestamp="+timeStamp;
            }
            var previewContainerStyle="display:inline-block;min-height: 148px;min-width: 150px;border-radius: 5px;background-size: 100% 100%;background-image:url('"+previewFileLocation+"');";
            this.previewPictureContainer.setAttribute("style",previewContainerStyle);

            //var abstractTxt=htmlstrings.striptags(this.knowledgeContentInfo.contentDescription);
            this.descTxt.innerHTML=this.knowledgeContentInfo.contentDescription;
            //this.descTxt.innerHTML=abstractTxt;
            this.fileTypeTxt.innerHTML=KnowledgeBaseDataHandleUtil.getDocumentMainType(this.knowledgeContentInfo);
            this.sequenceTxt.innerHTML=this.knowledgeContentInfo.sequenceNumber;
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            var uploadDate=new Date(this.knowledgeContentInfo.contentCreatedTime);
            var dateString=dojo.date.locale.format(uploadDate,dateDisplayFormat);
            var timeString=dojo.date.locale.format(uploadDate,timeDisplayFormat);
            this.uploadTimeTxt.innerHTML=dateString+" "+timeString;

            var that=this;
            if(KnowledgeBaseDataHandleUtil.shouldSwitchSummaryInfoDisplay(this.knowledgeContentInfo)){
                this.mouseEnterEventListener=on(this.itemContainer, mouse.enter, function(evt){
                    that.showDesc();
                });
                this.mouseLeaveEventListener=on(this.itemContainer, mouse.leave, function(evt){
                    that.hideDesc();
                });
            }else{
                that.showDesc();
            }

            this.mouseClickEventListener=on(this.itemContainer, "click", function(evt){
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
        showDesc:function(){
            dojo.style(this.knowledgeDescContainer,"display","");
        },
        hideDesc:function(){
            dojo.style(this.knowledgeDescContainer,"display","none");
        },
        destroy:function(){
            if(this.mouseEnterEventListener){this.mouseEnterEventListener.remove();}
            if(this.mouseLeaveEventListener){this.mouseLeaveEventListener.remove();}
            this.mouseClickEventListener.remove();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});