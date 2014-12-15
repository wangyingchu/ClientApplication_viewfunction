require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/PermissionGroupSelectionItemWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.PermissionGroupSelectionItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.groupName.innerHTML=this.permissionGroupInfo.userDisplayName;
        },
        addPermissionGroup:function(){
            this.documentPermissionControlWidget.addPermissionGroup(this.permissionGroupInfo);
        },
        _endOfCode: function(){}
    });
});