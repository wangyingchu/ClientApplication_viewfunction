require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/PermissionControlItemWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.PermissionControlItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        displayContentPermissionCheckboxInput: true,
        addContentPermissionCheckboxInput: true,
        deleteContentPermissionCheckboxInput: true,
        configPermissionPermissionCheckboxInput: true,
        editContentPermissionCheckboxInput: true,
        postCreate: function(){
            this.displayContentPermissionCheckboxInput=new dijit.form.CheckBox({},this.displayContentPermissionCheckbox);
            this.addContentPermissionCheckboxInput=new dijit.form.CheckBox({},this.addContentPermissionCheckbox);
            this.deleteContentPermissionCheckboxInput=new dijit.form.CheckBox({},this.deleteContentPermissionCheckbox);
            this.configPermissionPermissionCheckboxInput=new dijit.form.CheckBox({},this.configPermissionPermissionCheckbox);
            this.editContentPermissionCheckboxInput=new dijit.form.CheckBox({},this.editContentPermissionCheckbox);
            this.displayContentPermissionCheckboxInput.set("checked",this.permissionItem.displayContentPermission);
            this.addContentPermissionCheckboxInput.set("checked",this.permissionItem.addContentPermission);
            this.deleteContentPermissionCheckboxInput.set("checked",this.permissionItem.deleteContentPermission);
            this.configPermissionPermissionCheckboxInput.set("checked",this.permissionItem.configPermissionPermission);
            this.editContentPermissionCheckboxInput.set("checked",this.permissionItem.editContentPermission);
            if(this.permissionItem.permissionScope=="OWNER"){
                this.participantDisplayName.innerHTML="创建人&nbsp;";
                dojo.style(this.deleteConfigButton,"display","none");
            }else if(this.permissionItem.permissionScope=="OTHER"){
                this.participantDisplayName.innerHTML="其他用户";
                dojo.style(this.deleteConfigButton,"display","none");
            }else{
                this.participantDisplayName.innerHTML=this.permissionItem.permissionParticipantDisplayName;
            }
            if(this.currentDocumentPermissionProperties){
                if(!this.currentDocumentPermissionProperties.configPermissionPermission){
                    this.displayContentPermissionCheckboxInput.set("disabled",true);
                    this.addContentPermissionCheckboxInput.set("disabled",true);
                    this.deleteContentPermissionCheckboxInput.set("disabled",true);
                    this.configPermissionPermissionCheckboxInput.set("disabled",true);
                    this.editContentPermissionCheckboxInput.set("disabled",true);
                    dojo.style(this.deleteConfigButton,"display","none");
                }
            }
        },
        isModified:function(){
            var currentDisplayContentPermission=this.displayContentPermissionCheckboxInput.get("checked");
            var currentAddContentPermission=this.addContentPermissionCheckboxInput.get("checked");
            var currentDeleteContentPermission=this.deleteContentPermissionCheckboxInput.get("checked");
            var currentConfigPermissionPermission=this.configPermissionPermissionCheckboxInput.get("checked");
            var currentEditContentPermission=this.editContentPermissionCheckboxInput.get("checked");
            if(currentDisplayContentPermission===this.permissionItem.displayContentPermission&
                currentAddContentPermission===this.permissionItem.addContentPermission&
                currentDeleteContentPermission===this.permissionItem.deleteContentPermission&
                currentConfigPermissionPermission===this.permissionItem.configPermissionPermission&
                currentEditContentPermission===this.permissionItem.editContentPermission){
                return false;
            }else{
                return true;
            }
        },
        getPermissionConfigData:function(){
            var permissionObj={};
            permissionObj.displayContentPermission=this.displayContentPermissionCheckboxInput.get("checked");
            permissionObj.addContentPermission=this.addContentPermissionCheckboxInput.get("checked");
            permissionObj.deleteContentPermission=this.deleteContentPermissionCheckboxInput.get("checked");
            permissionObj.configPermissionPermission=this.configPermissionPermissionCheckboxInput.get("checked");
            permissionObj.editContentPermission=this.editContentPermissionCheckboxInput.get("checked");
            permissionObj.permissionParticipant=this.permissionItem.permissionParticipant;
            permissionObj.permissionScope=this.permissionItem.permissionScope;
            return permissionObj;
        },
        doDeleteConfig:function(){
            this.permissionControlWidget.deletePermissionConfig(this);
        },
        _endOfCode: function(){}
    });
});