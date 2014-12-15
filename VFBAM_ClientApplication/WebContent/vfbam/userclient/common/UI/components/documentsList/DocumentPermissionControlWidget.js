require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/DocumentPermissionControlWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.documentsList.DocumentPermissionControlWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        groupInfoList:null,
        permissionGroupSelectionListWidgetMenuDialog:null,
        permissionGroupSelectionListDropDown:null,
        defaultPermissionControlItemArray:null,
        groupPermissionControlItemMap:null,
        needPersistChange:null,
        postCreate: function(){
            this.needPersistChange=false;
            this.groupInfoList=[];
            this.defaultPermissionControlItemArray=[];
            this.groupPermissionControlItemMap={};
            var currentDocumentPermissions=this.documentMetaInfo.currentDocumentPermissions;
            if(!currentDocumentPermissions.configPermissionPermission){
                this.selectGroupPermissionLink.set("disabled",true);
                dojo.style(this.selectGroupPermissionLink.domNode,"color","#CCCCCC");
            }
            this.loadPermissionControlInfo();
        },
        loadPermissionControlInfo:function(){
            var that=this;
            var resturl=VFBAM_CORE_SERVICE_ROOT+"userManagementService/userUnitsInfo/"+APPLICATION_ID;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(restData){
                dojo.forEach(restData,function(userData){
                    if(userData.userType==USER_TYPE_ROLE){
                        that.groupInfoList.push(userData);
                    }
                });
                that.renderPermissionControlItems();
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        renderPermissionControlItems:function(){
            var documentPermissions=this.documentMetaInfo.documentInfo.documentPermissions;
            var currentDocumentPermissionProperties=this.documentMetaInfo.currentDocumentPermissions;
            var that=this;
            dojo.forEach(documentPermissions,function(currentPermission){
                if(currentPermission.permissionScope=="OWNER"){
                    var creatorPermissionItem=new vfbam.userclient.common.UI.components.documentsList.PermissionControlItemWidget({
                        permissionItem:currentPermission,currentDocumentPermissionProperties:currentDocumentPermissionProperties},that.creatorUserPermissionContainer);
                    that.defaultPermissionControlItemArray.push(creatorPermissionItem);
                }else if(currentPermission.permissionScope=="OTHER"){
                    var otherUserPermissionItem=new vfbam.userclient.common.UI.components.documentsList.PermissionControlItemWidget({
                        permissionItem:currentPermission,currentDocumentPermissionProperties:currentDocumentPermissionProperties},that.otherUserPermissionContainer);
                    that.defaultPermissionControlItemArray.push(otherUserPermissionItem);
                }else{
                    if(currentPermission.permissionScope=="GROUP"){
                        currentPermission.permissionParticipantDisplayName=that.getGroupDisplayName(currentPermission.permissionParticipant);
                        var groupPermissionControlIte=new vfbam.userclient.common.UI.components.documentsList.PermissionControlItemWidget({
                            permissionItem:currentPermission,permissionControlWidget:that,currentDocumentPermissionProperties:currentDocumentPermissionProperties});
                        that.groupsPermissionListContainer.appendChild(groupPermissionControlIte.domNode);
                        that.groupPermissionControlItemMap[currentPermission.permissionParticipant]=groupPermissionControlIte;
                    }
                }
            });
            this.permissionGroupSelectionListWidgetMenuDialog=new idx.widget.MenuDialog();
            this.permissionGroupSelectionListDropDown=new vfbam.userclient.common.UI.components.documentsList.PermissionGroupSelectionListWidget(
                {groupsInfo:this.groupInfoList,documentPermissions:documentPermissions,documentPermissionControlWidget:this});
            dojo.place(this.permissionGroupSelectionListDropDown.domNode, this.permissionGroupSelectionListWidgetMenuDialog.containerNode);
            this.selectGroupPermissionLink.set("dropDown",this.permissionGroupSelectionListWidgetMenuDialog);
        },
        addPermissionGroup:function(groupInfo){
            if(this.groupPermissionControlItemMap[groupInfo.userId]){
                UI.showToasterMessage({
                    type:"warn",
                    message:"该组的权限设定已经存在。"
                });
                return;
            }
            var groupPermissionObj={};
            groupPermissionObj.displayContentPermission=true;
            groupPermissionObj.addContentPermission=true;
            groupPermissionObj.deleteContentPermission=true;
            groupPermissionObj.configPermissionPermission=true;
            groupPermissionObj.editContentPermission=true;             
            groupPermissionObj.permissionParticipant=groupInfo.userId;
            groupPermissionObj.permissionParticipantDisplayName=groupInfo.userDisplayName;
            groupPermissionObj.permissionScope="GROUP";
            var groupPermissionControlIte=new vfbam.userclient.common.UI.components.documentsList.PermissionControlItemWidget({permissionItem:groupPermissionObj,permissionControlWidget:this});
            this.groupsPermissionListContainer.appendChild(groupPermissionControlIte.domNode);
            this.groupPermissionControlItemMap[groupPermissionObj.permissionParticipant]=groupPermissionControlIte;
            this.needPersistChange=true;
        },
        deletePermissionConfig:function(itemForDelete){
            var currentPermissionItem=this.groupPermissionControlItemMap[itemForDelete.permissionItem.permissionParticipant];
            currentPermissionItem.destroy();
            delete this.groupPermissionControlItemMap[itemForDelete.permissionItem.permissionParticipant];
            this.needPersistChange=true;
        },
        persistPermissionConfigChange:function(){
            var that=this;
            for(var p in this.groupPermissionControlItemMap){
                if(typeof(this.groupPermissionControlItemMap[p])=="function"){
                }else{
                    this.defaultPermissionControlItemArray.push(this.groupPermissionControlItemMap[p]);
                }
            }
            dojo.forEach(this.defaultPermissionControlItemArray,function(currentPermissionConfigItem){
                if(currentPermissionConfigItem.isModified()){
                    this.needPersistChange=true;
                }
            },this);
            var permissionControlItemArray=this.defaultPermissionControlItemArray;
            if(this.needPersistChange){
                var confirmationLabel="请确认是否保存修改过的权限设定?";
                var confirmButtonAction=function(){
                    var contentPermissionList=[];
                    dojo.forEach(permissionControlItemArray,function(currentItem){
                        var permissionData=currentItem.getPermissionConfigData();
                        contentPermissionList.push(permissionData);
                    });
                    if(that.documentMetaInfo.documentsOwnerType=="ACTIVITY"){
                        var setActivityFolderPermissionsObj={};
                        setActivityFolderPermissionsObj.permissionsList=contentPermissionList;
                        var activityDocumentObj={};
                        activityDocumentObj.activitySpaceName=APPLICATION_ID;
                        activityDocumentObj.activityName=that.documentMetaInfo.taskItemData.activityName;
                        activityDocumentObj.activityId=that.documentMetaInfo.taskItemData.activityId;
                        activityDocumentObj.parentFolderPath=that.documentMetaInfo.documentInfo.documentFolderPath;
                        activityDocumentObj.folderName=that.documentMetaInfo.documentInfo.documentName;
                        setActivityFolderPermissionsObj.activityFolder=activityDocumentObj;
                        var resturl=CONTENT_SERVICE_ROOT+"setBusinessActivityFolderPermissions/";
                        var setActivityFolderPermissionsObjContent=dojo.toJson(setActivityFolderPermissionsObj);
                        var errorCallback= function(data){
                            UI.showSystemErrorMessage(data);
                        };
                        var loadCallback=function(resultData){
                           if(resultData.operationResult){
                               //that.commentsList.reloadCommentList();
                               that.documentMetaInfo.documentInfo.documentPermissions=contentPermissionList;
                               UI.showToasterMessage({
                                   type:"success",
                                   message:"保存权限设定成功。"
                               });
                           }else{
                               UI.showToasterMessage({
                                   type:"error",
                                   message:"保存权限设定失败。"
                               });
                           }
                        };
                        Application.WebServiceUtil.postJSONData(resturl,setActivityFolderPermissionsObjContent,loadCallback,errorCallback);
                    }
                };
                UI.showConfirmDialog({
                    message:confirmationLabel,
                    confirmButtonLabel:"<i class='icon-save'></i> 保存",
                    cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                    confirmButtonAction:confirmButtonAction
                });
            }
        },
        getGroupDisplayName:function(groupId){
            var displayName="未命名";
            dojo.forEach(this.groupInfoList,function(groupInfo){
                if(groupInfo.userId==groupId){
                    displayName=groupInfo.userDisplayName;
                }
            });
            return displayName;
        },
        destroy:function(){
            if(this.permissionGroupSelectionListWidgetMenuDialog){
                this.permissionGroupSelectionListWidgetMenuDialog.destroy();
            }
            if(this.permissionGroupSelectionListDropDown){
                this.permissionGroupSelectionListDropDown.destroy();
            }
            dojo.forEach(this.defaultPermissionControlItemArray,function(currentItem){
                currentItem.destroy();
            });
            this.defaultPermissionControlItemArray=[];
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});