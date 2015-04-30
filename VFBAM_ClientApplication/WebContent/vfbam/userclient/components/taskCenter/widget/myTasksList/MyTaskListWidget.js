require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/taskCenter/widget/myTasksList/template/MyTaskListWidget.html","dojo/dom-geometry",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domGeom,domClass){
    declare("vfbam.userclient.components.taskCenter.widget.myTasksList.MyTaskListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        taskItemsArray:null,
        postCreate: function(){
            this.taskItemsArray=[];
            var contentBox = domGeom.getContentBox(dojo.byId("app_taskCenter_mainContainer"));
            var realHeight=contentBox.h-5;
            var currentHeightStyle=""+realHeight +"px";
            dojo.style(this.myTaskListContainer,"height",currentHeightStyle);
            var realTaskListContainer=  realHeight-45;
            var realTaskListContainerHeightStyle=""+realTaskListContainer +"px";
            dojo.style(this.myTaskMagazineViewItemListContainer,"height",realTaskListContainerHeightStyle);
            this.loadTaskItems();
            this.loadUserApplicationRoles();
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_TASKDATAUPDATED_EVENT,dojo.hitch(this,"refreshUpdatedTaskData"));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,dojo.hitch(this,"reloadTaskList"));
        },
        loadTaskItems:function(){
            var that=this;
            var timer = new dojox.timing.Timer(500);
            timer.onTick = function(){
                that._loadTaskItems();
                timer.stop();
            };
            timer.start();
        },
        loadUserApplicationRoles:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=ACTIVITY_SERVICE_ROOT+"participantRelatedRolesDetail/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                Application.AttributeContext.getAttribute(USER_PROFILE).userApplicationRoles=data;
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        _loadTaskItems:function(){
            this._cleanDirtyItemData();
            var isOdd=true;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=ACTIVITY_SERVICE_ROOT+"participantTasksDetailInfo/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var totalNumber= data.participantTasksVOList.length;
                that.taskTotalNumber.innerHTML= totalNumber;
                var participantTasksDetailVOList=data.participantTasksVOList;
                if(participantTasksDetailVOList){
                    dojo.forEach(participantTasksDetailVOList,function(participantDetailTask){
                        if(participantDetailTask.activityStep){
                            var taskDetailItemData={};
                            taskDetailItemData["taskName"]= participantDetailTask.activityStepName;
                            taskDetailItemData["activityName"]= participantDetailTask.activityType;
                            taskDetailItemData["activityId"]= participantDetailTask.activityStep.activityId;
                            taskDetailItemData["taskDescription"]= participantDetailTask.stepDescription;
                            taskDetailItemData["taskDueDate"]=new Date(participantDetailTask.dueDate);
                            if(participantDetailTask.activityStep.relatedRole){
                                taskDetailItemData["taskRole"]= participantDetailTask.activityStep.relatedRole.displayName;
                                taskDetailItemData["taskRoleID"]=participantDetailTask.activityStep.relatedRole.roleName;
                            }
                            taskDetailItemData["taskDueStatus"]=participantDetailTask.dueStatus;
                            taskDetailItemData["taskResponse"]=participantDetailTask.activityStep.stepResponse;
                            var taskDataFields=[];
                            var taskDataDetailInfo=participantDetailTask.activityStep.activityDataFieldValueList.activityDataFieldValueList;
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
                                    propertyValue["writable"]=true;
                                    propertyValue["readable"]=true;
                                    taskDataFields.push(propertyValue);
                                });
                            }
                            taskDetailItemData["taskDataFields"] = taskDataFields;
                            taskDetailItemData["stepAssignee"] = participantDetailTask.stepAssignee;
                            taskDetailItemData["stepOwner"] = participantDetailTask.stepOwner;
                            taskDetailItemData["hasChildActivityStep"] = participantDetailTask.activityStep.hasChildActivityStep;
                            taskDetailItemData["hasParentActivityStep"] = participantDetailTask.activityStep.hasParentActivityStep;
                            var currentTaskItem=new vfbam.userclient.components.taskCenter.widget.myTasksList.MyTaskMagazineViewItemWidget(
                                {taskStatus:true,taskItemData:taskDetailItemData});
                            if(isOdd){
                                domClass.add(currentTaskItem.domNode, "app_magazineView_item_odd");
                            }else{
                                domClass.add(currentTaskItem.domNode, "app_magazineView_item_even");
                            }
                            isOdd=!isOdd;
                            that.myTaskMagazineViewItemListContainer.appendChild(currentTaskItem.domNode);
                            that.taskItemsArray.push(currentTaskItem);
                        }
                    });
                }
                if(that.containerInitFinishCounterFuc){
                    that.containerInitFinishCounterFuc();
                }
                UI.showToasterMessage({type:"success",message:"获取到"+totalNumber+"项任务"});
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        _cleanDirtyItemData:function(){
            dojo.empty(this.myTaskMagazineViewItemListContainer);
            dojo.forEach(this.taskItemsArray,function(messageItem){
                messageItem.destroy();
            });
            this.messageItemsArray=[];
        },
        refreshUpdatedTaskData:function(eventData){
            if(eventData.taskItemData.stepAssignee){
                dojo.forEach(this.taskItemsArray,function(taskItemWidget){
                    var currentTaskItemData= taskItemWidget.getTaskItemData();
                    if(currentTaskItemData.activityId==eventData.taskItemData.activityId&currentTaskItemData.taskName==eventData.taskItemData.taskName){
                        taskItemWidget.updateModifiedData(eventData.updatedTaskData);
                        return;
                    }
                });
            }
        },
        reloadTaskList:function(eventData){
            this._loadTaskItems();
        },
        menualRefreshTaskList:function(){
            UI.showProgressDialog("获取任务");
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                UI.hideProgressDialog();
                timer.stop();
            };
            timer.start();
            this._loadTaskItems();
        },
        _endOfCode: function(){}
    });
});