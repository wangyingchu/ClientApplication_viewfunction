//init message Center container height
var App_MessageCenter_UI_Header_Height=180;
var App_MessageCenter_UI_Dynamic_Real_Height=0;
function setContainerHeight(){
    var _messageCenterContainer=dojo.byId("app_messageCenter_myMessagesContainer");
    require(["dojo/window"], function(win){
        // Get the viewport-size of the document:
        //console.log('viewport size:', ' width: ', vs.w, ', height: ', vs.h, ', left: ', vs.l, ', top: ', vs.t);
        var vs =win.getBox();
        App_MessageCenter_UI_Dynamic_Real_Height=  vs.h-App_MessageCenter_UI_Header_Height;
        var currentHeightStyle=""+ App_MessageCenter_UI_Dynamic_Real_Height+"px";
        dojo.style(_messageCenterContainer,"height",currentHeightStyle);
    });
}
setContainerHeight();

//business logic
var APP_MESSAGECENTER_LOADMESSAGE_EVENT="APP_MESSAGECENTER_LOADMESSAGE_EVENT";
var APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT="APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT";
var APP_MESSAGECENTER_MESSAGECOUNTREFRESH_REQUEST_EVENT="APP_MESSAGECENTER_MESSAGECOUNTREFRESH_REQUEST_EVENT";
var APP_MESSAGECENTER_MESSAGESELECTED_EVENT="APP_MESSAGECENTER_MESSAGESELECTED_EVENT";
var APP_MESSAGECENTER_READMESSAGE_EVENT="APP_MESSAGECENTER_READMESSAGE_EVENT";
var APP_MESSAGECENTER_REPLYMESSAGE_EVENT="APP_MESSAGECENTER_REPLYMESSAGE_EVENT";
var APP_MESSAGECENTER_DELETEMESSAGE_EVENT="APP_MESSAGECENTER_DELETEMESSAGE_EVENT";
var APP_MESSAGECENTER_HANDLENOTIFICATION_EVENT="APP_MESSAGECENTER_HANDLENOTIFICATION_EVENT";
var APP_MESSAGECENTER_DELETENOTIFICATION_EVENT="APP_MESSAGECENTER_DELETENOTIFICATION_EVENT";
var APP_MESSAGECENTER_DELETENOTIFICATIONDIRECTLY_EVENT="APP_MESSAGECENTER_DELETENOTIFICATIONDIRECTLY_EVENT";
var APP_MESSAGECENTER_FORWARDMESSAGE_EVENT="APP_MESSAGECENTER_FORWARDMESSAGE_EVENT";
var APP_MESSAGECENTER_UPDATEMESSAGEREADSTATUS_EVENT="APP_MESSAGECENTER_UPDATEMESSAGEREADSTATUS_EVENT";
var APP_MESSAGECENTER_UPDATENOTIFICATIONEREADSTATUS_EVENT="APP_MESSAGECENTER_UPDATENOTIFICATIONEREADSTATUS_EVENT";
var APP_MESSAGECENTER_CLEARMESSAGEPREVIEWPANEL_EVENT="APP_MESSAGECENTER_CLEARMESSAGEPREVIEWPANEL_EVENT";
var messageCountRefreshListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_EVENT,updateMessageCount);
var readMessageListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_READMESSAGE_EVENT,readMessage);
var replyMessageListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_REPLYMESSAGE_EVENT,replyMessage);
var forwardMessageListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_FORWARDMESSAGE_EVENT,forwardMessage);
var deleteMessageListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_DELETEMESSAGE_EVENT,deleteMessage);

var messageListWidget=new vfbam.userclient.components.messageCenter.widget.messageList.MessageListWidget({containerHeight:App_MessageCenter_UI_Dynamic_Real_Height},"app_messageCenter_messageListContainer");
var messagePreviewWidget=new vfbam.userclient.components.messageCenter.widget.messagePreview.MessagePreviewWidget({containerHeight:App_MessageCenter_UI_Dynamic_Real_Height},"app_messageCenter_messagePreviewContainer");

var _switchPagePayload={};
_switchPagePayload["APP_PAGE_SOURCEPAGE"]={};
_switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_STATUS"]="STATIC";
_switchPagePayload["APP_PAGE_SOURCEPAGE"]["PAGE_TYPE"]="MESSAGE_CENTER";
var notificationHandlerWidget=new vfbam.userclient.common.LOGIC.notificationHandler.NotificationHandlerWidget({switchPagePayload:_switchPagePayload});

var isMessageCenterFirstLoad=true;
UI.registerStaticPageLifeCycleHandler("MESSAGE_CENTER","onShow",loadMessageListUI);
function loadMessageListUI(){
    if(isMessageCenterFirstLoad){
        loadMessages();
        isMessageCenterFirstLoad=false;
    }
}
UI.registerStaticPageLifeCycleHandler("MESSAGE_CENTER","onLoad",initMessageCenterUI);
function initMessageCenterUI(){
    var messageCenterPage=UI.getStaticPageInstance("MESSAGE_CENTER");
    if(messageCenterPage.open){
        loadMessages();
        isMessageCenterFirstLoad=false;
    }
}

