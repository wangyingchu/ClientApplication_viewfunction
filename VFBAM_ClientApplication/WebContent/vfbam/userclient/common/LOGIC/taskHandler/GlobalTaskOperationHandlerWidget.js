require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget","idx/oneui/Dialog"
],function(lang,declare,_Widget,Dialog){
    declare("vfbam.userclient.common.LOGIC.taskHandler.GlobalTaskOperationHandlerWidget", [_Widget], {
        postCreate: function(){
            console.log("GlobalTaskOperationHandlerWidget created");
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT,dojo.hitch(this,this.handleTask));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT,dojo.hitch(this,this.returnTask));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_REASSIGNTASK_EVENT,dojo.hitch(this,this.reassignTask));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_DISPLAYTASK_EVENT,dojo.hitch(this,this.displayTask));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_ASSIGNTASK_EVENT,dojo.hitch(this,this.assignTask));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_ACCEPTTASK_EVENT,dojo.hitch(this,this.acceptTask));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_COMPLETETASK_EVENT,dojo.hitch(this,this.completeTask));
        },
        handleTask:function(messageData){
            var businessData={};
            businessData["taskItemData"] = messageData.taskData;
            var switchPagePayload=  messageData.switchPagePayload;
            switchPagePayload["APP_PAGE_DYNAMIC_DATA"]=businessData;
            var taskPageTitle= "<i class='icon-tag'></i> 任务详情 ("+messageData.taskData.activityId+")";
            var dynamicPageId=UI.openDynamicPage("TASK_DETAIL","任务详情",messageData.taskData.activityId,taskPageTitle,switchPagePayload);
            if(dynamicPageId){
                UI.showDynamicPage(dynamicPageId);
            }
        },
        displayTask:function(messageData){
            var businessData={};
            businessData["taskItemData"] = messageData.taskData;
            var switchPagePayload=  messageData.switchPagePayload;
            switchPagePayload["APP_PAGE_DYNAMIC_DATA"]=businessData;
            var taskPageTitle= "<i class='icon-tag'></i> 任务详情 ("+messageData.taskData.activityId+")";
            var dynamicPageId=UI.openDynamicPage("TASK_DETAIL","任务详情",messageData.taskData.activityId,taskPageTitle,switchPagePayload);
            if(dynamicPageId){
                UI.showDynamicPage(dynamicPageId);
            }
        },
        returnTask:function(messageData){
            var taskDesc=messageData.taskData.taskName+"-"+messageData.taskData.activityName +"("+messageData.taskData.activityId+")";
            var messageTxt="<b>请确认是否返还任务:</b>' "+taskDesc+" '?";
            var confirmButtonAction=function(){
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var activityStepOperationObject={};
                activityStepOperationObject.activitySpaceName = APPLICATION_ID;
                activityStepOperationObject.activityType = messageData.taskData.activityName;
                activityStepOperationObject.activityStepName = messageData.taskData.taskName;
                activityStepOperationObject.activityId = messageData.taskData.activityId;
                activityStepOperationObject.currentStepOwner = userId;
                var activityStepOperationContent=dojo.toJson(activityStepOperationObject);
                var resturl=ACTIVITY_SERVICE_ROOT+"returnParticipantTask/";
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
                    if(data.operationResult){
                        UI.showToasterMessage({type:"success",message:"返还任务成功"});
                        if(messageData.callback){
                            messageData.callback();
                        }
                    }else{
                        var errorDialogDataObj={};
                        var okButtonAction=function(){};
                        errorDialogDataObj.message="返还任务失败";
                        errorDialogDataObj.oKButtonAction=okButtonAction;
                        errorDialogDataObj.oKButtonLabel="确定";
                        UI.showErrorDialog(errorDialogDataObj);
                    }

                };
                UI.showProgressDialog("返还任务");
                Application.WebServiceUtil.postJSONData(resturl,activityStepOperationContent,loadCallback,errorCallback);
            }
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-download-alt'></i> 返还",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        reassignTask:function(messageData){
            var taskRelatedRole=messageData.taskData.taskRoleID;
            var taskDesc=messageData.taskData.taskName+"-"+messageData.taskData.activityName +"("+messageData.taskData.activityId+")";
            var participantsListURL=VFBAM_CORE_SERVICE_ROOT+"userManagementService/participantsOfRole/"+APPLICATION_ID+"/"+taskRelatedRole+"/";
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var participantSelector=vfbam.userclient.common.UI.widgets.ParticipantSelector({selectorDescription:"<i class='icon-ok'></i>  请选择新的任务负责人：",participantDataSourceURL:participantsListURL,hideParticipantIds:[userId]});
            var _doAssignTask=function(){
                var participantInfo=participantSelector.getSelectedParticipant();
                var confirmButtonAction=function(){
                    dialog.hide();
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var activityStepOperationObject={};
                    activityStepOperationObject.activitySpaceName = APPLICATION_ID;
                    activityStepOperationObject.activityType = messageData.taskData.activityName;
                    activityStepOperationObject.activityStepName = messageData.taskData.taskName;
                    activityStepOperationObject.activityId = messageData.taskData.activityId;
                    activityStepOperationObject.currentStepOwner = userId;
                    activityStepOperationObject.newStepOwner = participantInfo.participantId;
                    var activityStepOperationContent=dojo.toJson(activityStepOperationObject);
                    var resturl=ACTIVITY_SERVICE_ROOT+"reassignParticipantTask/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        var timer = new dojox.timing.Timer(300);
                        timer.onTick = function(){
                            UI.hideProgressDialog();
                            timer.stop();
                        };
                        timer.start();
                        if(data.operationResult){
                            UI.showToasterMessage({type:"success",message:"重新分配任务成功"});
                            if(messageData.callback){
                                messageData.callback();
                            }
                        }else{
                            var errorDialogDataObj={};
                            var okButtonAction=function(){};
                            errorDialogDataObj.message="重新分配任务失败";
                            errorDialogDataObj.oKButtonAction=okButtonAction;
                            errorDialogDataObj.oKButtonLabel="确定";
                            UI.showErrorDialog(errorDialogDataObj);
                        }
                    };
                    UI.showProgressDialog("重新分配任务");
                    Application.WebServiceUtil.postJSONData(resturl,activityStepOperationContent,loadCallback,errorCallback);
                }
                if(participantInfo){
                    UI.showConfirmDialog({
                        message:"请确认是否将任务 '<b>"+taskDesc+"</b>' 重新分配给 <b>"+participantInfo.participantLabel+"</b> 处理?" ,
                        confirmButtonLabel:"<i class='icon-ok'></i> 确认",
                        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                        confirmButtonAction:confirmButtonAction
                    });
                }
            };
            var sendMessageButton=new dijit.form.Button({
                label: "<i class='icon-male'></i> 分配",
                onClick: _doAssignTask
            });
            var actionButtone=[];
            actionButtone.push(sendMessageButton);
            var	dialog = new Dialog({
                style:"width:500px;",
                title: "<span style='font-size: 0.7em;'><i class='icon-male'></i> 重新分配任务</span>",
                content: "",
                buttons:actionButtone,
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            dojo.place(participantSelector.containerNode, dialog.containerNode);
            dialog.show();
        },
        assignTask:function(messageData){
            var taskRelatedRole=messageData.taskData.taskRoleID;
            var taskDesc=messageData.taskData.taskName+"-"+messageData.taskData.activityName +"("+messageData.taskData.activityId+")";
            var participantsListURL=VFBAM_CORE_SERVICE_ROOT+"userManagementService/participantsOfRole/"+APPLICATION_ID+"/"+taskRelatedRole+"/";
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var participantSelector=vfbam.userclient.common.UI.widgets.ParticipantSelector({selectorDescription:"<i class='icon-ok'></i>  请选择任务负责人：",participantDataSourceURL:participantsListURL,hideParticipantIds:[userId]});
            var _doAssignTask=function(){
                var participantInfo=participantSelector.getSelectedParticipant();
                var confirmButtonAction=function(){
                    dialog.hide();
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var activityStepOperationObject={};
                    activityStepOperationObject.activitySpaceName = APPLICATION_ID;
                    activityStepOperationObject.activityType = messageData.taskData.activityName;
                    activityStepOperationObject.activityStepName = messageData.taskData.taskName;
                    activityStepOperationObject.activityId = messageData.taskData.activityId;
                    activityStepOperationObject.newStepOwner = participantInfo.participantId;
                    activityStepOperationObject.activityStepRelatedRoleQueue=messageData.taskData.roleQueueName;
                    var activityStepOperationContent=dojo.toJson(activityStepOperationObject);
                    var resturl=ACTIVITY_SERVICE_ROOT+"acceptRoleQueueTask/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        var timer = new dojox.timing.Timer(300);
                        timer.onTick = function(){
                            UI.hideProgressDialog();
                            timer.stop();
                        };
                        timer.start();
                        if(data.operationResult){
                            UI.showToasterMessage({type:"success",message:"分配任务成功"});
                            if(messageData.callback){
                                messageData.callback();
                            }
                        }else{
                            var errorDialogDataObj={};
                            var okButtonAction=function(){};
                            errorDialogDataObj.message="分配任务失败";
                            errorDialogDataObj.oKButtonAction=okButtonAction;
                            errorDialogDataObj.oKButtonLabel="确定";
                            UI.showErrorDialog(errorDialogDataObj);
                        }
                    };
                    UI.showProgressDialog("分配任务");
                    Application.WebServiceUtil.postJSONData(resturl,activityStepOperationContent,loadCallback,errorCallback);
                }
                if(participantInfo){
                    UI.showConfirmDialog({
                        message:"请确认是否将任务 '<b>"+taskDesc+"</b>' 分配给 <b>"+participantInfo.participantLabel+"</b> 处理?" ,
                        confirmButtonLabel:"<i class='icon-ok'></i> 确认",
                        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                        confirmButtonAction:confirmButtonAction
                    });
                }
            };
            var sendMessageButton=new dijit.form.Button({
                label: "<i class='icon-male'></i> 分配",
                onClick: _doAssignTask
            });
            var actionButtone=[];
            actionButtone.push(sendMessageButton);
            var	dialog = new Dialog({
                style:"width:500px;",
                title: "<span style='font-size: 0.7em;'><i class='icon-male'></i> 分配任务</span>",
                content: "",
                buttons:actionButtone,
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            dojo.place(participantSelector.containerNode, dialog.containerNode);
            dialog.show();
        },
        acceptTask:function(messageData){
            var taskDesc=messageData.taskData.taskName+"-"+messageData.taskData.activityName +"("+messageData.taskData.activityId+")";
            var messageTxt="<b>请确认是否接受任务:</b>' "+taskDesc+" '?";
            var confirmButtonAction=function(){
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var activityStepOperationObject={};
                activityStepOperationObject.activitySpaceName = APPLICATION_ID;
                activityStepOperationObject.activityType = messageData.taskData.activityName;
                activityStepOperationObject.activityStepName = messageData.taskData.taskName;
                activityStepOperationObject.activityId = messageData.taskData.activityId;
                activityStepOperationObject.newStepOwner = userId;
                activityStepOperationObject.activityStepRelatedRoleQueue=messageData.taskData.roleQueueName;
                var activityStepOperationContent=dojo.toJson(activityStepOperationObject);
                var resturl=ACTIVITY_SERVICE_ROOT+"acceptRoleQueueTask/";
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
                    if(data.operationResult){
                        UI.showToasterMessage({type:"success",message:"接受任务成功"});
                        if(messageData.callback){
                            messageData.callback();
                        }
                    }else{
                        var errorDialogDataObj={};
                        var okButtonAction=function(){};
                        errorDialogDataObj.message="接受任务失败";
                        errorDialogDataObj.oKButtonAction=okButtonAction;
                        errorDialogDataObj.oKButtonLabel="确定";
                        UI.showErrorDialog(errorDialogDataObj);
                    }
                };
                UI.showProgressDialog("接受任务");
                Application.WebServiceUtil.postJSONData(resturl,activityStepOperationContent,loadCallback,errorCallback);
            }
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-check'></i> 接受",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        completeTask:function(taskDataPayload){
            var currentResponseTxt="完成当前任务";
            if(taskDataPayload.taskResponse){
                currentResponseTxt=taskDataPayload.taskResponse;
            }
            var taskDesc=taskDataPayload.taskData.taskName+"-"+taskDataPayload.taskData.activityName +"("+taskDataPayload.taskData.activityId+")";
            var messageTxt="请确认是否执行<b> "+currentResponseTxt+" </b>操作。任务信息:' "+taskDesc+" '?";
            var confirmButtonAction=function(){
                var taskDataInfo=taskDataPayload.taskData;
                var taskDataDetailObject={};
                taskDataDetailObject["activityStepOperationVO"]={};
                taskDataDetailObject["activityStepOperationVO"]["activitySpaceName"]=APPLICATION_ID;
                taskDataDetailObject["activityStepOperationVO"]["activityType"]=taskDataInfo.activityName;
                taskDataDetailObject["activityStepOperationVO"]["activityStepName"]=taskDataInfo.taskName;
                taskDataDetailObject["activityStepOperationVO"]["activityId"]=taskDataInfo.activityId;
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                taskDataDetailObject["activityStepOperationVO"]["currentStepOwner"]=userId;
                if(taskDataInfo.taskRoleID){
                    taskDataDetailObject["activityStepOperationVO"]["activityStepRelatedRole"]=taskDataInfo.taskRoleID;
                }else{
                    taskDataDetailObject["activityStepOperationVO"]["activityStepRelatedRole"]=null;
                }
                if(taskDataPayload.taskResponse){
                    taskDataDetailObject["activityStepOperationVO"]["activityStepResponse"]=taskDataPayload.taskResponse;
                }else{
                    taskDataDetailObject["activityStepOperationVO"]["activityStepResponse"]=null;
                }
                taskDataDetailObject["activityDataFieldValueList"]={};
                taskDataDetailObject["activityDataFieldValueList"]["activityDataFieldValueList"]=[];
                var currentTaskDataArray=taskDataInfo.taskDataFields;
                dojo.forEach(currentTaskDataArray,function(currentTaskData){
                    var currentTaskDataObj={};
                    if(currentTaskData.multipleValue){
                        if(currentTaskData.type=="DATE"){
                            var dateTimeArray=[];
                            dojo.forEach(currentTaskData.value,function(currentDate){
                                dateTimeArray.push(""+currentDate.getTime());
                            });
                            currentTaskDataObj.arrayDataFieldValue=dateTimeArray;
                        }else{
                            currentTaskDataObj.arrayDataFieldValue=currentTaskData.value;
                        }
                    }else{
                        if(currentTaskData.type=="DATE"){
                            if(currentTaskData.value){
                                if(currentTaskData.value.getTime!=null){
                                    currentTaskDataObj.singleDataFieldValue=""+currentTaskData.value.getTime();
                                }else{
                                    currentTaskDataObj.singleDataFieldValue=""+currentTaskData.value;
                                }
                            }else{
                                currentTaskDataObj.singleDataFieldValue="";
                            }
                        }else{
                            currentTaskDataObj.singleDataFieldValue=""+currentTaskData.value;
                        }
                    }
                    var dataFieldDefination={};
                    dataFieldDefination.displayName=currentTaskData.name;
                    dataFieldDefination.fieldName=currentTaskData.fieldName;
                    dataFieldDefination.fieldType=currentTaskData.type;
                    dataFieldDefination.arrayField=currentTaskData.multipleValue;
                    dataFieldDefination.mandatoryField=currentTaskData.required;
                    currentTaskDataObj.activityDataDefinition=dataFieldDefination;
                    taskDataDetailObject["activityDataFieldValueList"]["activityDataFieldValueList"].push(currentTaskDataObj);
                });
                var modifiedDataContent=dojo.toJson(taskDataDetailObject);
                var resturl=ACTIVITY_SERVICE_ROOT+"completeTask/";
                var errorCallback= function(data){
                    UI.hideProgressDialog();
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    var timer = new dojox.timing.Timer(300);
                    timer.onTick = function(){
                        UI.hideProgressDialog();
                        timer.stop();
                    };
                    UI.hideProgressDialog();
                    if(data){
                        UI.showToasterMessage({type:"success",message:"当前任务成功完成"});
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{});
                        if(taskDataPayload.callback){
                            taskDataPayload.callback();
                        }
                    }
                };
                UI.showProgressDialog("完成当前任务");
                Application.WebServiceUtil.postJSONData(resturl,modifiedDataContent,loadCallback,errorCallback);
            }
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-check'></i> 确认",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        getTaskDataEditor:function(taskItemData){
            if(taskItemData.taskDataEditorType){

            }else{
                var currentTaskDateEditor=new vfbam.userclient.common.UI.components.basicTaskDataEditor.BasicTaskDataEditorWidget();
                return currentTaskDateEditor;
            }
        },
        getTaskToolbar:function(taskItemData){
            if(taskItemData.taskToolbarType){

            }else{
                var currentTaskToolbar=new vfbam.userclient.common.UI.components.basicTaskToolbar.BasicTaskToolbarWidget();
                return currentTaskToolbar;
            }
        },
        _endOfCode: function(){}
    });
});