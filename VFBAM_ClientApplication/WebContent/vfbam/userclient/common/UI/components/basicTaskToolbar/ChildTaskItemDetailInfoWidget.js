require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskToolbar/template/ChildTaskItemDetailInfoWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.basicTaskToolbar.ChildTaskItemDetailInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        participantNamecardWidget:null,
        menu_assigneeOperationCollection:null,
        assigneeOperationsDropdownButton:null,
        menu_dueDateOperationCollection:null,
        dueDateOperationsDropdownButton:null,
        postCreate: function(){
            if(this.taskItemInfo.dueStatus=="NODEU"){
                this.taskStatusIcon.innerHTML="<i class='icon-inbox icon-large' style='padding-right: 5px;color: #26A251'></i>";
            }
            if(this.taskItemInfo.dueStatus==null){
                this.taskStatusIcon.innerHTML="<i class='icon-inbox icon-large' style='padding-right: 5px;color: #26A251'></i>";
            }
            if(this.taskItemInfo.dueStatus=="OVERDUE"){
                this.taskStatusIcon.innerHTML="<i class='icon-warning-sign icon-large' style='padding-right: 5px;color: #CE0000'></i>";
            }
            if(this.taskItemInfo.dueStatus=="DUETODAY"){
                this.taskStatusIcon.innerHTML="<i class='icon-time icon-large' style='padding-right: 5px;color: #FAC126'></i>";
            }
            if(this.taskItemInfo.dueStatus=="DUETHISWEEK"){
                this.taskStatusIcon.innerHTML="<i class='icon-calendar icon-large' style='padding-right: 5px;color: #666666'></i>";
            }
            var taskAssigneeParticipant=this.taskItemInfo.stepAssigneeParticipant;
            var currentActivityAssigneeInfo={};
            currentActivityAssigneeInfo.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ taskAssigneeParticipant.userId;
            currentActivityAssigneeInfo.participantName=taskAssigneeParticipant.displayName;
            currentActivityAssigneeInfo.participantId=taskAssigneeParticipant.userId;
            currentActivityAssigneeInfo.participantTitle=taskAssigneeParticipant.title;
            currentActivityAssigneeInfo.participantDesc=taskAssigneeParticipant.description;
            currentActivityAssigneeInfo.participantAddress=taskAssigneeParticipant.address;
            currentActivityAssigneeInfo.participantPhone=taskAssigneeParticipant.fixedPhone;
            currentActivityAssigneeInfo.participantEmail=taskAssigneeParticipant.emailAddress;
            this.participantPhoto.src=currentActivityAssigneeInfo.participantPhotoPath;
            this.participantTitleLabel.innerHTML =currentActivityAssigneeInfo.participantTitle;
            this.participantNamecardWidget=
                new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfoWidget:this,participantInfo:currentActivityAssigneeInfo});
            this.participantNameLabel.set("label",currentActivityAssigneeInfo.participantName);
            this.participantNameLabel.set("dropDown",this.participantNamecardWidget);

            var finishTime=this.taskItemInfo.finishTime;
            if(finishTime==0) {
                this.menu_assigneeOperationCollection = new dijit.DropDownMenu({style: "display: none;"});
                var label = "<i style='color:#777777;' class='icon-caret-down icon-large'></i>";
                this.assigneeOperationsDropdownButton = new vfbam.userclient.common.UI.widgets.TextDropdownButton({
                    label: label,
                    dropDown: this.menu_assigneeOperationCollection
                }, this.taskAssigneeOperationLink);
                var reassignTaskOperationCallback = function () {
                };
                var menuItem_reassign = new dijit.MenuItem({
                    label: "<i class='icon-male'></i> 重新分配处理人",
                    onClick: function () {
                    }
                });
                this.menu_assigneeOperationCollection.addChild(menuItem_reassign);
            }

            this.childTaskNameLabel.innerHTML=this.taskItemInfo.activityStepName;

            var startDate=this.taskItemInfo.createTime;
            var startDateStr=dojo.date.locale.format(new Date(startDate));
            this.startDateLabel.innerHTML=startDateStr;

            if(finishTime==0){
                this.finishDateLabel.innerHTML="未完成";
            }else{
                dojo.style(this.taskFinishedPrompt,"display","");
                var finishDateStr=dojo.date.locale.format(new Date(finishTime));
                this.finishDateLabel.innerHTML=finishDateStr;
            }
            var dueDate=this.taskItemInfo.dueDate;
            if(dueDate!=0){
                var dueDateDateStr=dojo.date.locale.format(new Date(dueDate));
                this.dueDateLabel.innerHTML=dueDateDateStr;
            }else{
                this.dueDateLabel.innerHTML="未指定";
            }
            if(finishTime==0){
                this.menu_dueDateOperationCollection=new dijit.DropDownMenu({ style: "display: none;"});
                var label="<i style='color:#777777;' class='icon-caret-down icon-large'></i>";
                this.dueDateOperationsDropdownButton=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:label,dropDown: this.menu_dueDateOperationCollection},this.taskDueDateOperationLink);
                var taskDueDateOperationCallback = function () {
                };
                var menuItem_setDueDate = new dijit.MenuItem({
                    label: "<i class='icon-time'></i> 重设截止时间",
                    onClick: function () {
                    }
                });
                this.menu_dueDateOperationCollection.addChild(menuItem_setDueDate);
                var menuItem_deleteDueDate = new dijit.MenuItem({
                    label: "<i class='icon-trash'></i> 删除截止时间",
                    onClick: function () {
                    }
                });
                this.menu_dueDateOperationCollection.addChild(menuItem_deleteDueDate);
            }
        },
        destroy:function(){
            this.participantNamecardWidget.destroy();
            if(this.menu_assigneeOperationCollection){
                this.menu_assigneeOperationCollection.destroy();
            }
            if(this.assigneeOperationsDropdownButton){
                this.assigneeOperationsDropdownButton.destroy();
            }
            if(this.menu_dueDateOperationCollection){
                this.menu_dueDateOperationCollection.destroy();
            }
            if(this.dueDateOperationsDropdownButton){
                this.dueDateOperationsDropdownButton.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});