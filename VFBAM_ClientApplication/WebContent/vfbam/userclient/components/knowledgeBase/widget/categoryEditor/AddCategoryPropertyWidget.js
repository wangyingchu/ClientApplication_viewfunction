require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/AddCategoryPropertyWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.AddCategoryPropertyWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
        },
        showStringField:function(){
            this.showInputField("STRING");
        },
        showLongField:function(){
            this.showInputField("LONG");
        },
        showDoubleField:function(){
            this.showInputField("DOUBLE");
        },
        showDateField:function(){
            this.showInputField("DATE");
        },
        showBooleanField:function(){
            this.showInputField("BOOLEAN");
        },
        showBigNumberField:function(){
            this.showInputField("BIGNUMBER");
        },
        showInputField:function(fieldType){
            dojo.style(this.addStringContainer,"display","none");
            dojo.style(this.addLongContainer,"display","none");
            dojo.style(this.addDoubleContainer,"display","none");
            dojo.style(this.addDateContainer,"display","none");
            dojo.style(this.addBooleanContainer,"display","none");
            dojo.style(this.addBigNumberContainer,"display","none");
            if(fieldType=="STRING"){
                dojo.style(this.addStringContainer,"display","");
            }
            if(fieldType=="LONG"){
                dojo.style(this.addLongContainer,"display","");
            }
            if(fieldType=="DOUBLE"){
                dojo.style(this.addDoubleContainer,"display","");
            }
            if(fieldType=="DATE"){
                dojo.style(this.addDateContainer,"display","");
            }
            if(fieldType=="BOOLEAN"){
                dojo.style(this.addBooleanContainer,"display","");
            }
            if(fieldType=="BIGNUMBER"){
                dojo.style(this.addBigNumberContainer,"display","");
            }
        },
        addStringData:function(){
            this.addNewPropertyData("STRING");
        },
        addLongData:function(){
            this.addNewPropertyData("LONG");
        },
        addDoubleData:function(){
            this.addNewPropertyData("DOUBLE");
        },
        addDateData:function(){
            this.addNewPropertyData("DATE");
        },
        addBooleanData:function(){
            this.addNewPropertyData("BOOLEAN");
        },
        addBigNumberData:function(){
            this.addNewPropertyData("BIGNUMBER");
        },
        addNewPropertyData:function(fieldType){
            var newPropertyName=this.propertyNameDataInput.get("value");
            if(newPropertyName==""){
                UI.showToasterMessage({type:"warn",message:"请输入属性名称"});
                return;
            }
            var categoryProperty={};
            categoryProperty.propertyName=newPropertyName;
            if(fieldType=="STRING"){
                var propertyValue=this.stringDataInput.get("value");
                if(propertyValue!=""){
                    categoryProperty.propertyType="STRING";
                    categoryProperty.propertyValue=propertyValue;
                }else{
                    UI.showToasterMessage({type:"warn",message:"请输入属性值"});
                    return;
                }
            }
            if(fieldType=="LONG"){
                var propertyValue=this.longDataInput.get("value");
                if(isNaN(propertyValue)){
                    UI.showToasterMessage({type:"warn",message:"请输入属性值"});
                    return;
                }else{
                    categoryProperty.propertyType="LONG";
                    categoryProperty.propertyValue=""+propertyValue;
                }
            }
            if(fieldType=="DOUBLE"){
                var propertyValue=this.doubleDataInput.get("value");
                if(isNaN(propertyValue)){
                    UI.showToasterMessage({type:"warn",message:"请输入属性值"});
                    return;
                }else{
                    categoryProperty.propertyType="DOUBLE";
                    categoryProperty.propertyValue=""+propertyValue;
                }
            }
            if(fieldType=="DATE"){
                var propertyValue=this.dateDataInput.get("value");
                if(propertyValue){
                    categoryProperty.propertyType="DATE";
                    categoryProperty.propertyValue=""+propertyValue.getTime();
                }else{
                    UI.showToasterMessage({type:"warn",message:"请输入属性值"});
                    return;
                }
            }
            if(fieldType=="BOOLEAN"){
                var booleanValue="true";
                if(this.booleanDataInput_true.get("checked")){
                    booleanValue="true";
                }
                if(this.booleanDataInput_false.get("checked")){
                    booleanValue="false"
                }
                categoryProperty.propertyType="BOOLEAN";
                categoryProperty.propertyValue=booleanValue;
            }
            if(fieldType=="BIGNUMBER"){
                var propertyValue=this.bigNumberDataInput.get("value");
                if(isNaN(propertyValue)){
                    UI.showToasterMessage({type:"warn",message:"请输入属性值"});
                    return;
                }else{
                    categoryProperty.propertyType="DECIMAL";
                    categoryProperty.propertyValue=""+propertyValue;
                }
            }
            var that=this;
            var messageTxt="请确认是否添加知识分类业务属性 <b>"+newPropertyName+"</b>?";
            var confirmButtonAction=function(){
                that.categoryInfoWidget.addNewProperty(categoryProperty);
            };
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-plus-sign-alt'></i> 添加",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        clearInput:function(){
            this.propertyNameDataInput.set("value","");
            this.stringFieldRadio.set("checked",true);
            this.longFieldRadio.set("checked",false);
            this.doubleFieldRadio.set("checked",false);
            this.dateFieldRadio.set("checked",false);
            this.booleanFieldRadio.set("checked",false);
            this.bigNumberFieldRadio.set("checked",false);
            this.showInputField("STRING");
            this.stringDataInput.set("value","");
            this.longDataInput.set("value",NaN);
            this.doubleDataInput.set("value",NaN);
            this.dateDataInput.set("value",null);
            this.booleanDataInput_true.set("checked",true);
            this.booleanDataInput_false.set("checked",false);
            this.bigNumberDataInput.set("value",NaN);
        },
        _endOfCode: function(){}
    });
});