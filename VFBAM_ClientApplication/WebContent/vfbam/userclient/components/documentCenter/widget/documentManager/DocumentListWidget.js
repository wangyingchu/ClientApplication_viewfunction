require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/documentCenter/widget/documentManager/template/DocumentListWidget.html",
    "dojo/dom-class","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domClass,domGeom){
    declare("vfbam.userclient.components.documentCenter.widget.documentManager.DocumentListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        documentsFolderPathArray:null,
        currentDocumentsArray:null,
        addNewFolderMenuDialog:null,
        addNewFolderDropDown:null,
        currentSelectedDocumentItemArray:null,
        alreadyLoad:null,
        activitySpaceName:null,
        documentsOwnerType:null,
        participantId:null,
        roleName:null,
        currentFolderPath:null,
        parentFolderPath:null,
        currentFolderName:null,
        postCreate: function(){
            this.documentsFolderPathArray=[];
            this.currentDocumentsArray=[];
            this.currentSelectedDocumentItemArray=[];
            this.alreadyLoad=false;
            this.documentsOwnerType=this.documentsInitData.documentsOwnerType;
        },
        initRender:function(){
            this.renderFolderDocumentsList("/","");
        },
        renderFolderDocumentsList:function(parentFolderPath,folderName){
            dojo.style(this.folderListContainer,"display","");
            dojo.style(this.queryResultListContainer,"display","none");
            this.activitySpaceName=this.documentsInitData.activitySpaceName;
            var resturl="";
            var folderQueryContent="";
            if( this.documentsOwnerType=="PARTICIPANT"){
                this.participantId=this.documentsInitData.participantId;
                var participantFolderQueryObj={};
                participantFolderQueryObj.activitySpaceName=this.activitySpaceName;
                participantFolderQueryObj.participantName=this.participantId;
                participantFolderQueryObj.parentFolderPath=parentFolderPath;
                participantFolderQueryObj.folderName=folderName;
                folderQueryContent=dojo.toJson(participantFolderQueryObj);
                resturl=CONTENT_SERVICE_ROOT+"participantPersonalFolder/";
            }
            if( this.documentsOwnerType=="ROLE"){
                this.roleName=this.documentsInitData.roleName;
                var roleFolderQueryObj={};
                roleFolderQueryObj.activitySpaceName=this.activitySpaceName;
                roleFolderQueryObj.roleName=this.roleName;
                roleFolderQueryObj.parentFolderPath=parentFolderPath;
                roleFolderQueryObj.folderName=folderName;
                folderQueryContent=dojo.toJson(roleFolderQueryObj);
                resturl=CONTENT_SERVICE_ROOT+"roleFolder/";
            }
            if(this.documentsOwnerType=="APPLICATIONSPACE"){
                var applicationSpaceFolderQueryObj={};
                applicationSpaceFolderQueryObj.activitySpaceName=this.activitySpaceName;
                applicationSpaceFolderQueryObj.parentFolderPath=parentFolderPath;
                applicationSpaceFolderQueryObj.folderName=folderName;
                folderQueryContent=dojo.toJson(applicationSpaceFolderQueryObj);
                resturl=CONTENT_SERVICE_ROOT+"applicationSpaceFolder/";
            }
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                that.currentFolderName=folderName;
                var timer = new dojox.timing.Timer(200);
                timer.onTick = function(){
                    UI.hideProgressDialog();
                    timer.stop();
                };
                timer.start();
                if(data){
                    that.currentFolderPath=data.folderPath;
                    that.parentFolderPath=data.parentFolderPath;
                    that.currentFolderName=data.folderName;
                    var isParentFolderLocked=data.folderLocked;
                    if(isParentFolderLocked){
                        that.documentManager.disableAddDocumentsElements();
                    }else{
                        that.documentManager.enableAddDocumentsElements();
                    }
                    if(data.childContentList){
                        var documentsArray=[];
                        dojo.forEach(data.childContentList,function(documentItem){
                            var currentDocument=that._buildDocumentInfoObject(documentItem);
                            documentsArray.push(currentDocument);
                        });
                        if(documentsArray.length>0){
                            that._renderDocumentsList(documentsArray);
                        }else{
                            that._renderDocumentsList([]);
                        }
                    }
                }
            };
            this.alreadyLoad=true;
            UI.showProgressDialog("查询数据");
            Application.WebServiceUtil.postJSONData(resturl, folderQueryContent, loadCallback, errorCallback);
        },
        _renderDocumentsList:function(documentList){
            this._cleanDirtyItemData();
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
            this._cleanDirtyItemData();
            this.documentPreviewWidget.renderInitInfo();
            var isOdd=true;
            dojo.forEach(documentList,function(currentDocument){
                var currentDocumentInfoWidget=new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentDetailInfoWidget(
                    {documentInfo:currentDocument,documentListWidget:this,currentSelectedDocumentItemArray:this.currentSelectedDocumentItemArray,
                     documentPreviewWidget:this.documentPreviewWidget,documentsOwnerType:this.documentsOwnerType});
                this.currentDocumentsArray.push(currentDocumentInfoWidget);
                this.documentsListContainer.appendChild(currentDocumentInfoWidget.domNode);

                if(isOdd){
                    domClass.add(currentDocumentInfoWidget.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentDocumentInfoWidget.domNode, "app_magazineView_item_even");
                }
                isOdd=!isOdd;
            },this);
            UI.showToasterMessage({type:"success",message:"获取到"+documentList.length+"个文件及文件夹"});
            this.resizeDocumentListSize();
        },
        resizeDocumentListSize:function(){
            if(this.containerElementHeight){
                var folderListContentBox = domGeom.getContentBox(this.folderListContainer);
                var folderLinkContainerHeight= folderListContentBox.h;
                var toolbarHeight=50;
                var documentListHeight= this.containerElementHeight-folderLinkContainerHeight-toolbarHeight;
                var currentHeightStyle=""+documentListHeight +"px";
                dojo.style(this.documentsListContainer,"height",currentHeightStyle);
            }
        },
        renderRootFolder:function(){
            this.documentsFolderPathArray.splice(0,this.documentsFolderPathArray.length);
            this.documentManager.enableAddDocumentsElements();
            this.renderFolderDocumentsList("/","");
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
            this.renderFolderDocumentsList(parentFolderPath,subFolderName);
        },
        renderSubFolder:function(folderDeep){
            var needRemoveNumber=this.documentsFolderPathArray.length- folderDeep;
            this.documentsFolderPathArray.splice(folderDeep+1,needRemoveNumber);
            var parentFolderPath=this.getParentFolderPath();
            var subFolderName=this.documentsFolderPathArray[folderDeep];
            this.renderFolderDocumentsList(parentFolderPath,subFolderName);
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
        refreshCurrentFolder:function(){
            this.renderFolderDocumentsList(this.parentFolderPath,this.currentFolderName);
        },
        setAddNewFolderMenuDialog:function(addNewFolderMenuDialog){
            this.addNewFolderMenuDialog= addNewFolderMenuDialog
        },
        setAddNewDocumentDropDown:function(addNewDocumentDropDown){
            this.addNewFolderDropDown= addNewDocumentDropDown
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
                //do add folder on server side
                this.addNewFolderMenuDialog.close();
                this.addNewFolderDropDown.clearInput();

                var that=this;
                var callback=function(){
                    that.refreshCurrentFolder();
                };
                if(this.documentsOwnerType=="PARTICIPANT"){
                    var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
                    var addParticipantFolderObj={};
                    addParticipantFolderObj.activitySpaceName=APPLICATION_ID;
                    addParticipantFolderObj.participantName=userId;
                    addParticipantFolderObj.parentFolderPath=this.currentFolderPath;
                    addParticipantFolderObj.folderName=folderName;
                    Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,{newFolderInfo:addParticipantFolderObj,folderType:this.documentsOwnerType,callback:callback});
                }
                if(this.documentsOwnerType=="APPLICATIONSPACE"){
                    var addApplicationSpaceFolderObj={};
                    addApplicationSpaceFolderObj.activitySpaceName=APPLICATION_ID;
                    addApplicationSpaceFolderObj.parentFolderPath=this.currentFolderPath;
                    addApplicationSpaceFolderObj.folderName=folderName;
                    Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,{newFolderInfo:addApplicationSpaceFolderObj,folderType:this.documentsOwnerType,callback:callback});
                }
                if(this.documentsOwnerType=="ROLE"){
                    var addRoleFolderObj={};
                    addRoleFolderObj.activitySpaceName=APPLICATION_ID;
                    addRoleFolderObj.roleName=this.roleName;
                    addRoleFolderObj.parentFolderPath=this.currentFolderPath;
                    addRoleFolderObj.folderName=folderName;
                    Application.MessageUtil.publishMessage(APP_GLOBAL_DOCUMENTOPERATION_ADDFOLDER_EVENT,{newFolderInfo:addRoleFolderObj,folderType:this.documentsOwnerType,callback:callback});
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
        addDocument:function(){console.log("addDocument");},
        _cleanDirtyItemData:function(){
            dojo.empty(this.documentsListContainer);
            dojo.forEach(this.currentDocumentsArray,function(documentItem){
                documentItem.destroy();
            });
            this.currentDocumentsArray=[];
            this.currentSelectedDocumentItemArray.splice(0, this.currentSelectedDocumentItemArray.length);
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
        queryDocuments:function(queryParams){
            dojo.style(this.folderListContainer,"display","none");
            dojo.style(this.queryResultListContainer,"display","");
            this.queryContent.innerHTML=queryParams.queryContent;
            if(queryParams.queryDocumentName){
                dojo.style(this.nameQueryPrompt,"display","");
            }else{
                dojo.style(this.nameQueryPrompt,"display","none");
            }
            if(queryParams.queryDocumentTag){
                dojo.style(this.tagQueryPrompt,"display","");
            }else{
                dojo.style(this.tagQueryPrompt,"display","none");
            }
            if(queryParams.queryDocumentContent){
                dojo.style(this.contentQueryPrompt,"display","");
            }else{
                dojo.style(this.contentQueryPrompt,"display","none");
            }
            this.documentManager.disableAddDocumentsElements();
            var documentsQueryMeteInfo={};
            documentsQueryMeteInfo.queryContent=queryParams.queryContent;
            documentsQueryMeteInfo.queryDocumentName=queryParams.queryDocumentName;
            documentsQueryMeteInfo.queryDocumentTag=queryParams.queryDocumentTag;
            documentsQueryMeteInfo.queryDocumentContent=queryParams.queryDocumentContent;
            documentsQueryMeteInfo.documentsOwnerType=this.documentsOwnerType;
            documentsQueryMeteInfo.activitySpaceName=this.documentsInitData.activitySpaceName;
            if( this.documentsOwnerType=="PARTICIPANT"){
                documentsQueryMeteInfo.participantName=this.participantId;
            }
            if( this.documentsOwnerType=="ROLE"){
                documentsQueryMeteInfo.roleName=this.documentsInitData.roleName;
            }
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var documentQueryContent=dojo.toJson(documentsQueryMeteInfo);
            var resturl=CONTENT_SERVICE_ROOT+"queryDocuments/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                var timer = new dojox.timing.Timer(200);
                timer.onTick = function(){
                    UI.hideProgressDialog();
                    timer.stop();
                };
                timer.start();
                var documentsArray=[];
                dojo.forEach(data,function(documentItem){
                    var currentDocument=that._buildDocumentInfoObject(documentItem);
                    documentsArray.push(currentDocument);
                });
                if(documentsArray.length>0){
                    that._renderDocumentsList(documentsArray);
                }else{
                    that._renderDocumentsList([]);
                }
            };
            UI.showProgressDialog("查询数据");
            Application.WebServiceUtil.postJSONData(resturl, documentQueryContent, loadCallback, errorCallback);
        },
        _buildDocumentInfoObject:function(documentItem){
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
            currentDocument["childrenNumber"]=documentItem.childDocumentNumber;
            currentDocument["documentSize"]=documentItem.documentSize;
            currentDocument["isDocumentLocked"]=documentItem.locked;
            currentDocument["isLinkDocument"]=documentItem.linked;
            currentDocument["documentTags"]=documentItem.documentTags;
            var documentCreator=documentItem.documentCreator;
            if(documentCreator){
                var creatorParticipant={};
                creatorParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+documentCreator.userId;
                creatorParticipant.participantName=documentCreator.displayName;
                creatorParticipant.participantId=documentCreator.userId;
                creatorParticipant.participantTitle=documentCreator.title;
                creatorParticipant.participantDesc=documentCreator.description;
                creatorParticipant.participantAddress=documentCreator.address;
                creatorParticipant.participantPhone=documentCreator.fixedPhone;
                creatorParticipant.participantEmail=documentCreator.emailAddress;
                currentDocument["documentCreator"]=creatorParticipant;
            }
            var documentLastUpdater=documentItem.documentLastUpdatePerson;
            if(documentLastUpdater){
                var updateParticipant={};
                updateParticipant.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+documentLastUpdater.userId;
                updateParticipant.participantName=documentLastUpdater.displayName;
                updateParticipant.participantId=documentLastUpdater.userId;
                updateParticipant.participantTitle=documentLastUpdater.title;
                updateParticipant.participantDesc=documentLastUpdater.description;
                updateParticipant.participantAddress=documentLastUpdater.address;
                updateParticipant.participantPhone=documentLastUpdater.fixedPhone;
                updateParticipant.participantEmail=documentLastUpdater.emailAddress;
                currentDocument["documentLastUpdatePerson"]=updateParticipant;
            }
            var documentLocker=documentItem.documentLocker;
            if(documentLocker){
                var documentLockPerson={};
                documentLockPerson.participantPhotoPath=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/facePhoto/"+APPLICATION_ID+"/"+documentLocker.userId;
                documentLockPerson.participantName=documentLocker.displayName;
                documentLockPerson.participantId=documentLocker.userId;
                documentLockPerson.participantTitle=documentLocker.title;
                documentLockPerson.participantDesc=documentLocker.description;
                documentLockPerson.participantAddress=documentLocker.address;
                documentLockPerson.participantPhone=documentLocker.fixedPhone;
                documentLockPerson.participantEmail=documentLocker.emailAddress;
                currentDocument["documentLockPerson"]=documentLockPerson;
            }
            return currentDocument;
        },
        _endOfCode: function(){}
    });
});