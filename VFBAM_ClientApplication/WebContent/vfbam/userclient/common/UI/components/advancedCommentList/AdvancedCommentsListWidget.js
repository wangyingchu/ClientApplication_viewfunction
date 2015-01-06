require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/advancedCommentList/template/AdvancedCommentsListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.advancedCommentList.AdvancedCommentsListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentCommentsArray:null,
        addNewCommentMenuDialog:null,
        addNewCommentDropDown:null,
        commentsListData:null,
        commentQueryInfo:null,
        commentType:null,
        postCreate: function(){
            var toolbarHeight=38;
            var realHeight=this.documentCommentListHeight-toolbarHeight;
            var currentHeightStyle=""+realHeight +"px";
            dojo.style(this.commentsListContainer,"height",currentHeightStyle);
            this.currentCommentsArray=[];
            this.addNewCommentMenuDialog=new idx.widget.MenuDialog();
            this.addNewCommentDropDown=new vfbam.userclient.common.UI.components.commentsList.CommentEditorWidget({commentListWidget:this});
            dojo.place(this.addNewCommentDropDown.domNode, this.addNewCommentMenuDialog.containerNode);
            this.addCommentLink.set("dropDown",this.addNewCommentMenuDialog);
        },
        loadCommentsList:function(commentQueryInfo,commentType){
            this.commentQueryInfo=commentQueryInfo;
            this.commentType=commentType;
            var that=this;
            var resturl="";
            if(commentType=="ACTIVITY_DOCUMENT"){
                resturl=COMMENT_SERVICE_ROOT+"activityDocumentComments/";
            }
            if(commentType=="PARTICIPANT_DOCUMENT"){
                resturl=COMMENT_SERVICE_ROOT+"participantDocumentComments/";
            }
            if(commentType=="APPLICATIONSPACE_DOCUMENT"){
                resturl=COMMENT_SERVICE_ROOT+"applicationSpaceDocumentComments/";
            }
            if(commentType=="ROLE_DOCUMENT"){
                resturl=COMMENT_SERVICE_ROOT+"roleDocumentComments/";
            }
            var documentInfoContent=dojo.toJson(commentQueryInfo);
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(resultData){
                var timer = new dojox.timing.Timer(200);
                timer.onTick = function(){
                    UI.hideProgressDialog();
                    timer.stop();
                };
                timer.start();
                that.commentsListData=resultData;
                that.renderCommentsList();
            };
            UI.showProgressDialog("获取备注列表");
            Application.WebServiceUtil.postJSONData(resturl,documentInfoContent,loadCallback,errorCallback);
        },
        reloadCommentList:function(){
            dojo.forEach(this.currentCommentsArray,function(infoItem){
                infoItem.destroy();
            });
            this.currentCommentsArray.splice(0, this.currentCommentsArray.length);
            this.loadCommentsList(this.commentQueryInfo,this.commentType);
        },
        renderCommentsList:function(){
            var that=this;
            var commentDepth=-1;
            dojo.forEach(this.commentsListData,function(commentItem){
                that.buildCommentItemsList(that.currentCommentsArray,that.commentsListContainer,commentDepth,commentItem);
            });
        },
        buildCommentItemsList:function(commentItemsArray,commentItemsContainer,commentDepth,commentItemData){
            var currentCommentDepth=commentDepth+1;
            var currentCommentItem=vfbam.userclient.common.UI.components.advancedCommentList.AdvancedCommentItemWidget({
                commentInfo:commentItemData,commentDepth:currentCommentDepth,commentsList:this});
            commentItemsArray.push(currentCommentItem);
            commentItemsContainer.appendChild(currentCommentItem.domNode);
            var subComments=commentItemData.subComments;
            dojo.forEach(subComments,function(subCommentItem){
                this.buildCommentItemsList(commentItemsArray,commentItemsContainer,currentCommentDepth,subCommentItem);
            },this);
        },
        addComment:function(commentContent){
            var that=this;
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl="";
            var addNewDocumentCommentObj={};
            var newCommentObj={};
            newCommentObj.activitySpaceName=APPLICATION_ID;
            newCommentObj.commentContent=commentContent;
            newCommentObj.commentAuthor=userId;
            addNewDocumentCommentObj.newComment=newCommentObj;

            if(this.commentType=="ACTIVITY_DOCUMENT"){
                var activityDocumentObj={};
                activityDocumentObj.activitySpaceName=APPLICATION_ID;
                activityDocumentObj.activityName=this.documentMetaInfo.taskItemData.activityName;
                activityDocumentObj.activityId=this.documentMetaInfo.taskItemData.activityId;
                activityDocumentObj.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                activityDocumentObj.fileName=this.documentMetaInfo.documentInfo.documentName;
                activityDocumentObj.participantName=userId;
                addNewDocumentCommentObj.activityDocument=activityDocumentObj;
                resturl=COMMENT_SERVICE_ROOT+"addActivityDocumentComment/";
            }
            if(this.commentType=="PARTICIPANT_DOCUMENT"){
                var participantentDocumentObj={};
                participantentDocumentObj.activitySpaceName=APPLICATION_ID;
                participantentDocumentObj.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                participantentDocumentObj.fileName=this.documentMetaInfo.documentInfo.documentName;
                participantentDocumentObj.participantName=userId;
                addNewDocumentCommentObj.participantDocument=participantentDocumentObj;
                resturl=COMMENT_SERVICE_ROOT+"addParticipantDocumentComment/";
            }
            if(this.commentType=="APPLICATIONSPACE_DOCUMENT"){
                var applicationSpaceDocumentObj={};
                applicationSpaceDocumentObj.activitySpaceName=APPLICATION_ID;
                applicationSpaceDocumentObj.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                applicationSpaceDocumentObj.fileName=this.documentMetaInfo.documentInfo.documentName;
                applicationSpaceDocumentObj.participantName=userId;
                addNewDocumentCommentObj.applicationSpaceDocument=applicationSpaceDocumentObj;
                resturl=COMMENT_SERVICE_ROOT+"addApplicationSpaceDocumentComment/";
            }
            if(this.commentType=="ROLE_DOCUMENT"){
                var roleDocumentObj={};
                roleDocumentObj.activitySpaceName=APPLICATION_ID;
                roleDocumentObj.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                roleDocumentObj.fileName=this.documentMetaInfo.documentInfo.documentName;
                roleDocumentObj.participantName=userId;
                roleDocumentObj.roleName=this.documentMetaInfo.documentInfo.roleName;
                addNewDocumentCommentObj.roleDocument=roleDocumentObj;
                resturl=COMMENT_SERVICE_ROOT+"addRoleDocumentComment/";
            }
            var addNewDocumentCommentObjContent=dojo.toJson(addNewDocumentCommentObj);
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(resultData){
                if(resultData){
                    that.addNewCommentMenuDialog.close();
                    that.addNewCommentDropDown.clearInput();
                    that.reloadCommentList();
                    UI.showToasterMessage({
                        type:"success",
                        message:"添加备注成功。"
                    });
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,addNewDocumentCommentObjContent,loadCallback,errorCallback);
        },
        cancelAddComment:function(){
            this.addNewCommentMenuDialog.close();
            this.addNewCommentDropDown.clearInput();
        },
        destroy:function(){
            dojo.forEach(this.currentCommentsArray,function(infoItem){
                infoItem.destroy();
            });
            this.currentCommentsArray.splice(0, this.currentCommentsArray.length);
            this.addNewCommentMenuDialog.destroy();
            this.addNewCommentDropDown.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});