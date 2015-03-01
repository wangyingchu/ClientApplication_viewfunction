require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/ActivityStepDetailWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.ActivityStepDetailWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        taskDataFieldWidgetArray:null,
        stepOwnerNarticipantNamecardWidget:null,
        stepAssigneeNarticipantNamecardWidget:null,
        postCreate: function(){
            this.taskDataFieldWidgetArray=[];
            this.activityStepNameTxt.innerHTML=this.activityStepData.activityStepName;
            this.activityTypeTxt.innerHTML=this.activityStepData.activityType+"("+this.activityStepData.activityId+")";
            var that=this;
            var timeStamp=new Date().getTime();
            this.activityStepNameTxt.id= "TaskName"+timeStamp;
            this.activityStepDescTxtPopup.set("connectId",this.activityStepNameTxt.id);
            this.activityStepDescTxtPopup.set("label",this.activityStepData.stepDescription);
            if(this.activityStepData.stepAssigneeParticipant){
                var participantInfo=this.activityStepData.stepAssigneeParticipant;
                var currentAssigneeParticipant={};
                currentAssigneeParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ participantInfo.userId;
                currentAssigneeParticipant.participantName=participantInfo.displayName;
                currentAssigneeParticipant.participantId=participantInfo.userId;
                currentAssigneeParticipant.participantTitle=participantInfo.title;
                currentAssigneeParticipant.participantDesc=participantInfo.description;
                currentAssigneeParticipant.participantAddress=participantInfo.address;
                currentAssigneeParticipant.participantPhone=participantInfo.fixedPhone;
                currentAssigneeParticipant.participantEmail=participantInfo.emailAddress;
                this.stepAssigneeNarticipantNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:currentAssigneeParticipant});
                this.stepAssignerNameLabel.set("label",currentAssigneeParticipant.participantName);
                this.stepAssignerNameLabel.set("dropDown",this.stepAssigneeNarticipantNamecardWidget);
            }else{
                dojo.style(this.stepAssignerNameLabel,"display","none");
                dojo.style(this.noneAssigneeLabelContainer,"display","");
            }

            if(this.activityStepData.stepOwnerParticipant){
                var participantInfo=this.activityStepData.stepOwnerParticipant;
                var currentOwnerParticipant={};
                currentOwnerParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ participantInfo.userId;
                currentOwnerParticipant.participantName=participantInfo.displayName;
                currentOwnerParticipant.participantId=participantInfo.userId;
                currentOwnerParticipant.participantTitle=participantInfo.title;
                currentOwnerParticipant.participantDesc=participantInfo.description;
                currentOwnerParticipant.participantAddress=participantInfo.address;
                currentOwnerParticipant.participantPhone=participantInfo.fixedPhone;
                currentOwnerParticipant.participantEmail=participantInfo.emailAddress;
                this.stepOwnerNarticipantNamecardWidget=
                    new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:currentOwnerParticipant});
                this.stepOwnerNameLabel.set("label",currentOwnerParticipant.participantName);
                this.stepOwnerNameLabel.set("dropDown",this.stepOwnerNarticipantNamecardWidget);
            }else{
                dojo.style(this.stepOwnerTxtContainer,"display","none");
            }

            if(this.activityStepData.relatedRole){
                this.stepRoleRoleTxt.innerHTML=this.activityStepData.relatedRole.displayName;
            }else{
                dojo.style(this.stepRoleTxtContainer,"display","none");
            }
            var stepStartDateStr=dojo.date.locale.format(new Date(this.activityStepData.createTime));
            this.startDateTxt.innerHTML = stepStartDateStr;
            if(this.activityStepData.finishTime>0){
                var stepFinishDateStr=dojo.date.locale.format(new Date(this.activityStepData.finishTime));
                this.finishDateTxt.innerHTML = stepFinishDateStr;
                dojo.style(this.timeCostPropertiesContainer,"display","");
                var timeCostInLong=this.activityStepData.finishTime-this.activityStepData.createTime;
                var timeCostResult=this.calcTimeCost(timeCostInLong);
                var activityStepDuration="";
                if(timeCostResult.dayCost>0){
                    activityStepDuration=activityStepDuration+timeCostResult.dayCost+"天 ";
                }if(timeCostResult.hourCost>0){
                    activityStepDuration=activityStepDuration+timeCostResult.hourCost+"小时 ";
                }if(timeCostResult.minuteCost>0){
                    activityStepDuration=activityStepDuration+timeCostResult.minuteCost+"分钟";
                }
                if(activityStepDuration==""){
                    this.activityStepDurationTxt.innerHTML="小于1分钟";
                }else{
                    this.activityStepDurationTxt.innerHTML=activityStepDuration;
                }
            }else{
                this.finishDateTxt.innerHTML = "未完成";
            }

            this.activityStepDataFieldsNestContainer=new vfbam.userclient.common.UI.widgets.NestedContentContainer({title:"业务活动任务数据"});
            this.activityStepDataFieldsContainer.appendChild(this.activityStepDataFieldsNestContainer.domNode);

            if(this.activityStepData.activityDataFieldValueList){
                if(this.activityStepData.activityDataFieldValueList.activityDataFieldValueList){
                    var dataFieldsDataArray=this.activityStepData.activityDataFieldValueList.activityDataFieldValueList;
                    var isOdd=false;
                    dojo.forEach(dataFieldsDataArray,function(dataField){
                        var fieldValue={};
                        fieldValue["name"]=dataField.activityDataDefinition.displayName;
                        fieldValue["fieldName"]=dataField.activityDataDefinition.fieldName;
                        fieldValue["type"]=dataField.activityDataDefinition.fieldType;
                        fieldValue["multipleValue"]=dataField.activityDataDefinition.arrayField;
                        fieldValue["required"]=dataField.activityDataDefinition.mandatoryField;
                        if(dataField.activityDataDefinition.arrayField){
                            fieldValue["value"]=dataField.arrayDataFieldValue;
                        }else{
                            fieldValue["value"]=dataField.singleDataFieldValue;
                        }
                        //fieldValue["writable"]=dataField.activityDataDefinition.writeableField;
                        fieldValue["writable"]=false;
                        fieldValue["readable"]=dataField.activityDataDefinition.readableField;
                        if(fieldValue.readable){
                            var currentField=new vfbam.userclient.common.UI.components.basicTaskDataEditor.BasicTaskDataFieldWidget({taskFieldData:fieldValue});
                            if(isOdd){
                            }else{
                                currentField.setDarkBackgroundColor();
                            }
                            isOdd=!isOdd;
                            that.taskDataFieldWidgetArray.push(currentField);
                            that.activityStepDataFieldsNestContainer.addChildItem(currentField);
                        }
                    },this);
                }
            }
        },
        calcTimeCost:function(costInLong){
            var dayCost=Math.floor( costInLong / (1000*3600*24));
            var remainLongCostForHour=costInLong-dayCost*(1000*3600*24);
            var hourCost=Math.floor( remainLongCostForHour / (1000*3600));
            var remainLongCostForMinute=remainLongCostForHour-hourCost*(1000*3600);
            var minuteCost=Math.floor( remainLongCostForMinute / (1000*60));
            var timeCostResult={};
            timeCostResult["dayCost"]=dayCost;
            timeCostResult["hourCost"]=hourCost;
            timeCostResult["minuteCost"]=minuteCost;
            return timeCostResult;
        },
        showActivityInstanceDetail:function(){
            var resturl=ACTIVITY_SERVICE_ROOT+"activityInstanceDetail/"+APPLICATION_ID+"/"+this.activityStepData.activityId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                that.doShowActivityInstanceDetail(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        doShowActivityInstanceDetail:function(activityInstanceData){
            this.activityInstanceDetail=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityInstanceDetailWidget({activityInstanceData:activityInstanceData});
            var	dialog = new Dialog({
                style:"width:760px;",
                title: "<i class='icon-info-sign'></i> 业务活动详情",
                content: "",
                buttons:null,
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(this.activityInstanceDetail.containerNode, dialog.containerNode);
            dialog.show();
            var that=this;
            var closeDialogCallBack=function(){
                that.activityInstanceDetail.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        destroy:function(){
            if(this.stepOwnerNarticipantNamecardWidget){
                this.stepOwnerNarticipantNamecardWidget.destroy();
            }
            if(this.stepAssigneeNarticipantNamecardWidget){
                this.stepAssigneeNarticipantNamecardWidget.destroy();
            }
            if(this.activityInstanceDetail){
                this.activityInstanceDetail.destroy();
            }
            dojo.forEach(this.taskDataFieldWidgetArray,function(taskDataFieldWidget){
                taskDataFieldWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});