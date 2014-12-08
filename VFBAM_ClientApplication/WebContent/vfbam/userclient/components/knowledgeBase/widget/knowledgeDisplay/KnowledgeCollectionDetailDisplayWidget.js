require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeCollectionDetailDisplayWidget.html",
    "dojo/dom-geometry","dojo/window"
],function(lang,declare, _Widget, _Templated, template,domGeom,win){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDetailDisplayWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        queryPageNumber:null,
        knowledgeItemOverviewWidgetList:null,
        postCreate: function(){
            var collectionDataObject=this.knowledgeCollectionInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            this.queryPageNumber=1;
            this.knowledgeItemOverviewWidgetList=[];
            var collectionViewer_Header_Height=270;
            var collectionViewer_Dynamic_Real_Height=0;
            var vs =win.getBox();
            collectionViewer_Dynamic_Real_Height=  vs.h-collectionViewer_Header_Height;
            var currentHeightStyle=""+ collectionViewer_Dynamic_Real_Height+"px";
            dojo.style(this.collectionContentWidgetContainer,"height",currentHeightStyle);
            this.viewKnowledgeCollection();
            this.loadCollectionKnowledgeItems();
        },
        viewKnowledgeCollection:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var projectContentInfo=this.knowledgeCollectionInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            var projectId=projectContentInfo.projectId;
            var collectionDocumentObj={};
            var collectionDocumentObjContent=dojo.toJson(collectionDocumentObj);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"viewCollection/"+userId+"/"+projectId;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
            };
            Application.WebServiceUtil.postJSONData(resturl,collectionDocumentObjContent,loadCallback,errorCallback);
        },
        loadCollectionKnowledgeItems:function(){
            var projectContentInfo=this.knowledgeCollectionInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            var projectId=projectContentInfo.projectId;
            UI.showProgressDialog("查询数据");
            var that=this;
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByProjectId/"+projectId+"?pageSize=10&currentPageNumber="+that.queryPageNumber;
                var syncFlag=true;
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(returnData){
                    that. renderCollectionData(returnData);
                    UI.hideProgressDialog(returnData);
                };
                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                timer.stop();
            };
            timer.start();
        },
        renderCollectionData:function(collectionData){
            if(collectionData.isFirstPage){
                this.previousPageButton.set("disabled","disabled");
            }else{
                this.previousPageButton.set("disabled",false);
            }
            if(collectionData.isLastPage){
                this.nextPageButton.set("disabled","disabled");
            }else{
                this.nextPageButton.set("disabled",false);
            }
            this.currentPage.innerHTML=collectionData.currentPageNumber;
            this.totalPage.innerHTML=collectionData.pageCount;
            this.totalItems.innerHTML=collectionData.totalCount;
            var documentItemList=collectionData.docs;

            dojo.empty(this.collectionContentWidgetContainer);
            dojo.forEach(this.knowledgeItemOverviewWidgetList,function(knowledgeItem){
                knowledgeItem.destroy();
            });
            var that=this;
            var contentBox = domGeom.getContentBox(this.collectionContentWidgetContainer);
            var documentInfoViewerWidth=contentBox.w+380;
            dojo.forEach(documentItemList,function(documentItem){
                var generalKnowledgeViewerWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemOverviewDisplayWidget({
                    resultDisplayZoneWidth:documentInfoViewerWidth,knowledgeContentInfo:documentItem
                });
                that.knowledgeItemOverviewWidgetList.push(generalKnowledgeViewerWidget);
                that.collectionContentWidgetContainer.appendChild(generalKnowledgeViewerWidget.domNode);
            });
        },
        showPreviewPage:function(){
            this.queryPageNumber--;
            this.loadCollectionKnowledgeItems();
        },
        showNextPage:function(){
            this.queryPageNumber++;
            this.loadCollectionKnowledgeItems();
        },
        collectKnowledgeCollection:function(){
            var collectionDataObject=this.knowledgeCollectionInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var collectionDocumentObj={};
            var collectionDocumentObjContent=dojo.toJson(collectionDocumentObj);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"collectCollection/"+userId+"/"+collectionDataObject.projectId;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                if(data["Status"]=="OK"){
                    UI.showToasterMessage({type:"success",message:"收藏专辑 <b>"+collectionDataObject.projectName+"</b> 成功"});
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,collectionDocumentObjContent,loadCallback,errorCallback);
        },
        destroy:function(){
            dojo.forEach(this.knowledgeItemOverviewWidgetList,function(knowledgeItem){
                knowledgeItem.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});