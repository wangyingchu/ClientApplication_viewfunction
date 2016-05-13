//init message Center container height
var App_UserManagement_UI_Header_Height=216;
var App_UserManagement_UI_Dynamic_Real_Height=0;
var App_UserManagement_UI_SearchBox_Height=65;
function setUserManagementUIContainerHeight(){
    var _messageCenterContainer=dojo.byId("app_userManagement_participantInfoContainer");
    var _userListContainer=dojo.byId("app_userManagement_userListWarper");
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
var APP_USERMANAGEMENT_USERINFOSELECTED_EVENT="APP_USERMANAGEMENT_USERINFOSELECTED_EVENT";
var APP_USERMANAGEMENT_ENABLEUSER_EVENT="APP_USERMANAGEMENT_ENABLEUSER_EVENT";
var APP_USERMANAGEMENT_DISABLEUSER_EVENT="APP_USERMANAGEMENT_DISABLEUSER_EVENT";
var APP_USERMANAGEMENT_SHOWUSERDETAILINFO_EVENT="APP_USERMANAGEMENT_SHOWUSERDETAILINFO_EVENT";
var APP_USERMANAGEMENT_SHOWUSERPROFILE_EVENT="APP_USERMANAGEMENT_SHOWUSERPROFILE_EVENT";
var APP_USERMANAGEMENT_UPDATEUSERTOTALNUMBER_EVENT="APP_USERMANAGEMENT_UPDATEUSERTOTALNUMBER_EVENT";
var APP_USERMANAGEMENT_SETNORMALUSER_EVENT="APP_USERMANAGEMENT_SETNORMALUSER_EVENT";
var APP_USERMANAGEMENT_SETADMINUSER_EVENT="APP_USERMANAGEMENT_SETADMINUSER_EVENT";
var APP_USERMANAGEMENT_SHOWUSERALLOWEDFEATUREINFO_EVENT="APP_USERMANAGEMENT_SHOWUSERALLOWEDFEATUREINFO_EVENT";

var APP_USERMANAGEMENT_APPLICATION_AVAILABLEFEATURES=[];

var userSelectedListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_USERINFOSELECTED_EVENT,dojo.hitch(this,this.updateModificationButtons));
var showUserBasicInfoListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_SHOWUSERPROFILE_EVENT,showUserProfile);
var showUserDetailInfoListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_SHOWUSERDETAILINFO_EVENT,showUserDetail);
var enableUserListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_ENABLEUSER_EVENT,doEnableUser);
var disableUserListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_DISABLEUSER_EVENT,doDisableUser);
var updateUserNumberListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_UPDATEUSERTOTALNUMBER_EVENT,doUpdateUserNumber);
var setNormalUserListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_SETNORMALUSER_EVENT,doSetNormalUser);
var setAdminUserListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_SETADMINUSER_EVENT,doSetAdminUser);
var showUserAllowedFeatureListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_SHOWUSERALLOWEDFEATUREINFO_EVENT,showUserAllowedFeature);

var currentSelectedUserProfile=null;
var currentSelectedUserInfoWidget=null;
var APP_USERMANAGEMENT_ALLUSERSEARCH_CONST="ALL_USER";
var usermanagement_UserSearchScope=APP_USERMANAGEMENT_ALLUSERSEARCH_CONST;

var userPreviewWidget=new vfbam.userclient.components.userManagement.widget.userPreview.UserPreviewWidget(
    {containerHeight:App_UserManagement_UI_Dynamic_Real_Height},"app_userManagement_participantPreviewContainer");

var userListWidget=new vfbam.userclient.components.userManagement.widget.userList.UserListWidget(
    {containerHeight:App_UserManagement_UI_Dynamic_Real_Height},"app_userManagement_participantListContainer");

var enableUserButton=new dijit.form.Button({
    label: "<i class='icon-ok-sign'></i> 恢复用户",
    placement:"secondary",
    onClick: function(){
        enableUser();
    }
},"app_userManagement_activeUserButton");

var disableUserButton=new dijit.form.Button({
    label: "<i class='icon-remove-sign'></i> 禁用用户",
    placement:"secondary",
    onClick: function(){
        disableUser();
    }
},"app_userManagement_disableUserButton");

