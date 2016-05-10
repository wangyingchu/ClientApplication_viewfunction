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
        normalUserNumber:null,
        superviserNumber:null,
        postCreate: function(){
            this.userInfoItemsArray=[];
            this.currentSelectedUserInfoItemArray=[];
            console.log("UserListWidget created");
            this.normalUserNumber=0;
            this.superviserNumber=0;
        },
        loadUserList:function(selectedUserId){
            var that=this;
            var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/usersInfo/detailInfo/"+APPLICATION_ID;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(restData){
                if(restData){
                    that.applicationSpaceUserMetaDataArray=restData;
                    that.normalUserNumber=0;
                    that.superviserNumber=0;
                    dojo.forEach(that.applicationSpaceUserMetaDataArray,function(userMetaData){
                        if(userMetaData.roleType=="APPLICATION_SUPERVISER"){
                            that.superviserNumber++;
                        }
                        if(userMetaData.roleType=="APPLICATION_NORMALUSER"){
                            that.normalUserNumber++;
                        }
                    });
                    Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_UPDATEUSERTOTALNUMBER_EVENT,{
                        normalUserNumber:that.normalUserNumber,superviserNumber: that.superviserNumber,allUserNumber:that.applicationSpaceUserMetaDataArray.length});
                    that.applicationSpaceUserMetaDataArray.sort(function(a,b) {
                        var stringCompare=a["displayName"].localeCompare(b["displayName"]);
                        return stringCompare;
                        }
                    );
                }
                that.renderUserList(null,selectedUserId);
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        recountUserNumber:function(){
            var that=this;
            var resturl=PARTICIPANT_SERVICE_ROOT+"participantOperationService/usersInfo/detailInfo/"+APPLICATION_ID;
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(restData){
                if(restData){
                    that.applicationSpaceUserMetaDataArray=restData;
                    that.normalUserNumber=0;
                    that.superviserNumber=0;
                    dojo.forEach(that.applicationSpaceUserMetaDataArray,function(userMetaData){
                        if(userMetaData.roleType=="APPLICATION_SUPERVISER"){
                            that.superviserNumber++;
                        }
                        if(userMetaData.roleType=="APPLICATION_NORMALUSER"){
                            that.normalUserNumber++;
                        }
                    });
                    Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_UPDATEUSERTOTALNUMBER_EVENT,{
                        normalUserNumber:that.normalUserNumber,superviserNumber: that.superviserNumber,allUserNumber:that.applicationSpaceUserMetaDataArray.length});
                    that.applicationSpaceUserMetaDataArray.sort(function(a,b) {
                            var stringCompare=a["displayName"].localeCompare(b["displayName"]);
                            return stringCompare;
                        }
                    );
                }

            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        renderUserList:function(userRole,selectedUserId){
            this._cleanDirtyItemData();
            var isOdd=true;
            var that=this;
            if(userRole){
                dojo.forEach(this.applicationSpaceUserMetaDataArray,function(userData){
                    if(userData.roleType==userRole){
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
                    }
                });
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
            if(selectedUserId){
                that.selectUserInfoItemById(selectedUserId);
            }else{
                if(that.userInfoItemsArray.length>0){
                    that.userInfoItemsArray[0].selectMessageItem();
                }else{
                    Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_USERINFOSELECTED_EVENT,{userDetailInfo:null,selectedUserInfoWidget:null});
                }
            }
        },

        filterUsersByProperty:function(userSearchScope,searchOption,searchValue){
            this._cleanDirtyItemData();
            var isOdd=true;
            var that=this;
            dojo.forEach(this.applicationSpaceUserMetaDataArray,function(userData){
                var matchFilter=false;
                if(userData[searchOption]){
                    var checkSum=userData[searchOption].indexOf(searchValue);
                    if(checkSum!=-1){
                        matchFilter=true;
                    }
                }
                if(matchFilter&&userSearchScope!=APP_USERMANAGEMENT_ALLUSERSEARCH_CONST){
                    if(userData.roleType==userSearchScope){
                        matchFilter=true;
                    }else{
                        matchFilter=false;
                    }
                }
                if(matchFilter){
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
                }
            });
            if(that.userInfoItemsArray.length>0){
                that.userInfoItemsArray[0].selectMessageItem();
            }else{
                Application.MessageUtil.publishMessage(APP_USERMANAGEMENT_USERINFOSELECTED_EVENT,{userDetailInfo:null,selectedUserInfoWidget:null});
            }
        },
        checkDuplicatedUserById:function(userId){
            var isDuplicatedUser=false;
            dojo.forEach(this.applicationSpaceUserMetaDataArray,function(userMetaData){
                if(userMetaData.userId==userId){
                    isDuplicatedUser=true;
                }
            });
            return isDuplicatedUser;
        },
        selectUserInfoItemById:function(userId){
            dojo.forEach(this.userInfoItemsArray,function(userInfoItem){
                if(userInfoItem.userDetailInfo.userId==userId){
                    userInfoItem.selectMessageItem();
                    return;
                }
            });
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