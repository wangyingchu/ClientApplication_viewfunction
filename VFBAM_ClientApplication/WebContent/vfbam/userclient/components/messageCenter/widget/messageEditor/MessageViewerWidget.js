require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messageEditor/template/MessageViewerWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.messageCenter.widget.messageEditor.MessageViewerWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            var dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            var timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            var dateString=dojo.date.locale.format(this.messageSentDate,dateDisplayFormat);
            var timeString=dojo.date.locale.format(this.messageSentDate,timeDisplayFormat);
            this.messageTitleTxt.innerHTML=this.messageSubject;
            this.messageSenderTxt.innerHTML=this.messageSender;
            this.messageSentDateTxt.innerHTML=dateString+" "+timeString;
            this.messageReceiversTxt.innerHTML=this.messageReceivers;
            this.senderFacePhoto.src=  this.senderFacePicURL;
            this.messageContentTxt.innerHTML=this.messageContent ;
        },
        doCloseContainerDialog:function(){},
        _endOfCode: function(){}
    });
});