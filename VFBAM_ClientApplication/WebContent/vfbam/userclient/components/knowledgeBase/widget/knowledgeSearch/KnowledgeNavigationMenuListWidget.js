require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationMenuListWidget.html",
    "idx/widget/MenuDialog","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,MenuDialog,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categoryDataStore:null,
        knowledgeNavigationMenuBarList:null,
        postCreate: function() {
            this.knowledgeNavigationMenuBarList=[];
            this._loadKnowledgeCategoryInheritDataStore();
        },
        renderGlobalSearchItems:function(){
            dojo.empty(this.knowledgeNavigationItemBarsContainer);
            dojo.forEach(this.knowledgeNavigationMenuBarList,function(navigationItem){
                navigationItem.destroy();
            });
            this.knowledgeNavigationMenuBarList.splice(0, this.knowledgeNavigationMenuBarList.length);
            this._loadSavedGlobalSearchItems();
        },
        _loadKnowledgeCategoryInheritDataStore:function(){
            var that=this;
            var callBack=function(storeData){
                that.categoryDataStore=storeData;
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
        closeGlobalCategoriesSearchDialog:function(){
            //GLOBALKNOWLEDGE_NAVIGATION_PANEL_POPUP_DIALOG is defined in KnowledgeBase.js
            dijit.popup.close(GLOBALKNOWLEDGE_NAVIGATION_PANEL_POPUP_DIALOG);
        },
        configGlobalCategoriesSearchItems:function(){
            var knowledgeNavigationManagementWidget =new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationManagementWidget({})
            var	dialog = new Dialog({
                style:"width:550px;height:550px;",
                title: "<i class='icon-wrench'></i> 知识导航管理 ",
                content: "",
                //class:'nonModal',
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(knowledgeNavigationManagementWidget.containerNode, dialog.containerNode);
            var closeDialogCallBack=function(){
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_OPEN_GLOBALKNOWLEDGE_NAVIGATION_PANEL_EVENT,{});
                knowledgeNavigationManagementWidget.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dialog.show();
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_CLOSE_GLOBALKNOWLEDGE_NAVIGATION_PANEL_EVENT,{});
        },
        addNewGlobalCategoriesSearchItem:function(){
            var globalSavedCategorySearchItemEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.GlobalSavedCategorySearchItemEditorWidget({});
            var actionButtone=[];
            var confirmSelectFromCheckboxButton=new dijit.form.Button({
                label: "<i class='icon-save'></i> 保存",
                onClick: function(){
                    globalSavedCategorySearchItemEditor.saveNewGlobalCategorySearchItem();
                }
            });
            actionButtone.push(confirmSelectFromCheckboxButton);
            var	dialog = new Dialog({
                style:"width:550px;height:550px;",
                title: "<i class='icon-plus-sign-alt'></i> 添加知识导航",
                content: "",
                //class:'nonModal',
                closeButtonLabel: "<i class='icon-remove'></i> 取消",
                buttons:actionButtone
            });
            dojo.place(globalSavedCategorySearchItemEditor.containerNode, dialog.containerNode);
            dialog.connect(globalSavedCategorySearchItemEditor, "doCloseContainerDialog", "hide");
            var closeDialogCallBack=function(){
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_OPEN_GLOBALKNOWLEDGE_NAVIGATION_PANEL_EVENT,{});
                globalSavedCategorySearchItemEditor.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dialog.show();
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_CLOSE_GLOBALKNOWLEDGE_NAVIGATION_PANEL_EVENT,{});
        },
        _loadSavedGlobalSearchItems:function(){
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"getGlobalSavedCategoryTagsSelections/"+KNOWLEDGEBASE_ORGANIZATION_ID+"/";
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that =this;
            var loadCallback=function(returnData){
                dojo.forEach(returnData,function(savedSearchItem){
                    var currentItemsBar=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuBarWidget({knowledgeNavigationMenuItemInfo:savedSearchItem,categoryDataStore: that.categoryDataStore});
                    that.knowledgeNavigationItemBarsContainer.appendChild(currentItemsBar.domNode);
                    that.knowledgeNavigationMenuBarList.push(currentItemsBar);
                });
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        _endOfCode: function(){}
    });
});