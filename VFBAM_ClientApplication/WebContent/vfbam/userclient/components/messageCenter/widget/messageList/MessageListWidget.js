require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messageList/template/MessageListWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.messageCenter.widget.messageList.MessageListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        loadMessageListEventHandler:null,
        refreshMessageCountRequestEventHandler:null,
        queryMessageButtonConnectHandler:null,
        messageItemsArray:null,
        currentSelectedMessageItemArray:null,
        _currentTaskItemsContainerWidget:null,
        currentMessagePageNumber:null,
        currentUnReadMessageNumber:null,
        currentMessageType:null,         
        postCreate: function(){
            console.log("MessageListWidget created");
            this.currentMessagePageNumber=1;
            this.loadMessageListEventHandler=
                Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_LOADMESSAGE_EVENT,dojo.hitch(this, "doLoadMessageHandler"));            
            this.refreshMessageCountRequestEventHandler=
                Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_REQUEST_EVENT,dojo.hitch(this, "doRefreshMessageCountRequestHandler"));            
            this.queryTypeSelect.set("onChange", dojo.hitch(this,this.setQueryOptionInput));
            this.messageItemsArray=[];
            var messageMagazineViewListContainerHeight= this.containerHeight-85;
            var messageMagazineViewListContainerHeightString="" +messageMagazineViewListContainerHeight+"px";
            dojo.style(this.messageMagazineViewListContainer,"height",messageMagazineViewListContainerHeightString);
            this.currentSelectedMessageItemArray=[];
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_TASKCENTER_RELOADTASKLIST_EVENT,dojo.hitch(this,"_reloadTaskItems"));
        },
        setQueryOptionInput:function(){
            var currentQueryType=this.queryTypeSelect.get("value");
            this.queryTextInput.set("value","");
            this.queryDateInput.set("value",new Date());
            if(currentQueryType=="SUBJECT"||currentQueryType=="SENDER"){
                dojo.style(this.queryTextInput.domNode,"display","");
                dojo.style(this.queryDateInput.domNode,"display","none");
            }
            if(currentQueryType=="SENTDATE"){
                dojo.style(this.queryTextInput.domNode,"display","none");
                dojo.style(this.queryDateInput.domNode,"display","");
            }
        },
        doLoadMessageHandler:function(dataObj){
            if(dataObj.messageType){
            	this.currentMessageType=dataObj.messageType;
            	if(dataObj.initQuery){
            		this.currentMessagePageNumber=1;            		
            		this.queryTypeSelect.set("value","SENDER");
            		this.setQueryOptionInput();               		
            	}            	
                this.loadMessageItems(dataObj.messageType);
                if(dataObj.messageType=="MESSAGE"){
                  this.messageListTypeContainer.innerHTML="<i class='icon-comments'></i> 消息";
                }
                if(dataObj.messageType=="NOTIFICATION"){
                    this.messageListTypeContainer.innerHTML="<i class='icon-info-sign'></i> 通知";
                }
                if(dataObj.messageType=="TASK"){
                    this.messageListTypeContainer.innerHTML="<i class='icon-tag'></i> 工作";
                }
            }
        },
        doRefreshMessageCountRequestHandler:function(dataObj){
            this.currentUnReadMessageNumber--;
        	if(dataObj.messageType=="MESSAGE"){
        		Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newMessageCount:this.currentUnReadMessageNumber,messageType:"MESSAGE"});
            }
            if(dataObj.messageType=="NOTIFICATION"){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newNotificationCount:this.currentUnReadMessageNumber,messageType:"NOTIFICATION"});
            }
        },
        doQueryMessage:function(){
            Application.MessageUtil.publishMessage(APP_MESSAGECENTER_CLEARMESSAGEPREVIEWPANEL_EVENT,{});
        	if(this.queryTypeSelect.get("value")=="SENDER"){
        		this.currentQueryCriteria="messageSenderName";
        		if(this.queryTextInput.get("value")==""){
        			UI.showToasterMessage({type:"warning",message:"请输入发送人信息"});
        			return;
        		}
        		this.currentQueryValue=this.queryTextInput.get("value");
        	}
        	if(this.queryTypeSelect.get("value")=="SENTDATE"){
        		this.currentQueryCriteria="messageSentDate";
        		if(!this.queryDateInput.get("value")){
        			UI.showToasterMessage({type:"warning",message:"请选择发送时间"});
        			return;
        		}   
        		this.currentQueryValue=this.queryDateInput.get("value");
        	}
        	if(this.queryTypeSelect.get("value")=="SUBJECT"){
        		this.currentQueryCriteria="messageTitle";
        		if(this.queryTextInput.get("value")==""){
        			UI.showToasterMessage({type:"warning",message:"请输入标题信息"});
        			return;
        		}
        		this.currentQueryValue=this.queryTextInput.get("value");
        	} 
        	this.currentMessagePageNumber=1;
        	this.doLoadMessageHandler({messageType:this.currentMessageType});
        },
        getNextPageMessage:function(){
        	this.currentMessagePageNumber++;        	
        	this.doLoadMessageHandler({messageType:this.currentMessageType});        	
        },
        getPreviousPageMessage:function(){
        	this.currentMessagePageNumber--;        	
        	this.doLoadMessageHandler({messageType:this.currentMessageType});
        },
        loadMessageItems:function(messageType){
        	UI.showProgressDialog("查询数据");
            var that=this;
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                that._cleanDirtyItemData();
                if(messageType=="MESSAGE"){
                    that._loadMessageItems();
                }
                if(messageType=="NOTIFICATION"){
                    that._loadNotificationItems();
                }
                if(messageType=="TASK"){
                    that._loadTaskItems();
                }
                timer.stop();
            };
            timer.start();
        },
        _loadMessageItems:function(){
            this._showHideItemSearchElements("SHOW");
            var queryMessagesDataObject={};
            queryMessagesDataObject.messageScope=APPLICATION_ID;
            queryMessagesDataObject.receiverId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            queryMessagesDataObject.currentMessageListPageNumber= this.currentMessagePageNumber;
            queryMessagesDataObject.messagesNumberPerPage=15;              
            if(this.queryTypeSelect.get("value")=="SENDER"){
            	if(this.queryTextInput.get("value")!=""){
            		queryMessagesDataObject.queryCriteria="messageSenderName";
                	queryMessagesDataObject.queryValue=this.queryTextInput.get("value");
            	}
            }	        	
        	if(this.queryTypeSelect.get("value")=="SENTDATE"){
        		if(this.queryDateInput.get("value")){
        			queryMessagesDataObject.queryCriteria="messageSentDate";
                	queryMessagesDataObject.queryValue=this.queryDateInput.get("value").getTime();        			
        		}       		
        	}        	
        	if(this.queryTypeSelect.get("value")=="SUBJECT"){        		
        		if(this.queryTextInput.get("value")!=""){
        			queryMessagesDataObject.queryCriteria="messageTitle";
                	queryMessagesDataObject.queryValue=this.queryTextInput.get("value");
        		}        		
        	}
            var queryMessageDataContent=dojo.toJson(queryMessagesDataObject);            
            var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/fetchMessages/";
        	var errorCallback= function(data){        	   
        	    UI.showSystemErrorMessage(data);
        	};
        	var that=this;
        	var loadCallback=function(data){ 
        		var isOdd=true;
        		var unReadMessageCount=data.unReadMessageCount;
        		var totalMessageCount=data.totalMessageCount;
        		var currentMessageListPageNumber=data.currentMessageListPageNumber;        		
        		var totalMessageListPageNumber=data.totalMessageListPageNumber;
        		var isLastPage=data.lastPage;        		
        		var queryCriteria=data.queryCriteria;
        		var queryValue=data.queryValue;        		
        		var messagesOfCurrentPage=data.messagesOfCurrentPage;
        		var totalNumberInCurrentPage=messagesOfCurrentPage.length;
        		
        		dojo.forEach(messagesOfCurrentPage,function(message){
        			var messageItemData={};
                    messageItemData["messageContent"]= message.messageContent;
                    messageItemData["messageReadStatus"] =message.messageReadStatus;
                    messageItemData["messageSender"] =message.messageSenderName;
                    messageItemData["messageSenderId"] =message.messageSenderId;
                    messageItemData["messageSentDate"]=new Date(message.messageSentDate);
                    messageItemData["messageReceivers"]= that._getMessageReceiversNameList(message.messageReceivers);
                    messageItemData["senderFacePicURL"] =PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+message.messageSenderId;
                    messageItemData["messageObjectId"] =message.messageId;
                    messageItemData["messageSubject"] =message.messageTitle;
                    var currentMessageItem=new vfbam.userclient.components.messageCenter.widget.messageList.MessageMagazineViewItemWidget(
                    		{messageItemData:messageItemData,messageItemsContainer:that.messageMagazineViewListContainer,
                            currentSelectedMessageItemArray:that.currentSelectedMessageItemArray
                    });
                    if(isOdd){
                    	domClass.add(currentMessageItem.domNode, "app_magazineView_item_odd");
                    }else{
                        domClass.add(currentMessageItem.domNode, "app_magazineView_item_even");
                    }
                    isOdd=!isOdd;
                    that.messageMagazineViewListContainer.appendChild(currentMessageItem.domNode);
                    that.messageItemsArray.push(currentMessageItem);
        		});   	
        		if(that.messageItemsArray.length>0){
                    that.messageItemsArray[0].selectMessageItem();
                }        		
        		if(currentMessageListPageNumber==1){
        			that.previousPageButton.set("disabled","disabled");
        		}else{
        			that.previousPageButton.set("disabled",false);
        		}
        		if(isLastPage){        			
        			that.nextPageButton.set("disabled","disabled");
        		}else{        			
        			that.nextPageButton.set("disabled",false);
        		}        
        		that.currentUnReadMessageNumber=unReadMessageCount;
        		that.currentMessageListPageNumber.innerHTML=currentMessageListPageNumber;
        		that.totalMessageListPageNumber.innerHTML=totalMessageListPageNumber;
        		if(totalMessageListPageNumber==0){
        			that.currentMessageListPageNumber.innerHTML=0;
        		}
                that.messageTotalNumber.innerHTML=totalMessageCount;
                UI.hideProgressDialog();
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newMessageCount:unReadMessageCount,messageType:"MESSAGE"});
                UI.showToasterMessage({type:"success",message:"获取到"+totalNumberInCurrentPage+"条消息"});        		
        	};        	
        	Application.WebServiceUtil.postJSONData(resturl,queryMessageDataContent,loadCallback,errorCallback);            
        },
        _loadNotificationItems:function(){
            this._showHideItemSearchElements("SHOW");
            var queryNotificationsDataObject={};
            queryNotificationsDataObject.notificationScope=APPLICATION_ID;
            queryNotificationsDataObject.receiverId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            queryNotificationsDataObject.currentNotificationListPageNumber= this.currentMessagePageNumber;
            queryNotificationsDataObject.notificationsNumberPerPage=15;
            if(this.queryTypeSelect.get("value")=="SENDER"){
                if(this.queryTextInput.get("value")!=""){
                    queryNotificationsDataObject.queryCriteria="messageSenderName";
                    queryNotificationsDataObject.queryValue=this.queryTextInput.get("value");
                }
            }
            if(this.queryTypeSelect.get("value")=="SENTDATE"){
                if(this.queryDateInput.get("value")){
                    queryNotificationsDataObject.queryCriteria="messageSentDate";
                    queryNotificationsDataObject.queryValue=this.queryDateInput.get("value").getTime();
                }
            }
            if(this.queryTypeSelect.get("value")=="SUBJECT"){
                if(this.queryTextInput.get("value")!=""){
                    queryNotificationsDataObject.queryCriteria="messageTitle";
                    queryNotificationsDataObject.queryValue=this.queryTextInput.get("value");
                }
            }
            var queryNotificationDataContent=dojo.toJson(queryNotificationsDataObject);
            var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/fetchNotifications/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var isOdd=true;
                var unReadMessageCount=data.unReadNotificationCount;
                var totalMessageCount=data.totalNotificationCount;
                var currentMessageListPageNumber=data.currentNotificationListPageNumber;
                var totalMessageListPageNumber=data.totalNotificationListPageNumber;
                var isLastPage=data.lastPage;
                var queryCriteria=data.queryCriteria;
                var queryValue=data.queryValue;
                var notificationsOfCurrentPage=data.notificationsOfCurrentPage;
                var totalNumberInCurrentPage=notificationsOfCurrentPage.length;

                dojo.forEach(notificationsOfCurrentPage,function(notification){
                    var commonNotificationVO=notification.commonNotificationVO;
                    var notificationItemData={};
                    notificationItemData["notificationType"] =commonNotificationVO.notificationType;
                    notificationItemData["notificationStatus"] =commonNotificationVO.notificationStatus;
                    notificationItemData["notificationReadStatus"] =commonNotificationVO.notificationReadStatus;
                    notificationItemData["notificationSender"] =commonNotificationVO.notificationSenderName;
                    notificationItemData["notificationSenderId"] =commonNotificationVO.notificationSenderId;
                    notificationItemData["notificationSentDate"]=new Date(commonNotificationVO.notificationSentDate);
                    notificationItemData["notificationReceivers"]=that._getMessageReceiversNameList(commonNotificationVO.notificationReceivers);
                    notificationItemData["notificationSubject"] =commonNotificationVO.notificationTitle;
                    notificationItemData["notificationContent"] =commonNotificationVO.notificationContent;
                    notificationItemData["notificationObjectId"] =commonNotificationVO.notificationId;
                    notificationItemData["notificationHandleable"] =commonNotificationVO.notificationHandleable;
                    if(commonNotificationVO.notificationType!=MESSAGESERVICE_NotificationType_COMMONNOTICE){
                        notificationItemData["notificationMetaData"]= notification;
                    }
                    var currentMessageItem=new vfbam.userclient.components.messageCenter.widget.messageList.NotificationMagazineViewItemWidget(
                        {notificationItemData:notificationItemData,messageItemsContainer:that.messageMagazineViewListContainer,
                            currentSelectedMessageItemArray:that.currentSelectedMessageItemArray
                        });
                    if(isOdd){
                        domClass.add(currentMessageItem.domNode, "app_magazineView_item_odd");
                    }else{
                        domClass.add(currentMessageItem.domNode, "app_magazineView_item_even");
                    }
                    isOdd=!isOdd
                    that.messageMagazineViewListContainer.appendChild(currentMessageItem.domNode);
                    that.messageItemsArray.push(currentMessageItem);
                });

                if(that.messageItemsArray.length>0){
                    that.messageItemsArray[0].selectMessageItem();
                }
                if(currentMessageListPageNumber==1){
                    that.previousPageButton.set("disabled","disabled");
                }else{
                    that.previousPageButton.set("disabled",false);
                }
                if(isLastPage){
                    that.nextPageButton.set("disabled","disabled");
                }else{
                    that.nextPageButton.set("disabled",false);
                }
                that.currentUnReadMessageNumber=unReadMessageCount;
                that.currentMessageListPageNumber.innerHTML=currentMessageListPageNumber;
                that.totalMessageListPageNumber.innerHTML=totalMessageListPageNumber;
                if(totalMessageListPageNumber==0){
                    that.currentMessageListPageNumber.innerHTML=0;
                }
                that.messageTotalNumber.innerHTML=totalMessageCount;
                UI.hideProgressDialog();
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newNotificationCount:unReadMessageCount,messageType:"NOTIFICATION"});
                UI.showToasterMessage({type:"success",message:"获取到"+totalNumberInCurrentPage+"条通知"});
            };
            Application.WebServiceUtil.postJSONData(resturl,queryNotificationDataContent,loadCallback,errorCallback);
        },
        _loadTaskItems:function(){
            this._showHideItemSearchElements("HIDE");
            this._currentTaskItemsContainerWidget=new vfbam.userclient.components.messageCenter.widget.messageList.TaskMagazineViewItemContainerWidget(
                {messageItemsContainer:this.messageMagazineViewListContainer,
                    currentSelectedMessageItemArray:this.currentSelectedMessageItemArray,messageItemsArray:this.messageItemsArray
                });
            this.messageMagazineViewListContainer.appendChild(this._currentTaskItemsContainerWidget.domNode);

            var totalNumber=0;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=ACTIVITY_SERVICE_ROOT+"participantTasksDetailInfo/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var participantTasksVOList=data.participantTasksVOList;
                if(participantTasksVOList){
                    totalNumber=participantTasksVOList.length;
                    dojo.forEach(participantTasksVOList,function(participantTask){
                        var currentTaskItemData={};
                        currentTaskItemData["taskName"]=participantTask.activityStepName;
                        currentTaskItemData["activityName"]=participantTask.activityType;
                        currentTaskItemData["activityId"]=participantTask.activityStep.activityId;
                        if(participantTask.stepDescription){
                            currentTaskItemData["taskDescription"]=participantTask.stepDescription;
                        }else{
                            currentTaskItemData["taskDescription"]="-";
                        }
                        currentTaskItemData["taskDueDate"]=new Date(participantTask.dueDate);
                        if(participantTask.activityStep.relatedRole){
                            currentTaskItemData["taskRole"]=participantTask.activityStep.relatedRole.displayName;
                            currentTaskItemData["taskRoleID"]=participantTask.activityStep.relatedRole.roleName;
                        }else{
                            currentTaskItemData["taskRole"]="-";
                        }
                        currentTaskItemData["taskDueStatus"]=participantTask.dueStatus;
                        currentTaskItemData["taskResponse"]=participantTask.activityStep.stepResponse;
                        var taskDataFields=[];
                        var taskDataDetailInfo=participantTask.activityStep.activityDataFieldValueList.activityDataFieldValueList;
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
                        currentTaskItemData["taskDataFields"] = taskDataFields;
                        currentTaskItemData["stepAssignee"] = participantTask.stepAssignee;
                        currentTaskItemData["stepOwner"] = participantTask.stepOwner;
                        that._currentTaskItemsContainerWidget.renderTaskMagazineViewItem(currentTaskItemData);
                    },this);

                    var selectedfirstTask=false;
                    selectedfirstTask=that._currentTaskItemsContainerWidget.selectFirstItem("OVERDUE");
                    if(!selectedfirstTask){
                        selectedfirstTask=that._currentTaskItemsContainerWidget.selectFirstItem("DUETODAY");
                    }
                    if(!selectedfirstTask){
                        selectedfirstTask=that._currentTaskItemsContainerWidget.selectFirstItem("DUETHISWEEK");
                    }
                    if(!selectedfirstTask){
                        that._currentTaskItemsContainerWidget.selectFirstItem("NODEU");
                    }

                    that.messageTotalNumber.innerHTML=totalNumber;
                    UI.hideProgressDialog();
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newTaskCount:totalNumber,messageType:"TASK"});
                    UI.showToasterMessage({type:"success",message:"获取到"+totalNumber+"项任务"});
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
            /*
            //mockdata start
            totalNumber=totalNumber+15;
            for(i=0;i<totalNumber;i++){
                var mockTaskItemData={};
                mockTaskItemData["taskName"]="撰写季度采购报告"+i;
                mockTaskItemData["activityName"]="制造部采购审批"+i;
                mockTaskItemData["activityId"]=120+i;
                mockTaskItemData["taskDescription"]="制造部采购审批业务描述  制造部采购审批业务描述制造部采购审批业务描述 制造部采购审批业务描述 制造部采购审批业务描述制造部采购审批业务描述 制造部采购审批业务描述"+i;
                mockTaskItemData["taskDueDate"]=new Date();
                mockTaskItemData["taskRole"]="制造部"+i;
                //mockTaskItemData["taskDueStatus"]="NODEU";
                mockTaskItemData["taskDueStatus"]="OVERDUE";

                //if(i==15||i==20||i==21||i==17||i==19){
                //    mockTaskItemData["taskDueStatus"]="OVERDUE";
                //}

                if(i==7||i==14||i==6||i==8||i==4||i==1){
                    mockTaskItemData["taskDueStatus"]="DUETODAY";
                }
                if(i==3||i==2||i==5||i==13||i==12){
                    mockTaskItemData["taskDueStatus"]="DUETHISWEEK";
                }
                this._currentTaskItemsContainerWidget.renderTaskMagazineViewItem(mockTaskItemData);
            }
            var selectedfirstTask=false;
            selectedfirstTask=this._currentTaskItemsContainerWidget.selectFirstItem("OVERDUE");
            if(!selectedfirstTask){
                selectedfirstTask=this._currentTaskItemsContainerWidget.selectFirstItem("DUETODAY");
            }
            if(!selectedfirstTask){
                selectedfirstTask=this._currentTaskItemsContainerWidget.selectFirstItem("DUETHISWEEK");
            }
            if(!selectedfirstTask){
                this._currentTaskItemsContainerWidget.selectFirstItem("NODEU");
            }
            this.messageTotalNumber.innerHTML=totalNumber;
            Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newTaskCount:totalNumber,messageType:"TASK"});
            UI.showToasterMessage({type:"success",message:"获取到"+totalNumber+"项任务"});
            //mockdata end
            */
        },
        _getMessageReceiversNameList:function(receiversListObj){        	
        	var receiversNameList=[];
        	dojo.forEach(receiversListObj,function(receiverObj){
        		receiversNameList.push(receiverObj.receiverDisplayName);        		      		
        	});
        	return receiversNameList;             	
        },
        _cleanDirtyItemData:function(){
            dojo.empty(this.messageMagazineViewListContainer);
            if(this._currentTaskItemsContainerWidget){
                this._currentTaskItemsContainerWidget.destroy();
            }
            dojo.forEach(this.messageItemsArray,function(messageItem){
                messageItem.destroy();
            });
            this.messageItemsArray=[];
            this.currentSelectedMessageItemArray.splice(0, this.currentSelectedMessageItemArray.length);
        },
        _showHideItemSearchElements:function(switcher){
            if(switcher=="SHOW"){
                dojo.style(this.searchLabel,"visibility","visible");
                dojo.style(this.queryTypeSelect.domNode,"visibility","visible");
                dojo.style(this.searchInputArea,"visibility","visible");
                dojo.style(this.searchButtonArea,"visibility","visible");

                dojo.style(this.previousPageButton.domNode,"visibility","visible");
                dojo.style(this.nextPageButton.domNode,"visibility","visible");

                dojo.style(this.itemsPageInfoArea,"visibility","visible");
            }else{
                dojo.style(this.searchLabel,"visibility","hidden");
                dojo.style(this.queryTypeSelect.domNode,"visibility","hidden");
                dojo.style(this.searchInputArea,"visibility","hidden");
                dojo.style(this.searchButtonArea,"visibility","hidden");

                dojo.style(this.previousPageButton.domNode,"visibility","hidden");
                dojo.style(this.nextPageButton.domNode,"visibility","hidden");
                dojo.style(this.itemsPageInfoArea,"visibility","hidden");
            }
        },
        _reloadTaskItems:function(eventPayload){
            if(this.currentMessageType=="TASK"){
                this._cleanDirtyItemData();
                this._currentTaskItemsContainerWidget=new vfbam.userclient.components.messageCenter.widget.messageList.TaskMagazineViewItemContainerWidget(
                    {messageItemsContainer:this.messageMagazineViewListContainer,
                        currentSelectedMessageItemArray:this.currentSelectedMessageItemArray,messageItemsArray:this.messageItemsArray
                    });
                this.messageMagazineViewListContainer.appendChild(this._currentTaskItemsContainerWidget.domNode);
                var totalNumber=0;
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var resturl=ACTIVITY_SERVICE_ROOT+"participantTasksDetailInfo/"+APPLICATION_ID+"/"+userId+"/";
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var that=this;
                var loadCallback=function(data){
                    var participantTasksVOList=data.participantTasksVOList;
                    if(participantTasksVOList){
                        totalNumber=participantTasksVOList.length;
                        dojo.forEach(participantTasksVOList,function(participantTask){
                            var currentTaskItemData={};
                            currentTaskItemData["taskName"]=participantTask.activityStepName;
                            currentTaskItemData["activityName"]=participantTask.activityType;
                            currentTaskItemData["activityId"]=participantTask.activityStep.activityId;
                            if(participantTask.stepDescription){
                                currentTaskItemData["taskDescription"]=participantTask.stepDescription;
                            }else{
                                currentTaskItemData["taskDescription"]="-";
                            }
                            currentTaskItemData["taskDueDate"]=new Date(participantTask.dueDate);
                            if(participantTask.activityStep.relatedRole){
                                currentTaskItemData["taskRole"]=participantTask.activityStep.relatedRole.displayName;
                                currentTaskItemData["taskRoleID"]=participantTask.activityStep.relatedRole.roleName;
                            }else{
                                currentTaskItemData["taskRole"]="-";
                            }
                            currentTaskItemData["taskDueStatus"]=participantTask.dueStatus;
                            currentTaskItemData["taskResponse"]=participantTask.activityStep.stepResponse;
                            var taskDataFields=[];
                            var taskDataDetailInfo=participantTask.activityStep.activityDataFieldValueList.activityDataFieldValueList;
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
                            currentTaskItemData["taskDataFields"] = taskDataFields;
                            currentTaskItemData["stepAssignee"] = participantTask.stepAssignee;
                            currentTaskItemData["stepOwner"] = participantTask.stepOwner;
                            that._currentTaskItemsContainerWidget.renderTaskMagazineViewItem(currentTaskItemData);
                        },this);

                        var selectedfirstTask=false;
                        selectedfirstTask=that._currentTaskItemsContainerWidget.selectFirstItem("OVERDUE");
                        if(!selectedfirstTask){
                            selectedfirstTask=that._currentTaskItemsContainerWidget.selectFirstItem("DUETODAY");
                        }
                        if(!selectedfirstTask){
                            selectedfirstTask=that._currentTaskItemsContainerWidget.selectFirstItem("DUETHISWEEK");
                        }
                        if(!selectedfirstTask){
                            that._currentTaskItemsContainerWidget.selectFirstItem("NODEU");
                        }
                        that.messageTotalNumber.innerHTML=totalNumber;
                        Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newTaskCount:totalNumber,messageType:"TASK"});
                        if(totalNumber==0){
                            Application.MessageUtil.publishMessage(APP_MESSAGECENTER_CLEARMESSAGEPREVIEWPANEL_EVENT,{});
                        }
                    }
                };
                Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
            }
        },
        autoRefreshMessageItems:function(){
            this.refreshUnreadMessageItems();
            //other logic for refresh message list
        },
        refreshUnreadMessageItems:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/countUnReadInformationNumber/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                console.log("Error occurred during auto refresh my messages list data");
            };
            var loadCallback=function(data){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newMessageCount:data.messageNumber,messageType:"MESSAGE"});
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,{newNotificationCount:data.notificationNumber,messageType:"NOTIFICATION"});
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        _endOfCode: function(){}
    });
});