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
            var previewFileLocation=KNOWLEDGE_DISPLAY_PREVIEW_BASELOCATION+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName;
            this.documentRenderType=this.knowledgeContentInfo.contentMimeType;
            this.loadRealDocumentViewer(previewFileLocation);

            /*
            this.serverTempDocumentName=this.tempDocumentName;
            //console.log(this.documentMetaInfo);
            var previewTempFileGenerateObj={};
            previewTempFileGenerateObj.documentsOwnerType=this.documentMetaInfo.documentsOwnerType;
            previewTempFileGenerateObj.activitySpaceName=APPLICATION_ID;
            previewTempFileGenerateObj.tempFileName=this.tempDocumentName;
            this.documentRenderType=this.documentMetaInfo.documentInfo.documentType;
            //for office convert
            var detectedDocumentType=this.documentMetaInfo.documentInfo.documentType;
            if(detectedDocumentType.match("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")||
                detectedDocumentType.match("application/vnd.openxmlformats-officedocument.wordprocessingml.document")||
                detectedDocumentType.match("application/vnd.openxmlformats-officedocument.presentationml.presentation")||
                detectedDocumentType.match("application/vnd.ms-word")||
                detectedDocumentType.match("application/msword")||
                detectedDocumentType.match("application/vnd.ms-excel")||
                detectedDocumentType.match("application/vndms-powerpoint")||
                (detectedDocumentType.match("application/zip")&&DocumentHandleUtil.isSpecialDocumentTypeByCheckPostfix(this.documentMetaInfo.documentInfo.documentName,"pptx"))
                ){
                this.documentRenderType="application/pdf";
                previewTempFileGenerateObj.needDocumentConvert=true;
                previewTempFileGenerateObj.convertOperation="MSOFFICE->PDF";
            }
            //for openoffice display,viewer.js need use file post fix .odt,ods,odp
            if(detectedDocumentType.match("application/vnd.oasis.opendocument.text")){
                previewTempFileGenerateObj.needDocumentConvert=true;
                previewTempFileGenerateObj.convertOperation="ADDPOSTFIX->.odt";
                this.serverTempDocumentName=this.tempDocumentName+".odt";
            }
            if(detectedDocumentType.match("application/vnd.oasis.opendocument.spreadsheet")){
                previewTempFileGenerateObj.needDocumentConvert=true;
                previewTempFileGenerateObj.convertOperation="ADDPOSTFIX->.ods";
                this.serverTempDocumentName=this.tempDocumentName+".ods";
            }
            if(detectedDocumentType.match("application/vnd.oasis.opendocument.presentation")){
                previewTempFileGenerateObj.needDocumentConvert=true;
                previewTempFileGenerateObj.convertOperation="ADDPOSTFIX->.odp";
                this.serverTempDocumentName=this.tempDocumentName+".odp";
            }
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            if(this.documentMetaInfo.documentsOwnerType=="PARTICIPANT"){
                previewTempFileGenerateObj.participantFileInfo={};
                previewTempFileGenerateObj.participantFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.participantFileInfo.participantName=userId;
                previewTempFileGenerateObj.participantFileInfo.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                previewTempFileGenerateObj.participantFileInfo.fileName=this.documentMetaInfo.documentInfo.documentName;
            }
            if(this.documentMetaInfo.documentsOwnerType=="ACTIVITY"){
                previewTempFileGenerateObj.activityTypeFileInfo={};
                previewTempFileGenerateObj.activityTypeFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.activityTypeFileInfo.activityName=this.documentMetaInfo.taskItemData.activityName;
                previewTempFileGenerateObj.activityTypeFileInfo.activityId=this.documentMetaInfo.taskItemData.activityId;
                previewTempFileGenerateObj.activityTypeFileInfo.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                previewTempFileGenerateObj.activityTypeFileInfo.fileName=this.documentMetaInfo.documentInfo.documentName;
            }
            if(this.documentMetaInfo.documentsOwnerType=="APPLICATIONSPACE"){
                previewTempFileGenerateObj.applicationSpaceFileInfo={};
                previewTempFileGenerateObj.applicationSpaceFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.applicationSpaceFileInfo.participantName=userId;
                previewTempFileGenerateObj.applicationSpaceFileInfo.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                previewTempFileGenerateObj.applicationSpaceFileInfo.fileName=this.documentMetaInfo.documentInfo.documentName;
            }
            if(this.documentMetaInfo.documentsOwnerType=="ROLE"){
                previewTempFileGenerateObj.roleFileInfo={};
                previewTempFileGenerateObj.roleFileInfo.activitySpaceName=APPLICATION_ID;
                previewTempFileGenerateObj.roleFileInfo.participantName=userId;
                previewTempFileGenerateObj.roleFileInfo.roleName=this.documentMetaInfo.roleName;
                previewTempFileGenerateObj.roleFileInfo.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                previewTempFileGenerateObj.roleFileInfo.fileName=this.documentMetaInfo.documentInfo.documentName;
            }
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(resultData){
                if(resultData.generateResult){
                    var previewFilePath=resultData.previewFileLocation+resultData.previewFileName;
                    that.loadRealDocumentViewer(previewFilePath);
                }else{
                    that.realDocumentViewerContainer.src="vfbam/userclient/common/UI/components/documentsList/template/loadPreviewFileFailed.html";
                }
            };
            var previewTempFileGenerateInfoContent=dojo.toJson(previewTempFileGenerateObj);
            var resturl=CONTENT_SERVICE_ROOT+"generatePerviewFile/";
            Application.WebServiceUtil.postJSONData(resturl,previewTempFileGenerateInfoContent,loadCallback,errorCallback);
            */
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
            else if((this.documentRenderType.match("application/octet-stream")&&DocumentHandleUtil.isSpecialDocumentTypeByCheckPostfix(this.documentMetaInfo.documentInfo.documentName,"sql"))){
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
                this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation+".odt";
            }
            else if(this.documentRenderType.match("application/vnd.oasis.opendocument.spreadsheet")){
                this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation+".ods";
            }
            else if(this.documentRenderType.match("application/vnd.oasis.opendocument.presentation")){
                this.realDocumentViewerContainer.src='documentsViewer/viewer.js/#'+fileLocation+".odp";
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