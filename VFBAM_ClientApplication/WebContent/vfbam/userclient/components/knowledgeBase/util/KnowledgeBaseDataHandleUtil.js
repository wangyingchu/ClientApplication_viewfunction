var KnowledgeBaseDataHandleUtil=(function(){
    //private members:
    var rootCategoryNodeId= "/CATEGORY_BASE_METADATA_ROOT_141215";
    var _buildDataTreeStructure=function(data){
        var  treeData=[];
        treeData.push(
            { id: rootCategoryNodeId, name:'知识分类'}
        );
        var that=this;
        dojo.forEach(data,function(categoryItem){
            _addCategoryLeaf(treeData,categoryItem,null);
        });
        return treeData;
    };
    var _buildPlantCategoryTagArray=function(categoryDataArray,categoryItem){
        var categoryTagInfoObj={};
        categoryTagInfoObj.name=categoryItem.categoryDisplayName_cn;
        categoryTagInfoObj.categoryId=categoryItem.categoryId;
        if(categoryItem.categoryPropertys){
            if(categoryItem.categoryPropertys.length>0){
                dojo.forEach(categoryItem.categoryPropertys,function(property){
                    if(property.propertyName=="ChineseSpellAbbreviation"){
                        categoryTagInfoObj.searchKey=property.propertyValue;
                    }
                });
            }
        }
        categoryDataArray.push(categoryTagInfoObj);
        if(categoryItem.subCategorys){
        dojo.forEach(categoryItem.subCategorys,function(currentCategoryItem){
            _buildPlantCategoryTagArray(categoryDataArray,currentCategoryItem);
        });
        }
    };
    var _addCategoryLeaf=function(treeDataArray,categoryItem,parentId){
        var id=categoryItem.categoryId;
        var name=categoryItem.categoryDisplayName_cn;
        var categoryId=categoryItem.categoryId;
        var categoryDisplayName_cn=categoryItem.categoryDisplayName_cn;
        var categoryDisplayName_en=categoryItem.categoryDisplayName_en;
        var childCategoryNumber=categoryItem.childCategoryNumber;
        var categoryNodeLocation=categoryItem.categoryNodeLocation;
        var parentCategoryNodeLocation=categoryItem.parentCategoryNodeLocation;
        var categoryPropertys=categoryItem.categoryPropertys;
        var subCategorys=categoryItem.subCategorys;
        var comment=categoryItem.comment;
        var categoryCode=categoryItem.categoryCode;
        var parent;
        if(parentId){
            parent=parentId;
        }else{
            parent=this.rootCategoryNodeId;
        }
        treeDataArray.push({
                id:id,
                name:name,
                parent:parent,
                categoryId:categoryId,
                categoryDisplayName_cn:categoryDisplayName_cn,
                categoryDisplayName_en:categoryDisplayName_en,
                childCategoryNumber:childCategoryNumber,
                categoryNodeLocation:categoryNodeLocation,
                parentCategoryNodeLocation:parentCategoryNodeLocation,
                categoryPropertys:categoryPropertys,
                subCategorys:subCategorys,
                comment:comment,
                categoryCode:categoryCode
            }
        );
        var that=this;
        if(subCategorys){
            dojo.forEach(subCategorys,function(categoryItem){
                _addCategoryLeaf(treeDataArray,categoryItem,categoryId);
            });
        }
    };
    var _KnowledgeCategoryInheritDataStoree=null;
    var _KnowledgeCategoryMetaData=null;
    //public members:
    return {
        generateKnowledgeCategoryInheritDataStore:function(callback){
            if(_KnowledgeCategoryInheritDataStoree){
                callback(_KnowledgeCategoryInheritDataStoree);
            }else{
                var that=this;
                var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"listCategories/";
                var syncFlag=true;
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(returnData){
                    if(returnData){
                        _KnowledgeCategoryMetaData=returnData;
                        var treeData=_buildDataTreeStructure(returnData);
                        var categoryDataStore = new dojo.store.Memory({
                            data:treeData,
                            getChildren: function(object){
                                return this.query({parent: object.id});
                            }
                        });
                        // Wrap the store in Observable so that updates to the store are reflected to the Tree
                        categoryDataStore = new dojo.store.Observable(categoryDataStore);
                        _KnowledgeCategoryInheritDataStoree=categoryDataStore;
                        callback(_KnowledgeCategoryInheritDataStoree);
                    }
                };
                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
            }
        },
        getCategoryDisplayNameInherit:function(categoryData,displayNameInheritArray,categoryDataStore){
            if(categoryData){
                if(categoryData.id!=rootCategoryNodeId){
                    var currentDisplayName=categoryData.categoryDisplayName_cn;
                    displayNameInheritArray.push(currentDisplayName);
                    var parentNodeId=categoryData.parent;
                    if(parentNodeId!=rootCategoryNodeId){
                        var parentCategory=categoryDataStore.get(parentNodeId);
                        this.getCategoryDisplayNameInherit(parentCategory,displayNameInheritArray,categoryDataStore);
                    }
                }
            }
        },
        getCategoryDisplayNameInheritById:function(categoryId,displayNameInheritArray,categoryDataStore){
            if(categoryId){
                var categoryData=categoryDataStore.get(categoryId);
                if(categoryData){
                    var currentDisplayName=categoryData.categoryDisplayName_cn;
                    displayNameInheritArray.push(currentDisplayName);
                    var parentNodeId=categoryData.parent;
                    if(parentNodeId!=rootCategoryNodeId){
                        this.getCategoryDisplayNameInheritById(parentNodeId,displayNameInheritArray,categoryDataStore);
                    }
                }
            }
        },
        generateKnowledgeCategorySelectorFilterDataStore:function(categoryDataStore,callback){
            var that=this;
            if(_KnowledgeCategoryMetaData){
                var categoryTagInfoArray=[];
                dojo.forEach(_KnowledgeCategoryMetaData,function(categoryItem){
                    _buildPlantCategoryTagArray(categoryTagInfoArray,categoryItem);
                });
                dojo.forEach(categoryTagInfoArray,function(categoryTagInfo){
                    var displayNameInheritArray=[];
                    that.getCategoryDisplayNameInheritById(categoryTagInfo.categoryId,displayNameInheritArray,categoryDataStore);
                    var realDisplayNameArray=displayNameInheritArray.reverse();
                    var realDisplayNameArrayArrayLength=realDisplayNameArray.length;
                    var displayLabel="";
                    dojo.forEach(realDisplayNameArray,function(currentName,idx){
                        if(idx<realDisplayNameArrayArrayLength-1){
                            displayLabel=displayLabel+'<span style="font-size: 0.8em;color: #555555;">'+currentName+'</span>';
                        }else{
                            displayLabel=displayLabel+'<span style="font-size: 0.9em;font-weight:bold;color: #555555;">'+currentName+'</span>';
                        }
                        if(idx<realDisplayNameArrayArrayLength-1){
                            displayLabel=displayLabel+'<i style="padding-left: 3px;padding-right: 3px;color: #BBBBBB;" class="icon-caret-right"></i>';
                        }
                    });
                    categoryTagInfo.displayLabel=displayLabel;
                });
                var selectorFilterDataStore = new dojo.store.Memory({
                    data:categoryTagInfoArray
                });
                callback(selectorFilterDataStore);
            }else{
                var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"listCategories/";
                var syncFlag=true;
                var errorCallback= function(data){
                    UI.showSystemErrorMessage(data);
                };
                var loadCallback=function(returnData){
                    if(returnData){
                        var categoryTagInfoArray=[];
                        dojo.forEach(returnData,function(categoryItem){
                            _buildPlantCategoryTagArray(categoryTagInfoArray,categoryItem);
                        });
                        dojo.forEach(categoryTagInfoArray,function(categoryTagInfo){
                            var displayNameInheritArray=[];
                            that.getCategoryDisplayNameInheritById(categoryTagInfo.categoryId,displayNameInheritArray,categoryDataStore);
                            var realDisplayNameArray=displayNameInheritArray.reverse();
                            var realDisplayNameArrayArrayLength=realDisplayNameArray.length;
                            var displayLabel="";
                            dojo.forEach(realDisplayNameArray,function(currentName,idx){
                                if(idx<realDisplayNameArrayArrayLength-1){
                                    displayLabel=displayLabel+'<span style="font-size: 0.8em;color: #555555;">'+currentName+'</span>';
                                }else{
                                    displayLabel=displayLabel+'<span style="font-size: 0.9em;font-weight:bold;color: #555555;">'+currentName+'</span>';
                                }
                                if(idx<realDisplayNameArrayArrayLength-1){
                                    displayLabel=displayLabel+'<i style="padding-left: 3px;padding-right: 3px;color: #BBBBBB;" class="icon-caret-right"></i>';
                                }
                            });
                            categoryTagInfo.displayLabel=displayLabel;
                        });
                        var selectorFilterDataStore = new dojo.store.Memory({
                            data:categoryTagInfoArray
                        });
                        callback(selectorFilterDataStore);
                    }
                };
                Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
            }
        },
        getDocumentMainType:function(knowledgeContent){
            var contentMimeType=knowledgeContent.contentMimeType;
            if((contentMimeType.indexOf("image/vnddwg")>=0)
                ||(contentMimeType.indexOf("image/x-dwg")>=0)||(contentMimeType.indexOf("application/acad")>=0)
                ||(contentMimeType.indexOf("image/vnd.dwg")>=0)){
                return "DWG 文档";
            }
            if((contentMimeType.indexOf("application/pdf")>=0)){
                return "PDF 文档";
            }
            if((contentMimeType.indexOf("image/jpeg")>=0)
                ||(contentMimeType.indexOf("image/pjpeg")>=0)){
                return "JPEG 图像";
            }
            if((contentMimeType.indexOf("application/vnd.ms-excel")>=0)
                ||(contentMimeType.indexOf("application/excel")>=0)||(contentMimeType.indexOf("application/vndms-excel")>=0)
                ||(contentMimeType.indexOf("application/x-excel")>=0)||(contentMimeType.indexOf("application/x-msexcel")>=0)
                ||(contentMimeType.indexOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")>=0)){
                return "MS Excel 文档";
            }
            if((contentMimeType.indexOf("application/mspowerpoint")>=0)
                ||(contentMimeType.indexOf("application/vndms-powerpoint")>=0)||(contentMimeType.indexOf("application/powerpoint")>=0)
                ||(contentMimeType.indexOf("application/x-mspowerpoint")>=0)||(contentMimeType.indexOf("application/vnd.ms-powerpoint")>=0)
                ||(contentMimeType.indexOf("application/vnd.openxmlformats-officedocument.presentationml.presentation")>=0)){
                return "MS PowerPoint 文档";
            }
            if((contentMimeType.indexOf("application/msword")>=0)
                ||(contentMimeType.indexOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document")>=0)){
                return "MS Word 文档";
            }
            if((contentMimeType.indexOf("application/vnd.oasis.opendocument.text")>=0)){
                return "OpenOffice ODT 文档";
            }
            if((contentMimeType.indexOf("application/vnd.oasis.opendocument.presentation")>=0)){
                return "OpenOffice ODP 文档";
            }
            if((contentMimeType.indexOf("application/vnd.oasis.opendocument.spreadsheet")>=0)){
                return "OpenOffice ODS 文档";
            }
            if((contentMimeType.indexOf("application/java-byte-code")>=0)
                ||(contentMimeType.indexOf("application/x-java-class")>=0)||(contentMimeType.indexOf("application/java")>=0)
                ||(contentMimeType.indexOf("application/x-java-applet")>=0)||(contentMimeType.indexOf("application/java-vm")>=0)){
                return "Java 文件";
            }
            //for common image file
            if((contentMimeType.indexOf("image")>=0)){
                if((contentMimeType.indexOf("image/vnd.adobe.photoshop")>=0)){
                    return "Photoshop 图像文件";
                }
                return "图像文件";
            }
            return contentMimeType;
        },
        shouldSwitchSummaryInfoDisplay:function(knowledgeContent){
            var contentMimeType=knowledgeContent.contentMimeType;
            if((contentMimeType.indexOf("image/vnddwg")>=0)
                ||(contentMimeType.indexOf("image/x-dwg")>=0)||(contentMimeType.indexOf("image/vnd.dwg")>=0)){
                return false;
            }
            if((contentMimeType.indexOf("image")>=0)){
                if((contentMimeType.indexOf("image/vnd.adobe.photoshop")>=0)){
                    return false;
                }
                return true;
            }else{
                return false;
            }
        },
        syncKnowledgeItemInfoWithSearchEngine:function(updatedDocument){
            var changedObjContent=dojo.toJson(updatedDocument);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"updateDocument/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
            };
            Application.WebServiceUtil.postJSONData(resturl,changedObjContent,loadCallback,errorCallback);
        },
        addNewKnowledgeItemInSearchEngine:function(newDocument){
            var changedObjContent=dojo.toJson(newDocument);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"createDocument/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
            };
            Application.WebServiceUtil.postJSONData(resturl,changedObjContent,loadCallback,errorCallback);
        },
        addNeCategoryTagInSearchEngine:function(newTagValue){
            var newTagsArray=[];
            newTagsArray.push(newTagValue);
            var changedObjContent=dojo.toJson(newTagsArray);
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"createTag/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
            };
            Application.WebServiceUtil.postJSONData(resturl,changedObjContent,loadCallback,errorCallback);
        }
    };
})();