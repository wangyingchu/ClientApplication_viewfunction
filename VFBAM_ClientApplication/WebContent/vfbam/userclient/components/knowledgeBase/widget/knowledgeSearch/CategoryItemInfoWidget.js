require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/CategoryItemInfoWidget.html","dojo/store/Memory",
    "idx/grid/PropertyFormatter","idx/grid/PropertyGrid",
    "idx/form/DateTimeTextBox",
    "idx/form/NumberTextBox",
    "idx/form/CheckBox"
],function(lang,declare, _Widget, _Templated, template,Memory,PropertyFormatter,PropertyGrid,DateTimeTextBox,NumberTextBox,CheckBox){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.CategoryItemInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentCategoryMetaData:null,
        categoryPropertiesGrid:null,
        existingPropertyFomatterArray:null,
        existingPropertyMetaDataArray:null,
        currentCategoryData:null,
        postCreate: function(){
            this.categoryPropertiesGrid=new idx.grid.PropertyGrid({
                data:[],
                properties:null,
                onChange:dojo.hitch(this,this.updatePropertyValue)
            },this.propertiesGridContainer);
            this.categoryPropertiesGrid.startup();
            this.renderCategoryInfo(this.categoryData);
        },
        renderCategoryInfo:function(data){
            this.existingPropertyFomatterArray=[];
            this.existingPropertyMetaDataArray=[];
            var categoryMetaInfo=data;
            this.currentCategoryData=categoryMetaInfo;
            if(categoryMetaInfo.categoryId){
                this.currentCategoryMetaData=categoryMetaInfo;
                this.categoryCodeField.innerHTML=this.currentCategoryMetaData.categoryCode;
                this.categoryName_cnField.innerHTML=this.currentCategoryMetaData.categoryDisplayName_cn;
                this.category_enField.innerHTML=this.currentCategoryMetaData.categoryDisplayName_en;
                this.categoryDescriptionField.innerHTML=this.currentCategoryMetaData.comment;
                var propertiesData={};
                var propertiesName="";
                var that=this;
                if(this.currentCategoryMetaData.categoryPropertys){
                    dojo.forEach(this.currentCategoryMetaData.categoryPropertys,function(categoryProperty,idx){
                        if(categoryProperty.propertyType=="DATE"){
                            propertiesData[categoryProperty.propertyName]=new Date(parseInt(categoryProperty.propertyValue));
                        }else{
                            propertiesData[categoryProperty.propertyName]=categoryProperty.propertyValue;
                        }
                        if(categoryProperty.propertyType=="BOOLEAN"){
                            if(categoryProperty.propertyValue=="false"){
                                propertiesData[categoryProperty.propertyName]=false;
                            }else{
                                propertiesData[categoryProperty.propertyName]=true;
                            }
                        }
                        var currentPropertyFormatter=null;
                        if(categoryProperty.propertyType=="STRING"){
                            if(idx==0){
                                propertiesName=categoryProperty.propertyName+"(txt)";
                            }else{
                                propertiesName=propertiesName+","+categoryProperty.propertyName+"(txt)";
                            }
                            currentPropertyFormatter=new PropertyFormatter({
                                properties:categoryProperty.propertyName,
                                propertyName:categoryProperty.propertyName
                            });
                        }
                        if(categoryProperty.propertyType=="LONG"){
                            if(idx==0){
                                propertiesName=categoryProperty.propertyName+"(int)";
                            }else{
                                propertiesName=propertiesName+","+categoryProperty.propertyName+"(int)";
                            }
                            currentPropertyFormatter=new PropertyFormatter({
                                properties:categoryProperty.propertyName+"(int)",
                                propertyName:categoryProperty.propertyName
                            });
                        }
                        if(categoryProperty.propertyType=="DATE"){
                            if(idx==0){
                                propertiesName=categoryProperty.propertyName+"(dat)";
                            }else{
                                propertiesName=propertiesName+","+categoryProperty.propertyName+"(dat)";
                            }
                            currentPropertyFormatter=new PropertyFormatter({
                                properties:categoryProperty.propertyName+"(dat)",
                                propertyName:categoryProperty.propertyName
                            });
                        }
                        if(categoryProperty.propertyType=="DOUBLE"){
                            if(idx==0){
                                propertiesName=categoryProperty.propertyName+"(dec)";
                            }else{
                                propertiesName=propertiesName+","+categoryProperty.propertyName+"(dec)";
                            }
                            currentPropertyFormatter=new PropertyFormatter({
                                properties:categoryProperty.propertyName+"(dec)",
                                propertyName:categoryProperty.propertyName
                            });
                        }
                        if(categoryProperty.propertyType=="BOOLEAN"){
                            if(idx==0){
                                propertiesName=categoryProperty.propertyName+"(txt)";
                            }else{
                                propertiesName=propertiesName+","+categoryProperty.propertyName+"(txt)";
                            }
                            currentPropertyFormatter=new PropertyFormatter({
                                properties:categoryProperty.propertyName+"(txt)",
                                propertyName:categoryProperty.propertyName,
                                onChange:dojo.hitch(that,that.booleanPropertyUpdated)
                            });
                        }
                        if(categoryProperty.propertyType=="DECIMAL"){
                            if(idx==0){
                                propertiesName=categoryProperty.propertyName+"(dec)";
                            }else{
                                propertiesName=propertiesName+","+categoryProperty.propertyName+"(dec)";
                            }
                            currentPropertyFormatter=new PropertyFormatter({
                                properties:categoryProperty.propertyName+"(dec)",
                                propertyName:categoryProperty.propertyName
                            });
                        }
                        currentPropertyFormatter.startup();
                        that.categoryPropertiesGrid.addChild(currentPropertyFormatter);
                        that.existingPropertyFomatterArray.push(currentPropertyFormatter);
                        that.existingPropertyMetaDataArray.push({
                                propertyName:categoryProperty.propertyName,
                                propertyType:categoryProperty.propertyType,
                                propertyValue:categoryProperty.propertyValue
                            }
                        );
                    });
                    this.categoryPropertiesGrid.set("data",propertiesData);
                    this.categoryPropertiesGrid.set("properties",propertiesName);
                    this.categoryPropertiesGrid. refresh();

                }else{
                    this.categoryPropertiesGrid.set("data",[]);
                    this.categoryPropertiesGrid.set("properties",null);
                    this.categoryPropertiesGrid. refresh();
                }
            }else{
                this.currentCategoryMetaData=null;
                this.categoryIdField.set("value","");
                this.categoryCodeField.set("value","");
                this.categoryName_cnField.set("value","");
                this.category_enField.set("value","");
                this.categoryDescriptionField.set("value","");
                this.categoryPropertiesGrid.set("data",[]);
                this.categoryPropertiesGrid.set("properties",null);
                this.categoryPropertiesGrid. refresh();
            }
        },
        doCloseContainerDialog:function(){},
        destroy:function(){
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});