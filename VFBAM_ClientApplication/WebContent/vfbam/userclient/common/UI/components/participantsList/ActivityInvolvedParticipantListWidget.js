require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/ActivityInvolvedParticipantListWidget.html","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.common.UI.components.participantsList.ActivityInvolvedParticipantListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentParticipantsArray:null,
        toolbarHeight:null,
        postCreate: function(){
            this.currentParticipantsArray=[];
            this.toolbarHeight=32;
            this.getParticipantsList();
            if(this.containerElementId){
                var contentBox = domGeom.getContentBox(dojo.byId(this.containerElementId));
                var realHeight=contentBox.h;
                realHeight=realHeight-this.toolbarHeight;
                if(this.reservationHeight!=0){
                    realHeight=realHeight-this.reservationHeight;
                }
                var currentHeightStyle=""+realHeight +"px";
                dojo.style(this.participantsListContainer,"height",currentHeightStyle);
            }
        },
        reloadParticipantsList:function(){
            this.getParticipantsList();
        },
        getParticipantsList:function(){
            var activityId=this.taskData.taskItemData.activityId;
            var resturl=ACTIVITY_SERVICE_ROOT+"activityInvolvedParticipants/"+APPLICATION_ID+"/"+activityId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var activityInvolveInfoArray=[];
                dojo.forEach(data,function(activityInvolveInfo){
                    var currentActivityInvolveInfo={};
                    currentActivityInvolveInfo.involveAction=activityInvolveInfo.involveAction;
                    currentActivityInvolveInfo.startTime=activityInvolveInfo.startTime;
                    currentActivityInvolveInfo.endTime=activityInvolveInfo.endTime;
                    currentActivityInvolveInfo.initTime=activityInvolveInfo.initTime;
                    currentActivityInvolveInfo.isChildActivityStep=activityInvolveInfo.isChildActivityStep;
                    if(activityInvolveInfo.initInvolver){
                        currentActivityInvolveInfo.initInvolver={};
                        currentActivityInvolveInfo.initInvolver.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ activityInvolveInfo.initInvolver.userId;
                        currentActivityInvolveInfo.initInvolver.participantName=activityInvolveInfo.initInvolver.displayName;
                        currentActivityInvolveInfo.initInvolver.participantId=activityInvolveInfo.initInvolver.userId;
                        currentActivityInvolveInfo.initInvolver.participantTitle=activityInvolveInfo.initInvolver.title;
                        currentActivityInvolveInfo.initInvolver.participantDesc=activityInvolveInfo.initInvolver.description;
                        currentActivityInvolveInfo.initInvolver.participantAddress=activityInvolveInfo.initInvolver.address;
                        currentActivityInvolveInfo.initInvolver.participantPhone=activityInvolveInfo.initInvolver.fixedPhone;
                        currentActivityInvolveInfo.initInvolver.participantEmail=activityInvolveInfo.initInvolver.emailAddress;
                    }
                    if(activityInvolveInfo.assigneeInvolver){
                        currentActivityInvolveInfo.assigneeInvolver={};
                        currentActivityInvolveInfo.assigneeInvolver.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ activityInvolveInfo.assigneeInvolver.userId;
                        currentActivityInvolveInfo.assigneeInvolver.participantName=activityInvolveInfo.assigneeInvolver.displayName;
                        currentActivityInvolveInfo.assigneeInvolver.participantId=activityInvolveInfo.assigneeInvolver.userId;
                        currentActivityInvolveInfo.assigneeInvolver.participantTitle=activityInvolveInfo.assigneeInvolver.title;
                        currentActivityInvolveInfo.assigneeInvolver.participantDesc=activityInvolveInfo.assigneeInvolver.description;
                        currentActivityInvolveInfo.assigneeInvolver.participantAddress=activityInvolveInfo.assigneeInvolver.address;
                        currentActivityInvolveInfo.assigneeInvolver.participantPhone=activityInvolveInfo.assigneeInvolver.fixedPhone;
                        currentActivityInvolveInfo.assigneeInvolver.participantEmail=activityInvolveInfo.assigneeInvolver.emailAddress;
                    }
                    if(activityInvolveInfo.ownerInvolver){
                        currentActivityInvolveInfo.ownerInvolver={};
                        currentActivityInvolveInfo.ownerInvolver.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ activityInvolveInfo.ownerInvolver.userId;
                        currentActivityInvolveInfo.ownerInvolver.participantName=activityInvolveInfo.ownerInvolver.displayName;
                        currentActivityInvolveInfo.ownerInvolver.participantId=activityInvolveInfo.ownerInvolver.userId;
                        currentActivityInvolveInfo.ownerInvolver.participantTitle=activityInvolveInfo.ownerInvolver.title;
                        currentActivityInvolveInfo.ownerInvolver.participantDesc=activityInvolveInfo.ownerInvolver.description;
                        currentActivityInvolveInfo.ownerInvolver.participantAddress=activityInvolveInfo.ownerInvolver.address;
                        currentActivityInvolveInfo.ownerInvolver.participantPhone=activityInvolveInfo.ownerInvolver.fixedPhone;
                        currentActivityInvolveInfo.ownerInvolver.participantEmail=activityInvolveInfo.ownerInvolver.emailAddress;
                    }
                    activityInvolveInfoArray.push(currentActivityInvolveInfo);
                });
                that.renderParticipantsList(activityInvolveInfoArray);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        renderParticipantsList:function(activityInvolveInfoList){
            var that=this;
            dojo.empty(this.participantsListContainer);
            dojo.forEach(this.currentParticipantsArray,function(currentParticipants){
                currentParticipants.destroy();
            });
            dojo.forEach(activityInvolveInfoList,function(activityInvolveInfo){
                var currentParticipant= activityInvolveInfo;
                var currentParticipantInfoWidget=new vfbam.userclient.common.UI.components.participantsList.ActivityInvolveInfoWidget({activityInvolveInfo:currentParticipant});
                that.currentParticipantsArray.push(currentParticipantInfoWidget);
                that.participantsListContainer.appendChild(currentParticipantInfoWidget.domNode);
            });
        },
        destroy:function(){
            dojo.forEach(this.currentParticipantsArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});