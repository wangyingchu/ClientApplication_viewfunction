/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/window",
    "dojo/_base/array",
    "dojo/touch",
    "dojo/on",
    "dojo/keys",
    "dojo/mouse",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_CssStateMixin"
],function( lang, declare, connect, winUtil, array, touch, on, keys, mouse, domAttr, domConstruct, domClass, _WidgetBase, _TemplatedMixin, _CssStateMixin){
    // bottom dock container stuff
    var _DockNode = declare([_WidgetBase, _TemplatedMixin],{
        title: "",
        paneRef: null,
        gridRef: null,
        dockNodeContainer: null,

        templateString:
            '<li class="dojoxDockNode fpDockNode">'+
                '<span data-dojo-attach-point="restoreNode" class="dojoxDockRestoreButton fpDockRestoreButton" data-dojo-attach-event="onclick: restore"></span>'+
                '<span class="dojoxDockTitleNode fpDockTitleNode" data-dojo-attach-point="titleNode">${title}</span>'+
                '</li>',

        postCreate: function(){
            this.inherited(arguments);

            this.own(on(this.domNode, touch.press, lang.hitch(this, "restore")));
            //a11y
            this.own(on(this.domNode, "keydown", lang.hitch(this, function(evt){
                if(evt.keyCode == keys.ENTER){
                    this.restore(evt);
                }
            })));
        },

        startup: function(){
            this.inherited(arguments);

            //hover event
            if(this.gridRef.dockBehavior == "collapsed"){
                //a11y to keep dock visible when
                this.own(on(this.domNode, "focus", lang.hitch(this, function(e){
                    domClass.add(this.dockNodeContainer.domNode, "dockContainerHovered");
                })));
                this.own(on(this.domNode, "blur", lang.hitch(this, function(e){
                    domClass.remove(this.dockNodeContainer.domNode, "dockContainerHovered");
                })));
            }else if(this.gridRef.dockBehavior == "fixed"){
                //TODO
            }else{
                //TODO
            }

            //a11y
            domAttr.set(this.domNode, {
                tabIndex: 0
            });
        },

        restore: function(e){
            // this.paneRef.show();
            // this.paneRef.bringToTop();
            // this.destroy();
            if(!this.gridRef){return;}
            if(domClass.contains(this.gridRef.domNode, "gridContainerMaximum")){
                if(this.gridRef.maxItemSwitchMode == "stable"){
                    alert(this.paneRef._nlsResources.stackCardNotify + ": '" + this.title + "'");
                }else if(this.gridRef.maxItemSwitchMode == "tab"){
                    if(this.gridRef.currentMaxItemName && this.gridRef.childItemMaps[this.gridRef.currentMaxItemName]){
                        var cGItem = this.gridRef.childItemMaps[this.gridRef.currentMaxItemName];

                        var gridCSS3FlagReserved = this.gridRef.css3AnimationDisabled;
                        this.gridRef.toggleCSS3Animation(true);

                        var cGItemCSS3FlagReserved = cGItem.css3AnimationDisabled;
                        cGItem.toggleCSS3Animation(true);
                        cGItem.handle_max(e);
                        // this.gridRef.stackCardItem(cGItem, true);
                        cGItem.toggleCSS3Animation(cGItemCSS3FlagReserved);

                        if(this.paneRef){
                            var refCSS3FlagReserved = this.paneRef.css3AnimationDisabled;
                            this.paneRef.toggleCSS3Animation(true);
                            // this.gridRef.unStackCardItem(this.paneRef, true);
                            this.paneRef.toggle_to_normal(e);
                            this.paneRef.handle_max(e);
                            this.paneRef.toggleCSS3Animation(refCSS3FlagReserved);
                        }

                        this.gridRef.toggleCSS3Animation(gridCSS3FlagReserved);
                    }
                }else{
                    //TODO
                }
            }else{
                this.gridRef.unStackCardItem(this.paneRef);
            }
        }
    });

    var _Dock = declare("idx/layout/_Dock",[_WidgetBase, _TemplatedMixin, _CssStateMixin],{

        templateString: '<div class="dojoxDock fpDock borderBox"><ul data-dojo-attach-point="containerNode" class="dojoxDockList fpDockList"></ul></div>',
        _docked: [],
        _inPositioning: false,
        autoPosition: false,

        gridRef:null,

        baseClass: "dockContainer",

        addNode: function(paneRef, gridRef){
            var div = domConstruct.create('li', null, this.containerNode),
                node = new _DockNode({
                    title: paneRef.title,
                    paneRef: paneRef,
                    gridRef: gridRef,
                    dockNodeContainer: this
                }, div)
                ;
            node.startup();
            return node;
        },

        removeNode: function(dNode, paneRef, gridRef){
            if(dNode){
                if(dNode.destroy){
                    dNode.destroy();
                }else{
                    domConstruct.destroy(dNode);
                }
            }
        },

        startup: function(){

            this._positionDock(null);
            this.inherited(arguments);

            // this._trackMouseState(this.domNode, "dockContainer");

            //hover event
            if(this.gridRef.dockBehavior == "collapsed"){
                this.own(on(this.domNode, mouse.enter, lang.hitch(this, function(e){
                    domClass.add(this.domNode, "dockContainerHovered");
                })));
                this.own(on(this.domNode, mouse.leave, lang.hitch(this, function(e){
                    domClass.remove(this.domNode, "dockContainerHovered");
                })));
                //a11y
                this.own(on(this.domNode, "focus", lang.hitch(this, function(e){
                    domClass.add(this.domNode, "dockContainerHovered");
                })));
                this.own(on(this.domNode, "blur", lang.hitch(this, function(e){
                    domClass.remove(this.domNode, "dockContainerHovered");
                })));
            }else if(this.gridRef.dockBehavior == "fixed"){
                domClass.add(this.domNode, "dockContainerFixed");
            }else{
                //TODO
            }

            // domClass.add(this.domNode, "dojoxDndArea");
            // domAttr.set(this.domNode, "accept", "Portlet,ContentPane");
            // this.gridRef._dragManager.registerByNode(this.domNode);

            //a11y
            domAttr.set(this.domNode, {
                tabIndex: 0
            });
        },

        _positionDock: function(/* Event? */e){
            if(!this._inPositioning){
                if(this.autoPosition == "south"){
                    // setTimeout(lang.hitch(this, function() {
                    // this._inPositiononing = true;
                    // var viewport = windowLib.getBox();
                    // var s = this.domNode.style;
                    // s.left = viewport.l + "px";
                    // s.width = (viewport.w-2) + "px";
                    // s.top = (viewport.h + viewport.t) - this.domNode.offsetHeight + "px";
                    // this._inPositioning = false;
                    // }), 125);
                }
            }
        }
    });
    return _Dock;
})