require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/CategoryEditorWidget.html","dojo/store/Memory"
],function(lang,declare, _Widget, _Templated, template,Memory){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categoryTree:null,
        singleCategoryInfo:null,
        postCreate: function(){
            this.categoryTree=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryTreeWidget({},this.categoryTreeContainer);
            this.singleCategoryInfo=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryInfoWidget({},this.categoryInfoContainer);

            this.addNewFirstLevelCategoryMenuDialog=new idx.widget.MenuDialog();
            this.addNewFirstLevelDropDown=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.AddCategoryWidget({categoryEditor:this,parentCategoryNodeLocation:null});
            dojo.place(this.addNewFirstLevelDropDown.domNode, this.addNewFirstLevelCategoryMenuDialog.containerNode);
            this.addFirstLevelCategoryLink.set("dropDown",this.addNewFirstLevelCategoryMenuDialog);
        },
        updateBasicProperties:function(){
            this.singleCategoryInfo.updateBasicProperties();
        },
        addFirstLevelCategory:function(newCategoryInfo){
            var that=this;
            var newFirstLevelCategoryDataObjContent=dojo.toJson(newCategoryInfo);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"addCategory/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                UI.showToasterMessage({type:"success",message:"添加一级分类成功"});
                that.addNewFirstLevelCategoryMenuDialog.close();
                that.categoryTree.addCategoryInfo(data);
                KnowledgeBaseDataHandleUtil.addNeCategoryTagInSearchEngine(data);
            };
            Application.WebServiceUtil.postJSONData(resturl,newFirstLevelCategoryDataObjContent,loadCallback,errorCallback);
        },
        destroy:function(){
            this.categoryTree.destroy();
            this.singleCategoryInfo.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});