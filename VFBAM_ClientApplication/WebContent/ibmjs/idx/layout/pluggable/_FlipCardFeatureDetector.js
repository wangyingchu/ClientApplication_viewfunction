/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
    "dojo/_base/sniff"
], function(has){
    //css3 support detector(program once)
    if(!window.supportCSS3AnimationDetected){
        var supports = (function() {
            var div = document.createElement('div');
            return function(prop) {
                vendors = 'Khtml O Moz Webkit'.split(' '), len = vendors.length;
                if ( prop in div.style)
                    return true;
                if ('-ms-' + prop in div.style)
                    return true;
                prop = prop.replace(/^[a-z]/, function(val) {
                    return val.toUpperCase();
                });
                while (len--) {
                    if (vendors[len] + prop in div.style) {
                        return true;
                    }
                }
                return false;
            };
        })();
        _supportCSS3Animation = supports('transform') && supports('transition') && supports('perspective') && supports('animation');
    }
    window.supportCSS3AnimationDetected = true;


    //platform detector(program once)
    (function(){
        if(window.platformDetected){return;}

        var themeMap = {
            "Holodark":"holodark",
            "Android 3":"holodark",
            "Android 4":"holodark",
            "Android":"android",
            "BlackBerry":"blackberry",
            "BB10":"blackberry",
            "iPhone":"iphone",
            "iPad":"ipad",
            "MSIE 10":"windows",
            "WindowsPhone":"windows",
            "Custom":"custom"
        }
        var dua = navigator.userAgent;
        var platform = ""; //"tablet", "phone", "mobile", ......
        if(dua.match(/(iPhone|iPod|iPad|Android|Holodark|BlackBerry|BB10|WindowsPhone)/)){
            platform += "mobile||";
            if((dua.indexOf("iPod")>=0) || (dua.indexOf("iPhone")>=0) || (dua.indexOf("WindowsPhone")>=0)){
                platform += "phone||";
            } else if (dua.indexOf("iPad")>=0) {
                platform += "tablet||";
            }
            for(var key in themeMap){
                if(dua.indexOf(key) > -1){
                    var theme = themeMap[key];
                    platform += theme + "||";
                    // dm.currentTheme = theme;
                }
            }
        }else{
            platform += "desktop||";
        }

        //For IE10
        if (dua.match(/IEMobile\/10\.0/)) {
            var msViewportStyle = document.createElement("style");
            msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}"));
            document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
        }

        has.add("desktop",(platform.indexOf("desktop")>-1));
        has.add("mobile",(platform.indexOf("mobile")>-1));
        has.add("phone",(platform.indexOf("phone")>-1));
        has.add("tablet",(platform.indexOf("tablet")>-1));

        //document class
        var pOriginArray = platform.split("||"), pArray = [];
        for(var i = 0; i < pOriginArray.length; i++){
            if(pOriginArray[i]){
                pArray.push(pOriginArray[i] + "Platform");
            }
        }
        document.documentElement.className += " " + pArray.join(" ");

        window.platformDetected = true;
    })();
    return { dectcor: "placeholder"};
});