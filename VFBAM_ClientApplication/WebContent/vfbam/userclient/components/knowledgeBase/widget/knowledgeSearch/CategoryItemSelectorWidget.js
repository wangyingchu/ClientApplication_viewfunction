require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/CategoryItemSelectorWidget.html","dojo/store/Memory",
    "dijit/tree/ObjectStoreModel","dojo/query!css2","dijit/Menu", "dijit/MenuItem","dojo/store/Observable","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Memory,ObjectStoreModel){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategoryItemSelectorWidget", [_Widget, _Templated], {
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
                        onDblClick:function(item, node, evt){
                            that.selecteCurrentCategory(item);
                        },
                        showRoot:false
                    },that.dataTreeContainer);

                    var menu = new dijit.Menu();
                    menu.bindDomNode(that.categoryDataTree.domNode);
                    menu.addChild(new dijit.MenuItem({
                        label: "<i class='icon-ok'></i> 选择当前分类",
                        onClick:function(){
                            var selectedCategoryData=that.categoryDataTree.selectedItem;
                            that.selecteCurrentCategory(selectedCategoryData);
                        }
                    }));
                    menu.addChild(new dijit.MenuItem({
                        label: "<i class='icon-info'></i> &nbsp;&nbsp;显示当前分类信息",
                        onClick:function(){
                            var selectedCategoryData=that.categoryDataTree.selectedItem;
                            that.showCurrentCategoryInfo(selectedCategoryData);
                        }
                    }));
                    dojo.connect(that.categoryDataTree, "onClick",that.categoryDataTree, function(item,nodeWidget,e){
                        if( nodeWidget.isExpandable ) {
                            this._onExpandoClick({node:nodeWidget});
                        }
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
        selecteCurrentCategory:function(categoryData){
            this.advancedSearchWidget.addSearchCategory(categoryData);
        },
        showCurrentCategoryInfo:function(categoryData){
            var categoryItem=categoryData;
            var catelogyInfoShower=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategoryItemInfoWidget({
                categoryData:categoryItem
            });
            this.addNewCategoryDialog = new idx.oneui.Dialog({
                title: "<i class='icon-info'></i> 知识分类详细信息",
                content: "",
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(catelogyInfoShower.containerNode, this.addNewCategoryDialog.containerNode);
            this.addNewCategoryDialog.connect(catelogyInfoShower, "doCloseContainerDialog", "hide");
            this.addNewCategoryDialog.show();
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});