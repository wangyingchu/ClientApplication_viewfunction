require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/SelectedCategoryTagWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SelectedCategoryTagWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        removeTagEventConnectionHandler:null,
        postCreate: function(){
            var that=this;
            var categoryTagNameArrayLength=this.categoryTagNameArray.length;
            dojo.forEach(this.categoryTagNameArray,function(currentName,idx){
                var displayName=dojo.create("span",{style:"font-size: 0.9em;color: #555555;",innerHTML:currentName},that.tagDisplayName);
                if(idx<categoryTagNameArrayLength-1){
                    dojo.create("i",{style:"padding-left: 3px;padding-right: 3px;color: #BBBBBB;",class:"icon-caret-right"},that.tagDisplayName);
                }
            });
            this.removeTagEventConnectionHandler=dojo.connect(this.removeButton,"onclick",dojo.hitch(this,this.removeCurrentCategoryTag));
            if(this.readonly){
                dojo.style(this.removeButton,"display","none");
            }
        },
        removeCurrentCategoryTag:function(){
            this.advancedSearchWidget.removeSearchCategory(this.categoryData.id);
        },
        destroy:function(){
            dojo.disconnect(this.removeTagEventConnectionHandler);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});