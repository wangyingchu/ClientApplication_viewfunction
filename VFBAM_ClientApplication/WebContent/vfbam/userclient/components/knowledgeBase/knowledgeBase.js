//business logic
var APP_KNOWLEDGEBASE_CATEGORYSELECTED_EVENT="APP_KNOWLEDGEBASE_CATEGORYSELECTED_EVENT";
var APP_KNOWLEDGEBASE_UPDATECATEGORYDATA_EVENT="APP_KNOWLEDGEBASE_UPDATECATEGORYDATA_EVENT";
var APP_KNOWLEDGEBASE_RESETCATEGORYEDITOR_EVENT="APP_KNOWLEDGEBASE_RESETCATEGORYEDITOR_EVENT";
var APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT="APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT";
var APP_KNOWLEDGEBASE_RELOADKNOWLEDGECONTENT_EVENT="APP_KNOWLEDGEBASE_RELOADKNOWLEDGECONTENT_EVENT";
var APP_KNOWLEDGEBASE_ADDSAVEDSEARCH_EVENT="APP_KNOWLEDGEBASE_ADDSAVEDSEARCH_EVENT";
var APP_KNOWLEDGEBASE_DELETESAVEDSEARCH_EVENT="APP_KNOWLEDGEBASE_DELETESAVEDSEARCH_EVENT";
var APP_KNOWLEDGEBASE_UPDATECONTENTDISPLAYTITLE_EVENT="APP_KNOWLEDGEBASE_UPDATECONTENTDISPLAYTITLE_EVENT";
var APP_KNOWLEDGEBASE_UPDATECONTENTBELONGEDCOLLECTION_EVENT="APP_KNOWLEDGEBASE_UPDATECONTENTBELONGEDCOLLECTION_EVENT";
var APP_KNOWLEDGEBASE_UPDATECOLLECTIONKNOWLEDGECONTENT_EVENT="APP_KNOWLEDGEBASE_UPDATECOLLECTIONKNOWLEDGECONTENT_EVENT";
var APP_KNOWLEDGEBASE_UPDATEKNOWLEDGEDISPLAYPANELHEIGHT_EVENT="APP_KNOWLEDGEBASE_UPDATEKNOWLEDGEDISPLAYPANELHEIGHT_EVENT";
//knowledge render logic
var KNOWLEDGE_VIEW_TYPE="KNOWLEDGE_VIEW_TYPE";
var KNOWLEDGE_VIEW_TYPE_COLLECTION="COLLECTION";
var KNOWLEDGE_VIEW_TYPE_MATERIAL="MATERIAL";
var KNOWLEDGE_VIEW_TYPE_PEOPLE="PEOPLE";
var KNOWLEDGE_VIEW_TYPE_ALL="ALL";

var KNOWLEDGE_VIEW_MODE="KNOWLEDGE_VIEW_MODE";
var KNOWLEDGE_VIEW_MODE_SINGLE="SINGLE";
var KNOWLEDGE_VIEW_MODE_MULTIPLE="MULTIPLE";

var KNOWLEDGE_VIEW_CLASSIFY="KNOWLEDGE_VIEW_CLASSIFY";
var KNOWLEDGE_VIEW_CLASSIFY_NAVIGATION="NAVIGATION";
var KNOWLEDGE_VIEW_CLASSIFY_RECOMMENDED="RECOMMENDED";
var KNOWLEDGE_VIEW_CLASSIFY_POP="POP";
var KNOWLEDGE_VIEW_CLASSIFY_LATEST="LATEST";
var KNOWLEDGE_VIEW_CLASSIFY_ALL="ALL";
var KNOWLEDGE_VIEW_CLASSIFY_FAVORITE="FAVORITE";
var KNOWLEDGE_VIEW_CLASSIFY_SAVEDSEARCH="SAVEDSEARCH";
var KNOWLEDGE_VIEW_CLASSIFY_PEOPLE="PEOPLE";
var KNOWLEDGE_VIEW_CLASSIFY_COLLECTION="COLLECTION";
var KNOWLEDGE_VIEW_CLASSIFY_MATERIAL="MATERIAL";
var KNOWLEDGE_VIEW_CLASSIFY_KEYWORDSEARCH="KEYWORDSEARCH";
var KNOWLEDGE_VIEW_CLASSIFY_TAGSEARCH="TAGSEARCH";

