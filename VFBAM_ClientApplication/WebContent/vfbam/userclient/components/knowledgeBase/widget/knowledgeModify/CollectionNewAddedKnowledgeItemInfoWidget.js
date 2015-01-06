require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/CollectionNewAddedKnowledgeItemInfoWidget.html", "idx/oneui/Dialog","dojo/window"
],function(lang,declare, _Widget, _Templated, template,Dialog,win){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNewAddedKnowledgeItemInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName+"?contentMimeType="+
                this.knowledgeContentInfo.contentMimeType;
            if(KNOWLEDGEMODIFICATION_PREVIEW_UPDATED_ITEM[this.knowledgeContentInfo.contentLocation]){
                var timeStamp=new Date().getTime();
                previewFileLocation=previewFileLocation+"&timestamp="+timeStamp;
            }
            var previewContainerStyle="display:inline-block;min-height: 110px;min-width: 110px;background-size: 100% 100%;background-image:url('"+previewFileLocation+"');";
            this.previewPictureContainer.setAttribute("style",previewContainerStyle);

            this.knowledgeTitleTxt.innerHTML=this.knowledgeContentInfo.contentDescription;
            this.documentNameText.innerHTML= this.knowledgeContentInfo.contentName;
            this.documentTagNumber.innerHTML=this.knowledgeContentInfo.contentTags.length;
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

            this.updateKnowledgeDescriptionMenuDialog=new idx.widget.MenuDialog();
            this.updateKnowledgeDescriptionWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.UpdateKnowledgeDescriptionWidget({
                containerDialog: this.updateKnowledgeDescriptionMenuDialog,knowledgeContentInfo:this.knowledgeContentInfo,knowledgeItemMetaInfoWidget:this});
            dojo.place(this.updateKnowledgeDescriptionWidget.domNode, this.updateKnowledgeDescriptionMenuDialog.containerNode);
            var updateKnowledgeDescriptionDropdownLabel='<i class="icon-edit"></i>';
            this.updateKnowledgeDescriptionDropDown=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:updateKnowledgeDescriptionDropdownLabel,dropDown: this.updateKnowledgeDescriptionMenuDialog},this.updateDescLinkContainer);
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
        showKnowledgeItemTags:function(){
            this.addKnowledgeCollectionEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagEditorWidget({
                knowledgeContentInfo:this.knowledgeContentInfo,attachedTags:this.knowledgeContentInfo.contentTags,knowledgeCategoryInheritDataStore:this.knowledgeCategoryInheritDataStore,dialogCloseCallBack:dojo.hitch(this,this.updateKnowledgeItemTagInfo)});
            this.addKnowledgeCollectionEditor.renderTagItems();
            var	dialog = new Dialog({
                style:"width:550px;height:400px;",
                title: "<i class='icon-pushpin'></i> 素材 <b>"+this.knowledgeContentInfo.contentName+"</b> 分类标签",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var that=this;
            var closeDialogCallBack=function(){
                that.knowledgeContentInfo.contentTags=that.addKnowledgeCollectionEditor.attachedTags;
                that.documentTagNumber.innerHTML=that.knowledgeContentInfo.contentTags.length;
                that.addKnowledgeCollectionEditor.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dojo.place(this.addKnowledgeCollectionEditor.containerNode, dialog.containerNode);
            dialog.show();
        },
        updateKnowledgeItemTagInfo:function(callbackData){
            this.addKnowledgeCollectionEditor.attachedTags=callbackData;
            this.addKnowledgeCollectionEditor.renderTagItems();
        },
        showKnowledgeItemPreview:function(){
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
                var previewContainerStyle="display:inline-block;min-height: 110px;min-width: 110px;background-size: 100% 100%;background-image:url('"+previewFileLocation+"');";
                that.previewPictureContainer.setAttribute("style",previewContainerStyle);
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
            this.updateKnowledgeDescriptionMenuDialog.destroy();
            this.updateKnowledgeDescriptionWidget.destroy();
            this.updateKnowledgeDescriptionDropDown.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});