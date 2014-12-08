require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemBelongedCollectionListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeCollectionInfoList:null,
        postCreate: function(){
            this.knowledgeCollectionInfoList=[];
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
        _renderCollectionList:function(returnData){
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
        destroy:function(){
            dojo.forEach(this.knowledgeCollectionInfoList,function(currentCollectionInfo){
                currentCollectionInfo.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});