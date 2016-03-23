require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/KnowledgeItemRecommendsWallDisplayWidget.html",
    "dojo/dom-class","dojo/on",  "dojo/mouse","dojo/dom", "dojo/dom-style","dojo/window","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domClass,on,mouse,dom,domStyle,win,Dialog){
    declare("vfbam.userclient.common.UI.components.documentsList.KnowledgeItemRecommendsWallDisplayWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        mouseEnterEventListener:null,
        mouseLeaveEventListener:null,
        mouseClickEventListener:null,
        knowledgeInfoTooltip:null,
        postCreate: function(){
            var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName+"?contentMimeType="+
                this.knowledgeContentInfo.contentMimeType;
            var previewContainerStyle="display:inline-block;min-height: 200px;min-width: 200px;border-radius: 5px;background-size: 100% 100%;background-image:url('"+previewFileLocation+"');";
            this.previewPictureContainer.setAttribute("style",previewContainerStyle);
            this.descTxt.innerHTML=this.knowledgeContentInfo.contentDescription;
            this.fileTypeTxt.innerHTML= KnowledgeBaseDataHandleUtil.getDocumentMainType(this.knowledgeContentInfo);
            this.sequenceTxt.innerHTML=this.knowledgeContentInfo.sequenceNumber;
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            var uploadDate=new Date(this.knowledgeContentInfo.contentCreatedTime);
            var dateString=dojo.date.locale.format(uploadDate,dateDisplayFormat);
            var timeString=dojo.date.locale.format(uploadDate,timeDisplayFormat);
            this.uploadTimeTxt.innerHTML=dateString+" "+timeString;
            var that=this;

            this.mouseEnterEventListener=on(this.itemContainer, mouse.enter, function(evt){
                that.showDesc();
            });
            this.mouseLeaveEventListener=on(this.itemContainer, mouse.leave, function(evt){
                that.hideDesc();
            });
            this.mouseClickEventListener=on(this.itemContainer, "click", function(evt){
                var documentViewerWidth=win.getBox().w;
                if(win.getBox().w>200){
                    documentViewerWidth=win.getBox().w-50;
                }
                var documentViewerHeight=win.getBox().h-20;
                var viewerWidthStyle="width:"+documentViewerWidth+"px;height:"+documentViewerHeight+"px;";
                var viewerWidth=documentViewerWidth-210;
                var viewerHeight=documentViewerHeight-260;
                if(dojo.isChrome){
                    viewerWidth=documentViewerWidth-245;
                    viewerHeight=documentViewerHeight-270;
                }
                this.fullSizeGeneralKnowledgeViewerWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.GeneralKnowledgeViewerWidget({
                    "knowledgeContentInfo":that.knowledgeContentInfo,"viewerWidth":viewerWidth,"viewerHeight":viewerHeight
                });
                var	dialog = new Dialog({
                    style:viewerWidthStyle,
                    title: "<span style='font-size: 0.7em;'><i class='icon-resize-full'></i> 推荐知识文件[ "+that.knowledgeContentInfo.contentDescription+" ]预览: </span>",
                    content:this.fullSizeGeneralKnowledgeViewerWidget,
                    //class:'nonModal',// for noe modal window
                    closeButtonLabel: "<i class='icon-remove'></i> 关闭"
                });
                dialog.show();
            });

            var toolTipLabel='<img src="'+previewFileLocation+'" width="300px" height="300px" />';
            this.knowledgeInfoTooltip=new dijit.Tooltip({
                connectId: this.previewPictureContainer,
                label:toolTipLabel
            });

            if(this.isHighLightItem){
                dojo.style(this.currentViewKnowledgeIndicator,"visibility","visible");
            }
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
            this.knowledgeInfoTooltip.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});