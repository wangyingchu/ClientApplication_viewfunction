require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/PropertyItemForDeleteWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.PropertyItemForDeleteWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.propertyName.innerHTML=this.propertyInfo.propertyName;
        },
        isSelected:function(){
            return this.propertyNameCheckbox.get("checked");
        },
        getName:function(){
            return this.propertyInfo.propertyName;
        },
        _endOfCode: function(){}
    });
});