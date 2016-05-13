require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantProfile/template/AvailableApplicationFeatureOption.html","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Dialog){
    declare("vfbam.userclient.common.UI.components.participantProfile.AvailableApplicationFeatureOption", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            if(this.featureCode){
                this.setOptionLabel(this.featureCode);
            }
        },
        setOptionLabel:function(optionValue){
            var labelText="<i class='fa fa-cube' aria-hidden='true'></i> "+optionValue;
            this.optionLabelTxt.innerHTML=labelText;
        },
        getOptionValue:function(){
            return this.featureCode;
        },
        checkOption:function(){
            this.optionCheckbox.set("value",true);
        },
        isOptionChecked:function(){
            return this.optionCheckbox.get("value");
        },
        _endOfCode: function(){}
    });
});