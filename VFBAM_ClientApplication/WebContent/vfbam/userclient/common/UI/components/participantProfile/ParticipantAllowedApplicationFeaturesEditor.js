require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantProfile/template/ParticipantAllowedApplicationFeaturesEditor.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.participantProfile.ParticipantAllowedApplicationFeaturesEditor", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        availableFeatureOptionList:null,
        postCreate: function(){
            this.availableFeatureOptionList=[];
            if(this.availableApplicationFeatures){
                this.renderAvailableFeaturesList(this.availableApplicationFeatures);
            }
            this.setParticipantCurrentAllowedFeatures();
        },
        renderAvailableFeaturesList:function(featureCodeList){
            dojo.forEach(featureCodeList,function(currentCode){
                var currentOption=new vfbam.userclient.common.UI.components.participantProfile.AvailableApplicationFeatureOption({featureCode:currentCode});
                this.featuresSelectorContainer.appendChild(currentOption.domNode);
                this.availableFeatureOptionList.push(currentOption);
            },this);
        },
        setParticipantCurrentAllowedFeatures:function(){
            dojo.forEach(this.availableFeatureOptionList,function(currentOption){
                var currentOptionValue=currentOption.getOptionValue();
                if(this.isAllowedFeature(currentOptionValue)){
                    currentOption.checkOption();
                }
            },this);
        },
        isAllowedFeature:function(currentOptionValue){
            var currentAllowedList= this.participantProfile.allowedFeatureCategories;
            if(currentAllowedList){
                var checkResult=false;
                dojo.forEach(currentAllowedList,function(allowedValue){
                    if(allowedValue==currentOptionValue){
                        checkResult=checkResult|true;
                    }
                },this);
                return checkResult;
            }else{
                return false;
            }
        },
        updateAllowedApplicationFeatures:function(){
            var newAllowedFeatureList=[];
            dojo.forEach(this.availableFeatureOptionList,function(currentOption){
               if(currentOption.isOptionChecked()){
                   newAllowedFeatureList.push(currentOption.getOptionValue());
               }
            },this);
            var participantInfoToUpdate=this.participantProfile;
            var orginalAllowedFeatureCategories =participantInfoToUpdate.allowedFeatureCategories;
            participantInfoToUpdate.allowedFeatureCategories=newAllowedFeatureList;
            var messageTxt="<b>请确认是否更新用户:</b>' "+participantInfoToUpdate.displayName +" - "+participantInfoToUpdate.userId+" '可使用的系统功能。";
            var confirmButtonAction=function(){
                var userProfileDataContent=dojo.toJson(participantInfoToUpdate);
                var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/updateAllowedFeatureCategories/";
                var errorCallback= function(data){
                    participantInfoToUpdate.allowedFeatureCategories=orginalAllowedFeatureCategories;
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    participantInfoToUpdate=data;
                    UI.showToasterMessage({type:"success",message:"更新用户<b>"+data.displayName+"</b>可使用的系统功能成功"});

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
        },
        doCloseContainerDialog:function(){},
        _endOfCode: function(){}
    });
});