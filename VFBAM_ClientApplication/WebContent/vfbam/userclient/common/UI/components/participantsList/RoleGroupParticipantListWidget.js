require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantsList/template/RoleGroupParticipantListWidget.html","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.common.UI.components.participantsList.RoleGroupParticipantListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentRoleParticipantsArray:null,
        toolbarHeight:null,
        globalParticipantsSearchMenuDialog:null,
        globalParticipantsSearchWidget:null,
        postCreate: function(){
            this.currentRoleParticipantsArray=[];
            this.toolbarHeight=32;
            this.getParticipantsList();
            if(this.containerElementId){
                var contentBox = domGeom.getContentBox(dojo.byId(this.containerElementId));
                var realHeight=contentBox.h;
                realHeight=realHeight-this.toolbarHeight;
                if(this.reservationHeight!=0){
                    realHeight=realHeight-this.reservationHeight;
                }
                var currentHeightStyle=""+realHeight +"px";
                dojo.style(this.participantsListContainer,"height",currentHeightStyle);
            }
            this.globalParticipantsSearchMenuDialog=new idx.widget.MenuDialog({});
            this.globalParticipantsSearchWidget=new vfbam.userclient.common.UI.components.participantsList.GlobalParticipantsSearchWidget({
                popupDialog:this.globalParticipantsSearchMenuDialog});
            dojo.place(this.globalParticipantsSearchWidget.domNode, this.globalParticipantsSearchMenuDialog.containerNode);
            this.participantSearchLabel.set("label"," 查找同事");
            this.participantSearchLabel.set("dropDown",this.globalParticipantsSearchMenuDialog);
            this.loadCustomFaviorParticipantsList();
        },
        getParticipantsList:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=USERMANAGEMENTSERVICE_ROOT+"roleColleaguesOfUser/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                dojo.forEach(data,function(roleParticipantsInfo){
                    //var roleName=roleParticipantsInfo.roleName;
                    var roleDisplayName=roleParticipantsInfo.roleDisplayName;
                    var roleParticipantsList=roleParticipantsInfo.roleParticipants.participantDetailInfoVOsList;
                    var currentRoleParticipantsContainer=new vfbam.userclient.common.UI.widgets.NestedContentContainer({title:roleDisplayName});
                    that.participantsListContainer.appendChild(currentRoleParticipantsContainer.domNode);
                    that.currentRoleParticipantsArray.push(currentRoleParticipantsContainer);
                    var participantsListArray=[];
                    dojo.forEach(roleParticipantsList,function(participantInfo){
                        if(participantInfo){
                            var currentParticipant={};
                            currentParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+ participantInfo.userId;
                            currentParticipant.participantName=participantInfo.displayName;
                            currentParticipant.participantId=participantInfo.userId;
                            currentParticipant.participantTitle=participantInfo.title;
                            currentParticipant.participantDesc=participantInfo.description;
                            currentParticipant.participantAddress=participantInfo.address;
                            currentParticipant.participantPhone=participantInfo.fixedPhone;
                            currentParticipant.participantEmail=participantInfo.emailAddress;
                            participantsListArray.push(currentParticipant);
                        }
                    },this);
                    for(i=0;i<participantsListArray.length;i++){
                        var currentParticipant= participantsListArray[i];
                        var currentParticipantInfoWidget=new vfbam.userclient.common.UI.components.participantsList.ParticipantInfoWidget({participantInfo:currentParticipant});
                        currentRoleParticipantsContainer.addChildItem(currentParticipantInfoWidget);
                    }
                });
                if(that.containerInitFinishCounterFuc){
                    that.containerInitFinishCounterFuc();
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },

        loadCustomFaviorParticipantsList:function(){
            /*
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            //userId="Management Department";

             var newCustomeAttributeObj={};
            newCustomeAttributeObj.attributeName="TESTAttribute1";
            newCustomeAttributeObj.attributeType="STRING";
            newCustomeAttributeObj.arrayAttribute=false;
            newCustomeAttributeObj.attributeRowValue=["value1_150204Modified"];

            newCustomeAttributeObj.attributeName="TESTAttribute2";
            newCustomeAttributeObj.attributeType="STRING";
            newCustomeAttributeObj.arrayAttribute=true;
            newCustomeAttributeObj.attributeRowValue=["value1_150204Modified","value2_150204Modified","NewValueAAAAAmodifiedAgain"];

            newCustomeAttributeObj.attributeName="TESTAttribute3";
            newCustomeAttributeObj.attributeType="LONG";
            newCustomeAttributeObj.arrayAttribute=false;
            newCustomeAttributeObj.attributeRowValue=["100203456"];

            newCustomeAttributeObj.attributeName="TESTAttribute4";
            newCustomeAttributeObj.attributeType="LONG";
            newCustomeAttributeObj.arrayAttribute=true;
            newCustomeAttributeObj.attributeRowValue=["100203000","898131000"];

            newCustomeAttributeObj.attributeName="TESTAttribute5";
            newCustomeAttributeObj.attributeType="DOUBLE";
            newCustomeAttributeObj.arrayAttribute=false;
            newCustomeAttributeObj.attributeRowValue=["8345.021"];

            newCustomeAttributeObj.attributeName="TESTAttribute6";
            newCustomeAttributeObj.attributeType="DOUBLE";
            newCustomeAttributeObj.arrayAttribute=true;
            newCustomeAttributeObj.attributeRowValue=["2000.888","100.99"];

            newCustomeAttributeObj.attributeName="TESTAttribute7";
            newCustomeAttributeObj.attributeType="DATE";
            newCustomeAttributeObj.arrayAttribute=false;
            newCustomeAttributeObj.attributeRowValue=[""+new Date().getTime()];

            newCustomeAttributeObj.attributeName="TESTAttribute8";
            newCustomeAttributeObj.attributeType="DATE";
            newCustomeAttributeObj.arrayAttribute=true;
            newCustomeAttributeObj.attributeRowValue=[""+new Date().getTime(),""+new Date().getTime(),""+new Date().getTime(),""+new Date().getTime()];

            newCustomeAttributeObj.attributeName="TESTAttribute9";
            newCustomeAttributeObj.attributeType="DECIMAL";
            newCustomeAttributeObj.arrayAttribute=false;
            newCustomeAttributeObj.attributeRowValue=["123006.550002"];

            newCustomeAttributeObj.attributeName="TESTAttribute10";
            newCustomeAttributeObj.attributeType="DECIMAL";
            newCustomeAttributeObj.arrayAttribute=true;
            newCustomeAttributeObj.attributeRowValue=["120006.550012","420006.5500042","32700066.3300012","3448000.000022"];

            newCustomeAttributeObj.attributeName="TESTAttribute11";
            newCustomeAttributeObj.attributeType="BOOLEAN";
            newCustomeAttributeObj.arrayAttribute=false;
            newCustomeAttributeObj.attributeRowValue=["false"];

            newCustomeAttributeObj.attributeName="TESTAttribute12";
            newCustomeAttributeObj.attributeType="BOOLEAN";
            newCustomeAttributeObj.arrayAttribute=false;
            newCustomeAttributeObj.attributeRowValue=["true"];

            newCustomeAttributeObj.attributeName="TESTAttribute13";
            newCustomeAttributeObj.attributeType="BOOLEAN";
            newCustomeAttributeObj.arrayAttribute=true;
            newCustomeAttributeObj.attributeRowValue=["true","true","false"];

            var resturl0=USERMANAGEMENTSERVICE_ROOT+"addRoleCustomAttribute/"+APPLICATION_ID+"/"+userId+"/";
            var newCustomeAttributeObjContent=dojo.toJson(newCustomeAttributeObj);
            var errorCallback0= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback0=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.postJSONData(resturl0,newCustomeAttributeObjContent,loadCallback0,errorCallback0);
            */

            /*
            var resturl=USERMANAGEMENTSERVICE_ROOT+"getRoleCustomAttribute/"+APPLICATION_ID+"/"+userId+"/TESTAttribute11/";
            //var resturl=USERMANAGEMENTSERVICE_ROOT+"getRoleCustomAttributes/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
            */
            /*
            var resturl=USERMANAGEMENTSERVICE_ROOT+"deleteRoleCustomAttribute/"+APPLICATION_ID+"/"+userId+"/TESTAttribute3/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            var fileTagOperationObj = {};
            var fileTagOperationObjContent=dojo.toJson(fileTagOperationObj);
            Application.WebServiceUtil.deleteJSONData(resturl, fileTagOperationObjContent, loadCallback, errorCallback);
            */

            /*
            var newCustomeStructureObj={};
            newCustomeStructureObj.structureName="TEST_Structure_B";
             var resturl0=USERMANAGEMENTSERVICE_ROOT+"addParticipantCustomStructure/"+APPLICATION_ID+"/"+userId+"/";
             var newCustomeStructureObjContent=dojo.toJson(newCustomeStructureObj);
             var errorCallback0= function(data){
             UI.showSystemErrorMessage(data);
             };
             var loadCallback0=function(data){
             console.log(data);
             };
             Application.WebServiceUtil.postJSONData(resturl0,newCustomeStructureObjContent,loadCallback0,errorCallback0);
             */

            /*
            var existingCustomeStructureObj={};
            existingCustomeStructureObj.structureId ="/ACTIVITYSPACE_DEFINATION_ROOT/viewfunction_inc/ACTIVITYSPACE_Participant/ManagerA/CustomStructureStore/TEST_Structure_B/CustomStructureStore/newSubStructure001";
            var resturl0=USERMANAGEMENTSERVICE_ROOT+"customStructure/addSubCustomStructure/"+APPLICATION_ID+"/newSubSubStructure002/";
            var existingCustomeStructureObjContent=dojo.toJson(existingCustomeStructureObj);
            var errorCallback0= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback0=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.postJSONData(resturl0,existingCustomeStructureObjContent,loadCallback0,errorCallback0);

            */
            /*
            var newCustomeStructureObj={};
            newCustomeStructureObj.structureName="Role_Structure_1";
            var resturl0=USERMANAGEMENTSERVICE_ROOT+"addRoleCustomStructure/"+APPLICATION_ID+"/Management Department/";
            var newCustomeStructureObjContent=dojo.toJson(newCustomeStructureObj);
            var errorCallback0= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback0=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.postJSONData(resturl0,newCustomeStructureObjContent,loadCallback0,errorCallback0);

            var resturl=USERMANAGEMENTSERVICE_ROOT+"getRoleCustomStructures/"+APPLICATION_ID+"/Management Department/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);

            */
            /*
            var resturl=USERMANAGEMENTSERVICE_ROOT+"getParticipantCustomStructures/"+APPLICATION_ID+"/"+userId+"";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
            */
            /*
            var resturl=USERMANAGEMENTSERVICE_ROOT+"getParticipantCustomStructure/"+APPLICATION_ID+"/"+userId+"/TEST_Structure_B/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);

            var resturl=USERMANAGEMENTSERVICE_ROOT+"getRoleCustomStructure/"+APPLICATION_ID+"/Management Department/Role_Structure_1/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
            */
            /*
            var resturl=USERMANAGEMENTSERVICE_ROOT+"deleteParticipantCustomStructure/"+APPLICATION_ID+"/"+userId+"/";

            var deleteCustomeStructureObj={};
           // deleteCustomeStructureObj.structureName="Role_Structure_1";
            deleteCustomeStructureObj.structureName="TEST_Structure_A";

            var deleteCustomeStructureObjContent=dojo.toJson(deleteCustomeStructureObj);

            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.deleteJSONData(resturl, deleteCustomeStructureObjContent, loadCallback, errorCallback);

            var resturl=USERMANAGEMENTSERVICE_ROOT+"deleteRoleCustomStructure/"+APPLICATION_ID+"/Management Department/";

            var deleteCustomeStructureObj={};
            deleteCustomeStructureObj.structureName="Role_Structure_1";

            var deleteCustomeStructureObjContent=dojo.toJson(deleteCustomeStructureObj);

            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.deleteJSONData(resturl, deleteCustomeStructureObjContent, loadCallback, errorCallback);
            */
            /*
            var resturl=USERMANAGEMENTSERVICE_ROOT+"getParticipantCustomStructure/"+APPLICATION_ID+"/"+userId+"/TEST_Structure_B/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
            */
            /*
            var existingCustomeStructureObj={};
            existingCustomeStructureObj.structureId ="/ACTIVITYSPACE_DEFINATION_ROOT/viewfunction_inc/ACTIVITYSPACE_Participant/ManagerA/CustomStructureStore/TEST_Structure_B/CustomStructureStore/newSubStructure001";
            var resturl0=USERMANAGEMENTSERVICE_ROOT+"customStructure/addSubCustomStructure/"+APPLICATION_ID+"/newSubSubStructure004/";
            var existingCustomeStructureObjContent=dojo.toJson(existingCustomeStructureObj);
            var errorCallback0= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback0=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.postJSONData(resturl0,existingCustomeStructureObjContent,loadCallback0,errorCallback0);

            var resturl=USERMANAGEMENTSERVICE_ROOT+"customStructure/deleteSubCustomStructure/"+APPLICATION_ID+"/newSubSubStructure003/";
            var deleteCustomeStructureObj={};
            deleteCustomeStructureObj.structureId ="/ACTIVITYSPACE_DEFINATION_ROOT/viewfunction_inc/ACTIVITYSPACE_Participant/ManagerA/CustomStructureStore/TEST_Structure_B/CustomStructureStore/newSubStructure001";
            var deleteCustomeStructureObjContent=dojo.toJson(deleteCustomeStructureObj);
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.deleteJSONData(resturl, deleteCustomeStructureObjContent, loadCallback, errorCallback);
             */

            /*
            var resturl=USERMANAGEMENTSERVICE_ROOT+"customStructure/updateCustomAttribute/"+APPLICATION_ID+"/";
            var structureAttributrOperationVO={};
            structureAttributrOperationVO.customStructure={};
            structureAttributrOperationVO.customStructure.structureId ="/ACTIVITYSPACE_DEFINATION_ROOT/viewfunction_inc/ACTIVITYSPACE_Participant/ManagerA/CustomStructureStore/TEST_Structure_B/";

            var newCustomeAttributeObj={};
            newCustomeAttributeObj.attributeName="TESTAttribute2";
            newCustomeAttributeObj.attributeType="STRING";
            newCustomeAttributeObj.arrayAttribute=true;
            newCustomeAttributeObj.attributeRowValue=["value1_150204AAAA","value2_150204AAAA","NewValueAAAAAAAAAA"];

            structureAttributrOperationVO.customAttribute=newCustomeAttributeObj;
            var structureAttributrOperationVOObjContent=dojo.toJson(structureAttributrOperationVO);
            var errorCallback0= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback0=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.postJSONData(resturl,structureAttributrOperationVOObjContent,loadCallback0,errorCallback0);
            */

            /*
            var resturl=USERMANAGEMENTSERVICE_ROOT+"customStructure/deleteCustomAttribute/"+APPLICATION_ID+"/TESTAttribute2/";
            var structureAttributrOperationVO={};
            structureAttributrOperationVO.customStructure={};
            structureAttributrOperationVO.customStructure.structureId ="/ACTIVITYSPACE_DEFINATION_ROOT/viewfunction_inc/ACTIVITYSPACE_Participant/ManagerA/CustomStructureStore/TEST_Structure_B/";

            structureAttributrOperationVO.customAttribute=newCustomeAttributeObj;
            var structureAttributrOperationVOObjContent=dojo.toJson(structureAttributrOperationVO.customStructure);
            var errorCallback0= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback0=function(data){
                console.log(data);
            };
            Application.WebServiceUtil.deleteJSONData(resturl,structureAttributrOperationVOObjContent,loadCallback0,errorCallback0);
            */
        },

        destroy:function(){
            dojo.forEach(this.currentRoleParticipantsArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.globalParticipantsSearchMenuDialog.destroy();
            this.globalParticipantsSearchWidget.destroy();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});