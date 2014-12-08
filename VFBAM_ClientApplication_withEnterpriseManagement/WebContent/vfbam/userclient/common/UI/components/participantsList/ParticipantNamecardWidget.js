require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/ParticipantNamecardWidget.html","dojo/mouse"
],function(lang,declare, _Widget, _Templated, template,mouse){
    declare("vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        //nameCardMouseOverHandler:null,
        //nameCardMouseOutHandler:null,
        postCreate: function(){
            /*
            this.nameCardMouseOverHandler=dojo.connect(this.domNode,mouse.enter,dojo.hitch(this,this.doMouseOver));
            this.nameCardMouseOutHandler=dojo.connect(this.domNode,mouse.leave,dojo.hitch(this,this.doMouseOut));
            */
            this.participantPhoto.src=this.participantInfo.participantPhotoPath;
            this.participantNameLabel.innerHTML=this.participantInfo.participantName;
            this.participantTitleLabel.innerHTML =this.participantInfo.participantTitle;
            this.participantPhoneLabel.innerHTML=this.participantInfo.participantPhone;
            this.participantEmailLink.href="mailto:"+this.participantInfo.participantEmail;
            this.participantEMailLabel.innerHTML=this.participantInfo.participantEmail;
            this.participantDesc.innerHTML=this.participantInfo.participantDesc;
            this.participantAddress.innerHTML=this.participantInfo.participantAddress;
        },
        sendMessage:function(){
            //this.participantInfoWidget.hideNameCard();
            Application.MessageUtil.publishMessage(APP_GLOBAL_MESSAGECENTER_CREATEMESSAGE_EVENT,{initMessageReceiver:{receiverId:this.participantInfo.participantId,receiverName:this.participantInfo.participantName}});
        },
        /*
        doMouseOver:function(event){
            this.participantInfoWidget.stopHideNameCardTimer();
        },
        doMouseOut:function(event){
            this.participantInfoWidget.hideNameCard();
        },
        */
        destroy:function(){
            //dojo.disconnect(this.nameCardMouseOverHandler);
            //dojo.disconnect(this.nameCardMouseOutHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});