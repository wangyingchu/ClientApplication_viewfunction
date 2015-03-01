require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/ActivityStepListWidget.html",
    "dojo/dom-class","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domClass,Dialog){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.ActivityStepListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        activityStepDetailWidgetArray:null,
        postCreate: function(){
            this.activityStepDetailWidgetArray=[];
            var that=this;
            var isOdd=true;
            dojo.forEach(this.activityStepsData,function(currentStepData){
                var currentActivityStepDetailWidget=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityStepGeneralInfoWidget({activityStepData:currentStepData});
                if(isOdd){
                    domClass.add(currentActivityStepDetailWidget.domNode, "app_magazineView_item_odd");
                }else{
                    domClass.add(currentActivityStepDetailWidget.domNode, "app_magazineView_item_even");
                }
                isOdd=!isOdd;
                that.activityStepsListContainer.appendChild(currentActivityStepDetailWidget.domNode);
                that.activityStepDetailWidgetArray.push(currentActivityStepDetailWidget);
            })
        },
        destroy:function(){
            dojo.forEach(this.activityStepDetailWidgetArray,function(stepWidget){
                stepWidget.destroy();
            });
            this.activityStepDetailWidgetArray=null;
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});