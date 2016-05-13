require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/userManagement/widget/userList/template/UserBasicInfoMagazineViewItemWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.userManagement.widget.userList.UserBasicInfoMagazineViewItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        clickEventConnectionHandler:null,
        disableUserConnectionHandler:null,
        enableUserConnectionHandler:null,
        userBasicInfoConnectionHandler:null,
        userProfileConnectionHandler:null,
        setNormalUserConnectionHandler:null,
        setAdminUserConnectionHandler:null,
        userAllowedFeatureConnectionHandler:null,
        postCreate: function(){
            var dateTimeStamp=""+new Date().getTime();
            this.userFacePhoto.src=
                PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+this.userDetailInfo.userId+"?timestamp="+dateTimeStamp;
            this.userName.innerHTML=this.userDetailInfo.displayName;
            this.userId.innerHTML=this.userDetailInfo.userId;

            var roleTypeDisplayName=APPLICATION_ROLE_DISPLAYNAME_MAP[this.userDetailInfo.roleType];
            if(roleTypeDisplayName){
                this.userRole.innerHTML=roleTypeDisplayName;
            }else{
                this.userRole.innerHTML="";
            }
            if(this.userDetailInfo.fixedPhone&&this.userDetailInfo.fixedPhone!="0"){
                this.userPhoneNumber.innerHTML=this.userDetailInfo.fixedPhone;
            }
            this.userEmailLink.href="mailto:"+this.userDetailInfo.emailAddress;
            this.userEMailLabel.innerHTML=this.userDetailInfo.emailAddress;
            if(this.userDetailInfo.activeUser){
                dojo.style(this.disabledUserIcon,"display","none");
                dojo.style(this.activeUserIcon,"display","");
                dojo.style(this.enableUserButton,"display","none");
                dojo.style(this.disableUserButton,"display","");
            }else{
                dojo.style(this.disabledUserIcon,"display","");
                dojo.style(this.activeUserIcon,"display","none");
                dojo.style(this.disableUserButton,"display","none");
                dojo.style(this.enableUserButton,"display","");
            }
            if(this.userDetailInfo.roleType==APPLICATION_ROLE_NORMALUSER_ID){
                dojo.style(this.setNormalUserButton,"display","none");
                dojo.style(this.setAdminUserButton,"display","");
            }
            if(this.userDetailInfo.roleType==APPLICATION_ROLE_SUPERVISER_ID){
                dojo.style(this.setNormalUserButton,"display","");
                dojo.style(this.setAdminUserButton,"display","none");
            }

            this.clickEventConnectionHandler=dojo.connect(this.domNode,"onclick",dojo.hitch(this,this.selectMessageItem));
            this.disableUserConnectionHandler=dojo.connect(this.disableUserButton,"onclick",dojo.hitch(this,this.disableUser));
            this.enableUserConnectionHandler=dojo.connect(this.enableUserButton,"onclick",dojo.hitch(this,this.enableUser));
            this.userBasicInfoConnectionHandler=dojo.connect(this.userProfileButton,"onclick",dojo.hitch(this,this.renderUserProfile));
            this.userProfileConnectionHandler=dojo.connect(this.userDetailButton,"onclick",dojo.hitch(this,this.renderUserDetailInfo));
            this.setNormalUserConnectionHandler=dojo.connect(this.setNormalUserButton,"onclick",dojo.hitch(this,this.setNormalUser));
            this.setAdminUserConnectionHandler=dojo.connect(this.setAdminUserButton,"onclick",dojo.hitch(this,this.setAdminUser));
            this.userAllowedFeatureConnectionHandler=dojo.connect(this.allowedFeatureButton,"onclick",dojo.hitch(this,this.renderUserAllowedFeatureInfo));

            if(this.userDetailInfo.userId==APPLICATION_ROLE_BUILDIN_SUPERVISER_ID){
                dojo.style(this.disabledUserIcon,"display","none");
                dojo.style(this.activeUserIcon,"display","");
                dojo.style(this.enableUserButton,"display","none");
                dojo.style(this.disableUserButton,"display","none");
                dojo.style(this.setNormalUserButton,"display","none");
                dojo.style(this.setAdminUserButton,"display","none");
                dojo.style(this.allowedFeatureButton,"display","none");
            }
        },
        selectMessageItem:function(eventObj){
            if(this.currentSelectedUserInfoItemArray&&this.currentSelectedUserInfoItemArray.length>0){
                domClass.remove(this.currentSelectedUserInfoItemArray[0].userInfoItemRootContainer, "app_magazineView_item_selected");
                this.currentSelectedUserInfoItemArray.splice(0, this.currentSelectedUserInfoItemArray.length);
            }
            domClass.add(this.userInfoItemRootContainer, "app_magazineView_item_selected");
            this.currentSelectedUserInfoItemArray.push(this);
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_USERINFOSELECTED_EVENT,{userDetailInfo:this.userDetailInfo,selectedUserInfoWidget:this});
        },
        disableUser:function(){
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_DISABLEUSER_EVENT,{userDetailInfo:this.userDetailInfo,callback:dojo.hitch(this,this.setupUserInfo)});
        },
        enableUser:function(){
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_ENABLEUSER_EVENT,{userDetailInfo:this.userDetailInfo,callback:dojo.hitch(this,this.setupUserInfo)});
        },
        setNormalUser:function(){
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_SETNORMALUSER_EVENT,{userDetailInfo:this.userDetailInfo,callback:dojo.hitch(this,this.setupUserInfo)});
        },
        setAdminUser:function(){
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_SETADMINUSER_EVENT,{userDetailInfo:this.userDetailInfo,callback:dojo.hitch(this,this.setupUserInfo)});
        },
        renderUserProfile:function(){
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_SHOWUSERPROFILE_EVENT,this.userDetailInfo);
        },
        renderUserDetailInfo:function(){
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_SHOWUSERDETAILINFO_EVENT,this.userDetailInfo);
        },
        renderUserAllowedFeatureInfo:function(){
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_SHOWUSERALLOWEDFEATUREINFO_EVENT,this.userDetailInfo);
        },
        setupUserInfo:function(userInfo){
            this.userDetailInfo=userInfo;
            this.userName.innerHTML=this.userDetailInfo.displayName;
            if(this.userDetailInfo.fixedPhone!=0){
                this.userPhoneNumber.innerHTML=this.userDetailInfo.fixedPhone;
            }
            this.userEmailLink.href="mailto:"+this.userDetailInfo.emailAddress;
            this.userEMailLabel.innerHTML=this.userDetailInfo.emailAddress;
            var dateTimeStamp=""+new Date().getTime();
            this.userFacePhoto.src=
                PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+this.userDetailInfo.userId+"?timestamp="+dateTimeStamp;
            var roleTypeDisplayName=APPLICATION_ROLE_DISPLAYNAME_MAP[this.userDetailInfo.roleType];
            if(roleTypeDisplayName){
                this.userRole.innerHTML=roleTypeDisplayName;
            }else{
                this.userRole.innerHTML="";
            }
            if(userInfo.activeUser){
                this.userDetailInfo.activeUser=true;
                dojo.style(this.disabledUserIcon,"display","none");
                dojo.style(this.activeUserIcon,"display","");
                dojo.style(this.enableUserButton,"display","none");
                dojo.style(this.disableUserButton,"display","");
            }else{
                this.userDetailInfo.activeUser=false;
                dojo.style(this.disabledUserIcon,"display","");
                dojo.style(this.activeUserIcon,"display","none");
                dojo.style(this.disableUserButton,"display","none");
                dojo.style(this.enableUserButton,"display","");
            }
            if(this.userDetailInfo.roleType==APPLICATION_ROLE_NORMALUSER_ID){
                dojo.style(this.setNormalUserButton,"display","none");
                dojo.style(this.setAdminUserButton,"display","");
            }
            if(this.userDetailInfo.roleType==APPLICATION_ROLE_SUPERVISER_ID){
                dojo.style(this.setNormalUserButton,"display","");
                dojo.style(this.setAdminUserButton,"display","none");
            }
            if(this.userDetailInfo.userId==APPLICATION_ROLE_BUILDIN_SUPERVISER_ID){
                dojo.style(this.disabledUserIcon,"display","none");
                dojo.style(this.activeUserIcon,"display","");
                dojo.style(this.enableUserButton,"display","none");
                dojo.style(this.disableUserButton,"display","none");
                dojo.style(this.setNormalUserButton,"display","none");
                dojo.style(this.setAdminUserButton,"display","none");
                dojo.style(this.allowedFeatureButton,"display","none");
            }
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_USERINFOSELECTED_EVENT,{userDetailInfo:this.userDetailInfo,selectedUserInfoWidget:this});
        },
        reloadUserPhoto:function(){
            var dateTimeStamp=""+new Date().getTime();
            this.userFacePhoto.src=
                PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+this.userDetailInfo.userId+"?timestamp="+dateTimeStamp;
            Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_USERINFOSELECTED_EVENT,{userDetailInfo:this.userDetailInfo,selectedUserInfoWidget:this});
        },
        destroy:function(){
            dojo.disconnect(this.clickEventConnectionHandler);
            dojo.disconnect(this.disableUserConnectionHandler);
            dojo.disconnect(this.enableUserConnectionHandler);
            dojo.disconnect(this.userBasicInfoConnectionHandler);
            dojo.disconnect(this.userProfileConnectionHandler);
            dojo.disconnect(this.setNormalUserConnectionHandler);
            dojo.disconnect(this.setAdminUserConnectionHandler);
            dojo.disconnect(this.userAllowedFeatureConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});