require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/widgets/template/DateTimeOptionalSelector.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.widgets.DateTimeOptionalSelector", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        applicationUsersListStore:null,
        postCreate: function(){
            if(this.selectorDescription){
                this.selectorDescriptionLabel.innerHTML=this.selectorDescription;
            }else{
                dojo.style(this.selectorDescriptionLabelContainer,"display","none");
            }
            if(this.initDateTime){
                this.dateSelector.set("value",this.initDateTime);
                this.timeSelector.set("value",this.initDateTime);
            }
        },
        getDateTime:function(){
            var currentDate=this.dateSelector.get("value");
            var currentTime=this.timeSelector.get("value");
            if(currentDate!=null||currentTime!=null){
                var finalDueDate=new Date();
                if(currentDate){
                    finalDueDate.setFullYear(currentDate.getFullYear());
                    finalDueDate.setMonth(currentDate.getMonth());
                    finalDueDate.setDate(currentDate.getDate());
                }
                if(currentTime){
                    finalDueDate.setHours(currentTime.getHours());
                    finalDueDate.setMinutes(currentTime.getMinutes());
                    finalDueDate.setSeconds(0);
                }else{
                    finalDueDate.setHours(0);
                    finalDueDate.setMinutes(0);
                    finalDueDate.setSeconds(0);
                }
                return finalDueDate;
            }else{
                return null;
            }
        },
        _endOfCode: function(){}
    });
});