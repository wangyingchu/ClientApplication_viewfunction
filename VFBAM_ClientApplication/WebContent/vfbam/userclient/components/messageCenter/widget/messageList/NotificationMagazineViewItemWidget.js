require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messageList/template/NotificationMagazineViewItemWidget.html",
    "dojo/dom-class","dojox/dtl/filter/htmlstrings"
],function(lang,declare, _Widget, _Templated, template,domClass,htmlstrings){
    declare("vfbam.userclient.components.messageCenter.widget.messageList.NotificationMagazineViewItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        messageItemsContainerWidth:null,
        messageItemContentWidth:null,
        messageItemContentWidthString:null,
        clickEventConnectionHandler:null,
        handlerNotificationEventConnectionHandler:null,
        readNotificationEventConnectionHandler:null,
        deleteNotificationEventConnectionHandler:null,
        doubleClickEventConnectionHandler:null,
        updateNotificationReadStatusListenerHandler:null,
        postCreate: function(){
            this.messageItemsContainerWidth= dojo.contentBox(this.messageItemsContainer).w;
            this.notificationSubject.innerHTML=  this.notificationItemData.notificationSubject;
            var abstractTxt=htmlstrings.striptags(this.notificationItemData.notificationContent);
            this.notificationContent.innerHTML=  abstractTxt;
            if(this.notificationItemData.notificationReadStatus){
                dojo.style(this.newMessageIcon,"display","none");
                dojo.style(this.alreadyReadMessageIcon,"display","");
                domClass.add(this.messageSubjectContainer, "app_magazineView_item_alreadyRead");
            }else{
                dojo.style(this.newMessageIcon,"display","");
                dojo.style(this.alreadyReadMessageIcon,"display","none");
            }
            if(this.notificationItemData.notificationStatus=="INFO"){
                dojo.style(this.infoMessageIcon,"display","");
            }
            if(this.notificationItemData.notificationStatus=="WARN"){
                dojo.style(this.warnMessageIcon,"display","");
            }
            if(this.notificationItemData.notificationStatus=="ERROR"){
                dojo.style(this.errorMessageIcon,"display","");
            }
            this.messageItemContentWidth= this.messageItemsContainerWidth-150;
            this.messageItemContentWidthString=""+this.messageItemContentWidth+"px";
            dojo.style(this.notificationContent,"width",this.messageItemContentWidthString);
            this.clickEventConnectionHandler=dojo.connect(this.domNode,"onclick",dojo.hitch(this,this.selectMessageItem));
            this.deleteNotificationEventConnectionHandler=dojo.connect(this.deleteNotificationButton,"onclick",dojo.hitch(this,this.deleteNotification));
            if(this.notificationItemData.notificationHandleable){
                this.handlerNotificationEventConnectionHandler=dojo.connect(this.handleNotificationButton,"onclick",dojo.hitch(this,this.handleNotification));
                this.doubleClickEventConnectionHandler=dojo.connect(this.domNode,"ondblclick",dojo.hitch(this,this.handleNotification));
            }else{
                dojo.style(this.handleNotificationButton,"display","none");
            }
            if(this.notificationItemData.notificationType!= MESSAGESERVICE_NotificationType_COMMONNOTICE){
                dojo.style(this.readNotificationButton,"display","none");
            }else{
                this.readNotificationEventConnectionHandler=dojo.connect(this.readNotificationButton,"onclick",dojo.hitch(this,this.handleNotification));
                if(!this.notificationItemData.notificationHandleable){
                    this.doubleClickEventConnectionHandler=dojo.connect(this.domNode,"ondblclick",dojo.hitch(this,this.handleNotification));
                }
            }
            this.updateNotificationReadStatusListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_UPDATENOTIFICATIONEREADSTATUS_EVENT,dojo.hitch(this,this.updateReadStatus));
        },
        selectMessageItem:function(eventObj){
            if(this.currentSelectedMessageItemArray&&this.currentSelectedMessageItemArray.length>0){
                domClass.remove(this.currentSelectedMessageItemArray[0].messageItemRootContainer, "app_magazineView_item_selected");
                this.currentSelectedMessageItemArray.splice(0, this.currentSelectedMessageItemArray.length);
            }
            domClass.add(this.messageItemRootContainer, "app_magazineView_item_selected");
            this.currentSelectedMessageItemArray.push(this);
            Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGESELECTED_EVENT,{type:"NOTIFICATION",data:this.notificationItemData});
        },
        handleNotification:function(){
            if(this.notificationItemData){
                var notificationType= this.notificationItemData.notificationType;
                if(notificationType== MESSAGESERVICE_NotificationType_ACTIVITYTASK){
                    var activityId=this.notificationItemData.notificationMetaData.activityTaskNotificationVO.activityId;
                    var taskName=this.notificationItemData.notificationMetaData.activityTaskNotificationVO.taskName;
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var resturl=ACTIVITY_SERVICE_ROOT+"participantTaskDetailInfo/"+APPLICATION_ID+"/"+userId+"/"+activityId+"/"+taskName+"/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var that=this;
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
                            that.notificationItemData.notificationMetaData.activityTaskNotificationVO=taskDetailItemData;
                            Application.MessageUtil.publishMessage(APP_MESSAGECENTER_HANDLENOTIFICATION_EVENT,that.notificationItemData);

                        }else{
                            var messageTxt="业务任务 <b>"+taskName +"</b> 已处理完毕或已不在您的任务列表中。";
                            var confirmButtonAction=function(){
                                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_DELETENOTIFICATIONDIRECTLY_EVENT,{type:"NOTIFICATION",data:that.notificationItemData});
                            };
                            var cancelButtonAction=function(){};
                            UI.showConfirmDialog({
                                message:messageTxt,
                                confirmButtonLabel:"<i class='icon-trash'></i> 删除此项通知",
                                cancelButtonLabel:"<i class='icon-remove'></i> 关闭",
                                confirmButtonAction:confirmButtonAction,
                                cancelButtonAction:cancelButtonAction
                            });
                            if(!that.notificationItemData.notificationReadStatus){
                                //update read status
                                var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/readNotification/"+ that.notificationItemData.notificationObjectId;
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
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_HANDLENOTIFICATION_EVENT,this.notificationItemData);
                }
                if(!this.notificationItemData.notificationReadStatus){
                    dojo.style(this.newMessageIcon,"display","none");
                    dojo.style(this.alreadyReadMessageIcon,"display","");
                    domClass.add(this.messageSubjectContainer, "app_magazineView_item_alreadyRead");
                    this.notificationItemData.notificationReadStatus=true;
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_REQUEST_EVENT,{messageType:"NOTIFICATION"});
                }
            }
        },
        updateReadStatus:function(eventNotificationItemData){
            if(eventNotificationItemData.notificationObjectId==this.notificationItemData.notificationObjectId){
                if(!this.notificationItemData.notificationReadStatus){
                    dojo.style(this.newMessageIcon,"display","none");
                    dojo.style(this.alreadyReadMessageIcon,"display","");
                    domClass.add(this.messageSubjectContainer, "app_magazineView_item_alreadyRead");
                    this.notificationItemData.notificationReadStatus=true;
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_REQUEST_EVENT,{messageType:"NOTIFICATION"});
                }
            }
        },
        deleteNotification:function(){
            if(this.notificationItemData){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_DELETENOTIFICATION_EVENT,{type:"NOTIFICATION",data:this.notificationItemData});
            }
        },
        destroy:function(){
            dojo.disconnect(this.clickEventConnectionHandler);
            dojo.disconnect(this.deleteNotificationEventConnectionHandler);
            if(this.handlerNotificationEventConnectionHandler){
                dojo.disconnect(this.handlerNotificationEventConnectionHandler);
            }
            if(this.doubleClickEventConnectionHandler){
                dojo.disconnect(this.doubleClickEventConnectionHandler);
            }
            if( this.readNotificationEventConnectionHandler){
                dojo.disconnect(this.readNotificationEventConnectionHandler);
            }
            this.updateNotificationReadStatusListenerHandler.calcelMessageListening();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});
