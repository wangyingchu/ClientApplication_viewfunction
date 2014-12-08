require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemsWallWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemsWallWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeItemWallDisplayWidgetArray:null,
        postCreate: function() {
            this.knowledgeItemWallDisplayWidgetArray=[];   
            dojo.forEach(this.knowledgeMetaInfo,function(currentKnowledgeItem){
                var newSecondaryItemWidget = new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemWallDisplayWidget({knowledgeContentInfo: currentKnowledgeItem});
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