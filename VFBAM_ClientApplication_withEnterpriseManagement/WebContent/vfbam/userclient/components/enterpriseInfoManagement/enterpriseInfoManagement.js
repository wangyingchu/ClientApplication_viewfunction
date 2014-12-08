//init message Center container height
var App_UserManagement_UI_Header_Height=216;
var App_UserManagement_UI_Dynamic_Real_Height=0;
var App_UserManagement_UI_SearchBox_Height=65;
function setUserManagementUIContainerHeight(){
    var _messageCenterContainer=dojo.byId("app_enterpriseManagement_participantInfoContainer");
    var _userListContainer=dojo.byId("app_enterpriseManagement_userListWarper");
    require(["dojo/window"], function(win){
        var vs =win.getBox();
        App_UserManagement_UI_Dynamic_Real_Height=  vs.h-App_UserManagement_UI_Header_Height;
        var currentHeightStyle=""+ App_UserManagement_UI_Dynamic_Real_Height+"px";
        dojo.style(_messageCenterContainer,"height",currentHeightStyle);
        var userListContainerHeight=App_UserManagement_UI_Dynamic_Real_Height-App_UserManagement_UI_SearchBox_Height;
        var currentUserListHeightStyle=""+ userListContainerHeight+"px";
        dojo.style(_userListContainer,"height",currentUserListHeightStyle);
    });
}
setUserManagementUIContainerHeight();

//business logic
var APP_ENTERPRISE_USERINFOSELECTED_EVENT="APP_ENTERPRISE_USERINFOSELECTED_EVENT";
var APP_ENTERPRISE_ENABLEUSER_EVENT="APP_ENTERPRISE_ENABLEUSER_EVENT";
var APP_ENTERPRISE_DISABLEUSER_EVENT="APP_ENTERPRISE_DISABLEUSER_EVENT";
var APP_ENTERPRISE_SHOWUSERDETAILINFO_EVENT="APP_ENTERPRISE_SHOWUSERDETAILINFO_EVENT";
var APP_ENTERPRISE_SHOWUSERPROFILE_EVENT="APP_ENTERPRISE_SHOWUSERPROFILE_EVENT";
var APP_ENTERPRISE_UPDATEUSERTOTALNUMBER_EVENT="APP_ENTERPRISE_UPDATEUSERTOTALNUMBER_EVENT";

var userSelectedListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_ENTERPRISE_USERINFOSELECTED_EVENT,dojo.hitch(this,this.updateModificationButtons_ent));
var showUserBasicInfoListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_ENTERPRISE_SHOWUSERPROFILE_EVENT,showUserProfile_ent);
var showUserDetail_entInfoListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_ENTERPRISE_SHOWUSERDETAILINFO_EVENT,showUserDetail_ent);
var enableUser_entListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_ENTERPRISE_ENABLEUSER_EVENT,doEnableUser_ent);
var disableUser_entListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_ENTERPRISE_DISABLEUSER_EVENT,doDisableUser_ent);
var updateUserNumberListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_ENTERPRISE_UPDATEUSERTOTALNUMBER_EVENT,doUpdateUserNumber_ent);

var currentSelectedUserProfile_ent=null;
var currentSelectedUserInfoWidget=null;
var APP_ENTERPRISE_ALLUSERSEARCH_CONST="ALL_USER";
var usermanagement_UserSearchScope=APP_ENTERPRISE_ALLUSERSEARCH_CONST;

var userPreviewWidget=new vfbam.userclient.components.enterpriseInfoManagement.widget.userPreview.UserPreviewWidget(
    {containerHeight:App_UserManagement_UI_Dynamic_Real_Height},"app_enterpriseManagement_participantPreviewContainer");

var userListWidget_ent=new vfbam.userclient.components.enterpriseInfoManagement.widget.userList.UserListWidget(
    {containerHeight:App_UserManagement_UI_Dynamic_Real_Height},"app_enterpriseManagement_participantListContainer");

var enableUser_entButton=new dijit.form.Button({
    label: "<i class='icon-ok-sign'></i> 恢复企业",
    placement:"secondary",
    onClick: function(){
        enableUser_ent();
    }
},"app_enterpriseManagement_activeUserButton");

var disableUser_entButton=new dijit.form.Button({
    label: "<i class='icon-remove-sign'></i> 归档企业",
    placement:"secondary",
    onClick: function(){
        disableUser_ent();
    }
},"app_enterpriseManagement_disableUserButton");

