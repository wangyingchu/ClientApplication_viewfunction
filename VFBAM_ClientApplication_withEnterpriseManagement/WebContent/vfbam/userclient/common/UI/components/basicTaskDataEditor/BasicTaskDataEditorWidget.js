require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskDataEditor/template/BasicTaskDataEditorWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.basicTaskDataEditor.BasicTaskDataEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        taskDataFieldWidgetArray:null,
        currentTaskItemData:null,
        postCreate: function(){
            this.taskDataFieldWidgetArray=[];
        },
        //interface method used to render task data
        RENDER_TASKDATA:function(taskItemData,dynamicPageId){
            this.currentTaskItemData= taskItemData;
            var taskDataField=taskItemData.taskDataFields;
            var isOdd=true;
            dojo.forEach(taskDataField,function(dataField){
                if(dataField.readable){
                    var currentField=new vfbam.userclient.common.UI.components.basicTaskDataEditor.BasicTaskDataFieldWidget({taskFieldData:dataField});
                    if(isOdd){
                    }else{
                        currentField.setDarkBackgroundColor();
                    }
                    isOdd=!isOdd;
                    this.taskDataFieldsContainer.appendChild(currentField.domNode);
                    this.taskDataFieldWidgetArray.push(currentField);
                }
            },this);
        },
        //interface method used to save task data
        SAVE_TASKDATA:function(completeCallback){
            var that=this;
            var modifiedDataArray=[];
            dojo.forEach(this.taskDataFieldWidgetArray,function(taskDataFieldWidget){
                var fieldCheckResult=taskDataFieldWidget.isModified();
                if(fieldCheckResult){
                    modifiedDataArray.push(taskDataFieldWidget.getModifiedData());
                }
            },this);
            if(modifiedDataArray.length>0){
                var taskDataDetailObject={};
                taskDataDetailObject["activityStepOperationVO"]={};
                taskDataDetailObject["activityStepOperationVO"]["activitySpaceName"]=APPLICATION_ID;
                taskDataDetailObject["activityStepOperationVO"]["activityType"]=this.currentTaskItemData.activityName;
                taskDataDetailObject["activityStepOperationVO"]["activityStepName"]=this.currentTaskItemData.taskName;
                taskDataDetailObject["activityStepOperationVO"]["activityId"]=this.currentTaskItemData.activityId;
                if(this.currentTaskItemData.stepAssignee){
                    taskDataDetailObject["activityStepOperationVO"]["currentStepOwner"]=this.currentTaskItemData.stepAssignee;
                }else{
                    taskDataDetailObject["activityStepOperationVO"]["currentStepOwner"]=null;
                }
                if(this.currentTaskItemData.taskRoleID){
                    taskDataDetailObject["activityStepOperationVO"]["activityStepRelatedRole"]=this.currentTaskItemData.taskRoleID;
                }else{
                    taskDataDetailObject["activityStepOperationVO"]["activityStepRelatedRole"]=null;
                }
                if(this.currentTaskItemData.roleQueueName){
                    taskDataDetailObject["activityStepOperationVO"]["activityStepRelatedRoleQueue"]=this.currentTaskItemData.roleQueueName
                }else{
                    taskDataDetailObject["activityStepOperationVO"]["activityStepRelatedRoleQueue"]=null;
                }
                taskDataDetailObject["activityDataFieldValueList"]={};
                taskDataDetailObject["activityDataFieldValueList"]["activityDataFieldValueList"]=[];
                dojo.forEach(modifiedDataArray,function(currentModifiedData){
                    var currentModifiedDataObj={};
                    if(currentModifiedData.multipleValue){
                        if(currentModifiedData.type=="DATE"){
                            var dateTimeArray=[];
                            dojo.forEach(currentModifiedData.value,function(currentDate){
                                dateTimeArray.push(""+currentDate.getTime());
                            });
                            currentModifiedDataObj.arrayDataFieldValue=dateTimeArray;
                        }else{
                            currentModifiedDataObj.arrayDataFieldValue=currentModifiedData.value;
                        }
                    }else{
                          if(currentModifiedData.type=="DATE"){
                              if(currentModifiedData.value){
                                  currentModifiedDataObj.singleDataFieldValue=""+currentModifiedData.value.getTime();
                              }else{
                                  currentModifiedDataObj.singleDataFieldValue="";
                              }

                          }else{
                              currentModifiedDataObj.singleDataFieldValue=""+currentModifiedData.value;
                          }
                    }
                    var dataFieldDefination={};
                    dataFieldDefination.displayName=currentModifiedData.name;
                    dataFieldDefination.fieldName=currentModifiedData.fieldName;
                    dataFieldDefination.fieldType=currentModifiedData.type;
                    dataFieldDefination.arrayField=currentModifiedData.multipleValue;
                    dataFieldDefination.mandatoryField=currentModifiedData.required;
                    currentModifiedDataObj.activityDataDefinition=dataFieldDefination;
                    taskDataDetailObject["activityDataFieldValueList"]["activityDataFieldValueList"].push(currentModifiedDataObj);
                });

                var modifiedDataContent=dojo.toJson(taskDataDetailObject);
                var resturl=ACTIVITY_SERVICE_ROOT+"saveTaskData/";
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
                        UI.showToasterMessage({type:"success",message:"保存任务数据成功"});
                        var updatedTaskDataArray=modifiedDataArray;
                        var taskItemData=that.currentTaskItemData.taskDataFields;
                        dojo.forEach(updatedTaskDataArray,function(updatedTaskData){
                            var updatedPropertyName=updatedTaskData.name;
                            var updatedPropertyValue=updatedTaskData.value;
                            dojo.forEach(taskItemData,function(currentProperty){
                                if(currentProperty.name==updatedPropertyName){
                                    currentProperty.value=updatedPropertyValue;
                                    return;
                                }
                            },this);
                        },this);
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_TASKDATAUPDATED_EVENT,{taskItemData:that.currentTaskItemData,updatedTaskData:modifiedDataArray});
                    }
                };
                UI.showProgressDialog("保存数据");
                Application.WebServiceUtil.postJSONData(resturl,modifiedDataContent,loadCallback,errorCallback);
            }else{
                UI.showToasterMessage({type:"info",message:"无数据变更，不需保存任务数据"});
            }
            if(completeCallback){
                completeCallback();
            }
        },
        //interface method used to check if there is any dirty task data
        CHECK_DIRTY_TASKDATA:function(completeCallback){
            //true meaning data is dirty
            var checkResult=false;
            dojo.forEach(this.taskDataFieldWidgetArray,function(taskDataFieldWidget){
                var fieldCheckResult=taskDataFieldWidget.isModified();
                if(fieldCheckResult){
                    checkResult=true;
                }
            },this);
            if(completeCallback){
                completeCallback();
            }
            return checkResult;
        },
        //interface method used to validate task data
        VALIDATE_TASKDATA:function(completeCallback){
            var checkResult=true;
            dojo.forEach(this.taskDataFieldWidgetArray,function(taskDataFieldWidget){
                var fieldCheckResult=taskDataFieldWidget.isValidate();
                if(!fieldCheckResult){
                    checkResult=false;
                }
            },this);
            if(completeCallback){
                completeCallback();
            }
            return checkResult;
        },
        //interface method used to reset task data
        RESET_TASKDATA:function(completeCallback){
            var resetResult=false;
            dojo.forEach(this.taskDataFieldWidgetArray,function(taskDataFieldWidget){
                var fieldCheckResult=taskDataFieldWidget.isModified();
                if(fieldCheckResult){
                    taskDataFieldWidget.resetData();
                    resetResult=true;
                }
            },this);
            if(completeCallback){
                completeCallback();
            }
            return resetResult;
        },
        destroy:function(){
            dojo.forEach(this.taskDataFieldWidgetArray,function(taskDataFieldWidget){
                taskDataFieldWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});