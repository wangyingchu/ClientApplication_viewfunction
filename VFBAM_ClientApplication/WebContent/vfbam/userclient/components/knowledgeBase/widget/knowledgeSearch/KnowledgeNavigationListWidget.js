require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationListWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.listName.innerHTML=this.navigationName;
            var that=this;
            var isOdd=true;
            dojo.forEach(this.navigationOptions,function(option){
                var currentItem=new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationItemWidget({option:option,containerDialog:that.containerDialog,navigationName:that.navigationName});
                that.navigationItemContainer.appendChild(currentItem.domNode);
                /*
                if(isOdd){
                    domClass.add(currentItem.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentItem.domNode, "app_magazineView_item_even");
                }
                isOdd=!isOdd;
                */
            })
        },
        _endOfCode: function(){}
    });
});