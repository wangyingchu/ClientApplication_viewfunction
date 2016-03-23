require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/KnowledgeItemsRecommendsWallWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.KnowledgeItemsRecommendsWallWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeItemWallDisplayWidgetArray:null,
        postCreate: function() {
            this.knowledgeItemWallDisplayWidgetArray=[];
            var that=this;
            dojo.forEach(this.knowledgeMetaInfo,function(currentKnowledgeItem){
                var newSecondaryItemWidget = new vfbam.userclient.common.UI.components.documentsList.KnowledgeItemRecommendsWallDisplayWidget({knowledgeContentInfo: currentKnowledgeItem});
                this.knowledgeItemContainer.appendChild(newSecondaryItemWidget.domNode);
                if(this.wallHeight){
                    this.knowledgeItemContainer.style.height=this.wallHeight;
                    this.knowledgeItemContainer.style.overflow="auto";
                }
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