require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/AddNewFolderWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.AddNewFolderWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
        },
        doAddNewFolder:function(){
            var newFolderName=this.folderNameInput.get("value");
            if(newFolderName!=""){
                this.documentListWidget.addFolder(newFolderName);
            }else{
                UI.showToasterMessage({
                    type:"error",
                    message:"请输入文件夹名称"
                });
            }
        },
        clearInput:function(){
            this.folderNameInput.set("value","");
        },
        _endOfCode: function(){}
    });
});