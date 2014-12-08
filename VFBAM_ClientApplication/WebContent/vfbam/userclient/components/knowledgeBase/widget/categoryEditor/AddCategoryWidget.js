require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/AddCategoryWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.AddCategoryWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            if(this.showCloseButton){
                dojo.style(this.cancelButtonContainer,"display","");
            }
        },
        doAddCategory:function(){
            if(this.categoryName_cnField.get("value")==""){
                UI.showToasterMessage({type:"warn",message:"分类中文名称为必填项"});
                return;
            }
            var newCategoryDataObj={};
            newCategoryDataObj["categoryDisplayName_cn"]=this.categoryName_cnField.get("value");
            newCategoryDataObj["categoryDisplayName_en"]=this.category_enField.get("value");
            newCategoryDataObj["comment"]=this.categoryDescriptionField.get("value");
            newCategoryDataObj["categoryCode"]=this.categoryCodeField.get("value");
            newCategoryDataObj["parentCategoryNodeLocation"]=this.parentCategoryNodeLocation;
            var that=this;
            var messageTxt="请确认是否添加知识分类 <b>"+this.categoryName_cnField.get("value")+"</b>?";
            var confirmButtonAction=function(){
                that._doAddCategory(newCategoryDataObj);
            };
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-plus-sign-alt'></i> 添加",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        _doAddCategory:function(newCategoryDataObj){
            if(this.categoryEditor){
                this.categoryEditor.addFirstLevelCategory(newCategoryDataObj);
            }
            if(this.categoryTree){
                this.categoryTree.addCategory(newCategoryDataObj,this.parentNodeId);
            }
        },
        doCloseContainerDialog:function(){},
        _endOfCode: function(){}
    });
});