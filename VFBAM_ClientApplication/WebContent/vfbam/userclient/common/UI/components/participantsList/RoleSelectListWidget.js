require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/RoleSelectListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.participantsList.RoleSelectListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        roleSelectItemArray:null,
        postCreate: function(){
            this.roleSelectItemArray=[];
        },
        renderRolesInfo:function(rolesInfo){
            var that=this;
            dojo.forEach(rolesInfo,function(roleInfo){
                var currentRoleSelector=new vfbam.userclient.common.UI.components.participantsList.RoleSelectItemWidget({roleInfo:roleInfo,roleSelectList:that});
                that.roleSelectListContainer.appendChild(currentRoleSelector.domNode);
                that.roleSelectItemArray.push(currentRoleSelector);
            });
        },
        getSelectedRoles:function(){
            var selectedRoleArray=[];
            dojo.forEach(this.roleSelectItemArray,function(currentWidget){
                var currentItemSelectedStatus=currentWidget.getCurrentRoleItemSelectStatus();
                if(currentItemSelectedStatus.selected){
                    selectedRoleArray.push(currentItemSelectedStatus.roleName);
                }
            },this);
            return selectedRoleArray;
        },
        doRolesListSelect:function(){
            this.globalParticipantsSearchWidget.renderGlobalRoleParticipantsList();
        },
        destroy:function(){
            dojo.forEach(this.roleSelectItemArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});