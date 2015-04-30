require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskToolbar/template/ChildTaskLauncherWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.basicTaskToolbar.ChildTaskLauncherWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        participantSelector:null,
        postCreate: function(){
            var taskRelatedRole=this.parentTaskItemData.taskRoleID;
            var participantsListURL=VFBAM_CORE_SERVICE_ROOT+"userManagementService/participantsOfRole/"+APPLICATION_ID+"/"+taskRelatedRole+"/";
            this.participantSelector=vfbam.userclient.common.UI.widgets.ParticipantSelector({participantDataSourceURL:participantsListURL,hideParticipantIds:[],customStyle:"width:350px;"},this.assigneeSelector);
        },
        launchChildTask:function(){
            var that=this;
            var childTaskName=this.childTaskNameField.get("value");
            if(childTaskName==""){
                UI.showToasterMessage({type:"error",message:"请输入子任务名称"});
                return;
            }
            var childTaskDesc=this.childTaskDescriptionField.get("value");
            if(childTaskDesc==""){
                UI.showToasterMessage({type:"error",message:"请输入子任务说明"});
                return;
            }
            var participantInfo=this.participantSelector.getSelectedParticipant();
            if(!participantInfo){
                //UI.showToasterMessage({type:"error",message:"请选择子任务处理人"});
                return;
            }
            var createChildTaskData={};
            createChildTaskData.activitySpaceName=APPLICATION_ID;
            createChildTaskData.activityType=this.parentTaskItemData.activityName;
            createChildTaskData.activityStepName=this.parentTaskItemData.taskName;
            createChildTaskData.activityId=this.parentTaskItemData.activityId;
            createChildTaskData.currentStepOwner=this.parentTaskItemData.stepAssignee;
            createChildTaskData.childTaskName=this.parentTaskItemData.taskName+":" + childTaskName;
            createChildTaskData.childTaskDescription=childTaskDesc;
            createChildTaskData.childTaskStepAssignee=participantInfo.participantId;
            createChildTaskData.childTaskDueDate=0;

            var dueDate=this.dueDateSelector.get("value");
            var dueTime=this.dueTimeSelector.get("value");
            if(dueDate!=null||dueTime!=null){
                var finalDueDate=new Date();
                if(dueDate){
                    finalDueDate.setFullYear(dueDate.getFullYear());
                    finalDueDate.setMonth(dueDate.getMonth());
                    finalDueDate.setDate(dueDate.getDate());
                }
                if(dueTime){
                    finalDueDate.setHours(dueTime.getHours());
                    finalDueDate.setMinutes(dueTime.getMinutes());
                    finalDueDate.setSeconds(0);
                }else{
                    finalDueDate.setHours(0);
                    finalDueDate.setMinutes(0);
                    finalDueDate.setSeconds(0);
                }
                createChildTaskData.childTaskDueDate=finalDueDate.getTime();
            }
            var confirmButtonAction=function(){
                that.doCreateChildTask(createChildTaskData);
            };
            UI.showConfirmDialog({
                message:"请确认是否将子任务 '<b>"+childTaskDesc+"</b>' 分配给 <b>"+participantInfo.participantLabel+"</b> 处理?" ,
                confirmButtonLabel:"<i class='icon-ok'></i> 确认",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        doCreateChildTask:function(createChildTaskInfo){
            var createChildTaskInfoContent=dojo.toJson(createChildTaskInfo);
            var resturl=ACTIVITY_SERVICE_ROOT+"createChildTask/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var timer = new dojox.timing.Timer(300);
                timer.onTick = function(){
                    UI.hideProgressDialog();
                    timer.stop();
                };
                timer.start();
                UI.showToasterMessage({type:"success",message:"创建子任务成功"});
                that.taskToolbar.refreshChildTasksInfo(data);
                that.doCloseContainerDialog();
            };
            UI.showProgressDialog("创建子任务");
            Application.WebServiceUtil.postJSONData(resturl,createChildTaskInfoContent,loadCallback,errorCallback);
        },
        doCloseContainerDialog:function(){},
        _endOfCode: function(){}
    });
});