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
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_HANDLENOTIFICATION_EVENT,this.notificationItemData);
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
