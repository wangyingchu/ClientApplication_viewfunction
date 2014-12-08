require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeQueryHistoryListWidget.html"
    ,"dojox/mvc/equals"
],function(lang,declare, _Widget, _Templated, template,Equals){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeQueryHistoryListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeQueryHistoryItemList:null,
        currentDisplayHistoryItem:null,
        postCreate: function(){
            this.knowledgeQueryHistoryItemList=[];
        },
        addViewQueryHistory:function(historyData){
            if(this.knowledgeQueryHistoryItemList.length>0){
                var lastHistoryItem=this.knowledgeQueryHistoryItemList[this.knowledgeQueryHistoryItemList.length-1].historyItemInfo;
                var repeatedLastItem=Equals.equalsObject(lastHistoryItem,historyData);
                if(repeatedLastItem){
                    return;
                }
            }
            var currentHistoryItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeQueryHistoryItemWidget(
                {historyItemInfo:historyData,knowledgeQueryHistoryList:this});
            this.queryItemListContainer.appendChild(currentHistoryItem.domNode);
            this.knowledgeQueryHistoryItemList.push(currentHistoryItem);
            this.currentDisplayHistoryItem=currentHistoryItem;
            this.resetHistoryOrder();
        },
        removeHistoryItem:function(itemWidget){
            this.queryItemListContainer.removeChild(itemWidget.domNode);
            var itemIdxForDelete=dojo.indexOf(this.knowledgeQueryHistoryItemList, itemWidget);
            this.knowledgeQueryHistoryItemList.splice(itemIdxForDelete,1);
        },
        showHistoryItem:function(itemWidget){
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_RELOADKNOWLEDGECONTENT_EVENT,itemWidget.historyItemInfo);
            this.containerDialog.close();
            this.currentDisplayHistoryItem=itemWidget;
            this.resetHistoryOrder();
        },
        resetHistoryOrder:function(){
            var moveButtonsStatus={};
            if(this.knowledgeQueryHistoryItemList.length<=1){
                moveButtonsStatus["havePreview"]=false;
                moveButtonsStatus["haveNext"]=false;
            }else{
                var currentItemIdx=dojo.indexOf(this.knowledgeQueryHistoryItemList, this.currentDisplayHistoryItem);
                if(currentItemIdx==0){
                    moveButtonsStatus["havePreview"]=false;
                }else{
                    moveButtonsStatus["havePreview"]=true;
                }
                if(currentItemIdx<this.knowledgeQueryHistoryItemList.length-1){
                    moveButtonsStatus["haveNext"]=true;

                }else{
                    moveButtonsStatus["haveNext"]=false;
                }
            }
            this.displayPanel.updateMoveButtonStatus(moveButtonsStatus);
        },
        showPreviewKnowledgeContent:function(){
            var currentItemIdx=dojo.indexOf(this.knowledgeQueryHistoryItemList, this.currentDisplayHistoryItem);
            if(currentItemIdx-1>=0){
                this.currentDisplayHistoryItem=this.knowledgeQueryHistoryItemList[currentItemIdx-1];
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_RELOADKNOWLEDGECONTENT_EVENT,this.currentDisplayHistoryItem.historyItemInfo);
                this.resetHistoryOrder();
            }
        },
        showNextKnowledgeContent:function(){
            var currentItemIdx=dojo.indexOf(this.knowledgeQueryHistoryItemList, this.currentDisplayHistoryItem);
            if(currentItemIdx+1<=this.knowledgeQueryHistoryItemList.length-1){
                this.currentDisplayHistoryItem=this.knowledgeQueryHistoryItemList[currentItemIdx+1];
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_RELOADKNOWLEDGECONTENT_EVENT,this.currentDisplayHistoryItem.historyItemInfo);
                this.resetHistoryOrder();
            }
        },
        updateKnowledgeContentDisplayTitle:function(data){
            dojo.forEach(this.knowledgeQueryHistoryItemList,function(historyItem){
                historyItem.updateHistoryItemTitle(data);
            });
        },
        _endOfCode: function(){}
    });
});