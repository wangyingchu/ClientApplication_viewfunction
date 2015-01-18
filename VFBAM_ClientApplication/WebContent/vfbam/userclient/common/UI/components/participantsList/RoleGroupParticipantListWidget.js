require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/RoleGroupParticipantListWidget.html","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.common.UI.components.participantsList.RoleGroupParticipantListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentRoleParticipantsArray:null,
        toolbarHeight:null,
        globalParticipantsSearchMenuDialog:null,
        globalParticipantsSearchWidget:null,
        postCreate: function(){
            this.currentRoleParticipantsArray=[];
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
            this.globalParticipantsSearchMenuDialog=new idx.widget.MenuDialog({});
            this.globalParticipantsSearchWidget=new vfbam.userclient.common.UI.components.participantsList.GlobalParticipantsSearchWidget({
                popupDialog:this.globalParticipantsSearchMenuDialog});
            dojo.place(this.globalParticipantsSearchWidget.domNode, this.globalParticipantsSearchMenuDialog.containerNode);
            this.participantSearchLabel.set("label"," 查找同事");
            this.participantSearchLabel.set("dropDown",this.globalParticipantsSearchMenuDialog);
        },
        getParticipantsList:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=USERMANAGEMENTSERVICE_ROOT+"roleColleaguesOfUser/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                dojo.forEach(data,function(roleParticipantsInfo){
                    //var roleName=roleParticipantsInfo.roleName;
                    var roleDisplayName=roleParticipantsInfo.roleDisplayName;
                    var roleParticipantsList=roleParticipantsInfo.roleParticipants.participantDetailInfoVOsList;
                    var currentRoleParticipantsContainer=new vfbam.userclient.common.UI.widgets.NestedContentContainer({title:roleDisplayName});
                    that.participantsListContainer.appendChild(currentRoleParticipantsContainer.domNode);
                    that.currentRoleParticipantsArray.push(currentRoleParticipantsContainer);
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
                        var currentParticipantInfoWidget=new vfbam.userclient.common.UI.components.participantsList.ParticipantInfoWidget({participantInfo:currentParticipant});
                        currentRoleParticipantsContainer.addChildItem(currentParticipantInfoWidget);
                    }
                });
                if(that.containerInitFinishCounterFuc){
                    that.containerInitFinishCounterFuc();
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        destroy:function(){
            dojo.forEach(this.currentRoleParticipantsArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.globalParticipantsSearchMenuDialog.destroy();
            this.globalParticipantsSearchWidget.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});