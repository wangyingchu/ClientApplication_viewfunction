require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/ActivityInvolveInfoWidget.html","dojo/dom","dijit/popup"
],function(lang,declare, _Widget, _Templated, template,dom,popup,mouse){
    declare("vfbam.userclient.common.UI.components.participantsList.ActivityInvolveInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        participantNamecardWidget:null,
        ownerNamecardWidget:null,
        nameCardShowHideTimer:null,
        postCreate: function(){
            if(this.activityInvolveInfo.isChildActivityStep){
                dojo.style(this.childTaskIndector,"display","");
                dojo.style(this.childTaskDiv,"display","");
                dojo.style(this.normalTaskDiv,"display","none");
            }
            var startTime=this.activityInvolveInfo.startTime;
            var endTime=this.activityInvolveInfo.endTime;
            var assigneeInvolver=this.activityInvolveInfo.assigneeInvolver;
            var initInvolver=this.activityInvolveInfo.initInvolver;
            var initTime=this.activityInvolveInfo.initTime;
            var involveAction=this.activityInvolveInfo.involveAction;
            var ownerInvolver=this.activityInvolveInfo.ownerInvolver;

            var involveActionStr;
            var displayTimeValue;
            if(involveAction=="LAUNCH_ACTIVITY"){
                involveActionStr="启动业务活动";
                displayTimeValue=initTime;
                dojo.style(this.launchTimePrompt,"display","");
            }else{
                if(endTime!=0){
                    dojo.style(this.finishPrompt,"display","");
                    dojo.style(this.finishTimePrompt,"display","");
                    involveActionStr=involveAction;
                    displayTimeValue=endTime;
                }else{
                    dojo.style(this.handelPrompt,"display","");
                    dojo.style(this.startTimePrompt,"display","");
                    involveActionStr=involveAction;
                    displayTimeValue=startTime;
                }
            }
            this.involveActionLabel.innerHTML=involveActionStr;
            var displayStartDateStr=dojo.date.locale.format(new Date(displayTimeValue));
            this.displayDateTxt.innerHTML = displayStartDateStr;
            if(this.activityInvolveInfo.initInvolver){
                this.participantInfo=initInvolver;
            }else{
                this.participantInfo=assigneeInvolver;
            }
            this.participantPhoto.src=this.participantInfo.participantPhotoPath;
            this.participantTitleLabel.innerHTML =this.participantInfo.participantTitle;

            this.participantNamecardWidget=
                new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfoWidget:this,participantInfo:this.participantInfo});
            this.participantNameLabel.set("label",this.participantInfo.participantName);
            this.participantNameLabel.set("dropDown",this.participantNamecardWidget);
            if(ownerInvolver){
                dojo.style(this.ownerNameCardContainer,"display","");
                this.ownerNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfoWidget:this,participantInfo:ownerInvolver});
                var ownerNameLabelTxt='<i class="icon-male"></i> <span style="font-size: 0.8em;">委派人</span>';
                this.ownerNameLabel.set("label",ownerNameLabelTxt);
                this.ownerNameLabel.set("dropDown",this.ownerNamecardWidget);
            }
        },
        destroy:function(){
            this.participantNamecardWidget.destroy();
            if(this.ownerNamecardWidget){
                this.ownerNamecardWidget.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});