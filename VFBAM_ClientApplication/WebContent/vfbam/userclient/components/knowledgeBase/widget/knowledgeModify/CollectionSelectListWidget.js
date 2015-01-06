require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeModify/template/CollectionSelectListWidget.html","dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionSelectListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        collectionInfoItemList:null,
        currentPageNumber:null,
        collectionNameFilterMenuDialog:null,
        collectionSelectNameFilterWidget:null,
        collectionNameFilterDropDown:null,
        collectionNameFilter:null,
        postCreate: function(){
            this.collectionInfoItemList=[];
            this.currentPageNumber=1;
            this.collectionNameFilter="";
            var previewFileLocation =KNOWLEDGE_OPERATION_SERVICE_ROOT+"getKnowledgeContentPreviewThumbnailFile/"+this.knowledgeContentInfo.bucketName+"/"+this.knowledgeContentInfo.contentName+"?contentMimeType="+
                this.knowledgeContentInfo.contentMimeType;
            this.thubmnailPic.src=previewFileLocation;
            this.knowledgeTitleTxt.innerHTML=this.knowledgeContentInfo.contentDescription;
            this.knowledgeFileName.innerHTML=this.knowledgeContentInfo.contentName;
            this.collectionNameFilterMenuDialog=new idx.widget.MenuDialog();
            this.collectionSelectNameFilterWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionNameFilterWidget({filterCallback:dojo.hitch(this,this.filterCollectionByName)});
            dojo.place(this.collectionSelectNameFilterWidget.domNode, this.collectionNameFilterMenuDialog.containerNode);
            var collectionNameFilterDropdownLabel='<i class="icon-filter"></i> 专辑名称过滤';
            this.collectionNameFilterDropDown=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:collectionNameFilterDropdownLabel,dropDown: this.collectionNameFilterMenuDialog},this.collectionNameFilterContainer);
            this.loadCollectionListInfo();
        },
        loadCollectionListInfo:function(){
            var that=this;
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getProjectList/?pageSize=20&currentPageNumber="+this.currentPageNumber;
            if(this.collectionNameFilter!=""){
                resturl=resturl+"&projectName="+this.collectionNameFilter;
            }
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(returnData){
                that.renderCollectionItems(returnData);
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        loadPreviousPage:function(){
            this.currentPageNumber--;
            this.loadCollectionListInfo();
        },
        loadNextPage:function(){
            this.currentPageNumber++;
            this.loadCollectionListInfo();
        },
        filterCollectionByName:function(){
            var filterValue=this.collectionSelectNameFilterWidget.getFilterValue();
            this.collectionSelectNameFilterWidget.clearFilterValue();
            this.collectionNameFilterMenuDialog.close();
            this.collectionNameFilter=filterValue;
            this.currentPageNumber=1;
            this.loadCollectionListInfo();
        },
        renderCollectionItems:function(collectionInfoObject){
            dojo.empty(this.collectionSelectionContainer);
            dojo.forEach(this.collectionInfoItemList,function(collectionInfoItemL){
                collectionInfoItemL.destroy();
            });
            this.collectionInfoItemList.splice(0, this.collectionInfoItemList.length);
            if(collectionInfoObject.currentPageNumber){
                this.currentCollectionListPageNumber.innerHTML=collectionInfoObject.currentPageNumber;
            }else{
                this.currentCollectionListPageNumber.innerHTML=0;
            }
            if(collectionInfoObject.pageCount){
                this.totalCollectionPageNumber.innerHTML=collectionInfoObject.pageCount;
            }else{
                this.totalCollectionPageNumber.innerHTML=0;
            }
            if(collectionInfoObject.totalCount){
                this.collectionTotalNumber.innerHTML=collectionInfoObject.totalCount;
            }else{
                this.collectionTotalNumber.innerHTML=0;
            }
            if(collectionInfoObject.isFirstPage){
                this.previousPageButton.set("disabled","disabled");
            }else{
                this.previousPageButton.set("disabled",false);
            }
            if(collectionInfoObject.isLastPage){
                this.nextPageButton.set("disabled","disabled");
            }else{
                this.nextPageButton.set("disabled",false);
            }
            this.filterTxt.innerHTML=this.collectionNameFilter;
            if(this.collectionNameFilter!=""){
                dojo.style(this.filterContentPrompt,"display","");
            }else{
                dojo.style(this.filterContentPrompt,"display","none");
            }
            var that=this;
            var isOdd=true;
            var collectionList=collectionInfoObject.projects;
            if(collectionList.length==0){
                this.previousPageButton.set("disabled","disabled");
                this.nextPageButton.set("disabled","disabled");
            }
            dojo.forEach(collectionList,function(collectionInfoItem){
                var currentCollectionItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.CollectionSelectItemWidget({collectionInfo:collectionInfoItem,knowledgeContentInfo:that.knowledgeContentInfo});
                if(isOdd){
                    domClass.add(currentCollectionItem.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentCollectionItem.domNode, "app_magazineView_item_even");
                }
                isOdd=!isOdd;
                that.collectionSelectionContainer.appendChild(currentCollectionItem.domNode);
                that.collectionInfoItemList.push(currentCollectionItem);
            });
        },
        destroy:function(){
            dojo.forEach(this.collectionInfoItemList,function(collectionInfoItem){
                collectionInfoItem.destroy();
            });
            this.collectionNameFilterMenuDialog.destroy();
            this.collectionSelectNameFilterWidget.destroy();
            this.collectionNameFilterDropDown.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});