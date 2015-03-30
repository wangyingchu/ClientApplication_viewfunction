require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationMenuListWidget.html",
    "idx/widget/MenuDialog"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuListWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        expandStatus:null,
        categoryDataStore:null,
        postCreate: function() {
            this.expandStatus=true;
            this._loadKnowledgeCategoryInheritDataStore();
        },
        _loadKnowledgeCategoryInheritDataStore:function(){
            var that=this;
            var callBack=function(storeData){
                that.categoryDataStore=storeData;
                that._renderKnowledgeNavigationMenuItems();
            };
            KnowledgeBaseDataHandleUtil.generateKnowledgeCategoryInheritDataStore(callBack);
        },
        _renderKnowledgeNavigationMenuItems:function(){
            var categoryData0=this._getCategoryDataById("1_2_10_1");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData0,isLastMenuItem:false},this.categoryItemContainer0);
            var categoryData1=this._getCategoryDataById("1_2_10_2");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData1,isLastMenuItem:false},this.categoryItemContainer1);
            var categoryData2=this._getCategoryDataById("1_2_10_3");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData2,isLastMenuItem:true},this.categoryItemContainer2);

            var categoryData3=this._getCategoryDataById("5_12_10_2");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData3,isLastMenuItem:false},this.categoryItemContainer3);
            var categoryData4=this._getCategoryDataById("5_12_10_3");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData4,isLastMenuItem:false},this.categoryItemContainer4);
            var categoryData5=this._getCategoryDataById("5_12_10_4");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData5,isLastMenuItem:false},this.categoryItemContainer5);
            var categoryData6=this._getCategoryDataById("5_12_10_5");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData6,isLastMenuItem:true},this.categoryItemContainer6);

            var categoryData7=this._getCategoryDataById("5_26_2");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData7,isLastMenuItem:false},this.categoryItemContainer7);
            var categoryData8=this._getCategoryDataById("5_26_3");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData8,isLastMenuItem:false},this.categoryItemContainer8);
            var categoryData9=this._getCategoryDataById("5_26_4");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData9,isLastMenuItem:false},this.categoryItemContainer9);
            var categoryData10=this._getCategoryDataById("5_26_5");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData10,isLastMenuItem:false},this.categoryItemContainer10);
            var categoryData11=this._getCategoryDataById("5_26_6");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData11,isLastMenuItem:true},this.categoryItemContainer11);

            var categoryData12=this._getCategoryDataById("5_28_2");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData12,isLastMenuItem:false},this.categoryItemContainer12);
            var categoryData13=this._getCategoryDataById("5_28_3");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData13,isLastMenuItem:false},this.categoryItemContainer13);
            var categoryData14=this._getCategoryDataById("5_28_4");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData14,isLastMenuItem:false},this.categoryItemContainer14);
            var categoryData15=this._getCategoryDataById("5_28_5");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData15,isLastMenuItem:true},this.categoryItemContainer15);

            var categoryData16=this._getCategoryDataById("11_1");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData16,isLastMenuItem:false},this.categoryItemContainer16);
            var categoryData17=this._getCategoryDataById("11_3");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData17,isLastMenuItem:false},this.categoryItemContainer17);
            var categoryData18=this._getCategoryDataById("11_4");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData18,isLastMenuItem:false},this.categoryItemContainer18);
            var categoryData19=this._getCategoryDataById("11_5");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData19,isLastMenuItem:false},this.categoryItemContainer19);
            var categoryData20=this._getCategoryDataById("11_6");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData20,isLastMenuItem:false},this.categoryItemContainer20);
            var categoryData21=this._getCategoryDataById("11_7");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData21,isLastMenuItem:false},this.categoryItemContainer21);
            var categoryData22=this._getCategoryDataById("11_8");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData22,isLastMenuItem:false},this.categoryItemContainer22);
            var categoryData23=this._getCategoryDataById("11_9");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData23,isLastMenuItem:false},this.categoryItemContainer23);
            var categoryData24=this._getCategoryDataById("11_10");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData24,isLastMenuItem:false},this.categoryItemContainer24);
            var categoryData25=this._getCategoryDataById("11_11");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData25,isLastMenuItem:false},this.categoryItemContainer25);
            var categoryData26=this._getCategoryDataById("11_12");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData26,isLastMenuItem:true},this.categoryItemContainer26);

            var categoryData27=this._getCategoryDataById("1_2_9_1");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData27,isLastMenuItem:false},this.categoryItemContainer27);
            var categoryData28=this._getCategoryDataById("1_2_9_2");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData28,isLastMenuItem:true},this.categoryItemContainer28);


            var categoryData29=this._getCategoryDataById("5_27_2");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData29,isLastMenuItem:false},this.categoryItemContainer29);
            var categoryData30=this._getCategoryDataById("5_27_3");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData30,isLastMenuItem:false},this.categoryItemContainer30);
            var categoryData31=this._getCategoryDataById("5_27_4");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData31,isLastMenuItem:true},this.categoryItemContainer31);

            var categoryData32=this._getCategoryDataById("4_3_3_2");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData32,isLastMenuItem:false},this.categoryItemContainer32);
            var categoryData33=this._getCategoryDataById("4_3_3_3");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData33,isLastMenuItem:false},this.categoryItemContainer33);
            var categoryData34=this._getCategoryDataById("4_3_3_4");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData34,isLastMenuItem:false},this.categoryItemContainer34);
            var categoryData35=this._getCategoryDataById("4_3_3_5");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData35,isLastMenuItem:false},this.categoryItemContainer35);
            var categoryData36=this._getCategoryDataById("4_3_3_6");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData36,isLastMenuItem:false},this.categoryItemContainer36);
            var categoryData37=this._getCategoryDataById("4_3_3_7");
            new vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationMenuItemWidget({categoryData:categoryData37,isLastMenuItem:true},this.categoryItemContainer37);
        },
        _getCategoryDataById:function(categoryId){
            var categoryData=this.categoryDataStore.get(categoryId);
            return categoryData;
        },
        showHideContent:function(){
            this.expandStatus=!this.expandStatus;
            if(this.expandStatus){
                dojo.style(this.expandIndicator,"display","none");
                dojo.style(this.contractIndicator,"display","");
                dojo.style(this.contentContainer,"display","");
            }else{
                dojo.style(this.expandIndicator,"display","");
                dojo.style(this.contractIndicator,"display","none");
                dojo.style(this.contentContainer,"display","none");
            }
            Application.MessageUtil.publishMessage(APP_KNOWLEDGEBASE_UPDATEKNOWLEDGEDISPLAYPANELHEIGHT_EVENT,{});
        },
        _endOfCode: function(){}
    });
});