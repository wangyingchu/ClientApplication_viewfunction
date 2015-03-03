function loadDocuments(){
    if(Application.AttributeContext.getAttribute(USER_APP_INFO_ROLE)){
        renderDocumentManagers();
    }else{
        var resturl=VFBAM_CORE_SERVICE_ROOT+"userManagementService/participantActivitySpaceInfo/"+APPLICATION_ID+"/"+Application.AttributeContext.getAttribute(USER_PROFILE).userId;
        var syncFlag=true;
        var errorCallback= function(data){
            UI.showSystemErrorMessage(data);
        };
        var loadCallback=function(restData){
            Application.AttributeContext.setAttribute(USER_APP_INFO_ROLE,restData.participantRoles);
            renderDocumentManagers();
        };
        Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
    }
}
function renderDocumentManagers(){
    var user_RoleDocumentsContainer=dijit.byId("app_documentCenter_userAndRoleDocumentsContainer");
    var personalDocumentManagerInitObj={};
    personalDocumentManagerInitObj.documentsOwnerType="PARTICIPANT";
    personalDocumentManagerInitObj.participantId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
    personalDocumentManagerInitObj.activitySpaceName=APPLICATION_ID;
    var personalDocumentsList=new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentManagerWidget({documentManagerInitData:personalDocumentManagerInitObj});
    var personalDocumentsContentpanel = new idx.layout.ContentPane({
        title: "<i class='icon-user'></i> 我的文档",
        closable:false,
        content: personalDocumentsList
    });
    personalDocumentsContentpanel.set("onShow", function(){
        personalDocumentsList.loadDocuments();
    });
    user_RoleDocumentsContainer.addChild(personalDocumentsContentpanel);

    var enterpriseDocumentManagerInitObj={};
    enterpriseDocumentManagerInitObj.documentsOwnerType="APPLICATIONSPACE";
    enterpriseDocumentManagerInitObj.activitySpaceName=APPLICATION_ID;
    var enterpriseDocumentsList=new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentManagerWidget({documentManagerInitData:enterpriseDocumentManagerInitObj});
    var enterpriseDocumentsContentpanel = new idx.layout.ContentPane({
        title: "<i class='icon-building'></i> 企业文档",
        closable:false,
        content: enterpriseDocumentsList
    });
    enterpriseDocumentsContentpanel.set("onShow", function(){
        enterpriseDocumentsList.loadDocuments();
    });
    user_RoleDocumentsContainer.addChild(enterpriseDocumentsContentpanel);
    var userRolesInfo=Application.AttributeContext.getAttribute(USER_APP_INFO_ROLE);
    dojo.forEach(userRolesInfo,function(roleInfo){
        var roleDocumentManagerInitObj={};
        roleDocumentManagerInitObj.documentsOwnerType="ROLE";
        roleDocumentManagerInitObj.roleName=roleInfo.roleName;
        roleDocumentManagerInitObj.activitySpaceName=APPLICATION_ID;
        var currentRoleDocumentsList=new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentManagerWidget({documentManagerInitData:roleDocumentManagerInitObj});
        var currentRoleContentpanel = new idx.layout.ContentPane({
            title: "<i class='icon-group'></i> "+roleInfo.displayName,
            closable:false,
            content: currentRoleDocumentsList
        });
        currentRoleContentpanel.set("onShow", function(){
            currentRoleDocumentsList.loadDocuments();
        });
        user_RoleDocumentsContainer.addChild(currentRoleContentpanel);
    },this);
}
var isDocumentCenterFirstLoad=true;
UI.registerStaticPageLifeCycleHandler("DOCUMENT_CENTER","onShow",loadDocumentCenterUI);
function loadDocumentCenterUI(){
    if(isDocumentCenterFirstLoad){
        loadDocuments();
        isDocumentCenterFirstLoad=false;
    }
}
UI.registerStaticPageLifeCycleHandler("DOCUMENT_CENTER","onLoad",initDocumentCenterUI);
function initDocumentCenterUI(){
    var documentCenterPage=UI.getStaticPageInstance("DOCUMENT_CENTER");
    if(documentCenterPage.open){
        isDocumentCenterFirstLoad=false;
        loadDocuments();
    }
}
function showComponentConfigDialog(){
    require(["idx/oneui/Dialog"], function(Dialog){
        /*
         var messageEditor=new vfbam.userclient.components.messageCenter.widget.messageEditor.MessageEditorWidget(messageData.data);
         */
        var confirmButton=new dijit.form.Button({
            label: "<i class='icon-ok-sign'></i> 确定",
            onClick: function(){
            }
        });
        var applyButton=new dijit.form.Button({
            label: "<i class='icon-ok'></i> 应用",
            onClick: function(){
            }
        });
        var actionButtone=[];
        actionButtone.push(confirmButton);
        actionButtone.push(applyButton);
        var	dialog = new Dialog({
            style:"width:600px;",
            title: "<i class='icon-cog'></i> 文档中心参数设置",
            content: "",
            buttons:actionButtone,
            closeButtonLabel: "<i class='icon-remove'></i> 取消"
        });
        //dialog.connect(messageEditor, "doCloseContainerDialog", "hide");
        //dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}