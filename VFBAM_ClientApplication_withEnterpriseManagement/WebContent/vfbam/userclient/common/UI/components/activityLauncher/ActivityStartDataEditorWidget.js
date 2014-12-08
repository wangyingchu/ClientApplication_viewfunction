require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskDataEditor/template/BasicTaskDataEditorWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.activityLauncher.ActivityStartDataEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        taskDataFieldWidgetArray:null,
        currentTaskItemData:null,
        postCreate: function(){
            this.taskDataFieldWidgetArray=[];
        },
        renderActivityLaunchData:function(launchStepDetailItemData){
            this.currentTaskItemData= launchStepDetailItemData;
            var launchDataFields=launchStepDetailItemData.launchDataFields;
            var isOdd=true;
            dojo.forEach(launchDataFields,function(dataField){
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
        validateActivityLaunchData:function(completeCallback){
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
        getActivityLaunchData:function(){
            var launchActivityDataArray=[];
            var modifiedDataArray=[];
            dojo.forEach(this.taskDataFieldWidgetArray,function(taskDataFieldWidget){
                var fieldCheckResult=taskDataFieldWidget.isModified();
                if(fieldCheckResult){
                    modifiedDataArray.push(taskDataFieldWidget.getModifiedData());
                }
            },this);
            if(modifiedDataArray.length>0){
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
                    launchActivityDataArray.push(currentModifiedDataObj);
                });
            }
            return launchActivityDataArray;
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