require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskToolbar/template/BasicTaskToolbarWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.basicTaskToolbar.BasicTaskToolbarWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        taskDataEditor:null,
        taskItemData:null,
        menu_operationCollection:null,
        activityInstanceDetail:null,
        childTaskLauncher:null,
        childTaskList:null,
        taskHasChildActivitySteps:null,
        allChildStepsFinished:false,
        taskResponseButtonArray:false,
        postCreate: function(){},
        //interface method used to close dynamic page
        _CLOSE_DYNAMIC_PAGE:function(){
        },
        //interface method used to render task toolbar data
        RENDER_TASKTOOLBAR:function(taskItemData){
            this.taskItemData=taskItemData;
            var timeStamp=new Date().getTime();
            this.taskNameTxt.id= "TaskName"+timeStamp;
            this.taskDescTxtPopup.set("connectId",this.taskNameTxt.id);
            this.taskDescTxtPopup.set("label",taskItemData.taskDescription);
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            if(taskItemData.taskDueDate&&taskItemData.taskDueDate.getTime()!=0){
                var dateString=dojo.date.locale.format(taskItemData.taskDueDate,dateDisplayFormat);
                var timeString=dojo.date.locale.format(taskItemData.taskDueDate,timeDisplayFormat);
                this.taskDueDateTxt.innerHTML= dateString+" "+timeString;
            }else{
                this.taskDueDateTxt.innerHTML= "-";
            }
            this.taskNameTxt.innerHTML=  taskItemData.taskName;
            this.activityIdTxt.innerHTML=  taskItemData.activityId;
            this.activityNameTxt.innerHTML=  taskItemData.activityName;

            if(taskItemData.taskRole){
                this.taskRoleTxt.innerHTML=  taskItemData.taskRole;
            }else{
                dojo.style(this.taskRoleContainer,"display","none");
            }

            if(taskItemData.taskDueStatus=="OVERDUE"){
                this.taskStatusTxt.innerHTML="<span style='color: #CE0000;'><i class='icon-warning-sign' ></i> 已逾期</span>";
            }
            if(taskItemData.taskDueStatus=="DUETODAY"){
                this.taskStatusTxt.innerHTML="<span style='color: #FAC126;'><i class='icon-time'></i> 今日到期</span>";
            }
            if(taskItemData.taskDueStatus=="DUETHISWEEK"){
                this.taskStatusTxt.innerHTML="<span style='color: #666666;'><i class='icon-calendar'></i> 本周到期</span>";
            }
            if(taskItemData.taskDueStatus=="NODEU"){
                this.taskStatusTxt.innerHTML="<span style='color: #26A251;'><i class='icon-inbox'></i> 非紧急任务</span>";
            }

            this.menu_operationCollection=new dijit.DropDownMenu({ style: "display: none;"});
            var label="<i class='icon-caret-down icon-large'></i> 任务操作";
            this.taskOperationsDropdownButton=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:label,dropDown: this.menu_operationCollection},this.operationLink);

            if(taskItemData.hasParentActivityStep){
                dojo.style(this.operationLinkContainer,"display","none");
            }

            var that =this;
            if(taskItemData.stepAssignee){
                if(taskItemData.taskRole&&taskItemData.taskRole!="-"){
                    var returnTaskOperationCallback = function () {
                        taskItemData.stepAssignee = null;
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT, {taskData: taskItemData});
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT, {taskData: taskItemData});
                        that._CLOSE_DYNAMIC_PAGE();
                    };
                    var menuItem_return = new dijit.MenuItem({
                        label: "<i class='icon-download-alt'></i> 返还任务",
                        onClick: function () {
                            var isDirtyPage = that.taskDataEditor.CHECK_DIRTY_TASKDATA();
                            if (isDirtyPage) {
                                that._renderHandleDirtyDataDialog();
                            } else {
                                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT, {
                                    taskData: taskItemData,
                                    callback: returnTaskOperationCallback
                                });
                            }
                        }
                    });
                    this.menu_operationCollection.addChild(menuItem_return);
                    var reassignTaskOperationCallback=function(){
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:taskItemData});
                        that._CLOSE_DYNAMIC_PAGE();
                    };
                    var menuItem_reasign = new dijit.MenuItem({
                        label: "<i class='icon-male'></i> 重新分配",
                        onClick: function(){
                            var isDirtyPage=that.taskDataEditor. CHECK_DIRTY_TASKDATA();
                            if(isDirtyPage){
                                that._renderHandleDirtyDataDialog();
                            }else{
                                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_REASSIGNTASK_EVENT,{taskData:taskItemData,callback:reassignTaskOperationCallback});
                            }
                        }
                    });
                    this.menu_operationCollection.addChild(menuItem_reasign);
                }
            }else{
                if(taskItemData.taskRole&&taskItemData.taskRole!="-") {
                    var assignTaskOperationCallback = function () {
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT, {taskData: taskItemData});
                        that._CLOSE_DYNAMIC_PAGE();
                    };
                    var menuItem_asign = new dijit.MenuItem({
                        label: "<i class='icon-male'></i> 分配任务",
                        onClick: function () {
                            var isDirtyPage = that.taskDataEditor.CHECK_DIRTY_TASKDATA();
                            if (isDirtyPage) {
                                that._renderHandleDirtyDataDialog();
                            } else {
                                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_ASSIGNTASK_EVENT, {taskData: taskItemData, callback: assignTaskOperationCallback});
                            }
                        }
                    });
                    this.menu_operationCollection.addChild(menuItem_asign);
                }
            }

            if(taskItemData.stepAssignee){
                dojo.style(this.taskResponseButtonsContainer,"visibility","visible");
                this._setupTaskResponseButtons();
            }else{
                dojo.style(this.taskResponseButtonsContainer,"visibility","visibility:hidden");
            }

            //WAITING WAITING_OVERDUE HANDLING HANDLING_OVERDUE COMPLETE
            if(taskItemData.taskProgress=="WAITING"){this.taskProgressTxt.innerHTML="等待处理"}
            if(taskItemData.taskProgress=="WAITING_OVERDUE"){this.taskProgressTxt.innerHTML="等待处理 已逾期"}
            if(taskItemData.taskProgress=="HANDLING"){this.taskProgressTxt.innerHTML="处理中"}
            if(taskItemData.taskProgress=="HANDLING_OVERDUE"){this.taskProgressTxt.innerHTML="处理中 已逾期"}
            if(taskItemData.taskProgress=="COMPLETE"){this.taskProgressTxt.innerHTML="已完成"}

            if(taskItemData.taskProgress=="WAITING"||taskItemData.taskProgress=="WAITING_OVERDUE"){
                dojo.style(this.handleTaskButtonContainer,"display","");
                dojo.style(this.operationLinkContainer,"display","none");
                dojo.style(this.saveDataButtonsContainer,"display","none");
            }
            if(taskItemData.taskProgress=="COMPLETE"){
                dojo.style(this.handleTaskButtonContainer,"display","none");
                dojo.style(this.operationLinkContainer,"display","none");
                dojo.style(this.saveDataButtonsContainer,"display","none");
            }
            if(taskItemData.stepOwner){
                this._renderTaskAssignerInfo(taskItemData.stepOwner);
            }else{
                dojo.style(this.taskAssignerTxtContainer,"display","none");
            }
            if(taskItemData.stepAssignee){
                dojo.style(this.saveDataButtonsContainer,"display","");
                dojo.style(this.handleTaskButtonContainer,"display","none");
                dojo.style(this.childTaskOperationContainer,"display","");
                if(taskItemData.hasChildActivityStep){
                    dojo.style(this.childTaskDetailInfoContainer,"display","");
                    this._getChildTasksInfo();
                }
                if(taskItemData.hasParentActivityStep){
                    dojo.style(this.parentTaskDetailInfoContainer,"display","");
                }else{
                    dojo.style(this.createChildTaskInfoContainer,"display","");
                }
            }else{
                dojo.style(this.handleTaskButtonContainer,"display","");
                //if don't allow edit task before accept, hide save data button
                //dojo.style(this.saveDataButtonsContainer,"display","none");
            }
        },
        handleCurrentTask:function(){
            var taskItemData={};
            taskItemData["activityId"]= this.taskItemData.activityId;
            taskItemData["activityName"]= this.taskItemData.activityName;
            taskItemData["taskName"]= this.taskItemData.taskName ;
            taskItemData["taskId"]= this.taskItemData.taskId ;
            taskItemData["roleQueueName"]=this.taskItemData.roleQueueName;
            taskItemData["taskRoleID"]= this.taskItemData.taskRoleID ;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var that = this;
            var taskOperationCallback=function(){
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:taskItemData});
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,{taskData:taskItemData});
                that.taskItemData["stepAssignee"]=userId;
                that._setupToolBarElements();
                that._getChildTasksInfo();
            };
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_ACCEPTTASK_EVENT,{taskData:taskItemData,callback:taskOperationCallback});
        },
        saveTaskData:function(){
            this.taskDataEditor.SAVE_TASKDATA();
        },
        completeCurrentTask:function(taskResponse){
            var taskItemData= this.taskItemData;
            var currentTaskResponse;
            if(taskResponse!=undefined){
                currentTaskResponse=taskResponse;
            }else{
                currentTaskResponse=null;
            }
            var that=this;
            var completeTaskOperationCallback=function(){
                that._CLOSE_DYNAMIC_PAGE();
            };
            var dataValidateResult= this.taskDataEditor.VALIDATE_TASKDATA();
            if(dataValidateResult){
                var isDirtyPage=this.taskDataEditor. CHECK_DIRTY_TASKDATA();
                if(isDirtyPage){
                    that._renderHandleDirtyDataDialog();
                }else{
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_COMPLETETASK_EVENT,{taskData:taskItemData,taskResponse:currentTaskResponse,callback:completeTaskOperationCallback});
                }
            }else{
                UI.showToasterMessage({type:"error",message:"任务数据输入不全或存在格式错误"});
            }
        },
        _renderHandleDirtyDataDialog:function(){
            var that=this;
            var confirmButtonAction=function(){
                that.taskDataEditor.SAVE_TASKDATA();
            };
            var cancelButtonAction=function(){
                that.taskDataEditor.RESET_TASKDATA();
            };
            var confirmationLabel= "有未保存的数据变更，请选择<b> 保存任务数据 </b>存储变更的数据,或选择<b> 放弃变更数据 </b>恢复变更前的初始数据之后再尝试当前操作。";
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-save'></i> 保存任务数据",
                cancelButtonLabel:"<i class='icon-remove'></i> 放弃变更数据",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        _setupToolBarElements:function(){
            dojo.style(this.taskResponseButtonsContainer,"visibility","visible");
            dojo.style(this.handleTaskButtonContainer,"display","none");
            this._setupTaskResponseButtons();
            var that=this;
            var returnTaskOperationCallback=function(){
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:taskItemData});
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,{taskData:taskItemData});
                that._CLOSE_DYNAMIC_PAGE();
            };
            var taskItemData= this.taskItemData;
            var currentMenus=this.menu_operationCollection.getChildren();
            dojo.forEach(currentMenus,function(menu){
                this.menu_operationCollection.removeChild(currentMenus[0]);
            },this);
            var menuItem_return = new dijit.MenuItem({
                label: "<i class='icon-download-alt'></i> 返还任务",
                onClick: function(){
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT,{taskData:taskItemData,callback:returnTaskOperationCallback});
                }
            });
            this.menu_operationCollection.addChild(menuItem_return);
            var reassignTaskOperationCallback=function(){
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:taskItemData});
                that._CLOSE_DYNAMIC_PAGE();
            };
            this.menu_operationCollection.addChild(menuItem_return);
            var menuItem_reasign = new dijit.MenuItem({
                label: "<i class='icon-male'></i> 重新分配",
                onClick: function(){
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_REASSIGNTASK_EVENT,{taskData:taskItemData,callback:reassignTaskOperationCallback});
                }
            });
            this.menu_operationCollection.addChild(menuItem_reasign);
            dojo.style(this.childTaskOperationContainer,"display","");
            if(taskItemData.hasChildActivityStep){
                dojo.style(this.childTaskDetailInfoContainer,"display","");
            }
            if(taskItemData.hasParentActivityStep){
                dojo.style(this.parentTaskDetailInfoContainer,"display","");

            }else{
                dojo.style(this.createChildTaskInfoContainer,"display","");
            }
        },
        _setupTaskResponseButtons:function(){
            var that=this;
            var taskItemData= this.taskItemData;
            if(taskItemData.hasParentActivityStep==true){
                var completeButton=new dijit.form.Button({
                    label:"完成当前任务",
                    onClick: function(){
                        that.completeCurrentTask();
                    }
                });
                this.taskResponseButtonsContainer.appendChild(completeButton.domNode);
                if(taskItemData.taskProgress=="WAITING"||taskItemData.taskProgress=="WAITING_OVERDUE"||taskItemData.taskProgress=="COMPLETE"){
                    completeButton.set("disabled","disabled");
                }
            }else{
                this.taskResponseButtonArray=[];
                if(!taskItemData.taskResponse||taskItemData.taskResponse.length==0){
                    var completeButton=new dijit.form.Button({
                        label:"完成当前任务",
                        onClick: function(){
                            that.completeCurrentTask();
                        }
                    });
                    this.taskResponseButtonsContainer.appendChild(completeButton.domNode);
                    if(taskItemData.taskProgress=="WAITING"||taskItemData.taskProgress=="WAITING_OVERDUE"||taskItemData.taskProgress=="COMPLETE"){
                        completeButton.set("disabled","disabled");
                    }
                    this.taskResponseButtonArray.push(completeButton);
                }else{
                    dojo.forEach(taskItemData.taskResponse,function(responseName){
                        var newResponseButton=new dijit.form.Button({
                            label:responseName,
                            onClick: function(){
                                that.completeCurrentTask(responseName);
                            }
                        });
                        this.taskResponseButtonsContainer.appendChild(newResponseButton.domNode);
                        if(taskItemData.taskProgress=="WAITING"||taskItemData.taskProgress=="WAITING_OVERDUE"||taskItemData.taskProgress=="COMPLETE"){
                            newResponseButton.set("disabled","disabled");
                        }
                        this.taskResponseButtonArray.push(newResponseButton);
                    },this);
                }
                if(taskItemData.hasChildActivityStep==true){
                    if(this.allChildStepsFinished==true){
                    }else{
                        this._disableResponseButtons();
                        this._showResponseButtonsStatusControl();
                    }
                }
            }
        },
        _renderTaskAssignerInfo:function(assignerId){
            var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/basicInfo/"+APPLICATION_ID+"/"+assignerId;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var currentParticipant={};
                currentParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ data.userId;
                currentParticipant.participantName=data.displayName;
                currentParticipant.participantId=data.userId;
                currentParticipant.participantTitle=data.title;
                currentParticipant.participantDesc=data.description;
                currentParticipant.participantAddress=data.address;
                currentParticipant.participantPhone=data.fixedPhone;
                currentParticipant.participantEmail=data.emailAddress;
                var assignerParticipantNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:currentParticipant});
                that.taskAssignerNameLabel.set("label",data.displayName);
                that.taskAssignerNameLabel.set("dropDown",assignerParticipantNamecardWidget);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        _getChildTasksInfo:function(){
            this.taskHasChildActivitySteps=true;
            var queryChildTasksData={};
            queryChildTasksData.activitySpaceName=APPLICATION_ID;
            queryChildTasksData.activityType=this.taskItemData.activityName;
            queryChildTasksData.activityStepName=this.taskItemData.taskName;
            queryChildTasksData.activityId=this.taskItemData.activityId;
            queryChildTasksData.currentStepOwner=this.taskItemData.stepAssignee;
            var queryChildTasksDataContent=dojo.toJson(queryChildTasksData);
            var resturl=ACTIVITY_SERVICE_ROOT+"childTasksInfo/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                if(data.allChildStepsFinished==false&&data.childActivitySteps.length==0){
                }else{
                    that.allChildStepsFinished=data.allChildStepsFinished;
                    that.refreshChildTasksInfo();
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,queryChildTasksDataContent,loadCallback,errorCallback);
        },
        showActivityInstanceDetail:function(){
            var resturl=ACTIVITY_SERVICE_ROOT+"activityInstanceDetail/"+APPLICATION_ID+"/"+this.taskItemData.activityId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                that.doShowActivityInstanceDetail(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        doShowActivityInstanceDetail:function(activityInstanceData){
            this.activityInstanceDetail=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityInstanceDetailWidget({activityInstanceData:activityInstanceData});
            var	dialog = new Dialog({
                style:"width:760px;",
                title: "<i class='icon-info-sign'></i> 业务活动详情",
                content: "",
                buttons:null,
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(this.activityInstanceDetail.containerNode, dialog.containerNode);
            dialog.show();
            var that=this;
            var closeDialogCallBack=function(){
                that.activityInstanceDetail.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        launchChildTask:function(){
            this.childTaskLauncher=new vfbam.userclient.common.UI.components.basicTaskToolbar.ChildTaskLauncherWidget({parentTaskItemData:this.taskItemData,taskToolbar:this});
            var confirmButton=new dijit.form.Button({
                label: "<i class='icon-plus-sign'></i> 创建",
                onClick: function(){
                    that.childTaskLauncher.launchChildTask();
                }
            });
            var actionButtone=[];
            actionButtone.push(confirmButton);
            var	dialog = new Dialog({
                style:"width:520px;",
                title: "<i class='icon-plus-sign'></i> 创建子任务",
                content: "",
                buttons:actionButtone,
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            dojo.place(this.childTaskLauncher.containerNode, dialog.containerNode);
            dialog.show();
            //set top position for show full size Role Participants Selector
            dojo.style(dialog.domNode,'top','100px');
            var that=this;
            var closeDialogCallBack=function(){
                that.childTaskLauncher.destroy();
            };
            dialog.connect(this.childTaskLauncher, "doCloseContainerDialog", "hide");
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        showChildTasksInfo:function(){
            this.childTaskList=new vfbam.userclient.common.UI.components.basicTaskToolbar.ChildTaskListWidget({parentTaskItemData:this.taskItemData,taskToolbar:this});
            var	dialog = new Dialog({
                style:"width:700px;",
                title: "<i class='icon-sitemap'></i> 子任务详情",
                content: "",
                buttons:null,
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(this.childTaskList.containerNode, dialog.containerNode);
            dialog.show();
            var that=this;
            var closeDialogCallBack=function(){
                that.childTaskList.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        refreshChildTasksInfo:function(childTasksInfo){
            if(childTasksInfo){
                //called after added a new child taks
                this.taskHasChildActivitySteps=true;
                this.allChildStepsFinished=false;
            }else{
                //refresh Current tasks info
            }
            var taskItemData= this.taskItemData;
            dojo.style(this.childTaskDetailInfoContainer,"display","");
            if(this.allChildStepsFinished){
                this._enableResponseButtons();
                this._hideResponseButtonsStatusControl();
            }else{
                this._disableResponseButtons();
                this._showResponseButtonsStatusControl();
            }
        },
        resetResponseButtonsStatus:function(){
            var enableFinishAllChildTasks= this.switchResponseButtonsCheckbox.get('checked');
            if(enableFinishAllChildTasks){
                this._enableResponseButtons();
            }else{
                this._disableResponseButtons();
            }
        },
        _disableResponseButtons:function(){
            dojo.forEach(this.taskResponseButtonArray,function(responseButton){
                responseButton.set("disabled","disabled");
            });
        },
        _enableResponseButtons:function(){
            var taskItemData= this.taskItemData;
            dojo.forEach(this.taskResponseButtonArray,function(responseButton){
                if(taskItemData.taskProgress=="WAITING"||taskItemData.taskProgress=="WAITING_OVERDUE"||taskItemData.taskProgress=="COMPLETE"){
                    responseButton.set("disabled","disabled");
                }else{
                    responseButton.set("disabled",false);
                }
            });
        },
        _showResponseButtonsStatusControl:function(){
            dojo.style(this.finishChildTasksUIContainer,"display","");
        },
        _hideResponseButtonsStatusControl:function(){
            dojo.style(this.finishChildTasksUIContainer,"display","none");
        },
        //interface method used to set task data editor
        SET_TASKDATA_EDITOR:function(taskDataEditor){
            this.taskDataEditor=taskDataEditor;
        },
        _endOfCode: function(){}
    });
});