var setNormalUserButton=new dijit.form.Button({
    label: "<i class='icon-male'></i> 设为普通用户",
    placement:"secondary",
    onClick: function(){
        setNormalUser();
    }
},"app_userManagement_setNormalUserButton");

var setAdminUserButton=new dijit.form.Button({
    label: "<i class='icon-shield'></i> 设为系统管理员",
    placement:"secondary",
    onClick: function(){
        setAdminUser();
    }
},"app_userManagement_setAdminUserButton");

var allowedFeatureButton=new dijit.form.Button({
    label: "<i class='fa fa-cubes' aria-hidden='true'></i> 可用系统功能",
    placement:"secondary",
    onClick: function(){
        loadUseAccessFeaturesDialog();
    }
},"app_userManagement_allowedFeatureButton");

var userBasicProfileButton=new dijit.form.Button({
    label: "<i class='icon-list'></i> 用户基本信息",
    placement:"secondary",
    onClick: function(){
        loadUserBasicInfoDialog();
    }
},"app_userManagement_basicInfoButton");

var userDetailInfoButton=new dijit.form.Button({
    label: "<i class='icon-file-text-alt'></i> 用户详情",
    placement:"secondary",
    onClick: function(){
        loadUserDetailInfoDialog();
    }
},"app_userManagement_profileInfoButton");

var userFilterPropertyTypeSelect=new idx.form.Select({
    store:new dojo.data.ItemFileReadStore({url:'vfbam/userclient/components/userManagement/searchOptions.json'}),
    style:"width:140px;"
},"app_userManagement_userFilterPropertyTypeSelect");

var userFilterPropertyValueTextInput=new dijit.form.TextBox({
    style:"width:250px;"
},"app_userManagement_userFilterPropertyValueTextInput");

userListWidget.loadUserList();
loadApplicationSpaceAvilableApplicationFunctions();

function refreshUserList(){
    userListWidget.loadUserList();
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_userManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_userManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_userManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
    });
}

function updateModificationButtons(eventPayload){
    var userDetailInfo=eventPayload.userDetailInfo;
    var userInfoWidget=eventPayload.selectedUserInfoWidget;
    if(userDetailInfo){
        currentSelectedUserProfile=userDetailInfo;
        enableUserButton.set("disabled",false);
        disableUserButton.set("disabled",false);
        userBasicProfileButton.set("disabled",false);
        userDetailInfoButton.set("disabled",false);
        if(currentSelectedUserProfile.activeUser){
            enableUserButton.set("disabled","disabled");
            disableUserButton.set("disabled",false);
        }else{
            enableUserButton.set("disabled",false);
            disableUserButton.set("disabled","disabled");
        }
        if(currentSelectedUserProfile.roleType==APPLICATION_ROLE_NORMALUSER_ID){
            setNormalUserButton.set("disabled","disabled");
            setAdminUserButton.set("disabled",false);
        }else{
            setNormalUserButton.set("disabled",false);
            setAdminUserButton.set("disabled","disabled");
        }
        if(currentSelectedUserProfile.userId==APPLICATION_ROLE_BUILDIN_SUPERVISER_ID){
            enableUserButton.set("disabled","disabled");
            disableUserButton.set("disabled","disabled");
            setNormalUserButton.set("disabled","disabled");
            setAdminUserButton.set("disabled","disabled");
            allowedFeatureButton.set("disabled","disabled");
        }
    }else{
        currentSelectedUserProfile=null;
        enableUserButton.set("disabled","disabled");
        disableUserButton.set("disabled","disabled");
        userBasicProfileButton.set("disabled","disabled");
        userDetailInfoButton.set("disabled","disabled");
        setNormalUserButton.set("disabled","disabled");
        setAdminUserButton.set("disabled","disabled");
        allowedFeatureButton.set("disabled","disabled");
    }
    if(userInfoWidget){
        currentSelectedUserInfoWidget=userInfoWidget;
    }else{
        currentSelectedUserInfoWidget=null;
    }
}

