require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/categoryEditor/template/CategoryInfoWidget.html","dojo/store/Memory",
    "idx/grid/PropertyFormatter","idx/grid/PropertyGrid",
    "idx/form/DateTimeTextBox",
    "idx/form/NumberTextBox",
    "idx/form/CheckBox"
],function(lang,declare, _Widget, _Templated, template,Memory,PropertyFormatter,PropertyGrid,DateTimeTextBox,NumberTextBox,CheckBox){
    declare("vfbam.userclient.components.knowledgeBase.widget.categoryEditor.CategoryInfoWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        categorySelectedListenerHandler:null,
        rootCategoryNodeId:null,
        currentCategoryMetaData:null,
        categoryPropertiesGrid:null,
        existingPropertyFomatterArray:null,
        existingPropertyMetaDataArray:null,
        addNewPropertyMenuDialog:null,
        addNewPropertyDropDown:null,
        removePropertyMenuDialog:null,
        removePropertyDropDown:null,
        postCreate: function(){
            this.categorySelectedListenerHandler= Application.MessageUtil.listenToMessageTopic(APP_KNOWLEDGEBASE_CATEGORYSELECTED_EVENT,  dojo.hitch(this,this.renderCategoryInfo));
            this.categoryPropertiesGrid=new idx.grid.PropertyGrid({
                data:[],
                properties:null,
                onChange:dojo.hitch(this,this.updatePropertyValue)
            },this.propertiesGridContainer);
            this.categoryPropertiesGrid.startup();

            this.addNewPropertyMenuDialog=new idx.widget.MenuDialog();
            this.addNewPropertyDropDown=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.AddCategoryPropertyWidget({categoryInfoWidget:this});
            dojo.place(this.addNewPropertyDropDown.domNode, this.addNewPropertyMenuDialog.containerNode);
            this.addNewPropertyLink.set("dropDown",this.addNewPropertyMenuDialog);
            this.removePropertyMenuDialog=new idx.widget.MenuDialog();
            this.removePropertyDropDown=new vfbam.userclient.components.knowledgeBase.widget.categoryEditor.RemoveCategoryPropertyWidget({});
            dojo.place(this.removePropertyDropDown.domNode, this.removePropertyMenuDialog.containerNode);
            this.removePropertyLink.set("dropDown",this.removePropertyMenuDialog);
        },
        renderCategoryInfo:function(data){
            /*
            dojo.forEach(this.existingPropertyFomatterArray,function(currentFormatter){
                currentFormatter.destroy();
            });
            */
            this.existingPropertyFomatterArray=[];
            this.existingPropertyMetaDataArray=[];
            var categoryMetaInfo=data.category;
            if(categoryMetaInfo.categoryId){
                this.currentCategoryMetaData=categoryMetaInfo;
                this.categoryIdField.set("value",this.currentCategoryMetaData.categoryId);
                this.categoryName_cnField.set("value",this.currentCategoryMetaData.categoryDisplayName_cn);
                this.category_enField.set("value",this.currentCategoryMetaData.categoryDisplayName_en);
                this.categoryDescriptionField.set("value",this.currentCategoryMetaData.comment);
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
                            var dataField=new dijit.form.TextBox();
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
                            var dataField=new NumberTextBox();
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
                            var dataField=new dijit.form.DateTextBox({intermediateChanges:true});
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
                            var dataField=new NumberTextBox();
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
                            var dataField=new CheckBox();
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
                            var dataField=new NumberTextBox();
                        }
                        currentPropertyFormatter.addChild(dataField);
                        currentPropertyFormatter.startup();
                        that.categoryPropertiesGrid.addChild(currentPropertyFormatter);
                        that.existingPropertyFomatterArray.push(currentPropertyFormatter);
                        that.existingPropertyMetaDataArray.push({
                                propertyName:categoryProperty.propertyName,
                                propertyType:categoryProperty.propertyType,
                                propertyValue:categoryProperty.propertyValue,
                                propertyEditor:dataField
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
                this.categoryName_cnField.set("value","");
                this.category_enField.set("value","");
                this.categoryDescriptionField.set("value","");
                this.categoryPropertiesGrid.set("data",[]);
                this.categoryPropertiesGrid.set("properties",null);
                this.categoryPropertiesGrid. refresh();
            }
        },
        updatePropertyValue:function(data, grid, formatter){
            var categoryPropertys=[];
            var propertyValue;
            dojo.forEach(this.existingPropertyMetaDataArray,function(propertyMetaData){
                if(propertyMetaData.propertyType=="STRING"){
                    if(propertyMetaData.propertyEditor.get("value")==""){
                        propertyValue=propertyMetaData.propertyValue;
                    }else{
                        propertyValue=propertyMetaData.propertyEditor.get("value");
                    }
                }
                if(propertyMetaData.propertyType=="DATE"){
                    if(!propertyMetaData.propertyEditor.get("value")){
                        propertyValue=propertyMetaData.propertyValue;
                    }else{
                        propertyValue=""+propertyMetaData.propertyEditor.get("value").getTime();
                    }
                }
                if(propertyMetaData.propertyType=="LONG"||propertyMetaData.propertyType=="DOUBLE"||propertyMetaData.propertyType=="DECIMAL"){
                    if(!propertyMetaData.propertyEditor.get("value")){
                        propertyValue=propertyMetaData.propertyValue;
                    }else{
                        propertyValue=""+propertyMetaData.propertyEditor.get("value");
                    }
                }
                if(propertyMetaData.propertyType=="BOOLEAN"){
                    if(propertyMetaData.propertyUpdated){
                        if(propertyMetaData.propertyEditor.get("checked")){
                            propertyValue="true";
                        }else{
                            propertyValue="false";
                        }
                    }else{
                        propertyValue=propertyMetaData.propertyValue;
                    }
                }
                categoryPropertys.push({
                    propertyName:propertyMetaData.propertyName,
                    propertyType:propertyMetaData.propertyType,
                    propertyValue:propertyValue

                });
            });
            var newPropertiesDataObj={};
            newPropertiesDataObj["categoryNodeLocation"]= this.currentCategoryMetaData.categoryNodeLocation;
            newPropertiesDataObj["categoryPropertys"]=categoryPropertys;
            var newPropertiesDataObjContent=dojo.toJson(newPropertiesDataObj);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"updateCategoryProperties/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                UI.showToasterMessage({type:"success",message:"更新分类业务属性成功"});
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_UPDATECATEGORYDATA_EVENT,{category:data});
            };
            Application.WebServiceUtil.postJSONData(resturl,newPropertiesDataObjContent,loadCallback,errorCallback);
        },
        booleanPropertyUpdated:function(data, formatter){
            dojo.forEach(this.existingPropertyMetaDataArray,function(propertyMetaData){
                if(propertyMetaData.propertyName==formatter.propertyName){
                    propertyMetaData["propertyUpdated"]=true;
                }
            });
        },
        updateBasicProperties:function(){
            var that=this;
            var messageTxt="<b>请确认是否更新分类基本属性</b>?";
            var confirmButtonAction=function(){
                that.doUpdateBasicProperties();
            };
            var cancelButtonAction=function(){}
            UI.showConfirmDialog({
                message:messageTxt,
                confirmButtonLabel:"<i class='icon-ok'></i> 更新",
                cancelButtonLabel:"<i class='icon-remove'></i> 取消",
                confirmButtonAction:confirmButtonAction,
                cancelButtonAction:cancelButtonAction
            });
        },
        doUpdateBasicProperties:function(){
            var newPropertiesDataObj={};
            newPropertiesDataObj["categoryNodeLocation"]= this.currentCategoryMetaData.categoryNodeLocation;
            newPropertiesDataObj["categoryDisplayName_cn"]=this.categoryName_cnField.get("value");
            newPropertiesDataObj["categoryDisplayName_en"]=this.category_enField.get("value");
            newPropertiesDataObj["comment"]=this.categoryDescriptionField.get("value");
            var newPropertiesDataObjContent=dojo.toJson(newPropertiesDataObj);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"updateCategoryInfo/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                UI.showToasterMessage({type:"success",message:"更新分类基本属性成功"});
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_UPDATECATEGORYDATA_EVENT,{category:data});
            };
            Application.WebServiceUtil.postJSONData(resturl,newPropertiesDataObjContent,loadCallback,errorCallback);
        },
        addNewProperty:function(categoryProperty){
            var updatedCategoryPropertiesArray=[];
            var currentCategoryProperties=this.currentCategoryMetaData.categoryPropertys;
            if(currentCategoryProperties){
                var isDuplate=false;
                dojo.forEach(currentCategoryProperties,function(propertyData){
                    if(propertyData.propertyName==categoryProperty.propertyName){
                        isDuplate=true;
                    }
                });
                if(isDuplate){
                    UI.showToasterMessage({type:"warn",message:"属性: "+categoryProperty.propertyName+" 已经存在"});
                    return;
                }else{
                    dojo.forEach(currentCategoryProperties,function(singleProperty){
                        updatedCategoryPropertiesArray.push({
                            propertyName:singleProperty.propertyName,
                            propertyType:singleProperty.propertyType,
                            propertyValue:singleProperty.propertyValue
                        });
                    });
                }
            }
            updatedCategoryPropertiesArray.push(categoryProperty);
            var that=this;
            var newPropertiesDataObj={};
            newPropertiesDataObj["categoryNodeLocation"]= this.currentCategoryMetaData.categoryNodeLocation;
            newPropertiesDataObj["categoryPropertys"]=updatedCategoryPropertiesArray;
            var newPropertiesDataObjContent=dojo.toJson(newPropertiesDataObj);
            var resturl=KNOWLEDGE_CATEGORY_SERVICE_ROOT+"updateCategoryProperties/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var loadCallback=function(data){
                UI.showToasterMessage({type:"success",message:"添加分类业务属性成功"});
                that.renderCategoryInfo({category:data});
                that.addNewPropertyMenuDialog.close();
                that.addNewPropertyDropDown.clearInput();
                Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_UPDATECATEGORYDATA_EVENT,{category:data});
            };
            Application.WebServiceUtil.postJSONData(resturl,newPropertiesDataObjContent,loadCallback,errorCallback);
        },
        destroy:function(){
            this.categorySelectedListenerHandler.calcelMessageListening();
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});