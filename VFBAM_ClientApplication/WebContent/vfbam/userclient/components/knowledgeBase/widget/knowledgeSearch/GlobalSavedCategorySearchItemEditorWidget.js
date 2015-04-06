require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/GlobalSavedCategorySearchItemEditorWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.GlobalSavedCategorySearchItemEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        globalNavigationItemEditorWidget:null,
        postCreate: function(){
            if(this.savedCategorySearchItemData!=null){
                //in edit mode
                this.globalSearchNameField.set("value",this.savedCategorySearchItemData.searchTitle);
                this.globalSearchNameField.set("disabled","disabled");
                this.globalSearchDescField.set("value",this.savedCategorySearchItemData.searchDescription);
                this.globalNavigationItemEditorWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagSelectorWidget({attachedTags:this.savedCategorySearchItemData.selectedTags
                },this.categorySelectorContainer);
            }else{
                this.globalNavigationItemEditorWidget=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagSelectorWidget({},this.categorySelectorContainer);
            }
        },
        saveNewGlobalCategorySearchItem:function(){
            if(this.globalSearchNameField.get("value")==""){
                UI.showToasterMessage({type:"warn",message:"请输入知识导航名称"});
                return;
            }
            if(this.globalSearchDescField.get("value")==""){
                UI.showToasterMessage({type:"warn",message:"请输入知识导航描述"});
                return;
            }
            var selectedTagArray= this.globalNavigationItemEditorWidget.getSelectedSearchCategory();
            if(selectedTagArray.length==0){
                UI.showToasterMessage({type:"warn",message:"请选择至少一个标签分类"});
                return;
            }
            var that=this;
            var messageTxt="请确认是否添加知识导航 ?";
            var confirmButtonAction=function(){
                UI.showProgressDialog("添加知识导航");
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var userCategorySelectionObj={};
                userCategorySelectionObj.userId=userId;
                userCategorySelectionObj.searchTitle=that.globalSearchNameField.get("value");
                userCategorySelectionObj.searchDescription=that.globalSearchDescField.get("value");
                userCategorySelectionObj.selectedTags=selectedTagArray;
                var userCategorySelectionObjContent=dojo.toJson(userCategorySelectionObj);
                var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"saveGlobalSavedCategoryTagsSelection/";
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    if(data.operationResult){
                        UI.showToasterMessage({type:"success",message:"添加知识导航成功"});
                    }
                    var timer = new dojox.timing.Timer(300);
                    timer.onTick = function(){
                        that.doCloseContainerDialog();
                        UI.hideProgressDialog();
                        timer.stop();
                    };
                    timer.start();
                };
                Application.WebServiceUtil.postJSONData(resturl,userCategorySelectionObjContent,loadCallback,errorCallback);
            };
            var cancelButtonAction=function(){};
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-save'></i> 确认添加",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        saveExistGlobalCategorySearchItem:function(){
            if(this.globalSearchNameField.get("value")==""){
                UI.showToasterMessage({type:"warn",message:"请输入知识导航名称"});
                return;
            }
            if(this.globalSearchDescField.get("value")==""){
                UI.showToasterMessage({type:"warn",message:"请输入知识导航描述"});
                return;
            }
            var selectedTagArray= this.globalNavigationItemEditorWidget.getSelectedSearchCategory();
            if(selectedTagArray.length==0){
                UI.showToasterMessage({type:"warn",message:"请选择至少一个标签分类"});
                return;
            }
            var that=this;
            var messageTxt="请确认是否更新知识导航 ?";
            var confirmButtonAction=function(){
                UI.showProgressDialog("更新知识导航");
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var userCategorySelectionObj={};
                userCategorySelectionObj.userId=userId;
                userCategorySelectionObj.searchTitle=that.globalSearchNameField.get("value");
                userCategorySelectionObj.searchDescription=that.globalSearchDescField.get("value");
                userCategorySelectionObj.selectedTags=selectedTagArray;
                var userCategorySelectionObjContent=dojo.toJson(userCategorySelectionObj);
                var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"updateGlobalSavedCategoryTagsSelection/";
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    if(data.operationResult){
                        UI.showToasterMessage({type:"success",message:"更新知识导航成功"});
                    }
                    var timer = new dojox.timing.Timer(300);
                    timer.onTick = function(){
                        that.doCloseContainerDialogAfterUpdate();
                        UI.hideProgressDialog();
                        timer.stop();
                    };
                    timer.start();
                };
                Application.WebServiceUtil.postJSONData(resturl,userCategorySelectionObjContent,loadCallback,errorCallback);
            };
            var cancelButtonAction=function(){};
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-save'></i> 确认更新",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        doCloseContainerDialog:function(){
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_OPEN_GLOBALKNOWLEDGE_NAVIGATION_PANEL_EVENT,{});
        },
        doCloseContainerDialogAfterUpdate:function(){},
        _endOfCode: function(){}
    });
});