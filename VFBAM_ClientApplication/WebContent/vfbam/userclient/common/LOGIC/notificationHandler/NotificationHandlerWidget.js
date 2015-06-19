require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget","idx/oneui/Dialog"
],function(lang,declare, _Widget,Dialog){
    declare("vfbam.userclient.common.LOGIC.notificationHandler.NotificationHandlerWidget", [_Widget], {
        handleNotificationListenerHandler:null,
        deleteNotificationListenerHandler:null,
        deleteNotificationDirectlyListenerHandler:null,
        postCreate: function(){
            console.log("NotificationHandlerWidget created");
            this.handleNotificationListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_HANDLENOTIFICATION_EVENT,dojo.hitch(this,this.handleNotification));
            this.deleteNotificationListenerHandler=  Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_DELETENOTIFICATION_EVENT,dojo.hitch(this,this.deleteNotification));
            this.deleteNotificationDirectlyListenerHandler=  Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_DELETENOTIFICATIONDIRECTLY_EVENT,dojo.hitch(this,this.deleteNotificationDirectly));
        },
        handleNotification:function(notificationData){
           if(!notificationData.notificationReadStatus){
               //update read status
               var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/readNotification/"+ notificationData.notificationObjectId;
               var errorCallback= function(data){
                   UI.showSystemErrorMessage(data);
               };
               var loadCallback=function(data){};
               Application.WebServiceUtil.putJSONData(resturl,null,loadCallback,errorCallback);
           }

            var notificationType= notificationData.notificationType;
            if(notificationType== MESSAGESERVICE_NotificationType_COMMONNOTICE ){
               var notificationContentData={};
                notificationContentData["messageSubject"] = notificationData.notificationSubject;
                notificationContentData["messageSender"] = notificationData.notificationSender;
                notificationContentData["messageSentDate"]= notificationData.notificationSentDate;
                notificationContentData["messageReceivers"] = notificationData.notificationReceivers;
                notificationContentData["senderFacePicURL"] = PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ notificationData.notificationSenderId;
                notificationContentData["messageContent"] = notificationData.notificationContent;
                var notificationViewer=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageViewerWidget(notificationContentData);
                var actionButtone=[];
                var deleteMessageButton=new dijit.form.Button({
                    label: "<i class='icon-trash'></i> 删除",
                    onClick: function(){
                        Application.MessageUtil.publishMessage(APP_MESSAGECENTER_DELETENOTIFICATION_EVENT,{type:"NOTIFICATION",data:notificationData,callback:notificationViewer.doCloseContainerDialog});
                    }
                });
                actionButtone.push(deleteMessageButton);
                var	dialog = new Dialog({
                    style:"width:800px;",
                    title: "<i class='icon-edit'></i> 阅读通知",
                    content: "",
                    buttons:actionButtone,
                    closeButtonLabel: "<i class='icon-remove'></i> 关闭"
                });
                dialog.connect(notificationViewer, "doCloseContainerDialog", "hide");
                dojo.place(notificationViewer.containerNode, dialog.containerNode);
                dialog.show();
            }
            if(notificationType== MESSAGESERVICE_NotificationType_ACTIVITYTASK ){
                var openTaskPagePayload= this.switchPagePayload;
                var businessData={};
                var activityTaskNotificationVO= notificationData.notificationMetaData.activityTaskNotificationVO;
                businessData["taskItemData"] =activityTaskNotificationVO;
                openTaskPagePayload["APP_PAGE_DYNAMIC_DATA"]=businessData;
                var taskPageTitle= "<i class='icon-tag'></i> 任务详情 ("+activityTaskNotificationVO.activityId+")";
                var dynamicPageId=UI.openDynamicPage("TASK_DETAIL","任务详情",activityTaskNotificationVO.activityId,taskPageTitle,openTaskPagePayload);
                if(dynamicPageId){
                    UI.showDynamicPage(dynamicPageId);
                }
            }
            if(notificationType== MESSAGESERVICE_NotificationType_EXTERNALRESOURCE ){
                var openERPagePayload= this.switchPagePayload;
                var businessData={};
                var externalResourceNotificationVO=notificationData.notificationMetaData.externalResourceNotificationVO;
                var externalResourceItemData={};
                externalResourceItemData["resourceName"]=externalResourceNotificationVO.resourceName;
                externalResourceItemData["resourceURL"]=externalResourceNotificationVO.resourceURL;
                businessData["externalResourceData"] = externalResourceItemData;
                openERPagePayload["APP_PAGE_DYNAMIC_DATA"]=businessData;
                var externalResourcePageTitle= "<i class='icon-link'></i> "+externalResourceItemData.resourceName;
                var dynamicPageId=UI.openDynamicPage("EXTERNAL_RESOURCE","外部资源",externalResourceItemData.resourceName,externalResourcePageTitle,openERPagePayload);
                if(dynamicPageId){
                    UI.showDynamicPage(dynamicPageId);
                }
            }
        },
        deleteNotification:function(messageData){
            var messageTxt="";
            if(messageData.type=="MESSAGE"){
                messageTxt= "<b>请确认是否删除消息:</b>' "+messageData.data.messageSubject+" '?";
            }
            if(messageData.type=="NOTIFICATION"){
                messageTxt= "<b>请确认是否删除通知:</b>' "+messageData.data.notificationSubject+" '?";
            }
            var confirmButtonAction=function(){
                if(messageData.type=="NOTIFICATION"){
                    var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/deleteNotification/"+messageData.data.notificationObjectId;
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        if(data.operationResult){
                            if(messageData.callback){
                                messageData.callback();
                            }
                            UI.showToasterMessage({type:"success",message:"删除通知成功"});
                        }
                        Application.MessageUtil.publishMessage(APP_MESSAGECENTER_LOADMESSAGE_EVENT,{messageType:"NOTIFICATION"});
                    };
                    Application.WebServiceUtil.deleteJSONData(resturl,null,loadCallback,errorCallback);
                }
            };
            var cancelButtonAction=function(){console.log("cancelButtonAction "+messageData.data.notificationObjectId);};
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-trash'></i> 删除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        deleteNotificationDirectly:function(messageData){
            if(messageData.type=="NOTIFICATION"){
                var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/deleteNotification/"+messageData.data.notificationObjectId;
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    if(data.operationResult){
                        if(messageData.callback){
                            messageData.callback();
                        }
                        UI.showToasterMessage({type:"success",message:"删除通知成功"});
                    }
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_LOADMESSAGE_EVENT,{messageType:"NOTIFICATION"});
                };
                Application.WebServiceUtil.deleteJSONData(resturl,null,loadCallback,errorCallback);
            }
        },
        _endOfCode: function(){}
    });
});