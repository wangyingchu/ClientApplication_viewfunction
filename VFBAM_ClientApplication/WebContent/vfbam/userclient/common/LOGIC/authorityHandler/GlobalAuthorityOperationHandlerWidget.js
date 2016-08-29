require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget"
],function(lang,declare,_Widget){
    declare("vfbam.userclient.common.LOGIC.authorityHandler.GlobalAuthorityOperationHandlerWidget", [_Widget], {
        postCreate: function(){
            console.log("GlobalAuthorityOperationHandlerWidget created");
            var userProfile=Application.AttributeContext.getAttribute(USER_PROFILE);
            var currentUserRoleType=userProfile.roleType;
            var roleBaseAdditionalWorkspaceTypesForCurrentUser=APPLICATION_ROLEBASE_ACCESS_MATRIX[currentUserRoleType];
            if(roleBaseAdditionalWorkspaceTypesForCurrentUser){
                dojo.forEach(roleBaseAdditionalWorkspaceTypesForCurrentUser,function(workspaceType){
                    //var dynamicPageId=
                        UI.openDynamicPage(workspaceType.workspaceType, workspaceType.workspaceTitle,  workspaceType.pageUniqueId,workspaceType.dynamicPageTitle,{},true);
                });
            }
            var userBaseAdditionalWorkspaceTypes=userProfile.allowedFeatureCategories;
            if(userBaseAdditionalWorkspaceTypes){
                dojo.forEach(userBaseAdditionalWorkspaceTypes,function(currentWorkspaceType){
                    var currentWorkspaceConfig=APPLICATION_COMMON_FEATURE_CONFIG_MATRIX[currentWorkspaceType];
                    if(currentWorkspaceConfig){
                        var currentWorkspacePagePayload={};
                        if(currentWorkspaceConfig["pagePayloadCallback"]){
                            currentWorkspacePagePayload=currentWorkspaceConfig["pagePayloadCallback"]();
                        }
                        UI.openDynamicPage(currentWorkspaceConfig.workspaceType,
                            currentWorkspaceConfig.workspaceTitle,
                            currentWorkspaceConfig.pageUniqueId,
                            currentWorkspaceConfig.dynamicPageTitle,currentWorkspacePagePayload,true);
                    }
                });
            }
        },
        _endOfCode: function(){}
    });
});