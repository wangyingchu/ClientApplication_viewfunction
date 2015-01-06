require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/AddNewKnowledgeItemWidget.html","dojo/dom-style","dojo/io/iframe","dojo/has", "dojo/sniff","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domStyle,ioIframe,has,sniff,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.AddNewKnowledgeItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        fileUploader:null,
        knowledgeContentInfo:null,
        knowledgeCategoryInheritDataStore:null,
        updateKnowledgeDescriptionMenuDialog:null,
        updateKnowledgeDescriptionWidget:null,
        updateKnowledgeDescriptionDropDown:null,
        knowledgeItemAttachedTagEditorWidget:null,
        knowledgeTagInfoMenuDialog:null,
        knowledgeItemBelongedCollectionListMenuDialog:null,
        knowledgeItemBelongedCollectionListWidget:null,
        postCreate: function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var pathToUploadServerService=KNOWLEDGE_OPERATION_SERVICE_ROOT+"addKnowledgeObject/";
            if(dojo.isIE){
                pathToUploadServerService=KNOWLEDGE_OPERATION_SERVICE_ROOT+"addKnowledgeObjectWithNOReturn/";
            }
            this._loadKnowledgeCategoryInheritDataStore();

            var metaDataContent={};
            var that=this;
            var documentFormIdValue="documentForm"+new Date().getTime();
            this.form.id=documentFormIdValue;
            this.fileUploader = new dojox.form.Uploader({
                label: '<i class="icon-file"></i> 选择并添加素材文件',
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
                    UI.showProgressDialog("添加素材文件");
                    metaDataContent.fileName=fileName;
                    metaDataContent.userId=userId;
                    ioIframe.send({
                        form: that.form.id,
                        url: pathToUploadServerService,
                        handleAs: "html",
                        content:metaDataContent
                    }).then(function(data){
                        UI.hideProgressDialog();
                        if(dojo.isIE){
                            that.renderNewAddedKnowledgeItemWithUserLoginId();
                        }else{
                            that.renderNewAddedKnowledgeItem(data.body.innerHTML);
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
        renderNewAddedKnowledgeItem:function(knowledgeItemInfo,isObject){
            dojo.style(this.addItemPrompt,"display","none");
            dojo.style(this.addSuccessPrompt,"display","");
            dojo.style(this.knowItemUploaderContainer,"display","none");
            dojo.style(this.uploadedKnowledgeItemInfoContainer,"display","");

            if(isObject){
                this.knowledgeContentInfo =knowledgeItemInfo;
            }else{
                var jsonFormatTxt=knowledgeItemInfo;
                jsonFormatTxt=jsonFormatTxt.replace("<pre>","");//For Firefox
                jsonFormatTxt=jsonFormatTxt.replace('<pre style="word-wrap: break-word; white-space: pre-wrap;">',"");//For Chrome
                jsonFormatTxt=jsonFormatTxt.replace("</pre>","");
                this.knowledgeContentInfo = JSON.parse(jsonFormatTxt);
            }
            //add new knowledgeItem to backend knowledge search engine.
            KnowledgeBaseDataHandleUtil.addNewKnowledgeItemInSearchEngine(this.knowledgeContentInfo);

            var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName+"?contentMimeType="+
                this.knowledgeContentInfo.contentMimeType;

            this.thubmnailPic.src=previewFileLocation;
            this.knowledgeTitleTxt.innerHTML=this.knowledgeContentInfo.contentDescription;
            this.documentNameText.innerHTML= this.knowledgeContentInfo.contentName;
            var num;
            var fileSize;
            if(this.knowledgeContentInfo.contentSize>1024000){
                num = new Number(this.knowledgeContentInfo.contentSize/1024000);
                fileSize=num.toFixed(2)+" MB";
            }else{
                num = new Number(this.knowledgeContentInfo.contentSize/1024);
                fileSize=num.toFixed(0)+" KB";
            }
            this.documentSizeText.innerHTML=fileSize;
            this.documentSequenceText.innerHTML= this.knowledgeContentInfo.sequenceNumber;
            this.documentTypeText.innerHTML= KnowledgeBaseDataHandleUtil.getDocumentMainType(this.knowledgeContentInfo);
            /*
             this.creatorNamecardWidget=
             new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:this.knowledgeContentInfo.contentCreatedBy});
             this.documentCreatorText.set("label",this.knowledgeContentInfo.contentCreatedBy);
             this.documentCreatorText.set("dropDown",this.creatorNamecardWidget);
             */
            this.documentPublisherText.innerHTML= this.knowledgeContentInfo.contentCreatedBy;
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            var uploadDate=new Date(this.knowledgeContentInfo.contentCreatedTime);
            var dateString=dojo.date.locale.format(uploadDate,dateDisplayFormat);
            var timeString=dojo.date.locale.format(uploadDate,timeDisplayFormat);
            this.documentCreateDateText.innerHTML=dateString+" "+timeString;

            this.updateKnowledgeDescriptionMenuDialog=new idx.widget.MenuDialog();
            this.updateKnowledgeDescriptionWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.UpdateKnowledgeDescriptionWidget({
                containerDialog: this.updateKnowledgeDescriptionMenuDialog,knowledgeContentInfo:this.knowledgeContentInfo,knowledgeItemMetaInfoWidget:this});
            dojo.place(this.updateKnowledgeDescriptionWidget.domNode, this.updateKnowledgeDescriptionMenuDialog.containerNode);
            var updateKnowledgeDescriptionDropdownLabel='<i class="icon-edit"></i>';
            this.updateKnowledgeDescriptionDropDown=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:updateKnowledgeDescriptionDropdownLabel,dropDown: this.updateKnowledgeDescriptionMenuDialog},this.updateDescLinkContainer);

            this.knowledgeItemAttachedTagEditorWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagEditorWidget({
                knowledgeContentInfo:this.knowledgeContentInfo,attachedTags:this.knowledgeContentInfo.contentTags,knowledgeCategoryInheritDataStore:this.knowledgeCategoryInheritDataStore});
            this.knowledgeTagInfoMenuDialog=new idx.widget.MenuDialog({});
            dojo.connect( this.knowledgeTagInfoMenuDialog,"onOpen",this.knowledgeItemAttachedTagEditorWidget,"renderTagItems");
            dojo.place(this.knowledgeItemAttachedTagEditorWidget.domNode, this.knowledgeTagInfoMenuDialog.containerNode);
            var showTagDialogLinklabel="分类标签 <i class='icon-caret-down'></i>";
            new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:showTagDialogLinklabel,dropDown: this.knowledgeTagInfoMenuDialog},this.knowledgeTagSwitcherContainer);

            this.knowledgeItemBelongedCollectionListMenuDialog=new idx.widget.MenuDialog({});
            this.knowledgeItemBelongedCollectionListWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionListWidget({
                knowledgeContentInfo:this.knowledgeContentInfo,popupDialog:this.knowledgeItemBelongedCollectionListMenuDialog});
            dojo.place(this.knowledgeItemBelongedCollectionListWidget.domNode, this.knowledgeItemBelongedCollectionListMenuDialog.containerNode);
            var showProjectDialogLinklabel="所属专辑 <i class='icon-caret-down'></i>";
            new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:showProjectDialogLinklabel,dropDown: this.knowledgeItemBelongedCollectionListMenuDialog},this.knowledgeProjectsSwitcherContainer);
        },
        renderNewAddedKnowledgeItemWithUserLoginId:function(){
            var that=this;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=KNOWLEDGE_OPERATION_SERVICE_ROOT+"getUserLastAddedKnowledgeContent/"+userId;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(returnData){
                if(returnData){
                    that.renderNewAddedKnowledgeItem(returnData,true);
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        _loadKnowledgeCategoryInheritDataStore:function(){
            var that=this;
            var callBack=function(storeData){
                that.knowledgeCategoryInheritDataStore=storeData;
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
        updateKnowledgeDescription:function(newKnowledgeDesc){
            UI.showProgressDialog("更新素材描述信息");
            var that=this;
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                var setNewDescObj={};
                setNewDescObj.contentLocation=that.knowledgeContentInfo.contentLocation;
                setNewDescObj.contentDescription=newKnowledgeDesc;
                var setNewDescObjectContent=dojo.toJson(setNewDescObj);
                var resturl=KNOWLEDGE_OPERATION_SERVICE_ROOT+"updateKnowledgeDescription/";
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    that.knowledgeTitleTxt.innerHTML=data.contentDescription;
                    UI.hideProgressDialog();
                    UI.showToasterMessage({type:"success",message:"更新素材描述信息成功"});
                    //sync description update to backend knowledge search engine.
                    KnowledgeBaseDataHandleUtil.syncKnowledgeItemInfoWithSearchEngine(data);
                };
                Application.WebServiceUtil.postJSONData(resturl,setNewDescObjectContent,loadCallback,errorCallback);
                timer.stop();
            };
            timer.start();
        },
        showUpdatePreviewFileDialog:function(){
            var that=this;
            var	dialog = new Dialog({
                style:"width:500px;height:230px;",
                title: "<i class='icon-picture'></i> 更新素材 <b>"+this.knowledgeContentInfo.contentName +"</b> 预览文件",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var updateFinishCallback=function(){
                var timeStamp=new Date().getTime();
                var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+that.knowledgeContentInfo.bucketName+"/"+that.knowledgeContentInfo.contentName+"?contentMimeType="+
                    that.knowledgeContentInfo.contentMimeType+"&timestamp="+timeStamp;
                that.thubmnailPic.src=previewFileLocation;
                that.updatePreviewFileEditor.destroy();
                dialog.hide();
            };
            this.updatePreviewFileEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.UpdateKnowledgeItemPreviewFileWidget({
                knowledgeContentInfo:this.knowledgeContentInfo,updateFinishCallback:updateFinishCallback
            });
            var closeDialogCallBack=function(){
                if(that.updatePreviewFileEditor){
                    that.updatePreviewFileEditor.destroy();
                }
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dojo.place(this.updatePreviewFileEditor.containerNode, dialog.containerNode);
            dialog.show();
        },
        destroy:function(){
            if(this.updateKnowledgeDescriptionMenuDialog){this.updateKnowledgeDescriptionMenuDialog.destroy();}
            if(this.updateKnowledgeDescriptionWidget){this.updateKnowledgeDescriptionWidget.destroy();}
            if(this.updateKnowledgeDescriptionDropDown){this.updateKnowledgeDescriptionDropDown.destroy();}
            if(this.knowledgeItemAttachedTagEditorWidget){this.knowledgeItemAttachedTagEditorWidget.destroy();}
            if(this.knowledgeTagInfoMenuDialog){this.knowledgeTagInfoMenuDialog.destroy();}
            if(this.knowledgeItemBelongedCollectionListMenuDialog){this.knowledgeItemBelongedCollectionListMenuDialog.destroy();}
            if(this.knowledgeItemBelongedCollectionListWidget){this.knowledgeItemBelongedCollectionListWidget.destroy();}
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});