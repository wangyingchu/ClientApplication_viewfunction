require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemOverviewDisplayWidget.html"
    ,"dojo/window","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,win,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemOverviewDisplayWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        generalKnowledgeViewerWidget:null,
        postCreate: function(){
            this.itemDescription.innerHTML=this.knowledgeContentInfo.contentDescription;
            this.itemFileName.innerHTML=this.knowledgeContentInfo.contentName;
            var num;
            var fileSize;
            if(this.knowledgeContentInfo.contentSize>1024000){
                num = new Number(this.knowledgeContentInfo.contentSize/1024000);
                fileSize=num.toFixed(2)+" MB";
            }else{
                num = new Number(this.knowledgeContentInfo.contentSize/1024);
                fileSize=num.toFixed(0)+" KB";
            }
            this.itemFileSize.innerHTML=fileSize;
            this.itemSequenceNumber.innerHTML=this.knowledgeContentInfo.sequenceNumber;
            this.itemFileType.innerHTML=KnowledgeBaseDataHandleUtil.getDocumentMainType(this.knowledgeContentInfo);
            this.generalKnowledgeViewerWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.GeneralKnowledgeViewerWidget({
                resultDisplayZoneWidth:this.resultDisplayZoneWidth,knowledgeContentInfo:this.knowledgeContentInfo
            },this.previewContainer);
        },
        fullScreenPreview:function(){
            var documentViewerWidth=win.getBox().w-10;
            if(win.getBox().w>200){
                documentViewerWidth=win.getBox().w-50;
            }
            var documentViewerHeight=win.getBox().h-40;
            var viewerWidthStyle="width:"+documentViewerWidth+"px;height:"+documentViewerHeight+"px;";

            var viewerWidth=documentViewerWidth-50;
            var viewerHeight=documentViewerHeight-150;
            if(dojo.isChrome){
                viewerWidth=documentViewerWidth-65;
                viewerHeight=documentViewerHeight-160;
            }
            this.fullSizeGeneralKnowledgeViewerWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.GeneralKnowledgeViewerWidget({
                knowledgeContentInfo:this.knowledgeContentInfo,viewerWidth:viewerWidth,viewerHeight:viewerHeight
            });
            var	dialog = new Dialog({
                style:viewerWidthStyle,
                title: "<span style='font-size: 0.7em;'><i class='icon-resize-full'></i> 全屏文件预览: <b>",
                content:this.fullSizeGeneralKnowledgeViewerWidget,
                //class:'nonModal',// for noe modal window
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dialog.show();
            dojo.style(dialog.containerNode,"width",documentViewerWidth-40+"px");
            dojo.style(dialog.containerNode,"height",documentViewerHeight-140+"px");
        },
        showKnowledgeItemDetail:function(){
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
                KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_SINGLE,
                KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_MATERIAL,
                KNOWLEDGE_VIEW_DATA:{
                    DISPLAY_TITLE:this.knowledgeContentInfo.contentDescription,
                    VIEW_METADATA:this.knowledgeContentInfo
                }
            });
        },
        destroy:function(){
            this.generalKnowledgeViewerWidget.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});