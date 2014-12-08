require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/enterpriseInfoManagement/widget/userList/template/UserBasicInfoMagazineViewItemWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.enterpriseInfoManagement.widget.userList.UserBasicInfoMagazineViewItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        clickEventConnectionHandler:null,
        disableUserConnectionHandler:null,
        enableUserConnectionHandler:null,
        userBasicInfoConnectionHandler:null,
        userProfileConnectionHandler:null,
        postCreate: function(){
            var dateTimeStamp=""+new Date().getTime();
            this.userFacePhoto.src=
                PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+"enterpiseInfo"+"/"+this.userDetailInfo.userId+"?timestamp="+dateTimeStamp;
            this.userName.innerHTML=this.userDetailInfo.displayName;
            this.userId.innerHTML=this.userDetailInfo.userId;

            var roleTypeDisplayName=APPLICATION_ENTERPRISE_DISPLAYNAME_MAP[this.userDetailInfo.roleType];
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
            this.clickEventConnectionHandler=dojo.connect(this.domNode,"onclick",dojo.hitch(this,this.selectMessageItem));
            this.disableUserConnectionHandler=dojo.connect(this.disableUserButton,"onclick",dojo.hitch(this,this.disableUser));
            this.enableUserConnectionHandler=dojo.connect(this.enableUserButton,"onclick",dojo.hitch(this,this.enableUser));
            this.userBasicInfoConnectionHandler=dojo.connect(this.userProfileButton,"onclick",dojo.hitch(this,this.renderUserProfile));
            this.userProfileConnectionHandler=dojo.connect(this.userDetailButton,"onclick",dojo.hitch(this,this.renderUserDetailInfo));
        },
        selectMessageItem:function(eventObj){
            if(this.currentSelectedUserInfoItemArray&&this.currentSelectedUserInfoItemArray.length>0){
                domClass.remove(this.currentSelectedUserInfoItemArray[0].userInfoItemRootContainer, "app_magazineView_item_selected");
                this.currentSelectedUserInfoItemArray.splice(0, this.currentSelectedUserInfoItemArray.length);
            }
            domClass.add(this.userInfoItemRootContainer, "app_magazineView_item_selected");
            this.currentSelectedUserInfoItemArray.push(this);
            Application.MessageUtil.publishMessage(APP_ENTERPRISE_USERINFOSELECTED_EVENT,{userDetailInfo:this.userDetailInfo,selectedUserInfoWidget:this});
        },
        disableUser:function(){
            Application.MessageUtil.publishMessage(APP_ENTERPRISE_DISABLEUSER_EVENT,{userDetailInfo:this.userDetailInfo,callback:dojo.hitch(this,this.setupUserInfo)});
        },
        enableUser:function(){
            Application.MessageUtil.publishMessage(APP_ENTERPRISE_ENABLEUSER_EVENT,{userDetailInfo:this.userDetailInfo,callback:dojo.hitch(this,this.setupUserInfo)});
        },
        renderUserProfile:function(){
            Application.MessageUtil.publishMessage(APP_ENTERPRISE_SHOWUSERPROFILE_EVENT,this.userDetailInfo);
        },
        renderUserDetailInfo:function(){
            Application.MessageUtil.publishMessage(APP_ENTERPRISE_SHOWUSERDETAILINFO_EVENT,this.userDetailInfo);
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
                PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+"enterpiseInfo"+"/"+this.userDetailInfo.userId+"?timestamp="+dateTimeStamp;
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
            Application.MessageUtil.publishMessage(APP_ENTERPRISE_USERINFOSELECTED_EVENT,{userDetailInfo:this.userDetailInfo,selectedUserInfoWidget:this});
        },
        reloadUserPhoto:function(){
            var dateTimeStamp=""+new Date().getTime();
            this.userFacePhoto.src=
                PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+"enterpiseInfo"+"/"+this.userDetailInfo.userId+"?timestamp="+dateTimeStamp;
            Application.MessageUtil.publishMessage(APP_ENTERPRISE_USERINFOSELECTED_EVENT,{userDetailInfo:this.userDetailInfo,selectedUserInfoWidget:this});
        },
        destroy:function(){
            dojo.disconnect(this.clickEventConnectionHandler);
            dojo.disconnect(this.disableUserConnectionHandler);
            dojo.disconnect(this.enableUserConnectionHandler);
            dojo.disconnect(this.userBasicInfoConnectionHandler);
            dojo.disconnect(this.userProfileConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});