function loadUserBasicInfoDialog(){
    if(currentSelectedUserProfile){
        var userId=currentSelectedUserProfile.userId;
        require(["idx/oneui/Dialog"], function(Dialog){
            var participantProfileEditor=new vfbam.userclient.common.UI.components.participantProfile.ParticipantProfileEditorWidget({participantId:userId,participantProfile:currentSelectedUserProfile,
            callback:updateUserProfileCallback,updatePhotoCallback:updateUserPhotoCallback});
            var editParticipantProfileButton=new dijit.form.Button({
                label: "<i class='icon-save'></i> 更新用户信息",
                onClick: function(){
                    participantProfileEditor.updateUserProfile();
                }
            });
            var actionButtone=[];
            actionButtone.push(editParticipantProfileButton);
            var	dialog = new Dialog({
                style:"width:610px;",
                title: "<i class='icon-user'></i> 用户信息",
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

function showUserProfile(event){
    currentSelectedUserProfile=event;
    loadUserBasicInfoDialog();
}

function updateUserProfileCallback(data){
    if(currentSelectedUserInfoWidget){
        currentSelectedUserInfoWidget.setupUserInfo(data);
    }
    var loginUser=Application.AttributeContext.getAttribute(USER_PROFILE);
    if(data.userId==loginUser.userId){
        Application.AttributeContext.setAttribute(USER_PROFILE,data);
        Application.MessageUtil.publishMessage(APP_USERLOGIN_PARTICIPANTINFO_REFRESH_EVENT,{});
    }
}

function updateUserPhotoCallback(){
    if(currentSelectedUserInfoWidget){
        currentSelectedUserInfoWidget.reloadUserPhoto();
    }
}

function loadUserDetailInfoDialog(){
    if(currentSelectedUserProfile){
        var userId=currentSelectedUserProfile.userId;
        require(["idx/oneui/Dialog"], function(Dialog){
            var participantProfileEditor=new vfbam.userclient.common.UI.components.participantDetailInfo.ParticipantDetailInfoWidget({participantId:userId,participantProfile:currentSelectedUserProfile});
            var editParticipantProfileButton=new dijit.form.Button({
                label: "<i class='icon-save'></i> 更新用户信息",
                onClick: function(){
                    participantProfileEditor.updateUserProfile();
                }
            });
            var actionButtone=[];
            actionButtone.push(editParticipantProfileButton);
            var	dialog = new Dialog({
                style:"width:610px;",
                title: "<i class='icon-file-text-alt'></i> 用户详情",
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

function showUserDetail(event){
    currentSelectedUserProfile=event;
    loadUserDetailInfoDialog();
}

function enableUser(callbackFunc){
    var messageTxt="<b>请确认是否恢复用户:</b>' "+currentSelectedUserProfile.displayName +" - "+currentSelectedUserProfile.userId+" '? 被恢复的用户可以重新登录系统。";
    var confirmButtonAction=function(){
        var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/enableUser/"+currentSelectedUserProfile.participantScope+"/"+currentSelectedUserProfile.userId+"/";
        var errorCallback= function(data){
            UI.showSystemErrorMessage(data);
        };
        var loadCallback=function(data){
            UI.showToasterMessage({type:"success",message:"恢复用户<b>"+data.displayName+"</b>成功"});
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

function doEnableUser(event){
    currentSelectedUserProfile=event.userDetailInfo;
    enableUser(event.callback);
}

function disableUser(callbackFunc){
    var messageTxt="<b>请确认是否禁用用户:</b>' "+currentSelectedUserProfile.displayName +" - "+currentSelectedUserProfile.userId+" '? 被禁用的用户将不能登陆系统。";
    var confirmButtonAction=function(){
        var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/disableUser/"+currentSelectedUserProfile.participantScope+"/"+currentSelectedUserProfile.userId+"/";
        var errorCallback= function(data){
            UI.showSystemErrorMessage(data);
        };
        var loadCallback=function(data){
            UI.showToasterMessage({type:"success",message:"禁用用户<b>"+data.displayName+"</b>成功"});
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
        confirmButtonLabel:"<i class='icon-remove-sign'></i> 禁用",
        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
        confirmButtonAction:confirmButtonAction,
        cancelButtonAction:cancelButtonAction
    });
}

function doDisableUser(event){
    currentSelectedUserProfile=event.userDetailInfo;
    disableUser(event.callback);
}

function loadAddNewUserBasicInfoDialog(){
    var userId=currentSelectedUserProfile.userId;
    require(["idx/oneui/Dialog"], function(Dialog){
        var participantProfileEditor=new vfbam.userclient.common.UI.components.participantProfile.NewParticipantEditorWidget({participantId:userId,participantProfile:currentSelectedUserProfile,
            callback:addNewUserCallback,userListWidget:userListWidget});
        var editParticipantProfileButton=new dijit.form.Button({
            label: "<i class='icon-save'></i> 创建用户",
            onClick: function(){
                participantProfileEditor.addNewUser();
            }
        });
        var actionButtone=[];
        actionButtone.push(editParticipantProfileButton);
        var	dialog = new Dialog({
            style:"width:480px;",
            title: "<i class='icon-user'></i> 创建用户",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        dojo.place(participantProfileEditor.containerNode, dialog.containerNode);
        dialog.connect(participantProfileEditor, "doCloseContainerDialog", "hide");
        dialog.show();
    });
}

function addNewUserCallback(data){
    var newAddedUserId;
    if(data){
        newAddedUserId=data.userId;
    }
    userListWidget.loadUserList(newAddedUserId);
}

function filterNormalUser(){
    userListWidget.renderUserList("APPLICATION_NORMALUSER");
    usermanagement_UserSearchScope="APPLICATION_NORMALUSER";
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_userManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_userManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_userManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
    });
}

function filterSuperviser(){
    userListWidget.renderUserList("APPLICATION_SUPERVISER");
    usermanagement_UserSearchScope="APPLICATION_SUPERVISER";
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_userManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_userManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_userManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
    });
}

function filterAllUser(){
    userListWidget.renderUserList(null);
    usermanagement_UserSearchScope=APP_USERMANAGEMENT_ALLUSERSEARCH_CONST;
    userFilterPropertyValueTextInput.set("value","");
    userFilterPropertyTypeSelect.set("value","displayName");
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_userManagement_allUserFilterContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_userManagement_superviserContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_userManagement_normalUserFilterContainer", "app_messageCenter_selectedMessageType");
    });
}

function doUpdateUserNumber(data){
    dojo.byId("app_userManagement_allUserCount").innerHTML="("+data.allUserNumber+")";
    dojo.byId("app_userManagement_normalUserCount").innerHTML="("+data.normalUserNumber+")";
    dojo.byId("app_userManagement_superviserCount").innerHTML="("+data.superviserNumber+")";
}

function doFilterUserList(){
    var searchValue=userFilterPropertyValueTextInput.get("value");
    if(searchValue==""){
        UI.showToasterMessage({type:"warning",message:"请输入用户搜索条件"});
        return;
    }else{
        var searchOption=userFilterPropertyTypeSelect.get("value");
        userListWidget.filterUsersByProperty(usermanagement_UserSearchScope,searchOption,searchValue);
    }
}

function doSetNormalUser(event){
    currentSelectedUserProfile=event.userDetailInfo;
    setNormalUser(event.callback);
}

function setNormalUser(callbackFunc){
    var messageTxt="<b>请确认是否将用户:</b>' "+currentSelectedUserProfile.displayName +" - "+currentSelectedUserProfile.userId+" '设定为普通用户。";
    var confirmButtonAction=function(){
        var originalCurrentSelectedUserRoleType=currentSelectedUserProfile.roleType;
        currentSelectedUserProfile.roleType=APPLICATION_ROLE_NORMALUSER_ID;
        var userProfileDataContent=dojo.toJson(currentSelectedUserProfile);
        var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/updateRoleType/";
        var errorCallback= function(data){
            currentSelectedUserProfile.roleType=originalCurrentSelectedUserRoleType;
            UI.showSystemErrorMessage(data);
        };
        var loadCallback=function(data){
            currentSelectedUserProfile=data;
            userListWidget.recountUserNumber();
            UI.showToasterMessage({type:"success",message:"设定<b>"+data.displayName+"</b>为普通用户成功"});
            if(callbackFunc){
                callbackFunc(data);
            }else{
                if(currentSelectedUserInfoWidget){
                    currentSelectedUserInfoWidget.setupUserInfo(data);
                }
            }
        };
        Application.WebServiceUtil.postJSONData(resturl,userProfileDataContent,loadCallback,errorCallback);
    };
    var cancelButtonAction=function(){};
    UI.showConfirmDialog({
        message:messageTxt,
        confirmButtonLabel:"<i class='icon-ok-sign'></i> 确定",
        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
        confirmButtonAction:confirmButtonAction,
        cancelButtonAction:cancelButtonAction
    });
}

function doSetAdminUser(event){
    currentSelectedUserProfile=event.userDetailInfo;
    setAdminUser(event.callback);
}

function setAdminUser(callbackFunc){
    var messageTxt="<b>请确认是否将用户:</b>' "+currentSelectedUserProfile.displayName +" - "+currentSelectedUserProfile.userId+" '设定为系统管理员。";
    var confirmButtonAction=function(){
        var originalCurrentSelectedUserRoleType=currentSelectedUserProfile.roleType;
        currentSelectedUserProfile.roleType=APPLICATION_ROLE_SUPERVISER_ID;
        var userProfileDataContent=dojo.toJson(currentSelectedUserProfile);
        var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/updateRoleType/";
        var errorCallback= function(data){
            currentSelectedUserProfile.roleType=originalCurrentSelectedUserRoleType;
            UI.showSystemErrorMessage(data);
        };
        var loadCallback=function(data){
            currentSelectedUserProfile=data;
            userListWidget.recountUserNumber();
            UI.showToasterMessage({type:"success",message:"设定<b>"+data.displayName+"</b>为系统管理员成功"});
            if(callbackFunc){
                callbackFunc(data);
            }else{
                if(currentSelectedUserInfoWidget){
                    currentSelectedUserInfoWidget.setupUserInfo(data);
                }
            }
        };
        Application.WebServiceUtil.postJSONData(resturl,userProfileDataContent,loadCallback,errorCallback);
    };
    var cancelButtonAction=function(){};
    UI.showConfirmDialog({
        message:messageTxt,
        confirmButtonLabel:"<i class='icon-ok-sign'></i> 确定",
        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
        confirmButtonAction:confirmButtonAction,
        cancelButtonAction:cancelButtonAction
    });
}

function loadApplicationSpaceAvilableApplicationFunctions(){
    var resturl=USERMANAGEMENTSERVICE_ROOT+"availableApplicationFeatures/"+APPLICATION_ID;
    var errorCallback= function(data){
        UI.showSystemErrorMessage(data);
    };
    var loadCallback=function(data){
        if(data){
            dojo.forEach(data,function(currentFeature){
                APP_USERMANAGEMENT_APPLICATION_AVAILABLEFEATURES.push(currentFeature);
            });
        }
    };
    Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
}

function loadUseAccessFeaturesDialog(){
    require(["idx/oneui/Dialog"], function(Dialog){
        var participantAccessFeaturesEditor=new vfbam.userclient.common.UI.components.participantProfile.ParticipantAllowedApplicationFeaturesEditor(
            {availableApplicationFeatures:APP_USERMANAGEMENT_APPLICATION_AVAILABLEFEATURES,participantProfile:currentSelectedUserProfile});
        var editParticipantProfileButton=new dijit.form.Button({
            label: "<i class='icon-save'></i> 更新可用系统功能",
            onClick: function(){
                participantAccessFeaturesEditor.updateAllowedApplicationFeatures();
            }
        });
        var actionButtone=[];
        actionButtone.push(editParticipantProfileButton);
        var	dialog = new Dialog({
            style:"width:480px;",
            title:  "<i class='fa fa-cubes' aria-hidden='true'></i> 用户可使用的系统功能",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        dojo.place(participantAccessFeaturesEditor.containerNode, dialog.containerNode);
        dialog.connect(participantAccessFeaturesEditor, "doCloseContainerDialog", "hide");
        dialog.show();
    });
}

function showUserAllowedFeature(event){
    currentSelectedUserProfile=event;
    loadUseAccessFeaturesDialog();
}