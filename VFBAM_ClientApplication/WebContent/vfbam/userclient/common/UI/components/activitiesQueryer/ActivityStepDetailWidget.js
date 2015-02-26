require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/ActivityStepDetailWidget.html",
    "dojo/dom-class","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domClass,Dialog){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.ActivityStepDetailWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        stepAssigneeNarticipantNamecardWidget:null,
        stepOwnerNarticipantNamecardWidget:null,
        postCreate: function(){
            this.stepNameTxt.innerHTML=this.activityStepData.activityStepName;
            /*
            if(this.activityStepData.dueStatus=="OVERDUE"){
                this.stepDueStatusTxt.innerHTML="<span style='color: #CE0000;'><i class='icon-warning-sign' ></i> 已逾期</span>";
            }
            if(this.activityStepData.dueStatus=="DUETODAY"){
                this.stepDueStatusTxt.innerHTML="<span style='color: #FAC126;'><i class='icon-time'></i> 今日到期</span>";
            }
            if(this.activityStepData.dueStatus=="DUETHISWEEK"){
                this.stepDueStatusTxt.innerHTML="<span style='color: #666666;'><i class='icon-calendar'></i> 本周到期</span>";
            }
            if(this.activityStepData.dueStatus=="NODEU"){
                this.stepDueStatusTxt.innerHTML="<span style='color: #26A251;'><i class='icon-inbox'></i> 非紧急任务</span>";
            }
            */
            if(this.activityStepData.stepAssigneeParticipant){
                var participantInfo=this.activityStepData.stepAssigneeParticipant;
                var currentAssigneeParticipant={};
                currentAssigneeParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ participantInfo.userId;
                currentAssigneeParticipant.participantName=participantInfo.displayName;
                currentAssigneeParticipant.participantId=participantInfo.userId;
                currentAssigneeParticipant.participantTitle=participantInfo.title;
                currentAssigneeParticipant.participantDesc=participantInfo.description;
                currentAssigneeParticipant.participantAddress=participantInfo.address;
                currentAssigneeParticipant.participantPhone=participantInfo.fixedPhone;
                currentAssigneeParticipant.participantEmail=participantInfo.emailAddress;
                this.stepAssigneeNarticipantNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:currentAssigneeParticipant});
                this.stepAssignerNameLabel.set("label",currentAssigneeParticipant.participantName);
                this.stepAssignerNameLabel.set("dropDown",this.stepAssigneeNarticipantNamecardWidget);
            }else{
                dojo.style(this.stepAssignerNameLabel,"display","none");
                dojo.style(this.noneAssigneeLabelContainer,"display","");
            }

            if(this.activityStepData.stepOwnerParticipant){
                var participantInfo=this.activityStepData.stepOwnerParticipant;
                var currentOwnerParticipant={};
                currentOwnerParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ participantInfo.userId;
                currentOwnerParticipant.participantName=participantInfo.displayName;
                currentOwnerParticipant.participantId=participantInfo.userId;
                currentOwnerParticipant.participantTitle=participantInfo.title;
                currentOwnerParticipant.participantDesc=participantInfo.description;
                currentOwnerParticipant.participantAddress=participantInfo.address;
                currentOwnerParticipant.participantPhone=participantInfo.fixedPhone;
                currentOwnerParticipant.participantEmail=participantInfo.emailAddress;
                this.stepOwnerNarticipantNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:currentOwnerParticipant});
                this.stepOwnerNameLabel.set("label",currentOwnerParticipant.participantName);
                this.stepOwnerNameLabel.set("dropDown",this.stepOwnerNarticipantNamecardWidget);
            }else{
                dojo.style(this.stepOwnerTxtContainer,"display","none");
            }

            if(this.activityStepData.relatedRole){
                this.stepRoleRoleTxt.innerHTML=this.activityStepData.relatedRole.displayName;
            }else{
                dojo.style(this.stepRoleTxtContainer,"display","none");
            }
            var stepStartDateStr=dojo.date.locale.format(new Date(this.activityStepData.createTime));
            this.startDateTxt.innerHTML = stepStartDateStr;
            if(this.activityStepData.finishTime>0){
                var stepDueDateStr=dojo.date.locale.format(new Date(this.activityStepData.createTime));
                this.dueDateTxt.innerHTML = stepDueDateStr;
            }else{
                this.dueDateTxt.innerHTML = "未完成";
            }
        },
        destroy:function(){
            if(this.stepAssigneeNarticipantNamecardWidget){
                this.stepAssigneeNarticipantNamecardWidget.destroy();
            }
            if(this.stepOwnerNarticipantNamecardWidget){
                this.stepOwnerNarticipantNamecardWidget.destroy();
            }
            if(this.stepAssignerNameLabel){
                this.stepAssignerNameLabel.destroy();
            }
            if(this.stepOwnerNameLabel){
                this.stepOwnerNameLabel.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});