require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/CategoryTreeWidget.html","dojo/store/Memory",
    "dijit/tree/ObjectStoreModel","dojo/query!css2","dijit/Menu", "dijit/MenuItem","dojo/store/Observable","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Memory,ObjectStoreModel){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryTreeWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categoryTreeMetaData:null,
        categoryDataTree:null,
        treeObjectStoreModel:null,
        categoryDataStore:null,
        rootCategoryNodeId:null,
        addNewCategoryDialog:null,
        postCreate: function(){
            this.categoryTreeMetaData={};
            this.categoryTreeMetaData["identifier"]="categoryId";
            this.categoryTreeMetaData["label"]="categoryDisplayName_cn";
            this.categoryTreeMetaData["items"]=[];
            this.rootCategoryNodeId= "/CATEGORY_BASE_METADATA_ROOT_141215";
            this.loadCategoryTree();
            this.categorySelectedListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_UPDATECATEGORYDATA_EVENT,dojo.hitch(this,this.updateCategoryInfo));
        },
        loadCategoryTree:function(){
            var that=this;
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"listCategories/";
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(returnData){
                if(returnData){
                    var treeData=that._buildDataTreeStructure(returnData);
                    that.categoryDataStore = new Memory({
                        data:treeData,
                        getChildren: function(object){
                            return this.query({parent: object.id});
                        }
                    });
                    // Wrap the store in Observable so that updates to the store are reflected to the Tree
                    that.categoryDataStore = new dojo.store.Observable(that.categoryDataStore);
                    that.treeObjectStoreModel = new ObjectStoreModel({
                        store: that.categoryDataStore,
                        query: {id: that.rootCategoryNodeId}
                    });
                    that.categoryDataTree=new dijit.Tree({
                        model: that.treeObjectStoreModel,
                        getIconClass: function(/*dojo.store.Item*/ item, /*Boolean*/ opened){
                            //return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
                            return "dijitIconTask";
                        },
                        onMouseDown:function(ev,node){
                            if(ev.button==2){ // right-click
                                var here=dijit.getEnclosingWidget(ev.target);
                                this.set('selectedNode',here);
                            }
                        },
                        showRoot:false
                    },that.dataTreeContainer);

                    var menu = new dijit.Menu();
                    menu.bindDomNode(that.categoryDataTree.domNode);
                    menu.addChild(new dijit.MenuItem({
                        label: "<i class='icon-list'></i> 添加子知识分类",
                        onClick:function(){
                            var selectedCategoryData=that.categoryDataTree.selectedItem;
                            that.renderAddCategoryDialog(selectedCategoryData);
                        }
                    }));
                    menu.addChild(new dijit.MenuItem({
                        label: "<i class='icon-remove'></i> 删除此知识分类",
                        onClick:function(){
                            var selectedCategoryData=that.categoryDataTree.selectedItem;
                            that.deleteCategory(selectedCategoryData);
                        }
                    }));
                    dojo.connect(that.categoryDataTree, "onClick",that.categoryDataTree, function(item,nodeWidget,e){
                        //console.log("is expandable?: ", nodeWidget.isExpandable, e.target);
                        if( nodeWidget.isExpandable ) {
                            this._onExpandoClick({node:nodeWidget});
                        }
                        var selectedCategoryData=item;
                        Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_CATEGORYSELECTED_EVENT,{category:selectedCategoryData});
                    });
                    menu.startup();
                    that.categoryDataTree.startup();
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        _buildDataTreeStructure:function(data){
            var  treeData=[];
            treeData.push(
                { id: this.rootCategoryNodeId, name:'知识分类'}
            );
            var that=this;
            dojo.forEach(data,function(categoryItem){
                that._addCategoryLeaf(treeData,categoryItem,null);
            });
            return treeData;
        },
        _addCategoryLeaf:function(treeDataArray,categoryItem,parentId){
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
                    that._addCategoryLeaf(treeDataArray,categoryItem,categoryId);
                });
            }
        },
        updateCategoryInfo:function(data){
            var categoryData=data.category;
            var modifiedCategory = this.categoryDataStore.get(categoryData.categoryId);
            modifiedCategory.name=categoryData.categoryDisplayName_cn;
            modifiedCategory.categoryId=categoryData.categoryId;
            modifiedCategory.categoryDisplayName_cn=categoryData.categoryDisplayName_cn;
            modifiedCategory.categoryDisplayName_en=categoryData.categoryDisplayName_en;
            modifiedCategory.childCategoryNumber=categoryData.childCategoryNumber;
            modifiedCategory.categoryNodeLocation=categoryData.categoryNodeLocation;
            modifiedCategory.parentCategoryNodeLocation=categoryData.parentCategoryNodeLocation;
            modifiedCategory.categoryPropertys=categoryData.categoryPropertys;
            modifiedCategory.subCategorys=categoryData.subCategorys;
            modifiedCategory.comment=categoryData.comment;
            modifiedCategory.categoryCode=categoryData.categoryCode;
            this.categoryDataStore.put(modifiedCategory);
        },
        renderAddCategoryDialog:function(parentCategoryInfo){
            var parentCategoryNodeLocation=parentCategoryInfo.categoryNodeLocation;
            var newCatelogyEditor=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.AddCategoryWidget({
                categoryTree:this,
                parentCategoryNodeLocation:parentCategoryNodeLocation,
                parentNodeId:parentCategoryInfo.id,
                showCloseButton:true
            });
            this.addNewCategoryDialog = new idx.oneui.Dialog({
                title: "<i class='icon-cog'></i> 添加知识分类",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            this.addNewCategoryDialog.connect(newCatelogyEditor, "doCloseContainerDialog", "hide");
            dojo.place(newCatelogyEditor.containerNode, this.addNewCategoryDialog.containerNode);
            this.addNewCategoryDialog.show();
        },
        addCategoryInfo:function(data,parentId){
            var categoryItem=data;
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
            this.categoryDataStore.put({
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
        },
        addCategory:function(newCategoryDataObj,parentNodeId){
            var that=this;
            var newFirstLevelCategoryDataObjContent=dojo.toJson(newCategoryDataObj);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"addCategory/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                UI.showToasterMessage({type:"success",message:"添加知识分类成功"});
                that.addNewCategoryDialog.hide();
                that.addCategoryInfo(data,parentNodeId);
                KnowledgeBaseDataHandleUtil.addNeCategoryTagInSearchEngine(data);
            };
            Application.WebServiceUtil.postJSONData(resturl,newFirstLevelCategoryDataObjContent,loadCallback,errorCallback);
        },
        deleteCategory:function(categoryData){
            var that=this;
            var subCategorys=categoryData.subCategorys;
            if(subCategorys&&subCategorys.length>0){
                UI.showToasterMessage({type:"error",message:"该知识分类下有子知识分类,无法执行删除操作"});
                return;
            }
            var currentCategoryId=categoryData.id;
            var resturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"checkTagIsReferenced/"+currentCategoryId+"/";
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(returnData){
                var isReferenced=returnData.isReferenced;
                if(isReferenced){
                    UI.showToasterMessage({type:"error",message:"已有知识素材关联到该知识分类,无法执行删除操作"});
                }else{
                    that._confirmDeleteCategoryAction(categoryData);
                }
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        _confirmDeleteCategoryAction:function(categoryData){
            var that=this;
            var messageTxt="请确认是否删除知识分类 <b>"+categoryData.name+"</b>? 确认删除后该分类将永久性的从系统中删除。 ";
            var confirmButtonAction=function(){
                that.doDeleteCategory(categoryData);
            };
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-trash'></i> 确认删除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        doDeleteCategory:function(categoryData){
            var categoryItem=categoryData;
            var id=categoryItem.categoryId;
            var deleteCategoryData={};
            deleteCategoryData.parentCategoryNodeLocation=categoryItem.parentCategoryNodeLocation;
            deleteCategoryData.categoryId=categoryItem.categoryId;
            var that=this;
            var deleteCategoryDataObjContent=dojo.toJson(deleteCategoryData);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"deleteCategory/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                if(data.operationResult){
                    UI.showToasterMessage({type:"success",message:"删除知识分类成功"});
                    that.categoryDataStore.remove(id);
                    var selectedCategoryData=that.categoryDataTree.selectedItem;
                    if(selectedCategoryData.id==id){
                        Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_RESETCATEGORYEDITOR_EVENT,{categoryData:categoryData});
                    }
                    var syncResturl=KNOWLEDGE_CONTENTSEARCH_ROOT+"deleteTag/"+id+"/";
                    var errorCallback= function(data){
                        UI.showSystemErrorMessage(data);
                    };
                    var loadCallback=function(returnData){
                    };
                    Application.WebServiceUtil.deleteJSONData(syncResturl,"",loadCallback,errorCallback);
                }
            };
            Application.WebServiceUtil.deleteJSONData(resturl,deleteCategoryDataObjContent,loadCallback,errorCallback);
        },destroy:function(){
            this.categorySelectedListenerHandler.calcelMessageListening();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});