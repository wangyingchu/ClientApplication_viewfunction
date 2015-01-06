require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemBelongedCollectionListWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeCollectionInfoList:null,
        collectionSelectListWidget:null,
        updateCollectionKnowledgeContentEventListener:null,
        postCreate: function(){
            this.knowledgeCollectionInfoList=[];
            this.loadCollectionList();
            this.updateCollectionKnowledgeContentEventListener=Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_UPDATECOLLECTIONKNOWLEDGECONTENT_EVENT,dojo.hitch(this,this.updateCollectionKnowledgeContent));
        },
        _renderCollectionList:function(returnData){
            dojo.empty(this.knowledgeItemBelongedCollectionInfoContainer);
            dojo.forEach(this.knowledgeCollectionInfoList,function(currentCollectionInfo){
                currentCollectionInfo.destroy();
            });
            this.knowledgeCollectionInfoList.splice(0, this.knowledgeCollectionInfoList.length);
            var that=this;
            var collectionList=returnData.projects;
            dojo.forEach(collectionList,function(collectionInfo){
                var currentCollectionInfo=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionInfoWidget({knowledgeCollectionInfo:collectionInfo,popupDialog:that.popupDialog});
                that.knowledgeItemBelongedCollectionInfoContainer.appendChild(currentCollectionInfo.domNode);
                that.knowledgeCollectionInfoList.push(currentCollectionInfo);
            });
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_UPDATECONTENTBELONGEDCOLLECTION_EVENT,{
                collectionsList:returnData.projects
            });
            /*
            var timer = new dojox.timing.Timer(100);
            timer.onTick = function(){
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_UPDATECONTENTBELONGEDCOLLECTION_EVENT,{
                    collectionsList:returnData.projects
                });
                timer.stop();
            };
            timer.start();
            */
        },
        addToNewCollection:function(){
            this.collectionSelectListWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionSelectListWidget({knowledgeContentInfo:this.knowledgeContentInfo});
            var	dialog = new Dialog({
                style:"width:650px;height:540px;",
                title: "<i class='icon-plus-sign'></i> 添加专辑素材",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var that=this;
            var closeDialogCallBack=function(){
                that.collectionSelectListWidget.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dojo.place(this.collectionSelectListWidget.containerNode, dialog.containerNode);
            dialog.show();
        },
        updateCollectionKnowledgeContent:function(payload){
            if(payload.knowledgeContentInfo.contentLocation==this.knowledgeContentInfo.contentLocation){
                this.loadCollectionList();
            }
        },
        loadCollectionList:function(){
            var that=this;
            var collectionQueryObj={};
            collectionQueryObj.projectPageSize=500;
            //collectionQueryObj.projectCurrentPageNumber=1;
            collectionQueryObj.docsNumberPerProject=1;
            collectionQueryObj.docFilterPropsMap=[
                {"propName":"sequenceNumber",
                    "propValue":this.knowledgeContentInfo.sequenceNumber
                }
            ];
            collectionQueryObj.defaultSort=true;
            var collectionQueryObjContent=dojo.toJson(collectionQueryObj);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getCollectionsByKeyWords/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                that._renderCollectionList(data);
            };
            Application.WebServiceUtil.postJSONData(resturl,collectionQueryObjContent,loadCallback,errorCallback);
        },
        destroy:function(){
            dojo.forEach(this.knowledgeCollectionInfoList,function(currentCollectionInfo){
                currentCollectionInfo.destroy();
            });
            this.updateCollectionKnowledgeContentEventListener.calcelMessageListening();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});