var userBasicProfileButton=new dijit.form.Button({
    label: "<i class='icon-list'></i> 企业基本信息",
    placement:"secondary",
    onClick: function(){
        loadUserBasicInfoDialog_ent();
    }
},"app_enterpriseManagement_basicInfoButton");

var userDetailInfoButton=new dijit.form.Button({
    label: "<i class='icon-file-text-alt'></i> 企业详情信息",
    placement:"secondary",
    onClick: function(){
        loadUserDetailInfoDialog_ent();
    }
},"app_enterpriseManagement_profileInfoButton");

var userFilterPropertyTypeSelect=new idx.form.Select({
    store:new dojo.data.ItemFileReadStore({url:'vfbam/userclient/components/enterpriseInfoManagement/searchOptions.json'}),
    style:"width:140px;"
},"app_enterpriseManagement_userFilterPropertyTypeSelect");

var userFilterPropertyValueTextInput=new dijit.form.TextBox({
    style:"width:250px;"
},"app_enterpriseManagement_userFilterPropertyValueTextInput");

userListWidget_ent.loadUserList();

function refreshUserList_ent(){
    userListWidget_ent.loadUserList();
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_enterpriseManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
    });
}

function updateModificationButtons_ent(eventPayload){
    var userDetailInfo=eventPayload.userDetailInfo;
    var userInfoWidget=eventPayload.selectedUserInfoWidget;
    if(userDetailInfo){
        currentSelectedUserProfile_ent=userDetailInfo;
        enableUser_entButton.set("disabled",false);
        disableUser_entButton.set("disabled",false);
        userBasicProfileButton.set("disabled",false);
        userDetailInfoButton.set("disabled",false);
        if(currentSelectedUserProfile_ent.activeUser){
            enableUser_entButton.set("disabled","disabled");
            disableUser_entButton.set("disabled",false);
        }else{
            enableUser_entButton.set("disabled",false);
            disableUser_entButton.set("disabled","disabled");
        }
    }else{
        currentSelectedUserProfile_ent=null;
        enableUser_entButton.set("disabled","disabled");
        disableUser_entButton.set("disabled","disabled");
        userBasicProfileButton.set("disabled","disabled");
        userDetailInfoButton.set("disabled","disabled");
    }
    if(userInfoWidget){
        currentSelectedUserInfoWidget=userInfoWidget;
    }else{
        currentSelectedUserInfoWidget=null;
    }
}

