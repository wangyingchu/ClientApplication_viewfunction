require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/dynamicWebsite/widget/template/DynamicWebsiteDynamicPageWidget.html","dojo/window"
],function(lang,declare, _Widget, _Templated, template,win){
    declare("vfbam.userclient.components.dynamicWebsite.widget.DynamicWebsiteDynamicPageWidget", [_Widget, _Templated], {
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
            dojo.style(this.dynamicWebsiteContainer,"height",currentHeightStyle);
            this.dynamicPagePayload= UI.getDynamicPageData(this.getParent().workspaceID);
            var dynamicWebsiteAddress=this.dynamicPagePayload.WEBSITEADDRESS;
            var dynamicWebsiteAddressQueryParams=this.dynamicPagePayload.ADDRESS_QUERY_PARAMS;
            if(dynamicWebsiteAddressQueryParams){
                var queryParamsContent="";
                for(var param in dynamicWebsiteAddressQueryParams){
                    if(typeof(dynamicWebsiteAddressQueryParams[param])=="function"){
                        //dynamicWebsiteAddressQueryParams[p]();
                    }else{
                        // p 为属性名称，obj[p]为对应属性的值
                        queryParamsContent+= param + "=" + dynamicWebsiteAddressQueryParams[param] + "&";
                    }
                }
                dynamicWebsiteAddress=dynamicWebsiteAddress+"?"+queryParamsContent;
                dynamicWebsiteAddress=dynamicWebsiteAddress.substr(0, dynamicWebsiteAddress.length-1);
            }
            if(this.dynamicPagePayload.WEBSITEDESCRIPTION){
                this.websiteDescription.innerHTML= this.dynamicPagePayload.WEBSITEDESCRIPTION;
            }
            if(this.dynamicPagePayload.SHOW_WEBSITEADDRESS){
                this.websiteAddress.innerHTML= dynamicWebsiteAddress;
            }
            this.dynamicWebsiteContainer.set("content", dojo.create("iframe", {
                "src": dynamicWebsiteAddress,
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