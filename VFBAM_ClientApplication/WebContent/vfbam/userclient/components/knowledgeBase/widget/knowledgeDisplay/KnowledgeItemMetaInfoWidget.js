require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemMetaInfoWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemMetaInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        updateKnowledgeDescriptionMenuDialog:null,
        updateKnowledgeDescriptionWidget:null,
        updateKnowledgeDescriptionDropDown:null,
        updateBelongedCollectionsEventListener:null,
        updatePreviewFileEditor:null,
        updateCollectionKnowledgeContentEventListener:null,
        postCreate: function(){
            var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName+"?contentMimeType="+
                this.knowledgeContentInfo.contentMimeType;
            if(KNOWLEDGEMODIFICATION_PREVIEW_UPDATED_ITEM[this.knowledgeContentInfo.contentLocation]){
                var timeStamp=new Date().getTime();
                previewFileLocation=previewFileLocation+"&timestamp="+timeStamp;
            }
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
            this.updateBelongedCollectionsEventListener=Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_UPDATECONTENTBELONGEDCOLLECTION_EVENT,dojo.hitch(this,this.updateKnowledgeContentBelongedCollection));
            this.updateCollectionKnowledgeContentEventListener=Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_UPDATECOLLECTIONKNOWLEDGECONTENT_EVENT,dojo.hitch(this,this.updateCollectionKnowledgeContent));
        },
        updateKnowledgeDescription:function(newKnowledgeDesc){
            this.updateKnowledgeDescriptionMenuDialog.close();
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
                    that.knowledgeContentInfo.contentDescription=data.contentDescription;
                    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_UPDATECONTENTDISPLAYTITLE_EVENT,{
                        KNOWLEDGE_VIEW_DATA:{
                            DISPLAY_TITLE:data.contentDescription,
                            VIEW_METADATA:that.knowledgeContentInfo
                        }
                    });
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
        updateKnowledgeContentBelongedCollection:function(data){
            var collectionList=data.collectionsList;
            if(collectionList&&collectionList.length>0){
                dojo.style(this.documentBelongedCollectionContainer,"display","");
                var collectionNameTxt="";
                dojo.forEach(collectionList,function(currentCollection,idx){
                    var currentProjectName=currentCollection.projectName;
                    collectionNameTxt=collectionNameTxt+currentProjectName;
                    if(idx<collectionList.length-1){
                        collectionNameTxt=collectionNameTxt+"<br/>";
                    }
                });
                this.documentBelongedCollection.innerHTML=collectionNameTxt;
            }
        },
        updateCollectionKnowledgeContent:function(payload){
            if(payload.knowledgeContentInfo.contentLocation==this.knowledgeContentInfo.contentLocation){
                if(payload.operationType=="ADD_COLLECTION_ITEM"){
                    var currentCollectionInfoTxt=this.documentBelongedCollection.innerHTML;
                    this.documentBelongedCollection.innerHTML=currentCollectionInfoTxt+"<br/>"+payload.collectionName;
                }
            }
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
            this.updateKnowledgeDescriptionMenuDialog.destroy();
            this.updateKnowledgeDescriptionWidget.destroy();
            this.updateKnowledgeDescriptionDropDown.destroy();
            this.updateBelongedCollectionsEventListener.calcelMessageListening();
            this.updateCollectionKnowledgeContentEventListener.calcelMessageListening();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});