var KNOWLEDGE_VIEW_DATA="KNOWLEDGE_VIEW_DATA";
var DISPLAY_TITLE="DISPLAY_TITLE";
var VIEW_METADATA="VIEW_METADATA";

var KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_DESCRIPTION="MATERIAL_DESCRIPTION";
var KNOWLEDGESEARCH_INPUTTYPE_COLLECTION_NAME="COLLECTION_NAME";
var KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_NAME="MATERIAL_NAME";
var KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_SEQUENCE="MATERIAL_SEQUENCE";
var KNOWLEDGESEARCH_INPUTTYPE_TAG_VALUE="TAG_VALUE";

//knowledge modification logic
var KNOWLEDGEMODIFICATION_PREVIEW_UPDATED_ITEM={};

//multi item search result logic
var KNOWLEDGESEARCH_CURRENT_MULTIITEMS_SEARCH_RESULT=null;
/*
var knowledgeNavigateItemInfo=[];
var item1={};
knowledgeNavigateItemInfo.push(item1);
item1.itemName="专业";
item1.options=[];
item1.options.push({
    optionName:"营销",
    optionDesc:""
});
item1.options.push({
    optionName:"运营",
    optionDesc:""
});
item1.options.push({
    optionName:"人事",
    optionDesc:""
});
item1.options.push({
    optionName:"建筑",
    optionDesc:""
});
item1.options.push({
    optionName:"结构",
    optionDesc:""
});
item1.options.push({
    optionName:"设备",
    optionDesc:""
});
item1.options.push({
    optionName:"机电",
    optionDesc:""
});
item1.options.push({
    optionName:"室内",
    optionDesc:""
});
item1.options.push({
    optionName:"景观",
    optionDesc:""
});

var item2={};
knowledgeNavigateItemInfo.push(item2);
item2.itemName="工作阶段";
item2.options=[];
item2.options.push({
    optionName:"概念设计",
    optionDesc:""
});
item2.options.push({
    optionName:"方案设计",
    optionDesc:""
});
item2.options.push({
    optionName:"初步设计",
    optionDesc:""
});
item2.options.push({
    optionName:"施工图设计",
    optionDesc:""
});

var item3={};
knowledgeNavigateItemInfo.push(item3);
item3.itemName="建筑功能类型";
item3.options=[];
item3.options.push({
    optionName:"住宅",
    optionDesc:""
});
item3.options.push({
    optionName:"酒店",
    optionDesc:""
});
item3.options.push({
    optionName:"办公楼",
    optionDesc:""
});

var item4={};
knowledgeNavigateItemInfo.push(item4);
item4.itemName="表达方式";
item4.options=[];
item4.options.push({
    optionName:"照片图片",
    optionDesc:""
});
item4.options.push({
    optionName:"CAD图纸",
    optionDesc:""
});
item4.options.push({
    optionName:"SKP模型",
    optionDesc:""
});
item4.options.push({
    optionName:"BIM模型",
    optionDesc:""
});
item4.options.push({
    optionName:"计算书与表格",
    optionDesc:""
});

var extrnalResourceItemInfo={}
extrnalResourceItemInfo.itemName="外部资源";
extrnalResourceItemInfo.resource=[];
extrnalResourceItemInfo.resource.push({
    resourceName:"企业内优秀工程图库",
    resourceDesc:"",
    resourceLink:""
});
extrnalResourceItemInfo.resource.push({
    resourceName:"项目合同库",
    resourceDesc:"",
    resourceLink:""
});
extrnalResourceItemInfo.resource.push({
    resourceName:"国家标准构造图库",
    resourceDesc:"",
    resourceLink:""
});
extrnalResourceItemInfo.resource.push({
    resourceName:"规范标准库",
    resourceDesc:"",
    resourceLink:""
});
extrnalResourceItemInfo.resource.push({
    resourceName:"相关专业性网站",
    resourceDesc:"",
    resourceLink:""
});

var knowledgeNavigationBarWidget=
    new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationBarWidget(
        {knowledgeNavigateItemInfo:knowledgeNavigateItemInfo,externalResourceItemInfo:extrnalResourceItemInfo},"app_knowledgeBase_knowledgeNavigationBar");
*/

