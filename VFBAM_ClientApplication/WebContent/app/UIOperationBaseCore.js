/***********************  COPYRIGHT START  *****************************************
 // @copyright(external)
 //
 // Licensed Materials - Property of Viewfunction
 // Viewfunction Business Activity Manager
 // (C) Copyright Viewfunction Inc. 2013.
 //
 // Viewfunction grants you ("Licensee") a non-exclusive, royalty free, license to
 // use, copy and redistribute the Non-Sample Header file software in source and
 // binary code form, provided that i) this copyright notice, license and disclaimer
 // appear on all copies of the software; and ii) Licensee does not utilize the
 // software in a manner which is disparaging to Viewfunction.
 //
 // This software is provided "AS IS."  Viewfunction and its Suppliers and Licensors
 // expressly disclaim all warranties, whether  EXPRESS OR IMPLIED, INCLUDING ANY
 // IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR WARRANTY
 // OF NON-INFRINGEMENT.  Viewfunction AND ITS SUPPLIERS AND  LICENSORS SHALL NOT BE
 // LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE THAT RESULT FROM USE OR DISTRIBUTION
 // OF THE SOFTWARE OR THE COMBINATION OF THE SOFTWARE WITH ANY OTHER CODE.IN NO EVENT
 // WILL Viewfunction OR ITS SUPPLIERS AND LICENSORS BE LIABLE FOR ANY LOST REVENUE,
 // PROFIT OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR
 // PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING
 // OUT OF THE USE OF OR INABILITY TO USE SOFTWARE, EVEN IF Viewfunction HAS BEEN
 // ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 //
 // @endCopyright
 //***********************  COPYRIGHT END  *********************************************/

