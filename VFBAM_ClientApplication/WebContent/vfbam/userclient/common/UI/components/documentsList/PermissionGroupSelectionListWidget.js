require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/PermissionGroupSelectionListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.PermissionGroupSelectionListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        existingPermissionGroupsMap:null,
        postCreate: function(){
            this.existingPermissionGroupsMap={};
            dojo.forEach(this.documentPermissions,function(currentPermission){
                if(currentPermission.permissionScope=="GROUP"){
                    this.existingPermissionGroupsMap[currentPermission.permissionParticipant]=currentPermission;
                }
            },this);
            this.renderPermissionGroupSelectionList();
        },
        renderPermissionGroupSelectionList:function(){
            dojo.forEach(this.groupsInfo,function(currentGroupInfo){
                if(!this.existingPermissionGroupsMap[currentGroupInfo.userId]){
                    var groupSelectionItem=new vfbam.userclient.common.UI.components.documentsList.PermissionGroupSelectionItemWidget(
                        {permissionGroupInfo:currentGroupInfo,documentPermissionControlWidget:this.documentPermissionControlWidget});
                    this.permissionGroupListContainer.appendChild(groupSelectionItem.domNode);
                }
            },this);
        },
        _endOfCode: function(){}
    });
});