require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskDataEditor/template/BinaryPropertyViewerWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.basicTaskDataEditor.BinaryPropertyViewerWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            var menu_operationCollection=new dijit.DropDownMenu({ style: "display: none;"});
            var label="<i class='icon-paper-clip'></i>";
            this.taskOperationsDropdownButton=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:label,dropDown: menu_operationCollection},this.operationLink);
            var menuItem_download = new dijit.MenuItem({
                label: "<i class='icon-download-alt'></i>&nbsp;下载",
                onClick:dojo.hitch(this,this.downloadProperty)
            });
            menu_operationCollection.addChild(menuItem_download);
            if(!this.removeByContainer){
                var menuItem_remove = new dijit.MenuItem({
                    label: "<i class='icon-trash'></i>&nbsp;&nbsp;删除",
                    onClick:dojo.hitch(this,this.deleteProperty)
                });
                menu_operationCollection.addChild(menuItem_remove);
            }
        },
        downloadProperty:function(){
            var confirmButtonAction=function(){
               console.log("do download");
            }
            var confirmationLabel= "请确认是否下载任务属性<b>"+this.propertyData.name+"</b>的电子文件内容 ？";
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-download-alt'></i> 下载",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        deleteProperty:function(){
            var that=this;
            var confirmButtonAction=function(){
                console.log("do deleteProperty");
                if(that.propertyData.multipleValue){
                    var indexNumber=dojo.indexOf(that.propertyData.value, that.propertySubValue);
                    that.propertyData.value.splice(indexNumber, 1);
                }else{
                    that.propertyData.value=null;
                }
                that.deleteContentCallback();
            }
            var confirmationLabel= "请确认是否删除任务属性<b>"+this.propertyData.name+"</b>的电子文件内容 ？";
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-trash'></i> 删除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});