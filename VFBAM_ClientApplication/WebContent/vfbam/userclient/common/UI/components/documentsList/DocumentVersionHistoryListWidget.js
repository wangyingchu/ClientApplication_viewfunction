require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/DocumentVersionHistoryListWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.common.UI.components.documentsList.DocumentVersionHistoryListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        documentVersionItemArray:null,
        postCreate: function(){
            //console.log(this.documentMetaInfo);
            this.documentVersionItemArray=[];
            this.retriveDocumentVersionHistoryInfo(this.documentMetaInfo);
        },
        retriveDocumentVersionHistoryInfo:function(data){
            var resturl="";
            var versionFileInfoContent="";
            var that=this;
            if(data.documentsOwnerType=="PARTICIPANT"){
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var versionFileObj={};
                versionFileObj.activitySpaceName=APPLICATION_ID;
                versionFileObj.participantName=userId;
                versionFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                versionFileObj.fileName=data.documentInfo.documentName;
                versionFileInfoContent=dojo.toJson(versionFileObj);
                resturl=CONTENT_SERVICE_ROOT+"participantPersonalFile/getFileVersionHistory/";
            }
            if(data.documentsOwnerType=="ACTIVITY"){
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var taskItemData=data.taskItemData;
                var versionActivityFolderObj={};
                versionActivityFolderObj.activitySpaceName=APPLICATION_ID;
                versionActivityFolderObj.activityName=taskItemData.activityName;
                versionActivityFolderObj.participantName=userId;
                versionActivityFolderObj.activityId=taskItemData.activityId;
                versionActivityFolderObj.parentFolderPath=data.documentInfo.documentFolderPath;
                versionActivityFolderObj.fileName=data.documentInfo.documentName;
                versionFileInfoContent=dojo.toJson(versionActivityFolderObj);
                resturl=CONTENT_SERVICE_ROOT+"businessActivityFile/getFileVersionHistory/";
            }
            if(data.documentsOwnerType=="APPLICATIONSPACE"){
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var versionFileObj={};
                versionFileObj.activitySpaceName=APPLICATION_ID;
                versionFileObj.participantName=userId;
                versionFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                versionFileObj.fileName=data.documentInfo.documentName;
                versionFileInfoContent=dojo.toJson(versionFileObj);
                resturl=CONTENT_SERVICE_ROOT+"applicationSpaceFile/getFileVersionHistory/";
            }
            if(data.documentsOwnerType=="ROLE"){
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var versionFileObj={};
                versionFileObj.activitySpaceName=APPLICATION_ID;
                versionFileObj.participantName=userId;
                versionFileObj.roleName=data.roleName;
                versionFileObj.parentFolderPath=data.documentInfo.documentFolderPath;
                versionFileObj.fileName=data.documentInfo.documentName;
                versionFileInfoContent=dojo.toJson(versionFileObj);
                resturl=CONTENT_SERVICE_ROOT+"roleFile/getFileVersionHistory/";
            }
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(resultData){
                that.renderDocumentHistoryItems(resultData);
            };
            Application.WebServiceUtil.postJSONData(resturl,versionFileInfoContent,loadCallback,errorCallback);
        },
        renderDocumentHistoryItems:function(itemsData){
            var that=this;
            var isOdd=true;
            dojo.forEach(itemsData,function(itemData){
                var currentDocumentVersionItem=new vfbam.userclient.common.UI.components.documentsList.DocumentVersionInfoItemWidget({documentVersionInfo:itemData,documentMetaInfo:that.documentMetaInfo});
                that.documentVersionItemArray.push(currentDocumentVersionItem);
                if(isOdd){
                    domClass.add(currentDocumentVersionItem.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentDocumentVersionItem.domNode, "app_magazineView_item_even");
                }
                isOdd=!isOdd;
                that.documentVersionItemListContainer.appendChild(currentDocumentVersionItem.domNode);
            })
        },
        destroy:function(){
            dojo.forEach(this.documentVersionItemArray,function(infoItem){
                infoItem.destroy();
            });
            this.documentVersionItemArray.splice(0, this.documentVersionItemArray.length);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});