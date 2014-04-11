require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/widgets/template/DateTimeSelector.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.widgets.DateTimeSelector", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        confirmSetValueCallBack:null,
        validateResult:null,
        postCreate: function(){
            this.validateResult=true;
            dojo.style(this.confirmButton.domNode,"display","none");
        },
        focus:function(){
        },
        confirmSetValue:function(){
            if(this.dateField.get("value")==null&this.timeField.get("value")!=null){
                this.validateResult==false;
                UI.showToasterMessage({type:"warning",message:"请选择日期"});
                return;
            }
            if(this.dateField.get("value")!=null&this.timeField.get("value")==null){
                this.validateResult==false;
                UI.showToasterMessage({type:"warning",message:"请选择时间"});
                return;
            }
            this.validateResult=true;
            this.confirmSetValueCallBack();
        },
        setConfirmSetValueCallBack:function(confirmCallBack){
            this.confirmSetValueCallBack=  confirmCallBack;
            dojo.style(this.confirmButton.domNode,"display","");
        },
        getValue:function(){
            if(this.dateField.get("value")==null&this.timeField.get("value")==null){
                return null;
            }
            var completeDate= new Date();
            completeDate.setFullYear(this.dateField.get("value").getFullYear());
            completeDate.setMonth(this.dateField.get("value").getMonth());
            completeDate.setDate(this.dateField.get("value").getDate());
            completeDate.setHours(this.timeField.get("value").getHours());
            completeDate.setMinutes(this.timeField.get("value").getMinutes());
            completeDate.setSeconds(this.timeField.get("value").getSeconds());
            return completeDate;
        },
        set:function(property,value){
            if(property=="value"){
                var dateValue=new Date(parseInt(value));
                this.dateField.set("value",dateValue);
                this.timeField.set("value",dateValue);
            }
        },
        validate:function(){
            return this.validateResult;
        },
        clearInputValue:function(){
            this.dateField.set("value",null);
            this.timeField.set("value",null);
        },
        _endOfCode: function(){}
    });
});