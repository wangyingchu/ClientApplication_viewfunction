require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskDataEditor/template/SingleValuePropertyEditorWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.basicTaskDataEditor.SingleValuePropertyEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        singleDataFieldEditor:null,
        postCreate: function(){
           this._createSingleValueEditor();
        },
        _createSingleValueEditor:function(){
            if(this.propertyData.type=="STRING"){
                this.singleDataFieldEditor=new dijit.form.ValidationTextBox({
                    style:"width:420px;",
                    required:true,
                    missingMessage: "请输入数据内容"
                },this.singleValueEditor);
                if(this.singlePropertyValue){
                    this.singleDataFieldEditor.set("value",this.singlePropertyValue);
                }
            }
            if(this.propertyData.type=="LONG"){
                this.singleDataFieldEditor=new dijit.form.ValidationTextBox({
                    style:"width:420px;",
                    pattern:"^-?\\d+$",
                    required:true,
                    missingMessage: "请输入数据内容",
                    invalidMessage:"请输入整数格式的数据"
                },this.singleValueEditor);
                if(this.singlePropertyValue){
                    this.singleDataFieldEditor.set("value",this.singlePropertyValue);
                }
            }
            if(this.propertyData.type=="DOUBLE"){
                this.singleDataFieldEditor=new dijit.form.NumberTextBox({
                    style:"width:420px;",
                    required:true,
                    missingMessage:"请输入数据内容",
                    invalidMessage:"请输入小数格式的数据"
                },this.singleValueEditor);
                if(this.singlePropertyValue){
                    this.singleDataFieldEditor.set("value",this.singlePropertyValue);
                }
            }
            if(this.propertyData.type=="DECIMAL"){
                this.singleDataFieldEditor=new dijit.form.ValidationTextBox({
                    style:"width:420px;",
                    pattern:"^(-?\\d+)(\\.\\d+)?$",
                    required:true,
                    missingMessage:"请输入数据内容",
                    invalidMessage:"请输入高精度小数格式的数据"
                },this.singleValueEditor);
                if(this.singlePropertyValue){
                    this.singleDataFieldEditor.set("value",this.singlePropertyValue);
                }
            }
            if(this.propertyData.type=="DATE"){
                this.singleDataFieldEditor=new vfbam.userclient.common.UI.widgets.DateTimeSelector({},this.singleValueEditor);
                dojo.style(this.singleDataFieldEditor.domNode,"width","420px")
                if(this.singlePropertyValue){
                    this.singleDataFieldEditor.set("value",this.singlePropertyValue);
                }
            }
            if(this.propertyData.type=="BOOLEAN"){
                var optionStore=new dojo.data.ItemFileReadStore({url:'vfbam/userclient/common/UI/components/basicTaskDataEditor/booleanSelectOption.json'});
                this.singleDataFieldEditor=new idx.form.Select({
                    store:optionStore
                },this.singleValueEditor);
                if(this.singlePropertyValue!="NA"){
                    this.singleDataFieldEditor.set("value",this.singlePropertyValue);
                }
            }
            if(this.propertyData.type=="BINARY"){
                //dojo.style(this.actionButtonsContainer,"width","450px");
                this.singleDataFieldEditor=  new vfbam.userclient.common.UI.components.basicTaskDataEditor.BinaryPropertyViewerWidget({
                    propertyData:this.propertyData,propertySubValue:this.singlePropertyValue,removeByContainer:true
                },this.singleValueEditor);
            }
        },
        validateData:function(){
            if(this.propertyData.type=="DATE"||this.propertyData.type=="BOOLEAN"||this.propertyData.type=="BINARY"){
                if(this.propertyData.type=="BOOLEAN"){
                    if(this.singleDataFieldEditor.get("value")=="-"){
                        return false;
                    }
                }
                if(this.propertyData.type=="DATE"){
                    if(this.singleDataFieldEditor.getValue()){
                        return true;
                    }else{
                        return false
                    }
                }
                if(this.propertyData.type=="BINARY"){
                    if(this.singlePropertyValue){
                        return true;
                    }else{
                        return false
                    }
                }
                return true;
            }else{
                var checkResult=this.singleDataFieldEditor. validate();
                return checkResult;
            }
        },
        getValue:function(){
            if(this.propertyData.type=="DATE"){
                return this.singleDataFieldEditor.getValue();
            }
            if(this.propertyData.type=="BINARY"){
                return this.singlePropertyValue;
            }
            return  this.singleDataFieldEditor.get("value");
        },
        deletePropertyValue: function(){
            this.parentEditor.deletePropertyValue(this);
        },
        _endOfCode: function(){}
    });
});