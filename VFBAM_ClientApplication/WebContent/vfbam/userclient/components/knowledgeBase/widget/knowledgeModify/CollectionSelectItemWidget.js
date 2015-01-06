require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/CollectionSelectItemWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionSelectItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        doubleClickEventConnectionHandler:true,
        postCreate: function(){
            this.collectionName.innerHTML=this.collectionInfo.projectName;
            this.publisher.innerHTML=this.collectionInfo.projectCreatedBy;
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            var uploadDate=new Date(this.collectionInfo.projectCreatedTime);
            var dateString=dojo.date.locale.format(uploadDate,dateDisplayFormat);
            //var timeString=dojo.date.locale.format(uploadDate,timeDisplayFormat);
            this.publishDate.innerHTML=dateString;//+" "+timeString;
            this.doubleClickEventConnectionHandler=dojo.connect(this.domNode,"ondblclick",dojo.hitch(this,this.doAddItemToCollection));
        },
        doAddItemToCollection:function(){
            var confirmationLabel="请确认是否将素材 '<b>"+this.knowledgeContentInfo.contentDescription+"</b>' 添加到专辑 <b>"+
                    this.collectionInfo.projectName+"</b> 中?";
            var that=this;
            var confirmButtonAction=function(){
                UI.showProgressDialog("添加专辑素材");
                var timer = new dojox.timing.Timer(300);
                timer.onTick = function(){
                    var collectionProjectTags;
                    if(that.collectionInfo.projectTags==""){
                        collectionProjectTags=[];
                    }else{
                        collectionProjectTags=that.collectionInfo.projectTags;
                    }
                    var addNewItemToCollectionObj={};
                    addNewItemToCollectionObj.projectId=that.collectionInfo.projectId;
                    addNewItemToCollectionObj.projectTags=collectionProjectTags;
                    addNewItemToCollectionObj.docs=[];
                    var documentProjectTags;
                    if(that.knowledgeContentInfo.projectTags==""){
                        documentProjectTags=[];
                    }else{
                        documentProjectTags=that.knowledgeContentInfo.projectTags;
                    }
                    addNewItemToCollectionObj.docs.push({
                        "docId":that.knowledgeContentInfo.sequenceNumber,
                        "projectTags":documentProjectTags
                    });
                    var addNewItemToCollectionObjContent=dojo.toJson(addNewItemToCollectionObj);
                    var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"addDocumentsToProject/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_UPDATECOLLECTIONKNOWLEDGECONTENT_EVENT,{
                            operationType:"ADD_COLLECTION_ITEM",
                            collectionId:that.collectionInfo.projectId,
                            collectionName:that.collectionInfo.projectName,
                            knowledgeContentInfo:that.knowledgeContentInfo
                        });
                        UI.hideProgressDialog();
                        UI.showToasterMessage({type:"success",message:"添加专辑素材成功"});
                    };
                    Application.WebServiceUtil.postJSONData(resturl,addNewItemToCollectionObjContent,loadCallback,errorCallback);
                    timer.stop();
                };
                timer.start();
            };
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-plus-sign'></i> 添加",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        destroy:function(){
            dojo.disconnect(this.doubleClickEventConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});