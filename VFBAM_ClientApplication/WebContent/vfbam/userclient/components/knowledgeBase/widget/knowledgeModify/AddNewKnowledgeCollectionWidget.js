require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/AddNewKnowledgeCollectionWidget.html","dojo/dom-style","dojo/io/iframe","dojo/has", "dojo/sniff",
    "idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domStyle,ioIframe,has,sniff,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.AddNewKnowledgeCollectionWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        fileUploader:null,
        currentProjectId:null,
        currentProjectTitle:null,
        addedCollectionInfo:null,
        newKnowledgeCollectionTagEditor:null,
        addedCollectionTags:null,
        postCreate: function(){
            this.addedCollectionTags=[];
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
                    /*
                    var isZipFormatFile=false;
                    if(fileArray[0].type=="application/zip"||fileArray[0].type=="application/x-zip-compressed"){
                        isZipFormatFile=true;
                    }else{
                        isZipFormatFile=false;
                    }
                    if(!isZipFormatFile){
                        UI.showToasterMessage({type:"error",message:"请选择ZIP格式的压缩文件"});
                        return;
                    }
                    */
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
                        that._renderEditCollectionContentKnowledgeItemUI();
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
            var that=this;
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"checkProjectByName/"+collection;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(returnData){
                if(returnData.isExist){
                    UI.showToasterMessage({type:"error",message:"标题为 <b>"+collection+"</b> 的专辑已经存在"});
                    return;
                }else{
                    that._doCallAddProjectService(collection);
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        _doCallAddProjectService:function(collectionName){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var that=this;
            var currentTimeStamp=new Date().getTime();
            var newProjectInfoObject={};
            newProjectInfoObject["projectId"]="projectId"+currentTimeStamp;
            newProjectInfoObject["projectName"]=collectionName;
            newProjectInfoObject["projectCreatedBy"]=userId;
            newProjectInfoObject["projectCreatedTime"]=currentTimeStamp;
            newProjectInfoObject["projectLastModifiedBy"]=userId;
            newProjectInfoObject["projectLastModifiedTime"]=currentTimeStamp;
            newProjectInfoObject["projectComment"]="";
            newProjectInfoObject["projectTags"]=[];
            newProjectInfoObject["orgId"]=KNOWLEDGEBASE_ORGANIZATION_ID;
            var newProjectObjContent=dojo.toJson(newProjectInfoObject);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"createProject/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                var newProjectUID=data.projects[0].projectId;
                that.currentProjectId=newProjectUID;
                that.currentProjectTitle=collectionName;
                that._renderAddKnowledgeItemUI(collectionName);
                that.addedCollectionInfo=data.projects[0];
            };
            Application.WebServiceUtil.postJSONData(resturl,newProjectObjContent,loadCallback,errorCallback);
        },
        _renderAddKnowledgeItemUI:function(collection){
            dojo.style(this.createCollectionInfoContainer,"display","none");
            dojo.style(this.uploadKnowledgeItemsContainer,"display","");
            dojo.style(this.addProjectTitlePrompt,"display","none");
            dojo.style(this.addKnowledgeItemsZipPrompt,"display","");
            this.currentCollectionTitle.innerHTML=collection;
            this.currentProjectTitle=collection;
        },
        _renderEditCollectionContentKnowledgeItemUI:function(){
            dojo.style(this.createCollectionInfoContainer,"display","none");
            dojo.style(this.uploadKnowledgeItemsContainer,"display","none");
            dojo.style(this.addProjectTitlePrompt,"display","none");
            dojo.style(this.addKnowledgeItemsZipPrompt,"display","none");
            dojo.style(this.addCollectionSuccessfulPrompt,"display","");
            dojo.style(this.createCollectionSuccessfulContainer,"display","");
            this.newCreatedCollectionTitle.innerHTML=this.currentProjectTitle;
            this._renderProjectContent();
        },
        _renderProjectContent:function(){
            var collectionInfo={};
            collectionInfo.collectionName=this.currentProjectTitle;
            collectionInfo.collectionId= this.currentProjectId;
            var addKnowledgeCollectionEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNewAddedKnowledgeItemInfoListWidget({collectionInfo:collectionInfo});
            var	dialog = new Dialog({
                style:"width:750px;height:600px;",
                title: "<i class='icon-camera'></i> 专辑知识素材内容",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var closeDialogCallBack=function(){
                addKnowledgeCollectionEditor.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dojo.place(addKnowledgeCollectionEditor.containerNode, dialog.containerNode);
            dialog.show();
        },
        _showProjectTags:function(){
            this.newKnowledgeCollectionTagEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagEditorWidget({
                knowledgeContentInfo:this.addedCollectionInfo,attachedTags:this.addedCollectionTags,isCollectionTags:true,dialogCloseCallBack:dojo.hitch(this,this.updateKnowledgeCollectionTagInfo),
                knowledgeCategoryInheritDataStore:this.knowledgeDisplayPanelWidget.getKnowledgeCategoryInheritDataStore()});
            this.newKnowledgeCollectionTagEditor.renderTagItems();
            var	dialog = new Dialog({
                style:"width:550px;height:400px;",
                title: "<span style='font-size: 0.7em;'><i class='icon-archive'></i> 专辑 <b>"+this.currentProjectTitle+"</b> 分类标签</span>",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var that=this;
            var closeDialogCallBack=function(){
                that.newKnowledgeCollectionTagEditor.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dojo.place(this.newKnowledgeCollectionTagEditor.containerNode, dialog.containerNode);
            dialog.show();
        },
        updateKnowledgeCollectionTagInfo:function(callbackData){
            this.newKnowledgeCollectionTagEditor.attachedTags=callbackData;
            this.newKnowledgeCollectionTagEditor.renderTagItems();
            this.addedCollectionTags=callbackData;
        },
        destroy:function(){
            if(this.fileUploader){
                this.fileUploader.destroy();
            }
            if(this.newKnowledgeCollectionTagEditor){
                this.newKnowledgeCollectionTagEditor.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});