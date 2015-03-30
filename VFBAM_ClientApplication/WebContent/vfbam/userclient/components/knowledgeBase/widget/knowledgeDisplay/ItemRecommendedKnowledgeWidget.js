require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/ItemRecommendedKnowledgeWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.ItemRecommendedKnowledgeWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        recommendedKnowledgeIconList:null,
        similarDocumentsList:null,
        currentSimilarDocumentPageStep:null,
        postCreate: function(){
            this.recommendedKnowledgeIconList=[];
            this.currentSimilarDocumentPageStep=0;
            //UI.showProgressDialog("查询数据");
            var that=this;
            var contentTagsArray=that.knowledgeContentInfo.contentTags;
            var contentTagsQueryStr="";
            dojo.forEach(contentTagsArray,function(currentTag,idx){
                contentTagsQueryStr=contentTagsQueryStr+currentTag;
                if(idx<contentTagsArray.length-1){
                    contentTagsQueryStr=contentTagsQueryStr+",";
                }
            });
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                var resturl="";
                if(contentTagsArray.length>0){
                    resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getSimilarDocuments/"+that.knowledgeContentInfo.sequenceNumber+"/"+contentTagsQueryStr+"/";
                }else{
                    resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"getSimilarDocuments/"+that.knowledgeContentInfo.sequenceNumber+"/NA/";
                }
                var syncFlag=true;
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(returnData){
                    that._renderKnowledgeContents(returnData);
                    //UI.hideProgressDialog();
                };
                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                timer.stop();
            };
            timer.start();
        },
        _renderKnowledgeContents:function(data){
            this.similarDocumentsList=data.docs;
            if(this.similarDocumentsList.length>0){
                this._renderSimilarDocuments();
            }else{
                dojo.style(this.recommendedKnowledgeIconContainer,"display","none");
                dojo.style(this.noResultContainer,"display","");
                this.previousPageButton.set("disabled","disabled");
                this.nextPageButton.set("disabled","disabled");
            }
        },
        _renderSimilarDocuments:function(){
            var startIdx=9*this.currentSimilarDocumentPageStep;
            var endIdx=(9*(1+this.currentSimilarDocumentPageStep))-1;
            var currentPageDocumentList = dojo.filter(this.similarDocumentsList,
                function(item, index){
                    return index>=startIdx && index <= endIdx;
            });
            dojo.empty(this.recommendedKnowledgeIconContainer);
            dojo.forEach(this.recommendedKnowledgeIconList,function(recommendedKnowledgeIcon){
                recommendedKnowledgeIcon.destroy();
            });
            dojo.forEach(currentPageDocumentList,function(itemData,idx){
                if(this.knowledgeContentInfo.sequenceNumber!==itemData.sequenceNumber){
                    var currentRecommendedKnoledgeIcon=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.RecommendedKnowledgeIconWidget({knowledgeContentInfo:itemData});
                    this.recommendedKnowledgeIconContainer.appendChild(currentRecommendedKnoledgeIcon.domNode);
                    this.recommendedKnowledgeIconList.push(currentRecommendedKnoledgeIcon);
                }
            },this);

            if(this.currentSimilarDocumentPageStep==0){
                this.previousPageButton.set("disabled","disabled");
            }else{
                this.previousPageButton.set("disabled",false);
            }
            if(endIdx>=(this.similarDocumentsList.length-1)){
                this.nextPageButton.set("disabled","disabled");
            }else{
                this.nextPageButton.set("disabled",false);
            }
        },
        showPreviousItems:function(){
            this.currentSimilarDocumentPageStep--;
            this._renderSimilarDocuments();
        },
        showNextItems:function(){
            this.currentSimilarDocumentPageStep++;
            this._renderSimilarDocuments();
        },
        destroy:function(){
            dojo.forEach(this.recommendedKnowledgeIconList,function(recommendedKnowledgeIcon){
                recommendedKnowledgeIcon.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});