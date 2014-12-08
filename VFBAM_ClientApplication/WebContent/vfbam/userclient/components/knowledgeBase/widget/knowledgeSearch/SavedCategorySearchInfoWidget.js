require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/SavedCategorySearchInfoWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.SavedCategorySearchInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            this.searchName.innerHTML=this.searchItemMetaData.searchName;
            this.searchDesc.innerHTML=this.searchItemMetaData.searchDesc;
        },
        addCategoryTag:function(selectedCategoryTag){
            this.selectedTagContainer.appendChild(selectedCategoryTag.domNode);
        },
        _endOfCode: function(){}
    });
});