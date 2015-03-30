require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemRelatedMainCategoriesWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemRelatedMainCategoriesWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        knowledgeCategoryInheritDataStore:null,
        relatedMainCategoryArray:null,
        postCreate: function() {
            this.relatedMainCategoryArray=[];
            var contentTags=this.knowledgeContentInfo.contentTags;
            var projectTags=this.knowledgeContentInfo.projectTags;
            var that=this;
            var callBack=function(storeData){
                that.knowledgeCategoryInheritDataStore=storeData;
                that.addCategories(contentTags);
                that.addCategories(projectTags);
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
        addCategories:function(categories){
            if(categories==""){
                dojo.style(this.mainCategoriesContainer,"display","none");
                return;
            }
            var that=this;
            dojo.forEach(categories,function(categoryId){
                var categoryData=that.knowledgeCategoryInheritDataStore.get(categoryId);
                var isMainCategory=false;
                var categoryPropertyArray=categoryData.categoryPropertys;
                dojo.forEach(categoryPropertyArray,function(currentProperty){
                    if(currentProperty.propertyName=="mainCategoryType"){
                        if(currentProperty.propertyValue="true"){
                            isMainCategory=true;
                        }
                    }
                });
                if(isMainCategory){
                    var displayNameInheritArray=[];
                    KnowledgeBaseDataHandleUtil.getCategoryDisplayNameInheritById(categoryId,displayNameInheritArray,that.knowledgeCategoryInheritDataStore);
                    var newSelectedCategoryTag=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemMainCategoryTagWidget({categoryData:categoryData,
                        categoryTagNameArray:displayNameInheritArray.reverse(),readonly:true});
                    that.itemCategoriesContainer.appendChild(newSelectedCategoryTag.domNode);
                    that.relatedMainCategoryArray.push(newSelectedCategoryTag);
                }
            });
            if(this.relatedMainCategoryArray.length==0){
                dojo.style(this.mainCategoriesContainer,"display","none");
            }
        },
        destroy:function(){
            dojo.forEach(this.relatedMainCategoryArray,function(mainCategory){
                mainCategory.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});