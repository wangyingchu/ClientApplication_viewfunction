require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/documentCenter/widget/documentManager/template/DocumentManagerWidget.html",
    "dojo/dom-class","dojo/dom-geometry"
],function(lang,declare, _Widget, _Templated, template,domClass,domGeom){
    declare("vfbam.userclient.components.documentCenter.widget.documentManager.DocumentManagerWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        addNewFolderDropDown:null,
        addNewFolderMenuDialog:null,
        addNewDocumentDropDown:null,
        documentsListWidget:null,
        documentPreviewWidget:null,
        postCreate: function(){
            console.log("DocumentManagerWidget created");
            var contentBox = domGeom.getContentBox(dojo.byId("app_documentCenter_mainContainer"));
            var realHeight=contentBox.h-25;
            var currentHeightStyle=""+realHeight +"px";
            dojo.style(this.documentManagerMainContainer,"height",currentHeightStyle);
            if(!this.documentManagerInitData){
                return;
            }
            this.documentPreviewWidget=new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentPreviewWidget({},this.documentsPreviewContainer);
            this.documentsListWidget=new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentListWidget({
                documentPreviewWidget:this.documentPreviewWidget,containerElementHeight:realHeight,documentsInitData:this.documentManagerInitData},this.documentsListContainer);
            this.addNewFolderMenuDialog=new idx.widget.MenuDialog();
            this.addNewFolderDropDown=new vfbam.userclient.common.UI.components.documentsList.AddNewFolderWidget({documentListWidget:this.documentsListWidget});
            dojo.place(this.addNewFolderDropDown.domNode, this.addNewFolderMenuDialog.containerNode);
            this.addFolderLink.set("dropDown",this.addNewFolderMenuDialog);
            this.documentsListWidget.setAddNewFolderMenuDialog(this.addNewFolderMenuDialog);
            this.documentsListWidget.setAddNewDocumentDropDown(this.addNewFolderDropDown);
            this.addNewDocumentDropDown=new vfbam.userclient.common.UI.components.documentsList.AddNewDocumentWidget({documentListWidget:this.documentsListWidget});
            this.addDocumentLink.set("dropDown",this.addNewDocumentDropDown);

            new vfbam.userclient.components.documentCenter.widget.documentManager.DocumentSearchWidget({},this.documentsSearchDialog);
        },
        loadDocuments: function(){
            if(!this.documentsListWidget.alreadyLoad){
                this.documentsListWidget.initRender();
            }
        },
        _endOfCode: function(){}
    });
});