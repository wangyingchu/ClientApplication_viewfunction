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
        queryActivityById:function(){
            var activityIdValue=this.queryActivityIdInput.get("value");
            if(activityIdValue==""){
                UI.showToasterMessage({type:"warning",message:"请输入业务活动序号"});
                return;
            }else{
                var resturl=ACTIVITY_SERVICE_ROOT+"activityInstanceDetail/"+APPLICATION_ID+"/"+activityIdValue+"/";
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var that=this;
                var loadCallback=function(data){
                    that.doShowActivityInstanceDetail(data,activityIdValue);
                };
                Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
            }
        },
        doShowActivityInstanceDetail:function(activityInstanceData,activityIdForQuery){
            if(!activityInstanceData.activityId){
                UI.showToasterMessage({type:"error",message:"不存在序号为 <b>"+activityIdForQuery+"</b> 的业务活动"});
                return;
            }
            this.queryActivityIdInput.set("value","");
            var activityInstanceDetail=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityInstanceDetailWidget({activityInstanceData:activityInstanceData});
            var	dialog = new Dialog({
                style:"width:760px;",
                title: "<i class='icon-info-sign'></i> 业务活动详情",
                content: "",
                buttons:null,
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(activityInstanceDetail.containerNode, dialog.containerNode);
            dialog.show();
            var closeDialogCallBack=function(){
                activityInstanceDetail.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        _endOfCode: function(){}
    });
});