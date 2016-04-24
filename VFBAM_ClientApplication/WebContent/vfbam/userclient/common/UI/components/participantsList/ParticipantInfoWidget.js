require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/ParticipantInfoWidget.html","dojo/dom","dijit/popup"
],function(lang,declare, _Widget, _Templated, template,dom,popup,mouse){
    declare("vfbam.userclient.common.UI.components.participantsList.ParticipantInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        //participantNamecardWidget:null,
        nameCardShowHideTimer:null,
        postCreate: function(){
            if(this.selectParticipantCallBack){
                dojo.style(this.selectCurrentParticipantButton,"display","");
                dojo.style(this.headerDivLineContainer_3x,"display","none");
                dojo.style(this.headerDivLineContainer_4x,"display","");
            }
            this.participantPhoto.src=this.participantInfo.participantPhotoPath;
            //this.participantNameLabel.innerHTML=this.participantInfo.participantName;
            this.participantTitleLabel.innerHTML =this.participantInfo.participantTitle;
            this.participantPhoneLabel.innerHTML=this.participantInfo.participantPhone;
            this.participantEmailLink.href="mailto:"+this.participantInfo.participantEmail;
            this.participantNamecardWidget=
                new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfoWidget:this,participantInfo:this.participantInfo});
            this.participantNameLabel.set("label",this.participantInfo.participantName);
            this.participantNameLabel.set("dropDown",this.participantNamecardWidget);
        },
        /*
        showNameCard:function(){
            popup.open({popup: this.participantNamecardWidget, around: this.participantNameLabel});
            var that=this;
            this.nameCardShowHideTimer = new dojox.timing.Timer(5000);
            this.nameCardShowHideTimer.onTick = function(){
                that.hideNameCard();
                that.nameCardShowHideTimer.stop();
            }
            this.nameCardShowHideTimer.start();
        },
        hideNameCard:function(e){
            popup.close(this.participantNamecardWidget);
        },
        stopHideNameCardTimer:function(){
            this.nameCardShowHideTimer.stop();
            this.nameCardShowHideTimer=null;
        },
        */
        doSelectCurrentParticipant:function(){
            if(this.selectParticipantCallBack){
                this.selectParticipantCallBack(this.participantInfo);
            }
        },
        destroy:function(){
            this.participantNamecardWidget.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});