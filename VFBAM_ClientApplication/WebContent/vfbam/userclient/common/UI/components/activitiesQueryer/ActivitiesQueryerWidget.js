require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/ActivitiesQueryerWidget.html",
    "dojo/dom-class","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domClass,Dialog){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.ActivitiesQueryerWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){

        },
        queryICreatedActivities:function(){
            var userStartedActivitiesWidget=new vfbam.userclient.common.UI.components.activitiesQueryer.UserStartedActivitiesWidget({});
            var	dialog = new Dialog({
                style:"width:760px;",
                title: "<i class='icon-retweet'></i> 我启动的业务活动",
                content: "",
                buttons:null,
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            //dialog.connect(messageViewer, "doCloseContainerDialog", "hide");
            dojo.place(userStartedActivitiesWidget.containerNode, dialog.containerNode);
            dialog.show();
            var closeDialogCallBack=function(){
                userStartedActivitiesWidget.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        queryIWorkedTasks:function() {
            var userWorkedTasksWidget = new vfbam.userclient.common.UI.components.activitiesQueryer.UserWorkedStepsWidget({});
            var dialog = new Dialog({
                style: "width:760px;",
                title: "<i class='icon-indent-right'></i> 我完成的业务任务",
                content: "",
                buttons: null,
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            // dialog.connect(messageViewer, "doCloseContainerDialog", "hide");
            dojo.place(userWorkedTasksWidget.containerNode, dialog.containerNode);
            dialog.show();
            var closeDialogCallBack=function(){
                userWorkedTasksWidget.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        _endOfCode: function(){}
    });
});