require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/RemoveCategoryPropertyWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.RemoveCategoryPropertyWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        propertyForDeleteWidgetArray:null,
        postCreate: function(){
            this.propertyForDeleteWidgetArray=[];
        },
        renderPropertyList:function(categoryPropertys){
            this.propertyForDeleteWidgetArray.splice(0, this.propertyForDeleteWidgetArray.length);
            dojo.empty(this.propertyListContainer);
            var that=this;
            dojo.forEach(categoryPropertys,function(currentProperty){
                var currentPropertyForDelete=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.PropertyItemForDeleteWidget({propertyInfo:currentProperty});
                that.propertyListContainer.appendChild(currentPropertyForDelete.domNode);
                that.propertyForDeleteWidgetArray.push(currentPropertyForDelete);
            });
            if(this.propertyForDeleteWidgetArray.length>0){
                this.deletePropertiesButton.set("disabled",false);
            }else{
                this.deletePropertiesButton.set("disabled","disabled");
            }
        },
        doDeleteProperties:function(){
            var propertyNeedDeleteArray=[];
            dojo.forEach(this.propertyForDeleteWidgetArray,function(propertyForDeleteWidget){
                if(propertyForDeleteWidget.isSelected()){
                    propertyNeedDeleteArray.push(propertyForDeleteWidget.getName());
                }
            });
            this.categoryInfoWidget.deleteProperties(propertyNeedDeleteArray);
        },
        _endOfCode: function(){}
    });
});