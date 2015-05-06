require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskToolbar/template/ChildTaskListWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.basicTaskToolbar.ChildTaskListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        childTaskItemsArray:null,
        postCreate: function(){
            this.childTaskItemsArray=[];
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
            var that=this;
            if(allChildStepsFinished){
                dojo.style(this.allTasksFinishedPrompt,"display","");
                that.taskToolbar._enableResponseButtons();
                that.taskToolbar._hideResponseButtonsStatusControl();
            }else{
                dojo.style(this.allTasksNotFinishedPrompt,"display","");
            }
            var that=this;
            dojo.forEach(childActivitySteps,function(childActivityStep){
                var currentChildTaskItem=new vfbam.userclient.common.UI.components.basicTaskToolbar.ChildTaskItemDetailInfoWidget({taskItemInfo:childActivityStep});
                that.childTaskItemsArray.push(currentChildTaskItem);
                that.childTaskListContainer.appendChild(currentChildTaskItem.domNode);
            });
        },
        destroy:function(){
            dojo.forEach(this.childTaskItemsArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});