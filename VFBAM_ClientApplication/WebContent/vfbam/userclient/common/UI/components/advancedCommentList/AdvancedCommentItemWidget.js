require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/advancedCommentList/template/AdvancedCommentItemWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.advancedCommentList.AdvancedCommentItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentCommentsArray:null,
        creatorNamecardWidget:null,
        replyCommentMenuDialog:null,
        replyCommentDropDown:null,
        replyCommentDropdownButton:null,
        postCreate: function(){
            var commentDepthSpacingTDLength=""+this.commentDepth*25+"px";
            if(this.commentDepth>0){
                dojo.style(this.replyPrompt,"display","");
            }
            dojo.style(this.topHeadSpacingTd,"width",commentDepthSpacingTDLength);
            var userFacePhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ this.commentInfo.commentAuthor.userId;
            this.commentCreatorPhoto.src=userFacePhotoPath;
            this.commentContentTxt.innerHTML =this.commentInfo.commentContent;
            var commentCreateedDate=new Date(this.commentInfo.commentCreateDate);
            var dateString=dojo.date.locale.format(commentCreateedDate,{datePattern: "yyyy-MM-dd", selector: "date"});
            var timeString=dojo.date.locale.format(commentCreateedDate,{datePattern: "HH:MM", selector: "time"});
            this.commentCreateDate.innerHTML=dateString+" "+timeString;
            var commentAuthorParticipantInfo={};
            commentAuthorParticipantInfo.participantPhotoPath=userFacePhotoPath;
            commentAuthorParticipantInfo.participantId=this.commentInfo.commentAuthor.userId;
            commentAuthorParticipantInfo.participantName=this.commentInfo.commentAuthor.displayName;
            commentAuthorParticipantInfo.participantTitle=this.commentInfo.commentAuthor.title;
            commentAuthorParticipantInfo.participantPhone=this.commentInfo.commentAuthor.fixedPhone;
            commentAuthorParticipantInfo.participantEmail=this.commentInfo.commentAuthor.emailAddress;
            commentAuthorParticipantInfo.participantDesc=this.commentInfo.commentAuthor.description;
            commentAuthorParticipantInfo.participantAddress=this.commentInfo.commentAuthor.address;
            this.creatorNamecardWidget=
                new vfbam.userclient.common.UI.components.participantsList.ParticipantNamecardWidget({participantInfo:commentAuthorParticipantInfo});
            var creatorNameTxt=this.commentInfo.commentAuthor.displayName;
            /*
             //whether we need display role information for a comment creator?
             if(this.commentInfo.commentCreatorRole){
             creatorNameTxt=creatorNameTxt+" ("+this.commentInfo.commentCreatorRole.displayName+")"
             }
             */
            this.commentCreatorName.set("label",creatorNameTxt);
            this.commentCreatorName.set("dropDown",this.creatorNamecardWidget);
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            if(this.commentInfo.commentAuthor.userId==userId){
                dojo.style(this.deleteCommentButton,"display","");
                dojo.style(this.disabledDeleteCommentButton,"display","none");
            }else{
                dojo.style(this.deleteCommentButton,"display","none");
                dojo.style(this.disabledDeleteCommentButton,"display","");
            }
            this.replyCommentMenuDialog=new idx.widget.MenuDialog();
            this.replyCommentDropDown=new vfbam.userclient.common.UI.components.commentsList.CommentEditorWidget({commentListWidget:this,commentEditorLabel:"请输入回复备注内容:"});
            dojo.place(this.replyCommentDropDown.domNode, this.replyCommentMenuDialog.containerNode);
            var label="<i class='icon-reply' style='color:#444444;'></i>";
            this.replyCommentDropdownButton=
                new vfbam.userclient.common.UI.widgets.TextDropdownButton(
                    {label:label,dropDown: this.replyCommentMenuDialog},this.replyCommentDropDownContainer);
        },
        cancelAddComment:function(){
            this.replyCommentMenuDialog.close();
            this.replyCommentDropDown.clearInput();
        },
        addComment:function(commentContent){
            var that=this;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var newCommentObj={};
            newCommentObj.activitySpaceName=APPLICATION_ID;
            newCommentObj.parentCommentUUID=this.commentInfo.commentUUID;
            newCommentObj.commentContent=commentContent;
            newCommentObj.commentAuthor=userId;
            var newCommentObjContent=dojo.toJson(newCommentObj);
            var resturl=COMMENT_SERVICE_ROOT+"addSubComment/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(resultData){
                if(resultData){
                    that.replyCommentMenuDialog.close();
                    that.replyCommentDropDown.clearInput();
                    that.commentsList.reloadCommentList();
                    UI.showToasterMessage({
                        type:"success",
                        message:"添加备注成功。"
                    });
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,newCommentObjContent,loadCallback,errorCallback);
        },
        deleteComment:function(){
            var that=this;
            var confirmationLabel="请确认是否删除备注? 删除该备注会同时删除它包含的所有回复备注。";
            var confirmButtonAction=function(){
                var resturl=COMMENT_SERVICE_ROOT+"deleteComment/";
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var deleteCommentObj={};
                deleteCommentObj.activitySpaceName=APPLICATION_ID;
                deleteCommentObj.commentUUID=that.commentInfo.commentUUID;
                deleteCommentObj.operatorId=userId;
                var deleteCommentObjContent=dojo.toJson(deleteCommentObj);
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(resultData){
                    that.commentsList.reloadCommentList();
                    UI.showToasterMessage({
                        type:"success",
                        message:"删除备注成功。"
                    });

                };
                Application.WebServiceUtil.deleteJSONData(resturl,deleteCommentObjContent,loadCallback,errorCallback);
            };
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-trash'></i> 删除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        destroy:function(){
            this.creatorNamecardWidget.destroy();
            this.replyCommentMenuDialog.destroy();
            this.replyCommentDropDown.destroy();
            this.replyCommentDropdownButton.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});