require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/widgets/template/RoleAndGlobalParticipantSelector.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.widgets.RoleAndGlobalParticipantSelector", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        globalParticipantsSearchMenuDialog:null,
        globalParticipantsSearchWidget:null,
        roleParticipantsSearchMenuDialog:null,
        roleParticipantsSearchWidget:null,
        selectedTaskAssigneeInfo:null,
        postCreate: function(){
            if(this.selectorDescription){
                this.selectorDescriptionLabel.innerHTML=this.selectorDescription;
            }else{
                dojo.style(this.selectorDescriptionLabelContainer,"display","none");
            }
            this.roleParticipantsSearchMenuDialog=new idx.widget.MenuDialog({});
            this.roleParticipantsSearchWidget=new vfbam.userclient.common.UI.components.participantsList.SingleRoleParticipantListWidget({
                popupDialog:this.roleParticipantsSearchMenuDialog,roleName:this.relatedRoleName,roleDisplayName:this.relatedRoleDisplayName,selectParticipantCallBack:dojo.hitch(this,this.doSelectRoleParticipant)});
            dojo.place(this.roleParticipantsSearchWidget.domNode, this.roleParticipantsSearchMenuDialog.containerNode);
            this.roleParticipantSearchLabel.set("label","  <span><i class='fa fa-group'></i> <span style='color:#00649d;'>任务所属部门用户</span></span>");
            this.roleParticipantSearchLabel.set("dropDown",this.roleParticipantsSearchMenuDialog);
            this.globalParticipantsSearchMenuDialog=new idx.widget.MenuDialog({});
            this.globalParticipantsSearchWidget=new vfbam.userclient.common.UI.components.participantsList.GlobalParticipantsSearchWidget({
                popupDialog:this.globalParticipantsSearchMenuDialog,selectParticipantCallBack:dojo.hitch(this,this.doSelectGlobalParticipant)});
            dojo.place(this.globalParticipantsSearchWidget.domNode, this.globalParticipantsSearchMenuDialog.containerNode);
            this.globalParticipantSearchLabel.set("label","  <span><i class='fa fa-building'></i> <span style='color:#00649d;'>所有用户</span></span>");
            this.globalParticipantSearchLabel.set("dropDown",this.globalParticipantsSearchMenuDialog);
        },
        doSelectRoleParticipant:function(participantInfo){
            this.selectedTaskAssigneeInfo=participantInfo;
            this.taskAssigneeIdField.set("value",participantInfo.participantName+"("+participantInfo.participantId+")");
            this.roleParticipantsSearchMenuDialog.close();
        },
        doSelectGlobalParticipant:function(participantInfo){
            this.selectedTaskAssigneeInfo=participantInfo;
            this.taskAssigneeIdField.set("value",participantInfo.participantName+"("+participantInfo.participantId+")");
            this.globalParticipantsSearchMenuDialog.close();
        },
        getSelectedParticipant:function(){
            if(this.selectedTaskAssigneeInfo){
                var selectedParticipantInfo={};
                selectedParticipantInfo.participantLabel=this.selectedTaskAssigneeInfo.participantName;
                selectedParticipantInfo.participantId=this.selectedTaskAssigneeInfo.participantId;
                return selectedParticipantInfo;
            }else{
                return null;
            }
        },
        destroy:function(){
            if(this.globalParticipantSearchLabel){
                this.globalParticipantSearchLabel.destroy();
            }
            if(this.roleParticipantSearchLabel){
                this.roleParticipantSearchLabel.destroy();
            }
            if(this.globalParticipantsSearchMenuDialog){
                this.globalParticipantsSearchMenuDialog.destroy();
            }
            if(this.globalParticipantsSearchWidget){
                this.globalParticipantsSearchWidget.destroy();
            }
            if(this.roleParticipantsSearchMenuDialog){
                this.roleParticipantsSearchMenuDialog.destroy();
            }
            if(this.roleParticipantsSearchWidget){
                this.roleParticipantsSearchWidget.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});