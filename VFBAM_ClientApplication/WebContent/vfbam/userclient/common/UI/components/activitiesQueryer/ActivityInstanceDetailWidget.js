require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/ActivityInstanceDetailWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.ActivityInstanceDetailWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentTasksListContainer:null,
        nextTasksListContainer:null,
        finishedTasksListContainer:null,
        currentActivityStepList:null,
        finishedActivityStepList:null,
        starterNarticipantNamecardWidget:null,
        nextStepsInfoWidget:null,
        postCreate: function(){
            var timeStamp=new Date().getTime();
            this.activityTypeTxt.id= "TaskName"+timeStamp;
            this.activityTypeDescTxtPopup.set("connectId",this.activityTypeTxt.id);
            this.activityTypeDescTxtPopup.set("label",this.activityInstanceData.activityTypeDefinition.activityTypeDesc);
            this.activityTypeTxt.innerHTML = this.activityInstanceData.activityTypeDefinition.activityType;
            this.activityIdTxt.innerHTML = this.activityInstanceData.activityId;
            if(this.activityInstanceData.activityStartUserParticipant){
                var participantInfo=this.activityInstanceData.activityStartUserParticipant;
                var currentParticipant={};
                currentParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ participantInfo.userId;
                currentParticipant.participantName=participantInfo.displayName;
                currentParticipant.participantId=participantInfo.userId;
                currentParticipant.participantTitle=participantInfo.title;
                currentParticipant.participantDesc=participantInfo.description;
                currentParticipant.participantAddress=participantInfo.address;
                currentParticipant.participantPhone=participantInfo.fixedPhone;
                currentParticipant.participantEmail=participantInfo.emailAddress;
                this.starterNarticipantNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:currentParticipant});
                this.activityStarterParticipantNameLabel.set("label",currentParticipant.participantName);
                this.activityStarterParticipantNameLabel.set("dropDown",this.starterNarticipantNamecardWidget);
            }

            var activityLaunchDate= new Date(this.activityInstanceData.activityStartTime);
            var launchDateStr=dojo.date.locale.format(activityLaunchDate);
            this.activityLaunchDateTxt.innerHTML = launchDateStr;

            if(this.activityInstanceData.isFinished){
                dojo.style(this.activityFinishedTxt,"display","");
                dojo.style(this.finishedActivityTimePropertiesContainer,"display","");
                var activityFinishDate= new Date(this.activityInstanceData.activityEndTime);
                var finishDateStr=dojo.date.locale.format(activityFinishDate);
                this.activityFinishDateTxt.innerHTML = finishDateStr;

                var timeCostResult=this.calcTimeCost(this.activityInstanceData.activityDuration);
                var activityDuration="";
                if(timeCostResult.dayCost>0){
                    activityDuration=activityDuration+timeCostResult.dayCost+"天 ";
                }if(timeCostResult.hourCost>0){
                    activityDuration=activityDuration+timeCostResult.hourCost+"小时 ";
                }if(timeCostResult.minuteCost>0){
                    activityDuration=activityDuration+timeCostResult.minuteCost+"分钟";
                }
                if(activityDuration==""){
                    this.activityDurationTxt.innerHTML="小于1分钟";
                }else{
                    this.activityDurationTxt.innerHTML=activityDuration;
                }
                dojo.style(this.currentTasksContainer,"display","none");
                dojo.style(this.nextTasksContainer,"display","none");
            }else{
                dojo.style(this.activityGoingTxt,"display","");
                if(this.activityInstanceData.currentActivitySteps.length>0){
                    this.currentTasksListContainer=new vfbam.userclient.common.UI.widgets.NestedContentContainer({title:"当前任务"});
                    this.currentTasksContainer.appendChild(this.currentTasksListContainer.domNode);
                    this.currentActivityStepList=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityStepListWidget({activityStepsData:this.activityInstanceData.currentActivitySteps});
                    this.currentTasksListContainer.addChildItem(this.currentActivityStepList);
                }else{
                    dojo.style(this.currentTasksContainer,"display","none");
                }
                if(this.activityInstanceData.nextActivitySteps&&this.activityInstanceData.nextActivitySteps.length>0){
                    this.nextTasksListContainer=new vfbam.userclient.common.UI.widgets.NestedContentContainer({title:"后续任务"});
                    this.nextTasksContainer.appendChild(this.nextTasksListContainer.domNode);
                    this.nextStepsInfoWidget=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityNextStepsInfoWidget({nextActivityStepsData:this.activityInstanceData.nextActivitySteps});
                    this.nextTasksListContainer.addChildItem(this.nextStepsInfoWidget);
                }else{
                    dojo.style(this.nextTasksContainer,"display","none");
                }
            }
            if(this.activityInstanceData.finishedActivitySteps.length>0){
                this.finishedTasksListContainer=new vfbam.userclient.common.UI.widgets.NestedContentContainer({title:"已完成任务"});
                this.finishedTasksContainer.appendChild(this.finishedTasksListContainer.domNode);
                this.finishedActivityStepList=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityStepListWidget({activityStepsData:this.activityInstanceData.finishedActivitySteps});
                this.finishedTasksListContainer.addChildItem(this.finishedActivityStepList);
            }else{
                dojo.style(this.finishedTasksContainer,"display","none");
            }
        },
        calcTimeCost:function(costInLong){
            var dayCost=Math.floor( costInLong / (1000*3600*24));
            var remainLongCostForHour=costInLong-dayCost*(1000*3600*24);
            var hourCost=Math.floor( remainLongCostForHour / (1000*3600));
            var remainLongCostForMinute=remainLongCostForHour-hourCost*(1000*3600);
            var minuteCost=Math.floor( remainLongCostForMinute / (1000*60));
            var timeCostResult={};
            timeCostResult["dayCost"]=dayCost;
            timeCostResult["hourCost"]=hourCost;
            timeCostResult["minuteCost"]=minuteCost;
            return timeCostResult;
        },
        destroy:function(){
            if(this.currentTasksListContainer){
                this.currentTasksListContainer.destroy();
            }
            if(this.nextTasksListContainer){
                this.nextTasksListContainer.destroy();
            }
            if(this.finishedTasksListContainer){
                this.finishedTasksListContainer.destroy();
            }
            if(this.currentActivityStepList){
                this.currentActivityStepList.destroy();
            }
            if(this.finishedActivityStepList){
                this.finishedActivityStepList.destroy();
            }
            if(this.starterNarticipantNamecardWidget){
                this.starterNarticipantNamecardWidget.destroy();
            }
            if(this.activityStarterParticipantNameLabel){
                this.activityStarterParticipantNameLabel.destroy();
            }
            if(this.nextStepsInfoWidget){
                this.nextStepsInfoWidget.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});