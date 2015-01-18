require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/GlobalParticipantsSearchWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.participantsList.GlobalParticipantsSearchWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        roleSelectListWidget:null,
        roleSelectMenuDialog:null,
        globalRoleParticipantsArray:null,
        currentRoleParticipantsArray:null,
        applicationSpaceRolesArray:null,
        currentRoleParticipantsContainerArray:null,
        postCreate: function(){
            this.globalRoleParticipantsArray=[];
            this.applicationSpaceRolesArray=[];
            this.currentRoleParticipantsArray=[];
            this.currentRoleParticipantsContainerArray=[];
            this.roleSelectListWidget=new vfbam.userclient.common.UI.components.participantsList.RoleSelectListWidget({globalParticipantsSearchWidget:this});
            this.roleSelectMenuDialog=new idx.widget.MenuDialog({});
            dojo.place(this.roleSelectListWidget.domNode, this.roleSelectMenuDialog.containerNode);
            var showTagDialogRolesFilterLinklabel="用户部门 <i class='icon-caret-down'></i>";
            new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:showTagDialogRolesFilterLinklabel,dropDown: this.roleSelectMenuDialog},this.participantRolesContainer);
            this.loadGlobalRoleParticipantData();
            this.loadApplicationSpaceRolesInfo();
        },
        loadGlobalRoleParticipantData:function(){
            var resturl=USERMANAGEMENTSERVICE_ROOT+"roleColleaguesOfApplicationSpace/"+APPLICATION_ID+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                that.globalRoleParticipantsArray=data;
                that.renderGlobalRoleParticipantsList(true);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        loadApplicationSpaceRolesInfo:function(){
            var that=this;
            var resturl=VFBAM_CORE_SERVICE_ROOT+"userManagementService/userUnitsInfo/"+APPLICATION_ID;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(restData){
                dojo.forEach(restData,function(userData){
                    if(userData.userType==USER_TYPE_ROLE){
                        that.applicationSpaceRolesArray.push(userData);
                    }
                });
                that.roleSelectListWidget.renderRolesInfo(that.applicationSpaceRolesArray);
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        renderGlobalRoleParticipantsList:function(initMode){
            if(initMode===true){
                this.currentRoleParticipantsArray= lang.clone(this.globalRoleParticipantsArray);
            }else{
                var filterUserName=this.userNameCheckbox.get("checked");
                var filterUserId=this.userIdCheckbox.get("checked");
                var filterValue=this.filterInputValue.get("value");
                var selectedRoleArrayList=this.roleSelectListWidget.getSelectedRoles();
                this.currentRoleParticipantsArray.splice(0,this.currentRoleParticipantsArray.length);
                var that=this;
                dojo.forEach(this.globalRoleParticipantsArray,function(globalRoleParticipants){
                    var currentRoleName=globalRoleParticipants.roleName;
                    if(that._checkCurrentRoleSelected(currentRoleName,selectedRoleArrayList)){
                        var currentRoleParticipantsInfo={};
                        currentRoleParticipantsInfo.roleDisplayName=globalRoleParticipants.roleDisplayName;
                        currentRoleParticipantsInfo.roleName=globalRoleParticipants.roleName;
                        currentRoleParticipantsInfo.roleParticipants={};
                        currentRoleParticipantsInfo.roleParticipants.participantDetailInfoVOsList=[];
                        var globalRoleParticipantsArray=globalRoleParticipants.roleParticipants.participantDetailInfoVOsList;
                        dojo.forEach(globalRoleParticipantsArray,function(globalRoleParticipant){
                            if(filterValue!=""){
                                var notAddedYet=true;
                                if(filterUserName){
                                    var checkSum=globalRoleParticipant.displayName.indexOf(filterValue);
                                    if(checkSum!=-1){
                                        currentRoleParticipantsInfo.roleParticipants.participantDetailInfoVOsList.push(globalRoleParticipant);
                                        notAddedYet=false;
                                    }
                                }
                                if(filterUserId){
                                    if(notAddedYet){
                                        var checkSum=globalRoleParticipant.userId.indexOf(filterValue);
                                        if(checkSum!=-1){
                                            currentRoleParticipantsInfo.roleParticipants.participantDetailInfoVOsList.push(globalRoleParticipant);
                                        }
                                    }
                                }
                            }else{
                                currentRoleParticipantsInfo.roleParticipants.participantDetailInfoVOsList.push(globalRoleParticipant);
                            }
                        });
                        that.currentRoleParticipantsArray.push(currentRoleParticipantsInfo);
                    }
                });
            }

            dojo.forEach(this.currentRoleParticipantsContainerArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            dojo.empty(this.participantsListContainer);

            var that=this;
            dojo.forEach(this.currentRoleParticipantsArray,function(roleParticipantsInfo){
                //var roleName=roleParticipantsInfo.roleName;
                var roleDisplayName=roleParticipantsInfo.roleDisplayName;
                var roleParticipantsList=roleParticipantsInfo.roleParticipants.participantDetailInfoVOsList;
                if(roleParticipantsList.length>0){
                    var currentRoleParticipantsContainer=new vfbam.userclient.common.UI.widgets.NestedContentContainer({title:roleDisplayName});
                    that.participantsListContainer.appendChild(currentRoleParticipantsContainer.domNode);
                    that.currentRoleParticipantsContainerArray.push(currentRoleParticipantsContainer);
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
                }
            });
        },
        _checkCurrentRoleSelected:function(roleName,selectedRoleList){
            var currentRoleSelected=false;
            dojo.forEach(selectedRoleList,function(currentRole){
                if(currentRole==roleName){
                    currentRoleSelected=true;
                }
            });
            return currentRoleSelected;
        },
        destroy:function(){
            dojo.forEach(this.currentRoleParticipantsContainerArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.roleSelectListWidget.destroy();
            this.roleSelectMenuDialog.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});