var xxx=document.getElementById("app_knowledgeBase_mainContainer").offsetHeight;
console.log(xxx);
console.log(xxx);

var knowledgeNavigationBarWidget=
    new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuListWidget({},"app_knowledgeBase_knowledgeNavigationBar");

var resultDisplayZoneWidth = document.getElementById("app_knowledgeBase_resultDisplayZone").offsetWidth;
var knowledgeDisplayPanelWidget=
    new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.KnowledgeDisplayPanelWidget({resultDisplayZoneWidth:resultDisplayZoneWidth,knowledgeNavigationBarWidget:knowledgeNavigationBarWidget},"app_knowledgeBase_resultDisplayZone");

var searchInputTypeSelect_MenuCollection=new dijit.DropDownMenu({ style: "display: none;"});
var menuItem_materialDescription = new dijit.MenuItem({
    label: "<i class='icon-comment'></i>&nbsp;&nbsp;素材描述",
    onClick: function(){
        var labelValue='搜索素材描述 <i style="color: #00649d;" class="icon-caret-down icon-border icon-large"></i>';
        searchknowledgeInputTypeSelectDropDown.set("label",labelValue);
        knowledgeInputSearchType=KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_DESCRIPTION;
        searchknowledgeInputTypeInput.set("value","");
    }
});
searchInputTypeSelect_MenuCollection.addChild(menuItem_materialDescription);
var menuItem_materialName = new dijit.MenuItem({
    label: "<i class='icon-file-alt'></i>&nbsp;&nbsp;素材名称",
    onClick: function(){
        var labelValue='搜索素材名称 <i style="color: #00649d;" class="icon-caret-down icon-border icon-large"></i>';
        searchknowledgeInputTypeSelectDropDown.set("label",labelValue);
        knowledgeInputSearchType=KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_NAME;
        searchknowledgeInputTypeInput.set("value","");
    }
});
searchInputTypeSelect_MenuCollection.addChild(menuItem_materialName);
var menuItem_materialSequence = new dijit.MenuItem({
    label: "<i class='icon-sort-by-order'></i>&nbsp;&nbsp;素材序号",
    onClick: function(){
        var labelValue='搜索素材序号 <i style="color: #00649d;" class="icon-caret-down icon-border icon-large"></i>';
        searchknowledgeInputTypeSelectDropDown.set("label",labelValue);
        knowledgeInputSearchType=KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_SEQUENCE;
        searchknowledgeInputTypeInput.set("value","");
    }
});
searchInputTypeSelect_MenuCollection.addChild(menuItem_materialSequence);
var menuItem_tagValue = new dijit.MenuItem({
    label: "<i class='icon-pushpin'></i>&nbsp;&nbsp;标签分类",
    onClick: function(){
        var labelValue='搜索标签分类 <i style="color: #00649d;" class="icon-caret-down icon-border icon-large"></i>';
        searchknowledgeInputTypeSelectDropDown.set("label",labelValue);
        knowledgeInputSearchType=KNOWLEDGESEARCH_INPUTTYPE_TAG_VALUE;
        searchknowledgeInputTypeInput.set("value","");
    }
});
searchInputTypeSelect_MenuCollection.addChild(menuItem_tagValue);
var menuItem_projectName = new dijit.MenuItem({
    label: "<i class='icon-archive'></i>&nbsp;&nbsp;专辑名称",
    onClick: function(){
        var labelValue='搜索专辑名称 <i style="color: #00649d;" class="icon-caret-down icon-border icon-large"></i>';
        searchknowledgeInputTypeSelectDropDown.set("label",labelValue);
        knowledgeInputSearchType=KNOWLEDGESEARCH_INPUTTYPE_COLLECTION_NAME;
        searchknowledgeInputTypeInput.set("value","");
    }
});
searchInputTypeSelect_MenuCollection.addChild(menuItem_projectName);

