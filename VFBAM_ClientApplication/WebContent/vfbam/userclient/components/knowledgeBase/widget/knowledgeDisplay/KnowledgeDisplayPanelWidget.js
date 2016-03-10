require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeDisplayPanelWidget.html",
    "dojo/dom-class","dojo/window","dojo/dom-style","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domClass,win,domStyle,domGeom){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeDisplayPanelWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeQueryHistoryList:null,
        knowledgeQueryHistoryListMenuDialog:null,
        knowledgeQueryHistoryListDropDown:null,
        currentKnowledgeViewInfo:null,
        knowledgeContentDisplayItemList:null,
        knowledgeCategoryInheritDataStore:null,
        postCreate: function(){
            this.modifyDisplayPanelHeight();
            Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,dojo.hitch(this,this.showKnowledgeContentView));
            Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_RELOADKNOWLEDGECONTENT_EVENT,dojo.hitch(this,this.reloadKnowledgeContentView));
            Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_UPDATECONTENTDISPLAYTITLE_EVENT,dojo.hitch(this,this.updateKnowledgeContentDisplayTitle));
            Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_UPDATEKNOWLEDGEDISPLAYPANELHEIGHT_EVENT,dojo.hitch(this,this.modifyDisplayPanelHeight));
            this.knowledgeQueryHistoryListMenuDialog=new idx.widget.MenuDialog();
            this.knowledgeQueryHistoryList=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeQueryHistoryListWidget({containerDialog: this.knowledgeQueryHistoryListMenuDialog,displayPanel:this});
            dojo.place(this.knowledgeQueryHistoryList.domNode, this.knowledgeQueryHistoryListMenuDialog.containerNode);
            var historyListBrowseDropdownLabel='<i class="icon-desktop"></i> 当前显示 <i style="color: #00649d;" class="icon-caret-down icon-border icon-large"></i> :';
            this.knowledgeQueryHistoryListDropDown=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:historyListBrowseDropdownLabel,dropDown: this.knowledgeQueryHistoryListMenuDialog},this.historyListBrowseDropdownContainer);

            this.knowledgeContentDisplayItemList=[];
            var defaultDisplayViewInfo={
                KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
                KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_RECOMMENDED,
                KNOWLEDGE_VIEW_DATA:{
                    DISPLAY_TITLE:"推荐的专辑",
                    VIEW_METADATA:{
                    },
                    VIEW_PAGEDATA:{
                        PAGING:true,
                        PAGE_SIZE:5,
                        CURRENT_PAGE_NUMBER:1
                    }
                }
            };
            this.showKnowledgeContentView(defaultDisplayViewInfo);
            this.currentKnowledgeViewInfo=defaultDisplayViewInfo;
            this._loadKnowledgeCategoryInheritDataStore();
        },
        modifyDisplayPanelHeight:function(){
            //init knowledge display zone Center container height
            var App_KnowledgeBase_UI_Header_Height=0;
            if(dojo.isChrome){
                App_KnowledgeBase_UI_Header_Height=220;
            }else{
                App_KnowledgeBase_UI_Header_Height=214;
            }
            var vs =win.getBox();
            var App_KnowledgeBase_UI_Dynamic_Real_Height=  vs.h-App_KnowledgeBase_UI_Header_Height;
            var currentHeightStyle=""+ App_KnowledgeBase_UI_Dynamic_Real_Height+"px";
            dojo.style(this.app_knowledgeBase_resultDisplayZone,"height",currentHeightStyle);
        },
        showKnowledgeContentView:function(data){
            this.knowledgeQueryHistoryList.addViewQueryHistory(data);
            this.currentDisplayTitle.innerHTML=data.KNOWLEDGE_VIEW_DATA.DISPLAY_TITLE;
            this.currentKnowledgeViewInfo=data;
            this._doLoadKnowledgeContentData(this.currentKnowledgeViewInfo);
        },
        reloadKnowledgeContentView:function(data){
            this.currentDisplayTitle.innerHTML=data.KNOWLEDGE_VIEW_DATA.DISPLAY_TITLE;
            this.currentKnowledgeViewInfo=data;
            this._doLoadKnowledgeContentData(this.currentKnowledgeViewInfo);
        },
        updateKnowledgeContentDisplayTitle:function(data){
            var newContentDisplayName=data.KNOWLEDGE_VIEW_DATA.DISPLAY_TITLE;
            var changedContentObject=data.KNOWLEDGE_VIEW_DATA.VIEW_METADATA;
            if(this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_TYPE==KNOWLEDGE_VIEW_TYPE_MATERIAL &&
                this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_MODE== KNOWLEDGE_VIEW_MODE_SINGLE &&
                this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_MATERIAL){
                if(this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.sequenceNumber==changedContentObject.sequenceNumber){
                    this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.contentDescription=newContentDisplayName;
                    this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.DISPLAY_TITLE=newContentDisplayName;
                    this.currentDisplayTitle.innerHTML=newContentDisplayName;
                }
            }
            this.knowledgeQueryHistoryList.updateKnowledgeContentDisplayTitle(data);
        },
        refreshView:function(){
            this._doLoadKnowledgeContentData(this.currentKnowledgeViewInfo);
        },
        getPreviousPageMessage:function(){
            var currentPageNumber=this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER;
            this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER=currentPageNumber-1;
            this._doLoadKnowledgeContentData(this.currentKnowledgeViewInfo);
        },
        getNextPageMessage:function(){
            var currentPageNumber=this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER;
            this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER=currentPageNumber+1;
            this._doLoadKnowledgeContentData(this.currentKnowledgeViewInfo);
        },
        _setUpPagingElementInfo:function(pagingMetaData){
            if(pagingMetaData.isFirstPage){
                this.previousPageButton.set("disabled","disabled");
            }else{
                this.previousPageButton.set("disabled",false);
            }
            if(pagingMetaData.isLastPage){
                this.nextPageButton.set("disabled","disabled");
            }else{
                this.nextPageButton.set("disabled",false);
            }
            if(pagingMetaData.currentPageNumber===undefined){
                this.currentPageNumber.innerHTML="-";
                this.previousPageButton.set("disabled","disabled");
                this.nextPageButton.set("disabled","disabled");
            }else{
                this.currentPageNumber.innerHTML=pagingMetaData.currentPageNumber;
            }
            if(pagingMetaData.pageCount===undefined){
                this.totalPageNumber.innerHTML="-";
            }else{
                this.totalPageNumber.innerHTML=pagingMetaData.pageCount;
            }
            if(pagingMetaData.totalCount===undefined){
                this.totalItemNumber.innerHTML="-";
            }else{
                this.totalItemNumber.innerHTML=pagingMetaData.totalCount;
            }
        },
        _doLoadKnowledgeContentData:function(contentData){
            console.log(contentData);
            dojo.forEach(this.knowledgeContentDisplayItemList,function(currentDisplayItem){
                currentDisplayItem.destroy();
            });
            this.knowledgeContentDisplayItemList.splice(0,this.knowledgeContentDisplayItemList.length);
            dojo.empty(this.app_knowledgeBase_contentDisplayContainer);
            var that=this;
            if(contentData.KNOWLEDGE_VIEW_MODE==KNOWLEDGE_VIEW_MODE_SINGLE){
                dojo.style(this.pagingElementContainer,"display","none");
            }else{
                dojo.style(this.pagingElementContainer,"display","");
            }
            var that=this;
            if(contentData.KNOWLEDGE_VIEW_TYPE==KNOWLEDGE_VIEW_TYPE_MATERIAL){
                if(contentData.KNOWLEDGE_VIEW_MODE==KNOWLEDGE_VIEW_MODE_SINGLE){
                    var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemDetailDisplayWidget(
                        {resultDisplayZoneWidth:this.resultDisplayZoneWidth,knowledgeMetaInfo:contentData,knowledgeDisplayPanelWidget:this});
                    this.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                    this.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                }
                if(contentData.KNOWLEDGE_VIEW_MODE==KNOWLEDGE_VIEW_MODE_MULTIPLE){
                    if(contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA){
                        var pageSize=50;
                        var currentPageNumber=1;
                        if(contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA){
                            if (contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE) {
                                pageSize = contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE;
                            }
                            if (contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER) {
                                currentPageNumber = contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER;
                            }
                        }else{
                            /*
                             this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA={};
                             this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGING=true;
                             this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE=50;
                             this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER=1;
                             */
                        }
                        var pagingQueryStr="&pageSize="+pageSize+"&currentPageNumber="+currentPageNumber;
                        var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                        if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_RECOMMENDED){
                            UI.showProgressDialog("查询数据");
                            var timer = new dojox.timing.Timer(300);
                            timer.onTick = function(){
                                var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getRecommendedDocumentsByUserId/"+userId+"?defaultSort=true"+pagingQueryStr;
                                var syncFlag=true;
                                var errorCallback= function(data){
                                    UI.showSystemErrorMessage(data);
                                };
                                var loadCallback=function(returnData){
                                    UI.hideProgressDialog();
                                    var documentsList=returnData.docs;
                                    var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget(
                                        {resultDisplayZoneWidth:that.resultDisplayZoneWidth,knowledgeMetaInfo:documentsList,knowledgeDisplayPanelWidget:that});
                                    that.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                                    that.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                                    that._setUpPagingElementInfo(returnData);
                                };
                                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                                timer.stop();
                            };
                            timer.start();
                        }
                        if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_POP||
                            contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_LATEST||
                            contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_ALL){
                            UI.showProgressDialog("查询数据");
                            var timer = new dojox.timing.Timer(300);
                            timer.onTick = function(){
                                var resturl="";
                                if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_POP){
                                    resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByKeyWords?defaultSort=true"+pagingQueryStr;
                                }
                                if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_LATEST){
                                    resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByKeyWords?defaultSort=false&orderBy=contentCreatedTime&sort=DESC"+pagingQueryStr;
                                }
                                if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_ALL){
                                    resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByKeyWords?defaultSort=false&orderBy=contentName&sort=DESC"+pagingQueryStr;
                                }
                                var syncFlag=true;
                                var errorCallback= function(data){
                                    UI.showSystemErrorMessage(data);
                                };
                                var loadCallback=function(returnData){
                                    var documentsList=returnData.docs;
                                    var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget(
                                        {resultDisplayZoneWidth:that.resultDisplayZoneWidth,knowledgeMetaInfo:documentsList,knowledgeDisplayPanelWidget:that});
                                    that.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                                    that.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                                    that._setUpPagingElementInfo(returnData);
                                    UI.hideProgressDialog();
                                };
                                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                                timer.stop();
                            };
                            timer.start();
                        }
                        if( contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_FAVORITE){
                            //here is mock logic,only display random contents
                            UI.showProgressDialog("查询数据");
                            var timer = new dojox.timing.Timer(300);
                            timer.onTick = function(){
                                var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getMyFavoriteDocuments/"+userId+"?type=Query"+pagingQueryStr;
                                var syncFlag=true;
                                var errorCallback= function(data){
                                    UI.showSystemErrorMessage(data);
                                };
                                var loadCallback=function(returnData){
                                    var documentsList=returnData.docs;
                                    var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget(
                                        {resultDisplayZoneWidth:that.resultDisplayZoneWidth,knowledgeMetaInfo:documentsList,knowledgeDisplayPanelWidget:that});
                                    that.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                                    that.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                                    that._setUpPagingElementInfo(returnData);
                                    UI.hideProgressDialog();
                                };
                                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                                timer.stop();
                            };
                            timer.start();
                        }
                        if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH){
                            //keywork Search logic
                            if(contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.QUERY_TYPE==KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH){
                                var searchValue=contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.KEYWORDSEARCH_PROPERTYVALUE;
                                if(contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.KEYWORDSEARCH_PROPERTYNAME==KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_DESCRIPTION){
                                    UI.showProgressDialog("查询数据");
                                    var timer = new dojox.timing.Timer(300);
                                    timer.onTick = function(){
                                        var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByKeyWords?propName=contentDescription&propValue="+searchValue+pagingQueryStr;
                                        var syncFlag=true;
                                        var errorCallback= function(data){
                                            UI.showSystemErrorMessage(data);
                                        };
                                        var loadCallback=function(returnData){
                                            UI.hideProgressDialog();
                                            if(returnData.docs.length>0){
                                                var documentsList=returnData.docs;
                                                var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget(
                                                    {resultDisplayZoneWidth:that.resultDisplayZoneWidth,knowledgeMetaInfo:documentsList,knowledgeDisplayPanelWidget:that});
                                                that.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                                                that.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                                                that._setUpPagingElementInfo(returnData);
                                            }else{
                                                var errorDialogDataObj={};
                                                var okButtonAction=function(){};
                                                errorDialogDataObj.message="描述包含: <b>"+searchValue+"</b> 的素材不存在";
                                                errorDialogDataObj.oKButtonAction=okButtonAction;
                                                errorDialogDataObj.oKButtonLabel="确定";
                                                UI.showErrorDialog(errorDialogDataObj);
                                            }
                                        };
                                        Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                                        timer.stop();
                                    };
                                    timer.start();
                                }
                                if(contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.KEYWORDSEARCH_PROPERTYNAME==KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_NAME){
                                    UI.showProgressDialog("查询数据");
                                    var timer = new dojox.timing.Timer(300);
                                    timer.onTick = function(){
                                        var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByKeyWords?propName=contentName&propValue="+searchValue+pagingQueryStr;
                                        var syncFlag=true;
                                        var errorCallback= function(data){
                                            UI.showSystemErrorMessage(data);
                                        };
                                        var loadCallback=function(returnData){
                                            UI.hideProgressDialog();
                                            if(returnData.docs.length>0){
                                                var documentsList=returnData.docs;
                                                var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget(
                                                    {resultDisplayZoneWidth:that.resultDisplayZoneWidth,knowledgeMetaInfo:documentsList,knowledgeDisplayPanelWidget:that});
                                                that.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                                                that.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                                                that._setUpPagingElementInfo(returnData);
                                            }else{
                                                var errorDialogDataObj={};
                                                var okButtonAction=function(){};
                                                errorDialogDataObj.message="名称包含: <b>"+searchValue+"</b> 的素材不存在";
                                                errorDialogDataObj.oKButtonAction=okButtonAction;
                                                errorDialogDataObj.oKButtonLabel="确定";
                                                UI.showErrorDialog(errorDialogDataObj);
                                            }
                                        };
                                        Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                                        timer.stop();
                                    };
                                    timer.start();
                                }
                            }
                        }
                    }else{
                        var errorDialogDataObj={};
                        var okButtonAction=function(){};
                        errorDialogDataObj.message="缺少必须的素材检索条件";
                        errorDialogDataObj.oKButtonAction=okButtonAction;
                        errorDialogDataObj.oKButtonLabel="确定";
                        UI.showErrorDialog(errorDialogDataObj);
                    }
                }
            }else if(contentData.KNOWLEDGE_VIEW_TYPE==KNOWLEDGE_VIEW_TYPE_COLLECTION){

                KNOWLEDGESEARCH_CURRENT_MULTIITEMS_SEARCH_RESULT=null;

                if(contentData.KNOWLEDGE_VIEW_MODE==KNOWLEDGE_VIEW_MODE_SINGLE){
                    var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDetailDisplayWidget(
                        {resultDisplayZoneWidth:this.resultDisplayZoneWidth,knowledgeCollectionInfo:contentData,knowledgeDisplayPanelWidget:this});
                    this.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                    this.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                }
                if(contentData.KNOWLEDGE_VIEW_MODE==KNOWLEDGE_VIEW_MODE_MULTIPLE){
                    if(contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA) {
                        var pageSize = 5;
                        var currentPageNumber = 1;
                        if (contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA) {
                            if (contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE) {
                                pageSize = contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE;
                            }
                            if (contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER) {
                                currentPageNumber = contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER;
                            }
                        } else {
                            /*
                             this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA = {}
                             this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGING=true;
                             this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE=5;
                             this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER=1;
                             */
                        }
                        if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_RECOMMENDED){
                            UI.showProgressDialog("查询数据");
                            var timer = new dojox.timing.Timer(300);
                            timer.onTick = function(){
                                var collectionQueryObj={};
                                collectionQueryObj.projectPageSize=5;
                                collectionQueryObj.projectCurrentPageNumber=currentPageNumber;
                                collectionQueryObj.docsNumberPerProject=20;
                                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                                var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getRecommendedCollectionsByUserId/"+userId+"/";
                                resturl=resturl+"?projectPageSize="+collectionQueryObj.projectPageSize+"&docsNumberPerProject="+collectionQueryObj.docsNumberPerProject+
                                    "&projectCurrentPageNumber="+collectionQueryObj.projectCurrentPageNumber;
                                var syncFlag=true;
                                var errorCallback= function(data){
                                    UI.showSystemErrorMessage(data);
                                };
                                var loadCallback=function(data){
                                    var collectionList=data.projects;
                                    dojo.forEach(collectionList,function(currentCollectionContent){
                                        var currentCollection=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDisplayWidget(
                                            {resultDisplayZoneWidth:that.resultDisplayZoneWidth,collectionItemInfo:currentCollectionContent,knowledgeDisplayPanelWidget:that});
                                        that.app_knowledgeBase_contentDisplayContainer.appendChild(currentCollection.domNode);
                                        that.knowledgeContentDisplayItemList.push(currentCollection);
                                    });
                                    that._setUpPagingElementInfo(data);
                                    UI.hideProgressDialog();
                                };
                                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                                timer.stop();
                            };
                            timer.start();
                        }
                        if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_ALL||
                            contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_LATEST||
                            contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_POP){
                            UI.showProgressDialog("查询数据");
                            var timer = new dojox.timing.Timer(300);
                            timer.onTick = function(){
                                var collectionQueryObj={};
                                if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_ALL){
                                    collectionQueryObj.projectPageSize=pageSize;
                                    collectionQueryObj.projectCurrentPageNumber=currentPageNumber;
                                    collectionQueryObj.docsNumberPerProject=20;
                                    collectionQueryObj.projectOrderBy="projectName";
                                    collectionQueryObj.projectSort="ASC";
                                    collectionQueryObj.defaultSort=false;
                                }
                                if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_LATEST){
                                    collectionQueryObj.projectPageSize=pageSize;
                                    collectionQueryObj.projectCurrentPageNumber=currentPageNumber;
                                    collectionQueryObj.docsNumberPerProject=20;
                                    collectionQueryObj.projectOrderBy="projectLastModifiedTime";
                                    collectionQueryObj.projectSort="DESC";
                                    collectionQueryObj.defaultSort=false;
                                }
                                if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_POP){
                                    collectionQueryObj.projectPageSize=pageSize;
                                    collectionQueryObj.projectCurrentPageNumber=currentPageNumber;
                                    collectionQueryObj.docsNumberPerProject=20;
                                    collectionQueryObj.defaultSort=true;
                                }
                                var collectionQueryObjContent=dojo.toJson(collectionQueryObj);
                                var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getCollections/";
                                var errorCallback= function(data){
                                    UI.showSystemErrorMessage(data);
                                };
                                var loadCallback=function(data){
                                    var collectionList=data.projects;
                                    dojo.forEach(collectionList,function(currentCollectionContent){
                                        var currentCollection=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDisplayWidget(
                                            {resultDisplayZoneWidth:that.resultDisplayZoneWidth,collectionItemInfo:currentCollectionContent,knowledgeDisplayPanelWidget:that});
                                        that.app_knowledgeBase_contentDisplayContainer.appendChild(currentCollection.domNode);
                                        that.knowledgeContentDisplayItemList.push(currentCollection);
                                    });
                                    that._setUpPagingElementInfo(data);
                                    UI.hideProgressDialog();
                                };
                                Application.WebServiceUtil.postJSONData(resturl,collectionQueryObjContent,loadCallback,errorCallback);
                                timer.stop();
                            };
                            timer.start();
                        }
                        if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_FAVORITE){
                            UI.showProgressDialog("查询数据");
                            var timer = new dojox.timing.Timer(300);
                            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                            timer.onTick = function(){
                                var collectionQueryObj={};
                                collectionQueryObj.projectPageSize=5;
                                collectionQueryObj.projectCurrentPageNumber=currentPageNumber;
                                collectionQueryObj.docsNumberPerProject=20;
                                var collectionQueryObjContent=dojo.toJson(collectionQueryObj);
                                var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getMyFavoriteCollections/"+userId;
                                var errorCallback= function(data){
                                    UI.showSystemErrorMessage(data);
                                };
                                var loadCallback=function(data){
                                    var collectionList=data.projects;
                                    dojo.forEach(collectionList,function(currentCollectionContent){
                                        var currentCollection=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDisplayWidget(
                                            {resultDisplayZoneWidth:that.resultDisplayZoneWidth,collectionItemInfo:currentCollectionContent,knowledgeDisplayPanelWidget:that});
                                        that.app_knowledgeBase_contentDisplayContainer.appendChild(currentCollection.domNode);
                                        that.knowledgeContentDisplayItemList.push(currentCollection);
                                    });
                                    that._setUpPagingElementInfo(data);
                                    UI.hideProgressDialog();
                                };
                                Application.WebServiceUtil.postJSONData(resturl,collectionQueryObjContent,loadCallback,errorCallback);
                                timer.stop();
                            };
                            timer.start();
                        }
                        if (contentData.KNOWLEDGE_VIEW_CLASSIFY == KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH) {
                            var searchValue=contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.KEYWORDSEARCH_PROPERTYVALUE;
                            if(contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.KEYWORDSEARCH_PROPERTYNAME==KNOWLEDGESEARCH_INPUTTYPE_COLLECTION_NAME){
                                var collectionQueryObj={};
                                collectionQueryObj["projectFilterPropsMap"]=[
                                    {
                                        "propName":"projectName",
                                        "propValue":searchValue
                                    }
                                ];
                                collectionQueryObj["projectOrderBy"]="projectId";
                                collectionQueryObj["projectSort"]="DESC";
                                collectionQueryObj["projectPageSize"]=pageSize;
                                collectionQueryObj["projectCurrentPageNumber"]=currentPageNumber;
                                collectionQueryObj["docOrderBy"]="contentDescription";
                                collectionQueryObj["docSort"]="DESC";
                                collectionQueryObj["docsNumberPerProject"]=20;
                                collectionQueryObj["defaultSort"]=true;

                                UI.showProgressDialog("查询数据");
                                var timer = new dojox.timing.Timer(300);
                                timer.onTick = function(){
                                    var collectionQueryObjContent=dojo.toJson(collectionQueryObj);
                                    var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getCollectionsByKeyWords/";
                                    var errorCallback= function(data){
                                        UI.showSystemErrorMessage(data);
                                    };
                                    var loadCallback=function(data){
                                        var collectionList=data.projects;
                                        UI.hideProgressDialog();
                                        if(collectionList.length>0){
                                            dojo.forEach(collectionList,function(currentCollectionContent){
                                                var currentCollection=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDisplayWidget(
                                                    {resultDisplayZoneWidth:that.resultDisplayZoneWidth,collectionItemInfo:currentCollectionContent,knowledgeDisplayPanelWidget:that});
                                                that.app_knowledgeBase_contentDisplayContainer.appendChild(currentCollection.domNode);
                                                that.knowledgeContentDisplayItemList.push(currentCollection);
                                            });
                                            that._setUpPagingElementInfo(data);
                                        }else{
                                            var errorDialogDataObj={};
                                            var okButtonAction=function(){};
                                            errorDialogDataObj.message="名称包含: <b>"+searchValue+"</b> 的专辑不存在";
                                            errorDialogDataObj.oKButtonAction=okButtonAction;
                                            errorDialogDataObj.oKButtonLabel="确定";
                                            UI.showErrorDialog(errorDialogDataObj);
                                        }
                                    };
                                    Application.WebServiceUtil.postJSONData(resturl,collectionQueryObjContent,loadCallback,errorCallback);
                                    timer.stop();
                                };
                                timer.start();
                            }
                        }
                    }else{
                        var errorDialogDataObj={};
                        var okButtonAction=function(){};
                        errorDialogDataObj.message="缺少必须的专辑检索条件";
                        errorDialogDataObj.oKButtonAction=okButtonAction;
                        errorDialogDataObj.oKButtonLabel="确定";
                        UI.showErrorDialog(errorDialogDataObj);
                    }
                }
            }else if(contentData.KNOWLEDGE_VIEW_TYPE==KNOWLEDGE_VIEW_TYPE_ALL){
                if(contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA) {
                    var pageSize = 50;
                    var currentPageNumber = 1;
                    if (contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA) {
                        if (contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE) {
                            pageSize = contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE;
                        }
                        if (contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER) {
                            currentPageNumber = contentData.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER;
                        }
                    } else {
                        /*
                         this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA = {}
                         this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGING=true;
                         this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.PAGE_SIZE=50;
                         this.currentKnowledgeViewInfo.KNOWLEDGE_VIEW_DATA.VIEW_PAGEDATA.CURRENT_PAGE_NUMBER=1;
                         */
                    }
                }
                var pagingQueryStr="&pageSize="+pageSize+"&currentPageNumber="+currentPageNumber;
                if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_SAVEDSEARCH||
                    contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_TAGSEARCH){
                    UI.showProgressDialog("查询数据");
                    var timer = new dojox.timing.Timer(300);
                    timer.onTick = function(){
                        var selectedTags=contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.selectedCategories;
                        var multiTagSearchObj={};
                        multiTagSearchObj.nodeType="Tag";
                        multiTagSearchObj.filterPropName="categoryId";
                        multiTagSearchObj.orderBy="contentDescription";
                        multiTagSearchObj.sort="DESC";
                        multiTagSearchObj.pageSize=pageSize;
                        multiTagSearchObj.currentPageNumber=currentPageNumber;
                        multiTagSearchObj.limitCount=1000;
                        multiTagSearchObj.paging=true;
                        var tagIdsWithDepthMap=[];
                        dojo.forEach(selectedTags,function(currentTag){
                            var currentCategoryId="";
                            if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_SAVEDSEARCH){
                                currentCategoryId=currentTag;
                            }
                            if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_TAGSEARCH){
                                currentCategoryId=currentTag.categoryId;
                            }
                            var tagInfoObj={};
                            tagInfoObj.propValue=currentCategoryId;
                            tagInfoObj.startPathDepth=0;
                            tagInfoObj.pathDepth=4;
                            tagIdsWithDepthMap.push(tagInfoObj);
                        });
                        multiTagSearchObj.tagIdsWithDepthMap=tagIdsWithDepthMap;
                        var multiTagSearchObjContent=dojo.toJson(multiTagSearchObj);
                        var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByTagIds/";
                        var errorCallback= function(data){
                            UI.showSystemErrorMessage(data);
                        };
                        var loadCallback=function(data){
                            var documentList=data.docs;
                            var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget(
                                {resultDisplayZoneWidth:that.resultDisplayZoneWidth,knowledgeMetaInfo:documentList,knowledgeDisplayPanelWidget:that});
                            that.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                            that.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                            that._setUpPagingElementInfo(data);
                            UI.hideProgressDialog();
                        };
                        Application.WebServiceUtil.postJSONData(resturl,multiTagSearchObjContent,loadCallback,errorCallback);
                        timer.stop();
                    };
                    timer.start();
                }

                if(contentData.KNOWLEDGE_VIEW_CLASSIFY==KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH){
                    var searchValue=contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.KEYWORDSEARCH_PROPERTYVALUE;
                    var searchDisplayValue=contentData.KNOWLEDGE_VIEW_DATA.VIEW_METADATA.KEYWORDSEARCH_PROPERTYDISPLAYVALUE;
                    UI.showProgressDialog("查询数据");
                    var timer = new dojox.timing.Timer(300);
                    timer.onTick = function(){
                        var multiTagSearchObj={};
                        multiTagSearchObj.nodeType="Tag";
                        multiTagSearchObj.filterPropName="categoryId";
                        multiTagSearchObj.orderBy="contentDescription";
                        multiTagSearchObj.sort="DESC";
                        multiTagSearchObj.pageSize=pageSize;
                        multiTagSearchObj.currentPageNumber=currentPageNumber;
                        multiTagSearchObj.limitCount=1000;
                        multiTagSearchObj.paging=true;
                        multiTagSearchObj.booleanOperator=0;
                        var tagIdsWithDepthMap=[];
                        dojo.forEach(searchValue,function(currentTag){
                            var tagInfoObj={};
                            tagInfoObj.propValue=currentTag;
                            tagInfoObj.startPathDepth=0;
                            tagInfoObj.pathDepth=4;
                            tagIdsWithDepthMap.push(tagInfoObj);
                        });
                        multiTagSearchObj.tagIdsWithDepthMap=tagIdsWithDepthMap;
                        var multiTagSearchObjContent=dojo.toJson(multiTagSearchObj);
                        var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentsByTagIds/";
                        var errorCallback= function(data){
                            UI.showSystemErrorMessage(data);
                        };
                        var loadCallback=function(returnData){
                            UI.hideProgressDialog();
                            if(returnData.docs.length>0){
                                var documentList=returnData.docs;
                                var currentKnowledgeItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget(
                                    {resultDisplayZoneWidth:that.resultDisplayZoneWidth,knowledgeMetaInfo:documentList,knowledgeDisplayPanelWidget:that});
                                that.app_knowledgeBase_contentDisplayContainer.appendChild(currentKnowledgeItem.domNode);
                                that.knowledgeContentDisplayItemList.push(currentKnowledgeItem);
                                that._setUpPagingElementInfo(returnData);
                            }else{
                                var errorDialogDataObj={};
                                var okButtonAction=function(){};
                                errorDialogDataObj.message="标签包含: <b>"+searchDisplayValue+"</b> 的素材不存在";
                                errorDialogDataObj.oKButtonAction=okButtonAction;
                                errorDialogDataObj.oKButtonLabel="确定";
                                UI.showErrorDialog(errorDialogDataObj);
                            }
                        };
                        Application.WebServiceUtil.postJSONData(resturl,multiTagSearchObjContent,loadCallback,errorCallback);
                        timer.stop();
                    };
                    timer.start();
                }
            }else if(contentData.KNOWLEDGE_VIEW_TYPE==KNOWLEDGE_VIEW_TYPE_PEOPLE){

            }
        },
        doKnowledgeInputValueSearch:function(searchType,searchValue){
            var that=this;
            if(searchType==KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_SEQUENCE){
                UI.showProgressDialog("查询数据");
                var timer = new dojox.timing.Timer(300);
                timer.onTick = function(){
                    var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getDocumentBySequence/"+searchValue;
                    var syncFlag=true;
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(returnData){
                        UI.hideProgressDialog();
                        if(returnData.docs[0]){
                            var displayViewInfo={
                                KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                                KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_SINGLE,
                                KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
                                KNOWLEDGE_VIEW_DATA:{
                                    DISPLAY_TITLE:"搜索素材序号:"+searchValue,
                                    VIEW_METADATA:returnData.docs[0]
                                }
                            };
                            that.showKnowledgeContentView(displayViewInfo);
                        }else{
                            var errorDialogDataObj={};
                            var okButtonAction=function(){};
                            errorDialogDataObj.message="序号为: <b>"+searchValue+"</b> 的素材不存在";
                            errorDialogDataObj.oKButtonAction=okButtonAction;
                            errorDialogDataObj.oKButtonLabel="确定";
                            UI.showErrorDialog(errorDialogDataObj);
                        }
                    };
                    Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                    timer.stop();
                };
                timer.start();
            }
            if(searchType==KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_DESCRIPTION){
                var displayViewInfo={
                    KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                    KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                    KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
                    KNOWLEDGE_VIEW_DATA:{
                        DISPLAY_TITLE:"搜索素材描述:"+searchValue,
                        VIEW_METADATA:{
                            QUERY_TYPE:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                            KEYWORDSEARCH_PROPERTYNAME:KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_DESCRIPTION,
                            KEYWORDSEARCH_PROPERTYVALUE:searchValue
                        },
                        VIEW_PAGEDATA:{
                            PAGING:true,
                            PAGE_SIZE:50,
                            CURRENT_PAGE_NUMBER:1
                        }
                    }
                };
                this.showKnowledgeContentView(displayViewInfo);
            }
            if(searchType==KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_NAME){
                var displayViewInfo={
                    KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                    KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                    KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
                    KNOWLEDGE_VIEW_DATA:{
                        DISPLAY_TITLE:"搜索素材名称:"+searchValue,
                        VIEW_METADATA:{
                            QUERY_TYPE:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                            KEYWORDSEARCH_PROPERTYNAME:KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_NAME,
                            KEYWORDSEARCH_PROPERTYVALUE:searchValue
                        },
                        VIEW_PAGEDATA:{
                            PAGING:true,
                            PAGE_SIZE:50,
                            CURRENT_PAGE_NUMBER:1
                        }
                    }
                };
                this.showKnowledgeContentView(displayViewInfo);
            }
            if(searchType==KNOWLEDGESEARCH_INPUTTYPE_COLLECTION_NAME){
                var displayViewInfo={
                    KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                    KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                    KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
                    KNOWLEDGE_VIEW_DATA:{
                        DISPLAY_TITLE:"搜索专辑名称:"+searchValue,
                        VIEW_METADATA:{
                            QUERY_TYPE:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                            KEYWORDSEARCH_PROPERTYNAME:KNOWLEDGESEARCH_INPUTTYPE_COLLECTION_NAME,
                            KEYWORDSEARCH_PROPERTYVALUE:searchValue
                        },
                        VIEW_PAGEDATA:{
                            PAGING:true,
                            PAGE_SIZE:5,
                            CURRENT_PAGE_NUMBER:1
                        }
                    }
                };
                this.showKnowledgeContentView(displayViewInfo);
            }
            if(searchType==KNOWLEDGESEARCH_INPUTTYPE_TAG_VALUE){
                var inputTagArrays=searchValue.split(" ");
                var inputValidTagNameMap={};
                var searchValueinValid=false;
                var categoryInheritDataStore= this.getKnowledgeCategoryInheritDataStore();
                var matchedTagsArray = categoryInheritDataStore.query({ categoryDisplayName_cn: searchValue });
                var fullMatchedTagValurArray=[];
                dojo.forEach(inputTagArrays,function(currentTag){
                    if(currentTag!=""){
                        var currentMatchedTagsArray= categoryInheritDataStore.query({ categoryDisplayName_cn: currentTag });
                        if(currentMatchedTagsArray.length==0){
                            var errorDialogDataObj={};
                            var okButtonAction=function(){};
                            errorDialogDataObj.message="标签分类: <b>"+currentTag+"</b> 不存在";
                            errorDialogDataObj.oKButtonAction=okButtonAction;
                            errorDialogDataObj.oKButtonLabel="确定";
                            UI.showErrorDialog(errorDialogDataObj);
                            searchValueinValid=true;
                            return;
                        }else{
                            if(!inputValidTagNameMap[currentTag]){
                                inputValidTagNameMap[currentTag]=currentMatchedTagsArray;
                                dojo.forEach(currentMatchedTagsArray,function(currentMatchedTagValue){
                                    fullMatchedTagValurArray.push(currentMatchedTagValue);
                                });
                            }
                        }
                    }
                });
                if(searchValueinValid){
                    return;
                }else{
                    var matchedTageValue=[];
                    dojo.forEach(fullMatchedTagValurArray,function(tagObj){
                        matchedTageValue.push(tagObj.categoryId);
                    });
                    var displayViewInfo={
                        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_ALL,
                        KNOWLEDGE_VIEW_DATA:{
                            DISPLAY_TITLE:"搜索标签分类:"+searchValue,
                            VIEW_METADATA:{
                                QUERY_TYPE:KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH,
                                KEYWORDSEARCH_PROPERTYNAME:KNOWLEDGESEARCH_INPUTTYPE_TAG_VALUE,
                                KEYWORDSEARCH_PROPERTYVALUE:matchedTageValue,
                                KEYWORDSEARCH_PROPERTYDISPLAYVALUE:searchValue
                            },
                            VIEW_PAGEDATA:{
                                PAGING:true,
                                PAGE_SIZE:50,
                                CURRENT_PAGE_NUMBER:1
                            }
                        }
                    };
                    this.showKnowledgeContentView(displayViewInfo);
                }
            }
        },
        updateMoveButtonStatus:function(moveButtonsStatus ){
            if(moveButtonsStatus["havePreview"]){
                dojo.style(this.previewHistoryItemButton,"display","");
                dojo.style(this.previewHistoryItemButtonGrey,"display","none");
            }else{
                dojo.style(this.previewHistoryItemButton,"display","none");
                dojo.style(this.previewHistoryItemButtonGrey,"display","");
            }
            if(moveButtonsStatus["haveNext"]){
                dojo.style(this.nextHistoryItemButton,"display","");
                dojo.style(this.nextHistoryItemButtonGrey,"display","none");
            }else{
                dojo.style(this.nextHistoryItemButton,"display","none");
                dojo.style(this.nextHistoryItemButtonGrey,"display","");
            }
        },
        showPreviewKnowledgeContent:function(){
            this.knowledgeQueryHistoryList.showPreviewKnowledgeContent();
        },
        showNextKnowledgeContent:function(){
            this.knowledgeQueryHistoryList.showNextKnowledgeContent();
        },
        getKnowledgeCategoryInheritDataStore:function(){
            return this.knowledgeCategoryInheritDataStore;
        },
        _loadKnowledgeCategoryInheritDataStore:function(){
            var that=this;
            var callBack=function(storeData){
                that.knowledgeCategoryInheritDataStore=storeData;
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
        _endOfCode: function(){}
    });
});