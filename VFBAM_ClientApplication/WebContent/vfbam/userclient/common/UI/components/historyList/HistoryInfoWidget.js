require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/historyList/template/HistoryInfoWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.historyList.HistoryInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        actionPerformerNamecardWidget:this,
        postCreate: function(){
            var dateString=dojo.date.locale.format(this.historyInfo.actionDate);
            this.actionDateLabel.innerHTML=dateString;
            this.actionPerformerPhoto.src=this.historyInfo.actionPerformer.participantPhotoPath;
            //this.actionPerformerName.innerHTML=this.historyInfo.actionPerformer.participantName;
            this.actionTagLabel.innerHTML=this.historyInfo.actionTag;
            this.actionPerformerNamecardWidget=
                new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:this.historyInfo.actionPerformer});
            this.actionPerformerName.set("label",this.historyInfo.actionPerformer.participantName);
            this.actionPerformerName.set("dropDown",this.actionPerformerNamecardWidget);
        },
        destroy:function(){
            this.actionPerformerNamecardWidget.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});