autoRefreshMessageCenterData();
messageListWidget.refreshUnreadMessageItems();

//methods definition
function createMessage(initObject){
    require(["idx/oneui/Dialog"], function(Dialog){
        var messageEditor=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageEditorWidget(initObject);
        var sendMessageButton=new dijit.form.Button({
            label: "<i class='icon-rocket'></i> 发送",
            placement:"special",
            onClick: function(){
                messageEditor.sendMessage();
            }
        });
        var actionButtone=[];
        actionButtone.push(sendMessageButton);
        var	dialog = new Dialog({
            style:"width:800px;",
            title: "<i class='icon-edit'></i> 新建消息",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        dialog.connect(messageEditor, "doCloseContainerDialog", "hide");
        dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}
function updateMessageCount(dataObj){	
	if(dataObj.messageType){
		if(dataObj.messageType=="MESSAGE"){
	        dojo.byId("app_messageCenter_newMessageCount").innerHTML="("+dataObj.newMessageCount+")";
	    }
	    if(dataObj.messageType=="NOTIFICATION"){
	        dojo.byId("app_messageCenter_newNotificationCount").innerHTML="("+dataObj.newNotificationCount+")";
	    }
	    if(dataObj.messageType=="TASK"){
	        dojo.byId("app_messageCenter_newTaskCount").innerHTML="("+dataObj.newTaskCount+")";
	    }
	}    
}
function loadMessages(){    
    require(["dojo/dom-class"], function(domClass){
        domClass.add("app_messageCenter_loadMessagesLinkContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_messageCenter_loadNotificationsLinkContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_messageCenter_loadTasksLinkContainer", "app_messageCenter_selectedMessageType");
    });
    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_LOADMESSAGE_EVENT,{messageType:"MESSAGE",initQuery:true});
}
function loadNotifications(){    
    require(["dojo/dom-class"], function(domClass){
        domClass.remove("app_messageCenter_loadMessagesLinkContainer", "app_messageCenter_selectedMessageType");
        domClass.add("app_messageCenter_loadNotificationsLinkContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_messageCenter_loadTasksLinkContainer", "app_messageCenter_selectedMessageType");
    });
    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_LOADMESSAGE_EVENT,{messageType:"NOTIFICATION",initQuery:true});
}
function loadTasks(){   
    require(["dojo/dom-class"], function(domClass){
        domClass.remove("app_messageCenter_loadMessagesLinkContainer", "app_messageCenter_selectedMessageType");
        domClass.remove("app_messageCenter_loadNotificationsLinkContainer", "app_messageCenter_selectedMessageType");
        domClass.add("app_messageCenter_loadTasksLinkContainer", "app_messageCenter_selectedMessageType");
    });
    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_LOADMESSAGE_EVENT,{messageType:"TASK"});
}
function readMessage(messageData){	
	if(!messageData.messageReadStatus){
		var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/readMessage/"+messageData.messageObjectId;
		var errorCallback= function(data){        	   
		    UI.showSystemErrorMessage(data);
		};		
		var loadCallback=function(data){};        	
		Application.WebServiceUtil.putJSONData(resturl,null,loadCallback,errorCallback);		
	}		
    require(["idx/oneui/Dialog"], function(Dialog){
        var messageViewer=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageViewerWidget(messageData);
        var actionButtone=[];
        var replyMessageButton=new dijit.form.Button({
            label: "<i class='icon-reply'></i> 回复",
            onClick: function(){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_REPLYMESSAGE_EVENT,{data:messageData,callback:messageViewer.doCloseContainerDialog});
            }
        });
        actionButtone.push(replyMessageButton);

        var forwardMessageButton=new dijit.form.Button({
            label: "<i class='icon-share-alt'></i> 转发",
            onClick: function(){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_FORWARDMESSAGE_EVENT,{data:messageData,callback:messageViewer.doCloseContainerDialog});
            }
        });
        actionButtone.push(forwardMessageButton);

        var deleteMessageButton=new dijit.form.Button({
            label: "<i class='icon-trash'></i> 删除",
            onClick: function(){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_DELETEMESSAGE_EVENT,{type:"MESSAGE",data:messageData,callback: messageViewer.doCloseContainerDialog});
            }
        });
        actionButtone.push(deleteMessageButton);

        var	dialog = new Dialog({
            style:"width:800px;",
            title: "<i class='icon-edit'></i> 阅读消息",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 关闭"
        });
        dialog.connect(messageViewer, "doCloseContainerDialog", "hide");
        dojo.place(messageViewer.containerNode, dialog.containerNode);
        dialog.show();
    });
}
function replyMessage(messageData){
	if(!messageData.messageReadStatus){
		var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/readMessage/"+messageData.data.messageObjectId;
		var errorCallback= function(data){        	   
		    UI.showSystemErrorMessage(data);
		};		
		var loadCallback=function(data){};        	
		Application.WebServiceUtil.putJSONData(resturl,null,loadCallback,errorCallback);		
	}		
    messageData.data.operationType="REPLY";
    require(["idx/oneui/Dialog"], function(Dialog){
        var messageEditor=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageEditorWidget(messageData.data);
        var sendMessageButton=new dijit.form.Button({
            label: "<i class='icon-reply'></i> 发送",
            placement:"special",
            onClick: function(){
                messageEditor.sendMessage();
                if(messageData.callback){
                    messageData.callback();
                }
            }
        });
        var actionButtone=[];
        actionButtone.push(sendMessageButton);
        var	dialog = new Dialog({
            style:"width:800px;",
            title: "<i class='icon-reply'></i> 回复消息",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        dialog.connect(messageEditor, "doCloseContainerDialog", "hide");
        dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}
function forwardMessage(messageData){
    messageData.data.operationType="FORWARD";
    require(["idx/oneui/Dialog"], function(Dialog){
        var messageEditor=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageEditorWidget(messageData.data);
        var sendMessageButton=new dijit.form.Button({
            label: "<i class='icon-share-alt'></i> 发送",
            placement:"special",
            onClick: function(){
                messageEditor.sendMessage();
                if(messageData.callback){
                    messageData.callback();
                }
            }
        });
        var actionButtone=[];
        actionButtone.push(sendMessageButton);
        var	dialog = new Dialog({
            style:"width:800px;",
            title: "<i class='icon-share-alt'></i> 转发消息",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        dialog.connect(messageEditor, "doCloseContainerDialog", "hide");
        dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}
function deleteMessage(messageData){
    var messageTxt="";
    if(messageData.type=="MESSAGE"){
        messageTxt= "<b>请确认是否删除消息:</b>' "+messageData.data.messageSubject+" '?";
    }
    if(messageData.type=="NOTIFICATION"){
        messageTxt= "<b>请确认是否删除通知:</b>' "+messageData.data.notificationSubject+" '?";
    }
    var confirmButtonAction=function(){        
        if(messageData.type=="MESSAGE"){
        	var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/deleteMessage/"+messageData.data.messageObjectId;
        	var errorCallback= function(data){        	   
        	    UI.showSystemErrorMessage(data);
        	};        	
        	var loadCallback=function(data){ 
        		if(data.operationResult){
        			if(messageData.callback){
        	            messageData.callback();
        	        }
        			UI.showToasterMessage({type:"success",message:"删除消息成功"});
        		}
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_LOADMESSAGE_EVENT,{messageType:"MESSAGE"});
        	};        	
        	Application.WebServiceUtil.deleteJSONData(resturl,null,loadCallback,errorCallback);        	
        }                
    };
    var cancelButtonAction=function(){console.log("cancelButtonAction "+messageData.data.messageObjectId);};
    UI.showConfirmDialog({
        message:messageTxt,
        confirmButtonLabel:"<i class='icon-trash'></i> 删除",
        cancelButtonLabel:"<i class='icon-remove'></i> 取消",
        confirmButtonAction:confirmButtonAction,
        cancelButtonAction:cancelButtonAction
    });
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
            title: "<i class='icon-cog'></i> 信息中心参数设置",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        //dialog.connect(messageEditor, "doCloseContainerDialog", "hide");
        //dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}
function autoRefreshMessageCenterData(){
    //auto refresh my messages list data every 10 minutes
    var autoRefreshMyMessageListTimer = new dojox.timing.Timer(1000*60*10);
    autoRefreshMyMessageListTimer.onTick = function(){
        console.log("==================================");
        console.log("auto refresh my messages list data");
        console.log("==================================");
        messageListWidget.autoRefreshMessageItems()
    };
    autoRefreshMyMessageListTimer.start();
}
//global resource definition
//Message center is the default page and it will always load no matter display or not, so all global message events handlers should init here
var GLOBAL_TASK_OPERATION_HANDLER=new vfbam.userclient.common.LOGIC.taskHandler.GlobalTaskOperationHandlerWidget();
var globalCreateMessageListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_MESSAGECENTER_CREATEMESSAGE_EVENT,createMessage);
var globalDocumentOperationHandlerWidget=new vfbam.userclient.common.LOGIC.documentHandler.GlobalDocumentOperationHandlerWidget();
var globalAuthorityOperationHandlerWidget=new vfbam.userclient.common.LOGIC.authorityHandler.GlobalAuthorityOperationHandlerWidget();