require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/SaveSelectedCategoriesWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SaveSelectedCategoriesWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
        },
        doSaveSelectedCategory:function(){
            if(this.customSearchNameField.get("value")==""){
                UI.showToasterMessage({type:"warn",message:"请输入自定义搜索名称"});
                return;
            }
            if(this.customSearchDescField.get("value")==""){
                UI.showToasterMessage({type:"warn",message:"请输入自定义搜索描述"});
                return;
            }
            if(this.advancedSearchWidget.checkNewCategoriesSearchItemName(this.customSearchNameField.get("value"))){
                var searchItemMetaData={};
                searchItemMetaData.searchName=this.customSearchNameField.get("value");
                searchItemMetaData.searchDesc=this.customSearchDescField.get("value");
                searchItemMetaData.selectedCategories=this.selectedCategoryArray;
                this.advancedSearchWidget.saveNewCategoriesSearchItem(searchItemMetaData);
                this.doCloseContainerDialog();
            }else{
                UI.showToasterMessage({type:"warn",message:"已存在相同的自定义搜索名称"});
                return;
            }
        },
        doCloseContainerDialog:function(){},
        _endOfCode: function(){}
    });
});