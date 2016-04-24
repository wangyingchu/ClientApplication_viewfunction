require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/SingleRoleParticipantListWidget.html","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.common.UI.components.participantsList.SingleRoleParticipantListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentRoleParticipantsArray:null,
        postCreate: function(){
            this.currentRoleParticipantsArray=[];
            this.roleNameLabel.innerHTML=  this.roleDisplayName;
            this.getRoleParticipantsList();
        },
        getRoleParticipantsList:function(){
            var resturl=USERMANAGEMENTSERVICE_ROOT+"participantsDetailOfRole/"+APPLICATION_ID+"/"+this.roleName+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(roleParticipantsList){
                var participantsListArray=[];
                dojo.forEach(roleParticipantsList,function(participantInfo){
                    if(participantInfo){
                        var currentParticipant={};
                        currentParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ participantInfo.userId;
                        currentParticipant.participantName=participantInfo.displayName;
                        currentParticipant.participantId=participantInfo.userId;
                        currentParticipant.participantTitle=participantInfo.title;
                        currentParticipant.participantDesc=participantInfo.description;
                        currentParticipant.participantAddress=participantInfo.address;
                        currentParticipant.participantPhone=participantInfo.fixedPhone;
                        currentParticipant.participantEmail=participantInfo.emailAddress;
                        participantsListArray.push(currentParticipant);
                    }
                },this);
                for(i=0;i<participantsListArray.length;i++){
                    var currentParticipant= participantsListArray[i];
                    var currentParticipantInfoWidget=new vfbam.userclient.common.UI.components.participantsList.ParticipantInfoWidget({participantInfo:currentParticipant,selectParticipantCallBack:that.selectParticipantCallBack});
                    that.currentRoleParticipantsArray.push(currentParticipantInfoWidget);
                    that.participantsListContainer.appendChild(currentParticipantInfoWidget.domNode);
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        destroy:function(){
            dojo.forEach(this.currentRoleParticipantsArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});