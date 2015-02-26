require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/UserWorkedTasksWidget.html",
    "dojo/dom-class","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domClass,Dialog){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.UserWorkedTasksWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){

        },
        _endOfCode: function(){}
    });
});