//var searchknowledgeInputTypeSelectDropdownLabel='搜索素材序号 <i style="color: #00649d;" class="icon-caret-down icon-border icon-large"></i>';
//var knowledgeInputSearchType=KNOWLEDGESEARCH_INPUTTYPE_MATERIAL_SEQUENCE;
var searchknowledgeInputTypeSelectDropdownLabel='搜索专辑名称 <i style="color: #00649d;" class="icon-caret-down icon-border icon-large"></i>';
var knowledgeInputSearchType=KNOWLEDGESEARCH_INPUTTYPE_COLLECTION_NAME;
var searchknowledgeInputTypeSelectDropDown=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:searchknowledgeInputTypeSelectDropdownLabel,dropDown: searchInputTypeSelect_MenuCollection},"app_knowledgeBase_searchInputTypeSelect");
var searchknowledgeInputTypeInput=new dijit.form.TextBox({style:"width: 170px;"},"app_knowledgeBase_searchInputTypeInput");

var savedCategorySearchLinkList=new vfbam.userclient.components.knowledgeBase.widget.knowledgeDisplay.SavedCategorySearchLinkListWidget({},"app_knowledgeBase_savedCategorySearchListContainer");
var advancedSearchEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.AdvancedSearchWidget();
var ADVANCEDSEARCH_EDITOR_POPUP_DIALOG= new idx.widget.MenuDialog({
    id: 'app_knowledgeBase_advancedSearchEditorTooltipDialog',
    content: advancedSearchEditor
});
ADVANCEDSEARCH_EDITOR_POPUP_DIALOG.onShow = function() {
    dojo.style(ADVANCEDSEARCH_EDITOR_POPUP_DIALOG._popupWrapper,"zIndex",900);
};

