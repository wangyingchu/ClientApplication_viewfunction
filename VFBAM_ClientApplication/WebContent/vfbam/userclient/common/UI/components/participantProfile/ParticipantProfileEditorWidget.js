require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantProfile/template/ParticipantProfileEditorWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.participantProfile.ParticipantProfileEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true, 
        facePhotoPath:null,
        postCreate: function(){
        	if(this.participantId){
        		this.facePhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+this.participantId;
        		this.participantFacePhoto.src=this.facePhotoPath;         		
        		this.updateUsetFacePhotoButton.set("label",'<i class="icon-picture"></i> 更新头像');
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
        	}	
        },
        updateUserProfile:function(){
        	var validationResult=true;        	
        	if(!this.displayNameField.isValid()){
        		UI.showToasterMessage({type:"warning",message:"请输入用户名称"});
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
        	var messageTxt="<b>请确认是否更新用户信息</b>";	
       		var that=this;
		    var confirmButtonAction=function(){		    
			   that._doUpdateUserProfile();
		    };		   
		    UI.showConfirmDialog({
		        message:messageTxt,
		        confirmButtonLabel:"<i class='icon-save'></i> 更新",
		        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
		        confirmButtonAction:confirmButtonAction		        
		    });        	
        },        
        _doUpdateUserProfile:function(){
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
        	var userProfileDataContent=dojo.toJson(userProfileData);
        	var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/detailInfo/";
        	var errorCallback= function(data){
        	    UI.hideProgressDialog();
        	    UI.showSystemErrorMessage(data);
        	};
            var that=this;
        	var loadCallback=function(data){
        	    UI.hideProgressDialog(); 
        	    if(data){
        	    	UI.showToasterMessage({type:"success",message:"用户信息更新成功"});
                    if(that.callback){
                        that.callback(data);
                    }else{
                        Application.AttributeContext.setAttribute(USER_PROFILE,data);
                        Application.MessageUtil.publishMessage(APP_USERLOGIN_PARTICIPANTINFO_REFRESH_EVENT,{});
                    }
                }
        	};
        	UI.showProgressDialog("更新用户信息");
        	Application.WebServiceUtil.postJSONData(resturl,userProfileDataContent,loadCallback,errorCallback);        	
        }, 
        updateUserFacePhoto:function(){
        	var userPhotoUploadWidget=new vfbam.userclient.common.UI.components.participantProfile.ParticipantFacePhotoUploaderWidget({participantId:this.participantId,participantProfileEditor:this});
			var dialogStyle="width:500px;";			
			var	dialog = new Dialog({						
				style:dialogStyle,
				title: "更新用户头像图片",				
				content: "",						
				closeButtonLabel: "关闭"
			});				
			dojo.place(userPhotoUploadWidget.containerNode, dialog.containerNode);
			dialog.connect(userPhotoUploadWidget, "doCloseContainerDialog", "hide");
			dialog.show();
        },
        reloadUserFacePhoto:function(){ 
        	var dateTimeStamp=""+new Date().getTime();        	
        	this.participantFacePhoto.src=this.facePhotoPath+"?timestamp="+dateTimeStamp;
        	Application.MessageUtil.publishMessage(APP_USERLOGIN_PARTICIPANTINFO_REFRESH_EVENT,{});
        },
        _endOfCode: function(){}
    });
});