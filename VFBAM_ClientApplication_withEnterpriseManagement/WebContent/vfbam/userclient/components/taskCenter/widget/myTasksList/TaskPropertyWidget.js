require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/taskCenter/widget/myTasksList/template/TaskPropertyWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.taskCenter.widget.myTasksList.TaskPropertyWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        dateDisplayFormat:null,
        timeDisplayFormat:null,
        postCreate: function(){
            if(!this.readable){
                dojo.style(this.propertyContainer,"display","none");
            }
            this.dateDisplayFormat={datePattern: "yyyy-MM-dd", selector: "date"};
            this.timeDisplayFormat={datePattern: "HH:MM", selector: "time"};
            this.propertyNameLabel.innerHTML= this.name+" : ";
            this.propertyValueTxt.innerHTML=this._getValueDisplayContent()+"; ";
        },
        _getValueDisplayContent:function(){
            //"STRING" "BINARY" "LONG" "DOUBLE" "BOOLEAN" "DATE" "DECIMAL"
            var arrayPerfix= "<span style='color: #AAAAAA;padding-right: 2px;'>[</span>";
            var arrayPostfix= "<span style='color: #AAAAAA;padding-left: 2px;'>]</span>";
            var arrayDiv="<span style='color: #AAAAAA;padding-right: 2px;padding-left: 2px;'>|</span>";
            if(this.type=="STRING"){
                if(this.multipleValue){
                    var valueString="";
                    var dataArray= this.value;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        valueString= valueString+ dataValue;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;

                }else{
                    if(this.value){
                        return this.value;
                    }else{
                        return "-";
                    }
                }
            }
            if(this.type=="BINARY"){
                if(this.multipleValue){
                    var valueString="";
                    var dataArray= this.value;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        valueString= valueString+ "<i class='icon-paper-clip'></i>";
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    return "<i class='icon-paper-clip'></i>";
                }
            }
            if(this.type=="LONG"){
                if(this.multipleValue){
                    var valueString="";
                    var dataArray= this.value;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        valueString= valueString+ dataValue;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    if(this.value){
                        return this.value;
                    }else{
                        return "-";
                    }
                }
            }
            if(this.type=="DOUBLE"){
                if(this.multipleValue){
                    var valueString="";
                    var dataArray= this.value;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        valueString= valueString+ dataValue;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    if(this.value){
                        return this.value;
                    }else{
                        return "-";
                    }
                }
            }
            if(this.type=="DECIMAL"){
                if(this.multipleValue){
                    var valueString="";
                    var dataArray= this.value;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        valueString= valueString+ dataValue;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    if(this.value){
                        return this.value;
                    }else{
                        return "-";
                    }
                }
            }
            if(this.type=="BOOLEAN"){
                if(this.multipleValue){
                    var valueString="";
                    var dataArray= this.value;
                    dojo.forEach(dataArray,function(dataValue,idx){
                        var displayLabel="";

                        var checkValue=""+dataValue;
                        if(checkValue=="true"){
                            displayLabel="是";
                        }
                        if(checkValue=="false"){
                            displayLabel="否";
                        }
                        valueString= valueString+ displayLabel;
                        if(idx<dataArray.length-1){
                            valueString=valueString+arrayDiv;
                        }
                    });
                    return arrayPerfix + valueString+ arrayPostfix;
                }else{
                    if(this.value==null){
                        return "-";
                    }else{
                        var displayLabel="";
                        var checkValue=""+this.value;
                        if(checkValue=="true"){
                            displayLabel="是";
                        }
                        if(checkValue=="false"){
                            displayLabel="否";
                        }
                        if(checkValue=="-"){
                            displayLabel="-";
                        }
                        return displayLabel;
                    }
                }
            }
            if(this.type=="DATE"){
                if(this.multipleValue){
                    var valueString="";
                    var dataArray= this.value;
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
                    if(this.value){
                        if(this.value instanceof Date){
                            return dojo.date.locale.format(this.value,this.dateDisplayFormat)+" "+ dojo.date.locale.format(this.value,this.timeDisplayFormat);
                        }else{
                            var dateTypeDataValue=new Date(parseInt(this.value));
                            return dojo.date.locale.format(dateTypeDataValue,this.dateDisplayFormat)+" "+ dojo.date.locale.format(dateTypeDataValue,this.timeDisplayFormat);
                        }
                    }else{
                        return "-";
                    }
                }
            }
            return this.value;
        },
        _endOfCode: function(){}
    });
});