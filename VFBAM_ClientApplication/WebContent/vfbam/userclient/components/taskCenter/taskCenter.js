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
var subComponentInitCounter=0;
var initFinishCounter=function(){
    subComponentInitCounter++;
    if(subComponentInitCounter==4){
        UI.hideProgressDialog();
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
    {containerElementId:"app_taskCenter_mainContainer",reservationHeight:45,containerInitFinishCounterFuc:initFinishCounter},"app_taskCenter_helpWidget_participantList");

var myDocumentList=new vfbam.userclient.common.UI.components.documentsList.DocumentsListWidget(
    {containerElementId:"app_taskCenter_mainContainer",reservationHeight:45,containerInitFinishCounterFuc:initFinishCounter,documentsOwnerType:"PARTICIPANT"},"app_taskCenter_helpWidget_documentList");
var myTaskListWidget=new vfbam.userclient.components.taskCenter.widget.myTasksList.MyTaskListWidget({region:"left",containerInitFinishCounterFuc:initFinishCounter},"app_taskCenter_myTasksContainer");
var teamTasksQueueWidget=new vfbam.userclient.components.taskCenter.widget.teamTasksQueue.TeamTasksQueueWidget({region:"center",containerInitFinishCounterFuc:initFinishCounter},"app_taskCenter_teamTasksQueueContainer");
dojo.style(myDocumentList.domNode,{"display": "none"});

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