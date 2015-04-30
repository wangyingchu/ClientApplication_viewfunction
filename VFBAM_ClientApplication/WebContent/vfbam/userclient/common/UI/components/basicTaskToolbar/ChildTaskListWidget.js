require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskToolbar/template/ChildTaskListWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.basicTaskToolbar.ChildTaskListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.loadChildTasksList();
        },
        loadChildTasksList:function(){
            var queryChildTasksData={};
            queryChildTasksData.activitySpaceName=APPLICATION_ID;
            queryChildTasksData.activityType=this.parentTaskItemData.activityName;
            queryChildTasksData.activityStepName=this.parentTaskItemData.taskName;
            queryChildTasksData.activityId=this.parentTaskItemData.activityId;
            queryChildTasksData.currentStepOwner=this.parentTaskItemData.stepAssignee;
            var queryChildTasksDataContent=dojo.toJson(queryChildTasksData);
            var resturl=ACTIVITY_SERVICE_ROOT+"childTasksInfo/";
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
                UI.showToasterMessage({type:"success",message:"查询子任务成功"});
                that.renderChildTasksInfo(data);
            };
            UI.showProgressDialog("查询子任务");
            Application.WebServiceUtil.postJSONData(resturl,queryChildTasksDataContent,loadCallback,errorCallback);
        },
        renderChildTasksInfo:function(childTasksInfo){
            var allChildStepsFinished=childTasksInfo.allChildStepsFinished;
            var childActivitySteps=childTasksInfo.childActivitySteps;
            this.childTasksNumberLabel.innerHTML=childActivitySteps.length;
            if(allChildStepsFinished){
                dojo.style(this.allTasksFinishedPrompt,"display","");
            }else{
                dojo.style(this.allTasksNotFinishedPrompt,"display","");
            }
        },
        _endOfCode: function(){}
    });
});