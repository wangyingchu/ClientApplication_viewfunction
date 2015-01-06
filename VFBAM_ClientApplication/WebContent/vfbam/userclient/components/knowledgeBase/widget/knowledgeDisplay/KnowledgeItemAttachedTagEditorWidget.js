require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemAttachedTagEditorWidget.html",
    "idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        attachedCategoryTagList:null,
        postCreate: function(){
            this.attachedCategoryTagList=[];
        },
        renderTagItems:function(){
            dojo.empty(this.attachedTagDisplayContainer);
            dojo.forEach(this.attachedCategoryTagList,function(tagWidget){
                tagWidget.destroy();
            });
            this.attachedCategoryTagList.splice(0,this.attachedCategoryTagList.length);
            dojo.forEach(this.attachedTags,function(tagId){
                var currentCategory=this.knowledgeCategoryInheritDataStore.get(tagId);
                var displayNameInheritArray=[];
                KnowledgeBaseDataHandleUtil.getCategoryDisplayNameInherit(currentCategory,displayNameInheritArray,this.knowledgeCategoryInheritDataStore);
                var attachedCategoryTag=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SelectedCategoryTagWidget({categoryData:currentCategory,categoryTagNameArray:displayNameInheritArray.reverse(),readonly:true});
                this.attachedTagDisplayContainer.appendChild(attachedCategoryTag.domNode);
                this.attachedCategoryTagList.push(attachedCategoryTag);
            },this);
        },
        renderItemTagSelectorDialog:function(){
            var tagSelector=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagSelectorWidget({attachedTags:this.attachedTags});
            var actionButtone=[];
            var that=this;
            var deleteMessageButton=new dijit.form.Button({
                label: "<i class='icon-edit'></i> 更新",
                onClick: function(){
                    that._updateNewSelectedTags(tagSelector.getSelectedSearchCategory());
                }
            });
            actionButtone.push(deleteMessageButton);
            var	dialog = new Dialog({
                style:"width:550px;height:460px;",
                title: "<span style='font-size: 0.7em;'><i class='icon-edit'></i> 编辑知识分类标签</span>",
                buttons:actionButtone,
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            if(this.dialogCloseCallBack){
                var closeDialogCallBack=function(){
                    that.dialogCloseCallBack(that.attachedTags);
                };
                dojo.connect(dialog,"hide",closeDialogCallBack);
            }
            dojo.place(tagSelector.containerNode, dialog.containerNode);
            dialog.show();
        },
        _updateNewSelectedTags:function(selectedTags){
            var that=this;
            var messageTxt="请确认是否更新知识分类标签 ?";
            var confirmButtonAction=function(){
                UI.showProgressDialog("更新知识分类标签");
                if(that.isCollectionTags){
                    var projectInfoObj={};
                    projectInfoObj.projectId=that.knowledgeContentInfo.projectId;
                    projectInfoObj.projectName=that.knowledgeContentInfo.projectName;
                    projectInfoObj.projectCreatedBy=that.knowledgeContentInfo.projectCreatedBy;
                    projectInfoObj.projectCreatedTime=that.knowledgeContentInfo.projectCreatedTime;
                    projectInfoObj.projectLastModifiedBy=that.knowledgeContentInfo.projectLastModifiedBy;
                    projectInfoObj.projectLastModifiedTime=that.knowledgeContentInfo.projectLastModifiedTime;
                    projectInfoObj.projectComment=that.knowledgeContentInfo.projectComment;
                    projectInfoObj.projectTags=selectedTags;
                    var setNewTagObjectContent=dojo.toJson(projectInfoObj);
                    var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"updateProject/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        var timer = new dojox.timing.Timer(300);
                        timer.onTick = function(){
                            UI.hideProgressDialog();
                            that.attachedTags=selectedTags;
                            that.knowledgeContentInfo.projectTags=selectedTags;
                            UI.showToasterMessage({type:"success",message:"更新知识分类标签成功"});
                            timer.stop();
                        };
                        timer.start();
                        if(that.callback){
                            that.callback(selectedTags);
                        }
                    };
                    Application.WebServiceUtil.postJSONData(resturl,setNewTagObjectContent,loadCallback,errorCallback);
                }else{
                    var setNewTagObj={};
                    setNewTagObj.operationType="SetTags";
                    setNewTagObj.contentLocation=that.knowledgeContentInfo.contentLocation;
                    setNewTagObj.tags=selectedTags;
                    var setNewTagObjectContent=dojo.toJson(setNewTagObj);
                    var resturl=KNOWLEDGE_OPERATION_SERVICE_ROOT+"updateKnowledgeContentTags/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        var timer = new dojox.timing.Timer(300);
                        timer.onTick = function(){
                            UI.hideProgressDialog();
                            that.attachedTags=data.contentTags;
                            UI.showToasterMessage({type:"success",message:"更新知识分类标签成功"});
                            timer.stop();
                            //sync description update to backend knowledge search engine.
                            KnowledgeBaseDataHandleUtil.syncKnowledgeItemInfoWithSearchEngine(data);
                        };
                        timer.start();
                    };
                    Application.WebServiceUtil.postJSONData(resturl,setNewTagObjectContent,loadCallback,errorCallback);
                }
            };
            var cancelButtonAction=function(){};
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-edit'></i> 确认更新",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        destroy:function(){
            dojo.forEach(this.attachedCategoryTagList,function(tagWidget){
                tagWidget.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});