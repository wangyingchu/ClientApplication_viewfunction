require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/staticWebsite/widget/template/StaticWebsiteDynamicPageWidget.html","dojo/window"
],function(lang,declare, _Widget, _Templated, template,win){
    declare("vfbam.userclient.components.staticWebsite.widget.StaticWebsiteDynamicPageWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        dynamicPageId:null,//unique parameter of DynamicPage Widget,used to get data and close dynamic page
        dynamicPagePayload:null,
        dynamicPageData:null,
        sourcePageInfo:null,
        App_StaticWebsite_UI_Header_Height:175,
        postCreate: function(){
            var vs =win.getBox();
            this.App_StaticWebsite_UI_Header_Height=  vs.h-this.App_StaticWebsite_UI_Header_Height;
            var currentHeightStyle=""+ this.App_StaticWebsite_UI_Header_Height+"px";
            dojo.style(this.staticWebsiteContainer,"height",currentHeightStyle);
            var staticWebsiteAddress=this.getParent().websiteAddress;


            this.websiteTitle.innerHTML= this.getParent().websiteTitle;
            this.websiteDescription.innerHTML= this.getParent().websiteDescription;


            this.staticWebsiteContainer.set("content", dojo.create("iframe", {
                "src": staticWebsiteAddress,
                "style": "border: 0; width: 100%; height:"+currentHeightStyle
            }));
        },
        destroy:function(){
            console.log("destroy widget in dynamic page:"+this.dynamicPageId);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});