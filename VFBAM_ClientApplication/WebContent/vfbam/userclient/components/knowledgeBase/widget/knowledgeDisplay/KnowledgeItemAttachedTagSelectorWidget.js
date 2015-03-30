require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeDisplay/template/KnowledgeItemAttachedTagSelectorWidget.html",
    "dojo/aspect", "idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,aspect,Dialog){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeItemAttachedTagSelectorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentSearchCategoryMap:null,
        savedCategoriesSearchItemMap:null,
        categoryDataStore:null,
        rootCategoryNodeId:null,
        categorySelector:null,
        categoryTagFilter:null,
        postCreate: function(){
            this.rootCategoryNodeId= "/CATEGORY_BASE_METADATA_ROOT";
            this.currentSearchCategoryMap={};
            this.savedCategoriesSearchItemMap={};
            this._loadKnowledgeCategoryInheritDataStore();
            this.categoryTagFilter=new dijit.form.FilteringSelect({
                style:"width:130px;",
                invalidMessage:"没有符合该拼音缩写的分类标签",
                autoComplete:true,
                required:false
            },this.categoryTagFilterContainer);
            var that=this;
            var signal = aspect.after(this.categoryTagFilter, "openDropDown", function() {
                that.categoryTagFilter.dropDown.on("click", dojo.hitch(that,that.selectCategoryTagValue));
                //that.categoryTagFilter.dropDown.on("close", dojo.hitch(that,that.selectCategoryTagValue));
                signal.remove();
            });
            this._loadCategorySelectorFilterDataStore();
            this.addInitSearchCategories();
        },
        showCategorySelector: function(){
            if(!this.categorySelector){
                this.categorySelector=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategorySelectorWidget({advancedSearchWidget:this,selectedTags:this.getSelectedSearchCategory()});
            }else{
                this.categorySelector.checkSelectedCategorys(this.getSelectedSearchCategory());
            }
            var that=this;
            var actionButtone=[];
            var confirmSelectFromCheckboxButton=new dijit.form.Button({
                label: "<i class='icon-ok-sign'></i> 确定选择",
                onClick: function(){
                    that._doClearSelectedCategories();
                    var selectedTags=that.categorySelector.getSelectedTags();
                    if(selectedTags&&selectedTags.length>0){
                        dojo.forEach(selectedTags,function(currentItem){
                            var currentTagObject=that.categoryDataStore.get(currentItem);
                            that.addSearchCategory(currentTagObject);
                        },that);
                    }
                    dialog.hide();
                }
            });
            actionButtone.push(confirmSelectFromCheckboxButton);

            var	dialog = new Dialog({
                style:"width:320px;height:610px;",
                title: "<span style='font-size: 0.7em;'><i class='icon-th-list'></i> 选择分类 </span>",
                buttons:actionButtone,
                content: "",
                //class:'nonModal',
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            dojo.place(this.categorySelector.containerNode, dialog.containerNode);
            dialog.show();
        },
        addInitSearchCategories:function(){
            if(this.attachedTags&&this.attachedTags.length>0){
                dojo.forEach(this.attachedTags,function(currentItem){
                    var currentTagObject=this.categoryDataStore.get(currentItem);
                    this.addSearchCategory(currentTagObject);
                },this);
            }
        },
        addSearchCategory:function(newCategory){
            var displayNameInheritArray=[];
            KnowledgeBaseDataHandleUtil.getCategoryDisplayNameInherit(newCategory,displayNameInheritArray,this.categoryDataStore);
            var categoryId=newCategory.id;
            if(this.currentSearchCategoryMap[categoryId]){
                UI.showToasterMessage({type:"warn",message:"该分类已经选择"});
                return;
            }
            //need remove tags in inherit tree of this one
            var currentCategoryId=newCategory.id;
            for(var p in this.currentSearchCategoryMap){
                if(typeof(this.currentSearchCategoryMap[p])=="function"){
                }else{
                    if(currentCategoryId.indexOf(p)>=0){
                        //this tag is a child tag of a parent tag, so need remove the parent one
                        this.removeSearchCategory(p);
                    }
                    if(p.indexOf(currentCategoryId)>=0){
                        //this tag is parent of a child, so need remove the child one
                        this.removeSearchCategory(p);
                    }
                }
            }
            var newSelectedCategoryTag=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SelectedCategoryTagWidget({categoryData:newCategory,categoryTagNameArray:displayNameInheritArray.reverse(),advancedSearchWidget:this});
            this.selectedTagContainer.appendChild(newSelectedCategoryTag.domNode);
            var currentSelectedCategoryMetaData={};
            currentSelectedCategoryMetaData["categoryData"]=newCategory;
            currentSelectedCategoryMetaData["categoryTag"]=newSelectedCategoryTag;
            this.currentSearchCategoryMap[categoryId]=currentSelectedCategoryMetaData;
        },
        getSelectedSearchCategory: function(){
            var selectedTagIdArray=[];
            for(var p in this.currentSearchCategoryMap){
                if(typeof(this.currentSearchCategoryMap[p])=="function"){
                }else{
                    selectedTagIdArray.push(p);
                }
            }
            return selectedTagIdArray;
        },
        removeSearchCategory:function(categoryId){
            if(this.currentSearchCategoryMap[categoryId]){
                this.currentSearchCategoryMap[categoryId]["categoryTag"].destroy();
                delete this.currentSearchCategoryMap[categoryId];
            }else{
                return;
            }
        },
        clearSelectedCategories:function(){
            var that=this;
            var messageTxt="请确认是否清除所有已经选择的标签分类 ?";
            var confirmButtonAction=function(){
                that._doClearSelectedCategories();
            };
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-eraser'></i> 确认清除",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        _doClearSelectedCategories:function(){
            for(var p in this.currentSearchCategoryMap){
                if(typeof(this.currentSearchCategoryMap[p])=="function"){
                }else{
                    this.currentSearchCategoryMap[p]["categoryTag"].destroy();
                    delete this.currentSearchCategoryMap[p];
                }
            }
        },
        setCategoryDataStore:function(categoryDataStore){
            this.categoryDataStore=categoryDataStore;
        },
        _loadKnowledgeCategoryInheritDataStore:function(){
            var that=this;
            var callBack=function(storeData){
                that.categoryDataStore=storeData;
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
        _loadCategorySelectorFilterDataStore:function(){
            var that=this;
            var callBack=function(storeData){
                that.categoryTagFilter.set("store",storeData);
                that.categoryTagFilter.set("searchAttr","searchKey");
                that.categoryTagFilter.set("labelAttr","displayLabel");
                that.categoryTagFilter.set("labelType","html");
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategorySelectorFilterDataStore(this.categoryDataStore,callBack);
        },
        selectCategoryTagValue:function(){
            var that=this;
            var timer = new dojox.timing.Timer(200);
            timer.onTick = function(){
                var selectedCategoryValue=that.categoryTagFilter.item;
                if(selectedCategoryValue){
                    var categoryData=that.categoryDataStore.get(selectedCategoryValue.categoryId);
                    that.addSearchCategory(categoryData);
                }
                that.categoryTagFilter.set("value","");
                timer.stop();
            };
            timer.start();
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});