require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/SavedCategorySearchItemWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SavedCategorySearchItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        selectedCategories:null,
        searchItemEventConnectionHandler:null,
        showInfoEventConnectionHandler:null,
        deleteSearchEventConnectionHandler:null,
        postCreate: function(){
            this.searchName.innerHTML=this.searchItemMetaData.searchName;
            this.searchDesc.innerHTML=this.searchItemMetaData.searchDesc;
            this.selectedCategories=this.searchItemMetaData.selectedCategories;
            this.searchItemEventConnectionHandler=dojo.connect(this.searchButton,"onclick",dojo.hitch(this,this.executeSearch));
            this.showInfoEventConnectionHandler=dojo.connect(this.infoButton,"onclick",dojo.hitch(this,this.showInfo));
            this.deleteSearchEventConnectionHandler=dojo.connect(this.deleteButton,"onclick",dojo.hitch(this,this.deleteSearch));
        },
        executeSearch:function(){
            this.advancedSearchWidget.executeSavedCategoriesSearch(this.searchItemMetaData.searchName,this.searchItemMetaData.selectedCategories);
        },
        showInfo:function(){
            this.advancedSearchWidget.showSavedCategorySearchInfo(this.searchItemMetaData);
        },
        deleteSearch:function(){
            var that=this;
            var messageTxt="请确认是否删除自定义搜索条件:<b>"+this.searchItemMetaData.searchName+"</b> ?";
            var confirmButtonAction=function(){
                that.advancedSearchWidget.deleteCategoriesSearchItem(that.searchItemMetaData.searchName);
            };
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-trash'></i> 确认删除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        destroy:function(){
            dojo.disconnect(this.searchItemEventConnectionHandler);
            dojo.disconnect(this.showInfoEventConnectionHandler);
            dojo.disconnect(this.deleteSearchEventConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});