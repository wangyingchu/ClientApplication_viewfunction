require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeCollectionDisplayWidget.html",
    "dojo/dom-class","dojo/window","dojo/dom-geometry", "dojo/dom", "dojo/dom-style"
],function(lang,declare, _Widget, _Templated, template,domClass,win,domGeom, dom, style){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeCollectionDisplayWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeContentItemList:null,
        postCreate: function(){
            this.knowledgeContentItemList=[];
            this.collectionMetaInfo={};
            this.collectionMetaInfo.collectionId=this.collectionItemInfo.projectId;
            this.collectionMetaInfo.collectionName=this.collectionItemInfo.projectName;
            this.collectionMetaInfo.publishDate=this.collectionItemInfo.projectCreatedTime;
            this.collectionMetaInfo.materialNumber=this.collectionItemInfo.docTotalCountPerProject;
            this.collectionMetaInfo.publisher="系统";
            this.collectionName.innerHTML=this.collectionMetaInfo.collectionName;
            this.materialNumber.innerHTML=this.collectionMetaInfo.materialNumber;
            this.publisherName.innerHTML=this.collectionMetaInfo.publisher;
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            var uploadDate=new Date(this.collectionMetaInfo.publishDate);
            var dateString=dojo.date.locale.format(uploadDate,dateDisplayFormat);
            var timeString=dojo.date.locale.format(uploadDate,timeDisplayFormat);
            this.publishDate.innerHTML=dateString+" "+timeString;

            var collectionItemList=this.collectionItemInfo.docs;
            var mainDisplayItem=collectionItemList[0];
            var mainItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.CollectionMainDisplayItemWidget({knowledgeContentInfo:mainDisplayItem},this.mainDisplayItemContainer);
            this.knowledgeContentItemList.push(mainItem);
            var avaliableSecondaryItemDisplayWidth=this.resultDisplayZoneWidth-400;
            var avaliableSecondaryItemDisplayNumber=parseInt(avaliableSecondaryItemDisplayWidth/150);
            var secondaryContentItem=[];
            dojo.forEach(collectionItemList,function(currentContent,idx){
                if(idx>0){
                    secondaryContentItem.push(currentContent);
                }
            });
            this._renderKnowledgeContents(secondaryContentItem,avaliableSecondaryItemDisplayNumber);
            return;
        },
        _renderKnowledgeContents:function(knowledgeContents,avaliableSecondaryItemDisplayNumber){
            for(i=0;i<knowledgeContents.length;i++){
                if(i<avaliableSecondaryItemDisplayNumber){
                    var newSecondaryItemWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.CollectionSecondaryDisplayItemWidget({knowledgeContentInfo:knowledgeContents[i]});
                    this.secondaryItemFirstLineContainer.appendChild(newSecondaryItemWidget.domNode);
                    this.knowledgeContentItemList.push(newSecondaryItemWidget);
                }else if(i<avaliableSecondaryItemDisplayNumber*2){
                    var newSecondaryItemWidget1=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.CollectionSecondaryDisplayItemWidget({knowledgeContentInfo:knowledgeContents[i]});
                    this.secondaryItemSecondLineContainer.appendChild(newSecondaryItemWidget1.domNode);
                    this.knowledgeContentItemList.push(newSecondaryItemWidget);
                }else{
                    return;
                }
            }
        },
        doOpenCollectionDetailView:function(){
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
                KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_SINGLE,
                KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_COLLECTION,
                KNOWLEDGE_VIEW_DATA:{
                    DISPLAY_TITLE:this.collectionMetaInfo.collectionName,
                    VIEW_METADATA:this.collectionItemInfo
                }
            });
        },
        collectKnowledgeCollection:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var collectionDocumentObj={};
            var collectionDocumentObjContent=dojo.toJson(collectionDocumentObj);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"collectCollection/"+userId+"/"+this.collectionItemInfo.projectId;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                if(data["Status"]=="OK"){
                    UI.showToasterMessage({type:"success",message:"收藏专辑 <b>"+that.collectionItemInfo.projectName+"</b> 成功"});
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,collectionDocumentObjContent,loadCallback,errorCallback);
        },
        destroy:function(){
            dojo.forEach(this.knowledgeContentItemList,function(knowledgeItem){
                knowledgeItem.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});