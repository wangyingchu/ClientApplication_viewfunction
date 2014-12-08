require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/basicTaskDataEditor/template/MultipleValuePropertyEditorWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.basicTaskDataEditor.MultipleValuePropertyEditorWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        singelValueEditorArray:null,
        postCreate: function(){
            this.singelValueEditorArray=[];
            if(this.propertyData.type=="STRING"){this.propertyTypeNoticeStr.innerHTML="文本类型";}
            if(this.propertyData.type=="LONG"){this.propertyTypeNoticeStr.innerHTML="整数类型";}
            if(this.propertyData.type=="DOUBLE"){this.propertyTypeNoticeStr.innerHTML="小数类型";}
            if(this.propertyData.type=="DECIMAL"){this.propertyTypeNoticeStr.innerHTML="高精度小数类型";}
            if(this.propertyData.type=="DATE"){this.propertyTypeNoticeStr.innerHTML="日期类型";}
            if(this.propertyData.type=="BOOLEAN"){this.propertyTypeNoticeStr.innerHTML="布尔类型";}
            if(this.propertyData.type=="BINARY"){this.propertyTypeNoticeStr.innerHTML="文件类型";}
            this.propertyName.innerHTML=this.propertyData.name;
            dojo.forEach(this.propertyData.value,function(singlePropertyValue){
                var singleValueEditor=new vfbam.userclient.common.UI.components.basicTaskDataEditor.SingleValuePropertyEditorWidget({
                    propertyData:this.propertyData,singlePropertyValue:singlePropertyValue,parentEditor:this
                });
                this.singleValueEditorContainer.appendChild(singleValueEditor.domNode);
                this.singelValueEditorArray.push(singleValueEditor);
            },this);
        },
        addPropertyValue:function(){
            if(this.propertyData.type!="BINARY"){
                var newSingleValueEditor;
                if(this.propertyData.type!="BOOLEAN"){
                    newSingleValueEditor= new vfbam.userclient.common.UI.components.basicTaskDataEditor.SingleValuePropertyEditorWidget({
                        propertyData:this.propertyData ,parentEditor:this
                    });
                }else{
                    newSingleValueEditor= new vfbam.userclient.common.UI.components.basicTaskDataEditor.SingleValuePropertyEditorWidget({
                        propertyData:this.propertyData,singlePropertyValue:"NA",parentEditor:this
                    });
                }
                this.singleValueEditorContainer.appendChild(newSingleValueEditor.domNode);
                this.singelValueEditorArray.push(newSingleValueEditor);
            }
        },
        deletePropertyValue:function(childEditor){
            this.singleValueEditorContainer.removeChild(childEditor.domNode);
            var indexNumber=dojo.indexOf(this.singelValueEditorArray,childEditor);
            this.singelValueEditorArray.splice(indexNumber, 1);
            childEditor.destroyRecursive();
        },
        changeMultipleValue:function(){
            var propertyValueArray=[];
            var checkSummaryResult=true;
            dojo.forEach(this.singelValueEditorArray,function(singleValueEditor){
                var validateResult=singleValueEditor.validateData();
                if(validateResult){
                    propertyValueArray.push(singleValueEditor.getValue());
                }else{
                    UI.showToasterMessage({type:"warning",message:"请更正不合法的或空数据值"});
                    checkSummaryResult=false;
                    return;
                }
            });
            if(checkSummaryResult){
                if(this.propertyData.required){
                    if(propertyValueArray.length==0){
                        UI.showToasterMessage({type:"warning",message:"请输入至少一项数据值"});
                        return;
                    }
                }
                this.propertyData.value= propertyValueArray;
                this.propertyEditor._displayUpdatedContent();
                this.doCloseContainerDialog();
            }
        },
        doCloseContainerDialog:function(){},
        destroy:function(){
            dojo.forEach(this.singelValueEditorArray,function(singleValueEditor){
                singleValueEditor.destroyRecursive();
            });
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});