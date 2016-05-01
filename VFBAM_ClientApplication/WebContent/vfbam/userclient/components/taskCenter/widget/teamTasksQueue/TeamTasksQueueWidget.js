require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/taskCenter/widget/teamTasksQueue/template/TeamTasksQueueWidget.html",
    "dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.components.taskCenter.widget.teamTasksQueue.TeamTasksQueueWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        toolsDockChangeHandler:null,
        reloadRoleQueueTaskListHandler:null,
        taskDataUpdateHandler:null,
        application_operationPanelContainer:null,
        teamTaskQueueGridList:null,
        teamTaskQueueGridMap:null,
        teamTaskQueue_RolesMap:null,
        postCreate: function(){
        	var that=this;
            var timer = new dojox.timing.Timer(1500);
            timer.onTick = function(){
            	that.initTeamTaskQueueGridsContainer(that);
                timer.stop();
            };
            timer.start();
            this.toolsDockChangeHandler= Application.MessageUtil.listenToMessageTopic(APP_TASKCENTER_TOOLSDOCKCHANGE_EVENT,dojo.hitch(this, "handleSizeChange"));
            this.reloadRoleQueueTaskListHandler= Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,dojo.hitch(this, "reloadSingleRoleQueue"));
            this.taskDataUpdateHandler=Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_TASKDATAUPDATED_EVENT,dojo.hitch(this,"refreshUpdatedTaskData"));
        },
        initTeamTaskQueueGridsContainer:function(context){
        	console.log("TeamTasksQueueWidget created");
            var contentBox = domGeom.getContentBox(dojo.byId("app_taskCenter_mainContainer"));
            var realHeight=contentBox.h-52;
            var currentHeightStyle=""+realHeight +"px";
            var styletxt="height:"+currentHeightStyle+"; width: 99%;";
            context.application_operationPanelContainer = new idx.layout.MoveableTabContainer({
                style:styletxt
            });
            context.application_operationPanelContainer.placeAt(context.teamTaskQueueGridsContainerNode);
            context.application_operationPanelContainer.startup();
            context.teamTaskQueueGridList=[];
            context.teamTaskQueueGridMap={};
            context.teamTaskQueue_RolesMap={};
            context.renderTeamTaskQueues();
        },
        handleSizeChange:function(){
            this.application_operationPanelContainer.resize();
            dojo.forEach (this.teamTaskQueueGridList,function(grid){
                grid.handleSizeChange();
            });
        },
        renderTeamTaskQueues:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=ACTIVITY_SERVICE_ROOT+"participantRelatedRoleQueuesDetail/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
            	if(data){
                    dojo.forEach(data,function(currentRoleQueueData){
                        var currentQueueDisplayName=currentRoleQueueData.displayName;
                        var currentQueueName=currentRoleQueueData.queueName;
                        that.teamTaskQueue_RolesMap[currentQueueName]=currentRoleQueueData.relatedRoles;
                        var currentTeamTaskQueueGrid=vfbam.userclient.components.taskCenter.widget.teamTasksQueue.SingleTeamTaskQueueWidget({
                            taskQueueData:currentRoleQueueData
                        });
                        that.teamTaskQueueGridList.push(currentTeamTaskQueueGrid);
                        that.teamTaskQueueGridMap[currentQueueName]=currentTeamTaskQueueGrid;
                        var currentContentPane = new dijit.layout.ContentPane({
                            title: currentQueueDisplayName,
                            closable:false,
                            style:"width:100%",
                            content: currentTeamTaskQueueGrid
                        });
                        currentContentPane.set("onShow", function(){
                            currentTeamTaskQueueGrid.handleReloadTaskQueueTab();
                        });
                        that.application_operationPanelContainer.addChild(currentContentPane);
                    });
                    that.application_operationPanelContainer.resize();
                    if(that.containerInitFinishCounterFuc){
                       that.containerInitFinishCounterFuc();
                    }
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        refreshQueuesTaskList:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=ACTIVITY_SERVICE_ROOT+"participantRelatedRoleQueuesDetail/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                if(data){
                    dojo.forEach(data,function(currentRoleQueueData){
                        var currentQueueName=currentRoleQueueData.queueName;
                        that.teamTaskQueueGridMap[currentQueueName].refreshQueueTaskData(currentRoleQueueData);
                    });
                    var timer = new dojox.timing.Timer(300);
                    timer.onTick = function(){
                        UI.hideProgressDialog();
                        timer.stop();
                    };
                    timer.start();
                }
            };
            UI.showProgressDialog("获取任务");
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        reloadSingleRoleQueue:function(eventPayLoad){
            var reloadRoleName=eventPayLoad.taskData.taskRoleID;
            var that=this;
            for(var roleQueueName in this.teamTaskQueue_RolesMap){
                if(typeof( this.teamTaskQueue_RolesMap[roleQueueName])=="function"){
                }else{
                    var queueRoleMapping=this.teamTaskQueue_RolesMap[roleQueueName];
                    dojo.forEach(queueRoleMapping,function(roleInfoObj){
                        if(reloadRoleName==roleInfoObj.roleName){
                            console.log("reload roleQueue"+roleQueueName);
                            var resturl=ACTIVITY_SERVICE_ROOT+"roleQueuesDetail/"+APPLICATION_ID+"/"+roleQueueName+"/";
                            var errorCallback= function(data){
                                UI.showSystemErrorMessage(data);
                            };
                            var loadCallback=function(data){
                                if(data){
                                    that.teamTaskQueueGridMap[roleQueueName].refreshQueueTaskData(data);
                                }
                            };
                            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
                        }
                    });
                }
            }
        },
        refreshUpdatedTaskData:function(eventPayLoad){
            if(!eventPayLoad.taskItemData.stepAssignee){
                var reloadSingleQueueDataObj={};
                reloadSingleQueueDataObj.taskData={};
                reloadSingleQueueDataObj.taskData.taskRoleID=eventPayLoad.taskItemData.taskRoleID;
                this.reloadSingleRoleQueue(reloadSingleQueueDataObj);
            }
        },
        autoRefreshQueuesTaskList:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=ACTIVITY_SERVICE_ROOT+"participantRelatedRoleQueuesDetail/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                console.log("Error occurred during auto refresh team tasks queue data");
            };
            var that=this;
            var loadCallback=function(data){
                if(data){
                    dojo.forEach(data,function(currentRoleQueueData){
                        var currentQueueName=currentRoleQueueData.queueName;
                        that.teamTaskQueueGridMap[currentQueueName].refreshQueueTaskData(currentRoleQueueData);
                    });
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        _endOfCode: function(){}
    });
});