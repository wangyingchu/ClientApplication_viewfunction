require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/userManagement/widget/userList/template/UserListWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.userManagement.widget.userList.UserListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        applicationSpaceUserMetaDataArray:null,
        userInfoItemsArray:null,
        currentSelectedUserInfoItemArray:null,
        postCreate: function(){
            this.userInfoItemsArray=[];
            this.currentSelectedUserInfoItemArray=[];
            console.log("UserListWidget created");
        },
        loadUserList:function(){
            var that=this;
            var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/usersInfo/detailInfo/"+APPLICATION_ID;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(restData){
                if(restData){
                    that.applicationSpaceUserMetaDataArray=restData;
                }
                that.renderUserList();
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        renderUserList:function(userRole){
            this._cleanDirtyItemData();
            var isOdd=true;
            var that=this;
            if(userRole){

            }else{
                dojo.forEach(this.applicationSpaceUserMetaDataArray,function(userData){
                    var currentUserBasicInfoItem=new vfbam.userclient.components.userManagement.widget.userList.UserBasicInfoMagazineViewItemWidget({
                        userDetailInfo:userData,currentSelectedUserInfoItemArray:that.currentSelectedUserInfoItemArray});
                    if(isOdd){
                        domClass.add(currentUserBasicInfoItem.domNode, "app_magazineView_item_odd");
                    }else{
                        domClass.add(currentUserBasicInfoItem.domNode, "app_magazineView_item_even");
                    }
                    isOdd=!isOdd;
                    that.usersListContainer.appendChild(currentUserBasicInfoItem.domNode);
                    that.userInfoItemsArray.push(currentUserBasicInfoItem);
                });
            }
            if(that.userInfoItemsArray.length>0){
                that.userInfoItemsArray[0].selectMessageItem();
            }
        },
        _cleanDirtyItemData:function(){
            dojo.empty(this.usersListContainer);
            dojo.forEach(this.userInfoItemsArray,function(userInfoItem){
                userInfoItem.destroy();
            });
            this.userInfoItemsArray=[];
            this.currentSelectedUserInfoItemArray.splice(0, this.currentSelectedUserInfoItemArray.length);
        },
        _endOfCode: function(){}
    });
});