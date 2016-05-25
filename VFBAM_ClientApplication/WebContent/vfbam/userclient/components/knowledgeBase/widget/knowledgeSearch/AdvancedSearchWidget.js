require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/AdvancedSearchWidget.html",
    "idx/oneui/Dialog","dojo/dom-class","dojo/aspect"
],function(lang,declare, _Widget, _Templated, template,Dialog,domClass,aspect){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.AdvancedSearchWidget", [_Widget, _Templated], {
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
            this.renderSavedCategorySearchItems();
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
        executeCategoriesSearch:function(){
            var categoryForSearchArray=[];
            var selectedCategories="";
            for(var p in this.currentSearchCategoryMap){
                if(typeof(this.currentSearchCategoryMap[p])=="function"){
                }else{
                    selectedCategories=selectedCategories+ " "+ this.currentSearchCategoryMap[p]["categoryData"]["categoryDisplayName_cn"];
                    categoryForSearchArray.push(this.currentSearchCategoryMap[p]["categoryData"]);
                }
            }
            if(categoryForSearchArray.length==0){
                UI.showToasterMessage({type:"warn",message:"请选择至少一个标签分类"});
            }else{
                var searchTitle="自选标签搜索 ("+selectedCategories+" )";
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                    KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_ALL,
                    KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                    KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_TAGSEARCH,
                    KNOWLEDGE_VIEW_DATA:{
                        DISPLAY_TITLE:searchTitle,
                        VIEW_METADATA:{
                            selectedCategories:categoryForSearchArray
                        },
                        VIEW_PAGEDATA:{
                            PAGING:true,
                            PAGE_SIZE:50,
                            CURRENT_PAGE_NUMBER:1
                        }
                    }
                });
            }
        },
        executeSavedCategoriesSearch:function(savedSearchName,selectedCategories){
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_ALL,
                KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_SAVEDSEARCH,
                KNOWLEDGE_VIEW_DATA:{
                    DISPLAY_TITLE:savedSearchName,
                    VIEW_METADATA:{
                        selectedCategories:selectedCategories
                    },
                    VIEW_PAGEDATA:{
                        PAGING:true,
                        PAGE_SIZE:50,
                        CURRENT_PAGE_NUMBER:1
                    }
                }
            });
        },
        saveSelectedCategories:function(){
            var categoryForSearchArray=[];
            for(var p in this.currentSearchCategoryMap){
                if(typeof(this.currentSearchCategoryMap[p])=="function"){
                }else{
                    categoryForSearchArray.push(this.currentSearchCategoryMap[p]["categoryData"]);
                }
            }
            if(categoryForSearchArray.length==0){
                UI.showToasterMessage({type:"warn",message:"请选择至少一个标签分类"});
            }else{
                var catelogyInfoShower=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SaveSelectedCategoriesWidget({
                    selectedCategoryArray:categoryForSearchArray,
                    advancedSearchWidget:this
                });
                this.addNewCategoryDialog = new idx.oneui.Dialog({
                    title: "<i class='icon-save'></i> 保存自定义搜索条件",
                    content: ""
                });
                dojo.place(catelogyInfoShower.containerNode, this.addNewCategoryDialog.containerNode);
                this.addNewCategoryDialog.connect(catelogyInfoShower, "doCloseContainerDialog", "hide");
                this.addNewCategoryDialog.show();
            }
        },
        renderSavedCategorySearchItems:function(){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var that=this;
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"getUserSavedCategoryTagsSelections/"+userId+"/"+KNOWLEDGEBASE_ORGANIZATION_ID+"/";
            var syncFlag=true;
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var isOddFlag=true;
            var loadCallback=function(returnData){
                dojo.forEach(returnData,function(savedSearchItem){
                    var searchItemMetaData={};
                    searchItemMetaData.searchName=savedSearchItem.searchTitle;
                    searchItemMetaData.searchDesc=savedSearchItem.searchDescription;
                    searchItemMetaData.selectedCategories=savedSearchItem.selectedTags;
                    var savedCategorySearchItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SavedCategorySearchItemWidget({searchItemMetaData:searchItemMetaData,advancedSearchWidget:that});
                    that.customizedSearchContainer.appendChild(savedCategorySearchItem.domNode);
                    if(isOddFlag){
                        domClass.add(savedCategorySearchItem.domNode, "app_magazineView_item_odd");
                    }else{
                        domClass.add(savedCategorySearchItem.domNode, "app_magazineView_item_even");
                    }
                    isOddFlag=!isOddFlag;
                    that.savedCategoriesSearchItemMap[searchItemMetaData.searchName]={};
                    that.savedCategoriesSearchItemMap[searchItemMetaData.searchName]["searchData"]=searchItemMetaData;
                    that.savedCategoriesSearchItemMap[searchItemMetaData.searchName]["searchItem"]=savedCategorySearchItem;
                });
            };
            Application.WebServiceUtil.getJSONData(resturl,syncFlag,null,loadCallback,errorCallback);
        },
        saveNewCategoriesSearchItem:function(searchItemMetaData){
            var selectedTags=[];
            var selectedCategories=searchItemMetaData.selectedCategories;
            dojo.forEach(selectedCategories,function(categoryItem){
                selectedTags.push(categoryItem.categoryId);
            });
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var userCategorySelectionObj={};
            userCategorySelectionObj.userId=userId;
            userCategorySelectionObj.searchTitle=searchItemMetaData.searchName;
            userCategorySelectionObj.searchDescription=searchItemMetaData.searchDesc;
            userCategorySelectionObj.selectedTags=selectedTags;
            userCategorySelectionObj.organizationId=KNOWLEDGEBASE_ORGANIZATION_ID;
            var savedCategorySearchItemMeteData={};
            savedCategorySearchItemMeteData.searchName=searchItemMetaData.searchName;
            savedCategorySearchItemMeteData.searchDesc=searchItemMetaData.searchDesc;
            savedCategorySearchItemMeteData.selectedCategories=selectedTags;
            var that=this;
            var userCategorySelectionObjContent=dojo.toJson(userCategorySelectionObj);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"saveUserSavedCategoryTagsSelection/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                if(data.operationResult){
                    UI.showToasterMessage({type:"success",message:"保存自定义搜索条件成功"});
                    var savedCategorySearchItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SavedCategorySearchItemWidget({searchItemMetaData:savedCategorySearchItemMeteData,advancedSearchWidget:that});
                    that.customizedSearchContainer.appendChild(savedCategorySearchItem.domNode);
                    domClass.add(savedCategorySearchItem.domNode, "app_magazineView_item_odd");
                    that.savedCategoriesSearchItemMap[searchItemMetaData.searchName]={};
                    that.savedCategoriesSearchItemMap[searchItemMetaData.searchName]["searchData"]=searchItemMetaData;
                    that.savedCategoriesSearchItemMap[searchItemMetaData.searchName]["searchItem"]=savedCategorySearchItem;
                    that._doClearSelectedCategories();
                    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_ADDSAVEDSEARCH_EVENT,{
                        searchItemMetaData:savedCategorySearchItemMeteData
                    });
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,userCategorySelectionObjContent,loadCallback,errorCallback);
        },
        checkNewCategoriesSearchItemName:function(searchName){
            var checkResult=true;
            for(var p in this.savedCategoriesSearchItemMap){
                if(typeof(this.savedCategoriesSearchItemMap[p])=="function"){
                }else{
                    if(p==searchName){
                        checkResult= false;
                    }
                }
            }
            return checkResult;
        },
        deleteCategoriesSearchItem:function(searchItemName){
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var userCategorySelectionObj={};
            userCategorySelectionObj.userId=userId;
            userCategorySelectionObj.searchTitle=searchItemName;
            userCategorySelectionObj.organizationId=KNOWLEDGEBASE_ORGANIZATION_ID;
            var that=this;
            var userCategorySelectionObjContent=dojo.toJson(userCategorySelectionObj);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"deleteUserSavedCategoryTagsSelection/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                if(data.operationResult){
                    UI.showToasterMessage({type:"success",message:"删除自定义搜索条件成功"});
                    that.savedCategoriesSearchItemMap[searchItemName]["searchItem"].destroy();
                    delete that.savedCategoriesSearchItemMap[searchItemName];
                    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_DELETESAVEDSEARCH_EVENT,{
                        searchItemName:searchItemName
                    });
                }
            };
            Application.WebServiceUtil.postJSONData(resturl,userCategorySelectionObjContent,loadCallback,errorCallback);
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
        showSavedCategorySearchInfo:function(searchItemMetaData){
            var savedCategorySearchInfo=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SavedCategorySearchInfoWidget({searchItemMetaData:searchItemMetaData});
            var tagMetaDataArrays=searchItemMetaData.selectedCategories;
            dojo.forEach(tagMetaDataArrays,function(categoryId){
                var displayNameInheritArray=[];
                KnowledgeBaseDataHandleUtil.getCategoryDisplayNameInheritById(categoryId,displayNameInheritArray,this.categoryDataStore);
                var categoryData=this.categoryDataStore.get(categoryId);
                var selectedCategoryTag=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SelectedCategoryTagWidget({categoryData:categoryData,categoryTagNameArray:displayNameInheritArray.reverse(),advancedSearchWidget:this,readonly:true});
                savedCategorySearchInfo.addCategoryTag(selectedCategoryTag);
            },this);
            var	dialog = new Dialog({
                style:"width:450px;height:470px;",
                title: "<i class='icon-info'></i> 自定义搜索条件信息 ",
                content: "",
                //class:'nonModal',
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(savedCategorySearchInfo.containerNode, dialog.containerNode);
            dialog.show();
        },
        closeCategoriesSearchDialog:function(){
            //ADVANCEDSEARCH_EDITOR_POPUP_DIALOG is defined in KnowledgeBase.js
            dijit.popup.close(ADVANCEDSEARCH_EDITOR_POPUP_DIALOG);
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
        _endOfCode: function(){}
    });
});