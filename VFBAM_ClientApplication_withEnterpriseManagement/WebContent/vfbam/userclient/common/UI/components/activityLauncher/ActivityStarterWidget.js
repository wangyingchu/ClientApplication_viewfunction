require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activityLauncher/template/ActivityStarterWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.common.UI.components.activityLauncher.ActivityStarterWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.activityType.innerHTML=this.activityTypeDefinition.activityType;
            this.activityTypeDesc.innerHTML=this.activityTypeDefinition.activityTypeDesc;
            this.startDataEditor=new vfbam.userclient.common.UI.components.activityLauncher.ActivityStartDataEditorWidget({});
            dojo.place(this.startDataEditor.domNode,this.startDataEditorContainer);
            var launchStepDetailItemData={};
            var launchStepDataArray=this.activityTypeDefinition.activityLaunchData;
            var launchStepDataDataFields=[];
            if(launchStepDataArray){
                dojo.forEach(launchStepDataArray,function(fieldDefinition){
                    var propertyValue={};
                    propertyValue["name"]=fieldDefinition.activityDataDefinition.displayName;
                    propertyValue["fieldName"]=fieldDefinition.activityDataDefinition.fieldName;
                    propertyValue["type"]=fieldDefinition.activityDataDefinition.fieldType;
                    propertyValue["multipleValue"]=fieldDefinition.activityDataDefinition.arrayField;
                    propertyValue["required"]=fieldDefinition.activityDataDefinition.mandatoryField;
                    if(fieldDefinition.arrayField){
                        propertyValue["value"]=fieldDefinition.arrayDataFieldValue;
                    }else{
                        propertyValue["value"]=fieldDefinition.singleDataFieldValue;
                    }
                    propertyValue["writable"]=true;
                    propertyValue["readable"]=true;
                    launchStepDataDataFields.push(propertyValue);
                });
            }
            launchStepDetailItemData["launchDataFields"] = launchStepDataDataFields;
            this.startDataEditor.renderActivityLaunchData(launchStepDetailItemData);

            if(this.activityTypeDefinition.launchDecisionPointChoiseList&&this.activityTypeDefinition.launchDecisionPointChoiseList.length>0){
                dojo.forEach(this.activityTypeDefinition.launchDecisionPointChoiseList,function(launchDecisionPointChoise){
                    var currentLaunchActivityButton=new dijit.form.Button({
                        label: "<i class='icon-retweet'></i> "+launchDecisionPointChoise,
                        onClick: function(){
                            that._launchActivity(launchDecisionPointChoise);
                        }
                    });
                    this.launchDecisionPointButtonsContainer.appendChild(currentLaunchActivityButton.domNode);
                },this);
            }else{
                var defaultLaunchActivityButton=new dijit.form.Button({
                    label: "<i class='icon-retweet'></i> 启动业务活动",
                    onClick: function(){
                        that._launchActivity();
                    }
                });
                this.launchDecisionPointButtonsContainer.appendChild(defaultLaunchActivityButton.domNode);
            }
            var that=this;
            var cancelLaunchActivityButton=new dijit.form.Button({
                label: "<i class='icon-remove'></i> 取消",
                onClick: function(){
                    that._cancelLaunchActivity();
                }
            });
            this.cancelLaunchActivityButtonContainer.appendChild(cancelLaunchActivityButton.domNode);
        },
        _cancelLaunchActivity:function(){
            var messageTxt="请确认是否取消启动业务活动?";
            var that=this;
            var cancelButtonAction=function(){};
            var confirmButtonAction= function(){
                that.doCloseContainerDialog();
            }
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-remove'></i> 取消启动业务活动",
                cancelButtonLabel:"<i class='icon-retweet'></i> 继续编辑",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        _launchActivity:function(launchDecisionPointChoise){
            var validateResult=this.startDataEditor.validateActivityLaunchData();
            if(validateResult){
                var messageTxt="请确认是否启动业务活动 <b>"+this.activityTypeDefinition.activityType+"</b> ?";
                var that=this;
                var cancelButtonAction=function(){};
                var continueLaunchctivityAction=function(){};
                var finishLaunchctivityAction=function(){that.doCloseContainerDialog();};
                var confirmButtonAction= function(){
                    var activityLaunchData=that.startDataEditor.getActivityLaunchData();
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var launchActivityDataObj={};
                    launchActivityDataObj["activityTypeDefinition"]=that.activityTypeDefinition;
                    launchActivityDataObj["startUserId"]=userId;
                    launchActivityDataObj["launchActivityData"]=activityLaunchData;
                    if(that.activityTypeDefinition.launchUserIdentityAttributeName){
                        launchActivityDataObj["launchUserIdentity"]=userId;
                    }
                    if(launchDecisionPointChoise){
                        launchActivityDataObj["launchDecisionPointChoise"]=launchDecisionPointChoise;
                    }
                    var launchActivityDataContent=dojo.toJson(launchActivityDataObj);
                    var resturl=ACTIVITY_SERVICE_ROOT+"launchActivity/";
                    var errorCallback= function(data){
                        UI.hideProgressDialog();
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        var timer = new dojox.timing.Timer(300);
                        timer.onTick = function(){
                            UI.hideProgressDialog();
                            timer.stop();
                        };
                        UI.hideProgressDialog();
                        if(data){
                            var successMessageTxt="业务活动 <b>"+data.activityType+"("+data.activityId+")"+"</b> 启动成功。"
                            UI.showConfirmDialog({
                                message:successMessageTxt,
                                confirmButtonLabel:"<i class='icon-retweet'></i> 继续启动业务活动",
                                cancelButtonLabel:"<i class='icon-remove'></i> 结束启动业务活动",
                                confirmButtonAction:continueLaunchctivityAction,
                                cancelButtonAction:finishLaunchctivityAction
                            });
                            UI.showToasterMessage({type:"success",message:"启动业务活动成功"});
                        }
                    };
                    UI.showProgressDialog("启动业务活动");
                    Application.WebServiceUtil.postJSONData(resturl,launchActivityDataContent,loadCallback,errorCallback);
                }
                UI.showConfirmDialog({
                    message:messageTxt,
                    confirmButtonLabel:"<i class='icon-retweet'></i> 启动业务活动",
                    cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                    confirmButtonAction:confirmButtonAction,
                    cancelButtonAction:cancelButtonAction
                });
            }else{
                UI.showToasterMessage({type:"error",message:"活动数据输入不全或存在格式错误"});
            }
        },
        doCloseContainerDialog: function(){
        },
        _endOfCode: function(){}
    });
});