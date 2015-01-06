require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/GeneralKnowledgeViewerWidget.html",
    "dojo/dom-style","dojo/io/iframe","dojo/window"
],function(lang,declare, _Widget, _Templated, template,omStyle,ioIframe,win){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.GeneralKnowledgeViewerWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            if(this.viewerWidth){
                this.realDocumentViewerContainer.width=this.viewerWidth+"px";
            }else{
                var iFrameContentWidth=this.resultDisplayZoneWidth-428;
                this.realDocumentViewerContainer.width=iFrameContentWidth+"px";
            }
            if(this.viewerHeight){
                this.iFrameContentHeight=this.viewerHeight;
                this.realDocumentViewerContainer.height=this.viewerHeight+"px";
            }else{
                this.iFrameContentHeight=win.getBox().h-260;
                this.realDocumentViewerContainer.height=this.iFrameContentHeight+"px";
            }
            var that=this;
            var resturl=KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewFileInfo/"+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName+"?contentMimeType="+
                this.knowledgeContentInfo.contentMimeType;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(returnData){
                var previewFileLocation=KNOWLEDGE_DISPLAY_PREVIEW_BASELOCATION+returnData.previewFileLocation;
                that.documentRenderType=returnData.previewFileContentMimeType;
                that.loadRealDocumentViewer(previewFileLocation);
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        loadRealDocumentViewer:function(fileLocation){
            if(this.documentRenderType.match("application/pdf")){
                var fileLocationURLEncode=encodeURIComponent(fileLocation);
                this.realDocumentViewerContainer.src='documentsViewer/mozilla-pdf.js/web/viewer.html?file='+fileLocationURLEncode;
            }
            else if(this.documentRenderType.match("image")){
                if(this.documentRenderType.match("image/x-pcx")){
                    var viewerLink='documentsViewer/textViewer/index.html?fileName='+fileLocation;
                    this.realDocumentViewerContainer.src=viewerLink;
                }else if(this.documentRenderType.match("image/vnd.adobe.photoshop")){
                    this.realDocumentViewerContainer.src="vfbam/userclient/common/UI/components/documentsList/template/previewNotSupport.html";
                }else{
                    var imageViewerHeight=this.iFrameContentHeight-30;
                    var viewerLink='documentsViewer/zoomer/web/index.html?viewerHeight='+imageViewerHeight+"&fileName="+fileLocation;
                    this.realDocumentViewerContainer.src=viewerLink;
                }
            }
            else if(this.documentRenderType.match("text/plain")){
                if(this.documentRenderType.match("text/x-java-source")||this.documentRenderType.match("text/x-java")){
                    var viewerLink='documentsViewer/syntaxhighlighter/index.html?fileName='+fileLocation+"&brushName=java";
                }else{
                    var viewerLink='documentsViewer/textViewer/index.html?fileName='+fileLocation;
                }
                this.realDocumentViewerContainer.src=viewerLink;
            }
            else if(this.documentRenderType.match("application/x-javascript")){
                var viewerLink='documentsViewer/syntaxhighlighter/index.html?fileName='+fileLocation+"&brushName=js, jscript, javascript";
                this.realDocumentViewerContainer.src=viewerLink;
            }
            else if(this.documentRenderType.match("text/css")){
                var viewerLink='documentsViewer/syntaxhighlighter/index.html?fileName='+fileLocation+"&brushName=css";
                this.realDocumentViewerContainer.src=viewerLink;
            }
            else if((this.documentRenderType.match("application/octet-stream")&&DocumentHandleUtil.isSpecialDocumentTypeByCheckPostfix(this.knowledgeContentInfo.contentName,"sql"))){
                var viewerLink='documentsViewer/syntaxhighlighter/index.html?fileName='+fileLocation+"&brushName=sql";
                this.realDocumentViewerContainer.src=viewerLink;
            }
            else if(this.documentRenderType.match("text/x-sql")){
                var viewerLink='documentsViewer/syntaxhighlighter/index.html?fileName='+fileLocation+"&brushName=sql";
                this.realDocumentViewerContainer.src=viewerLink;
            }
            else if(this.documentRenderType.match("text/xml")){
                var viewerLink='documentsViewer/xmlViewer/index.html?fileName='+fileLocation;
                this.realDocumentViewerContainer.src=viewerLink;
            }
            else if(this.documentRenderType.match("application/vnd.oasis.opendocument.text")){
                //this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation+".odt";
                this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation;
            }
            else if(this.documentRenderType.match("application/vnd.oasis.opendocument.spreadsheet")){
                //this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation+".ods";
                this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation;
            }
            else if(this.documentRenderType.match("application/vnd.oasis.opendocument.presentation")){
                //this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation+".odp";
                this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation;
            }
            else{
                this.realDocumentViewerContainer.src="vfbam/userclient/common/UI/components/documentsList/template/previewNotSupport.html";
            }
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});