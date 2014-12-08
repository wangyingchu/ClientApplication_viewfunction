require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/userManagement/widget/userPreview/template/UserPreviewWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.userManagement.widget.userPreview.UserPreviewWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        renderUserPreviewEventHandler:null,
        postCreate: function(){
            console.log("UserPreviewWidget created");
            this.renderUserPreviewEventHandler=
                Application.MessageUtil.listenToMessageTopic(APP_USERMANAGEMENT_USERINFOSELECTED_EVENT,dojo.hitch(this, "renderUserInfoPreview"));
        },
        renderUserInfoPreview:function(eventPayload){
            var userDetailInfo=eventPayload.userDetailInfo;
            if(userDetailInfo){
                dojo.style(this.previewPrompt,"display","none");
                dojo.style(this.previewContent,"display","");
            }else{
                dojo.style(this.previewPrompt,"display","");
                dojo.style(this.previewContent,"display","none");
                return;
            }
            var dateTimeStamp=""+new Date().getTime();
            this.userFacePhoto.src=
                PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+userDetailInfo.userId+"?timestamp="+dateTimeStamp;
            this.userName.innerHTML=userDetailInfo.displayName;
            this.userId.innerHTML=userDetailInfo.userId;

            var roleTypeDisplayName=APPLICATION_ROLE_DISPLAYNAME_MAP[userDetailInfo.roleType];
            if(roleTypeDisplayName){
                this.userRole.innerHTML=roleTypeDisplayName;
            }else{
                this.userRole.innerHTML="";
            }

            if(userDetailInfo.activeUser){
                dojo.style(this.disabledUserIcon,"display","none");
                dojo.style(this.activeUserIcon,"display","");
                //dojo.style(this.disableUserButtonContainer,"display","");
                //dojo.style(this.enableUserButtonContainer,"display","none");
            }else{
                dojo.style(this.disabledUserIcon,"display","");
                dojo.style(this.activeUserIcon,"display","none");
                //dojo.style(this.disableUserButtonContainer,"display","none");
                //dojo.style(this.enableUserButtonContainer,"display","");
            }

            if(userDetailInfo.title){
                this.title.innerHTML=userDetailInfo.title;
            }else{
                this.title.innerHTML="";
            }
            if(userDetailInfo.emailAddress){
                this.emailAddress.innerHTML=userDetailInfo.emailAddress;
            }else{
                this.emailAddress.innerHTML="";
            }
            if(userDetailInfo.mobilePhone&&userDetailInfo.mobilePhone!="0"){
                this.mobilePhone.innerHTML=userDetailInfo.mobilePhone;
            }else{
                this.mobilePhone.innerHTML="";
            }
            if(userDetailInfo.fixedPhone&&userDetailInfo.fixedPhone!="0"){
                this.fixedPhone.innerHTML=userDetailInfo.fixedPhone;
            }else{
                this.fixedPhone.innerHTML="";
            }
            if(userDetailInfo.address){
                this.address.innerHTML=userDetailInfo.address;
            }else{
                this.address.innerHTML="";
            }
            if(userDetailInfo.postalCode&&userDetailInfo.postalCode!="000000"){
                this.postalCode.innerHTML=userDetailInfo.postalCode;
            }else{
                this.postalCode.innerHTML="";
            }
            if(userDetailInfo.description){
                this.description.innerHTML=userDetailInfo.description;
            }else{
                this.description.innerHTML="";
            }
        },
        _endOfCode: function(){}
    });
});