require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/AddNewDocumentWidget.html","dojo/dom-style","dojo/io/iframe"
],function(lang,declare, _Widget, _Templated, template,domStyle,ioIframe){
    declare("vfbam.userclient.common.UI.components.documentsList.AddNewDocumentWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        fileUploader:null,
        postCreate: function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var pathToUploadServerService="";
            var metaDataContent={};
            if(this.documentListWidget.documentsOwnerType=="PARTICIPANT"){
                pathToUploadServerService=CONTENT_SERVICE_ROOT+"participantPersonalFile/addFile/"+APPLICATION_ID+"/"+ userId+"/";
            }
            if(this.documentListWidget.documentsOwnerType=="ACTIVITY"){
                var activityType=this.documentListWidget.taskData.taskItemData.activityName;
                var activityId=this.documentListWidget.taskData.taskItemData.activityId;
                metaDataContent.activityType=activityType;
                metaDataContent.activityId=activityId;
                pathToUploadServerService=CONTENT_SERVICE_ROOT+"businessActivityFile/addFile/"+APPLICATION_ID+"/"+ userId+"/";
            }
            if(this.documentListWidget.documentsOwnerType=="APPLICATIONSPACE"){
                pathToUploadServerService=CONTENT_SERVICE_ROOT+"applicationSpaceFile/addFile/"+APPLICATION_ID+"/"+ userId+"/";
            }
            if(this.documentListWidget.documentsOwnerType=="ROLE"){
                var roleName=this.documentListWidget.documentsInitData.roleName;
                pathToUploadServerService=CONTENT_SERVICE_ROOT+"roleFile/addFile/"+APPLICATION_ID+"/"+ roleName+"/"+ userId+"/";
            }
            var that=this;
            var documentFormIdValue="documentForm"+new Date().getTime();
            this.form.id=documentFormIdValue;
            this.fileUploader = new dojox.form.Uploader({
                label: '<i class="icon-file"></i> 选择并添加文件',
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
                    var fileAlreadyExist=that.documentListWidget.checkExistingFileName(fileName);
                    if(fileAlreadyExist){
                        UI.showToasterMessage({
                            type:"error",
                            message:"当前目录下已经存在文件 <br>"+fileName+"</br>"
                        });
                        return;
                    }
                    UI.showProgressDialog("添加文件");
                    var currentFolderLocation=that.documentListWidget.currentFolderPath;
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
                            that.documentListWidget.refreshCurrentFolder();
                        }, function(data){
                            //upload failed
                            UI.hideProgressDialog();
                            UI.showToasterMessage({
                                type:"error",
                                message:"添加文件操作失败"
                            });
                        });
                },
                multiple: false
            }, this.fileUploaderNode);
        },
        _endOfCode: function(){}
    });
});