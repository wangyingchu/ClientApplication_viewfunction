require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/commentsList/template/CommentInfoWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.commentsList.CommentInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        creatorNamecardWidget:this,
        postCreate: function(){
            this.commentCreatorPhoto.src=this.commentInfo.commentCreator.participantPhotoPath;
            this.commentContentTxt.innerHTML =this.commentInfo.commentContent;
            var dateString=dojo.date.locale.format(this.commentInfo.createDate,{datePattern: "yyyy-MM-dd", selector: "date"});
            var timeString=dojo.date.locale.format(this.commentInfo.createDate,{datePattern: "HH:MM", selector: "time"});
            this.commentCreateDate.innerHTML=dateString+" "+timeString;
            this.creatorNamecardWidget=
                new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:this.commentInfo.commentCreator});
            var creatorNameTxt=this.commentInfo.commentCreator.participantName;
            /*
            //whether we need display role information for a comment creator?
            if(this.commentInfo.commentCreatorRole){
                creatorNameTxt=creatorNameTxt+" ("+this.commentInfo.commentCreatorRole.displayName+")"
            }
            */
            this.commentCreatorName.set("label",creatorNameTxt);
            this.commentCreatorName.set("dropDown",this.creatorNamecardWidget);
        },
        destroy:function(){
            this.creatorNamecardWidget.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});