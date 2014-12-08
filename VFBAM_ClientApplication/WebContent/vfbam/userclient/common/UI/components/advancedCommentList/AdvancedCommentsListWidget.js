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
            if(commentType=="ACTIVITY_DOCUMENT"){
                var activityFileInfoContent=dojo.toJson(commentQueryInfo);
                var resturl=COMMENT_SERVICE_ROOT+"activityDocumentComments/";
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
                Application.WebServiceUtil.postJSONData(resturl,activityFileInfoContent,loadCallback,errorCallback);
            }
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
            if(this.commentType="ACTIVITY_DOCUMENT"){
                var addActivityDocumentCommentObj={};
                var newCommentObj={};
                newCommentObj.activitySpaceName=APPLICATION_ID;
                newCommentObj.commentContent=commentContent;
                newCommentObj.commentAuthor=userId;
                addActivityDocumentCommentObj.newComment=newCommentObj;
                var activityDocumentObj={};
                activityDocumentObj.activitySpaceName=APPLICATION_ID;
                activityDocumentObj.activityName=this.documentMetaInfo.taskItemData.activityName;
                activityDocumentObj.activityId=this.documentMetaInfo.taskItemData.activityId;
                activityDocumentObj.parentFolderPath=this.documentMetaInfo.documentInfo.documentFolderPath;
                activityDocumentObj.fileName=this.documentMetaInfo.documentInfo.documentName;
                activityDocumentObj.participantName=userId;
                addActivityDocumentCommentObj.activityDocument=activityDocumentObj;
                var addActivityDocumentCommentObjContent=dojo.toJson(addActivityDocumentCommentObj);
                var resturl=COMMENT_SERVICE_ROOT+"addActivityDocumentComment/";
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
                Application.WebServiceUtil.postJSONData(resturl,addActivityDocumentCommentObjContent,loadCallback,errorCallback);
            }
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