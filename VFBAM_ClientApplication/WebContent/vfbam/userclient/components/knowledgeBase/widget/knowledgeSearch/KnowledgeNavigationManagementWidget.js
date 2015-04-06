require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationManagementWidget.html",
    "idx/widget/MenuDialog","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,MenuDialog,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationManagementWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categoryDataStore:null,
        knowledgeNavigationItemsList:null,
        postCreate: function() {
            this.knowledgeNavigationItemsList=[];
            this._loadKnowledgeCategoryInheritDataStore();
            this._loadSavedGlobalSearchItems();
        },
        _loadKnowledgeCategoryInheritDataStore:function(){
            var that=this;
            var callBack=function(storeData){
                that.categoryDataStore=storeData;
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
         _loadSavedGlobalSearchItems:function(){
            dojo.empty(this.knowledgeNavigationItemsContainer);
            dojo.forEach(this.knowledgeNavigationItemsList,function(navigationItem){
                 navigationItem.destroy();
            });
            this.knowledgeNavigationItemsList.splice(0, this.knowledgeNavigationItemsList.length);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"getGlobalSavedCategoryTagsSelections/";
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that =this;
            var loadCallback=function(returnData){
                dojo.forEach(returnData,function(savedSearchItem){
                    var currentItemsBar=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationItemInfoWidget({knowledgeNavigationItemInfo:savedSearchItem,knowledgeNavigationManagementWidget: that});
                    that.knowledgeNavigationItemsContainer.appendChild(currentItemsBar.domNode);
                    that.knowledgeNavigationItemsList.push(currentItemsBar);
                });
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
         doEditNavigationItem:function(itemData){
             var that=this;
             var globalSavedCategorySearchItemEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.GlobalSavedCategorySearchItemEditorWidget({savedCategorySearchItemData:itemData});
             var actionButtons=[];
             var confirmSelectFromCheckboxButton=new dijit.form.Button({
                 label: "<i class='icon-save'></i> 保存",
                 onClick: function(){
                     globalSavedCategorySearchItemEditor.saveExistGlobalCategorySearchItem();
                 }
             });
             actionButtons.push(confirmSelectFromCheckboxButton);
             var	dialog = new Dialog({
                 style:"width:550px;height:550px;",
                 title: "<i class='icon-edit'></i> 编辑知识导航",
                 content: "",
                 //class:'nonModal',
                 closeButtonLabel: "<i class='icon-remove'></i> 取消",
                 buttons:actionButtons
             });
             dojo.place(globalSavedCategorySearchItemEditor.containerNode, dialog.containerNode);
             dialog.connect(globalSavedCategorySearchItemEditor, "doCloseContainerDialogAfterUpdate", "hide");
             var closeDialogCallBack=function(){
                that._loadSavedGlobalSearchItems();
                globalSavedCategorySearchItemEditor.destroy();
             };
             dojo.connect(dialog,"hide",closeDialogCallBack);
             dialog.show();
        },
        doDeleteNavigationItem:function(itemData){
            var messageTxt="请确认是否删除知识导航 <b>"+itemData.searchTitle+"</b> : "+itemData.searchDescription+" ?";
            var that=this;
            var confirmButtonAction=function(){
                UI.showProgressDialog("删除知识导航");
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var categorySelectionObj={};
                categorySelectionObj.userId=userId;
                categorySelectionObj.searchTitle=itemData.searchTitle;
                var categorySelectionObjContent=dojo.toJson(categorySelectionObj);

                var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"deleteGlobalSavedCategoryTagsSelection/";
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    if(data.operationResult){
                        UI.showToasterMessage({type:"success",message:"删除知识导航成功"});
                    }
                    var timer = new dojox.timing.Timer(300);
                    timer.onTick = function(){
                        that._loadSavedGlobalSearchItems();
                        UI.hideProgressDialog();
                        timer.stop();
                    };
                    timer.start();
                };
                Application.WebServiceUtil.postJSONData(resturl,categorySelectionObjContent,loadCallback,errorCallback);
             };
            var cancelButtonAction=function(){};
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-trash'></i> 确认删除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        _endOfCode: function(){}
    });
});