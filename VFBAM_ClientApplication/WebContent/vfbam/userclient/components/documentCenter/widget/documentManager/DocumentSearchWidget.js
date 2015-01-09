require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/documentCenter/widget/documentManager/template/DocumentSearchWidget.html",
    "dojo/dom-class"
],function(lang,declare, _Widget, _Templated, template,domClass){
    declare("vfbam.userclient.components.documentCenter.widget.documentManager.DocumentSearchWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
        },
        doDocumentQuery:function(){
            var queryCategorySelected=false;
            var queryDocumentName=this.documentNameCheckbox.get("checked");
            if(queryDocumentName){
                queryCategorySelected=true;
            }
            var queryDocumentTag=this.documentTagCheckbox.get("checked");
            if(queryDocumentTag){
                queryCategorySelected=true;
            }
            var queryDocumentContent=this.documentContentCheckbox.get("checked");
            if(queryDocumentContent){
                queryCategorySelected=true;
            }
            if(!queryCategorySelected){
                UI.showToasterMessage({type:"warning",message:"请选择至少一个搜索属性"});
                return;
            }
            var queryValue=this.queryInputValue.get("value");
            if(queryValue==""){
                UI.showToasterMessage({type:"warning",message:"请输入搜索文字内容"});
                return;
            }
            var documentQueryParams={};
            documentQueryParams.queryContent=this.queryInputValue.get("value");
            documentQueryParams.queryDocumentName=this.documentNameCheckbox.get("checked");
            documentQueryParams.queryDocumentTag=this.documentTagCheckbox.get("checked");
            documentQueryParams.queryDocumentContent=this.documentContentCheckbox.get("checked");
            this.documentManager.queryDocuments(documentQueryParams);
        },
        _endOfCode: function(){}
    });
});