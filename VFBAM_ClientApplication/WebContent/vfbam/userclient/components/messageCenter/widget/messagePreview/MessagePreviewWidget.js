require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messagePreview/template/MessagePreviewWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.messageCenter.widget.messagePreview.MessagePreviewWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        renderMessagePreviewEventHandler:null,
        loadMessageListEventHandler:null,
        clearPreviewPanelEventHandler:null,
        dateDisplayFormat:null,
        timeDisplayFormat:null,
        messageItemData:null,
        switchPagePayload:null,
        postCreate: function(){
            console.log("MessagePreviewWidget created");
            this.switchPagePayload={};
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]={};
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_STATUS"]="STATIC";
            this.switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_TYPE"]="MESSAGE_CENTER";
            this.renderMessagePreviewEventHandler=
                Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_MESSAGESELECTED_EVENT,dojo.hitch(this, "renderMessagePreview"));
            this.loadMessageListEventHandler=
                Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_LOADMESSAGE_EVENT,dojo.hitch(this, "cleanMessagePreview"));
            this.clearPreviewPanelEventHandler=
                Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_CLEARMESSAGEPREVIEWPANEL_EVENT,dojo.hitch(this, "cleanMessagePreview"));
            var messageMagazineViewListContainerHeight= this.containerHeight-240;
            var messageMagazineViewListContainerHeightString="" +messageMagazineViewListContainerHeight+"px";
            dojo.style(this.messageContentTxt,"height",messageMagazineViewListContainerHeightString);
            this.dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            this.timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            dojo.connect(this.readMessageButton,"onclick",dojo.hitch(this,this.readMessage));
            dojo.connect(this.replyMessageButton,"onclick",dojo.hitch(this,this.replyMessage));
            dojo.connect(this.deleteMessageButton,"onclick",dojo.hitch(this,this.deleteMessage));
            dojo.connect(this.readNotificationButton,"onclick",dojo.hitch(this,this.handleNotification));
            dojo.connect(this.handleNotificationButton,"onclick",dojo.hitch(this,this.handleNotification));
            dojo.connect(this.deleteNotificationButton,"onclick",dojo.hitch(this,this.deleteNotification));
            dojo.connect(this.handleTaskButton,"onclick",dojo.hitch(this,this.handleTask));
            dojo.connect(this.returnTaskButton,"onclick",dojo.hitch(this,this.returnTask));
            dojo.connect(this.reasignTaskButton,"onclick",dojo.hitch(this,this.reasignTask));
            dojo.style(this.previewPrompt,"display","");
            dojo.style(this.previewContent,"display","none");
            dojo.style(this.messageControlButtonBar,"display","none");
            dojo.style(this.notificationControlButtonBar,"display","none");
            dojo.style(this.facePhotoContainer,"display","none");
            dojo.style(this.messageTypeContainer,"display","none");
        },
        renderMessagePreview:function(messageItemData){
            this.messageItemData= messageItemData;
            if(messageItemData.type=="MESSAGE"){
                var dateString=dojo.date.locale.format(messageItemData.data.messageSentDate,this.dateDisplayFormat);
                var timeString=dojo.date.locale.format(messageItemData.data.messageSentDate,this.timeDisplayFormat);
                this.messageTitleTxt.innerHTML=messageItemData.data.messageSubject;
                this.messageSenderTxt.innerHTML=messageItemData.data.messageSender;
                this.messageSentDateTxt.innerHTML=dateString+" "+timeString;
                this.messageReceiversTxt.innerHTML=messageItemData.data.messageReceivers;
                this.messageContentTxt.innerHTML=messageItemData.data.messageContent;
                this.senderFacePhoto.src=  messageItemData.data.senderFacePicURL;
                dojo.style(this.messageControlButtonBar,"display","");
                dojo.style(this.notificationControlButtonBar,"display","none");
                dojo.style(this.taskControlButtonBar,"display","none");
                dojo.style(this.messagePropertyContainer,"display","");
                dojo.style(this.taskPropertyContainer,"display","none");
                dojo.style(this.facePhotoContainer,"display","");
                dojo.style(this.messageTypeContainer,"display","none");
            }
            if(messageItemData.type=="NOTIFICATION"){
                if(!messageItemData.data.notificationHandleable){
                    dojo.style(this.handleNotificationButton,"display","none");
                }else{
                    dojo.style(this.handleNotificationButton,"display","");
                }
                if(messageItemData.data.notificationType==MESSAGESERVICE_NotificationType_COMMONNOTICE){
                    dojo.style(this.readNotificationButton,"display","");
                }else{
                    dojo.style(this.readNotificationButton,"display","none");
                }
                var dateString=dojo.date.locale.format(messageItemData.data.notificationSentDate,this.dateDisplayFormat);
                var timeString=dojo.date.locale.format(messageItemData.data.notificationSentDate,this.timeDisplayFormat);
                this.messageTitleTxt.innerHTML=messageItemData.data.notificationSubject;
                this.messageSenderTxt.innerHTML=messageItemData.data.notificationSender;
                this.messageSentDateTxt.innerHTML=dateString+" "+timeString;
                this.messageReceiversTxt.innerHTML=messageItemData.data.notificationReceivers;
                this.messageContentTxt.innerHTML=messageItemData.data.notificationContent;
                dojo.style(this.messageControlButtonBar,"display","none");
                dojo.style(this.notificationControlButtonBar,"display","");
                dojo.style(this.taskControlButtonBar,"display","none");
                dojo.style(this.messagePropertyContainer,"display","");
                dojo.style(this.taskPropertyContainer,"display","none");
                dojo.style(this.facePhotoContainer,"display","none");
                dojo.style(this.messageTypeContainer,"display","");
                if(messageItemData.data.notificationStatus=="INFO"){
                    this.messageTypeContainer.innerHTML="<i class='icon-bell-alt icon-2x' style='color: #26A251;'></i>";
                }
                if(messageItemData.data.notificationStatus=="WARN"){
                    this.messageTypeContainer.innerHTML="<i class='icon-exclamation-sign icon-2x' style='color: #FAC126;'></i>";
                }
                if(messageItemData.data.notificationStatus=="ERROR"){
                    this.messageTypeContainer.innerHTML="<i class='icon-fire icon-2x' style='color: #CE0000;'></i>";
                }
            }
            if(messageItemData.type=="TASK"){
                var dateString;
                var timeString;
                if(messageItemData.data.taskDueDate.getTime()==0){
                    dateString="";
                    timeString="-";
                }else{
                    dateString=dojo.date.locale.format(messageItemData.data.taskDueDate,this.dateDisplayFormat);
                    timeString=dojo.date.locale.format(messageItemData.data.taskDueDate,this.timeDisplayFormat);
                }
                this.taskDueDateTxt.innerHTML=dateString+" "+timeString;
                this.taskActivityNameTxt.innerHTML=messageItemData.data.activityName;
                this.taskRoleTxt.innerHTML=messageItemData.data.taskRole;
                this.messageContentTxt.innerHTML=messageItemData.data.taskDescription;
                this.messageTitleTxt.innerHTML=messageItemData.data.taskName+" ("+messageItemData.data.activityId+")";
                dojo.style(this.messageControlButtonBar,"display","none");
                dojo.style(this.notificationControlButtonBar,"display","none");
                dojo.style(this.taskControlButtonBar,"display","");
                dojo.style(this.messagePropertyContainer,"display","none");
                dojo.style(this.taskPropertyContainer,"display","");
                dojo.style(this.messageTypeContainer,"display","");
                if(messageItemData.data.taskDueStatus=="OVERDUE"){
                    this.messageTypeContainer.innerHTML="<i class='icon-warning-sign icon-2x' style='color: #CE0000;'></i>";
                }
                if(messageItemData.data.taskDueStatus=="DUETODAY"){
                    this.messageTypeContainer.innerHTML="<i class='icon-time icon-2x' style='color: #FAC126;'></i>";
                }
                if(messageItemData.data.taskDueStatus=="DUETHISWEEK"){
                    this.messageTypeContainer.innerHTML="<i class='icon-calendar icon-2x' style='color: #666666;'></i>";
                }
                if(messageItemData.data.taskDueStatus=="NODEU"){
                    this.messageTypeContainer.innerHTML="<i class='icon-inbox icon-2x' style='color: #26A251;'></i>";
                }
            }
            dojo.style(this.previewPrompt,"display","none");
            dojo.style(this.previewContent,"display","");
        },
        cleanMessagePreview:function(messageItemData){
            this.messageTitleTxt.innerHTML="";
            this.messageSenderTxt.innerHTML="";
            this.messageSentDateTxt.innerHTML="";
            this.messageReceiversTxt.innerHTML="";
            this.messageContentTxt.innerHTML="";
            dojo.style(this.previewPrompt,"display","");
            dojo.style(this.previewContent,"display","none");
            dojo.style(this.messageControlButtonBar,"display","none");
            dojo.style(this.notificationControlButtonBar,"display","none");
            dojo.style(this.taskControlButtonBar,"display","none");
            dojo.style(this.facePhotoContainer,"display","none");
            dojo.style(this.messageTypeContainer,"display","none");
            this.messageTypeContainer.innerHTML="";
            this.messageItemData=null;
        },
        readMessage:function(){
            if(this.messageItemData){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_READMESSAGE_EVENT,this.messageItemData.data);
                if(!this.messageItemData.messageReadStatus){
                	Application.MessageUtil.publishMessage(APP_MESSAGECENTER_UPDATEMESSAGEREADSTATUS_EVENT,this.messageItemData.data);                	
                }
            }
        },
        replyMessage:function(){
            if(this.messageItemData){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_REPLYMESSAGE_EVENT,this.messageItemData);
                if(!this.messageItemData.messageReadStatus){
                	Application.MessageUtil.publishMessage(APP_MESSAGECENTER_UPDATEMESSAGEREADSTATUS_EVENT,this.messageItemData.data);                	
                }
            }
        },
        deleteMessage:function(){
            if(this.messageItemData){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_DELETEMESSAGE_EVENT,{type:"MESSAGE",data:this.messageItemData.data});
            }
        },
        handleNotification :function(){
            if(this.messageItemData){
                var notificationItemData=this.messageItemData.data;
                var notificationType= notificationItemData.notificationType;
                if(notificationType== MESSAGESERVICE_NotificationType_ACTIVITYTASK){
                    var activityId=notificationItemData.notificationMetaData.activityTaskNotificationVO.activityId;
                    var taskName=notificationItemData.notificationMetaData.activityTaskNotificationVO.taskName;
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var resturl=ACTIVITY_SERVICE_ROOT+"participantTaskDetailInfo/"+APPLICATION_ID+"/"+userId+"/"+activityId+"/"+taskName+"/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(participantDetailTask){
                        if(participantDetailTask.activityType){
                            var taskDetailItemData={};
                            taskDetailItemData["taskName"]= participantDetailTask.activityStepName;
                            taskDetailItemData["activityName"]= participantDetailTask.activityType;
                            taskDetailItemData["activityId"]= participantDetailTask.activityStep.activityId;
                            taskDetailItemData["taskDescription"]= participantDetailTask.stepDescription;
                            taskDetailItemData["taskDueDate"]=new Date(participantDetailTask.dueDate);
                            if(participantDetailTask.activityStep.relatedRole){
                                taskDetailItemData["taskRole"]= participantDetailTask.activityStep.relatedRole.displayName;
                                taskDetailItemData["taskRoleID"]=participantDetailTask.activityStep.relatedRole.roleName;
                            }
                            taskDetailItemData["taskDueStatus"]=participantDetailTask.dueStatus;
                            taskDetailItemData["taskResponse"]=participantDetailTask.activityStep.stepResponse;
                            var taskDataFields=[];
                            var taskDataDetailInfo=participantDetailTask.activityStep.activityDataFieldValueList.activityDataFieldValueList;
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
                                    propertyValue["writable"]=true;
                                    propertyValue["readable"]=true;
                                    taskDataFields.push(propertyValue);
                                });
                            }
                            taskDetailItemData["taskDataFields"] = taskDataFields;
                            taskDetailItemData["stepAssignee"] = participantDetailTask.stepAssignee;
                            taskDetailItemData["stepOwner"] = participantDetailTask.stepOwner;
                            taskDetailItemData["hasChildActivityStep"] = participantDetailTask.activityStep.hasChildActivityStep;
                            taskDetailItemData["hasParentActivityStep"] = participantDetailTask.activityStep.hasParentActivityStep;
                            taskDetailItemData["parentActivityStepName"] = participantDetailTask.activityStep.parentActivityStepName;
                            if(participantDetailTask.activityStep.stepProcessEditor){
                                taskDetailItemData["stepProcessEditor"] = participantDetailTask.activityStep.stepProcessEditor;
                            }
                            notificationItemData.notificationMetaData.activityTaskNotificationVO=taskDetailItemData;
                            Application.MessageUtil.publishMessage(APP_MESSAGECENTER_HANDLENOTIFICATION_EVENT,notificationItemData);

                        }else{
                            var messageTxt="业务任务 <b>"+taskName +"</b> 已处理完毕或已不在您的任务列表中。";
                            var confirmButtonAction=function(){
                                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_DELETENOTIFICATIONDIRECTLY_EVENT,{type:"NOTIFICATION",data:notificationItemData});
                            };
                            var cancelButtonAction=function(){};
                            UI.showConfirmDialog({
                                message:messageTxt,
                                confirmButtonLabel:"<i class='icon-trash'></i> 删除此项通知",
                                cancelButtonLabel:"<i class='icon-remove'></i> 关闭",
                                confirmButtonAction:confirmButtonAction,
                                cancelButtonAction:cancelButtonAction
                            });
                            if(!notificationItemData.notificationReadStatus){
                                //update read status
                                var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/readNotification/"+ notificationItemData.notificationObjectId;
                                var errorCallback= function(data){
                                    UI.showSystemErrorMessage(data);
                                };
                                var loadCallback=function(data){};
                                Application.WebServiceUtil.putJSONData(resturl,null,loadCallback,errorCallback);
                            }
                        }
                    };
                    Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
                }else{
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_HANDLENOTIFICATION_EVENT,notificationItemData);
                }
                if(!notificationItemData.notificationReadStatus){
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_UPDATENOTIFICATIONEREADSTATUS_EVENT,notificationItemData);
                }
            }
        },
        deleteNotification :function(){
            if(this.messageItemData){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_DELETENOTIFICATION_EVENT,{type:"NOTIFICATION",data:this.messageItemData.data});
            }
        },
        handleTask :function(){
            if(this.messageItemData){
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_HANDLETASK_EVENT,{taskData:this.messageItemData.data,switchPagePayload:this.switchPagePayload});
            }
        },
        returnTask :function(){
            if(this.messageItemData){
                var that=this;
                var messageData=that.messageItemData.data;
                var taskOperationCallback=function(){
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:messageData});
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADROLEQUEUETASKLIST_EVENT,{taskData:messageData});
                };
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RETURNTASK_EVENT,{taskData:this.messageItemData.data,switchPagePayload:this.switchPagePayload,callback:taskOperationCallback});
            }
        },
        reasignTask :function(){
            if(this.messageItemData){
                var that=this;
                var taskOperationCallback=function(){
                    Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,{taskData:that.messageItemData.data});
                };
                Application.MessageUtil.publishMessage(APP_GLOBAL_TASKCENTER_REASSIGNTASK_EVENT,{taskData:this.messageItemData.data,switchPagePayload:this.switchPagePayload,callback:taskOperationCallback});
            }
        },
        _endOfCode: function(){}
    });
});