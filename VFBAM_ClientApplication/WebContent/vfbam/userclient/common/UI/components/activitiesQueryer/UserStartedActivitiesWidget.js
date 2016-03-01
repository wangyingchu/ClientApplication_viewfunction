require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/activitiesQueryer/template/UserStartedActivitiesWidget.html",
    "gridx/Grid","gridx/core/model/cache/Async",
    "gridx/modules/VirtualVScroller","gridx/modules/Pagination",
    "gridx/modules/pagination/PaginationBar",'gridx/modules/CellWidget','gridx/modules/Edit',
    'idx/gridx/modules/Sort','gridx/modules/Focus','gridx/modules/ColumnResizer',"gridx/modules/Menu","idx/oneui/Dialog"
],function(lang,declare, _Widget, _Templated, template,Grid,Cache,VirtualVScroller,Pagination,PaginationBar,CellWidget,Edit,Sort,Focus,ColumnResizer,Menu,Dialog){
    declare("vfbam.userclient.common.UI.components.activitiesQueryer.UserStartedActivitiesWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        userStartedActivitiesStore:null,
        userStartedActivitiesGrid:null,
        userStartedActivitiesDataMap:null,
        postCreate: function(){
            this.userStartedActivitiesDataMap={};
            var resultStructureLayout= this.buildGridFieldsStructure();
            var items=[];
            var data = {
                identifier: 'activityId',
                label: 'id',
                items:items
            };
            this.userStartedActivitiesStore=new dojo.store.Memory({data: data,idProperty: "activityId"});
            this.userStartedActivitiesGrid = new Grid(lang.mixin({
                style:"height:400px;width:100%",
                'class': 'gridxAlternatingRows gridxWholeRow',
                cacheClass: Cache,
                selectionMode:"multiple",
                store:this.userStartedActivitiesStore,
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
            this.userStartedActivitiesGrid.startup();

            var that=this;
            var timer = new dojox.timing.Timer(300);
            timer.onTick = function(){
                var resizeObj={};
                resizeObj.w=720;
                that.userStartedActivitiesGrid.resize(resizeObj);
                timer.stop();
            };
            timer.start();

            var userId=Application.AttributeContext.getAttribute(USER_PROFILE).userId;
            var resturl=ACTIVITY_SERVICE_ROOT+"participantStartedActivities/"+APPLICATION_ID+"/"+userId+"/";
            var errorCallback= function(data){
                UI.showSystemErrorMessage(data);
            };
            var that=this;
            var loadCallback=function(data){
                that.loadActivitiesData(data);
            };
            Application.WebServiceUtil.getJSONData(resturl,true,null,loadCallback,errorCallback);
        },
        loadActivitiesData:function(data){
            var that=this;
            var items=[];
            dojo.forEach(data,function(activityData){
                var activityKey=activityData.activityId;
                that.userStartedActivitiesDataMap[activityKey]=activityData;
                var currentActivityData={};
                currentActivityData.activityId=activityData.activityId;
                currentActivityData.activityType=activityData.activityTypeDefinition.activityType+"("+activityData.activityId+")";
                currentActivityData.createDate=new Date(activityData.activityStartTime);
                currentActivityData.activityStatus=activityData.isFinished;
                currentActivityData.activityOperations=activityData.activityId;
                items.push(currentActivityData);
            });
            var data = {
                identifier: 'activityId',
                label: 'id',
                items:items
            };
            this.teamTaskListStore=new dojo.store.Memory({data: data,idProperty: "activityId"});
            this.userStartedActivitiesGrid.setStore(this.teamTaskListStore);
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
            var _activityStatus_Prop_Decorator=  function(data){
                if(data){
                    return '<span style="font-weight: bold;font-size: 0.9em;color:#26a251;text-align: center;">'+"已完成"+'</span>';
                }else{
                    return '<span style="font-weight: bold;font-size: 0.9em;text-align: center;">'+"进行中"+'</span>';
                }
            };
            var resultStructureLayout=[];
            resultStructureLayout.push({id: 'activityType', field: 'activityType', name: '<i class="icon-retweet"></i> 活动名称',width:"350px",decorator: _system_String_Prop_Decorator});
            resultStructureLayout.push({id: 'createDate', field: 'createDate', name: '<i class="icon-time"></i> 创建时间',width:"120px",decorator: _system_Date_Prop_Decorator});
            resultStructureLayout.push({id: 'activityStatus', field: 'activityStatus', name: '<i class="icon-ok-circle"></i> 当前状态',width:"80px",decorator: _activityStatus_Prop_Decorator});

            var actionButtonDecorator = function(){
                var template="<div style='text-align:left;'><div data-dojo-type='idx.form.Link' data-dojo-attach-point='showDetailLink' label='"+"<b>业务活动详情</b>"+"'>"+"</div>"+"</div>";
                return template;
            };
            var actionButtonSetCellValue = function(data){
                var showDetailLinkClickCallback=function(){that.showActivityDetail(data);};
                this.showDetailLink.set('onClick', showDetailLinkClickCallback);
            };
            resultStructureLayout.push({id: 'activityOperations', field: 'activityOperations', name: '<i class="icon-info-sign"></i> 详细信息',widgetsInCell: true,
                decorator: actionButtonDecorator,setCellValue:actionButtonSetCellValue});
            return  resultStructureLayout;
        },
        showActivityDetail:function(data){
            var selectedActivityData=this.userStartedActivitiesDataMap[data];
            var activityInstanceDetail=new vfbam.userclient.common.UI.components.activitiesQueryer.ActivityInstanceDetailWidget({activityInstanceData:selectedActivityData});
            var	dialog = new Dialog({
                style:"width:760px;",
                title: "<i class='icon-info-sign'></i> 业务活动详情",
                content: "",
                buttons:null,
                closeButtonLabel: "<i class='icon-remove'></i> 关闭"
            });
            dojo.place(activityInstanceDetail.containerNode, dialog.containerNode);
            dialog.show();
            var closeDialogCallBack=function(){
                activityInstanceDetail.destroy();
            };
            dojo.connect(dialog,"hide",closeDialogCallBack);
        },
        destroy:function(){
            if(this.userStartedActivitiesGrid){
                this.userStartedActivitiesGrid.destroy();
            }
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});