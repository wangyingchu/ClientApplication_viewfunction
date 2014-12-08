//business logic
var APP_KNOWLEDGEBASE_CATEGORYSELECTED_EVENT="APP_KNOWLEDGEBASE_CATEGORYSELECTED_EVENT";
var APP_KNOWLEDGEBASE_ADDNEWCATEGORY_EVENT="APP_KNOWLEDGEBASE_ADDNEWCATEGORY_EVENT";
var APP_KNOWLEDGEBASE_UPDATECATEGORYDATA_EVENT="APP_KNOWLEDGEBASE_UPDATECATEGORYDATA_EVENT";

var addNewCategoryListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_ADDNEWCATEGORY_EVENT,doAddNewCategory);

var messageEditor_temp=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryEditorWidget({},"app_knowledgeBase_cateGoryEditorContainer");

function renderKnowledgeConfigDialog(){
    require(["idx/oneui/Dialog"], function(Dialog){
        var messageEditor=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryEditorWidget();
        var	dialog = new Dialog({
            style:"width:940px;height:700px;",
            title: "<i class='icon-cog'></i> 知识分类管理",
            content: "",
            closeButtonLabel: "<i class='icon-remove'></i> 关闭"
        });
        var closeDialogCallBack=function(){
            messageEditor.destroy();
        };
        dojo.connect(dialog,"hide",closeDialogCallBack);
        dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}

function doAddNewCategory(data){
    console.log(data);
}