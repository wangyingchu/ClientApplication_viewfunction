require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messageList/template/TaskMagazineViewItemContainerWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.messageCenter.widget.messageList.TaskMagazineViewItemContainerWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        isOdd_OVERDUE:true,
        isOdd_TODAY:true,
        isOdd_THISWEEK:true,
        isOdd_NODUE:true,
        itemNumber_OVERDUR:0,
        itemNumber_TODAY:0,
        itemNumber_THISWEEK:0,
        itemNumber_NODUE:0,
        firstItem_OVERDUE:null,
        firstItem_TODAY:null,
        firstItem_THISWEEK:null,
        firstItem_NODUE:null,

        postCreate: function(){
            console.log("TaskMagazineViewItemContainerWidget created");
            this.isOdd_OVERDUE=true;
            this.isOdd_TODAY=true;
            this.isOdd_THISWEEK=true;
            this.isOdd_NODUE=true;
            this.itemNumber_OVERDUR=0;
            this.itemNumber_TODAY=0;
            this.itemNumber_THISWEEK=0;
            this.itemNumber_NODUE=0;
            this.firstItem_OVERDUE=null;
            this.firstItem_TODAY=null;
            this.firstItem_THISWEEK=null;
            this.firstItem_NODUE=null;
            var overDueTasksTitle="<i class='icon-warning-sign' style='color:#CE0000;'></i> <span style='color:#CE0000;font-weight:bold;'>逾期任务 (0)</span>";
            var todayTasksTitle="<i class='icon-time' style='color:#FAC126;'></i> <span style='color:#FAC126;font-weight:bold;'>今日到期任务 (0)</span>";
            var weekTasksTitle="<i class='icon-calendar' style='color:#666666;'></i> <span style='color:#666666;font-weight:bold;'>本周到期任务 (0)</span>";
            var noDueTasksTitle="<i class='icon-inbox' style='color:#26A251;'></i> <span style='color:#26A251;font-weight:bold;'>非紧急任务 (0)</span>";
            this.overDueTaskContainer.set("title",overDueTasksTitle);
            this.overDueTaskContainer.toggle();
            this.todayTaskContainer.set("title",todayTasksTitle);
            this.todayTaskContainer.toggle();
            this.thisWeekTaskContainer.set("title",weekTasksTitle);
            this.thisWeekTaskContainer.toggle();
            this.noDueTaskContainer.set("title",noDueTasksTitle);
            this.noDueTaskContainer.toggle();
        },
        renderTaskMagazineViewItem:function(taskItemObject){
            var currentMessageItem=new vfbam.userclient.components.messageCenter.widget.messageList.TaskMagazineViewItemWidget({
                messageItemsContainer:this.messageItemsContainer,currentSelectedMessageItemArray:this.currentSelectedMessageItemArray,
                taskItemData:taskItemObject
            });
            if(taskItemObject.taskDueStatus=="OVERDUE"){
                this.overDueTaskItemsContainer.appendChild(currentMessageItem.domNode);
                if(this.isOdd_OVERDUE){
                    domClass.add(currentMessageItem.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentMessageItem.domNode, "app_magazineView_item_even");
                }
                this.isOdd_OVERDUE=!this.isOdd_OVERDUE;
                this.itemNumber_OVERDUR=this.itemNumber_OVERDUR+1;
                var overDueTasksTitle="<i class='icon-warning-sign' style='color:#CE0000;'></i> <span style='color:#CE0000;font-weight:bold;'>逾期任务 ("+this.itemNumber_OVERDUR+")</span>";
                this.overDueTaskContainer.set("title",overDueTasksTitle);
                if(!this.firstItem_OVERDUE){
                    this.firstItem_OVERDUE= currentMessageItem;
                }
            }
            if(taskItemObject.taskDueStatus=="DUETODAY"){
                this.todayTaskItemsContainer.appendChild(currentMessageItem.domNode);
                if(this.isOdd_TODAY){
                    domClass.add(currentMessageItem.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentMessageItem.domNode, "app_magazineView_item_even");
                }
                this.isOdd_TODAY=!this.isOdd_TODAY;
                this.itemNumber_TODAY=this.itemNumber_TODAY+1;
                var todayTasksTitle="<i class='icon-time' style='color:#FAC126;'></i> <span style='color:#FAC126;font-weight:bold;'>今日到期任务 ("+this.itemNumber_TODAY+")</span>";
                this.todayTaskContainer.set("title",todayTasksTitle);
                if(!this.firstItem_TODAY){
                    this.firstItem_TODAY= currentMessageItem;
                }
            }
            if(taskItemObject.taskDueStatus=="DUETHISWEEK"){
                this.thisWeekTaskItemsContainer.appendChild(currentMessageItem.domNode);
                if(this.isOdd_THISWEEK){
                    domClass.add(currentMessageItem.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentMessageItem.domNode, "app_magazineView_item_even");
                }
                this.isOdd_THISWEEK=!this.isOdd_THISWEEK;
                this.itemNumber_THISWEEK=this.itemNumber_THISWEEK+1;
                var weekTasksTitle="<i class='icon-calendar' style='color:#666666;'></i> <span style='color:#666666;font-weight:bold;'>本周到期任务 ("+this.itemNumber_THISWEEK+")</span>";
                this.thisWeekTaskContainer.set("title",weekTasksTitle);
                if(!this.firstItem_THISWEEK){
                    this.firstItem_THISWEEK= currentMessageItem;
                }
            }
            if(taskItemObject.taskDueStatus=="NODEU"){
                this.noDueTaskItemsContainer.appendChild(currentMessageItem.domNode);
                if(this.isOdd_NODUE){
                    domClass.add(currentMessageItem.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentMessageItem.domNode, "app_magazineView_item_even");
                }
                this.isOdd_NODUE=!this.isOdd_NODUE;
                this.itemNumber_NODUE=this.itemNumber_NODUE+1;
                var noDueTasksTitle="<i class='icon-inbox' style='color:#26A251;'></i> <span style='color:#26A251;font-weight:bold;'>非紧急任务 ("+this.itemNumber_NODUE+")</span>";
                this.noDueTaskContainer.set("title",noDueTasksTitle);
                if(!this.firstItem_NODUE){
                    this.firstItem_NODUE= currentMessageItem;
                }
            }
            this.messageItemsArray.push(currentMessageItem);
        },
        selectFirstItem: function(tpye){
            if(tpye=="OVERDUE"){
                if(this.itemNumber_OVERDUR==0){return false;}else{
                    this.firstItem_OVERDUE.selectMessageItem();
                    this.overDueTaskContainer.toggle();
                }
            }
            if(tpye=="DUETODAY"){
                if(this.itemNumber_TODAY==0){return false;}else{
                    this.firstItem_TODAY.selectMessageItem();
                    this.todayTaskContainer.toggle();
                }
            }
            if(tpye=="DUETHISWEEK"){
                if(this.itemNumber_THISWEEK==0){return false;}else{
                    this.firstItem_THISWEEK.selectMessageItem();
                    this.thisWeekTaskContainer.toggle();
                }
            }
            if(tpye=="NODEU"){
                if(this.itemNumber_NODUE==0){return false;}else{
                    this.firstItem_NODUE.selectMessageItem();
                    this.noDueTaskContainer.toggle();
                }
            }
            return true;
        },
        _endOfCode: function(){}
    });
});