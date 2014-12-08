require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/historyList/template/HistoryListWidget.html"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.common.UI.components.historyList.HistoryListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        currentHistorysArray:null,
        postCreate: function(){
            this.currentHistorysArray=[];
            var historyList=this.getHistorysList();
            this.renderHistorysList(historyList);
        },
        getHistorysList:function(){
            var historyListArray=[];
            var history1={};
            var participant1={};
            participant1.participantPhotoPath="images/86479729_.jpg";
            participant1.participantName="同事A";
            participant1.participantId="user1";
            participant1.participantTitle="IT部经理";
            participant1.participantDesc="员工详细工作职责介绍";
            participant1.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant1.participantPhone="0951-4567823";
            participant1.participantEmail="mail1@viewfunction.com";
            history1.actionPerformer=participant1;
            history1.actionTag="启动活动";
            history1.actionDate=new Date();
            historyListArray.push(history1);

            var history2={};
            var participant2={};
            participant2.participantPhotoPath="images/86530525_.jpg";
            participant2.participantName="领导C";
            participant2.participantId="user2";
            participant2.participantTitle="IT部经理.12345";
            participant2.participantDesc="员工详细工作职责介绍";
            participant2.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant2.participantPhone="13411223345";
            participant2.participantEmail="mail2@viewfunction.com";
            history2.actionPerformer=participant2;
            history2.actionTag="添加文档";
            history2.actionDate=new Date();
            historyListArray.push(history2);

            var history3={};
            var participant3={};
            participant3.participantPhotoPath="images/87569996_.jpg";
            participant3.participantName="同事B";
            participant3.participantId="user3";
            participant3.participantTitle="IT部经理.12345";
            participant3.participantDesc="员工详细工作职责介绍";
            participant3.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant3.participantPhone="13677885534";
            participant3.participantEmail="mail3@viewfunction.com";
            history3.actionPerformer=participant3;
            history3.actionTag="处理步骤A";
            history3.actionDate=new Date();
            historyListArray.push(history3);

            var history4={};
            var participant4={};
            participant4.participantPhotoPath="images/118946479_.jpg";
            participant4.participantName="同事C";
            participant4.participantId="user4";
            participant4.participantTitle="IT部经理.12345";
            participant4.participantDesc="员工详细工作职责介绍";
            participant4.participantAddress="北京市海淀区东北旺西路8号中关村软件园28号 100096";
            participant4.participantPhone="15966783456";
            participant4.participantEmail="mail4@viewfunction.com";
            history4.actionPerformer=participant4;
            history4.actionTag="处理步骤B";
            history4.actionDate=new Date();
            historyListArray.push(history4);
            return historyListArray;
        },
        renderHistorysList:function(historyList){
            dojo.empty(this.historyListContainer);
            for(x=0;x<this.currentHistorysArray.length;i++){
                this.currentHistorysArray[x].destroy();
            }
            for(i=0;i<historyList.length;i++){
                var currentHistory= historyList[i];
                var currentHistoryInfoWidget=new vfbam.userclient.common.UI.components.historyList.HistoryInfoWidget({historyInfo:currentHistory});
                this.currentHistorysArray.push(currentHistoryInfoWidget);
                this.historyListContainer.appendChild(currentHistoryInfoWidget.domNode);
                var divTr=dojo.create("tr",null);
                var divTd=dojo.create("td",{colspan:2},divTr);
                var divDiv= dojo.create("div",{"class":"app_headerDivLine_thin"},divTd);
                this.historyListContainer.appendChild(divTr);
            }
        },
        destroy:function(){
            dojo.forEach(this.currentHistorysArray,function(currentWidget){
                currentWidget.destroy();
            },this);
            this.inherited("destroy",arguments);
        },
        _endOfCode: function(){}
    });
});