require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/messageCenter/widget/messageEditor/template/MessageReceiverInfoWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.messageCenter.widget.messageEditor.MessageReceiverInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        receiverTypeMapping:null,
        postCreate: function(){
            this.receiverTypeMapping={};
            this.receiverTypeMapping["PARTICIPANT"]="MESC_Property_MessageReceiverType_People";
            this.receiverTypeMapping["ROLE"]="MESC_Property_MessageReceiverType_Group";
            if(this.receiverInfo.receiverType== this.receiverTypeMapping["ROLE"]){
                this.messageReceiverPic.src= "vfbam/userclient/css/image/app/userType_group.jpg";
                this.messageReceiverName.innerHTML= this.receiverInfo.receiverDisplayName;
            }else{
                this.messageReceiverPic.src= PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+this.receiverInfo.receiverId+"/";
                this.messageReceiverName.innerHTML=this.receiverInfo.receiverDisplayName+"&nbsp;("+this.receiverInfo.receiverId+")";
            }
            this.removeReceiverEventConnectionHandler=dojo.connect(this.removeReceiverBtn,"onclick",dojo.hitch(this,this.removeReceiver));
        },
        removeReceiver:function(){
            dojo.style(this.receiverContainer,"display","none");
            this.messageEditor.removeReceiver(this);
        },
        destroy:function(){
            dojo.disconnect(this.removeReceiverEventConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});