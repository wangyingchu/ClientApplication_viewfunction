require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget","idx/oneui/Dialog","dojo/io/iframe","idx/oneui/Dialog","dojo/window","dojox/uuid/generateRandomUuid"
],function(lang,declare,_Widget,Dialog,Iframe,Dialog,win,uuidGenerate){
    declare("vfbam.userclient.common.LOGIC.documentHandler.GlobalDocumentOperationHandlerWidget", [_Widget], {
        postCreate: function(){
            console.log("GlobalDocumentOperationHandlerWidget created");
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT,dojo.hitch(this,this.deleteDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,dojo.hitch(this,this.addFolder));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT,dojo.hitch(this,this.downloadDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADHISTORYDOCUMENT_EVENT,dojo.hitch(this,this.downloadHistoryDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_UPDATEDOCUMENT_EVENT,dojo.hitch(this,this.updateDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT,dojo.hitch(this,this.previewDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_LOCKDOCUMENT_EVENT,dojo.hitch(this,this.lockDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_UNLOCKDOCUMENT_EVENT,dojo.hitch(this,this.unlockDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_ADDTAG_EVENT,dojo.hitch(this,this.addDocumentTag));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_REMOVETAG_EVENT,dojo.hitch(this,this.removeDocumentTag));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_SHOWDOCUMENTDETAIL_EVENT,dojo.hitch(this,this.showDocumentDetail));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_SHOWKNOWLEDGEBASERECOMMEND_EVENT,dojo.hitch(this,this.showKnowledgeBaseRecommends));
        },
        deleteDocument:function(data){
            var confirmationLabel;
            if(!data.documentInfo.isFolder){
                confirmationLabel= "请确认是否删除文件 '<b>"+data.documentInfo.documentName+"</b>' ?";
            }else{
                confirmationLabel= "请确认是否删除目录 '<b>"+data.documentInfo.documentName+"</b>' ?删除该目录会同时删除其中包含的所有文件和子目录";
            }
            var confirmButtonAction=function(){
                var resturl="";
                var deleteFileInfoContent="";
                if(data.documentsOwnerType=="PARTICIPANT"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"participantPersonalFile/deleteFile/";
                }
                if(data.documentsOwnerType=="ACTIVITY"){
                    var taskItemData=data.taskItemData;
                    var deleteActivityFolderObj={};
                    deleteActivityFolderObj.activitySpaceName=APPLICATION_ID;
                    deleteActivityFolderObj.activityName=taskItemData.activityName;
                    deleteActivityFolderObj.activityId=taskItemData.activityId;
                    deleteActivityFolderObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteActivityFolderObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteActivityFolderObj);
                    resturl=CONTENT_SERVICE_ROOT+"businessActivityFile/deleteFile/";
                }
                if(data.documentsOwnerType=="APPLICATIONSPACE"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"applicationSpaceFile/deleteFile/";
                }
                if(data.documentsOwnerType=="ROLE"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.roleName=data.roleName;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"roleFile/deleteFile/";
                }
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(resultData){
                    if(resultData.operationResult){
                        if(data.documentInfo.callback){
                            data.documentInfo.callback();
                        }
                    }else{
                        UI.showToasterMessage({
                            type:"error",
                            message:resultData.resultReason
                        });
                    }
                };
                Application.WebServiceUtil.postJSONData(resturl,deleteFileInfoContent,loadCallback,errorCallback);
            };
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-trash'></i> 删除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        lockDocument:function(data){
            var confirmationLabel;
            if(!data.documentInfo.isFolder){
                confirmationLabel= "请确认是否锁定文件 '<b>"+data.documentInfo.documentName+"</b>' ?";
            }else{
                confirmationLabel= "请确认是否锁定目录 '<b>"+data.documentInfo.documentName+"</b>' ?锁定目录将禁止在该目录中创建或删除文件和子目录";
            }
            var confirmButtonAction=function(){
                var resturl="";
                var deleteFileInfoContent="";
                if(data.documentsOwnerType=="PARTICIPANT"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"participantPersonalFile/lockFile/";
                }

                if(data.documentsOwnerType=="ACTIVITY"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var taskItemData=data.taskItemData;
                    var deleteActivityFolderObj={};
                    deleteActivityFolderObj.activitySpaceName=APPLICATION_ID;
                    deleteActivityFolderObj.activityName=taskItemData.activityName;
                    deleteActivityFolderObj.activityId=taskItemData.activityId;
                    deleteActivityFolderObj.participantName=userId;
                    deleteActivityFolderObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteActivityFolderObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteActivityFolderObj);
                    resturl=CONTENT_SERVICE_ROOT+"businessActivityFile/lockFile/";
                }

                if(data.documentsOwnerType=="APPLICATIONSPACE"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"applicationSpaceFile/lockFile/";
                }
                if(data.documentsOwnerType=="ROLE"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.roleName=data.roleName;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"roleFile/lockFile/";
                }
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(resultData){
                    if(resultData.operationResult){
                        if(data.documentInfo.callback){
                            data.documentInfo.callback();
                        }
                    }else{
                        UI.showToasterMessage({
                            type:"error",
                            message:resultData.resultReason
                        });
                    }
                };
                Application.WebServiceUtil.postJSONData(resturl,deleteFileInfoContent,loadCallback,errorCallback);
            };
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-lock'></i> 锁定",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        unlockDocument:function(data){
            var confirmationLabel;
            if(!data.documentInfo.isFolder){
                confirmationLabel= "请确认是否解锁文件 '<b>"+data.documentInfo.documentName+"</b>' ?";
            }else{
                confirmationLabel= "请确认是否解锁目录 '<b>"+data.documentInfo.documentName+"</b>' ?解锁目录将允许在该目录中创建或删除文件和子目录";
            }
            var confirmButtonAction=function(){
                var resturl="";
                var deleteFileInfoContent="";
                if(data.documentsOwnerType=="PARTICIPANT"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"participantPersonalFile/unlockFile/";
                }
                if(data.documentsOwnerType=="ACTIVITY"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var taskItemData=data.taskItemData;
                    var deleteActivityFolderObj={};
                    deleteActivityFolderObj.activitySpaceName=APPLICATION_ID;
                    deleteActivityFolderObj.activityName=taskItemData.activityName;
                    deleteActivityFolderObj.participantName=userId;
                    deleteActivityFolderObj.activityId=taskItemData.activityId;
                    deleteActivityFolderObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteActivityFolderObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteActivityFolderObj);
                    resturl=CONTENT_SERVICE_ROOT+"businessActivityFile/unlockFile/";
                }
                if(data.documentsOwnerType=="APPLICATIONSPACE"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"applicationSpaceFile/unlockFile/";
                }
                if(data.documentsOwnerType=="ROLE"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var deleteFileObj={};
                    deleteFileObj.activitySpaceName=APPLICATION_ID;
                    deleteFileObj.participantName=userId;
                    deleteFileObj.roleName=data.roleName;
                    deleteFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                    deleteFileObj.fileName=data.documentInfo.documentName;
                    deleteFileInfoContent=dojo.toJson(deleteFileObj);
                    resturl=CONTENT_SERVICE_ROOT+"roleFile/unlockFile/";
                }
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(resultData){
                    if(resultData.operationResult){
                        if(data.documentInfo.callback){
                            data.documentInfo.callback();
                        }
                    }else{
                        UI.showToasterMessage({
                            type:"error",
                            message:resultData.resultReason
                        });
                    }
                };
                Application.WebServiceUtil.postJSONData(resturl,deleteFileInfoContent,loadCallback,errorCallback);
            };
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-unlock'></i> 解锁",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        downloadDocument:function(data){
            var browserType="";
            if(dojo.isMozilla){browserType="Mozilla";}
            if(dojo.isSpidermonkey){browserType="Spidermonkey";}
            if(dojo.isChrome){browserType="Chrome";}
            if(dojo.isIE){browserType="IE";}
            if(dojo.isSafari){browserType="Safari";}
            if(dojo.isOpera){browserType="Opera";}
            if(dojo.isFF){browserType="FireFox";}

            if(data.documentsOwnerType=="PARTICIPANT"){
                var location=CONTENT_SERVICE_ROOT+"participantPersonalFile/downloadFile/";
                var downloadIframeName = "Iframe_"+new Date().getTime();
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var documentFolderPath=encodeURIComponent(data.documentInfo.documentFolderPath);
                var documentName=encodeURIComponent(data.documentInfo.documentName);
                var participantName=encodeURIComponent(userId);
                var activitySpaceName=encodeURIComponent(APPLICATION_ID);
                var fullLocation=location+"?documentFolderPath="+documentFolderPath+"&documentName="+documentName+"&activitySpaceName="+activitySpaceName+"&participantName="+participantName+"&browserType="+browserType;
                var iframe = Iframe.create(downloadIframeName);
                Iframe.setSrc(iframe, fullLocation, false);
            }
            if(data.documentsOwnerType=="ACTIVITY"){
                var location=CONTENT_SERVICE_ROOT+"businessActivityFile/downloadFile/";
                var taskItemData=data.taskItemData;
                var downloadIframeName = "Iframe_"+new Date().getTime();
                var documentFolderPath=encodeURIComponent(data.documentInfo.documentFolderPath);
                var documentName=encodeURIComponent(data.documentInfo.documentName);
                var activityType=encodeURIComponent(taskItemData.activityName);
                var activityId=encodeURIComponent(taskItemData.activityId);
                var activitySpaceName=encodeURIComponent(APPLICATION_ID);
                var fullLocation=location+"?documentFolderPath="+documentFolderPath+"&documentName="+documentName+"&activitySpaceName="+activitySpaceName+"&activityType="+activityType+
                    "&activityId="+activityId+"&browserType="+browserType;
                var iframe = Iframe.create(downloadIframeName);
                Iframe.setSrc(iframe, fullLocation, false);
            }
            if(data.documentsOwnerType=="APPLICATIONSPACE"){
                var location=CONTENT_SERVICE_ROOT+"applicationSpaceFile/downloadFile/";
                var downloadIframeName = "Iframe_"+new Date().getTime();
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var documentFolderPath=encodeURIComponent(data.documentInfo.documentFolderPath);
                var documentName=encodeURIComponent(data.documentInfo.documentName);
                var participantName=encodeURIComponent(userId);
                var activitySpaceName=encodeURIComponent(APPLICATION_ID);
                var fullLocation=location+"?documentFolderPath="+documentFolderPath+"&documentName="+documentName+"&activitySpaceName="+activitySpaceName+"&participantName="+participantName+"&browserType="+browserType;
                var iframe = Iframe.create(downloadIframeName);
                Iframe.setSrc(iframe, fullLocation, false);
            }
            if(data.documentsOwnerType=="ROLE"){
                var location=CONTENT_SERVICE_ROOT+"roleFile/downloadFile/";
                var downloadIframeName = "Iframe_"+new Date().getTime();
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var documentFolderPath=encodeURIComponent(data.documentInfo.documentFolderPath);
                var documentName=encodeURIComponent(data.documentInfo.documentName);
                var participantName=encodeURIComponent(userId);
                var activitySpaceName=encodeURIComponent(APPLICATION_ID);
                var roleName=encodeURIComponent(data.roleName);
                var fullLocation=location+"?documentFolderPath="+documentFolderPath+"&documentName="+documentName+"&activitySpaceName="+activitySpaceName+
                    "&participantName="+participantName+"&browserType="+browserType+"&roleName="+roleName;
                var iframe = Iframe.create(downloadIframeName);
                Iframe.setSrc(iframe, fullLocation, false);
            }
        },
        downloadHistoryDocument:function(data){
            var browserType="";
            if(dojo.isMozilla){browserType="Mozilla";}
            if(dojo.isSpidermonkey){browserType="Spidermonkey";}
            if(dojo.isChrome){browserType="Chrome";}
            if(dojo.isIE){browserType="IE";}
            if(dojo.isSafari){browserType="Safari";}
            if(dojo.isOpera){browserType="Opera";}
            if(dojo.isFF){browserType="FireFox";}

            if(data.documentsOwnerType=="PARTICIPANT"){
                var location=CONTENT_SERVICE_ROOT+"participantPersonalFile/downloadHistoryFile/"+data.documentVersionNumber+"/";
                var downloadIframeName = "Iframe_"+new Date().getTime();
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var documentFolderPath=encodeURIComponent(data.documentInfo.documentFolderPath);
                var documentName=encodeURIComponent(data.documentInfo.documentName);
                var participantName=encodeURIComponent(userId);
                var activitySpaceName=encodeURIComponent(APPLICATION_ID);
                var fullLocation=location+"?documentFolderPath="+documentFolderPath+"&documentName="+documentName+"&activitySpaceName="+activitySpaceName+"&participantName="+participantName+"&browserType="+browserType;
                var iframe = Iframe.create(downloadIframeName);
                Iframe.setSrc(iframe, fullLocation, false);
            }
            if(data.documentsOwnerType=="ACTIVITY"){
                var location=CONTENT_SERVICE_ROOT+"businessActivityFile/downloadHistoryFile/"+data.documentVersionNumber+"/";
                var taskItemData=data.taskItemData;
                var downloadIframeName = "Iframe_"+new Date().getTime();
                var documentFolderPath=encodeURIComponent(data.documentInfo.documentFolderPath);
                var documentName=encodeURIComponent(data.documentInfo.documentName);
                var activityType=encodeURIComponent(taskItemData.activityName);
                var activityId=encodeURIComponent(taskItemData.activityId);
                var activitySpaceName=encodeURIComponent(APPLICATION_ID);
                var fullLocation=location+"?documentFolderPath="+documentFolderPath+"&documentName="+documentName+"&activitySpaceName="+activitySpaceName+"&activityType="+activityType+
                    "&activityId="+activityId+"&browserType="+browserType;
                var iframe = Iframe.create(downloadIframeName);
                Iframe.setSrc(iframe, fullLocation, false);
            }
            if(data.documentsOwnerType=="APPLICATIONSPACE"){
                var location=CONTENT_SERVICE_ROOT+"applicationSpaceFile/downloadHistoryFile/"+data.documentVersionNumber+"/";
                var downloadIframeName = "Iframe_"+new Date().getTime();
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var documentFolderPath=encodeURIComponent(data.documentInfo.documentFolderPath);
                var documentName=encodeURIComponent(data.documentInfo.documentName);
                var participantName=encodeURIComponent(userId);
                var activitySpaceName=encodeURIComponent(APPLICATION_ID);
                var fullLocation=location+"?documentFolderPath="+documentFolderPath+"&documentName="+documentName+"&activitySpaceName="+activitySpaceName+"&participantName="+participantName+"&browserType="+browserType;
                var iframe = Iframe.create(downloadIframeName);
                Iframe.setSrc(iframe, fullLocation, false);
            }
            if(data.documentsOwnerType=="ROLE"){
                var location=CONTENT_SERVICE_ROOT+"roleFile/downloadHistoryFile/"+data.documentVersionNumber+"/";
                var downloadIframeName = "Iframe_"+new Date().getTime();
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var documentFolderPath=encodeURIComponent(data.documentInfo.documentFolderPath);
                var documentName=encodeURIComponent(data.documentInfo.documentName);
                var participantName=encodeURIComponent(userId);
                var activitySpaceName=encodeURIComponent(APPLICATION_ID);
                var roleName=encodeURIComponent(data.documentInfo.roleName);
                var fullLocation=location+"?documentFolderPath="+documentFolderPath+"&documentName="+documentName+"&activitySpaceName="+activitySpaceName+
                    "&participantName="+participantName+"&browserType="+browserType+"&roleName="+roleName;
                var iframe = Iframe.create(downloadIframeName);
                Iframe.setSrc(iframe, fullLocation, false);
            }
        },
        updateDocument:function(data){
            var updateDocumentWidget=new vfbam.userclient.common.UI.components.documentsList.UpdateDocumentWidget({documentMetaInfo:data});
            var	dialog = new vfbam.userclient.common.UI.widgets.NonActionBarDialog({
                style:"width:350px;height:160px;",
                title: "<i class='icon-edit'></i>&nbsp;&nbsp;更新文件",
                content: ""
            });
            dialog.connect(updateDocumentWidget, "doCloseContainerDialog", "hide");
            dojo.place(updateDocumentWidget.containerNode, dialog.containerNode);
            dialog.show();
        },
        addFolder:function(data){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var folderType=data.folderType;
            var addFolderContent="";
            var resturl="";
            if(folderType=="PARTICIPANT"){
                var newFolderInfo=data.newFolderInfo;
                addFolderContent=dojo.toJson(newFolderInfo);
                resturl=CONTENT_SERVICE_ROOT+"addParticipantPersonalFolder/";
            }
            if(folderType=="ACTIVITY"){
                var newFolderInfo=data.newFolderInfo;
                var taskItemData=data.taskItemData;
                var newActivityFolderObj={};
                newActivityFolderObj.activitySpaceName=APPLICATION_ID;
                newActivityFolderObj.activityName=taskItemData.activityName;
                newActivityFolderObj.activityId=taskItemData.activityId;
                newActivityFolderObj.parentFolderPath=newFolderInfo.parentFolderPath;
                newActivityFolderObj.folderName=newFolderInfo.folderName;
                newActivityFolderObj.folderCreator=userId;
                addFolderContent=dojo.toJson(newActivityFolderObj);
                resturl=CONTENT_SERVICE_ROOT+"addBusinessActivityFolder/";
            }
            if(folderType=="APPLICATIONSPACE"){
                var newFolderInfo=data.newFolderInfo;
                addFolderContent=dojo.toJson(newFolderInfo);
                resturl=CONTENT_SERVICE_ROOT+"addApplicationSpaceFolder/";
            }
            if(folderType=="ROLE"){
                var newFolderInfo=data.newFolderInfo;
                addFolderContent=dojo.toJson(newFolderInfo);
                resturl=CONTENT_SERVICE_ROOT+"addRoleFolder/";
            }
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(resultData){
                if(resultData.operationResult){
                    if(data.callback){
                        data.callback();
                    }
                }else{
                    UI.showToasterMessage({
                        type:"error",
                        message:resultData.resultReason
                    });
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,addFolderContent,loadCallback,errorCallback);
        },
        previewDocument:function(data){
            var documentViewerWidth=win.getBox().w-10;
            if(win.getBox().w>200){
                documentViewerWidth=win.getBox().w-200;
            }
            var tempDocumentName = dojox.uuid.generateRandomUuid();
            var viewerWidthStyle="width:"+documentViewerWidth+"px;";
            var generalDocumentViewerWidget=new vfbam.userclient.common.UI.components.documentsList.GeneralDocumentViewerWidget({documentMetaInfo:data,tempDocumentName:tempDocumentName});
            var title="<span style='font-size: 0.7em;'><i class='icon-eye-open'></i> 文件预览: <b>"+data.documentInfo.documentName+"</b></span>";
            if(data.documentVersionNumber){
                title="<span style='font-size: 0.7em;'><i class='icon-eye-open'></i> 文件预览: <b>"+"V"+data.documentVersionNumber+"_"+data.documentInfo.documentName+"</b></span>";
            }
            var	dialog = new Dialog({
                style:viewerWidthStyle,
                title: title,
                content:generalDocumentViewerWidget,
                class:'nonModal',// for noe modal window
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var serverSideTemFileName=generalDocumentViewerWidget.getServerTempDocumentName();
            var deletePreviewFileCallBack=function(){
                var resturl=CONTENT_SERVICE_ROOT+"deletePerviewFile/"+serverSideTemFileName+"/";
                var errorCallback= function(data){};
                var loadCallback=function(data){};
                Application.WebServiceUtil.deleteJSONData(resturl,null,loadCallback,errorCallback);
            };
            dojo.connect(dialog,"hide",deletePreviewFileCallBack);
            dialog.show();
        },
        addDocumentTag:function(data){
            var fileTagOperationObj = {};
            fileTagOperationObj.documentsOwnerType = data.documentMetaInfo.documentsOwnerType;
            fileTagOperationObj.activitySpaceName = APPLICATION_ID;
            fileTagOperationObj.tagValue = data.tag;
            if (data.documentMetaInfo.documentsOwnerType == "PARTICIPANT") {
                fileTagOperationObj.participantFileInfo = data.documentMetaInfo.participantFileInfo;
            }
            if (data.documentMetaInfo.documentsOwnerType == "ACTIVITY") {
                fileTagOperationObj.activityTypeFileInfo = data.documentMetaInfo.activityTypeFileInfo;
            }
            if (data.documentMetaInfo.documentsOwnerType == "APPLICATIONSPACE") {
                fileTagOperationObj.applicationSpaceFileInfo = data.documentMetaInfo.applicationSpaceFileInfo;
            }
            if (data.documentMetaInfo.documentsOwnerType == "ROLE") {
                fileTagOperationObj.roleFileInfo = data.documentMetaInfo.roleFileInfo;
            }
            var errorCallback = function (data) {
                UI.showSystemErrorMessage(data);
            };
            var loadCallback = function (resultData) {
                if(data.callback){
                    data.callback(resultData);
                }
            };
            var fileTagOperationObjContent = dojo.toJson(fileTagOperationObj);
            var resturl = CONTENT_SERVICE_ROOT + "addFileTag/";
            Application.WebServiceUtil.postJSONData(resturl, fileTagOperationObjContent, loadCallback, errorCallback);
        },
        removeDocumentTag:function(data){
            var confirmationLabel= "请确认是否删除文件标签 '<b>"+data.tag+"</b>' ?";
            var confirmButtonAction=function() {
                var fileTagOperationObj = {};
                fileTagOperationObj.documentsOwnerType = data.documentMetaInfo.documentsOwnerType;
                fileTagOperationObj.activitySpaceName = APPLICATION_ID;
                fileTagOperationObj.tagValue = data.tag;
                if (data.documentMetaInfo.documentsOwnerType == "PARTICIPANT") {
                    fileTagOperationObj.participantFileInfo = data.documentMetaInfo.participantFileInfo;
                }
                if (data.documentMetaInfo.documentsOwnerType == "ACTIVITY") {
                    fileTagOperationObj.activityTypeFileInfo = data.documentMetaInfo.activityTypeFileInfo;
                }
                if (data.documentMetaInfo.documentsOwnerType == "APPLICATIONSPACE") {
                    fileTagOperationObj.applicationSpaceFileInfo = data.documentMetaInfo.applicationSpaceFileInfo;
                }
                if (data.documentMetaInfo.documentsOwnerType == "ROLE") {
                    fileTagOperationObj.roleFileInfo = data.documentMetaInfo.roleFileInfo;
                }
                var errorCallback = function (data) {
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback = function (resultData) {
                    if(data.callback){
                        data.callback(resultData);
                    }
                };
                var fileTagOperationObjContent = dojo.toJson(fileTagOperationObj);
                var resturl = CONTENT_SERVICE_ROOT + "removeFileTag/";
                Application.WebServiceUtil.deleteJSONData(resturl, fileTagOperationObjContent, loadCallback, errorCallback);
            };
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-trash'></i> 删除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction
            });
        },
        showDocumentDetail:function(data){
            var updateDocumentWidget=new vfbam.userclient.common.UI.components.documentsList.DocumentDetailInfoWidget({documentMetaInfo:data});
            var	dialog = new Dialog({
                style:"width:420px;height:355px;",
                title: "<i class='icon-info'></i>&nbsp;&nbsp;文件详细信息",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var closeDialogCallBack=function(){
                updateDocumentWidget.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dojo.place(updateDocumentWidget.containerNode, dialog.containerNode);
            dialog.show();
        },
        showKnowledgeBaseRecommends:function(data){
            var documentViewerWidth=win.getBox().w-10;
            if(win.getBox().w>200){
                documentViewerWidth=win.getBox().w-200;
            }
            var documentViewerHeight=win.getBox().h;
            var viewerSizeStyle="width:"+documentViewerWidth+"px;height:"+documentViewerHeight+"px;";
            var recommendDocumentsWidget=new vfbam.userclient.common.UI.components.documentsList.KnowledgeBaseRecommendsWidget({documentMetaInfo:data});
            var	dialog = new Dialog({
                style:viewerSizeStyle,
                title: "<i class='fa fa-clone'></i>&nbsp;&nbsp;知识库相关信息推荐",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            var closeDialogCallBack=function(){
                recommendDocumentsWidget.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
            dojo.place(recommendDocumentsWidget.containerNode, dialog.containerNode);
            dialog.show();
        },
        _endOfCode: function(){}
    });
});