require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/components/knowledgeBase/widget/knowledgeSearch/template/KnowledgeNavigationBarWidget.html",
    "idx/widget/MenuDialog"
],function(lang,declare, _Widget, _Templated, template){
    declare("vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationBarWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        postCreate: function(){
            var that=this;
            var itemNumber=this.knowledgeNavigateItemInfo.length;
            dojo.forEach(this.knowledgeNavigateItemInfo,function(navigateItem,idx){
                var label=that._buildNavigationItemLabel(navigateItem.itemName);
                var itemDropDown=that._buildNavigationItemDropDown(navigateItem.itemName,navigateItem.options);
                var currentItem=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:label,dropDown: itemDropDown});
                that.navigationItemContainer.appendChild(currentItem.domNode);
                if(idx<itemNumber-1){
                    var itemDiv=dojo.create("span",{style:"color:#CCCCCC;font-size:0.8em;padding-left:5px;padding-right: 7px;",innerHTML:"|"});
                    that.navigationItemContainer.appendChild(itemDiv);
                }
            });
            if(this.externalResourceItemInfo){
                var itemDiv=dojo.create("span",{style:"color:#CCCCCC;font-size:0.8em;padding-left:20px;padding-right: 7px;",innerHTML:"|"});
                that.externalResourceItemContainer.appendChild(itemDiv);
                var label=that._buildExternalResourceItemLabel(this.externalResourceItemInfo.itemName);
                var itemDropDown=that._buildExternalResourceItemDropDown(this.externalResourceItemInfo.resource);
                var currentItem=new vfbam.userclient.common.UI.widgets.TextDropdownButton({label:label,dropDown: itemDropDown});
                that.externalResourceItemContainer.appendChild(currentItem.domNode);
            }
        },
        _buildNavigationItemLabel:function(itemName){
            var perfixString='<span style="font-size: 1.2em;padding-right: 5px;color: #457faa;font-weight: bold;">';
            var postfix='&nbsp;<i class="icon-caret-down icon-border icon-large"></i></span>';
            var label=perfixString+itemName+postfix;
            return label;
        },
        _buildExternalResourceItemLabel:function(itemName){
            var perfixString='<span style="font-size: 1.2em;padding-right: 5px;color: #457faa;font-weight: bold;">';
            var postfix='&nbsp;<i class="icon-external-link"></i></span>';
            var label=perfixString+itemName+postfix;
            return label;
        },
        _buildNavigationItemDropDown:function(name,options){
            var currentMenuDialog=new idx.widget.MenuDialog();
            var currentNavigationList=vfbam.userclient.components.knowledgeBase.widget.knowledgeSearch.KnowledgeNavigationListWidget({navigationName:name,navigationOptions:options,containerDialog:currentMenuDialog});
            dojo.place(currentNavigationList.domNode, currentMenuDialog.containerNode);
            return currentMenuDialog;
        },
        _buildExternalResourceItemDropDown:function(resource){
            var currentMenuDialog=new idx.widget.MenuDialog();
            return currentMenuDialog;
        },
        _endOfCode: function(){}
    });
});