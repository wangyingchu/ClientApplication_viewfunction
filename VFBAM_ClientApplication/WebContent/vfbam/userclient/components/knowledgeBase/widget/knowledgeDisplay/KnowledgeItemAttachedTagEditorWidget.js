require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemAttachedTagEditorWidget.html",
    "idx/oneui/Dialog","dojo/dom-construct"
],function(lang,declare, _Widget, _Templated, template,Dialog,domConstruct){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        attachedCategoryTagList:null,
        postCreate: function(){
            this.attachedCategoryTagList=[];
            this.renderSheetMode();
        },
        renderTagItems:function(){
            dojo.empty(this.attachedTagDisplayContainer);
            dojo.forEach(this.attachedCategoryTagList,function(tagWidget){
                tagWidget.destroy();
            });
            this.attachedCategoryTagList.splice(0,this.attachedCategoryTagList.length);
            dojo.forEach(this.attachedTags,function(tagId){
                var currentCategory=this.knowledgeCategoryInheritDataStore.get(tagId);
                var displayNameInheritArray=[];
                KnowledgeBaseDataHandleUtil.getCategoryDisplayNameInherit(currentCategory,displayNameInheritArray,this.knowledgeCategoryInheritDataStore);
                var attachedCategoryTag=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SelectedCategoryTagWidget({categoryData:currentCategory,categoryTagNameArray:displayNameInheritArray.reverse(),readonly:true});
                this.attachedTagDisplayContainer.appendChild(attachedCategoryTag.domNode);
                this.attachedCategoryTagList.push(attachedCategoryTag);
            },this);
            this.renderTagSheet();
        },
        renderTagSheet:function(){
            var that=this;
            var contentTags=this.knowledgeContentInfo.contentTags;
            var projectTags=this.knowledgeContentInfo.projectTags;
            var mergedTagArray=[];
            dojo.forEach(contentTags,function(currentTag){
                mergedTagArray.push(currentTag);
            });
            dojo.forEach(projectTags,function(currentProjectTag){
                if(!that.containedInMergedTagArray(currentProjectTag,mergedTagArray)){
                    mergedTagArray.push(currentProjectTag);
                }
            });
            var maxInheritDepth=0;
            var finalTagDisplayNamesArray=[];
            dojo.forEach(mergedTagArray,function(tagId){
                var currentCategory=this.knowledgeCategoryInheritDataStore.get(tagId);
                var displayNameInheritArray=[];
                KnowledgeBaseDataHandleUtil.getCategoryDisplayNameInherit(currentCategory,displayNameInheritArray,this.knowledgeCategoryInheritDataStore);
                var finalDisplayNameInheritArray=displayNameInheritArray.reverse();
                finalTagDisplayNamesArray.push(finalDisplayNameInheritArray);
                if(finalDisplayNameInheritArray.length> maxInheritDepth){
                    maxInheritDepth=finalDisplayNameInheritArray.length;
                }
            },this);

            function level0Sort(a,b){
                var stringCompare=a[0].localeCompare(b[0]);
                return stringCompare;
            }
            finalTagDisplayNamesArray.sort(level0Sort);
            function level1Sort(a,b){
                if(a[0]==b[0]){
                    var stringCompare=a[1].localeCompare(b[1]);
                    return stringCompare;
                }else{
                   return null;
                }
            }
            finalTagDisplayNamesArray.sort(level1Sort);
            function level2Sort(a,b){
                if(a[0]==b[0]&&a[1]==b[1]){
                    if(a[2] && b[2]){
                        var stringCompare=a[2].localeCompare(b[2]);
                        return stringCompare;
                    }else{
                        return null;
                    }
                }else{
                    return null;
                }
            }
            finalTagDisplayNamesArray.sort(level2Sort);
            function level3Sort(a,b){
                if(a[0]==b[0]&&a[1]==b[1]&&a[2]==b[2]){
                    var stringCompare=a[3].localeCompare(b[3]);
                    return stringCompare;
                }else{
                    return null;
                }
            }
            finalTagDisplayNamesArray.sort(level3Sort);
            function level4Sort(a,b){
                if(a[0]==b[0]&&a[1]==b[1]&&a[2]==b[2]&&a[3]==b[3]){
                    var stringCompare=a[4].localeCompare(b[4]);
                    return stringCompare;
                }else{
                    return null;
                }
            }
            finalTagDisplayNamesArray.sort(level4Sort);
            function level5Sort(a,b){
                if(a[0]==b[0]&&a[1]==b[1]&&a[2]==b[2]&&a[3]==b[3]&&a[4]==b[4]){
                    var stringCompare=a[5].localeCompare(b[5]);
                    return stringCompare;
                }else{
                    return null;
                }
            }
            finalTagDisplayNamesArray.sort(level5Sort);

            var existingTagNameRegister={};
            dojo.empty(this.attachedTagSheetTable);
            dojo.forEach(finalTagDisplayNamesArray,function(displayNameInheritArray){
                var trNode = domConstruct.create("tr");
                that.attachedTagSheetTable.appendChild(trNode);
                dojo.forEach(displayNameInheritArray,function(tagNameValue,idx){
                    var columnNumber=""+idx;
                    if(existingTagNameRegister[columnNumber]==null){
                        existingTagNameRegister[columnNumber]=[];
                    }
                    var existingFlag=false;
                    if(that.containedInMergedTagArray(tagNameValue,existingTagNameRegister[columnNumber])){
                        existingFlag=true;
                    }else{
                        existingTagNameRegister[columnNumber].push(tagNameValue);
                        existingFlag=false;
                    }
                    var currentTd;
                    if(existingFlag){
                        currentTd=domConstruct.create("td",{"innerHTML":tagNameValue,"style":"border-width:0px;border-bottom-width: 1px;padding: 8px; border-style: solid; border-color: #CCCCCC;color:#DDDDDD;"});
                    }else{
                        currentTd=domConstruct.create("td",{"innerHTML":tagNameValue,"style":"border-width:0px;border-bottom-width: 1px;padding: 8px; border-style: solid; border-color: #CCCCCC;"});
                    }
                    trNode.appendChild(currentTd);
                });
                var emptyTdNumber=maxInheritDepth-displayNameInheritArray.length;
                for(i=0;i<emptyTdNumber;i++){
                    var emptyTd=domConstruct.create("td",{"innerHTML":"","style":"border-width:0px;border-bottom-width: 1px;padding: 8px; border-style: solid; border-color: #CCCCCC;"});
                    trNode.appendChild(emptyTd);
                }
            });
        },
        containedInMergedTagArray:function(tagId,tagArray){
            var result=false;
            dojo.forEach(tagArray,function(currentTag){
                if(currentTag==tagId){
                    result=true;
                }
            });
            return result;
        },
        renderItemTagSelectorDialog:function(){
            var tagSelector=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagSelectorWidget({attachedTags:this.attachedTags});
            var actionButtone=[];
            var that=this;
            var deleteMessageButton=new dijit.form.Button({
                label: "<i class='icon-edit'></i> 更新",
                onClick: function(){
                    that._updateNewSelectedTags(tagSelector.getSelectedSearchCategory());
                }
            });
            actionButtone.push(deleteMessageButton);
            var	dialog = new Dialog({
                style:"width:550px;height:460px;",
                title: "<span style='font-size: 0.7em;'><i class='icon-edit'></i> 编辑知识分类标签</span>",
                buttons:actionButtone,
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            if(this.dialogCloseCallBack){
                var closeDialogCallBack=function(){
                    that.dialogCloseCallBack(that.attachedTags);
                };
                dojo.connect(dialog,"hide",closeDialogCallBack);
            }
            dojo.place(tagSelector.containerNode, dialog.containerNode);
            dialog.show();
        },
        _updateNewSelectedTags:function(selectedTags){
            var that=this;
            var messageTxt="请确认是否更新知识分类标签 ?";
            var confirmButtonAction=function(){
                if(that.updateSelectedTagOverWriteFunc){
                    that.updateSelectedTagOverWriteFunc(selectedTags);
                    return;
                }
                UI.showProgressDialog("更新知识分类标签");
                if(that.isCollectionTags){
                    var projectInfoObj={};
                    projectInfoObj.projectId=that.knowledgeContentInfo.projectId;
                    projectInfoObj.projectName=that.knowledgeContentInfo.projectName;
                    projectInfoObj.projectCreatedBy=that.knowledgeContentInfo.projectCreatedBy;
                    projectInfoObj.projectCreatedTime=that.knowledgeContentInfo.projectCreatedTime;
                    projectInfoObj.projectLastModifiedBy=that.knowledgeContentInfo.projectLastModifiedBy;
                    projectInfoObj.projectLastModifiedTime=that.knowledgeContentInfo.projectLastModifiedTime;
                    projectInfoObj.projectComment=that.knowledgeContentInfo.projectComment;
                    projectInfoObj.projectTags=selectedTags;
                    var setNewTagObjectContent=dojo.toJson(projectInfoObj);
                    var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"updateProject/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        var timer = new dojox.timing.Timer(300);
                        timer.onTick = function(){
                            UI.hideProgressDialog();
                            that.attachedTags=selectedTags;
                            that.knowledgeContentInfo.projectTags=selectedTags;
                            UI.showToasterMessage({type:"success",message:"更新知识分类标签成功"});
                            timer.stop();
                        };
                        timer.start();
                        if(that.callback){
                            that.callback(selectedTags);
                        }
                    };
                    Application.WebServiceUtil.postJSONData(resturl,setNewTagObjectContent,loadCallback,errorCallback);
                }else{
                    var setNewTagObj={};
                    setNewTagObj.operationType="SetTags";
                    setNewTagObj.contentLocation=that.knowledgeContentInfo.contentLocation;
                    setNewTagObj.tags=selectedTags;
                    var setNewTagObjectContent=dojo.toJson(setNewTagObj);
                    var resturl=KNOWLEDGE_OPERATION_SERVICE_ROOT+"updateKnowledgeContentTags/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(data){
                        var timer = new dojox.timing.Timer(300);
                        timer.onTick = function(){
                            UI.hideProgressDialog();
                            that.attachedTags=data.contentTags;
                            UI.showToasterMessage({type:"success",message:"更新知识分类标签成功"});
                            timer.stop();
                            //sync description update to backend knowledge search engine.
                            KnowledgeBaseDataHandleUtil.syncKnowledgeItemInfoWithSearchEngine(data);
                        };
                        timer.start();
                    };
                    Application.WebServiceUtil.postJSONData(resturl,setNewTagObjectContent,loadCallback,errorCallback);
                }
            };
            var cancelButtonAction=function(){};
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-edit'></i> 确认更新",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        renderSheetMode:function(){
            dojo.style(this.attachedTagDisplayContainer,"display","none");
            dojo.style(this.attachedTagSheetContainer,"display","");
            this.sheetModeSwitch.set("disabled","disabled");
            this.tagModeSwitch.set("disabled",false);
        },
        renderTagMode:function(){
            dojo.style(this.attachedTagDisplayContainer,"display","");
            dojo.style(this.attachedTagSheetContainer,"display","none");
            this.sheetModeSwitch.set("disabled",false);
            this.tagModeSwitch.set("disabled","disabled");
        },
        destroy:function(){
            dojo.forEach(this.attachedCategoryTagList,function(tagWidget){
                tagWidget.destroy();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});