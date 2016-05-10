require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantProfile/template/NewParticipantEditorWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.participantProfile.NewParticipantEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        facePhotoPath:null,
        postCreate: function(){
        },
        addNewUser:function(){
            var validationResult=true;
            if(!this.displayNameField.isValid()){
                UI.showToasterMessage({type:"warning",message:"请输入用户名称"});
                validationResult=false;
            }
            if(!this.userIdField.isValid()){
                UI.showToasterMessage({type:"warning",message:"请输入用户登录ID"});
                validationResult=false;
            }
            var isRepeatedUserId=this.userListWidget.checkDuplicatedUserById(this.userIdField.get("value"));
            if(isRepeatedUserId){
                UI.showToasterMessage({type:"warning",message:"该用户登录ID在系统中已存在"});
                return false;
            }
            if(!this.emailAddressField.isValid()){
                UI.showToasterMessage({type:"warning",message:"请输入格式正确的电子邮件地址"});
                validationResult=false;
            }
            if(!this.mobilePhoneField.isValid()){
                UI.showToasterMessage({type:"warning",message:"请输入格式正确的移动电话号码"});
                validationResult=false;
            }
            if(!this.fixedPhoneField.isValid()){
                UI.showToasterMessage({type:"warning",message:"请输入格式正确的固定电话号码"});
                validationResult=false;
            }
            if(!this.postalCodeField.isValid()){
                UI.showToasterMessage({type:"warning",message:"请输入格式正确的邮政编码"});
                validationResult=false;
            }
            if(!validationResult){
                return;
            }
            var messageTxt="请确认是否添加用户 <b>"+this.displayNameField.get("value")+" - "+this.userIdField.get("value")+"</b> .";
            var that=this;
            var confirmButtonAction=function(){
                that._doAddUserProfile();
            };
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-save'></i> 添加",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        _doAddUserProfile:function(){
            var userProfileData={};
            userProfileData.displayName=this.displayNameField.get("value");
            userProfileData.userId=this.userIdField.get("value");
            userProfileData.title=this.titleField.get("value");
            userProfileData.emailAddress=this.emailAddressField.get("value");
            userProfileData.mobilePhone=this.mobilePhoneField.get("value");
            userProfileData.fixedPhone=this.fixedPhoneField.get("value");
            userProfileData.address=this.addressField.get("value");
            userProfileData.postalCode=this.postalCodeField.get("value");
            userProfileData.description=this.descriptionField.get("value");
            userProfileData.participantScope= APPLICATION_ID;
            userProfileData.roleType=this.roleTypeSelect.get("value");
            var userProfileDataContent=dojo.toJson(userProfileData);
            var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/addUser/";
            var errorCallback= function(data){
                UI.hideProgressDialog();
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var timer = new dojox.timing.Timer(500);
                timer.onTick = function(){
                    UI.hideProgressDialog();
                    timer.stop();
                };
                timer.start();
                if(data){
                    UI.showToasterMessage({type:"success",message:"添加用户成功"});
                    if(that.callback){
                        that.callback(data);
                    }else{
                        Application.AttributeContext.setAttribute(USER_PROFILE,data);
                        Application.MessageUtil.publishMessage(APP_USERLOGIN_PARTICIPANTINFO_REFRESH_EVENT,{});
                    }
                    that.doCloseContainerDialog();
                }
            };
            UI.showProgressDialog("添加用户");
            Application.WebServiceUtil.postJSONData(resturl,userProfileDataContent,loadCallback,errorCallback);
        },
        doCloseContainerDialog:function(){},
        _endOfCode: function(){}
    });
});