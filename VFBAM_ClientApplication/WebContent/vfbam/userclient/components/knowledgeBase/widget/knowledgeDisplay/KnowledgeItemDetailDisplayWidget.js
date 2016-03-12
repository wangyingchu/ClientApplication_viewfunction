require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemDetailDisplayWidget.html"
    ,"dojo/io/iframe","dojo/window","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Iframe,win,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemDetailDisplayWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        generalKnowledgeViewerWidget:null,
        knowledgeItemMetaInfoWidget:null,
        itemRecommendedKnowledgeWidget:null,
        knowledgeTagInfoMenuDialog:null,
        knowledgeItemAttachedTagEditorWidget:null,
        knowledgeItemBelongedCollectionListMenuDialog:null,
        knowledgeItemBelongedCollectionListWidget:null,
        fullSizeGeneralKnowledgeViewerWidget:null,
        sameSearchResultWallDisplayWidget:null,
        sameSearchResultWallDisplayWidgetDialog:null,
        postCreate: function(){
            var knowledgeContentInfo=this.knowledgeMetaInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            this.generalKnowledgeViewerWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.GeneralKnowledgeViewerWidget({
                resultDisplayZoneWidth:this.resultDisplayZoneWidth,knowledgeContentInfo:knowledgeContentInfo
            },this.generalKnowledgeViewerContainer);

            this.knowledgeItemMetaInfoWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemMetaInfoWidget({
                knowledgeContentInfo:knowledgeContentInfo},this.knowledgeItemMetaInfoContainer);

            this.itemRelatedMainCategoriesWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemRelatedMainCategoriesWidget({
                knowledgeContentInfo:knowledgeContentInfo,mainCategoriesContainer:this.mainCategoriesContainer},this.itemRelatedMainCategoriesWidgetContainer);

            this.itemRecommendedKnowledgeWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.ItemRecommendedKnowledgeWidget({
                knowledgeContentInfo:knowledgeContentInfo},this.itemRecommendedKnowledgeWidgetContainer);

            this.knowledgeItemAttachedTagEditorWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagEditorWidget({
                knowledgeContentInfo:knowledgeContentInfo,attachedTags:knowledgeContentInfo.contentTags,knowledgeCategoryInheritDataStore:this.knowledgeDisplayPanelWidget.getKnowledgeCategoryInheritDataStore()});

            this.knowledgeTagInfoMenuDialog=new idx.widget.MenuDialog({});
            dojo.connect( this.knowledgeTagInfoMenuDialog,"onOpen",this.knowledgeItemAttachedTagEditorWidget,"renderTagItems");
            dojo.place(this.knowledgeItemAttachedTagEditorWidget.domNode, this.knowledgeTagInfoMenuDialog.containerNode);
            var showTagDialogLinklabel="分类标签 <i class='icon-caret-down'></i>";
            new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:showTagDialogLinklabel,dropDown: this.knowledgeTagInfoMenuDialog},this.knowledgeTagSwitcherContainer);
            this.knowledgeItemBelongedCollectionListMenuDialog=new idx.widget.MenuDialog({});
            this.knowledgeItemBelongedCollectionListWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemBelongedCollectionListWidget({
                knowledgeContentInfo:knowledgeContentInfo,popupDialog:this.knowledgeItemBelongedCollectionListMenuDialog});
            dojo.place(this.knowledgeItemBelongedCollectionListWidget.domNode, this.knowledgeItemBelongedCollectionListMenuDialog.containerNode);
            var showProjectDialogLinklabel="所属专辑 <i class='icon-caret-down'></i>";
            new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:showProjectDialogLinklabel,dropDown: this.knowledgeItemBelongedCollectionListMenuDialog},this.knowledgeProjectsSwitcherContainer);
            this.viewKnowledgeItem();
            if(KNOWLEDGESEARCH_CURRENT_MULTIITEMS_SEARCH_RESULT){
                dojo.style(this.sameSearchResultContainer,"display","");
            }else{
                dojo.style(this.sameSearchResultContainer,"display","none");
            }
        },
        downloadKnowledgeFile:function(){
            var knowledgeContentInfo=this.knowledgeMetaInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            var location=KNOWLEDGE_OPERATION_SERVICE_ROOT+"downloadKnowledgeContentFromCache/";
            var downloadIframeName = "Iframe_"+new Date().getTime();
            var browserType="";
            if(dojo.isMozilla){browserType="Mozilla";}
            if(dojo.isSpidermonkey){browserType="Spidermonkey";}
            if(dojo.isChrome){browserType="Chrome";}
            if(dojo.isIE){browserType="IE";}
            if(dojo.isSafari){browserType="Safari";}
            if(dojo.isOpera){browserType="Opera";}
            if(dojo.isFF){browserType="FireFox";}
            var fullLocation=location+"?bucketName="+knowledgeContentInfo.bucketName+"&contentName="+knowledgeContentInfo.contentName+"&contentLocation="+knowledgeContentInfo.contentLocation+"&browserType="+browserType;
            var iframe = Iframe.create(downloadIframeName);
            Iframe.setSrc(iframe, fullLocation, false);
        },
        showFullScreenPreview:function(){
            var documentViewerWidth=win.getBox().w;
            if(win.getBox().w>200){
                documentViewerWidth=win.getBox().w-50;
            }
            var documentViewerHeight=win.getBox().h;
            var viewerWidthStyle="width:"+documentViewerWidth+"px;height:"+documentViewerHeight+"px;";
            var knowledgeContentInfo=this.knowledgeMetaInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            var viewerWidth=documentViewerWidth-210;
            var viewerHeight=documentViewerHeight-260;
            if(dojo.isChrome){
                viewerWidth=documentViewerWidth-245;
                viewerHeight=documentViewerHeight-270;
            }
            this.fullSizeGeneralKnowledgeViewerWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.GeneralKnowledgeViewerWidget({
                "knowledgeContentInfo":knowledgeContentInfo,"viewerWidth":viewerWidth,"viewerHeight":viewerHeight
            });
            var	dialog = new Dialog({
                style:viewerWidthStyle,
                title: "<span style='font-size: 0.7em;'><i class='icon-resize-full'></i> 全屏文件预览: <b>",
                content:this.fullSizeGeneralKnowledgeViewerWidget,
                //class:'nonModal',// for noe modal window
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dialog.show();
        },
        collectKnowledgeItem:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var knowledgeContentInfo=this.knowledgeMetaInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            var documentId=knowledgeContentInfo.sequenceNumber;
            var documentDesc=knowledgeContentInfo.contentDescription;
            var collectionDocumentObj={};
            var collectionDocumentObjContent=dojo.toJson(collectionDocumentObj);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"collectDocument/"+userId+"/"+documentId;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                if(data["Status"]=="OK"){
                    UI.showToasterMessage({type:"success",message:"收藏素材 <b>"+documentDesc+"</b> 成功"});
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,collectionDocumentObjContent,loadCallback,errorCallback);
        },
        viewKnowledgeItem:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var knowledgeContentInfo=this.knowledgeMetaInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            var documentId=knowledgeContentInfo.sequenceNumber;
            var collectionDocumentObj={};
            var collectionDocumentObjContent=dojo.toJson(collectionDocumentObj);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"viewDocument/"+userId+"/"+documentId;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
            };
            Application.WebServiceUtil.postJSONData(resturl,collectionDocumentObjContent,loadCallback,errorCallback);
        },
        showSameSearchResult:function(){
            var knowledgeContentInfo=this.knowledgeMetaInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            var viewerWidthStyle="width:1100px;";
            this.sameSearchResultWallDisplayWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget(
                {knowledgeMetaInfo:KNOWLEDGESEARCH_CURRENT_MULTIITEMS_SEARCH_RESULT,highLightKnowledgeContent:knowledgeContentInfo});
            this.sameSearchResultWallDisplayWidgetDialog = new Dialog({
                style:viewerWidthStyle,
                title: "<i class='icon-th'></i> 当前素材搜索结果:",
                content:this.sameSearchResultWallDisplayWidget,
                //class:'nonModal',// for noe modal window
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            this.sameSearchResultWallDisplayWidgetDialog.show();
        },
        destroy:function(){
            this.generalKnowledgeViewerWidget.destroy();
            if(this.fullSizeGeneralKnowledgeViewerWidget){
                this.fullSizeGeneralKnowledgeViewerWidget.destroy();
            }
            this.knowledgeItemMetaInfoWidget.destroy();
            this.itemRecommendedKnowledgeWidget.destroy();
            this.itemRelatedMainCategoriesWidget.destroy();
            this.knowledgeTagInfoMenuDialog.destroy();
            this.knowledgeItemAttachedTagEditorWidget.destroy();
            this.knowledgeItemBelongedCollectionListMenuDialog.destroy();
            this.knowledgeItemBelongedCollectionListWidget.destroy();
            if(this.sameSearchResultWallDisplayWidget!=null){
                this.sameSearchResultWallDisplayWidget.destroy();
            }
            if(this.sameSearchResultWallDisplayWidgetDialog!=null){
                this.sameSearchResultWallDisplayWidgetDialog.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});