require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/widgets/template/ParticipantSelector.html","dojo/store/Memory"
],function(lang,declare, _Widget, _Templated, template,Memory){
    declare("vfbam.userclient.common.UI.widgets.ParticipantSelector", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        applicationUsersListStore:null,
        postCreate: function(){
            if(this.selectorDescription){
                this.selectorDescriptionLabel.innerHTML=this.selectorDescription;
            }else{
                dojo.style(this.selectorDescriptionLabelContainer,"display","none");
            }
            this.getParticipantsList();
        },
        getSelectedParticipant:function(){
            if(!this.participantsFilter.isValid()){
                UI.showToasterMessage({type:"warning",message:"请填写正确的人员名称"});
                return;
            }
            var selectedValue=this.participantsFilter.displayedValue;
            if(selectedValue==""){
                UI.showToasterMessage({type:"warning",message:"请选择人员"});
                return;
            }
            var selectedParticipantObj=this.applicationUsersListStore.query({userSelectKey:selectedValue})[0];
            var selectedParticipant={
                participantId:selectedParticipantObj.userId,
                participantLabel:selectedParticipantObj.userDisplayName
            };
            return selectedParticipant;
        },
        getParticipantsList:function(){
            var that=this;
            var resturl=this.participantDataSourceURL;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(restData){
                var userStoreData=[];
                dojo.forEach(restData,function(userData){
                    var labelText="";
                    var paperImgTag="<img src='"+PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+userData.userId+"/' class='app_userSelectionPhotoBorder'/>&nbsp;"
                    var groupImgTag="<img src='vfbam/userclient/css/image/app/userType_group.jpg' class='app_userSelectionPhotoBorder'/>&nbsp;";
                    if(userData.userType==USER_TYPE_ROLE){
                        labelText=groupImgTag+userData.userDisplayName;
                    }else{
                        labelText=paperImgTag+userData.userDisplayName+"("+userData.userId+")";
                    }
                    if(that.hideParticipantIds){
                        if(dojo.indexOf(that.hideParticipantIds,userData.userId)==-1){
                            userStoreData.push({
                                label:labelText,
                                userId:userData.userId,
                                userDisplayName:userData.userDisplayName,
                                userType:userData.userType,
                                userSelectKey: userData.userDisplayName+"("+userData.userId+")"
                            });
                        }
                    }else{
                        userStoreData.push({
                            label:labelText,
                            userId:userData.userId,
                            userDisplayName:userData.userDisplayName,
                            userType:userData.userType,
                            userSelectKey: userData.userDisplayName+"("+userData.userId+")"
                        });
                    }
                });
                that.applicationUsersListStore=new Memory({
                    data:userStoreData
                });
                that.participantsFilter.set("store",that.applicationUsersListStore);
                that.participantsFilter.set("searchAttr","userSelectKey");
                that.participantsFilter.set("labelAttr","label");
                that.participantsFilter.set("labelType","html");
                that.participantsFilter.set("disabled",false);
                if(that.customStyle){
                    that.participantsFilter.set("style",that.customStyle);
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        _endOfCode: function(){}
    });
});