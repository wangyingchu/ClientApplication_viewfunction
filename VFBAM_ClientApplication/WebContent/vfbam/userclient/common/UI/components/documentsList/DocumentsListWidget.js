require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/documentsList/template/DocumentsListWidget.html","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domGeom){
    declare("vfbam.userclient.common.UI.components.documentsList.DocumentsListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        documentsFolderPathArray:null,
        toolbarHeight:null,
        currentDocumentsArray:null,
        addNewFolderDropDown:null,
        addNewFolderMenuDialog:null,
        addNewDocumentDropDown:null,
        currentFolderPath:null,
        parentFolderPath:null,
        currentFolderName:null,
        postCreate: function(){
            this.documentsFolderPathArray=[];
            this.currentDocumentsArray=[];
            this.renderDocumentsList("/","",false);
            this.addNewFolderMenuDialog=new idx.widget.MenuDialog();
            this.addNewFolderDropDown=new vfbam.userclient.common.UI.components.documentsList.AddNewFolderWidget({documentListWidget:this});
            dojo.place(this.addNewFolderDropDown.domNode, this.addNewFolderMenuDialog.containerNode);
            this.addFolderLink.set("dropDown",this.addNewFolderMenuDialog);
            this.addNewDocumentDropDown=new vfbam.userclient.common.UI.components.documentsList.AddNewDocumentWidget({documentListWidget:this});
            this.addDocumentLink.set("dropDown",this.addNewDocumentDropDown);
        },
        resizeDocumentListSize:function(){
            if(this.containerElementId){
                var contentBox = domGeom.getContentBox(dojo.byId(this.containerElementId));
                var realHeight=contentBox.h;
                var folderListContentBox = domGeom.getContentBox(this.folderListContainer);
                realHeight=realHeight-folderListContentBox.h;
                this.toolbarHeight=38;
                realHeight=realHeight-this.toolbarHeight;
                if(this.reservationHeight!=0){
                    realHeight=realHeight-this.reservationHeight;
                }
                var currentHeightStyle=""+realHeight +"px";
                dojo.style(this.documentsListContainer,"height",currentHeightStyle);
            }
        },
        renderDocumentsList:function(parentFolderPath,folderName,hideProgressDialog){
            if(!this.documentsOwnerType){
                return;
            }
            var resturl="";
            var folderQueryContent="";
            if(this.documentsOwnerType=="PARTICIPANT"){
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var participantFolderQueryObj={};
                participantFolderQueryObj.activitySpaceName=APPLICATION_ID;
                participantFolderQueryObj.participantName=userId;
                participantFolderQueryObj.parentFolderPath=parentFolderPath;
                participantFolderQueryObj.folderName=folderName;
                folderQueryContent=dojo.toJson(participantFolderQueryObj);
                resturl=CONTENT_SERVICE_ROOT+"participantPersonalFolder/";
            }
            if(this.documentsOwnerType=="ACTIVITY"){
                var taskItemData=this.taskData.taskItemData;
                var activityId=taskItemData.activityId;
                var activityName=taskItemData.activityName;
                var activityFolderQueryObj={};
                activityFolderQueryObj.activitySpaceName=APPLICATION_ID;
                activityFolderQueryObj.activityName=activityName;
                activityFolderQueryObj.activityId=activityId;
                activityFolderQueryObj.parentFolderPath=parentFolderPath;
                activityFolderQueryObj.folderName=folderName;
                folderQueryContent=dojo.toJson(activityFolderQueryObj);
                resturl=CONTENT_SERVICE_ROOT+"businessActivityFolder/";
            }
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                var timer = new dojox.timing.Timer(200);
                timer.onTick = function(){
                    if(hideProgressDialog){
                        UI.hideProgressDialog();
                    }
                    timer.stop();
                };
                timer.start();
                if(data){
                    that.currentFolderPath=data.folderPath;
                    that.parentFolderPath=data.parentFolderPath;
                    that.currentFolderName=data.folderName;
                    if(data.childContentList){
                        var documentsArray=[];
                        dojo.forEach(data.childContentList,function(documentItem){
                            var currentDocument={};
                            currentDocument["documentName"]=documentItem.documentName;
                            currentDocument["documentCreateDate"]=new Date(documentItem.documentCreateDate);
                            currentDocument["isFolder"]=documentItem.folder;
                            currentDocument["documentType"]=documentItem.documentType;
                            currentDocument["documentFolderPath"]=documentItem.documentFolderPath;
                            currentDocument["documentLastUpdateDate"]=new Date(documentItem.documentLastUpdateDate);
                            currentDocument["documentCreator"]=documentItem.documentCreator;
                            currentDocument["documentLastUpdatePerson"]=documentItem.documentLastUpdatePerson;
                            currentDocument["version"]=documentItem.version;
                            currentDocument["childDocumentNumber"]=documentItem.childDocumentNumber;
                            currentDocument["documentFolderPath"]=documentItem.documentFolderPath;
                            documentsArray.push(currentDocument);
                        });
                        if(documentsArray.length>0){
                            that._renderDocumentsList(documentsArray);
                        }else{
                            that._renderDocumentsList([]);
                        }
                    }
                }else{
                    if(that.containerInitFinishCounterFuc){
                        that.containerInitFinishCounterFuc();
                    }
                }
            };
            if(hideProgressDialog){
                UI.showProgressDialog("获取文件列表");
            }
            Application.WebServiceUtil.postJSONData(resturl,folderQueryContent,loadCallback,errorCallback);
        },
        _renderDocumentsList:function(documentList){
            dojo.empty(this.folderListBbreadcrumb);
            dojo.forEach(this.documentsFolderPathArray,function(documentsFolderName,idx){
                var divChar=dojo.create("i", {className:"icon-chevron-right",style:"font-size: 0.8em;color: #666666;"});
                this.folderListBbreadcrumb.appendChild(divChar);
                var that=this;
                (function () {
                    var loadSubFolderFunction=function(){
                        that.renderSubFolder(idx);
                    };
                    dojo.create("a",{
                        style:"color:#00649D;padding-right:5px;cursor:pointer;",
                        innerHTML: " "+documentsFolderName,
                        onclick:loadSubFolderFunction
                    },that.folderListBbreadcrumb);
                })();
            },this);

            dojo.forEach(this.currentDocumentsArray,function(currentDocument){
                currentDocument.destroy();
            },this);
            this.currentDocumentsArray=[];

            dojo.empty(this.documentsListContainer);
            dojo.forEach(documentList,function(currentDocument){
                var currentDocumentInfoWidget=new vfbam.userclient.common.UI.components.documentsList.DocumentInfoWidget({documentInfo:currentDocument,documentListWidget:this});
                this.currentDocumentsArray.push(currentDocumentInfoWidget);
                this.documentsListContainer.appendChild(currentDocumentInfoWidget.domNode);
            },this);
            this.resizeDocumentListSize();
            if(this.containerInitFinishCounterFuc){
                this.containerInitFinishCounterFuc();
            }
        },
        renderRootFolder:function(){
            this.documentsFolderPathArray.splice(0,this.documentsFolderPathArray.length);
            this.renderDocumentsList("/","",true);
        },
        renderSubFolder:function(folderDeep){
            var needRemoveNumber=this.documentsFolderPathArray.length- folderDeep;
            this.documentsFolderPathArray.splice(folderDeep+1,needRemoveNumber);
            var parentFolderPath=this.getParentFolderPath();
            var subFolderName=this.documentsFolderPathArray[folderDeep];
            this.renderDocumentsList(parentFolderPath,subFolderName,true);
        },
        goToSubFolderByPath:function(currentFolderPath,subFolderName){
            var currentFolderPathDepth=this.documentsFolderPathArray.length;
            this.documentsFolderPathArray.splice(0,currentFolderPathDepth);
            var currentFolderPathNameArray=currentFolderPath.split("/");
            dojo.forEach(currentFolderPathNameArray,function(folderName,idx){
                if(folderName!=""){
                    this.documentsFolderPathArray.push(folderName);
                }
            },this);
            this.documentsFolderPathArray.push(subFolderName);
            var parentFolderPath=currentFolderPath;
            var subFolderName=subFolderName;
            this.renderDocumentsList(parentFolderPath,subFolderName,true);
        },
        refreshCurrentFolder:function(){
            this.renderDocumentsList(this.parentFolderPath,this.currentFolderName,true);
        },
        getParentFolderPath:function(){
            var folderPath="/";
            var folderLength=this.documentsFolderPathArray.length-1;
            dojo.forEach(this.documentsFolderPathArray,function(folderName,idx){
                if(idx<folderLength){
                    folderPath=folderPath+folderName+"/";
                }
            });
            return folderPath;
        },
        addFolder:function(folderName){
            if(folderName.match("/")){
                UI.showToasterMessage({
                    type:"error",
                    message:"文件夹名称中不能包含字符 ' <b>/</b> '"
                });
                return;
            }
            if(this._checkFolderName(folderName)){
                this.addNewFolderMenuDialog.close();
                this.addNewFolderDropDown.clearInput();
                var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                var addParticipantFolderObj={};
                addParticipantFolderObj.activitySpaceName=APPLICATION_ID;
                addParticipantFolderObj.participantName=userId
                addParticipantFolderObj.parentFolderPath=this.currentFolderPath;
                addParticipantFolderObj.folderName=folderName;
                var that=this;
                var callback=function(){
                    that.refreshCurrentFolder();
                };
                if(this.documentsOwnerType=="PARTICIPANT"){
                    Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,{newFolderInfo:addParticipantFolderObj,folderType:this.documentsOwnerType,callback:callback});
                }
                if(this.documentsOwnerType=="ACTIVITY"){
                    Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,{newFolderInfo:addParticipantFolderObj,folderType:this.documentsOwnerType,
                        taskItemData:this.taskData.taskItemData,callback:callback});
                }
            }else{
                UI.showToasterMessage({
                    type:"error",
                    message:'在当前目录中文件夹名称: "<b>'+folderName+'</b>" 已存在'
                });
            }
        },
        _checkFolderName:function(folderName){
            var checkResult=true;
            dojo.forEach(this.currentDocumentsArray,function(currentDocument){
                if(currentDocument.documentInfo.isFolder&&currentDocument.documentInfo.documentName==folderName){
                    checkResult= false;
                }
            },this);
            return checkResult;
        },
        checkExistingFileName:function(fileName){
            var checkResult=false;
            dojo.forEach(this.currentDocumentsArray,function(currentDocument){
                if((!currentDocument.documentInfo.isFolder)&&currentDocument.documentInfo.documentName==fileName){
                    checkResult= true;
                }
            },this);
            return checkResult;
        },
        destroy:function(){
            this.addNewFolderDropDown.destroy();
            this.addNewDocumentDropDown.destroy();
            this.addNewFolderMenuDialog.destroy();
            dojo.forEach(this.currentDocumentsArray,function(currentDocument){
                currentDocument.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});