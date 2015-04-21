require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/TaskDocumentsListWidget.html","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.common.UI.components.documentsList.TaskDocumentsListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        documentsFolderPathArray:null,
        toolbarHeight:null,
        currentDocumentsArray:null,
        addNewFolderDropDown:null,
        addNewFolderMenuDialog:null,
        addNewDocumentDropDown:null,
        currentFolderPath:null,
        parentFolderPath:null,
        currentFolderName:null,
        currentFolderDocumentsList:null,
        currentFolderPermissions:null,
        folderPermissionsInfoMap:null,
        currentFolderCreator:null,
        folderCreatorInfoMap:null,
        taskRootFolderPermissions:null,
        postCreate: function(){
            this.documentsFolderPathArray=[];
            this.currentDocumentsArray=[];
            this.folderPermissionsInfoMap={};
            this.folderCreatorInfoMap={};
            this.renderDocumentsList("/","",false);
            this.addNewFolderMenuDialog=new idx.widget.MenuDialog();
            this.addNewFolderDropDown=new vfbam.userclient.common.UI.components.documentsList.AddNewFolderWidget({documentListWidget:this});
            dojo.place(this.addNewFolderDropDown.domNode, this.addNewFolderMenuDialog.containerNode);
            this.addFolderLink.set("dropDown",this.addNewFolderMenuDialog);
            this.addNewDocumentDropDown=new vfbam.userclient.common.UI.components.documentsList.AddNewDocumentWidget({documentListWidget:this});
            this.addDocumentLink.set("dropDown",this.addNewDocumentDropDown);
        },
        resizeDocumentListSize:function(){
            if(this.containerElementId){
                var contentBox = domGeom.getContentBox(dojo.byId(this.containerElementId));
                var realHeight=contentBox.h;
                var folderListContentBox = domGeom.getContentBox(this.folderListContainer);
                realHeight=realHeight-folderListContentBox.h;
                this.toolbarHeight=38;
                realHeight=realHeight-this.toolbarHeight;
                if(this.reservationHeight!=0){
                    realHeight=realHeight-this.reservationHeight;
                }
                var currentHeightStyle=""+realHeight +"px";
                dojo.style(this.documentsListContainer,"height",currentHeightStyle);
            }
        },
        setCurrentFolderMetaInfo:function(currentFolderPath,subFolderName){
            if(currentFolderPath=="/"&&subFolderName==""){
                this.currentFolderPermissions=this.taskRootFolderPermissions;
            }else{
                this.currentFolderPermissions=null;
                this.currentFolderCreator=null;
                if(this.folderPermissionsInfoMap[currentFolderPath]){
                    this.currentFolderPermissions=this.folderPermissionsInfoMap[currentFolderPath];
                }
                if(this.folderCreatorInfoMap[currentFolderPath]){
                    this.currentFolderCreator=this.folderCreatorInfoMap[currentFolderPath];
                }
                if(this.currentFolderDocumentsList){
                    dojo.forEach(this.currentFolderDocumentsList,function(documentItem){
                        if(documentItem.isFolder){
                            if(documentItem.documentName==subFolderName){
                                if(documentItem.documentPermissions){
                                    this.folderPermissionsInfoMap[currentFolderPath]=documentItem.documentPermissions;
                                    this.currentFolderPermissions=documentItem.documentPermissions;
                                }
                                if(documentItem.documentCreator){
                                    this.folderCreatorInfoMap[currentFolderPath]=documentItem.documentCreator;
                                    this.currentFolderCreator=documentItem.documentCreator;
                                }
                            }
                        }
                    },this);
                }
            }
        },
        renderDocumentsList:function(parentFolderPath,folderName,hideProgressDialog){
            var currentFolderPath;
            var lastCharOfParentFolderPath=parentFolderPath.charAt(parentFolderPath.length-1);
            if(lastCharOfParentFolderPath=="/"){
                currentFolderPath=parentFolderPath+folderName;
            }else{
                currentFolderPath=parentFolderPath+"/"+folderName;
            }
            if(!this.documentsOwnerType){
                return;
            }
            var resturl="";
            var folderQueryContent="";
            if(this.documentsOwnerType=="PARTICIPANT"){
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var participantFolderQueryObj={};
                participantFolderQueryObj.activitySpaceName=APPLICATION_ID;
                participantFolderQueryObj.participantName=userId;
                participantFolderQueryObj.parentFolderPath=parentFolderPath;
                participantFolderQueryObj.folderName=folderName;
                folderQueryContent=dojo.toJson(participantFolderQueryObj);
                resturl=CONTENT_SERVICE_ROOT+"participantPersonalFolder/";
            }
            if(this.documentsOwnerType=="ACTIVITY"){
                var taskItemData=this.taskData.taskItemData;
                var activityId=taskItemData.activityId;
                var activityName=taskItemData.activityName;
                var activityFolderQueryObj={};
                activityFolderQueryObj.activitySpaceName=APPLICATION_ID;
                activityFolderQueryObj.activityName=activityName;
                activityFolderQueryObj.activityId=activityId;
                activityFolderQueryObj.parentFolderPath=parentFolderPath;
                activityFolderQueryObj.folderName=folderName;
                folderQueryContent=dojo.toJson(activityFolderQueryObj);
                resturl=CONTENT_SERVICE_ROOT+"businessActivityFolder/";
            }
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var timer = new dojox.timing.Timer(200);
                timer.onTick = function(){
                    if(hideProgressDialog){
                        UI.hideProgressDialog();
                    }
                    timer.stop();
                };
                timer.start();
                if(data){
                    that.currentFolderPath=data.folderPath;
                    that.parentFolderPath=data.parentFolderPath;
                    that.currentFolderName=data.folderName;
                    //set permissions for activity root folder
                    if(parentFolderPath=="/"&&folderName==""){
                        that.taskRootFolderPermissions=data.folderPermissions;
                    }
                    that.setCurrentFolderMetaInfo(currentFolderPath,folderName);
                    if(data.childContentList){
                        var documentsArray=[];
                        dojo.forEach(data.childContentList,function(documentItem){
                            var currentDocument={};
                            currentDocument["documentName"]=documentItem.documentName;
                            currentDocument["documentCreateDate"]=new Date(documentItem.documentCreateDate);
                            currentDocument["isFolder"]=documentItem.folder;
                            currentDocument["documentType"]=documentItem.documentType;
                            currentDocument["documentFolderPath"]=documentItem.documentFolderPath;
                            currentDocument["documentLastUpdateDate"]=new Date(documentItem.documentLastUpdateDate);
                            currentDocument["documentCreator"]=documentItem.documentCreator;
                            currentDocument["documentLastUpdatePerson"]=documentItem.documentLastUpdatePerson;
                            currentDocument["documentLockPerson"]=documentItem.documentLocker;
                            currentDocument["version"]=documentItem.version;
                            currentDocument["childDocumentNumber"]=documentItem.childDocumentNumber;
                            currentDocument["documentSize"]=documentItem.documentSize;
                            currentDocument["isLocked"]=documentItem.locked;
                            currentDocument["lockedBy"]=documentItem.lockedBy;
                            currentDocument["isLinked"]=documentItem.linked;
                            currentDocument["documentTags"]=documentItem.documentTags;
                            if(documentItem.contentPermissions){
                                currentDocument["documentPermissions"]=documentItem.contentPermissions;
                            }
                            documentsArray.push(currentDocument);
                        });
                        if(documentsArray.length>0){
                            that._renderDocumentsList(documentsArray);
                            that.currentFolderDocumentsList=documentsArray;
                        }else{
                            that._renderDocumentsList([]);
                            that.currentFolderDocumentsList=[];
                            if(that.containerInitFinishCounterFuc){
                                that.containerInitFinishCounterFuc();
                            }
                        }
                    }
                }else{
                    if(that.containerInitFinishCounterFuc){
                        that.containerInitFinishCounterFuc();
                    }
                }
            };
            if(hideProgressDialog){
                UI.showProgressDialog("获取文件列表");
            }
            Application.WebServiceUtil.postJSONData(resturl,folderQueryContent,loadCallback,errorCallback);
        },
        _renderDocumentsList:function(documentList){
            dojo.empty(this.folderListBbreadcrumb);
            dojo.forEach(this.documentsFolderPathArray,function(documentsFolderName,idx){
                var divChar=dojo.create("i", {className:"icon-chevron-right",style:"font-size: 0.8em;color: #666666;"});
                this.folderListBbreadcrumb.appendChild(divChar);
                var that=this;
                (function () {
                    var loadSubFolderFunction=function(){
                        that.renderSubFolder(idx);
                    };
                    dojo.create("a",{
                        style:"color:#00649D;padding-right:5px;cursor:pointer;",
                        innerHTML: " "+documentsFolderName,
                        onclick:loadSubFolderFunction
                    },that.folderListBbreadcrumb);
                })();
            },this);

            dojo.forEach(this.currentDocumentsArray,function(currentDocument){
                currentDocument.destroy();
            },this);
            this.currentDocumentsArray=[];

            var currentFolderPermissionProperties=this.getPermissionControlProperties(this.currentFolderPermissions,this.currentFolderCreator);
            if(currentFolderPermissionProperties.addContentPermission){
                this.addDocumentLink.set("disabled",false);
                dojo.style(this.addDocumentLink.domNode,"color","#00649D");
            }else{
                this.addDocumentLink.set("disabled",true);
                dojo.style(this.addDocumentLink.domNode,"color","#CCCCCC");
            }
            if(currentFolderPermissionProperties.addSubFolderPermission){
                this.addFolderLink.set("disabled",false);
                dojo.style(this.addFolderLink.domNode,"color","#00649D");

            }else{
                this.addFolderLink.set("disabled",true);
                dojo.style(this.addFolderLink.domNode,"color","#CCCCCC");
            }
            dojo.empty(this.documentsListContainer);
            dojo.forEach(documentList,function(currentDocument){
                var currentDocumentInfoWidget=new vfbam.userclient.common.UI.components.documentsList.AdvancedDocumentInfoWidget({documentInfo:currentDocument,documentListWidget:this});
                this.currentDocumentsArray.push(currentDocumentInfoWidget);
                this.documentsListContainer.appendChild(currentDocumentInfoWidget.domNode);
            },this);
            this.resizeDocumentListSize();
            if(this.containerInitFinishCounterFuc){
                this.containerInitFinishCounterFuc();
            }
        },
        renderRootFolder:function(){
            this.documentsFolderPathArray.splice(0,this.documentsFolderPathArray.length);
            this.renderDocumentsList("/","",true);
        },
        renderSubFolder:function(folderDeep){
            var needRemoveNumber=this.documentsFolderPathArray.length- folderDeep;
            this.documentsFolderPathArray.splice(folderDeep+1,needRemoveNumber);
            var parentFolderPath=this.getParentFolderPath();
            var subFolderName=this.documentsFolderPathArray[folderDeep];
            this.renderDocumentsList(parentFolderPath,subFolderName,true);
        },
        goToSubFolderByPath:function(currentFolderPath,subFolderName){
            var currentFolderPathDepth=this.documentsFolderPathArray.length;
            this.documentsFolderPathArray.splice(0,currentFolderPathDepth);
            var currentFolderPathNameArray=currentFolderPath.split("/");
            dojo.forEach(currentFolderPathNameArray,function(folderName,idx){
                if(folderName!=""){
                    this.documentsFolderPathArray.push(folderName);
                }
            },this);
            this.documentsFolderPathArray.push(subFolderName);
            var parentFolderPath=currentFolderPath;
            var subFolderName=subFolderName;
            this.renderDocumentsList(parentFolderPath,subFolderName,true);
        },
        refreshCurrentFolder:function(){
            this.renderDocumentsList(this.parentFolderPath,this.currentFolderName,true);
        },
        getParentFolderPath:function(){
            var folderPath="/";
            var folderLength=this.documentsFolderPathArray.length-1;
            dojo.forEach(this.documentsFolderPathArray,function(folderName,idx){
                if(idx<folderLength){
                    folderPath=folderPath+folderName+"/";
                }
            });
            return folderPath;
        },
        addFolder:function(folderName){
            if(folderName.match("/")){
                UI.showToasterMessage({
                    type:"error",
                    message:"文件夹名称中不能包含字符 ' <b>/</b> '"
                });
                return;
            }
            if(this._checkFolderName(folderName)){
                this.addNewFolderMenuDialog.close();
                this.addNewFolderDropDown.clearInput();
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var addParticipantFolderObj={};
                addParticipantFolderObj.activitySpaceName=APPLICATION_ID;
                addParticipantFolderObj.participantName=userId;
                addParticipantFolderObj.parentFolderPath=this.currentFolderPath;
                addParticipantFolderObj.folderName=folderName;
                var that=this;
                var callback=function(){
                    that.refreshCurrentFolder();
                };
                if(this.documentsOwnerType=="PARTICIPANT"){
                    Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,{newFolderInfo:addParticipantFolderObj,folderType:this.documentsOwnerType,callback:callback});
                }
                if(this.documentsOwnerType=="ACTIVITY"){
                    Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,{newFolderInfo:addParticipantFolderObj,folderType:this.documentsOwnerType,
                        taskItemData:this.taskData.taskItemData,callback:callback});
                }
            }else{
                UI.showToasterMessage({
                    type:"error",
                    message:'在当前目录中文件夹名称: "<b>'+folderName+'</b>" 已存在'
                });
            }
        },
        _checkFolderName:function(folderName){
            var checkResult=true;
            dojo.forEach(this.currentDocumentsArray,function(currentDocument){
                if(currentDocument.documentInfo.isFolder&&currentDocument.documentInfo.documentName==folderName){
                    checkResult= false;
                }
            },this);
            return checkResult;
        },
        checkExistingFileName:function(fileName){
            var checkResult=false;
            dojo.forEach(this.currentDocumentsArray,function(currentDocument){
                if((!currentDocument.documentInfo.isFolder)&&currentDocument.documentInfo.documentName==fileName){
                    checkResult= true;
                }
            },this);
            return checkResult;
        },
        getPermissionControlProperties:function(documentPermissions,documentCreator){
            var currentUserApplicationRoles=Application.AttributeContext.getAttribute(USER_PROFILE).userApplicationRoles;
            var currentDocumentPermissions=documentPermissions;

            var currentDisplayContentPermission=true;
            var currentAddContentPermission=true;
            var currentAddSubFolderPermission=true;
            var currentDeleteContentPermission=true;
            var currentDeleteSubFolderPermission=true;
            var currentEditContentPermission=true;
            var currentConfigPermissionPermission=true;

            if(currentDocumentPermissions){
                //set other user permission
                dojo.forEach(currentDocumentPermissions,function(currentPermission){
                    if(currentPermission.permissionScope=="OTHER"){
                        currentDisplayContentPermission=currentPermission.displayContentPermission;
                        currentAddContentPermission=currentPermission.addContentPermission;
                        currentAddSubFolderPermission=currentPermission.addSubFolderPermission;
                        currentDeleteContentPermission=currentPermission.deleteContentPermission;
                        currentDeleteSubFolderPermission=currentPermission.deleteSubFolderPermission;
                        currentEditContentPermission=currentPermission.editContentPermission;
                        currentConfigPermissionPermission=currentPermission.configPermissionPermission;
                    }
                });
                //set owner user permission
                if(documentCreator){
                    var documentOwnerId=documentCreator.userId;
                    var currentUserId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    dojo.forEach(currentDocumentPermissions,function(currentPermission){
                        if(currentPermission.permissionScope=="OWNER"){
                            if(documentOwnerId==currentUserId){
                                currentDisplayContentPermission=currentPermission.displayContentPermission;
                                currentAddContentPermission=currentPermission.addContentPermission;
                                currentAddSubFolderPermission=currentPermission.addSubFolderPermission;
                                currentDeleteContentPermission=currentPermission.deleteContentPermission;
                                currentDeleteSubFolderPermission=currentPermission.deleteSubFolderPermission;
                                currentEditContentPermission=currentPermission.editContentPermission;
                                currentConfigPermissionPermission=currentPermission.configPermissionPermission;
                            }
                        }
                    });
                }
                //set role user permission
                if(currentUserApplicationRoles){
                    var groupCombinedDisplayContentPermission=false;
                    var groupCombinedAddContentPermission=false;
                    var groupCombinedAddSubFolderPermission=false;
                    var groupCombinedDeleteContentPermission=false;
                    var groupCombinedDeleteSubFolderPermission=false;
                    var groupCombinedEditContentPermission=false;
                    var groupCombinedConfigPermissionPermission=false;

                    var hasMatchedRolePermissionConfig=false;
                    dojo.forEach(currentUserApplicationRoles,function(userApplicationRole){
                        var currentApplicationRoleName=userApplicationRole.roleName;
                        dojo.forEach(currentDocumentPermissions,function(currentGroupPermission){
                            if(currentGroupPermission.permissionScope=="GROUP"){
                                if(currentGroupPermission.permissionParticipant==currentApplicationRoleName){
                                    //matched, need set
                                    hasMatchedRolePermissionConfig=true;
                                    groupCombinedDisplayContentPermission=groupCombinedDisplayContentPermission||currentGroupPermission.displayContentPermission;
                                    groupCombinedAddContentPermission=groupCombinedAddContentPermission||currentGroupPermission.addContentPermission;
                                    groupCombinedAddSubFolderPermission=groupCombinedAddSubFolderPermission||currentGroupPermission.addSubFolderPermission;
                                    groupCombinedDeleteContentPermission=groupCombinedDeleteContentPermission||currentGroupPermission.deleteContentPermission;
                                    groupCombinedDeleteSubFolderPermission=groupCombinedDeleteSubFolderPermission||currentGroupPermission.deleteSubFolderPermission;
                                    groupCombinedEditContentPermission=groupCombinedEditContentPermission||currentGroupPermission.editContentPermission;
                                    groupCombinedConfigPermissionPermission=groupCombinedConfigPermissionPermission||currentGroupPermission.configPermissionPermission;
                                }
                            }
                        });
                    });
                    if(hasMatchedRolePermissionConfig){
                        currentDisplayContentPermission=groupCombinedDisplayContentPermission;
                        currentAddContentPermission=groupCombinedAddContentPermission;
                        currentAddSubFolderPermission=groupCombinedAddSubFolderPermission;
                        currentDeleteContentPermission=groupCombinedDeleteContentPermission;
                        currentDeleteSubFolderPermission=groupCombinedDeleteSubFolderPermission;
                        currentEditContentPermission=groupCombinedEditContentPermission;
                        currentConfigPermissionPermission=groupCombinedConfigPermissionPermission;
                    }
                }
            }
            var permissionPropertiesObj={};
            permissionPropertiesObj["displayContentPermission"]=currentDisplayContentPermission;
            permissionPropertiesObj["addContentPermission"]=currentAddContentPermission;
            permissionPropertiesObj["addSubFolderPermission"]=currentAddSubFolderPermission;
            permissionPropertiesObj["deleteContentPermission"]=currentDeleteContentPermission;
            permissionPropertiesObj["deleteSubFolderPermission"]=currentDeleteSubFolderPermission;
            permissionPropertiesObj["editContentPermission"]=currentEditContentPermission;
            permissionPropertiesObj["configPermissionPermission"]=currentConfigPermissionPermission;
            return permissionPropertiesObj;
        },
        destroy:function(){
            this.addNewFolderDropDown.destroy();
            this.addNewDocumentDropDown.destroy();
            this.addNewFolderMenuDialog.destroy();
            dojo.forEach(this.currentDocumentsArray,function(currentDocument){
                currentDocument.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});