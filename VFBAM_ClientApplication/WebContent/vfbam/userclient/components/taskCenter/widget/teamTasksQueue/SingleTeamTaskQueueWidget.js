require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/taskCenter/widget/teamTasksQueue/template/SingleTeamTaskQueueWidget.html",
    "gridx/Grid","gridx/core/model/cache/Async",
    "gridx/modules/VirtualVScroller","gridx/modules/Pagination",
    "gridx/modules/pagination/PaginationBar",'gridx/modules/CellWidget','gridx/modules/Edit',
    'gridx/modules/Sort','gridx/modules/Focus','gridx/modules/ColumnResizer',"gridx/modules/Menu","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,Grid,Cache,VirtualVScroller,Pagination,PaginationBar,CellWidget,Edit,Sort,Focus,ColumnResizer,Menu,domGeom){
    declare("vfbam.userclient.components.taskCenter.widget.teamTasksQueue.SingleTeamTaskQueueWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        toolsDockChangeHandler:null,
        application_operationPanelContainer:null,
        dateDisplayFormat:null,
        timeDisplayFormat:null,
        taskListPopupMenu:null,
        switchPagePayload:null,
        teamTasksQueueGrid:null,
        teamTaskListStore:null,
        activeGridRowIndex:null,
        postCreate: function(){
            console.log("SingleTeamTaskQueueWidget created");
            this.switchPagePayload={};
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]={};
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_STATUS"]="STATIC";
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_TYPE"]="TASK_CENTER";

            this.dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            this.timeDisplayFormat={datePattern: "HH:MM", selector: "time"};

            this.taskListPopupMenu=new dijit.Menu({ style: "display: none;"});
            var menuItem_open = new dijit.MenuItem({
                label: "<i class='icon-tag'></i> 查看任务详情",
                onClick:dojo.hitch(this,this.doOpenTaskByContext)
            });
            this.taskListPopupMenu.addChild(menuItem_open);
            var menuItem_accept = new dijit.MenuItem({
                label: "<i class='icon-check'></i> 接受任务",
                onClick:dojo.hitch(this,this.doAcceptTaskByContext)
            });
            this.taskListPopupMenu.addChild(menuItem_accept);
            var menuItem_assign = new dijit.MenuItem({
                label: "<i class='icon-male'></i> 分配任务",
                onClick:dojo.hitch(this,this.doAssignTaskByContext)
            });
            this.taskListPopupMenu.addChild(menuItem_assign);

            var teamTaskQueue1ParamsArray=[];
            if(this.taskQueueData&&this.taskQueueData.exposedDataFields){
                var teamTaskQueueDataFieldsDefine=  this.taskQueueData.exposedDataFields;
                dojo.forEach(teamTaskQueueDataFieldsDefine,function(dataFieldDefine){
                    var paramName=dataFieldDefine.fieldName;
                    var paramLabel=dataFieldDefine.displayName;
                    var paramType=dataFieldDefine.fieldType;
                    var isMulti=dataFieldDefine.arrayField;
                    teamTaskQueue1ParamsArray.push({paramName:paramName,paramLabel:paramLabel,paramType:paramType,isMulti:isMulti});
                });
            }
            var resultStructureLayout= this.buildTaskDisplayFieldsStructure(teamTaskQueue1ParamsArray);

            //init grid
            var items=[];
            if(this.taskQueueData&&this.taskQueueData.activitySteps){
                var teamQueueTasksData=this.taskQueueData.activitySteps;
                var teamTaskQueueDataFieldsDefine=  this.taskQueueData.exposedDataFields;
                dojo.forEach(teamQueueTasksData,function(singleTaskData){
                    var taskData={
                        taskName: singleTaskData.activityStepName,
                        activityInfo:singleTaskData.activityType+"("+singleTaskData.activityId+")",
                        createDate:new Date(singleTaskData.createTime),
                        taskId:singleTaskData.activityId+"-"+singleTaskData.activityStepDefinitionKey,
                        activityName:singleTaskData.activityType,
                        activityId:singleTaskData.activityId,
                        taskOperations: singleTaskData.activityId+"-"+singleTaskData.activityStepDefinitionKey
                    };
                    if(singleTaskData.relatedRole){
                        taskData.taskRoleID=singleTaskData.relatedRole.roleName; //needed for refresh queueTaskList
                    }
                    var taskDataFields=[];
                    var taskDataDetailInfo=singleTaskData.activityDataFieldValueList.activityDataFieldValueList;
                    if(taskDataDetailInfo){
                        dojo.forEach(taskDataDetailInfo,function(taskDataDetail){
                            var fieldDefinition=taskDataDetail.activityDataDefinition;
                            var propertyValue={};
                            propertyValue["name"]=fieldDefinition.displayName;
                            propertyValue["fieldName"]=fieldDefinition.fieldName;
                            propertyValue["type"]=fieldDefinition.fieldType;
                            propertyValue["multipleValue"]=fieldDefinition.arrayField;
                            propertyValue["required"]=fieldDefinition.mandatoryField;
                            if(fieldDefinition.arrayField){
                                propertyValue["value"]=taskDataDetail.arrayDataFieldValue;
                            }else{
                                propertyValue["value"]=taskDataDetail.singleDataFieldValue;
                            }
                            propertyValue["writable"]=fieldDefinition.writeableField;
                            propertyValue["readable"]=fieldDefinition.readableField;
                            taskDataFields.push(propertyValue);
                        });
                    }
                    taskData["taskDataFields"] = taskDataFields;
                    if(singleTaskData.relatedRole){
                        taskData["taskRole"] = singleTaskData.relatedRole.displayName;
                    }
                    taskData["dueDate"] = new Date(singleTaskData.dueDate);
                    taskData["stepAssignee"] = singleTaskData.stepAssignee;
                    taskData["stepOwner"] = singleTaskData.stepOwner;
                    taskData["taskDueStatus"] = singleTaskData["dueStatus"];
                    taskData["taskResponse"]=singleTaskData["stepResponse"];
                    if(singleTaskData.stepProcessEditor){
                        taskData["stepProcessEditor"] = singleTaskData.stepProcessEditor;
                    }
                    var currentTaskDataFieldsArray=singleTaskData.activityDataFieldValueList.activityDataFieldValueList;
                    dojo.forEach(teamTaskQueueDataFieldsDefine,function(dataFieldDefination){
                        var currentDataFieldDefinationName=dataFieldDefination.fieldName;
                        dojo.forEach(currentTaskDataFieldsArray,function(currentTaskDataField){
                            if(currentTaskDataField.activityDataDefinition.fieldName==currentDataFieldDefinationName){
                                if(currentTaskDataField.activityDataDefinition.arrayField){
                                    taskData[currentDataFieldDefinationName]=currentTaskDataField.arrayDataFieldValue;
                                }else{
                                    taskData[currentDataFieldDefinationName]=currentTaskDataField.singleDataFieldValue;
                                }
                            }
                        });
                    });
                    items.push(taskData);
                });
            }
            var data = {
                identifier: 'taskId',
                label: 'id',
                items:items
            };
            this.teamTaskListStore=new dojo.store.Memory({data: data,idProperty: "taskId"});
            this.teamTasksQueueGrid = new Grid(lang.mixin({
                style:"height:100%;width:100%",
                'class': 'gridxAlternatingRows gridxWholeRow',
                cacheClass: Cache,
                selectionMode:"multiple",
                store:this.teamTaskListStore,
                structure: resultStructureLayout,
                modules: [
                    VirtualVScroller,
                    CellWidget,
                    Sort,
                    ColumnResizer,
                    Pagination,
                    PaginationBar,
                    Menu
                ],
                selectRowTriggerOnCell: true}, {}),this.taskGridContainer);
            this.teamTasksQueueGrid.startup();
            this.teamTasksQueueGrid.connect(this.teamTasksQueueGrid,"onRowDblClick",dojo.hitch(this,this.doOpenTaskFromGrid));
            this.teamTasksQueueGrid.connect(this.teamTasksQueueGrid,"onRowContextMenu",dojo.hitch(this,this.doPopupContextMenu));
            this.teamTasksQueueGrid.connect(this.teamTasksQueueGrid,"onHeaderContextMenu",dojo.hitch(this,this.hideMenuOnHeader));

            var that=this;
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
            	var resizeObj={};
                var marginBox = dojo.getMarginBox(that.domNode);
                resizeObj.w=marginBox.w;
                that.teamTasksQueueGrid.resize(resizeObj);
                that.handleReloadTaskQueueTab();
                timer.stop();
            };
            timer.start();
         },
        handleSizeChange:function(){
            var resizeObj={};
            var marginBox = dojo.getMarginBox(this.domNode);
            resizeObj.w=marginBox.w;
            this.teamTasksQueueGrid.resize(resizeObj);
        },
        handleReloadTaskQueueTab:function(){
            var that=this;
            var timer = new dojox.timing.Timer(100);
            timer.onTick = function(){
                var resizeObj={};
                var marginBox = dojo.getMarginBox(that.domNode);
                resizeObj.w=marginBox.w;
                that.teamTasksQueueGrid.resize(resizeObj);
                that.teamTasksQueueGrid.setStore(that.teamTaskListStore);
                timer.stop();
            };
            timer.start();
        },
        buildTaskDisplayFieldsStructure:function(buinessParamsArray){
            //"STRING" "BINARY" "LONG" "DOUBLE" "BOOLEAN" "DATE" "DECIMAL"
            var that=this;
            var _system_String_Prop_Decorator=  function(data){
                if(!data){return ""};
                return '<span style="font-weight: bold;font-size: 0.9em;">'+data+'</span>';
            };
            var _system_Date_Prop_Decorator=  function(data){
                if(!data){return ""};
                var dateStr=dojo.date.locale.format(data,that.dateDisplayFormat)+" "+ dojo.date.locale.format(data,that.timeDisplayFormat);
                return '<span style="font-weight: bold;font-size: 0.8em;">'+dateStr+'</span>';
            };
            var _STRING_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _BINARY_Value_Decorator = function(data){
                if(!data){return ""};
                return "<i class='icon-paper-clip'></i>";
            };
            var _LONG_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _DOUBLE_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _BOOLEAN_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _DATE_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _STRING_ARRAY_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _BINARY_ARRAY_Value_Decorator = function(data){
                if(!data){return ""};
                return "<i class='icon-paper-clip'></i>";
            };
            var _LONG_ARRAY_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _DOUBLE_ARRAY_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _BOOLEAN_ARRAY_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var _DATE_ARRAY_Value_Decorator = function(data){
                if(!data){return ""};
                return '<span>'+data+'</span>';
            };
            var resultStructureLayout=[];
            resultStructureLayout.push({id: 'taskName', field: 'taskName', name: '<i class="icon-tag"></i> 任务名称',decorator: _system_String_Prop_Decorator});
            resultStructureLayout.push({id: 'activityInfo', field: 'activityInfo', name: '<i class="icon-retweet"></i> 所属活动',decorator: _system_String_Prop_Decorator});
            resultStructureLayout.push({id: 'createDate', field: 'createDate', name: '<i class="icon-time"></i> 创建时间',decorator: _system_Date_Prop_Decorator});
            for(i=0;i<buinessParamsArray.length;i++){
                var currentParamConfig= {id: buinessParamsArray[i].paramName, field: buinessParamsArray[i].paramName, name: buinessParamsArray[i].paramLabel};
                if(buinessParamsArray[i].paramType=="STRING"){
                    if(buinessParamsArray[i].isMulti){
                        currentParamConfig["decorator"]= _STRING_ARRAY_Value_Decorator;
                    }else{
                        currentParamConfig["decorator"]= _STRING_Value_Decorator;
                    }
                }
                if(buinessParamsArray[i].paramType=="BINARY"){
                    if(buinessParamsArray[i].isMulti){
                        currentParamConfig["decorator"]= _BINARY_ARRAY_Value_Decorator;
                    }else{
                        currentParamConfig["decorator"]= _BINARY_Value_Decorator;
                    }
                }
                if(buinessParamsArray[i].paramType=="LONG"){
                    if(buinessParamsArray[i].isMulti){
                        currentParamConfig["decorator"]= _LONG_ARRAY_Value_Decorator;
                    }else{
                        currentParamConfig["decorator"]= _LONG_Value_Decorator;
                    }
                }
                if(buinessParamsArray[i].paramType=="DOUBLE"){
                    if(buinessParamsArray[i].isMulti){
                        currentParamConfig["decorator"]= _DOUBLE_ARRAY_Value_Decorator;
                    }else{
                        currentParamConfig["decorator"]= _DOUBLE_Value_Decorator;
                    }
                }
                if(buinessParamsArray[i].paramType=="DECIMAL"){
                    if(buinessParamsArray[i].isMulti){
                        currentParamConfig["decorator"]= _DOUBLE_ARRAY_Value_Decorator;
                    }else{
                        currentParamConfig["decorator"]= _DOUBLE_Value_Decorator;
                    }
                }
                if(buinessParamsArray[i].paramType=="BOOLEAN"){
                    if(buinessParamsArray[i].isMulti){
                        currentParamConfig["decorator"]= _BOOLEAN_ARRAY_Value_Decorator;
                    }else{
                        currentParamConfig["decorator"]= _BOOLEAN_Value_Decorator;
                    }
                }
                if(buinessParamsArray[i].paramType=="DATE"){
                    if(buinessParamsArray[i].isMulti){
                        currentParamConfig["decorator"]= _DATE_ARRAY_Value_Decorator;
                    }else{
                        currentParamConfig["decorator"]= _DATE_Value_Decorator;
                    }
                }
                resultStructureLayout.push(currentParamConfig);
            }
            var actionButtonDecorator = function(){
                var template="<div style='text-align: center;'><div data-dojo-type='idx.form.DropDownLink' label='"+"<b >选择</b>"+"'>"+
                    "<div data-dojo-type='dijit.Menu'>"+
                    "<div dojoType='dijit.MenuItem' data-dojo-attach-point='openTask' label='查看任务详情'></div>"+
                    "<div dojoType='dijit.MenuItem' data-dojo-attach-point='acceptTask' label='处理任务'></div>"+
                    "<div dojoType='dijit.MenuItem' data-dojo-attach-point='assignTask' label='分配任务'></div>"+
                    "</div>"+
                    "</div></div>";
                return template;
            };
            var actionButtonSetCellValue = function(data){
                this.openTask.set('label', "<i class='icon-tag'></i> 查看任务详情");
                var openTaskClickCallback=function(){that.doOpenTask(data);};
                this.openTask.set('onClick', openTaskClickCallback);

                this.acceptTask.set('label', "<i class='icon-check'></i> 接受任务");
                var acceptTaskClickCallback=function(){that.doAcceptTask(data);};
                this.acceptTask.set('onClick', acceptTaskClickCallback);

                this.assignTask.set('label', "<i class='icon-male'></i> 分配任务");
                var assignTaskClickCallback=function(){that.doAssignTask(data);};
                this.assignTask.set('onClick', assignTaskClickCallback);
            };
            resultStructureLayout.push({id: 'taskOperations', field: 'taskOperations', name: '<i class="icon-list"></i> 操作选项',widgetsInCell: true,
                decorator: actionButtonDecorator,setCellValue:actionButtonSetCellValue});
            return  resultStructureLayout;
        },
        doOpenTask:function(data){
            var taskData= this.teamTasksQueueGrid.model.byId(data).item;
            var taskItemData={};
            taskItemData["activityId"]= taskData.activityId;
            taskItemData["activityName"]= taskData.activityName;
            taskItemData["taskName"]= taskData.taskName ;
            taskItemData["taskId"]= taskData.taskId ;
            taskItemData["taskDataFields"] = taskData.taskDataFields;
            taskItemData["taskRole"] = taskData.taskRole;
            taskItemData["dueDate"] = taskData.dueDate;
            taskItemData["stepAssignee"] = taskData.stepAssignee;
            taskItemData["stepOwner"] = taskData.stepOwner;
            taskItemData["taskDueStatus"] = taskData.taskDueStatus;
            taskItemData["taskRoleID"]= taskData.taskRoleID ;
            taskItemData["roleQueueName"]=this.taskQueueData.queueName;
            taskItemData["taskResponse"]=taskData.taskResponse;
            taskItemData["stepProcessEditor"]=taskData.stepProcessEditor;
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT,{taskData:taskItemData,switchPagePayload:this.switchPagePayload});
        },
        doOpenTaskFromGrid:function(data){
            var currentSelectedRowIndex= data.rowIndex;
            var taskData= this.teamTasksQueueGrid.model.byIndex(currentSelectedRowIndex).item;
            var taskItemData={};
            taskItemData["activityId"]= taskData.activityId;
            taskItemData["activityName"]= taskData.activityName;
            taskItemData["taskName"]= taskData.taskName ;
            taskItemData["taskId"]= taskData.taskId ;
            taskItemData["taskDataFields"] = taskData.taskDataFields;
            taskItemData["taskRole"] = taskData.taskRole;
            taskItemData["dueDate"] = taskData.dueDate;
            taskItemData["stepAssignee"] = taskData.stepAssignee;
            taskItemData["stepOwner"] = taskData.stepOwner;
            taskItemData["taskDueStatus"] = taskData.taskDueStatus;
            taskItemData["taskRoleID"]= taskData.taskRoleID ;
            taskItemData["roleQueueName"]=this.taskQueueData.queueName;
            taskItemData["taskResponse"]=taskData.taskResponse;
            taskItemData["stepProcessEditor"]=taskData.stepProcessEditor;
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT,{taskData:taskItemData,switchPagePayload:this.switchPagePayload});
        },
        doOpenTaskByContext:function(data){
            var currentSelectedRowIndex= this.activeGridRowIndex;
            var taskData= this.teamTasksQueueGrid.model.byIndex(currentSelectedRowIndex).item;
            var taskItemData={};
            taskItemData["activityId"]= taskData.activityId;
            taskItemData["activityName"]= taskData.activityName;
            taskItemData["taskName"]= taskData.taskName ;
            taskItemData["taskId"]= taskData.taskId ;
            taskItemData["taskDataFields"] = taskData.taskDataFields;
            taskItemData["taskRole"] = taskData.taskRole;
            taskItemData["dueDate"] = taskData.dueDate;
            taskItemData["stepAssignee"] = taskData.stepAssignee;
            taskItemData["stepOwner"] = taskData.stepOwner;
            taskItemData["taskDueStatus"] = taskData.taskDueStatus;
            taskItemData["taskRoleID"]= taskData.taskRoleID ;
            taskItemData["roleQueueName"]=this.taskQueueData.queueName;
            taskItemData["taskResponse"]=taskData.taskResponse;
            taskItemData["stepProcessEditor"]=taskData.stepProcessEditor;
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT,{taskData:taskItemData,switchPagePayload:this.switchPagePayload});
        },
        hideMenuOnHeader:function(){
            this.teamTasksQueueGrid.menu.unbind(this.taskListPopupMenu, {});
        },
        doPopupContextMenu:function(e){
            this.teamTasksQueueGrid.menu.bind(this.taskListPopupMenu, {});
            if(e.rowIndex){
                this.activeGridRowIndex= e.rowIndex;
            }else{
                this.activeGridRowIndex=0;
            }
        },
        doAcceptTask:function(data){
            var taskData= this.teamTasksQueueGrid.model.byId(data).item;
            var taskItemData={};
            taskItemData["activityId"]= taskData.activityId;
            taskItemData["activityName"]= taskData.activityName;
            taskItemData["taskName"]= taskData.taskName ;
            taskItemData["taskId"]= taskData.taskId ;
            taskItemData["roleQueueName"]=this.taskQueueData.queueName;
            var taskOperationCallback=function(){
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:taskData});
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,{taskData:taskData});
            };
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_ACCEPTTASK_EVENT,{taskData:taskItemData,switchPagePayload:this.switchPagePayload,callback:taskOperationCallback});
        },
        doAssignTask:function(data){
            var taskData= this.teamTasksQueueGrid.model.byId(data).item;
            var taskItemData={};
            taskItemData["activityId"]= taskData.activityId;
            taskItemData["activityName"]= taskData.activityName;
            taskItemData["taskName"]= taskData.taskName ;
            taskItemData["taskId"]= taskData.taskId ;
            taskItemData["taskRoleID"]= taskData.taskRoleID ;
            taskItemData["roleQueueName"]=this.taskQueueData.queueName;
            var taskOperationCallback=function(){
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,{taskData:taskData});
            };
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_ASSIGNTASK_EVENT,{taskData:taskItemData,switchPagePayload:this.switchPagePayload,callback:taskOperationCallback});
        },
        doAcceptTaskByContext:function(data){
            var currentSelectedRowIndex= this.activeGridRowIndex;
            var taskData= this.teamTasksQueueGrid.model.byIndex(currentSelectedRowIndex).item;
            var taskItemData={};
            taskItemData["activityId"]= taskData.activityId;
            taskItemData["activityName"]= taskData.activityName;
            taskItemData["taskName"]= taskData.taskName ;
            taskItemData["taskId"]= taskData.taskId ;
            taskItemData["roleQueueName"]=this.taskQueueData.queueName;
            var taskOperationCallback=function(){
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:taskData});
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,{taskData:taskData});
            };
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_ACCEPTTASK_EVENT,{taskData:taskItemData,switchPagePayload:this.switchPagePayload,callback:taskOperationCallback});
        },
        doAssignTaskByContext:function(data){
            var currentSelectedRowIndex= this.activeGridRowIndex;
            var taskData= this.teamTasksQueueGrid.model.byIndex(currentSelectedRowIndex).item;
            var taskItemData={};
            taskItemData["activityId"]= taskData.activityId;
            taskItemData["activityName"]= taskData.activityName;
            taskItemData["taskName"]= taskData.taskName ;
            taskItemData["taskId"]= taskData.taskId ;
            taskItemData["taskRoleID"]= taskData.taskRoleID ;
            taskItemData["roleQueueName"]=this.taskQueueData.queueName;
            var taskOperationCallback=function(){
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,{taskData:taskData});
            };
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_ASSIGNTASK_EVENT,{taskData:taskItemData,switchPagePayload:this.switchPagePayload,callback:taskOperationCallback});
        },
        refreshQueueTaskData:function(queueTaskData){
            if(queueTaskData&&queueTaskData.activitySteps){
                var items=[];
                var teamQueueTasksData=queueTaskData.activitySteps;
                this.taskQueueData.activitySteps=teamQueueTasksData;
                if(this.taskQueueData&&this.taskQueueData.activitySteps){
                    var teamQueueTasksData=this.taskQueueData.activitySteps;
                    var teamTaskQueueDataFieldsDefine=  this.taskQueueData.exposedDataFields;
                    dojo.forEach(teamQueueTasksData,function(singleTaskData){
                        var taskData={
                            taskName: singleTaskData.activityStepName,
                            activityInfo:singleTaskData.activityType+"("+singleTaskData.activityId+")",
                            createDate:new Date(singleTaskData.createTime),
                            taskId:singleTaskData.activityId+"-"+singleTaskData.activityStepDefinitionKey,
                            activityName:singleTaskData.activityType,
                            activityId:singleTaskData.activityId,
                            taskOperations: singleTaskData.activityId+"-"+singleTaskData.activityStepDefinitionKey
                        };
                        if(singleTaskData.relatedRole){
                            taskData.taskRoleID=singleTaskData.relatedRole.roleName; //needed for refresh queueTaskList
                        }
                        var taskDataFields=[];
                        var taskDataDetailInfo=singleTaskData.activityDataFieldValueList.activityDataFieldValueList;
                        if(taskDataDetailInfo){
                            dojo.forEach(taskDataDetailInfo,function(taskDataDetail){
                                var fieldDefinition=taskDataDetail.activityDataDefinition;
                                var propertyValue={};
                                propertyValue["name"]=fieldDefinition.displayName;
                                propertyValue["fieldName"]=fieldDefinition.fieldName;
                                propertyValue["type"]=fieldDefinition.fieldType;
                                propertyValue["multipleValue"]=fieldDefinition.arrayField;
                                propertyValue["required"]=fieldDefinition.mandatoryField;
                                if(fieldDefinition.arrayField){
                                    propertyValue["value"]=taskDataDetail.arrayDataFieldValue;
                                }else{
                                    propertyValue["value"]=taskDataDetail.singleDataFieldValue;
                                }
                                propertyValue["writable"]=fieldDefinition.writeableField;
                                propertyValue["readable"]=fieldDefinition.readableField;
                                taskDataFields.push(propertyValue);
                            });
                        }
                        taskData["taskDataFields"] = taskDataFields;
                        if(singleTaskData.relatedRole){
                            taskData["taskRole"] = singleTaskData.relatedRole.displayName;
                        }
                        taskData["dueDate"] = new Date(singleTaskData.dueDate);
                        taskData["stepAssignee"] = singleTaskData.stepAssignee;
                        taskData["stepOwner"] = singleTaskData.stepOwner;
                        taskData["taskDueStatus"] = singleTaskData["dueStatus"];
                        taskData["taskResponse"]=singleTaskData["stepResponse"];
                        if(singleTaskData.stepProcessEditor){
                            taskData["stepProcessEditor"] = singleTaskData.stepProcessEditor;
                        }
                        var currentTaskDataFieldsArray=singleTaskData.activityDataFieldValueList.activityDataFieldValueList;
                        dojo.forEach(teamTaskQueueDataFieldsDefine,function(dataFieldDefination){
                            var currentDataFieldDefinationName=dataFieldDefination.fieldName;
                            dojo.forEach(currentTaskDataFieldsArray,function(currentTaskDataField){
                                if(currentTaskDataField.activityDataDefinition.fieldName==currentDataFieldDefinationName){
                                    if(currentTaskDataField.activityDataDefinition.arrayField){
                                        taskData[currentDataFieldDefinationName]=currentTaskDataField.arrayDataFieldValue;
                                    }else{
                                        taskData[currentDataFieldDefinationName]=currentTaskDataField.singleDataFieldValue;
                                    }
                                }
                            });
                        });
                        items.push(taskData);
                    });
                }
                var data = {
                    identifier: 'taskId',
                    label: 'id',
                    items:items
                };
                this.teamTaskListStore=new dojo.store.Memory({data: data,idProperty: "taskId"});
                this.teamTasksQueueGrid.setStore(this.teamTaskListStore);
            }
        },
        _endOfCode: function(){}
    });
});