var UI=(function(){
    //private members:

    var implementationTech="idx";
    var loadingDlg;
    var dynamicPageDataMap={};
    var dynamicPageUniqueIdMap={};
    //public members:
    return {
        getImplementationTech:function(){
            return implementationTech;
        },
        showToasterMessage:function(messageObject,actionResultObject){
            var messageToaster=dijit.byId("app_messageToaster_container");
            dojo.style(messageToaster.toasterNode,"zIndex",1000);
            // toaster type ["success", "error", "warning", "info"];
            if(actionResultObject){
                if(actionResultObject.result){
                    messageToaster.add(
                        {
                            type:"success",
                            content: messageObject.success,
                            timestamp: dojo.date.locale.format(new Date(), {selector: "time", formatLength: "short"})
                        }
                    );
                }else{
                    messageToaster.add(
                        {
                            type:"error",
                            content: messageObject.error+":"+actionResultObject.resultMessage,
                            timestamp: dojo.date.locale.format(new Date(), {selector: "time", formatLength: "short"})
                        }
                    );
                }
            }else{
                messageToaster.add(
                    {
                        type:messageObject.type,
                        content: messageObject.message,
                        timestamp: dojo.date.locale.format(new Date(), {selector: "time", formatLength: "short"})
                    }
                );
            }
        },
        showSystemErrorMessage:function(data){
            var errorMessage=data;
            if(!data){
                errorMessage="未获得服务器端返回数据。";
                idx.error({summary: "系统通讯错误", detail: "操作中发生客户端与服务器网站间的通讯错误，该错误可能由通讯网络故障或服务器内部故障引起。请联系系统管理员解决故障。<br/>系统管理员联系方式：XXXXXXXXXX",moreContent: "错误信息："+errorMessage});
            }else{
                idx.error({summary: "系统通讯错误", detail: "操作中发生客户端程序错误，该错误可能由客户端内部故障或数据处理错误引起。请联系系统管理员解决故障。<br/>系统管理员联系方式：XXXXXXXXXX",moreContent: "错误信息："+errorMessage});
            }
        },
        showConfirmDialog:function(dialogDataObject){
            idx.dialogs.confirm(dialogDataObject.message,
                dialogDataObject.confirmButtonAction, dialogDataObject.cancelButtonAction,
                dialogDataObject.confirmButtonLabel, dialogDataObject.cancelButtonLabel);
        },
        showWarningDialog:function(dialogDataObject){
            idx.dialogs.warn(dialogDataObject.message,dialogDataObject.oKButtonAction, dialogDataObject.oKButtonLabel);
        },
        showInfoDialog:function(dialogDataObject){
            idx.dialogs.info(dialogDataObject.message,dialogDataObject.oKButtonAction, dialogDataObject.oKButtonLabel);
        },
        showErrorDialog:function(dialogDataObject){
            idx.dialogs.error(dialogDataObject.message,dialogDataObject.oKButtonAction, dialogDataObject.oKButtonLabel);
        },
        showSystemInfoDialog:function(dialogDataObject){
            require(["idx/oneui/Dialog"], function(Dialog){
                var	dialog = new Dialog({
                    style:"width:450px;height:160px;z-index: 2000;",
                    draggable:false,
                    title: dialogDataObject.title,
                    content: dialogDataObject.message,
                    closeButtonLabel: dialogDataObject.applyInfoButtonLabel
                });
                var closeDialogCallBack=function(){
                    dialogDataObject.applyInfoButtonAction();
                };
                dojo.connect(dialog,"hide",closeDialogCallBack);
                dialog.show();
                dojo.style(dialog.domNode,"zIndex",1000);
            });
        },
        showProgressDialog:function(progressingText){
            loadingDlg = new dijit.Dialog({
                title: "处理中",
                style: "width: 300px"
            });
            loadingDlg.set("content", "<div class='idxSignIcon dijitContentPaneLoading' style='width: 100%; height: 100%;'>"+progressingText+"....<br/><br/></div>");
            loadingDlg.show();
        },
        hideProgressDialog:function(){
            if(loadingDlg){
                loadingDlg.hide();
            }
        },
        openDynamicPage:function(dynamicPageType,dynamicPageLabel,dynamicPageUniqueId,pageTitle,pagePayload,staticPageStyle){
            if(dynamicPageUniqueId) {
                if(!dynamicPageUniqueIdMap[dynamicPageType]){
                    dynamicPageUniqueIdMap[dynamicPageType]={};
                }else{
                    if(dynamicPageUniqueIdMap[dynamicPageType][dynamicPageUniqueId]){
                        return dynamicPageUniqueIdMap[dynamicPageType][dynamicPageUniqueId];
                    }
                }
            }
            var applicationLauncher=dijit.byId("app_TabMenuLauncher");
            var maxDynamicPageSize=applicationLauncher.getMaxOpenWorkspaceCount(dynamicPageType);
            var alreadyOpenedDynamicPage= applicationLauncher.getOpenWorkspaceCount(dynamicPageType);
            if(alreadyOpenedDynamicPage>=maxDynamicPageSize){
                var warngMessage= "“"+dynamicPageLabel+"”页面最多只能同时打开"+ maxDynamicPageSize+"个。";
                this.showWarningDialog({message:warngMessage,oKButtonAction:null,oKButtonLabel:"确定"});
                return null;
            }else{
                var currentWorkspace=applicationLauncher.openWorkspace(dynamicPageType);
                if(pagePayload){
                    this.setDynamicPageData(currentWorkspace.workspaceID,pagePayload);
                }
                var currentWorkspaceUIID=currentWorkspace.id.replace("idx_app_Workspace_", "");
                var workSpaceTabId="idx_app_WorkspaceTab_"+currentWorkspaceUIID+"_titleNode";
                if(staticPageStyle){
                    dojo.byId(workSpaceTabId).innerHTML="<span>"+pageTitle+"</span>";
                }else{
                    dojo.byId(workSpaceTabId).innerHTML="<span class='appDynamicPageTabText'>"+pageTitle+"</span>";
                }
                /*
                var workspaceTabContainerId="idx_app_WorkspaceTab_"+ currentWorkspaceUIID;
                require(["dojo/dom-class"],
                    function(domClass){
                        domClass.remove(dojo.byId(workspaceTabContainerId), "idxWorkspaceTab");
                        domClass.add(dojo.byId(workspaceTabContainerId), "appDynamicPageTab");
                });
                */
                if(dynamicPageUniqueId) {
                    dynamicPageUniqueIdMap[dynamicPageType][dynamicPageUniqueId]=currentWorkspace.workspaceID;
                }
                return currentWorkspace.workspaceID;
            }
        },
        closeDynamicPage:function(pageId){
            var applicationLauncher=dijit.byId("app_TabMenuLauncher");
            var workspaceType=applicationLauncher.getWorkspace(pageId).workspaceTypeID;
            applicationLauncher.closeWorkspace(pageId);
            this.cleanDynamicPageData(pageId,workspaceType);
        },
        showStaticPage:function(pageType){
            var applicationLauncher=dijit.byId("app_TabMenuLauncher");
            applicationLauncher.selectWorkspace(applicationLauncher.getWorkspaces(pageType)[0]);
        },
        showDynamicPage:function(pageId){
            var applicationLauncher=dijit.byId("app_TabMenuLauncher");
            var workspace=applicationLauncher.getWorkspace(pageId);
            applicationLauncher.selectWorkspace(workspace);
        },
        setDynamicPageData:function(pageId,pagePayload){
            dynamicPageDataMap[pageId]=pagePayload;
        },
        getDynamicPageData:function(pageId){
             return dynamicPageDataMap[pageId];
        },
        registerStaticPageLifeCycleHandler:function(pageType,lifeCycleMethod,handlerFunction){
            //onBlur onClick onClose onContentError onDblClick onDownloadEnd onDownloadError onUnload
            //onDownloadStart onExecError onFocus onHide onKeyDown onKeyPress onKeyUp onShow
            //onLoad onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp
            var applicationLauncher=dijit.byId("app_TabMenuLauncher");
            var targetWorkspace=applicationLauncher.getWorkspaces(pageType)[0];
            dojo.connect(targetWorkspace,lifeCycleMethod,handlerFunction);
        },
        getStaticPageInstance:function(pageType){
            var applicationLauncher=dijit.byId("app_TabMenuLauncher");
            var targetWorkspace=applicationLauncher.getWorkspaces(pageType)[0];
            return targetWorkspace;
        },
        cleanDynamicPageData:function(pageId,workspaceType){
            delete dynamicPageDataMap[pageId];
            var uniqueMapData= dynamicPageUniqueIdMap[workspaceType];
            for(var pageIdProp in uniqueMapData){
                if(typeof(uniqueMapData[pageIdProp])=="function"){
                }else{
                    if(uniqueMapData[pageIdProp]==pageId){
                        delete dynamicPageUniqueIdMap[workspaceType][pageIdProp];
                    }
                }
            }
        }
    };
})();