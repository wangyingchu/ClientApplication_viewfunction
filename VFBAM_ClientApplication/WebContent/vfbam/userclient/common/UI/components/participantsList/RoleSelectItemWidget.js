require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/RoleSelectItemWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.participantsList.RoleSelectItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.roleDisplayName.innerHTML=this.roleInfo.userDisplayName;
        },
        getCurrentRoleItemSelectStatus:function(){
            var selectStatus={};
            selectStatus.selected=this.roleSelectCheckbox.get("checked");
            selectStatus.roleName=this.roleInfo.userId;
            selectStatus.roleDisplayName=this.roleInfo.userDisplayName;
            return selectStatus;
        },
        fireListSelectEvent:function(){
            this.roleSelectList.doRolesListSelect();
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});