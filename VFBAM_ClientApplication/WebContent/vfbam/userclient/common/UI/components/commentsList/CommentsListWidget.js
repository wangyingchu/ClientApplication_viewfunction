require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/commentsList/template/CommentsListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.commentsList.CommentsListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentCommentsArray:null,
        COMMENT_TYPE_ACTIVITY:"COMMENT_TYPE_ACTIVITY",
        COMMENT_TYPE_TASK:"COMMENT_TYPE_TASK",
        addNewCommentMenuDialog:null,
        addNewCommentDropDown:null,
        currentCommentType:null,
        postCreate: function(){
            this.currentCommentsArray=[];
            this.addNewCommentMenuDialog=new idx.widget.MenuDialog();
            this.addNewCommentDropDown=new vfbam.userclient.common.UI.components.commentsList.CommentEditorWidget({commentListWidget:this});
            dojo.place(this.addNewCommentDropDown.domNode, this.addNewCommentMenuDialog.containerNode);
            this.addCommentLink.set("dropDown",this.addNewCommentMenuDialog);
            this.currentCommentType=this.COMMENT_TYPE_ACTIVITY;
            this.renderCommentsList();
        },
        renderCommentsList:function(){
            if(this.currentCommentType==this.COMMENT_TYPE_ACTIVITY){
                this.showActivityCommentLink.set("disabled","disabled");
                this.showTaskCommentLink.set("disabled",false);
            }
            if(this.currentCommentType==this.COMMENT_TYPE_TASK){
                this.showActivityCommentLink.set("disabled",false);
                this.showTaskCommentLink.set("disabled","disabled");
            }
            var resturl=ACTIVITY_SERVICE_ROOT+"activityComments/";
            var commentsQueryObject={};
            commentsQueryObject.activitySpaceName=APPLICATION_ID;
            commentsQueryObject.activityType=this.taskData.taskItemData.activityName;
            if(this.taskData.taskItemData.hasParentActivityStep){
                commentsQueryObject.activityStepName=this.taskData.taskItemData.parentActivityStepName;
            }else{
                commentsQueryObject.activityStepName=this.taskData.taskItemData.taskName;
            }
            commentsQueryObject.activityId=this.taskData.taskItemData.activityId;
            commentsQueryObject.commentType=this.currentCommentType;
            var commentsQueryContent=dojo.toJson(commentsQueryObject);
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                if(data){
                    var commentListArray=[];
                    dojo.forEach(data,function(commentItem){
                        var currentComment={};
                        var currentCreatorParticipant={};
                        var creatorParticipant=commentItem.creatorParticipant;
                        currentCreatorParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+creatorParticipant.userId;
                        currentCreatorParticipant.participantName=creatorParticipant.displayName;
                        currentCreatorParticipant.participantId=creatorParticipant.userId;
                        currentCreatorParticipant.participantTitle=creatorParticipant.title;
                        currentCreatorParticipant.participantDesc=creatorParticipant.description;
                        currentCreatorParticipant.participantAddress=creatorParticipant.address;
                        currentCreatorParticipant.participantPhone=creatorParticipant.fixedPhone;
                        currentCreatorParticipant.participantEmail=creatorParticipant.emailAddress;
                        currentComment.commentCreator=currentCreatorParticipant;
                        if(commentItem.creatorRole){
                            var creatorRole=commentItem.creatorRole;
                            currentComment.commentCreatorRole=creatorRole;
                        }
                        currentComment.commentContent=commentItem.commentContent;
                        currentComment.createDate=new Date(commentItem.createdDate);
                        commentListArray.push(currentComment);
                    });
                    dojo.empty(that.commentsListContainer);
                    dojo.forEach(that.currentCommentsArray,function(currentCommentsArray){
                        currentCommentsArray.destroy();
                    });
                    dojo.forEach(commentListArray,function(currentComment){
                        var currentCommentInfoWidget=new vfbam.userclient.common.UI.components.commentsList.CommentInfoWidget({commentInfo:currentComment});
                        that.currentCommentsArray.push(currentCommentInfoWidget);
                        that.commentsListContainer.appendChild(currentCommentInfoWidget.domNode);
                    });
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,commentsQueryContent,loadCallback,errorCallback);
        },
        getActivityComments:function(){
            this.currentCommentType=this.COMMENT_TYPE_ACTIVITY;
            this.renderCommentsList();
        },
        getTaskComments:function(){
            this.currentCommentType=this.COMMENT_TYPE_TASK;
            this.renderCommentsList();
        },
        addComment:function(comment){
            var that =this;
            var confirmButtonAction=function(){
                that.addNewCommentMenuDialog.close();
                that.addNewCommentDropDown.clearInput();
                var resturl=ACTIVITY_SERVICE_ROOT+"addActivityComment/";
                var commentsAddingObject={};
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                commentsAddingObject.activitySpaceName=APPLICATION_ID;
                commentsAddingObject.activityType=that.taskData.taskItemData.activityName;
                if(that.taskData.taskItemData.hasParentActivityStep){
                    commentsAddingObject.activityStepName=that.taskData.taskItemData.parentActivityStepName;
                }else{
                    commentsAddingObject.activityStepName=that.taskData.taskItemData.taskName;
                }
                commentsAddingObject.activityId=that.taskData.taskItemData.activityId;
                commentsAddingObject.commentType=that.currentCommentType;
                commentsAddingObject.commentWriter=userId;
                commentsAddingObject.commentContent=comment;
                if(that.taskData.taskItemData.taskRoleID){
                    commentsAddingObject.commentWriterRoleName=that.taskData.taskItemData.taskRoleID;
                }
                var commentsAddingContent=dojo.toJson(commentsAddingObject);
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(data){
                    if(data.operationResult){
                        that.renderCommentsList();
                    }
                };
                Application.WebServiceUtil.postJSONData(resturl,commentsAddingContent,loadCallback,errorCallback);
            };
            var cancelButtonAction=function(){
                that.addNewCommentMenuDialog.open({around:that.addCommentLink.domNode});
            };
            UI.showConfirmDialog({
                message:"请确认是否添加新的备注内容？",
                confirmButtonLabel:"<i class='icon-comment-alt'></i> 确认",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        cancelAddComment:function(){
            this.addNewCommentMenuDialog.close();
            this.addNewCommentDropDown.clearInput();
        },
        destroy:function(){
            dojo.forEach(this.currentCommentsArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});