var userCalendar = new dojox.calendar.Calendar({
    dateInterval: "week",//select date display range: day,week,month etc
    cssClassFunc: function(item){
        return item.calendar;
    },
    summaryAttr:'Title',
    startTimeAttr:'StartDateTime',
    endTimeAttr:'EndDateTime',
    columnViewProps:{minHours:0,maxHours:24},
    editable:false,
    selectionMode:'none' //none, single, multiple

}, "app_calendarCenter_userCalendar");

var userCalendarDateChooser=new vfbam.userclient.components.calendarCenter.widget.CalendarDataPickerWidget({
    interval:'week',
    style:"width: 210px;"
},"app_calendarCenter_calendarDateChooser");
userCalendarDateChooser.on("valueSelected", selectCalendarDate);
userCalendarDateChooser.goToToday();


userCalendar.on("itemClick", function(e){
    console.log("Item clicked", e.item.Title);
});

userCalendar.on("change", function(e){
    console.log("Item clicked", e);
});
/* use this feature leads to a calendar error,so ignore this function
userCalendar.on("rowHeaderClick", function(dataObject){
    userCalendarDateChooser.set("value",dataObject.date);
});
*/
userCalendar.on("columnHeaderClick", function(dataObject){
    userCalendarDateChooser.set("value",dataObject.date);
});
userCalendar.on("timeIntervalChange", function(dataObject){
    userCalendarDateChooser.set("currentFocus", dataObject.startTime, false);
    userCalendarDateChooser.set("minDate", dataObject.startTime);
    userCalendarDateChooser.set("maxDate", dataObject.endTime);
    userCalendarDateChooser._populateGrid();
});

var someData = [
    {
        id: 0,
        Title: "<i class='icon-user'></i> 撰写季度采购报告 (140)",
        StartDateTime: new Date(2013, 12, 17, 10, 0),
        EndDateTime: new Date(2013, 12, 17, 10, 30),
        calendar: "Calendar1"
    },
    {
        id: 1,
        Title: "<i class='icon-group'></i> 制造部财务审批 (108)",
        StartDateTime: new Date(2013, 12, 17, 12, 0),
        EndDateTime: new Date(2013, 12, 17, 12, 30),
        calendar: "Calendar2"
    },
    {
        id: 2,
        Title: "<i class='icon-group'></i> 制造部财务审批 (124)",
        StartDateTime: new Date(2013, 12, 18, 9, 0),
        EndDateTime: new Date(2013, 12, 18, 9, 30),
        calendar: "Calendar2"
    },
    {
        id: 3,
        Title: "<i class='icon-group'></i> 业务出差报销审批 (98)",
        StartDateTime: new Date(2013, 12, 19, 11, 0),
        EndDateTime: new Date(2013, 12, 19, 11, 30),
        calendar: "Calendar1"
    },
    {
        id: 4,
        Title: "<i class='icon-group'></i> 员工休假申请 (233)",
        StartDateTime: new Date(2013, 12, 19, 12, 0),
        EndDateTime: new Date(2013, 12, 19, 12, 30),
        calendar: "Calendar1"
    },
    {
        id: 5,
        Title: "<i class='icon-group'></i> 物流部出货 (188)",
        StartDateTime: new Date(2013, 12, 20, 13, 0),
        EndDateTime: new Date(2013, 12, 20, 13, 30),
        calendar: "Calendar2"
    },
    {
        id: 6,
        Title: "<i class='icon-group'></i> 制造部采购 (334)",
        StartDateTime: new Date(2013, 12, 20, 9, 30),
        EndDateTime: new Date(2013, 12, 20, 10, 0),
        calendar: "Calendar1"
    }
    ,
    {
        id: 7,
        Title: "<i class='icon-group'></i> 质检部验货 (209)",
        StartDateTime: new Date(2013, 12, 16, 9, 30),
        EndDateTime: new Date(2013, 12, 16, 10, 0),
        calendar: "Calendar2"
    }
];

var calendarStore=new dojo.store.Observable(new dojo.store.Memory({data: someData}));
userCalendar.set("store",calendarStore);
function selectCalendarDate(date){
    userCalendar.set("date",date);
}
function showComponentConfigDialog(){
    require(["idx/oneui/Dialog"], function(Dialog){
        /*
         var messageEditor=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageEditorWidget(messageData.data);
         */
        var confirmButton=new dijit.form.Button({
            label: "<i class='icon-ok-sign'></i> 确定",
            onClick: function(){
            }
        });
        var applyButton=new dijit.form.Button({
            label: "<i class='icon-ok'></i> 应用",
            onClick: function(){
            }
        });
        var actionButtone=[];
        actionButtone.push(confirmButton);
        actionButtone.push(applyButton);
        var	dialog = new Dialog({
            style:"width:600px;",
            title: "<i class='icon-cog'></i> 工作日程表参数设置",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        //dialog.connect(messageEditor, "doCloseContainerDialog", "hide");
        //dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}






