require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/UserWorkedStepsWidget.html",
    "gridx/Grid","gridx/core/model/cache/Async",
    "gridx/modules/VirtualVScroller","gridx/modules/Pagination",
    "gridx/modules/pagination/PaginationBar",'gridx/modules/CellWidget','gridx/modules/Edit',
    'idx/gridx/modules/Sort','gridx/modules/Focus','gridx/modules/ColumnResizer',"gridx/modules/Menu","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Grid,Cache,VirtualVScroller,Pagination,PaginationBar,CellWidget,Edit,Sort,Focus,ColumnResizer,Menu,Dialog){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.UserWorkedStepsWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        userWorkedActivitiesStore:null,
        userWorkedActivitiesGrid:null,
        userWorkedActivitiesGridActivitiesDataMap:null,
        postCreate: function(){
            this.userWorkedActivitiesGridActivitiesDataMap={};
            var resultStructureLayout= this.buildGridFieldsStructure();
            var items=[];
            var data = {
                identifier: 'activityStepId',
                label: 'id',
                items:items
            };
            this.userWorkedActivitiesStore=new dojo.store.Memory({data: data,idProperty: "activityStepId"});
            this.userWorkedActivitiesGrid = new Grid(lang.mixin({
                style:"height:400px;width:100%",
                'class': 'gridxAlternatingRows gridxWholeRow',
                cacheClass: Cache,
                selectionMode:"multiple",
                store:this.userWorkedActivitiesStore,
                structure: resultStructureLayout,
                modules: [
                    VirtualVScroller,
                    CellWidget,
                    Sort,
                    ColumnResizer,
                    Pagination,
                    PaginationBar,
                    Menu
                ],
                selectRowTriggerOnCell: true}, {}),this.userStartedActivitiesGridContainer);
            this.userWorkedActivitiesGrid.startup();

            var that=this;
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                var resizeObj={};
                resizeObj.w=720;
                that.userWorkedActivitiesGrid.resize(resizeObj);
                timer.stop();
            };
            timer.start();
            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=ACTIVITY_SERVICE_ROOT+"participantWorkedActivitySteps/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                that.loadActivityStepsData(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        loadActivityStepsData:function(data){
            var that=this;
            var items=[];
            dojo.forEach(data,function(activityData){
                var activityStepId=activityData.activityId+activityData.activityStepName;
                that.userWorkedActivitiesGridActivitiesDataMap[activityStepId]=activityData;
                var currentActivityData={};
                currentActivityData.activityStepId=activityStepId;
                currentActivityData.activityType=activityData.activityType+"("+activityData.activityId+")";
                currentActivityData.createDate=new Date(activityData.createTime);
                currentActivityData.stepName=activityData.activityStepName;
                currentActivityData.activityOperations=activityStepId;
                items.push(currentActivityData);
            });
            var data = {
                identifier: 'activityStepId',
                label: 'id',
                items:items
            };
            this.userWorkedActivitiesStore=new dojo.store.Memory({data: data,idProperty: "activityStepId"});
            this.userWorkedActivitiesGrid.setStore(this.userWorkedActivitiesStore);
        },
        buildGridFieldsStructure:function(){
            var that=this;
            var _system_String_Prop_Decorator=  function(data){
                if(!data){return ""};
                return '<span style="font-weight: bold;font-size: 0.9em;">'+data+'</span>';
            };
            var _system_Date_Prop_Decorator=  function(data){
                if(!data){return ""};
                var dateStr=dojo.date.locale.format(data);
                return '<span style="font-weight: bold;font-size: 0.8em;">'+dateStr+'</span>';
            };
            var resultStructureLayout=[];
            resultStructureLayout.push({id: 'stepName', field: 'stepName', name: '<i class="icon-tag"></i> 任务名称',width:"200px",decorator: _system_String_Prop_Decorator});
            resultStructureLayout.push({id: 'activityType', field: 'activityType', name: '<i class="icon-retweet"></i> 所属活动',width:"240px",decorator: _system_String_Prop_Decorator});
            resultStructureLayout.push({id: 'createDate', field: 'createDate', name: '<i class="icon-time"></i> 创建时间',width:"120px",decorator: _system_Date_Prop_Decorator});
            var actionButtonDecorator = function(){
                var template="<div style='text-align:left;'><div data-dojo-type='idx.form.Link' data-dojo-attach-point='showDetailLink' label='"+"<b>活动任务详情</b>"+"'>"+"</div>"+"</div>";
                return template;
            };
            var actionButtonSetCellValue = function(data){
                var showDetailLinkClickCallback=function(){that.showActivityStepDetail(data);};
                this.showDetailLink.set('onClick', showDetailLinkClickCallback);
            };
            resultStructureLayout.push({id: 'activityOperations', field: 'activityOperations', name: '<i class="icon-info-sign"></i> 详细信息',widgetsInCell: true,
                decorator: actionButtonDecorator,setCellValue:actionButtonSetCellValue});
            return  resultStructureLayout;
        },
        showActivityStepDetail:function(data){
            var selectedActivityStepData=this.userWorkedActivitiesGridActivitiesDataMap[data];
            var activityStepDetail=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityStepDetailWidget({activityStepData:selectedActivityStepData});
            var	dialog = new Dialog({
                style:"width:760px;",
                title: "<i class='icon-info-sign'></i> 活动任务详情",
                content: "",
                buttons:null,
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(activityStepDetail.containerNode, dialog.containerNode);
            dialog.show();
            var closeDialogCallBack=function(){
                activityStepDetail.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        destroy:function(){
            if(this.userWorkedActivitiesGrid){
                this.userWorkedActivitiesGrid.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});