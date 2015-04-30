require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/taskCenter/widget/myTasksList/template/MyTaskMagazineViewItemWidget.html","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.components.taskCenter.widget.myTasksList.MyTaskMagazineViewItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        switchPagePayload:null,
        doubleClickEventConnectionHandler:null,
        propertyArray:null,
        postCreate: function(){
            this.switchPagePayload={};
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]={};
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_STATUS"]="STATIC";
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_TYPE"]="TASK_CENTER";
            this.propertyArray=[];
            this.taskName.innerHTML=  this.taskItemData.taskName;
            this.activityName.innerHTML=" - "+  this.taskItemData.activityName+" ";
            this.activityId.innerHTML=  "("+this.taskItemData.activityId+")";
            if(this.taskItemData.taskRole) {
                this.taskRole.innerHTML=  this.taskItemData.taskRole;
            }else{
                this.taskRole.innerHTML=  "-";
            }
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            if(this.taskItemData.taskDueDate.getTime()==0){
                this.taskDueDate.innerHTML="-";
            }else{
                var dateString=dojo.date.locale.format(this.taskItemData.taskDueDate,dateDisplayFormat);
                var timeString=dojo.date.locale.format(this.taskItemData.taskDueDate,timeDisplayFormat);
                this.taskDueDate.innerHTML= dateString+" "+timeString;
            }
            if(this.taskItemData.taskDueStatus=="NODEU"){
                this.taskStatusIcon.innerHTML="<i class='icon-inbox icon-large' style='padding-right: 5px;color: #26A251'></i>";
            }
            if(this.taskItemData.taskDueStatus=="OVERDUE"){
                this.taskStatusIcon.innerHTML="<i class='icon-warning-sign icon-large' style='padding-right: 5px;color: #CE0000'></i>";
            }
            if(this.taskItemData.taskDueStatus=="DUETODAY"){
                this.taskStatusIcon.innerHTML="<i class='icon-time icon-large' style='padding-right: 5px;color: #FAC126'></i>";
            }
            if(this.taskItemData.taskDueStatus=="DUETHISWEEK"){
                this.taskStatusIcon.innerHTML="<i class='icon-calendar icon-large' style='padding-right: 5px;color: #666666'></i>";
            }

            this.doubleClickEventConnectionHandler=dojo.connect(this.domNode,"ondblclick",dojo.hitch(this,this.openTaskDetail));
            var that=this;
            var menu_operationCollection=new dijit.DropDownMenu({ style: "display: none;"});
            var label="<i class='icon-caret-down icon-border icon-large'></i>";
            this.taskOperationsDropdownButton=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:label,dropDown: menu_operationCollection},this.operationLink);
            var menuItem_handle = new dijit.MenuItem({
                label: "<i class='icon-share'></i> 处理任务",
                onClick:dojo.hitch(this,this.openTaskDetail)
            });
            menu_operationCollection.addChild(menuItem_handle);

            if(!this.taskItemData.hasParentActivityStep){
                if(this.taskItemData.taskRole) {
                    var returnTaskOperationCallback = function () {
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT, {taskData: that.taskItemData});
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT, {taskData: that.taskItemData});
                    };
                    var menuItem_return = new dijit.MenuItem({
                        label: "<i class='icon-download-alt'></i> 返还任务",
                        onClick: function () {
                            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT, {
                                taskData: that.taskItemData,
                                switchPagePayload: that.switchPagePayload,
                                callback: returnTaskOperationCallback
                            });
                        }
                    });
                    menu_operationCollection.addChild(menuItem_return);
                    var reassignTaskOperationCallback = function () {
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT, {taskData: that.taskItemData});
                    };
                    var menuItem_reasign = new dijit.MenuItem({
                        label: "<i class='icon-male'></i> 重新分配",
                        onClick: function () {
                            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_REASSIGNTASK_EVENT, {
                                taskData: that.taskItemData,
                                switchPagePayload: that.switchPagePayload,
                                callback: reassignTaskOperationCallback
                            });
                        }
                    });
                    menu_operationCollection.addChild(menuItem_reasign);
                }
            }

            if(this.taskItemData.taskDataFields){
                dojo.forEach(this.taskItemData.taskDataFields,function(item){
                    var currentProperty=new vfbam.userclient.components.taskCenter.widget.myTasksList.TaskPropertyWidget(item);
                    this.taskpropertiesContainer.appendChild(currentProperty.domNode);
                    this.propertyArray.push(currentProperty);
                },this);
            }
        },
        openTaskDetail:function(){
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT,{taskData:this.taskItemData,switchPagePayload:this.switchPagePayload});
        },
        destroy:function(){
            dojo.disconnect(this.doubleClickEventConnectionHandler);
            dojo.forEach(this.propertyArray,function(propertyItem){
                propertyItem.destroy();
            });
            this.inherited("destroy",arguments);
        },
        updateModifiedData:function(updatedTaskDataArray){
            dojo.forEach(updatedTaskDataArray,function(updatedTaskData){
                var updatedPropertyName=updatedTaskData.name;
                var updatedPropertyValue=updatedTaskData.value;
                dojo.forEach(this.taskItemData.taskDataFields,function(currentProperty){
                    if(currentProperty.name==updatedPropertyName){
                        currentProperty.value=updatedPropertyValue;
                        return;
                    }
                },this);
            },this);
            dojo.forEach(this.propertyArray,function(propertyItem){
                propertyItem.destroy();
            });
            this.propertyArray=[];
            if(this.taskpropertiesContainer){
                dojo.empty(this.taskpropertiesContainer);
                if(this.taskItemData.taskDataFields){
                    dojo.forEach(this.taskItemData.taskDataFields,function(item){
                        var currentProperty=new vfbam.userclient.components.taskCenter.widget.myTasksList.TaskPropertyWidget(item);
                        this.taskpropertiesContainer.appendChild(currentProperty.domNode);
                        this.propertyArray.push(currentProperty);
                    },this);
                }
            }
        },
        getTaskItemData:function(){
            return this.taskItemData;
        },
        _endOfCode: function(){}
    });
});