function loadUserBasicInfoDialog_ent(){
    if(currentSelectedUserProfile_ent){
        var userId=currentSelectedUserProfile_ent.userId;
        require(["idx/oneui/Dialog"], function(Dialog){
            var participantProfileEditor=new vfbam.userclient.components.enterpriseInfoManagement.widget.ParticipantProfileEditorWidget({participantId:userId,participantProfile:currentSelectedUserProfile_ent,
                callback:updateUserProfileCallback_ent,updatePhotoCallback:updateUserPhotoCallback_ent});
            var editParticipantProfileButton=new dijit.form.Button({
                label: "<i class='icon-save'></i> 更新企业基本信息",
                onClick: function(){
                    participantProfileEditor.updateUserProfile();
                }
            });
            var actionButtone=[];
            actionButtone.push(editParticipantProfileButton);
            var	dialog = new Dialog({
                style:"width:610px;",
                title: "<i class='icon-user'></i> 企业信息",
                content: "",
                buttons:actionButtone,
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            dojo.place(participantProfileEditor.containerNode, dialog.containerNode);
            dialog.show();
        });
    }else{

    }
}

function showUserProfile_ent(event){
    currentSelectedUserProfile_ent=event;
    loadUserBasicInfoDialog_ent();
}

function updateUserProfileCallback_ent(data){
    if(currentSelectedUserInfoWidget){
        currentSelectedUserInfoWidget.setupUserInfo(data);
    }
    var loginUser=Application.AttributeContext.getAttribute(USER_PROFILE);
    if(data.userId==loginUser.userId){
        Application.AttributeContext.setAttribute(USER_PROFILE,data);
        Application.MessageUtil.publishMessage(APP_USERLOGIN_PARTICIPANTINFO_REFRESH_EVENT,{});
    }
}

function updateUserPhotoCallback_ent(){
    if(currentSelectedUserInfoWidget){
        currentSelectedUserInfoWidget.reloadUserPhoto();
    }
}

function loadUserDetailInfoDialog_ent(){
    if(currentSelectedUserProfile_ent){
        var userId=currentSelectedUserProfile_ent.userId;
        require(["idx/oneui/Dialog"], function(Dialog){
            var participantProfileEditor=new vfbam.userclient.components.enterpriseInfoManagement.widget.ParticipantDetailInfoWidget({participantId:userId,participantProfile:currentSelectedUserProfile_ent});
            var editParticipantProfileButton=new dijit.form.Button({
                label: "<i class='icon-save'></i> 更新企业信息",
                onClick: function(){
                    participantProfileEditor.updateUserProfile();
                }
            });
            var actionButtone=[];
            actionButtone.push(editParticipantProfileButton);
            var	dialog = new Dialog({
                style:"width:610px;",
                title: "<i class='icon-file-text-alt'></i> 企业详情",
                content: "",
                buttons:actionButtone,
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            dojo.place(participantProfileEditor.containerNode, dialog.containerNode);
            dialog.show();
        });
    }else{

    }
}

function showUserDetail_ent(event){
    currentSelectedUserProfile_ent=event;
    loadUserDetailInfoDialog_ent();
}

function enableUser_ent(callbackFunc){
    var messageTxt="<b>请确认是否恢复企业:</b>' "+currentSelectedUserProfile_ent.displayName +" - "+currentSelectedUserProfile_ent.userId+" '? 被恢复的企业可以重新进行业务处理。";
    var confirmButtonAction=function(){
        var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/enableUser/"+currentSelectedUserProfile_ent.participantScope+"/"+currentSelectedUserProfile_ent.userId+"/";
        var errorCallback= function(data){
            UI.showSystemErrorMessage(data);
        };
        var loadCallback=function(data){
            UI.showToasterMessage({type:"success",message:"恢复企业<b>"+data.displayName+"</b>成功"});
            if(callbackFunc){
                callbackFunc(data);
            }else{
                if(currentSelectedUserInfoWidget){
                    currentSelectedUserInfoWidget.setupUserInfo(data);
                }
            }
        };
        Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
    };
    var cancelButtonAction=function(){};
    UI.showConfirmDialog({
        message:messageTxt,
        confirmButtonLabel:"<i class='icon-ok-sign'></i> 恢复",
        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
        confirmButtonAction:confirmButtonAction,
        cancelButtonAction:cancelButtonAction
    });
}

function doEnableUser_ent(event){
    currentSelectedUserProfile_ent=event.userDetailInfo;
    enableUser_ent(event.callback);
}

function disableUser_ent(callbackFunc){
    var messageTxt="<b>请确认是否归档企业:</b>' "+currentSelectedUserProfile_ent.displayName +" - "+currentSelectedUserProfile_ent.userId+" '? 被归档的企业将不能进行业务处理。";
    var confirmButtonAction=function(){
        var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/disableUser/"+currentSelectedUserProfile_ent.participantScope+"/"+currentSelectedUserProfile_ent.userId+"/";
        var errorCallback= function(data){
            UI.showSystemErrorMessage(data);
        };
        var loadCallback=function(data){
            UI.showToasterMessage({type:"success",message:"归档企业<b>"+data.displayName+"</b>成功"});
            if(callbackFunc){
                callbackFunc(data);
            }else{
                if(currentSelectedUserInfoWidget){
                    currentSelectedUserInfoWidget.setupUserInfo(data);
                }
            }
        };
        Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
    };
    var cancelButtonAction=function(){};
    UI.showConfirmDialog({
        message:messageTxt,
        confirmButtonLabel:"<i class='icon-remove-sign'></i> 归档",
        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
        confirmButtonAction:confirmButtonAction,
        cancelButtonAction:cancelButtonAction
    });
}

function doDisableUser_ent(event){
    currentSelectedUserProfile_ent=event.userDetailInfo;
    disableUser_ent(event.callback);
}

function loadAddNewUserBasicInfoDialog_ent(){
    var userId=currentSelectedUserProfile_ent.userId;
    require(["idx/oneui/Dialog"], function(Dialog){
        var participantProfileEditor=new vfbam.userclient.components.enterpriseInfoManagement.widget.NewEnterpriseEditorWidget({participantId:userId,participantProfile:currentSelectedUserProfile_ent,
            callback:addNewUserCallback_ent,userListWidget:userListWidget_ent});
        var editParticipantProfileButton=new dijit.form.Button({
            label: "<i class='icon-save'></i> 添加企业信息",
            onClick: function(){
                participantProfileEditor.addNewUser();
            }
        });
        var actionButtone=[];
        actionButtone.push(editParticipantProfileButton);
        var	dialog = new Dialog({
            style:"width:480px;",
            title: "<i class='icon-user'></i> 添加企业信息",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        dojo.place(participantProfileEditor.containerNode, dialog.containerNode);
        dialog.connect(participantProfileEditor, "doCloseContainerDialog", "hide");
        dialog.show();
    });
}

function addNewUserCallback_ent(data){
    var newAddedUserId;
    if(data){
        newAddedUserId=data.userId;
    }
    userListWidget_ent.loadUserList(newAddedUserId);
}

function filterNormalUser_ent(){
    userListWidget_ent.renderUserList("APPLICATION_NORMALUSER");
    usermanagement_UserSearchScope="APPLICATION_NORMALUSER";
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_enterpriseManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ITCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ManunalCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_FoodCompanyContainer", "app_messageCenter_selectedMessageType");
    });
}

function filterSuperviser_ent(){
    userListWidget_ent.renderUserList("APPLICATION_SUPERVISER");
    usermanagement_UserSearchScope="APPLICATION_SUPERVISER";
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_enterpriseManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ITCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ManunalCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_FoodCompanyContainer", "app_messageCenter_selectedMessageType");
    });
}

function filterAllUser_ent(){
    userListWidget_ent.renderUserList(null);
    usermanagement_UserSearchScope=APP_ENTERPRISE_ALLUSERSEARCH_CONST;
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_enterpriseManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ITCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ManunalCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_FoodCompanyContainer", "app_messageCenter_selectedMessageType");
    });
}

