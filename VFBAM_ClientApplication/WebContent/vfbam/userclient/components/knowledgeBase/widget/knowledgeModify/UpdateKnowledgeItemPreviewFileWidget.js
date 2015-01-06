require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/UpdateKnowledgeItemPreviewFileWidget.html","dojo/dom-style","dojo/io/iframe","dojo/has", "dojo/sniff",
    "idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domStyle,ioIframe,has,sniff,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.UpdateKnowledgeItemPreviewFileWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        fileUploader:null,
        postCreate: function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var pathToUploadServerService=KNOWLEDGE_OPERATION_SERVICE_ROOT+"updateKnowledgeObjectPreviewFile/";
            var metaDataContent={};
            var that=this;
            var documentFormIdValue="documentForm"+new Date().getTime();
            this.form.id=documentFormIdValue;
            this.fileUploader = new dojox.form.Uploader({
                label: '<i class="icon-file"></i> 选择并添加新的预览文件',
                onChange:function(fileArray){
                    /* logic can used to check file property and take action
                     if(fileArray.length>0){
                     var fileSize;
                     var num;
                     if(fileArray[0].size>1024000){
                     num = new Number(fileArray[0].size/1024000);
                     fileSize=num.toFixed(2)+"MB";
                     }else{
                     num = new Number(fileArray[0].size/1024);
                     fileSize=num.toFixed(0)+"KB";
                     }
                     if(fileArray[0].size>1024000){
                     UI.showToasterMessage({type:"error",message:"图像文件大小必须小于1MB"});
                     return;
                     }
                     if(fileArray[0].type=="image/jpeg"||fileArray[0].type=="image/gif"||fileArray[0].type=="image/png"){
                     }else{
                     UI.showToasterMessage({type:"error",message:"请选择JPEG,PNG或GIF格式的图像文件"});
                     return;
                     }
                     }
                     */
                    var fileName=fileArray[0].name;
                    UI.showProgressDialog("更新素材预览文件");
                    metaDataContent.fileName=fileName;
                    metaDataContent.userId=userId;
                    metaDataContent.bucketName=that.knowledgeContentInfo.bucketName;
                    metaDataContent.contentLocation=that.knowledgeContentInfo.contentLocation;
                    metaDataContent.contentMimeType=that.knowledgeContentInfo.contentMimeType;
                    metaDataContent.contentName=that.knowledgeContentInfo.contentName;
                    metaDataContent.sequenceNumber=that.knowledgeContentInfo.sequenceNumber;

                    ioIframe.send({
                        form: that.form.id,
                        url: pathToUploadServerService,
                        handleAs: "html",
                        content:metaDataContent
                    }).then(function(data){
                        UI.hideProgressDialog();
                        UI.showToasterMessage({type:"success",message:"更新素材预览文件成功"});
                        KNOWLEDGEMODIFICATION_PREVIEW_UPDATED_ITEM[that.knowledgeContentInfo.contentLocation]=true;
                        if(that.updateFinishCallback){
                            that.updateFinishCallback();
                        }
                    }, function(data){
                        //upload failed
                        UI.hideProgressDialog();
                        UI.showToasterMessage({
                            type:"error",
                            message:"更新素材预览文件操作失败"
                        });
                    });
                },
                multiple: false
            }, this.fileUploaderNode);
        },
        destroy:function(){
            if(this.fileUploader){
                this.fileUploader.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});