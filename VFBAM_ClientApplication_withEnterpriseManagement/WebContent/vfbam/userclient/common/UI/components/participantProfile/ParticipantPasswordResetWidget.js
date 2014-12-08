require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantProfile/template/ParticipantPasswordResetWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.participantProfile.ParticipantPasswordResetWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true, 
        facePhotoPath:null,
        postCreate: function(){
        	if(this.participantId){        		
        		this.facePhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+this.participantId;
        		var dateTimeStamp=""+new Date().getTime();        	
            	this.participantFacePhoto.src=this.facePhotoPath+"?timestamp="+dateTimeStamp;
            	var userProfileData=Application.AttributeContext.getAttribute(USER_PROFILE);
            	var currentUserInfo=userProfileData.displayName+"("+userProfileData.userId+")";
            	this.currentUserInfoField.innerHTML=currentUserInfo;            	
        	}	
        },  
        updateParticipantPassword: function(){
        	var validationResult=true;        	
        	if(!this.currentPasswordField.isValid()){
        		UI.showToasterMessage({type:"warning",message:"请输入当前登录密码"});
        		validationResult=false;
        	}
        	if(!this.newPasswordField.isValid()){
        		UI.showToasterMessage({type:"warning",message:"请输入新登录密码 "});
        		validationResult=false;
        	}
        	if(!this.confirmNewPasswordField.isValid()){
        		UI.showToasterMessage({type:"warning",message:"请重复输入新登录密码"});
        		validationResult=false;
        	}
        	if(!validationResult){
        		return;
        	}   
        	var newPassword=this.newPasswordField.get("value");
        	var confirmNewPassword=this.confirmNewPasswordField.get("value");        	
        	if(newPassword!=confirmNewPassword){
        		UI.showToasterMessage({type:"error",message:"新登录密码与新确认密码内容不符"});
        		return;
        	}
        	if(newPassword.length<5){
        		var errorDialogDataObj={};
        		var okButtonAction=function(){};        	    	
    	    	errorDialogDataObj.message="密码长度至少为5位";
    	    	errorDialogDataObj.oKButtonAction=okButtonAction;
    	    	errorDialogDataObj.oKButtonLabel="确定";
    	    	UI.showErrorDialog(errorDialogDataObj);
    	    	return;
        	}        	
        	var currentPassword=this.currentPasswordField.get("value");
        	var changePasswordDataObj={};
        	changePasswordDataObj.currentPassword=currentPassword;
        	changePasswordDataObj.newPassword=newPassword;
        	changePasswordDataObj.userId=this.participantId;
            changePasswordDataObj.participantScope= APPLICATION_ID;
        	var changePasswordDataContent=dojo.toJson(changePasswordDataObj);        	
        	var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/changePassword/";
        	var errorCallback= function(data){
        	    UI.hideProgressDialog();
        	    UI.showSystemErrorMessage(data);
        	};
        	var that=this;
        	var loadCallback=function(data){
        	    UI.hideProgressDialog(); 
        	    if(data.changePasswordResult){   
        	    	var infoDialogDataObj={};
        	    	var okButtonAction=function(){that.doCloseContainerDialog();};        	    	
        	    	infoDialogDataObj.message="用户登录密码重置成功";
        	    	infoDialogDataObj.oKButtonAction=okButtonAction;
        	    	infoDialogDataObj.oKButtonLabel="确定";
        	    	UI.showInfoDialog(infoDialogDataObj);        	    	
        	    }else{
        	    	var errorDialogDataObj={};
        	    	var okButtonAction=function(){};        	    	
        	    	errorDialogDataObj.message=data.returnMessage;
        	    	errorDialogDataObj.oKButtonAction=okButtonAction;
        	    	errorDialogDataObj.oKButtonLabel="确定";
        	    	UI.showErrorDialog(errorDialogDataObj);
        	    }
        	};
        	UI.showProgressDialog("重置用户登录密码");
        	Application.WebServiceUtil.postJSONData(resturl,changePasswordDataContent,loadCallback,errorCallback);
        },
        doCloseContainerDialog: function(){},
        _endOfCode: function(){}
    });
});