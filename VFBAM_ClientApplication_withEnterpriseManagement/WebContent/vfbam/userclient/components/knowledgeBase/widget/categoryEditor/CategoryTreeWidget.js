require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/CategoryTreeWidget.html","dojo/store/Memory",
    "dijit/tree/ObjectStoreModel","dojo/query!css2","dijit/Menu", "dijit/MenuItem"
],function(lang,declare, _Widget, _Templated, template,Memory,ObjectStoreModel){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryTreeWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categoryTreeMetaData:null,
        categoryDataTree:null,
        categoryDataStore:null,
        rootCategoryNodeId:null,
        postCreate: function(){
            this.categoryTreeMetaData={};
            this.categoryTreeMetaData["identifier"]="categoryId";
            this.categoryTreeMetaData["label"]="categoryDisplayName_cn";
            this.categoryTreeMetaData["items"]=[];
            this.rootCategoryNodeId= "/CATEGORY_BASE_METADATA_ROOT";
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
                    var myModel = new ObjectStoreModel({
                        store: that.categoryDataStore,
                        query: {id: that.rootCategoryNodeId}
                    });
                    that.categoryDataTree=new dijit.Tree({
                        model: myModel,
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
                        label: "space holder menu"
                    }));

                    dojo.connect(that.categoryDataTree, "onClick",that.categoryDataTree, function(item,nodeWidget,e){
                        //console.log("is expandable?: ", nodeWidget.isExpandable, e.target);
                        if( nodeWidget.isExpandable ) {
                            this._onExpandoClick({node:nodeWidget});
                        }
                        var selectedCategoryData=item;
                        //console.log("item : ", selectedCategoryData);
                        Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_CATEGORYSELECTED_EVENT,{category:selectedCategoryData});
                    });
                    dojo.connect(menu, "_openMyself", this, function(e) {
                        var tn = dijit.getEnclosingWidget(e.target);
                        // prepare the menu
                        dojo.forEach(menu.getChildren(), function(child){
                            menu.removeChild(child);
                            menu.addChild(new dijit.MenuItem({
                                label:" <i class='icon-list'></i> 添加子知识分类",
                                onClick:function(){
                                    var selectedCategoryData=that.categoryDataTree.selectedItem;
                                    //console.log("item : ", selectedCategoryData);
                                    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_ADDNEWCATEGORY_EVENT,{parentCategory:selectedCategoryData});
                                }
                            }));
                        }, this);
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
                    comment:comment
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
            this.categoryDataStore.put(modifiedCategory);
        },
        _endOfCode: function(){}
    });
});