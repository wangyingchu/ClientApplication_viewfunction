require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/UpdateDocumentWidget.html","dojo/dom-style","dojo/io/iframe"
],function(lang,declare, _Widget, _Templated, template,domStyle,ioIframe){
    declare("vfbam.userclient.common.UI.components.documentsList.UpdateDocumentWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        fileUploader:null,
        postCreate: function(){
            var updateFileName=this.documentMetaInfo.documentInfo.documentName;
            var successCallBack=this.documentMetaInfo.documentInfo.callback;
            this.updateFileName.innerHTML=updateFileName;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var pathToUploadServerService="";
            var metaDataContent={};
            if(this.documentMetaInfo.documentsOwnerType=="PARTICIPANT"){
                pathToUploadServerService=CONTENT_SERVICE_ROOT+"participantPersonalFile/updateFile/"+APPLICATION_ID+"/"+ userId+"/";
            }
            if(this.documentMetaInfo.documentsOwnerType=="ACTIVITY"){
                var activityType=this.documentMetaInfo.taskItemData.activityName;
                var activityId=this.documentMetaInfo.taskItemData.activityId;
                metaDataContent.activityType=activityType;
                metaDataContent.activityId=activityId;
                pathToUploadServerService=CONTENT_SERVICE_ROOT+"businessActivityFile/updateFile/"+APPLICATION_ID+"/"+ userId+"/";
            }
            if(this.documentMetaInfo.documentsOwnerType=="APPLICATIONSPACE"){
                pathToUploadServerService=CONTENT_SERVICE_ROOT+"applicationSpaceFile/updateFile/"+APPLICATION_ID+"/"+ userId+"/";
            }
            if(this.documentMetaInfo.documentsOwnerType=="ROLE"){
                var roleName=this.documentMetaInfo.documentsInitData.roleName;
                pathToUploadServerService=CONTENT_SERVICE_ROOT+"roleFile/updateFile/"+APPLICATION_ID+"/"+ roleName+"/"+ userId+"/";
            }
            var that=this;
            var documentFormIdValue="documentForm"+new Date().getTime();
            this.form.id=documentFormIdValue;
            this.fileUploader = new dojox.form.Uploader({
                label: '<i class="icon-file"></i> 选择并更新文件',
                onChange:function(fileArray){
                    var fileName=fileArray[0].name;
                    if(fileName!=that.documentMetaInfo.documentInfo.documentName){
                        UI.showToasterMessage({
                            type:"error",
                            message:"上传更新的文件名称必须是: <b>"+fileName+"</b>"
                        });
                        return;
                    }
                    UI.showProgressDialog("更新文件");
                    var currentFolderLocation=that.documentMetaInfo.documentInfo.documentFolderPath;
                    metaDataContent.fileFolderPath=currentFolderLocation;
                    metaDataContent.fileName=fileName;
                    ioIframe.send({
                        form: that.form.id,
                        url: pathToUploadServerService,
                        handleAs: "html",
                        content:metaDataContent
                    }).then(function(data){
                        //upload success
                        UI.hideProgressDialog();
                        if(successCallBack){
                            successCallBack();
                        }
                        that.doCloseContainerDialog();
                        UI.showToasterMessage({
                            type:"success",
                            message:"更新文件<b>"+fileName+"</b>成功"
                        });

                    }, function(data){
                        //upload failed
                        UI.hideProgressDialog();
                        UI.showToasterMessage({
                            type:"error",
                            message:"更新文件操作失败"
                        });
                    });
                },
                multiple: false
            }, this.fileUploaderNode);
        },
        doCloseContainerDialog:function(){
        },
        _endOfCode: function(){}
    });
});