require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/UpdateKnowledgeDescriptionWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.UpdateKnowledgeDescriptionWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.knowledgeDescInput.set("value" ,this.knowledgeContentInfo.contentDescription);
        },
        doUpdateKnowledgeDescription:function(){
            var newKnowledgeDesc=this.knowledgeDescInput.get("value");
            if(newKnowledgeDesc!=""){
                this.knowledgeItemMetaInfoWidget.updateKnowledgeDescription(newKnowledgeDesc);
            }else{
                UI.showToasterMessage({
                    type:"error",
                    message:"请输入素材描述信息"
                });
            }
        },
        clearInput:function(){
            this.knowledgeDescInput.set("value","");
        },
        _endOfCode: function(){}
    });
});