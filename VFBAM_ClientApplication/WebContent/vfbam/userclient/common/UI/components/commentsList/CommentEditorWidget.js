require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/commentsList/template/CommentEditorWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.commentsList.CommentEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            if(this.commentEditorLabel){
                this.commentEditorLabelText.innerHTML=this.commentEditorLabel;
            }
        },
        doAddNewComment:function(){
            var newCommentValue=this.commentContentInput.get("value");
            if(newCommentValue!=""){
                this.commentListWidget.addComment(newCommentValue);
            }else{
                UI.showToasterMessage({
                    type:"error",
                    message:"请输入备注内容"
                });
            }
        },
        cancelAddNewComment:function(){
            this.commentListWidget.cancelAddComment();
        },
        clearInput:function(){
            this.commentContentInput.set("value","");
        },
        _endOfCode: function(){}
    });
});