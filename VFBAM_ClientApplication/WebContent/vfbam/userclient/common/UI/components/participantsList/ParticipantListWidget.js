require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/ParticipantListWidget.html","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.common.UI.components.participantsList.ParticipantListWidget", [_Widget, _Templated], {
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
        getParticipantsList:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=USERMANAGEMENTSERVICE_ROOT+"colleaguesOfUser/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                if(data.participantDetailInfoVOsList){
                    var participantsListArray=[];
                    dojo.forEach(data.participantDetailInfoVOsList,function(participantInfo){
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
                    that.renderParticipantsList(participantsListArray);
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        renderParticipantsList:function(participantList){
            dojo.empty(this.participantsListContainer);
            for(x=0;x<this.currentParticipantsArray.length;i++){
                this.currentParticipantsArray[x].destroy();
            }
            for(i=0;i<participantList.length;i++){
                var currentParticipant= participantList[i];
                var currentParticipantInfoWidget=new vfbam.userclient.common.UI.components.participantsList.ParticipantInfoWidget({participantInfo:currentParticipant});
                this.currentParticipantsArray.push(currentParticipantInfoWidget);
                this.participantsListContainer.appendChild(currentParticipantInfoWidget.domNode);
            }
            if(this.containerInitFinishCounterFuc){
                this.containerInitFinishCounterFuc();
            }
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