function renderKnowledgeConfigDialog(){
    require(["idx/oneui/Dialog"], function(Dialog){
        var messageEditor=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryEditorWidget();
        var	dialog = new Dialog({
            style:"width:950px;height:710px;",
            title: "<span style='font-size: 0.7em;'><i class='icon-cog'></i> 知识分类管理</span>",
            content: "",
            closeButtonLabel: "<i class='icon-remove'></i> 关闭"
        });
        var closeDialogCallBack=function(){
            messageEditor.destroy();
        };
        dojo.connect(dialog,"hide",closeDialogCallBack);
        dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}

function renderKnowledgeAdvancedSearchDialog(){
    require(["idx/oneui/Dialog"], function(Dialog){
        var messageEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.AdvancedSearchWidget();
        var	dialog = new Dialog({
            style:"width:940px;height:515px;",
            title: "<i class='icon-cog'></i> 自定义搜索",
            content: "",
            closeButtonLabel: "<i class='icon-remove'></i> 关闭"
        });
        var closeDialogCallBack=function(){
            messageEditor.destroy();
        };
        dojo.connect(dialog,"hide",closeDialogCallBack);
        dojo.place(messageEditor.containerNode, dialog.containerNode);
        dialog.show();
        dialog._setStyleAttr('left:' + 300 + 'px !important;');
        dialog._setStyleAttr('top:' + 300 + 'px !important;');
    });
}

function showRecommendedCollection(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_RECOMMENDED,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"推荐的专辑",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:5,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function showPopCollection(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_POP,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"热门专辑",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:5,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function showLatestCollection(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_LATEST,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"最新专辑",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:5,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function showAllCollection(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_ALL,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"所有专辑",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:5,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function showFavoriteCollection(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_COLLECTION,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_FAVORITE,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"我收藏的专辑",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:5,
                CURRENT_PAGE_NUMBER:1

            }
        }
    });
}

function showRecommendedMaterial(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_RECOMMENDED,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"推荐的素材",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:50,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function showPopMaterial(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_POP,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"热门素材",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:50,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function showLatestMaterial(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_LATEST,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"最新素材",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:50,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function showAllMaterial(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_ALL,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"所有素材",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:50,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function showFavoriteMaterial(){
    Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
        KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_MATERIAL,
        KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
        KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_FAVORITE,
        KNOWLEDGE_VIEW_DATA:{
            DISPLAY_TITLE:"我收藏的素材",
            VIEW_METADATA:{},
            VIEW_PAGEDATA:{
                PAGING:true,
                PAGE_SIZE:50,
                CURRENT_PAGE_NUMBER:1
            }
        }
    });
}

function doKnowledgeInputValueSearch(){
    if(searchknowledgeInputTypeInput.get("value")==""){
        UI.showToasterMessage({type:"warn",message:"请输入搜索关键字"});
        return;
    }else{
        knowledgeDisplayPanelWidget.doKnowledgeInputValueSearch(knowledgeInputSearchType,searchknowledgeInputTypeInput.get("value"));
    }
}
var advancedSearchEditorPopupDisplayFlag=true;
function switchShowAdvancedSearchPopup(){
    require(["dijit/popup"], function(popup){
        if(advancedSearchEditorPopupDisplayFlag){
            popup.open({
                popup: ADVANCEDSEARCH_EDITOR_POPUP_DIALOG,
                orient: ["below", "below-centered"],
                padding :{x: 0, y: -100},
                around: "app_knowledgeBase_advanceSearchDropdownLink",
                onClose:function(){
                    advancedSearchEditorPopupDisplayFlag=true;
                }
            });
            advancedSearchEditorPopupDisplayFlag=false;
        }else{
            popup.close(ADVANCEDSEARCH_EDITOR_POPUP_DIALOG);
        }
    });
}

function addNewMaterial(){
    require(["idx/oneui/Dialog"], function(Dialog){
        var addKnowledgeItemEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.AddNewKnowledgeItemWidget();
        var	dialog = new Dialog({
            style:"width:640px;height:340px;",
            title: "<i class='icon-plus-sign'></i> 添加素材",
            content: "",
            closeButtonLabel: "<i class='icon-remove'></i> 关闭"
        });
        var closeDialogCallBack=function(){
            addKnowledgeItemEditor.destroy();
        };
        dojo.connect(dialog,"hide",closeDialogCallBack);
        dojo.place(addKnowledgeItemEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}

function addNewCollection(){
    require(["idx/oneui/Dialog"], function(Dialog){
        var addKnowledgeCollectionEditor=new vfbam.userclient.components.knowledgeBase.widget.knowledgeModify.AddNewKnowledgeCollectionWidget({knowledgeDisplayPanelWidget:knowledgeDisplayPanelWidget});
        var	dialog = new Dialog({
            style:"width:640px;height:290px;",
            title: "<i class='icon-plus-sign'></i> 添加专辑",
            content: "",
            closeButtonLabel: "<i class='icon-remove'></i> 关闭"
        });
        var closeDialogCallBack=function(){
            addKnowledgeCollectionEditor.destroy();
        };
        dojo.connect(dialog,"hide",closeDialogCallBack);
        dojo.place(addKnowledgeCollectionEditor.containerNode, dialog.containerNode);
        dialog.show();
    });
}