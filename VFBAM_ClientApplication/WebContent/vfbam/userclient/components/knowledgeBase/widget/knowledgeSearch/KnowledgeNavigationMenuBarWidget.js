require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationMenuBarWidget.html",
    "idx/widget/MenuDialog"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuBarWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        menuItemList:null,
        postCreate: function() {
            this.menuItemList=[];
            this.navigationSearchTitle.innerHTML =this.knowledgeNavigationMenuItemInfo.searchDescription;
            var itemsTags=this.knowledgeNavigationMenuItemInfo.selectedTags;
            var that=this;
            var tagsNumber=itemsTags.length-1;
            dojo.forEach(itemsTags,function(currentTag,idx){
                var categoryData=that._getCategoryDataById(currentTag);
                var isLastMenuItem=false;
                if(idx == tagsNumber){
                    isLastMenuItem=true;
                }else{
                    isLastMenuItem=false;
                }
                var currentItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData,isLastMenuItem:isLastMenuItem});
                that.navigationItemsContainer.appendChild(currentItem.domNode)
                that.menuItemList.push(currentItem);
            });
        },
        _getCategoryDataById:function(categoryId){
            var categoryData=this.categoryDataStore.get(categoryId);
            return categoryData;
        },
        destroy:function(){
            dojo.empty(this.navigationItemsContainer);
            dojo.forEach(this.menuItemList,function(navigationItem){
                navigationItem.destroy();
            });
            this.menuItemList.splice(0, this.menuItemList.length);
        },
        _endOfCode: function(){}
    });
});