require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget"
],function(lang,declare,_Widget){
    declare("vfbam.userclient.common.LOGIC.authorityHandler.GlobalAuthorityOperationHandlerWidget", [_Widget], {
        postCreate: function(){
            console.log("GlobalAuthorityOperationHandlerWidget created");
            var userProfile=Application.AttributeContext.getAttribute(USER_PROFILE);
            var currentUserRoleType=userProfile.roleType;
            var addtionalWorkspaceTypesForCurrentUser=APPLICATION_ROLEBASE_ACCESS_MATRIX[currentUserRoleType];
            if(addtionalWorkspaceTypesForCurrentUser){
                dojo.forEach(addtionalWorkspaceTypesForCurrentUser,function(workspaceType){
                    var dynamicPageId=UI.openDynamicPage(workspaceType.workspaceType, workspaceType.workspaceTitle,  workspaceType.pageUniqueId,workspaceType.dynamicPageTitle,{},true);
                    /*
                    if(dynamicPageId){
                        UI.showDynamicPage(dynamicPageId);
                    }
                    */
                });
            }
            //add knowledge page for all kinds of user
            //UI.openDynamicPage("KNOWLEDGE_BASE","知识中心", "KNOWLEDGE_BASE_UID", "<i class='icon-book'></i> 知识中心",{},true);
        },
        _endOfCode: function(){}
    });
});