function filterIT_ent(){
    var companyNumber=userListWidget_ent.filterEnterpriseByIndustry("IT类");
    dojo.byId("app_enterpriseManagement_ITCompanyCount").innerHTML="("+companyNumber+")";
    usermanagement_UserSearchScope=APP_ENTERPRISE_ALLUSERSEARCH_CONST;
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.remove("app_enterpriseManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ITCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ManunalCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_FoodCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.add("app_enterpriseManagement_ITCompanyContainer", "app_messageCenter_selectedMessageType");
    });
}

function filterMaunul_ent(){
    var companyNumber=userListWidget_ent.filterEnterpriseByIndustry("制造类");
    dojo.byId("app_enterpriseManagement_ManunalCompanyCount").innerHTML="("+companyNumber+")";
    usermanagement_UserSearchScope=APP_ENTERPRISE_ALLUSERSEARCH_CONST;
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.remove("app_enterpriseManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ITCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ManunalCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_FoodCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.add("app_enterpriseManagement_ManunalCompanyContainer", "app_messageCenter_selectedMessageType");
    });
}

function filteFood_ent(){
    var companyNumber=userListWidget_ent.filterEnterpriseByIndustry("食品加工类");
    dojo.byId("app_enterpriseManagement_FoodCompanyCount").innerHTML="("+companyNumber+")";
    usermanagement_UserSearchScope=APP_ENTERPRISE_ALLUSERSEARCH_CONST;
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.remove("app_enterpriseManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ITCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_ManunalCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_enterpriseManagement_FoodCompanyContainer", "app_messageCenter_selectedMessageType");
        domClass.add("app_enterpriseManagement_FoodCompanyContainer", "app_messageCenter_selectedMessageType");
    });
}

function doUpdateUserNumber_ent(data){
    dojo.byId("app_enterpriseManagement_allUserCount").innerHTML="("+data.allUserNumber+")";
    dojo.byId("app_enterpriseManagement_normalUserCount").innerHTML="("+data.normalUserNumber+")";
    dojo.byId("app_enterpriseManagement_superviserCount").innerHTML="("+data.superviserNumber+")";
}

function doFilterUserList_ent(){
    var searchValue=userFilterPropertyValueTextInput.get("value");
    if(searchValue==""){
        UI.showToasterMessage({type:"warning",message:"请输入用户搜索条件"});
        return;
    }else{
        var searchOption=userFilterPropertyTypeSelect.get("value");
        userListWidget_ent.filterUsersByProperty(usermanagement_UserSearchScope,searchOption,searchValue);
    }
}

