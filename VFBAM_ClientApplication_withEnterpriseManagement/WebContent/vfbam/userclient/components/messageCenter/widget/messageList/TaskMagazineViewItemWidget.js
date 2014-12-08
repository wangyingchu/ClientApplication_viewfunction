require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messageList/template/TaskMagazineViewItemWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.messageCenter.widget.messageList.TaskMagazineViewItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        messageItemsContainerWidth:null,
        messageItemContentWidth:null,
        messageItemContentWidthString:null,
        clickEventConnectionHandler:null,
        doubleClickEventConnectionHandler:null,
        taskOperationsDropdownButton:null,
        switchPagePayload:null,
        postCreate: function(){
            this.switchPagePayload={};
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]={};
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_STATUS"]="STATIC";
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_TYPE"]="MESSAGE_CENTER";
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            var dateString;
            var timeString;
            if(this.taskItemData.taskDueDate.getTime()==0){
                dateString="";
                timeString="-";
            }else{
                dateString=dojo.date.locale.format(this.taskItemData.taskDueDate,dateDisplayFormat);
                timeString=dojo.date.locale.format(this.taskItemData.taskDueDate,timeDisplayFormat);
            }
            this.taskName.innerHTML=  this.taskItemData.taskName;
            this.activityName.innerHTML=this.taskItemData.activityName;
            this.activityId.innerHTML=this.taskItemData.activityId;
            this.taskDueDate.innerHTML= dateString+" "+timeString;
            this.taskDescription.innerHTML=  this.taskItemData.taskDescription;
            this.taskRole.innerHTML=  this.taskItemData.taskRole;
            this.messageItemsContainerWidth= dojo.contentBox(this.messageItemsContainer).w;
            this.messageItemContentWidth= this.messageItemsContainerWidth-200;
            this.messageItemContentWidthString=""+this.messageItemContentWidth+"px";
            dojo.style(this.taskDescription,"width",this.messageItemContentWidthString);
            this.clickEventConnectionHandler=dojo.connect(this.domNode,"onclick",dojo.hitch(this,this.selectMessageItem));
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

            if(this.taskItemData.taskRole&&this.taskItemData.taskRole!="-") {
                var returnTaskOperationCallback = function () {
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT, {taskData: that.taskItemData});
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT, {taskData: that.taskItemData});
                };
                var menuItem_return = new dijit.MenuItem({
                    label: "<i class='icon-download-alt'></i> 返还任务",
                    onClick: function () {
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT, {taskData: that.taskItemData, switchPagePayload: that.switchPagePayload, callback: returnTaskOperationCallback});
                    }
                });
                menu_operationCollection.addChild(menuItem_return);
                var reassignTaskOperationCallback = function () {
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT, {taskData: that.taskItemData});
                };
                var menuItem_reasign = new dijit.MenuItem({
                    label: "<i class='icon-male'></i> 重新分配",
                    onClick: function () {
                        Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_REASSIGNTASK_EVENT, {taskData: that.taskItemData, switchPagePayload: that.switchPagePayload, callback: reassignTaskOperationCallback});
                    }
                });
                menu_operationCollection.addChild(menuItem_reasign);
            }
        },
        selectMessageItem:function(eventObj){
            if(this.currentSelectedMessageItemArray&&this.currentSelectedMessageItemArray.length>0){
                domClass.remove(this.currentSelectedMessageItemArray[0].messageItemRootContainer, "app_magazineView_item_selected");
                this.currentSelectedMessageItemArray.splice(0, this.currentSelectedMessageItemArray.length);
            }
            domClass.add(this.messageItemRootContainer, "app_magazineView_item_selected");
            this.currentSelectedMessageItemArray.push(this);
            Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGESELECTED_EVENT,{type:"TASK",data:this.taskItemData});
        },
        openTaskDetail:function(){
            Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT,{taskData:this.taskItemData,switchPagePayload:this.switchPagePayload});
        },
        destroy:function(){
            dojo.disconnect(this.clickEventConnectionHandler);
            dojo.disconnect(this.doubleClickEventConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});