require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/externalResource/widget/template/ExternalResourceDynamicPageWidget.html","dojo/window"
],function(lang,declare, _Widget, _Templated, template,win){
    declare("vfbam.userclient.components.externalResource.widget.ExternalResourceDynamicPageWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        dynamicPageId:null,//unique parameter of DynamicPage Widget,used to get data and close dynamic page
        dynamicPagePayload:null,
        dynamicPageData:null,
        sourcePageInfo:null,
        App_ExternalResource_UI_Header_Height:175,
        App_ExternalResource_UI_Dynamic_Real_Height:0,
        postCreate: function(){
            var vs =win.getBox();
            this.App_ExternalResource_UI_Header_Height=  vs.h-this.App_ExternalResource_UI_Header_Height;
            var currentHeightStyle=""+ this.App_ExternalResource_UI_Header_Height+"px";
            dojo.style(this.externalResourceContainer,"height",currentHeightStyle);
            this.dynamicPageId=this.getParent().workspaceID;
            this.dynamicPagePayload= UI.getDynamicPageData(this.getParent().workspaceID);
            if(this.dynamicPagePayload){
                this.dynamicPageData=this.dynamicPagePayload["APP_PAGE_DYNAMIC_DATA"];
                this. sourcePageInfo= this.dynamicPagePayload["APP_PAGE_SOURCEPAGE"];
            }
            //this.dynamicPageData.externalResourceData.resourceName
            //this.dynamicPageData.externalResourceData.resourceURL
            this.resourceURL.innerHTML= this.dynamicPageData.externalResourceData.resourceURL;
            this.externalResourceContainer.set("content", dojo.create("iframe", {
                "src": this.dynamicPageData.externalResourceData.resourceURL,
                "style": "border: 0; width: 100%; height:"+currentHeightStyle
            }));
        },
        closePage:function(){
            if(this.sourcePageInfo){
                if(this.sourcePageInfo["PAGE_STATUS"]=="DYNAMIC"){
                    UI.showDynamicPage(this.sourcePageInfo["PAGE_ID"]);
                }
                if(this.sourcePageInfo["PAGE_STATUS"]=="STATIC"){
                    UI.showStaticPage(this.sourcePageInfo["PAGE_TYPE"]) ;
                }
            }
            UI.closeDynamicPage(this.dynamicPageId);
        },
        destroy:function(){
            console.log("destroy widget in dynamic page:"+this.dynamicPageId);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});