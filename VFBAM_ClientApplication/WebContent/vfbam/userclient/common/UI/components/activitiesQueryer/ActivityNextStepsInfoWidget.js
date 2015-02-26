require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/ActivityNextStepsInfoWidget.html",
    "dojo/dom-construct"
],function(lang,declare, _Widget, _Templated, template,domConstruct){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.ActivityNextStepsInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            var that=this;
            dojo.forEach(this.nextActivityStepsData,function(stepName){
                var currentStepName=stepName;
                if(stepName=="Exclusive Gateway"){
                    //currentStepName="等待决策（排他性条件跳转节点）";
                    currentStepName="等待决策";
                }
                var currentStepSpan=domConstruct.create("span",{"style":"font-weight: bold;color: #888888;padding-top: 10px;padding-left: 5px;"});
                var tagIconSpan=domConstruct.create("i",{"style":"padding-right: 5px;","class":"icon-tag"});
                currentStepSpan.appendChild(tagIconSpan);
                var stepNameSpan=domConstruct.create("span",{"innerHTML":currentStepName,"style":"padding-right: 8px;"});
                currentStepSpan.appendChild(stepNameSpan);
                that.stepsInfoContainer.appendChild(currentStepSpan);
            });

        },
        _endOfCode: function(){}
    });
});