//business logic
var APP_TASKCENTER_TOOLSDOCKCHANGE_EVENT="APP_TASKCENTER_TOOLSDOCKCHANGE_EVENT";
function onToolsDockClose(region) {
    Application.MessageUtil.publishMessage(APP_TASKCENTER_TOOLSDOCKCHANGE_EVENT);
}
function onToolsDockOpen (region) {
    Application.MessageUtil.publishMessage(APP_TASKCENTER_TOOLSDOCKCHANGE_EVENT);
}
function onToolsDockResize(region){
    Application.MessageUtil.publishMessage(APP_TASKCENTER_TOOLSDOCKCHANGE_EVENT);
}
function showParticipentList(){
    dijit.byId("app_taskCenter_helpWidgetSwitcher").set("label","我的同事");
    dojo.style(myTeamParticipantList.domNode,{"display": ""});
    dojo.style(myDocumentList.domNode,{"display": "none"});
}
function showDocumentList(){
    dijit.byId("app_taskCenter_helpWidgetSwitcher").set("label","我的文档");
    dojo.style(myTeamParticipantList.domNode,{"display": "none"});
    dojo.style(myDocumentList.domNode,{"display": ""});
}
UI.showProgressDialog("查询数据");
var taskCenterSubComponentInitCounter=0;
var initTaskCenterFinishCounter=function(){
    taskCenterSubComponentInitCounter=taskCenterSubComponentInitCounter+1;
    //when taskCenterSubComponentInitCounter is 4,all sub components finished init.
    if(taskCenterSubComponentInitCounter==4){
        UI.hideProgressDialog();
        autoRefreshTaskCenterData();
    }
};
var activityLauncher=new vfbam.userclient.common.UI.components.activityLauncher.ActivityLauncherWidget({},"app_taskCenter_activityLauncherContainer");
var activityQueryer=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivitiesQueryerWidget({},"app_taskCenter_queryActivityContainer");

//Simple Participant List
/*
var myTeamParticipantList=new vfbam.userclient.common.UI.components.participantsList.ParticipantListWidget(
    {containerElementId:"app_taskCenter_mainContainer",reservationHeight:45,containerInitFinishCounterFuc:initFinishCounter},"app_taskCenter_helpWidget_participantList");
*/
//Role Group Participant List
var myTeamParticipantList=new vfbam.userclient.common.UI.components.participantsList.RoleGroupParticipantListWidget(
    {containerElementId:"app_taskCenter_mainContainer",reservationHeight:45,containerInitFinishCounterFuc:initTaskCenterFinishCounter},"app_taskCenter_helpWidget_participantList");

var myDocumentList=new vfbam.userclient.common.UI.components.documentsList.DocumentsListWidget(
    {containerElementId:"app_taskCenter_mainContainer",reservationHeight:45,containerInitFinishCounterFuc:initTaskCenterFinishCounter,documentsOwnerType:"PARTICIPANT"},"app_taskCenter_helpWidget_documentList");
var myTaskListWidget=new vfbam.userclient.components.taskCenter.widget.myTasksList.MyTaskListWidget({region:"left",containerInitFinishCounterFuc:initTaskCenterFinishCounter},"app_taskCenter_myTasksContainer");
var teamTasksQueueWidget=new vfbam.userclient.components.taskCenter.widget.teamTasksQueue.TeamTasksQueueWidget({region:"center",containerInitFinishCounterFuc:initTaskCenterFinishCounter},"app_taskCenter_teamTasksQueueContainer");
dojo.style(myDocumentList.domNode,{"display": "none"});

function autoRefreshTaskCenterData(){
    //auto refresh my tasks list data every 15 minutes
    var autoRefreshMyTaskListTimer = new dojox.timing.Timer(1000*60*15);
    autoRefreshMyTaskListTimer.onTick = function(){
        console.log("==================================");
        console.log("auto refresh my tasks list data");
        console.log("==================================");
        myTaskListWidget.autoRefreshTaskItems()
    };
    autoRefreshMyTaskListTimer.start();
    //auto refresh team tasks queue data every 10 minutes
    var autoRefreshTeamTasksQueueTimer = new dojox.timing.Timer(1000*60*10);
    autoRefreshTeamTasksQueueTimer.onTick = function(){
        console.log("==================================");
        console.log("auto refresh team tasks queue data");
        console.log("==================================");
        teamTasksQueueWidget.autoRefreshQueuesTaskList()
    };
    autoRefreshTeamTasksQueueTimer.start();
}

var isTaskCenterFirstLoad=true;
UI.registerStaticPageLifeCycleHandler("TASK_CENTER","onShow",loadTaskCenterUI);
function loadTaskCenterUI(){
    if(!isTaskCenterFirstLoad){
        Application.MessageUtil.publishMessage(APP_TASKCENTER_TOOLSDOCKCHANGE_EVENT);
        isTaskCenterFirstLoad=false;
    }
}
UI.registerStaticPageLifeCycleHandler("TASK_CENTER","onLoad",initTaskCenterUI);
function initTaskCenterUI(){
    var taskCenterPage=UI.getStaticPageInstance("TASK_CENTER");
    if(taskCenterPage.open){
        isTaskCenterFirstLoad=false;
    }
}
function showComponentConfigDialog(){
    require(["idx/oneui/Dialog"], function(Dialog){
        /*
         var messageEditor=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageEditorWidget(messageData.data);
         */
        var confirmButton=new dijit.form.Button({
            label: "<i class='icon-ok-sign'></i> 确定",
            onClick: function(){
            }
        });
        var applyButton=new dijit.form.Button({
            label: "<i class='icon-ok'></i> 应用",
            onClick: function(){
            }
        });
        var actionButtone=[];
        actionButtone.push(confirmButton);
        actionButtone.push(applyButton);
        var	dialog = new Dialog({
            style:"width:600px;",
            title: "<i class='icon-cog'></i> 我的工作参数设置",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        //dialog.connect(messageEditor, "doCloseContainerDialog", "hide");
        //dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}