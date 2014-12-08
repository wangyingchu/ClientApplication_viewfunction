require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messageList/template/MessageMagazineViewItemWidget.html",
    "dojo/dom-class","dojox/dtl/filter/htmlstrings"
],function(lang,declare, _Widget, _Templated, template,domClass,htmlstrings){
    declare("vfbam.userclient.components.messageCenter.widget.messageList.MessageMagazineViewItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        messageItemsContainerWidth:null,
        messageItemContentWidth:null,
        messageItemContentWidthString:null,
        clickEventConnectionHandler:null,
        doubleClickEventConnectionHandler:null,
        openMessageEventConnectionHandler:null,
        deleteMessageEventConnectionHandler:null,
        updateMessageReadStatusListenerHandler:null,
        postCreate: function(){
            this.messageItemsContainerWidth= dojo.contentBox(this.messageItemsContainer).w;
            this.messageSubject.innerHTML=  this.messageItemData.messageSubject;
            var abstractTxt=htmlstrings.striptags(this.messageItemData.messageContent);
            this.messageContent.innerHTML=  abstractTxt;
            if(this.messageItemData.messageReadStatus){
                dojo.style(this.newMessageIcon,"display","none");
                dojo.style(this.alreadyReadMessageIcon,"display","");
                domClass.add(this.messageSubjectContainer, "app_magazineView_item_alreadyRead");
            }else{
                dojo.style(this.newMessageIcon,"display","");
                dojo.style(this.alreadyReadMessageIcon,"display","none");
            }
            this.messageItemContentWidth= this.messageItemsContainerWidth-150;
            this.messageItemContentWidthString=""+this.messageItemContentWidth+"px";
            dojo.style(this.messageContent,"width",this.messageItemContentWidthString);
            this.clickEventConnectionHandler=dojo.connect(this.domNode,"onclick",dojo.hitch(this,this.selectMessageItem));
            this.doubleClickEventConnectionHandler=dojo.connect(this.domNode,"ondblclick",dojo.hitch(this,this.readMessage));
            this.openMessageEventConnectionHandler=dojo.connect(this.readMessageButton,"onclick",dojo.hitch(this,this.readMessage));
            this.deleteMessageEventConnectionHandler=dojo.connect(this.deleteMessageButton,"onclick",dojo.hitch(this,this.deleteMessage));             
            this.updateMessageReadStatusListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_MESSAGECENTER_UPDATEMESSAGEREADSTATUS_EVENT,dojo.hitch(this,this.updateReadStatus));            
        },
        selectMessageItem:function(eventObj){
            if(this.currentSelectedMessageItemArray&&this.currentSelectedMessageItemArray.length>0){
                domClass.remove(this.currentSelectedMessageItemArray[0].messageItemRootContainer, "app_magazineView_item_selected");
                this.currentSelectedMessageItemArray.splice(0, this.currentSelectedMessageItemArray.length);
            }
            domClass.add(this.messageItemRootContainer, "app_magazineView_item_selected");
            this.currentSelectedMessageItemArray.push(this);
            Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGESELECTED_EVENT,{type:"MESSAGE",data:this.messageItemData});
        },
        readMessage:function(){
            if(this.messageItemData){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_READMESSAGE_EVENT,this.messageItemData);                
                if(!this.messageItemData.messageReadStatus){
                	dojo.style(this.newMessageIcon,"display","none");
                    dojo.style(this.alreadyReadMessageIcon,"display","");
                    domClass.add(this.messageSubjectContainer, "app_magazineView_item_alreadyRead");
                    this.messageItemData.messageReadStatus=true;        
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_REQUEST_EVENT,{messageType:"MESSAGE"});                    
                }                
            }
        },
        updateReadStatus:function(eventMessageItemData){            	
        	if(eventMessageItemData.messageObjectId==this.messageItemData.messageObjectId){
        		if(!this.messageItemData.messageReadStatus){
                	dojo.style(this.newMessageIcon,"display","none");
                    dojo.style(this.alreadyReadMessageIcon,"display","");
                    domClass.add(this.messageSubjectContainer, "app_magazineView_item_alreadyRead");
                    this.messageItemData.messageReadStatus=true; 
                    Application.MessageUtil.publishMessage(APP_MESSAGECENTER_MESSAGECOUNTREFRESH_REQUEST_EVENT,{messageType:"MESSAGE"});                    
                }      
        	}
        },
        deleteMessage:function(){
            if(this.messageItemData){
                Application.MessageUtil.publishMessage(APP_MESSAGECENTER_DELETEMESSAGE_EVENT,{type:"MESSAGE",data:this.messageItemData});
            }
        },
        destroy:function(){
            dojo.disconnect(this.clickEventConnectionHandler);
            dojo.disconnect(this.doubleClickEventConnectionHandler);
            dojo.disconnect(this.openMessageEventConnectionHandler);
            dojo.disconnect(this.deleteMessageEventConnectionHandler);
            this.updateMessageReadStatusListenerHandler.calcelMessageListening();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});