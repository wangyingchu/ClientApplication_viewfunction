require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/widgets/template/NestedContentContainer.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.widgets.NestedContentContainer", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        childItemsArray:null,
        expandStatus:null,
        postCreate: function(){
            this.expandStatus=true;
            this.containerTitle.innerHTML=this.title;
            this.childItemsArray=[];
        },
        addChildItem:function(childItem){
            this.listChildrenContainer.appendChild(childItem.domNode);
            this.childItemsArray.push(childItem);
        },
        showHideChildren:function(){
            this.expandStatus=!this.expandStatus;
            if(this.expandStatus){
                dojo.style(this.expandIndicator,"display","none");
                dojo.style(this.contractIndicator,"display","");

                dojo.style(this.listChildrenContainer,"display","");
            }else{
                dojo.style(this.expandIndicator,"display","");
                dojo.style(this.contractIndicator,"display","none");
                dojo.style(this.listChildrenContainer,"display","none");
            }
        },
        destroy:function(){
            dojo.forEach(this.childItemsArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});