require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/enterpriseInfoManagement/widget/template/ParticipantDetailInfoWidget.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.components.enterpriseInfoManagement.widget.ParticipantDetailInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        facePhotoPath:null,
        postCreate: function(){
        },
        _endOfCode: function(){}
    });
});