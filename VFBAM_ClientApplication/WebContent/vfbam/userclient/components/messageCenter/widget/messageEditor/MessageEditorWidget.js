require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messageEditor/template/MessageEditorWidget.html","dojo/store/Memory"
],function(lang,declare, _Widget, _Templated, template,Memory){
    declare("vfbam.userclient.components.messageCenter.widget.messageEditor.MessageEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,   
        applicationUsersListStore:null,
        selectedReceiverList:null,
        receiverTypeMapping:null,
        postCreate: function(){
            if(this.messageContent){
                this.messageContentEditor.set("value",this.buildMessageContent());
            }
            if(this.messageSubject){
                this.messageTitle.set("value", this.buildMessageTitle(this.messageSubject));
            }              
            this.getApplicationUsersList();   
            this.selectedReceiverList=[];            
            this.receiverTypeMapping={};
            this.receiverTypeMapping["PARTICIPANT"]="MESC_Property_MessageReceiverType_People";
            this.receiverTypeMapping["ROLE"]="MESC_Property_MessageReceiverType_Group";
            if(this.operationType=="REPLY"&&this.messageSender&&this.messageSenderId&&this.senderFacePicURL){
                var newReceiver={
                    receiverId:this.messageSenderId,
                    receiverDisplayName:this.messageSender,
                    receiverType:this.receiverTypeMapping["PARTICIPANT"]
                };
                this._addNewReceiverInList(newReceiver);
            }
            if(this.initMessageReceiver){
                var newReceiver={
                    receiverId:this.initMessageReceiver.receiverId,
                    receiverDisplayName:this.initMessageReceiver.receiverName,
                    receiverType:this.receiverTypeMapping["PARTICIPANT"]
                };
                this._addNewReceiverInList(newReceiver);
            }
        },        
        getApplicationUsersList:function(){
        	var that=this;
        	var resturl=VFBAM_CORE_SERVICE_ROOT+"userManagementService/userUnitsInfo/"+APPLICATION_ID;
            var syncFlag=true;	    		
			var errorCallback= function(data){				
				UI.showSystemErrorMessage(data);							
			};			
			var loadCallback=function(restData){
				var userStoreData=[];				
				dojo.forEach(restData,function(userData){
					var labelText="";					
					var paperImgTag="<img src='"+PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+userData.userId+"/' class='app_userSelectionPhotoBorder'/>&nbsp;"
					var groupImgTag="<img src='vfbam/userclient/css/image/app/userType_group.jpg' class='app_userSelectionPhotoBorder'/>&nbsp;";
					if(userData.userType==USER_TYPE_ROLE){
						labelText=groupImgTag+userData.userDisplayName;
					}else{
						labelText=paperImgTag+userData.userDisplayName+"("+userData.userId+")";
					}					
					userStoreData.push({	
						label:labelText,
						userId:userData.userId,
						userDisplayName:userData.userDisplayName,
						userType:userData.userType,
                        userSelectKey: userData.userDisplayName+"("+userData.userId+")"
					});					
				});				
				that.applicationUsersListStore=new Memory({ 
					data:userStoreData
				});		
				that.messageReceiverFilter.set("store",that.applicationUsersListStore);
				that.messageReceiverFilter.set("searchAttr","userSelectKey");
				that.messageReceiverFilter.set("labelAttr","label");				
				that.messageReceiverFilter.set("labelType","html");
				that.messageReceiverFilter.set("disabled",false);					
			};					
			Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);        	
        },
        addReceiver:function(){
        	if(!this.messageReceiverFilter.isValid()){
        		UI.showToasterMessage({type:"warning",message:"请填写正确的接收人名称"});
        		return;
        	}           	
        	var selectedValue=this.messageReceiverFilter.displayedValue;
        	if(selectedValue==""){
        		UI.showToasterMessage({type:"warning",message:"请选择接收人"});
        		return;
        	}
        	var selectedReceiverObj=this.applicationUsersListStore.query({userSelectKey:selectedValue})[0];        	
        	var newReceiver={
                receiverId:selectedReceiverObj.userId,
                receiverDisplayName:selectedReceiverObj.userDisplayName,
                receiverType:this.receiverTypeMapping[selectedReceiverObj.userType]
            };        	
        	this._addNewReceiverInList(newReceiver);        	
        	this.messageReceiverFilter.set("value","");   
        },        
        _addNewReceiverInList:function(newReceiver){
        	var notAddyet=true;
        	dojo.forEach(this.selectedReceiverList,function(currentReceiver){
        		if(currentReceiver.receiverId==newReceiver.receiverId){
        			notAddyet=false;
        			return;
        		}
        	});
        	if(notAddyet){
        		this.selectedReceiverList.push(newReceiver);
                var receiverInfoWidget=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageReceiverInfoWidget({receiverInfo:newReceiver,messageEditor:this});
                this.messageReceiversDisplay.appendChild(receiverInfoWidget.domNode);
        	}
        },
        removeReceiver:function(receiverWidget){
            var receiverIdToDelete=receiverWidget.receiverInfo.receiverId;
            dojo.forEach(this.selectedReceiverList,function(currentReceiver,idx){
                if(currentReceiver){
                    if(currentReceiver.receiverId==receiverIdToDelete){
                        this.selectedReceiverList.splice(idx,1);
                        return;
                    }
                }
            },this);
            receiverWidget.destroy();
        },
        sendMessage:function(){          	
        	if(this.selectedReceiverList.length==0){
        		UI.showToasterMessage({type:"warning",message:"请添加至少一个消息接收人"});
        		return;
        	}		
            var messageTitle=this.messageTitle.get("value");
            var messageContent=this.messageContentEditor.get("value");            
            var inputValidate=true;
            if(messageTitle==""){
            	UI.showToasterMessage({type:"warning",message:"请输入消息标题"});
            	inputValidate=false;
            }
            if(!inputValidate){
            	return;
            }
            var sendMessageDataObject={};
            sendMessageDataObject.messageScope=APPLICATION_ID;
            sendMessageDataObject.messageType=MESSAGESERVICE_MessageType_MESSAGE;
            sendMessageDataObject.messageTitle=messageTitle;
            sendMessageDataObject.messageContent=messageContent;
            sendMessageDataObject.messageSenderId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            sendMessageDataObject.messageSenderName=Application.AttributeContext.getAttribute(USER_PROFILE).displayName;
            sendMessageDataObject.messageReceivers=this.selectedReceiverList;

            var sendMessageDataContent=dojo.toJson(sendMessageDataObject);            
            var resturl=MESSAGE_SERVICE_ROOT+"messageExchangeService/sendMessage/";
        	var errorCallback= function(data){
        	    UI.hideProgressDialog();
        	    UI.showSystemErrorMessage(data);
        	};
        	var that=this;
        	var loadCallback=function(data){        		
        		var timer = new dojox.timing.Timer(300);
                timer.onTick = function(){
                	that.doCloseContainerDialog();
                	UI.hideProgressDialog();
                    timer.stop();
                };
                timer.start();	
                
        	    if(data.sendSuccess){   
        	    	UI.showToasterMessage({type:"success",message:"消息发送成功"}); 	    	
        	    }else{
        	    	var errorDialogDataObj={};
        	    	var okButtonAction=function(){};        	    	
        	    	errorDialogDataObj.message="消息发送失败";
        	    	errorDialogDataObj.oKButtonAction=okButtonAction;
        	    	errorDialogDataObj.oKButtonLabel="确定";
        	    	UI.showErrorDialog(errorDialogDataObj);
        	    }        	   
        	};
        	UI.showProgressDialog("发送消息");
        	Application.WebServiceUtil.postJSONData(resturl,sendMessageDataContent,loadCallback,errorCallback);
        },
        buildMessageContent:function(){
            if(this.operationType){
                if(this.operationType=="REPLY"){
                    var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
                    var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
                    var dateString=dojo.date.locale.format(this.messageSentDate,dateDisplayFormat);
                    var timeString=dojo.date.locale.format(this.messageSentDate,timeDisplayFormat);
                    var messageSentDateTxt=dateString+" "+timeString;
                    var forwardPrompt="-------------------- 回复消息 ------------------------------------------------------------<br/>";
                    var sendDate="发送日期: "+ messageSentDateTxt+"<br/>";
                    var sender="发送人: "+this.messageSender+"<br/>";
                    var receivers="接收人: "+this.messageReceivers+"<br/>";
                    var subject="标题: "+this.messageSubject+"<br/>";
                    return "<br/><br/><br/><br/>"+"<div style='color: #00475B;font-size: 0.75em;'>"+forwardPrompt + sendDate+ sender+ receivers+  subject+"</div>"+"<hr/>"+this.messageContent;
                }
                if(this.operationType=="FORWARD"){
                    var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
                    var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
                    var dateString=dojo.date.locale.format(this.messageSentDate,dateDisplayFormat);
                    var timeString=dojo.date.locale.format(this.messageSentDate,timeDisplayFormat);
                    var messageSentDateTxt=dateString+" "+timeString;
                    var forwardPrompt="-------------------- 转发消息 ------------------------------------------------------------<br/>";
                    var sendDate="发送日期: "+ messageSentDateTxt+"<br/>";
                    var sender="发送人: "+this.messageSender+"<br/>";
                    var receivers="接收人: "+this.messageReceivers+"<br/>";
                    var subject="标题: "+this.messageSubject+"<br/>";
                    return "<br/><br/><br/><br/>"+"<div style='color: #00475B;font-size: 0.75em;'>"+forwardPrompt + sendDate+ sender+ receivers+  subject+"</div>"+"<hr/>"+this.messageContent;
                }
            }else{
                return this.messageContent;
            }
        },
        buildMessageTitle:function(titleStr){
            if(this.operationType){
                if(this.operationType=="REPLY"){
                    return "回复: "+ titleStr;
                }
                if(this.operationType=="FORWARD"){
                    return "转发: "+ titleStr;
                }
            }else{
                return titleStr;
            }
        },
        doCloseContainerDialog:function(){},
        _endOfCode: function(){}
    });
});