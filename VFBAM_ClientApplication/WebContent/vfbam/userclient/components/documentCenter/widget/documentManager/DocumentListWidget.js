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
        },
        initRender:function(){

            this.activitySpaceName=this.documentsInitData.activitySpaceName;
            this.documentsOwnerType=this.documentsInitData.documentsOwnerType;



            var resturl="";
            var folderQueryContent="";
            if( this.documentsOwnerType=="PARTICIPANT"){
                this.participantId=this.documentsInitData.participantId;
                var participantFolderQueryObj={};
                participantFolderQueryObj.activitySpaceName=this.activitySpaceName;
                participantFolderQueryObj.participantName=this.participantId;
                participantFolderQueryObj.parentFolderPath="/";
                participantFolderQueryObj.folderName="";
                folderQueryContent=dojo.toJson(participantFolderQueryObj);
                resturl=CONTENT_SERVICE_ROOT+"participantPersonalFolder/";
            }
            if( this.documentsOwnerType=="ROLE"){
                this.roleName=this.documentsInitData.roleName;
            }
            if( this.documentsOwnerType=="APPLICATIONSPACE"){}


            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                /*
                var timer = new dojox.timing.Timer(200);
                timer.onTick = function(){
                    if(hideProgressDialog){
                        UI.hideProgressDialog();
                    }
                    timer.stop();
                };
                timer.start();
                */
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
                            currentDocument["childrenNumber"]=documentItem.childDocumentNumber;
                            currentDocument["documentSize"]=documentItem.documentSize;
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
                            documentsArray.push(currentDocument);
                        });
                        if(documentsArray.length>0){
                            that.renderDocumentsList(documentsArray);
                        }else{
                            that.renderDocumentsList([]);
                        }
                    }
                }
            };

            if( this.documentsOwnerType=="PARTICIPANT") {
                Application.WebServiceUtil.postJSONData(resturl, folderQueryContent, loadCallback, errorCallback);
            }else{






                var documentsList=this.getDocumentsList("/");
                this.documentsFolderPathArray.push("子目录1");
                this.documentsFolderPathArray.push("子目录2");
                this.documentsFolderPathArray.push("子目录3");
                this.documentsFolderPathArray.push("子目录4");
                this.documentsFolderPathArray.push("子目录5");
                this.documentsFolderPathArray.push("子目录6");


                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");
                this.documentsFolderPathArray.push("子目录6");


                this.renderDocumentsList(documentsList);







            }








        },
        getDocumentsList:function(folderPath){
            var documentsArray=[];
            var documentInfo1={};
            documentInfo1["documentName"]="Initial pass through ICMHC capitalization.pdf";
            documentInfo1["documentCreateDate"]=new Date();
            var participant1={};
            participant1.participantPhotoPath="images/86479729_.jpg";
            participant1.participantName="同事A";
            participant1.participantId="user1";
            participant1.participantTitle="IT部经理";
            participant1.participantDesc="员工详细工作职责介绍";
            participant1.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant1.participantPhone="0951-4567823";
            participant1.participantEmail="mail1@viewfunction.com";
            documentInfo1["documentCreator"]=participant1;
            documentInfo1["documentLastUpdateDate"]=new Date();
            documentInfo1["documentLastUpdatePerson"]=participant1;
            documentInfo1["isFolder"]=false;
            documentInfo1["version"]="1.0";
            documentInfo1["documentType"]="PDF";
            documentInfo1["documentFolderPath"]=folderPath;
            documentInfo1["documentSize"]="530 KB";
            documentsArray.push(documentInfo1);

            var documentInfo2={}
            documentInfo2["documentName"]="One UI Compliance in Case Builder.ppt";
            documentInfo2["documentCreateDate"]=new Date();
            var participant2={};
            participant2.participantPhotoPath="images/86530525_.jpg";
            participant2.participantName="领导C";
            participant2.participantId="user2";
            participant2.participantTitle="IT部经理.12345";
            participant2.participantDesc="员工详细工作职责介绍";
            participant2.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant2.participantPhone="13411223345";
            participant2.participantEmail="mail2@viewfunction.com";
            documentInfo2["documentCreator"]=participant2;
            documentInfo2["documentLastUpdateDate"]=new Date();
            documentInfo2["documentLastUpdatePerson"]=participant1;
            documentInfo2["isFolder"]=false;
            documentInfo2["version"]="1.4";
            documentInfo2["documentType"]="PPT";
            documentInfo2["documentFolderPath"]=folderPath;
            documentInfo2["documentSize"]="53010 KB";
            documentsArray.push(documentInfo2);

            var documentInfo3={}
            documentInfo3["documentName"]="careplanSection.xls";
            documentInfo3["documentCreateDate"]=new Date();
            var participant3={};
            participant3.participantPhotoPath="images/87569996_.jpg";
            participant3.participantName="同事B";
            participant3.participantId="user3";
            participant3.participantTitle="IT部经理.12345";
            participant3.participantDesc="员工详细工作职责介绍";
            participant3.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant3.participantPhone="13677885534";
            participant3.participantEmail="mail3@viewfunction.com";
            documentInfo3["documentCreator"]=participant3;
            documentInfo3["documentLastUpdateDate"]=new Date();
            documentInfo3["documentLastUpdatePerson"]=participant2;
            documentInfo3["isFolder"]=false;
            documentInfo3["version"]="1.0";
            documentInfo3["documentType"]="XLS";
            documentInfo3["documentFolderPath"]=folderPath;
            documentInfo3["documentSize"]="53011 KB";
            documentsArray.push(documentInfo3);

            var documentInfo4={}
            documentInfo4["documentName"]="Sys config.txt";
            documentInfo4["documentCreateDate"]=new Date();
            var participant4={};
            participant4.participantPhotoPath="images/118946479_.jpg";
            participant4.participantName="同事C";
            participant4.participantId="user4";
            participant4.participantTitle="IT部经理.12345";
            participant4.participantDesc="员工详细工作职责介绍";
            participant4.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant4.participantPhone="15966783456";
            participant4.participantEmail="mail4@viewfunction.com";
            documentInfo4["documentCreator"]=participant4;
            documentInfo4["documentLastUpdateDate"]=new Date();
            documentInfo4["documentLastUpdatePerson"]=participant3;
            documentInfo4["isFolder"]=false;
            documentInfo4["version"]="0.2";
            documentInfo4["documentType"]="TXT";
            documentInfo4["documentFolderPath"]=folderPath;
            documentInfo4["documentSize"]="53012 KB";
            documentsArray.push(documentInfo4);
            var documentInfo5={}
            documentInfo5["documentName"]="图像子目录";
            documentInfo5["documentCreateDate"]=new Date();
            var participant5={};
            participant5.participantPhotoPath="images/86479729_.jpg";
            participant5.participantName="同事A";
            participant5.participantId="user1";
            participant5.participantTitle="IT部经理";
            participant5.participantDesc="员工详细工作职责介绍";
            participant5.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant5.participantPhone="0951-4567823";
            participant5.participantEmail="mail1@viewfunction.com";
            documentInfo5["documentCreator"]=participant5;
            documentInfo5["documentLastUpdateDate"]=new Date();
            documentInfo5["documentLastUpdatePerson"]=participant4;
            documentInfo5["isFolder"]=true;
            documentInfo5["version"]="1.1";
            documentInfo5["childrenNumber"]=16;
            documentInfo5["documentType"]="FOLDER";
            documentInfo5["documentFolderPath"]=folderPath;
            documentInfo5["documentSize"]="53013 KB";
            documentsArray.push(documentInfo5);
            var documentInfo6={}
            documentInfo6["documentName"]="system design.doc";
            documentInfo6["documentCreateDate"]=new Date();
            var participant6={};
            participant6.participantPhotoPath="images/86479729_.jpg";
            participant6.participantName="同事A";
            participant6.participantId="user1";
            participant6.participantTitle="IT部经理";
            participant6.participantDesc="员工详细工作职责介绍";
            participant6.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant6.participantPhone="0951-4567823";
            participant6.participantEmail="mail1@viewfunction.com";
            documentInfo6["documentCreator"]=participant6;
            documentInfo6["documentLastUpdateDate"]=new Date();
            documentInfo6["documentLastUpdatePerson"]=participant5;
            documentInfo6["isFolder"]=false;
            documentInfo6["version"]="1.3";
            documentInfo6["documentType"]="DOC";
            documentInfo6["documentFolderPath"]=folderPath;
            documentInfo6["documentSize"]="53014 KB";
            documentsArray.push(documentInfo6);
            var documentInfo7={}
            documentInfo7["documentName"]="screenshot.jpg";
            documentInfo7["documentCreateDate"]=new Date();
            var participant7={};
            participant7.participantPhotoPath="images/86479729_.jpg";
            participant7.participantName="同事A";
            participant7.participantId="user1";
            participant7.participantTitle="IT部经理";
            participant7.participantDesc="员工详细工作职责介绍";
            participant7.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant7.participantPhone="0951-4567823";
            participant7.participantEmail="mail1@viewfunction.com";
            documentInfo7["documentCreator"]=participant7;
            documentInfo7["documentLastUpdateDate"]=new Date();
            documentInfo7["documentLastUpdatePerson"]=participant2;
            documentInfo7["isFolder"]=false;
            documentInfo7["version"]="1.0";
            documentInfo7["documentType"]="JPG";
            documentInfo7["documentFolderPath"]=folderPath;
            documentInfo7["documentSize"]="53015 KB";
            documentsArray.push(documentInfo7);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            var participant8={};
            participant8.participantPhotoPath="images/86479729_.jpg";
            participant8.participantName="同事A";
            participant8.participantId="user1";
            participant8.participantTitle="IT部经理";
            participant8.participantDesc="员工详细工作职责介绍";
            participant8.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant8.participantPhone="0951-4567823";
            participant8.participantEmail="mail1@viewfunction.com";
            documentInfo8["documentCreator"]=participant8;
            documentInfo8["documentLastUpdateDate"]=new Date();
            documentInfo8["documentLastUpdatePerson"]=participant1;
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]="1.2";
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="53014 KB";
            documentsArray.push(documentInfo8);


            /*
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="53013 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="53012 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="53011 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo1["documentSize"]="530 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5300 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5309 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5308 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5307 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5306 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5305 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5304 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5303 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5302 KB";
            documentsArray.push(documentInfo8);
            var documentInfo8={}
            documentInfo8["documentName"]="meeting record.mp3";
            documentInfo8["documentCreateDate"]=new Date();
            documentInfo8["isFolder"]=false;
            documentInfo8["version"]=1.2;
            documentInfo8["documentType"]="MP3";
            documentInfo8["documentFolderPath"]=folderPath;
            documentInfo8["documentSize"]="5301 KB";
            documentsArray.push(documentInfo8);
            */


            return documentsArray;
        },
        renderDocumentsList:function(documentList){
            this.alreadyLoad=true;
            UI.showProgressDialog("查询数据");
            var that=this;
            var timer = new dojox.timing.Timer(500);
            timer.onTick = function(){
                that._cleanDirtyItemData();
                that._renderDocumentsList(documentList);
                timer.stop();
            }
            timer.start();
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
            this._cleanDirtyItemData();
            this.documentPreviewWidget.renderInitInfo();
            var isOdd=true;
            dojo.forEach(documentList,function(currentDocument){
                var currentDocumentInfoWidget=new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentDetailInfoWidget(
                    {documentInfo:currentDocument,documentListWidget:this,currentSelectedDocumentItemArray:this.currentSelectedDocumentItemArray,
                     documentPreviewWidget:this.documentPreviewWidget});
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
            var documentsList=this.getDocumentsList("/");
            this.renderDocumentsList(documentsList);
        },
        renderSubFolder:function(folderDeep){
            var needRemoveNumber=this.documentsFolderPathArray.length- folderDeep;
            this.documentsFolderPathArray.splice(folderDeep+1,needRemoveNumber);
            var folderPath=this.getFolderPath();
            var documentsList=this.getDocumentsList(folderPath);
            this.renderDocumentsList(documentsList);
        },
        refreshCurrentFolder:function(){
            console.log("refreshCurrentFolder");
        },
        getFolderPath:function(){
            var folderPath="/";
            dojo.forEach(this.documentsFolderPathArray,function(folderName){
                folderPath=folderPath+  folderName+"/";
            });
            return folderPath;
        },
        setAddNewFolderMenuDialog:function(addNewFolderMenuDialog){
            this.addNewFolderMenuDialog= addNewFolderMenuDialog
        },
        setAddNewDocumentDropDown:function(addNewDocumentDropDown){
            this.addNewFolderDropDown= addNewDocumentDropDown
        },
        addFolder:function(folderName){
            if(this._checkFolderName(folderName)){
                //do add folder on server side
                this.addNewFolderMenuDialog.close();
                this.addNewFolderDropDown.clearInput();
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
            UI.hideProgressDialog();
        },
        _endOfCode: function(){}
    });
});