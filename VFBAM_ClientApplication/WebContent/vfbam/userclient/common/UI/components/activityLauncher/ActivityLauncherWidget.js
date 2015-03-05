require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activityLauncher/template/ActivityLauncherWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.activityLauncher.ActivityLauncherWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            var activityOperatorObject={};
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            activityOperatorObject["activitySpaceName"]=APPLICATION_ID;
            activityOperatorObject["operatorId"]=userId;
            var activityOperatorObjectContent=dojo.toJson(activityOperatorObject);
            var resturl=ACTIVITY_SERVICE_ROOT+"activityTypeDefinitions/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                that.renderActivityTypesInfo(data);
            }
            Application.WebServiceUtil.postJSONData(resturl,activityOperatorObjectContent,loadCallback,errorCallback);
        },
        renderActivityTypesInfo:function(activityTypeDefineArray){
            var isOdd=true;
            if(activityTypeDefineArray.length<=3){
                var currentField=new vfbam.userclient.common.UI.components.activityLauncher.ActivityTypeDefinitionWidget({activityTypeDefinitionData:activityTypeDefineArray,isOdd:isOdd});
                this.activityTypeDefinitionsContainer.appendChild(currentField.domNode);
            }else{
                var lineCount=parseInt(activityTypeDefineArray.length/3);
                var lastOnInLoop=0;
                var totalNumber=0;
                for(var i=0;i<lineCount;i++){
                    var currentLineActivityDefinition=[];
                    var item1= totalNumber+0;
                    var item2=totalNumber+1;
                    var item3=totalNumber+2; 
                    currentLineActivityDefinition.push(activityTypeDefineArray[item1]);
                    currentLineActivityDefinition.push(activityTypeDefineArray[item2]);
                    currentLineActivityDefinition.push(activityTypeDefineArray[item3]);
                    var currentField=new vfbam.userclient.common.UI.components.activityLauncher.ActivityTypeDefinitionWidget({activityTypeDefinitionData:currentLineActivityDefinition,isOdd:isOdd});
                    isOdd=!isOdd;
                    this.activityTypeDefinitionsContainer.appendChild(currentField.domNode);
                    lastOnInLoop=item3;
                    totalNumber=item3+1;
                }
                var finalLineActivityDefinition=[];
                var remainItems=activityTypeDefineArray.length-(lineCount*3);
                if(remainItems>0){
                    finalLineActivityDefinition.push(activityTypeDefineArray[ lastOnInLoop+1]);
                }
                if(remainItems>1){
                    finalLineActivityDefinition.push(activityTypeDefineArray[ lastOnInLoop+2]);
                }
                if(finalLineActivityDefinition.length>0){
                    var currentField=new vfbam.userclient.common.UI.components.activityLauncher.ActivityTypeDefinitionWidget({activityTypeDefinitionData:finalLineActivityDefinition,isOdd:isOdd});
                    this.activityTypeDefinitionsContainer.appendChild(currentField.domNode);
                }
            }
        },
        _endOfCode: function(){}
    });
});