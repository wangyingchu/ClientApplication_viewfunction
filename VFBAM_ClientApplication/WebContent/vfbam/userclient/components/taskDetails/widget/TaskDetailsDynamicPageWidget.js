require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/taskDetails/widget/template/TaskDetailsDynamicPageWidget.html","dojo/window"
],function(lang,declare, _Widget, _Templated, template,win){
    declare("vfbam.userclient.components.taskDetails.widget.TaskDetailsDynamicPageWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        dynamicPageId:null,//unique parameter of DynamicPage Widget,used to get data and close dynamic page
        dynamicPagePayload:null,
        dynamicPageData:null,
        sourcePageInfo:null,
        App_TaskDetail_UI_Header_Height:260,
        App_TaskDetail_UI_Dynamic_Real_Height:0,

        taskSupportDataWidget_document:null,
        taskSupportDataWidget_participant:null,
        taskSupportDataWidget_comment:null,
        taskSupportDataWidget_history:null,
        taskDataEditor:null,
        taskToolbar:null,
        closePageConnectionHandler:null,
        postCreate: function(){
            var vs =win.getBox();
            this.App_TaskDetail_UI_Header_Height=  vs.h-this.App_TaskDetail_UI_Header_Height;
            var currentHeightStyle=""+ this.App_TaskDetail_UI_Header_Height+"px";
            dojo.style(this.taskPropertiesContainer,"height",currentHeightStyle);

            this.dynamicPageId=this.getParent().workspaceID;
            this.dynamicPagePayload= UI.getDynamicPageData(this.getParent().workspaceID);
            if(this.dynamicPagePayload){
                this.dynamicPageData=this.dynamicPagePayload["APP_PAGE_DYNAMIC_DATA"];
                this. sourcePageInfo= this.dynamicPagePayload["APP_PAGE_SOURCEPAGE"];
            }

            this.taskToolbar=GLOBAL_TASK_OPERATION_HANDLER.getTaskToolbar(this.dynamicPageData.taskItemData);
            dojo.place(this.taskToolbar.domNode,this.taskToolbarContainer);
            this.closePageConnectionHandler=dojo.connect(this.taskToolbar, "_CLOSE_DYNAMIC_PAGE", this, "closePage");

            this.taskDataEditor=GLOBAL_TASK_OPERATION_HANDLER.getTaskDataEditor(this.dynamicPageData.taskItemData);
            dojo.place(this.taskDataEditor.domNode,this.taskDataEditorContainer);
            this.taskToolbar.SET_TASKDATA_EDITOR(this.taskDataEditor);

            this.dynamicPageData.taskItemData["taskProgress"]="HANDLING";//WAITING WAITING_OVERDUE HANDLING HANDLING_OVERDUE COMPLETE

            UI.showProgressDialog("查询数据");
            var that=this;
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                //After modify the business activity definition, the data for each version maybe changed.
                //But in current code logic service side only return the first version's data,
                //So need refresh each activity step's data before open detail page.
                var taskName=that.dynamicPageData.taskItemData.taskName;
                //child task uses parent task's data
                if(that.dynamicPageData.taskItemData.hasParentActivityStep){
                    var taskName=that.dynamicPageData.taskItemData.parentActivityStepName;
                }
                var resturl=ACTIVITY_SERVICE_ROOT+"activityStepDetail/"+APPLICATION_ID+"/"+that.dynamicPageData.taskItemData.activityId+"/"+taskName;
                var syncFlag=true;
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(returnData){
                    if(returnData){
                        var taskDataDetailInfo=null;
                        if(returnData.activityDataFieldValueList){
                            taskDataDetailInfo=returnData.activityDataFieldValueList.activityDataFieldValueList;
                        }
                        var taskDataFields=[];
                        if(taskDataDetailInfo){
                            dojo.forEach(taskDataDetailInfo,function(taskDataDetail){
                                var fieldDefinition=taskDataDetail.activityDataDefinition;
                                var propertyValue={};
                                propertyValue["name"]=fieldDefinition.displayName;
                                propertyValue["fieldName"]=fieldDefinition.fieldName;
                                propertyValue["type"]=fieldDefinition.fieldType;
                                propertyValue["multipleValue"]=fieldDefinition.arrayField;
                                propertyValue["required"]=fieldDefinition.mandatoryField;
                                if(fieldDefinition.arrayField){
                                    propertyValue["value"]=taskDataDetail.arrayDataFieldValue;
                                }else{
                                    propertyValue["value"]=taskDataDetail.singleDataFieldValue;
                                }
                                propertyValue["writable"]=fieldDefinition.writeableField;
                                propertyValue["readable"]=fieldDefinition.readableField;
                                taskDataFields.push(propertyValue);
                            });
                            that.dynamicPageData.taskItemData.taskDataFields=taskDataFields;

                            if(returnData.relatedRole){
                                that.dynamicPageData.taskItemData.taskRoleID=returnData.relatedRole.roleName;
                                that.dynamicPageData.taskItemData["taskRole"] = returnData.relatedRole.displayName;
                            }
                            that.dynamicPageData.taskItemData["dueDate"] = new Date(returnData.dueDate);
                            that.dynamicPageData.taskItemData["stepAssignee"] = returnData.stepAssignee;
                            that.dynamicPageData.taskItemData["stepOwner"] = returnData.stepOwner;
                            that.dynamicPageData.taskItemData["taskDueStatus"] = returnData["dueStatus"];
                            that.dynamicPageData.taskItemData["taskResponse"]=returnData["stepResponse"];
                        }
                    }
                    that._renderTaskDetail(that.dynamicPageData.taskItemData);
                    that._switchTaskSupportDataWidget("showAttachment");
                    UI.hideProgressDialog();
                };
                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
                timer.stop();
            };
            timer.start();
        },
        showAttachment:function(){
            this._switchTaskSupportDataWidget("showAttachment");
        },
        showParticipant:function(){
            this._switchTaskSupportDataWidget("showParticipant");
        },
        showComment:function(){
            this._switchTaskSupportDataWidget("showComment");
        },
        showHistory:function(){
            this._switchTaskSupportDataWidget("showHistory");
        },
        _switchTaskSupportDataWidget:function(supportWidgetType){
            if(this.taskSupportDataWidget_document){
                dojo.style(this.taskSupportDataWidget_document.domNode,{"display": "none"});
            }
            if(this.taskSupportDataWidget_participant){
                dojo.style(this.taskSupportDataWidget_participant.domNode,{"display": "none"});
            }
            if(this.taskSupportDataWidget_comment){
                dojo.style(this.taskSupportDataWidget_comment.domNode,{"display": "none"});
            }
            if(this.taskSupportDataWidget_history){
                dojo.style(this.taskSupportDataWidget_history.domNode,{"display": "none"});
            }
            if(supportWidgetType=="showAttachment"){
                this.taskSupportDataWidgetSwitchButton.set("label","活动附件");
                if(this.taskSupportDataWidget_document){
                    dojo.style(this.taskSupportDataWidget_document.domNode,{"display": ""});
                }else{
                    this.taskSupportDataWidget_document=new vfbam.userclient.common.UI.components.documentsList.
                        TaskDocumentsListWidget({documentsOwnerType:"ACTIVITY",taskData:this.dynamicPagePayload["APP_PAGE_DYNAMIC_DATA"]},this.taskSupportDataContainer_document);
                }
            }
            if(supportWidgetType=="showParticipant"){
                this.taskSupportDataWidgetSwitchButton.set("label","活动参与人");
                if(this.taskSupportDataWidget_participant){
                    dojo.style(this.taskSupportDataWidget_participant.domNode,{"display": ""});
                    this.taskSupportDataWidget_participant.reloadParticipantsList();
                }else{
                    this.taskSupportDataWidget_participant=new vfbam.userclient.common.UI.components.participantsList.
                        ActivityInvolvedParticipantListWidget({taskData:this.dynamicPagePayload["APP_PAGE_DYNAMIC_DATA"]},this.taskSupportDataContainer_participant);
                }
            }
            if(supportWidgetType=="showComment"){
                this.taskSupportDataWidgetSwitchButton.set("label","活动备注");
                if(this.taskSupportDataWidget_comment){
                    dojo.style(this.taskSupportDataWidget_comment.domNode,{"display": ""});
                }else{
                    this.taskSupportDataWidget_comment=new vfbam.userclient.common.UI.components.commentsList.
                        CommentsListWidget({taskData:this.dynamicPagePayload["APP_PAGE_DYNAMIC_DATA"]},this.taskSupportDataContainer_comment);
                }
            }
            if(supportWidgetType=="showHistory"){
                this.taskSupportDataWidgetSwitchButton.set("label","活动历史记录");
                if(this.taskSupportDataWidget_history){
                    dojo.style(this.taskSupportDataWidget_history.domNode,{"display": ""});
                }else{
                    this.taskSupportDataWidget_history=new vfbam.userclient.common.UI.components.historyList.
                        HistoryListWidget({taskData:this.dynamicPagePayload["APP_PAGE_DYNAMIC_DATA"]},this.taskSupportDataContainer_history);
                }
            }
        },
        _renderTaskDetail:function(taskItemData){
            this.taskToolbar.RENDER_TASKTOOLBAR(taskItemData);
            this.taskDataEditor.RENDER_TASKDATA(taskItemData);
        },
        resetTaskData:function(){
            this.taskDataEditor.RESET_TASKDATA();
        },
        closePage:function(){
            //check whether there are modified and not saved data
            var that=this;
            var isCleanPage=!this.taskDataEditor.CHECK_DIRTY_TASKDATA();
            if(isCleanPage){
                this._closePage();
            }else{
                var confirmButtonAction=function(){
                    that.taskDataEditor.SAVE_TASKDATA(dojo.hitch(that,that._closePage));
                }
                var cancelButtonAction=function(){
                    that._closePage();
                }
                var confirmationLabel= "有未保存的数据变更，请选择<b> 保存任务数据 </b>存储变更的数据,或选择<b> 忽略变更数据 </b>放弃未保存的数据变更。";
                UI.showConfirmDialog({
                    message:confirmationLabel,
                    confirmButtonLabel:"<i class='icon-save'></i> 保存任务数据",
                    cancelButtonLabel:"<i class='icon-remove'></i> 忽略变更数据",
                    confirmButtonAction:confirmButtonAction,
                    cancelButtonAction:cancelButtonAction
                });
            }
        },
        _closePage:function(){
            if(this.sourcePageInfo){
                if(this.sourcePageInfo["PAGE_STATUS"]=="DYNAMIC"){
                    UI.showDynamicPage(this.sourcePageInfo["PAGE_ID"]);
                }
                if(this.sourcePageInfo["PAGE_STATUS"]=="STATIC"){
                    UI.showStaticPage(this.sourcePageInfo["PAGE_TYPE"]) ;
                }
            }
            UI.closeDynamicPage( this.dynamicPageId);
        },
        destroy:function(){
            console.log("destroy widget in dynamic page:"+this.dynamicPageId);
            this.taskToolbar.destroy();
            this.taskDataEditor.destroy();
            if(this.taskSupportDataWidget_document){
                this.taskSupportDataWidget_document.destroy();
            }
            if(this.taskSupportDataWidget_participant){
                this.taskSupportDataWidget_participant.destroy();
            }
            if(this.taskSupportDataWidget_comment){
                this.taskSupportDataWidget_comment.destroy();
            }
            if(this.taskSupportDataWidget_history){
                this.taskSupportDataWidget_history.destroy();
            }
            dojo.disconnect(this.closePageConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});