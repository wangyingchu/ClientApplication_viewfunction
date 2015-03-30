require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/CategoryItemSelectorWidget.html","dojo/store/Memory",
    "dijit/tree/ObjectStoreModel","cbtree/Tree","cbtree/store/Memory","cbtree/model/TreeStoreModel","dojo/_base/connect",
    "dojo/query!css2","dijit/Menu", "dijit/MenuItem","dojo/store/Observable","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Memory,ObjectStoreModel,cbTree,cbMemory,cbStoreModel,connect){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategoryItemCheckboxSelectorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categoryTreeMetaData:null,
        categoryDataTree:null,
        treeObjectStoreModel:null,
        categoryDataStore:null,
        rootCategoryNodeId:null,
        categoryDataStore:null,
        treeObjectStoreModel:null,
        categoryDataTree:null,
        postCreate: function(){
            this.categoryTreeMetaData={};
            this.categoryTreeMetaData["identifier"]="categoryId";
            this.categoryTreeMetaData["label"]="categoryDisplayName_cn";
            this.categoryTreeMetaData["items"]=[];
            this.rootCategoryNodeId= "/CATEGORY_BASE_METADATA_ROOT";
            this.loadCategoryTree();
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
                    that.categoryDataStore=new cbMemory({
                        data:treeData,
                        getChildren: function(object){
                            return this.query({parent: object.id});
                        }
                    });
                    that.treeObjectStoreModel=new cbStoreModel({
                        store:that.categoryDataStore,
                        query: {id: that.rootCategoryNodeId}
                    });
                    that.categoryDataTree = new cbTree( {
                        model: that.treeObjectStoreModel,
                        getIconClass: function(/*dojo.store.Item*/ item, /*Boolean*/ opened){
                            //return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
                            //return "dijitIconTask";
                            return "NON_EXIST";
                        },
                        nodeIcons: false,
                        showRoot:false
                    },that.dataTreeContainer);
                    //connect.connect( tree, "onCheckBoxClick", model, checkBoxClicked );
                    that.categoryDataTree.startup();
                    that.categoryDataTree.expandAll();
                    var timer = new dojox.timing.Timer(1000);
                    timer.onTick = function(){
                        var rootNode=that.categoryDataTree.rootNode;
                        //rootNode.expand();
                        var firstLevelTreeNodes= rootNode.getChildren();
                        dojo.forEach(firstLevelTreeNodes,function(firstLevelTreeNode){
                            firstLevelTreeNode.expand();
                            var secondLevelTreeNodes=firstLevelTreeNode.getChildren();
                            dojo.forEach(secondLevelTreeNodes,function(secondLevelTreeNode){
                                try{
                                    secondLevelTreeNode.collapse();
                                }catch(e){
                                    console.log(e);
                                }
                            });
                        });
                        if(that.selectedTags){
                            that.checkCategorys(that.selectedTags);
                        }
                        timer.stop();
                    };
                    timer.start();
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
        checkCategorys:function(categoryIdArray){
            var that=this;
            //uncheck all node
            that.categoryDataStore.query(function(currentNode){
                that.treeObjectStoreModel.setChecked(currentNode,false);
            });
            //check selected node
            dojo.forEach(categoryIdArray,function(currentCategoryId){
                var currentCategoryNode=that.categoryDataStore.get(currentCategoryId);
                if(currentCategoryNode){
                    that.treeObjectStoreModel.setChecked(currentCategoryNode,true);
                }
            });
        },
        getSelectedCategories:function(){
            var rootNode=this.categoryDataTree.rootNode;
            var selectedCatrgoriesArray=[];
            this._getSelectedCategoryIDs(rootNode,selectedCatrgoriesArray);
            return selectedCatrgoriesArray;
        },
        _getSelectedCategoryIDs:function(treeNode,categoryIdArray){
            var item=treeNode.item;
            var isChecked=this.treeObjectStoreModel.getChecked(item);
            if(isChecked===undefined||isChecked===false||isChecked=="mixed"){
                console.log("this node is not checked");
                var childTreeNodeArray=treeNode.getChildren();
                dojo.forEach(childTreeNodeArray,function(childTreeNode){
                    this._getSelectedCategoryIDs(childTreeNode,categoryIdArray);
                },this);
            }else{
                if(isChecked){
                    categoryIdArray.push(item.id);
                }
            }
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});