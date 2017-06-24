require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskDataEditor/template/BasicTaskDataFieldWidget.html",
    "dojo/dom-class","dojo/number" ,"idx/oneui/Dialog","dojox/mvc/equals"
],function(lang,declare, _Widget, _Templated, template,domClass,number,Dialog,Equals){
    declare("vfbam.userclient.common.UI.components.basicTaskDataEditor.BasicTaskDataFieldWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        dateDisplayFormat:null,
        timeDisplayFormat:null,
        dataFieldEditor:null,
        currentInputValue:null,
        editingDataObject:null,
        currentInputIsValidate:null,
        postCreate: function(){
            this.dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            this.timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            this.dataFieldName.innerHTML=this.taskFieldData.name;
            this.editingDataObject=  lang.clone(this.taskFieldData);//temp data used for edit
            this.currentInputValue= this.editingDataObject.value;
            if(this.editingDataObject.type!="BINARY"){
                this.dataFieldValue.innerHTML=this._getValueDisplayContent(this.currentInputValue);
            }else{
                var binaryPropertyContainer=dojo.create("span",{},this.dataFieldValue);
                if(this.editingDataObject.multipleValue){
                    dojo.create("span",{style:'color: #AAAAAA;padding-right: 2px;',innerHTML:"["},binaryPropertyContainer);
                    dojo.forEach(this.currentInputValue,function(dataValue,idx){
                        var currentPropertyViewer=  new vfbam.userclient.common.UI.components.basicTaskDataEditor.BinaryPropertyViewerWidget({
                            propertyData:this.editingDataObject,deleteContentCallback:dojo.hitch(this,this._displayUpdatedContent),propertySubValue:dataValue ,removeByContainer:true
                        });
                        binaryPropertyContainer.appendChild(currentPropertyViewer.domNode);
                        if(idx<this.currentInputValue.length-1){
                            dojo.create("span",{style:'color: #AAAAAA;padding-right: 2px;padding-left: 2px;',innerHTML:"|"},binaryPropertyContainer);
                        }
                    },this);
                    dojo.create("span",{style:'color: #AAAAAA;padding-right: 2px;',innerHTML:"]"},binaryPropertyContainer);
                }else{
                    new vfbam.userclient.common.UI.components.basicTaskDataEditor.BinaryPropertyViewerWidget({
                        propertyData:this.editingDataObject,deleteContentCallback:dojo.hitch(this,this._displayUpdatedContent)
                    },binaryPropertyContainer);
                }
            }
            if(this.editingDataObject.required){
                dojo.style(this.requiredDataFieldPrompt,"display","");
            }
            if(!this.editingDataObject.writable){
                dojo.style(this.dataEditButton,"display","none");
            }
            this.currentInputIsValidate=true;
        },
        setDarkBackgroundColor:function(){
            domClass.add(this.dataValueContainer, "app_baseTaskDataField_item_even");
            domClass.add(this.dataEditButtonContainer, "app_baseTaskDataField_item_even");
        },
        editData:function(){
            dojo.style(this.errorMessageContainer,"display","none");
            if(this.editingDataObject.multipleValue){
                this._createDataFieldEditor(); //need recreate data field editor for reset array data
            }else{
                if(this.dataFieldEditor==null){
                    this._createDataFieldEditor();
                }
            }
            if(this.editingDataObject.multipleValue){
                this.dataFieldEditor.show();
            }else{
                dojo.style(this.dataFieldValue,"display","none");
                this.dataFieldEditor.set("value",this.currentInputValue);
                dojo.style(this.dataFieldValueEditorContainer,"display","");
                this.dataFieldEditor.focus();
                dojo.style(this.dataEditButton,"display","none");
            }
        },
        _displayUpdatedContent:function(){
            if(this.taskFieldData.type!="BINARY"){
                var validateResult=this._validateDataValue();
                var newValue=this._getValueDisplayContent(validateResult.value);
                this.dataFieldValue.innerHTML= newValue;
                this.currentInputValue= validateResult.value;
                dojo.style(this.dataFieldValue,"display","");
                dojo.style(this.dataFieldValueEditorContainer,"display","none");
                if(!validateResult.result){
                    dojo.style(this.errorMessageContainer,"display","");
                    this.errorMessageText.innerHTML= validateResult.errorMessage;
                    this.currentInputIsValidate=false;
                }else{
                    dojo.style(this.errorMessageContainer,"display","none");
                    this.currentInputIsValidate=true;
                }
            }else{
                var validateResult=this._validateDataValue();
                if(!validateResult.result){
                    dojo.style(this.errorMessageContainer,"display","");
                    this.errorMessageText.innerHTML= validateResult.errorMessage;
                    dojo.style(this.dataFieldValue,"display","none");
                    this.currentInputIsValidate=false;
                }else{
                    dojo.style(this.errorMessageContainer,"display","none");
                    this.currentInputIsValidate=true;
                }
                if(this.editingDataObject.multipleValue){
                    dojo.empty(this.dataFieldValue); //need logic to delete all not needed BinaryPropertyViewerWidgets
                    var binaryPropertyContainer=dojo.create("span",{},this.dataFieldValue);
                    dojo.create("span",{style:'color: #AAAAAA;padding-right: 2px;',innerHTML:"["},binaryPropertyContainer);
                    dojo.forEach(this.editingDataObject.value,function(dataValue,idx){
                        var currentPropertyViewer=  new vfbam.userclient.common.UI.components.basicTaskDataEditor.BinaryPropertyViewerWidget({
                            propertyData:this.editingDataObject,deleteContentCallback:dojo.hitch(this,this._displayUpdatedContent),propertySubValue:dataValue,removeByContainer:true
                        });
                        binaryPropertyContainer.appendChild(currentPropertyViewer.domNode);
                        if(idx<this.editingDataObject.value.length-1){
                            dojo.create("span",{style:'color: #AAAAAA;padding-right: 2px;padding-left: 2px;',innerHTML:"|"},binaryPropertyContainer);
                        }
                    },this);
                    dojo.create("span",{style:'color: #AAAAAA;padding-right: 2px;',innerHTML:"]"},binaryPropertyContainer);
                }else{
                    if(this.editingDataObject.value){
                        dojo.style(this.dataFieldValue,"display","");
                    }else{
                        dojo.style(this.dataFieldValue,"display","none");
                    }
                }
                dojo.style(this.dataFieldValueEditorContainer,"display","none");
            }
            dojo.style(this.dataEditButton,"display","");
        },
        _validateDataValue:function(){
            var validateResult={};
            if(this.editingDataObject.type=="STRING"){
                if(this.editingDataObject.multipleValue){
                    validateResult.result=true;
                    validateResult.value=this.editingDataObject.value;
                }else{
                    var validateValue=this.dataFieldEditor.get("value");
                    if(validateValue==""&this.taskFieldData.required){
                        validateResult.result=false;
                        validateResult.value="";
                        validateResult.errorMessage="本项数据为必填项";
                    }else{
                        validateResult.result=true;
                        validateResult.value=validateValue;
                        this.editingDataObject.value= validateResult.value;
                    }
                }
                return validateResult;
            }
            if(this.editingDataObject.type=="LONG"){
                if(this.editingDataObject.multipleValue){
                    validateResult.result=true;
                    validateResult.value=this.editingDataObject.value;
                }else{
                    var validateValue=this.dataFieldEditor.get("value");
                    var validateDisplayValue= this.dataFieldEditor.get("displayedValue");
                    if(isNaN(validateValue)&&validateDisplayValue==""){
                        if(this.editingDataObject.required){
                            validateResult.result=false;
                            validateResult.value="";
                            validateResult.errorMessage="本项数据为必填项";
                        }else{
                            validateResult.result=true;
                            validateResult.value="";
                            this.editingDataObject.value= validateResult.value;
                        }
                    }else{
                        var regularExpression  =  new RegExp("^-?\\d+$");
                        var dataValidateResult= regularExpression.test(this.dataFieldEditor.get("value"));
                        if(dataValidateResult){
                            var validateValue=this.dataFieldEditor.get("value");
                            validateResult.result=true;
                            validateResult.value=validateValue;
                            this.editingDataObject.value= validateResult.value;
                        }else{
                            validateResult.result=false;
                            validateResult.value=this.dataFieldEditor.get("displayedValue");
                            validateResult.errorMessage="请输入整数格式的数据";
                        }
                    }
                }
                return validateResult;
            }
            if(this.editingDataObject.type=="DOUBLE"){
                if(this.editingDataObject.multipleValue){
                    validateResult.result=true;
                    validateResult.value=this.editingDataObject.value;
                }else{
                    var validateValue=this.dataFieldEditor.get("value");
                    var validateDisplayValue= this.dataFieldEditor.get("displayedValue");
                    if(isNaN(validateValue)&&validateDisplayValue==""){
                        if(this.editingDataObject.required){
                            validateResult.result=false;
                            validateResult.value="";
                            validateResult.errorMessage="本项数据为必填项";
                        }else{
                            validateResult.result=true;
                            validateResult.value="";
                            this.editingDataObject.value= validateResult.value;
                        }
                    }else{
                        var regularExpression  =  new RegExp("^(-?\\d+)(\\.\\d+)?$");
                        var dataValidateResult= regularExpression.test(this.dataFieldEditor.get("value"));
                        if(dataValidateResult){
                            var validateValue=this.dataFieldEditor.get("value");
                            validateResult.result=true;
                            validateResult.value=validateValue;
                            this.editingDataObject.value= validateResult.value;
                        }else{
                            validateResult.result=false;
                            validateResult.value=this.dataFieldEditor.get("displayedValue");
                            validateResult.errorMessage="请输入小数格式的数据";
                        }
                    }
                }
                return validateResult;
            }
            if(this.editingDataObject.type=="DECIMAL"){
                if(this.editingDataObject.multipleValue){
                    validateResult.result=true;
                    validateResult.value=this.editingDataObject.value;
                }else{
                    var validateValue=this.dataFieldEditor.get("value");
                    if(validateValue==""){
                        if(this.editingDataObject.required){
                            validateResult.result=false;
                            validateResult.value="";
                            validateResult.errorMessage="本项数据为必填项";
                        }else{
                            validateResult.result=true;
                            validateResult.value="";
                            this.editingDataObject.value= validateResult.value;
                        }
                    }else{
                        var regularExpression  =  new RegExp("^(-?\\d+)(\\.\\d+)?$");
                        var dataValidateResult= regularExpression.test(this.dataFieldEditor.get("value"));
                        if(dataValidateResult){
                            var validateValue=this.dataFieldEditor.get("value");
                            validateResult.result=true;
                            validateResult.value=validateValue;
                            this.editingDataObject.value= validateResult.value;
                        }else{
                            validateResult.result=false;
                            validateResult.value=this.dataFieldEditor.get("displayedValue");
                            validateResult.errorMessage="请输入高精度小数格式的数据";
                        }
                    }
                }
                return validateResult;
            }
            if(this.editingDataObject.type=="DATE"){
                if(this.editingDataObject.multipleValue){
                    validateResult.result=true;
                    validateResult.value=this.editingDataObject.value;
                }else{
                    var validateValue=this.dataFieldEditor.getValue();
                    var validateResultValue= this.dataFieldEditor.validate();
                    if(validateValue==null){
                        if(this.editingDataObject.required){
                            validateResult.result=false;
                            validateResult.errorMessage="本项数据为必填项";
                        }else{
                            validateResult.result=validateResultValue;
                        }
                        validateResult.value=null;
                        this.editingDataObject.value= validateResult.value;
                    }else{
                        validateResult.result=validateResultValue;
                        validateResult.value=validateValue;
                        this.editingDataObject.value= validateResult.value;
                    }
                }
                return validateResult;
            }
            if(this.editingDataObject.type=="BOOLEAN"){
                if(this.editingDataObject.multipleValue){
                    validateResult.result=true;
                    validateResult.value=this.editingDataObject.value;
                }else{
                    var validateValue=this.dataFieldEditor.get("value");
                    var validateDisplayValue= this.dataFieldEditor.get("displayedValue");
                    var validateValue=this.dataFieldEditor.get("value");
                    if(validateValue=="-"&this.editingDataObject.required){
                        validateResult.result=false;
                        validateResult.value=validateDisplayValue;
                        validateResult.errorMessage="本项数据为必填项";
                    }else{
                        validateResult.result=true;
                        validateResult.value=validateValue;
                        this.editingDataObject.value= validateResult.value;
                    }
                }
                return validateResult;
            }
            if(this.editingDataObject.type=="BINARY"){
                if(this.editingDataObject.multipleValue){
                    if(this.editingDataObject.value.length>0){
                        validateResult.result=true;
                        validateResult.value=this.editingDataObject.value;
                    }else{
                        if(this.editingDataObject.required){
                            validateResult.result=false;
                            validateResult.value=[];
                            validateResult.errorMessage="本项数据为必填项";
                        }else{
                            validateResult.result=true;
                            validateResult.value=[];
                        }
                    }
                }else{
                    if(this.editingDataObject.value){
                        validateResult.result=true;
                        validateResult.value=this.editingDataObject.value;
                        this.editingDataObject.value= validateResult.value;
                    }else{
                        if(this.editingDataObject.required){
                            validateResult.result=false;
                            validateResult.value=null;
                            validateResult.errorMessage="本项数据为必填项";
                        }else{
                            validateResult.result=true;
                            validateResult.value=null;
                            this.editingDataObject.value= validateResult.value;
                        }
                    }
                }
                return validateResult;
            }
        },
        _createDataFieldEditor:function(){
            if(this.editingDataObject.type=="STRING"){
                if(this.editingDataObject.multipleValue){
                    this._createMultiValueEditorDialog();
                }else{
                    this.dataFieldEditor=new dijit.form.TextBox({
                        onBlur:dojo.hitch(this,this._displayUpdatedContent)
                    },this.dataFieldValueEditor);
                }
            }
            if(this.editingDataObject.type=="LONG"){
                if(this.editingDataObject.multipleValue){
                    this._createMultiValueEditorDialog();
                }else{
                    this.dataFieldEditor=new dijit.form.NumberSpinner({
                        pattern:"^-?\\d+$",
                        invalidMessage:"请输入整数格式的数据",
                        onBlur:dojo.hitch(this,this._displayUpdatedContent)
                    },this.dataFieldValueEditor);
                }
            }
            if(this.editingDataObject.type=="DOUBLE"){
                if(this.editingDataObject.multipleValue){
                    this._createMultiValueEditorDialog();
                }else{
                    this.dataFieldEditor=new dijit.form.NumberTextBox({
                        pattern:"^(-?\\d+)(\\.\\d+)?$",
                        invalidMessage:"请输入小数格式的数据",
                        onBlur:dojo.hitch(this,this._displayUpdatedContent)
                    },this.dataFieldValueEditor);
                }
            }
            if(this.editingDataObject.type=="DECIMAL"){
                if(this.editingDataObject.multipleValue){
                    this._createMultiValueEditorDialog();
                }else{
                    this.dataFieldEditor=new dijit.form.ValidationTextBox({
                        pattern:"^(-?\\d+)(\\.\\d+)?$",
                        invalidMessage:"请输入高精度小数格式的数据",
                        onBlur:dojo.hitch(this,this._displayUpdatedContent)
                    },this.dataFieldValueEditor);
                }
            }
            if(this.editingDataObject.type=="DATE"){
                if(this.editingDataObject.multipleValue){
                    this._createMultiValueEditorDialog();
                }else{
                    this.dataFieldEditor=new vfbam.userclient.common.UI.widgets.DateTimeSelector({},this.dataFieldValueEditor);
                    this.dataFieldEditor.setConfirmSetValueCallBack(dojo.hitch(this,this._displayUpdatedContent));
                }
            }
            if(this.editingDataObject.type=="BOOLEAN"){
                if(this.editingDataObject.multipleValue){
                    this._createMultiValueEditorDialog();
                }else{
                    var optionStore=new dojo.data.ItemFileReadStore({url:'vfbam/userclient/common/UI/components/basicTaskDataEditor/booleanSelectOption.json'});
                    this.dataFieldEditor=new idx.form.Select({
                        store:optionStore,
                        onBlur:dojo.hitch(this,this._displayUpdatedContent)
                    },this.dataFieldValueEditor);
                }
            }
            if(this.editingDataObject.type=="BINARY"){
                if(this.editingDataObject.multipleValue){
                    this._createMultiValueEditorDialog();
                }else{
                    this.dataFieldEditor=new dojox.form.Uploader({
                        label: '<i class="icon-file"></i> 选择属性文件',
                        url:'localhost',
                        uploadOnSelect:true,
                        onBlur:dojo.hitch(this,this._displayUpdatedContent)
                    },this.dataFieldValueEditor);
                }
            }
        },
        _getValueDisplayContent:function(dataValue){
            //"STRING" "BINARY" "LONG" "DOUBLE" "BOOLEAN" "DATE" "DECIMAL"
            var arrayPerfix= "<span style='color: #AAAAAA;padding-right: 2px;'>[</span>";
            var arrayPostfix= "<span style='color: #AAAAAA;padding-left: 2px;'>]</span>";
            var arrayDiv="<span style='color: #AAAAAA;padding-right: 2px;padding-left: 2px;'>|</span>";
            if(this.editingDataObject.type=="STRING"){
                if(this.editingDataObject.multipleValue){
                    var valueString="";
                    var dataArray= dataValue;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        valueString= valueString+ dataValue;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    return dataValue;
                }
            }
            if(this.editingDataObject.type=="LONG"){
                if(this.editingDataObject.multipleValue){
                    var valueString="";
                    var dataArray= dataValue;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        var formatedValue;
                        if(dataValue==""){
                            formatedValue= "";
                        }
                        var formatedText= number.format(dataValue);
                        if(formatedText){
                            formatedValue= formatedText;
                        }else{
                            formatedValue= dataValue;
                        }
                        valueString= valueString+ formatedValue;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    if(dataValue==null||dataValue==""){
                        return "";
                    }
                    var formatedText= number.format(dataValue);
                    if(formatedText){
                        return formatedText;
                    }else{
                        return dataValue;
                    }
                }
            }
            if(this.editingDataObject.type=="DOUBLE"){
                if(this.editingDataObject.multipleValue){
                    var valueString="";
                    var dataArray= dataValue;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        var formatedValue;
                        if(dataValue==""){
                            formatedValue= "";
                        }
                        var formatedText= number.format(dataValue);
                        if(formatedText){
                            formatedValue= formatedText;
                        }else{
                            formatedValue= dataValue;
                        }
                        valueString= valueString+ formatedValue;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    if(dataValue==null||dataValue==""){
                        return "";
                    }
                    var formatedText= number.format(dataValue,{places:3});
                    if(formatedText){
                        return formatedText;
                    }else{
                        return dataValue;
                    }
                }
            }
            if(this.editingDataObject.type=="DECIMAL"){
                if(this.editingDataObject.multipleValue){
                    var valueString="";
                    var dataArray= dataValue;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        valueString= valueString+ dataValue;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    if(dataValue==null||dataValue==""){
                        return "";
                    }else{
                        return dataValue;
                    }
                }
            }
            if(this.editingDataObject.type=="BOOLEAN"){
                if(this.editingDataObject.multipleValue){
                    var valueString="";
                    var dataArray= dataValue;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        var displayLabel="";
                        if(dataValue){
                            var checkValue=""+dataValue;
                            if(checkValue=="true"){
                                displayLabel="是";
                            }
                            if(checkValue=="false"){
                                displayLabel="否";
                            }
                            if(checkValue=="&nbsp;"){
                                displayLabel="";
                            }
                        }else{
                            displayLabel="否";
                        }
                        valueString= valueString+ displayLabel;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    var displayLabel="";
                    if(dataValue==null){
                        displayLabel="";
                    }else{
                        if(dataValue){
                            var checkValue=""+dataValue;
                            if(checkValue=="true"){
                                displayLabel="是";
                            }
                            if(checkValue=="false"){
                                displayLabel="否";
                            }
                            if(checkValue=="&nbsp;"){
                                displayLabel="";
                            }
                        }else{
                            displayLabel="否";
                        }
                    }
                    return displayLabel;
                }
            }
            if(this.editingDataObject.type=="DATE"){
                if(this.editingDataObject.multipleValue){
                    var valueString="";
                    var dataArray= dataValue;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        var dateStr="";
                        if(dataValue instanceof Date){
                            dateStr=dojo.date.locale.format(dataValue,this.dateDisplayFormat)+" "+ dojo.date.locale.format(dataValue,this.timeDisplayFormat);
                        }else{
                            var dateTypeDataValue=new Date(parseInt(dataValue));
                            dateStr=dojo.date.locale.format(dateTypeDataValue,this.dateDisplayFormat)+" "+ dojo.date.locale.format(dateTypeDataValue,this.timeDisplayFormat);
                        }
                        valueString= valueString+ dateStr;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    },this);
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    if(dataValue==null){return "";}
                    if(dataValue instanceof Date){
                        return dojo.date.locale.format(dataValue,this.dateDisplayFormat)+" "+ dojo.date.locale.format(dataValue,this.timeDisplayFormat);
                    }else{
                        var dateTypeDataValue=new Date(parseInt(dataValue));
                        return dojo.date.locale.format(dateTypeDataValue,this.dateDisplayFormat)+" "+ dojo.date.locale.format(dateTypeDataValue,this.timeDisplayFormat);
                    }

                }
            }
            return dataValue;
        },
        _createMultiValueEditorDialog:function(){
            var multiValueDataFieldEditor=new vfbam.userclient.common.UI.components.basicTaskDataEditor.MultipleValuePropertyEditorWidget({propertyEditor:this,propertyData:this.editingDataObject});
            var actionButtone=[];
            var confirmModifyButton=new dijit.form.Button({
                label: "<i class='icon-edit'></i> 确认更新",
                onClick: function(){
                    multiValueDataFieldEditor.changeMultipleValue();
                }
            });
            actionButtone.push(confirmModifyButton);
            this.dataFieldEditor = new Dialog({
                style:"width:550px;",
                title: "<i class='icon-edit'></i> 更新任务属性数据",
                content: "",
                buttons:actionButtone,
                closeButtonLabel: "<i class='icon-remove'></i> 取消"
            });
            this.dataFieldEditor.connect(multiValueDataFieldEditor, "doCloseContainerDialog", "hide");
            dojo.place(multiValueDataFieldEditor.containerNode,  this.dataFieldEditor.containerNode);
        },
        isModified:function(){
            var notModified=Equals.equalsObject(this.editingDataObject,this.taskFieldData) ;
            return !notModified;
        },
        isValidate:function(){
            if(this.editingDataObject.multipleValue){
                //array value
                if(this.currentInputValue==null){
                    if(this.taskFieldData.required){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    if(this.currentInputValue.length==0){
                        if(this.taskFieldData.required){
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }else{
                //single value
                if(this.currentInputIsValidate){
                    if(this.currentInputValue==null){
                        if(this.taskFieldData.required){
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        if(this.currentInputValue==""&&this.editingDataObject.type=="STRING"){
                            if(this.taskFieldData.required){
                                return false;
                            }
                        }
                        return true;
                    }
                }else{
                    return false;
                }
            }
        },
        getModifiedData:function(){
            return this.editingDataObject;
        },
        resetData:function(){
            //if(this.editingDataObject.multipleValue){

            //}else{
                this.editingDataObject=null;
                this.editingDataObject=lang.clone(this.taskFieldData);
                this.currentInputValue= this.editingDataObject.value;
                this.dataFieldEditor.set("value", this.editingDataObject.value);


                this._displayUpdatedContent();
            //}
        },
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});