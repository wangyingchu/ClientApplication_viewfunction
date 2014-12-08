require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationItemWidget.html"
    ,"dojo/on"
],function(lang,declare, _Widget, _Templated, template,on){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationItemWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.optionName.innerHTML=this.option.optionName;
            //this.optionDesc.innerHTML=this.option.optionDesc;
            this.optionDesc.innerHTML="知识分类描述";
            var that=this;

            var displayName="知识导航 > "+this.navigationName+" > "+this.option.optionName;
            this.mouseClickEventListener=on(this.domNode, "click", function(evt){
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_SHOWKNOWLEDGECONTENT_EVENT,{
                    KNOWLEDGE_VIEW_TYPE:KNOWLEDGE_VIEW_TYPE_ALL,
                    KNOWLEDGE_VIEW_MODE:KNOWLEDGE_VIEW_MODE_MULTIPLE,
                    KNOWLEDGE_VIEW_CLASSIFY:KNOWLEDGE_VIEW_CLASSIFY_NAVIGATION,
                    KNOWLEDGE_VIEW_DATA:{
                        DISPLAY_TITLE:displayName,
                        VIEW_METADATA:{},
                        VIEW_PAGEDATA:{
                            PAGING:true,
                            PAGE_SIZE:50,
                            CURRENT_PAGE_NUMBER:1
                        }
                    }
                });
                that.containerDialog.close();
            });
        },
        _endOfCode: function(){}
    });
});