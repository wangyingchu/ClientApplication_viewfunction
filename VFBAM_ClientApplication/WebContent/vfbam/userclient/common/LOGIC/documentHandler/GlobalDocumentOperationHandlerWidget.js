require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget","idx/oneui/Dialog","dojo/io/iframe","idx/oneui/Dialog","dojo/window","dojox/uuid/generateRandomUuid"
],function(lang,declare,_Widget,Dialog,Iframe,Dialog,win,uuidGenerate){
    declare("vfbam.userclient.common.LOGIC.documentHandler.GlobalDocumentOperationHandlerWidget", [_Widget], {
        postCreate: function(){
            console.log("GlobalDocumentOperationHandlerWidget created");
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_DELETEDOCUMENT_EVENT,dojo.hitch(this,this.deleteDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,dojo.hitch(this,this.addFolder));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_DOWNLOADDOCUMENT_EVENT,dojo.hitch(this,this.downloadDocument));
            Application.MessageUtil.listenToMessageTopic(APP_GLOBAL_DOCUMENTOPERATION_PREVIEWDOCUMENT_EVENT,dojo.hitch(this,this.previewDocument));
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
                    resturl=CONTENT_SERVICE_ROOT+"businessActivityFileFile/deleteFile/";
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
            }
            UI.showConfirmDialog({
                message:confirmationLabel,
                confirmButtonLabel:"<i class='icon-trash'></i> 删除",
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
                var location=CONTENT_SERVICE_ROOT+"businessActivityFileFile/downloadFile/";
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
        },
        addFolder:function(data){
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
                addFolderContent=dojo.toJson(newActivityFolderObj);
                resturl=CONTENT_SERVICE_ROOT+"addBusinessActivityFolder/";
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
            var	dialog = new Dialog({
                style:viewerWidthStyle,
                title: "<span style='font-size: 0.7em;'><i class='icon-eye-open'></i> 文件预览: <b>"+data.documentInfo.documentName+"</b></span>",
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
        _endOfCode: function(){}
    });
});