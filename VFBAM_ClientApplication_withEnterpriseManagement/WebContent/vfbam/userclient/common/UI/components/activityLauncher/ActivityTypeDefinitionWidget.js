require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activityLauncher/template/ActivityTypeDefinitionWidget.html",
    "dojo/dom-class","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,domClass,Dialog){
    declare("vfbam.userclient.common.UI.components.activityLauncher.ActivityTypeDefinitionWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            if(this.isOdd){
                domClass.add(this.activityTypeDefinition_1, "app_magazineView_item_odd");
                domClass.add(this.activityTypeDefinition_2, "app_magazineView_item_odd");
                domClass.add(this.activityTypeDefinition_3, "app_magazineView_item_odd");
            }else{
                domClass.add(this.activityTypeDefinition_1, "app_magazineView_item_even");
                domClass.add(this.activityTypeDefinition_2, "app_magazineView_item_even");
                domClass.add(this.activityTypeDefinition_3, "app_magazineView_item_even");
            }
            if(this.activityTypeDefinitionData.length>0){
                dojo.style(this.activityTypeContainer_1,"display","");
                this.activityType_1.innerHTML=this.activityTypeDefinitionData[0].activityType;
                this.activityTypeDesc_1.innerHTML=this.activityTypeDefinitionData[0].activityTypeDesc;
                dojo.connect(this.activityTypeInfo_1,"onclick",dojo.hitch(this,this._openLaunchActivityTypeDialog_1));
            }
            if(this.activityTypeDefinitionData.length>1){
                dojo.style(this.activityTypeContainer_2,"display","");
                this.activityType_2.innerHTML=this.activityTypeDefinitionData[1].activityType;
                this.activityTypeDesc_2.innerHTML=this.activityTypeDefinitionData[1].activityTypeDesc;
                dojo.connect(this.activityTypeInfo_2,"onclick",dojo.hitch(this,this._openLaunchActivityTypeDialog_2));
            }
            if(this.activityTypeDefinitionData.length>2){
                dojo.style(this.activityTypeContainer_3,"display","");
                this.activityType_3.innerHTML=this.activityTypeDefinitionData[2].activityType;
                this.activityTypeDesc_3.innerHTML=this.activityTypeDefinitionData[2].activityTypeDesc;
                dojo.connect(this.activityTypeInfo_3,"onclick",dojo.hitch(this,this._openLaunchActivityTypeDialog_3));
            }
        },
        _openLaunchActivityTypeDialog_1:function(){
            this._renderLaunchActivityDialog(this.activityTypeDefinitionData[0]);
        },
        _openLaunchActivityTypeDialog_2:function(){
            this._renderLaunchActivityDialog(this.activityTypeDefinitionData[1]);
        },
        _openLaunchActivityTypeDialog_3:function(){
            this._renderLaunchActivityDialog(this.activityTypeDefinitionData[2]);
        },
        _renderLaunchActivityDialog:function(activityTypeDefinition){
            var activityStarter=new vfbam.userclient.common.UI.components.activityLauncher.ActivityStarterWidget({activityTypeDefinition:activityTypeDefinition});
            var	dialog = new vfbam.userclient.common.UI.widgets.NonActionBarDialog({
                style:"width:600px;",
                title: "<i class='icon-retweet'></i> 启动业务活动",
                content: "",
                buttons: null
            });
            dialog.connect(activityStarter, "doCloseContainerDialog", "hide");
            dojo.place(activityStarter.containerNode, dialog.containerNode);
            dialog.show();
        },
        _endOfCode: function(){}
    });
});