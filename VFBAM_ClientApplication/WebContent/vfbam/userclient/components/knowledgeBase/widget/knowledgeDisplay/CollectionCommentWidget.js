require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/CollectionCommentWidget.html","dijit/form/Textarea"
],function(lang,declare, _Widget, _Templated, template,Textarea){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.CollectionCommentWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            var commentContnet=this.knowledgeCollectionInfo.projectComment;
            this.commentContentText.innerHTML=commentContnet;
        },
        editCollectionComment: function(){
            this.commentValueField.set("value",this.knowledgeCollectionInfo.projectComment);
            dojo.style(this.commentContentText,"display","none");
            dojo.style(this.commentEditor,"display","");
        },
        addComment: function(){
            var that=this;
            var messageTxt="请确认是否更新专辑备注 ?";
            var confirmButtonAction=function() {
                UI.showProgressDialog("更新专辑备注");
                var projectInfoObj = {};
                projectInfoObj.projectId = that.knowledgeCollectionInfo.projectId;
                projectInfoObj.projectName = that.knowledgeCollectionInfo.projectName;
                projectInfoObj.projectCreatedBy = that.knowledgeCollectionInfo.projectCreatedBy;
                projectInfoObj.projectCreatedTime = that.knowledgeCollectionInfo.projectCreatedTime;
                projectInfoObj.projectLastModifiedBy = that.knowledgeCollectionInfo.projectLastModifiedBy;
                projectInfoObj.projectLastModifiedTime = that.knowledgeCollectionInfo.projectLastModifiedTime;
                projectInfoObj.projectComment = that.commentValueField.get("value");
                projectInfoObj.projectTags = that.knowledgeCollectionInfo.projectTags;
                var setNewTagObjectContent = dojo.toJson(projectInfoObj);
                var resturl = KNOWLEDGE_CONTENTSEARCH_ROOT + "updateProject/";
                var errorCallback = function (data) {
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback = function (data) {
                    var timer = new dojox.timing.Timer(300);
                    timer.onTick = function () {
                        UI.hideProgressDialog();
                        that.commentContentText.innerHTML=projectInfoObj.projectComment;
                        that.cancelAddComment();
                        UI.showToasterMessage({type: "success", message: "更新专辑备注成功"});
                        timer.stop();
                    };
                    timer.start();
                };
                Application.WebServiceUtil.postJSONData(resturl, setNewTagObjectContent, loadCallback, errorCallback);
            };
            var cancelButtonAction=function(){};
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-edit'></i> 确认更新",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        cancelAddComment: function(){
            this.commentValueField.set("value","");
            dojo.style(this.commentContentText,"display","");
            dojo.style(this.commentEditor,"display","none");
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});