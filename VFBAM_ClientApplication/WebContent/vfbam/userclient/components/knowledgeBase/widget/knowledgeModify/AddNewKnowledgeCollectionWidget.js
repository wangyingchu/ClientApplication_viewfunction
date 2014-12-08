require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/AddNewKnowledgeCollectionWidget.html","dojo/dom-style","dojo/io/iframe","dojo/has", "dojo/sniff"
],function(lang,declare, _Widget, _Templated, template,domStyle,ioIframe,has,sniff){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.AddNewKnowledgeCollectionWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        fileUploader:null,
        currentProjectId:null,


        postCreate: function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var pathToUploadServerService=KNOWLEDGE_OPERATION_SERVICE_ROOT+"addProjectZippedKnowledgeObjects/";
            var metaDataContent={};
            var that=this;
            var documentFormIdValue="documentForm"+new Date().getTime();
            this.form.id=documentFormIdValue;
            this.fileUploader = new dojox.form.Uploader({
                label: '<i class="icon-file"></i> 选择并添加本专辑包含的素材文件的ZIP格式压缩包',
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

                    if(fileArray[0].type!="application/zip"){
                        UI.showToasterMessage({type:"error",message:"请选择ZIP格式的压缩文件"});
                        return;
                    }
                    var fileName=fileArray[0].name;
                    UI.showProgressDialog("添加素材文件压缩包");
                    metaDataContent.fileName=fileName;
                    metaDataContent.userId=userId;
                    metaDataContent.projectId=that.currentProjectId;
                    ioIframe.send({
                        form: that.form.id,
                        url: pathToUploadServerService,
                        handleAs: "html",
                        content:metaDataContent
                    }).then(function(data){
                        UI.hideProgressDialog();
                        if(dojo.isIE){
                            //that.renderNewAddedKnowledgeItemWithUserLoginId();
                        }else{
                            //that.renderNewAddedKnowledgeItem(data.body.innerHTML);
                        }
                    }, function(data){
                        //upload failed
                        UI.hideProgressDialog();
                        UI.showToasterMessage({
                            type:"error",
                            message:"添加素材文件操作失败"
                        });
                    });
                },
                multiple: false
            }, this.fileUploaderNode);
        },
        doAddNewCollection: function(){
            var newCollectionTitle=this.collectionTitleInput.get("value");
            if(newCollectionTitle==""){
                UI.showToasterMessage({type:"error",message:"请输入新专辑标题"});
            }else{
                //check whether this collection title already exist
                var that=this;
                var messageTxt="请确认是否添加专辑 <b>"+newCollectionTitle+"</b>?";
                var confirmButtonAction=function(){
                    that._doAddNewCollection(newCollectionTitle);
                };
                var cancelButtonAction=function(){}
                UI.showConfirmDialog({
                    message:messageTxt,
                    confirmButtonLabel:"<i class='icon-plus-sign'></i> 添加",
                    cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                    confirmButtonAction:confirmButtonAction,
                    cancelButtonAction:cancelButtonAction
                });
            }
        },
        _doAddNewCollection:function(collection){
            // call service to add project
            this.currentProjectId=collection;// should be project id from service back
            this._renderAddKnowledgeItemUI(collection);
        },
        _renderAddKnowledgeItemUI:function(collection){
            dojo.style(this.createCollectionInfoContainer,"display","none");
            dojo.style(this.uploadKnowledgeItemsContainer,"display","");
            dojo.style(this.addProjectTitlePrompt,"display","none");
            dojo.style(this.addKnowledgeItemsZipPrompt,"display","");
            this.currentCollectionTitle.innerHTML=collection;
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