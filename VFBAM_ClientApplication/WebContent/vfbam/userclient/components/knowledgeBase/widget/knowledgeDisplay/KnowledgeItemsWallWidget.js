require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemsWallWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeItemWallDisplayWidgetArray:null,
        postCreate: function() {
            KNOWLEDGESEARCH_CURRENT_MULTIITEMS_SEARCH_RESULT=this.knowledgeMetaInfo;
            this.knowledgeItemWallDisplayWidgetArray=[];
            var that=this;
            dojo.forEach(this.knowledgeMetaInfo,function(currentKnowledgeItem){
                var newSecondaryItemWidget = null;
                if(that.highLightKnowledgeContent){
                    var highLightContentName=that.highLightKnowledgeContent.contentName;
                    var highLightSequenceNumber=that.highLightKnowledgeContent.sequenceNumber;
                    if(highLightContentName==currentKnowledgeItem.contentName&&highLightSequenceNumber==currentKnowledgeItem.sequenceNumber){
                        newSecondaryItemWidget = new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemWallDisplayWidget({knowledgeContentInfo: currentKnowledgeItem,isHighLightItem:true});
                    }else{
                        newSecondaryItemWidget = new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemWallDisplayWidget({knowledgeContentInfo: currentKnowledgeItem});
                    }
                }else{
                    newSecondaryItemWidget = new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemWallDisplayWidget({knowledgeContentInfo: currentKnowledgeItem});
                }
                this.knowledgeItemContainer.appendChild(newSecondaryItemWidget.domNode);
                this.knowledgeItemWallDisplayWidgetArray.push(newSecondaryItemWidget);
            },this);
        },
        destroy:function(){
            dojo.forEach(this.knowledgeItemWallDisplayWidgetArray,function(knowledgeItemWallDisplayWidget){
                knowledgeItemWallDisplayWidget.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});