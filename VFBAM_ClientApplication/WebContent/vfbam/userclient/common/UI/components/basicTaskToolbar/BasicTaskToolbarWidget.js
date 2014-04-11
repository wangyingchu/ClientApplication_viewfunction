require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskToolbar/template/BasicTaskToolbarWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.basicTaskToolbar.BasicTaskToolbarWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        taskDataEditor:null,
        taskItemData:null,
        menu_operationCollection:null,
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

            var that =this;
            if(taskItemData.stepAssignee){
                if(taskItemData.taskRole&&taskItemData.taskRole!="-"){
                    var returnTaskOperationCallback=function(){
                        taskItemData.stepAssignee=null;
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:taskItemData});
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,{taskData:taskItemData});
                        that._CLOSE_DYNAMIC_PAGE();
                    };
                    var menuItem_return = new dijit.MenuItem({
                        label: "<i class='icon-download-alt'></i> 返还任务",
                        onClick: function(){
                            var isDirtyPage=that.taskDataEditor. CHECK_DIRTY_TASKDATA();
                            if(isDirtyPage){
                                that._renderHandleDirtyDataDialog();
                            }else{
                                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT,{taskData:taskItemData,callback:returnTaskOperationCallback});
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
            }
            var cancelButtonAction=function(){
                that.taskDataEditor.RESET_TASKDATA();
            }
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
        },
        _setupTaskResponseButtons:function(){
            var that=this;
            var taskItemData= this.taskItemData;
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
                },this);
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
        //interface method used to set task data editor
        SET_TASKDATA_EDITOR:function(taskDataEditor){
            this.taskDataEditor=taskDataEditor;
        },
        _endOfCode: function(){}
    });
});