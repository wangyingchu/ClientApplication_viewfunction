require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantProfile/template/NewParticipantEditorWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.participantProfile.NewParticipantEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        facePhotoPath:null,
        postCreate: function(){
            if(this.participantId){
                //this.facePhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+this.participantId;
                //this.participantFacePhoto.src=this.facePhotoPath;
                //this.updateUsetFacePhotoButton.set("label",'<i class="icon-picture"></i> 更新头像');
                /*
                var userProfileData;
                if(this.participantProfile){
                    userProfileData=this.participantProfile;
                }else{
                    userProfileData=Application.AttributeContext.getAttribute(USER_PROFILE);
                }
                this.displayNameField.set("value",dojo.trim(userProfileData.displayName));
                this.userIdField.set("value",dojo.trim(userProfileData.userId));
                this.titleField.set("value",dojo.trim(userProfileData.title));
                this.emailAddressField.set("value",dojo.trim(userProfileData.emailAddress));
                if(userProfileData.mobilePhone!="0"){
                    this.mobilePhoneField.set("value",userProfileData.mobilePhone);
                }
                if(userProfileData.fixedPhone!="0"){
                    this.fixedPhoneField.set("value",userProfileData.fixedPhone);
                }
                this.addressField.set("value",dojo.trim(userProfileData.address));
                this.postalCodeField.set("value",dojo.trim(userProfileData.postalCode));
                this.descriptionField.set("value",dojo.trim(userProfileData.description));
                */
            }







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
            var messageTxt="<b>请确认是否添加用户</b>";
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
                UI.hideProgressDialog();
                if(data){
                    UI.showToasterMessage({type:"success",message:"添加用户成功"});
                    if(that.callback){
                        that.callback(data);
                    }else{
                        Application.AttributeContext.setAttribute(USER_PROFILE,data);
                        Application.MessageUtil.publishMessage(APP_USERLOGIN_PARTICIPANTINFO_REFRESH_EVENT,{});
                    }
                }
            };
            UI.showProgressDialog("添加用户");
            Application.WebServiceUtil.postJSONData(resturl,userProfileDataContent,loadCallback,errorCallback);
        },
        _endOfCode: function(){}
    });
});