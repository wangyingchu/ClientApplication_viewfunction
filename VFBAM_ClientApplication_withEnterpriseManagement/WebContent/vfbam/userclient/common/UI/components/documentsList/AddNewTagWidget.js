require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/AddNewTagWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.AddNewTagWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
        },
        doAddNewTag:function(){
            var newTagValue=this.tagValueInput.get("value");
            if(newTagValue!=""){
                this.documentPreviewer.addDocumentTag(newTagValue);
                this.clearInput();
            }else{
                UI.showToasterMessage({
                    type:"error",
                    message:"请输入新标签值"
                });
            }
        },
        clearInput:function(){
            this.tagValueInput.set("value","");
        },
        _endOfCode: function(){}
    });
});