/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/_base/event", // event.stop
    "dojo/_base/window",
    "dojo/query",
    "dojo/touch",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dijit/_base/manager",
    "dijit/_Widget",
    "dijit/_TemplatedMixin"
],function( declare, lang, array, connect, event, winBase, query, touch, dom, domStyle, domGeom, domClass, manager, _Widget, _TemplatedMixin ){
    /**
     * Helper Funciton for resize FlipCardItem
     * @type {*}
     * @private
     */
    var _ResizeHelper = declare([_Widget], {
        show: function(){
            domStyle.set(this.domNode, "display", "");
        },

        hide: function(){
            domStyle.set(this.domNode, "display", "none");
        },

        resize: function(/* Object */dim){
            domGeom.setMarginBox(this.domNode, dim);
        }
    });
    /**
     * Main Resize Handler
     * @type {*}
     * @private
     */
    var _FlipCardResize = declare("idx/layout/_ResizeHandle", [_Widget, _TemplatedMixin], {
        targetId: "",
        targetContainer: null,
        resizeAxis: "xy",
        activeResize: false,
        activeResizeClass: "dojoxResizeHandleClone fpResizeHandleClone",
        animateSizing: true,
        animateMethod: "chain",
        animateDuration: 225,
        minHeight: 30,
        minWidth: 50,
        constrainMax: false,
        maxHeight:0,
        maxWidth:0,
        fixedAspect: false,
        intermediateChanges: false,

        startTopic: "/dojo/resize/start",
        endTopic:"/dojo/resize/stop",

        templateString: '<div dojoAttachPoint="resizeHandle" class="dojoxResizeHandle fpResizeHandle"><div></div></div>',

        postCreate: function(){

            this.connect(this.resizeHandle, touch.press, "_beginSizing");
            if(!this.activeResize){
                this._resizeHelper = manager.byId('dojoxGlobalResizeHelper');
                if(!this._resizeHelper){
                    this._resizeHelper = new _ResizeHelper({
                        id: 'dojoxGlobalResizeHelper'
                    }).placeAt(winBase.body());
                    domClass.add(this._resizeHelper.domNode, this.activeResizeClass);
                }
            }else{ this.animateSizing = false; }

            if(!this.minSize){
                this.minSize = { w: this.minWidth, h: this.minHeight };
            }

            if(this.constrainMax){
                this.maxSize = { w: this.maxWidth, h: this.maxHeight }
            }

            this._resizeX = this._resizeY = false;
            var addClass = lang.partial(domClass.add, this.resizeHandle);
            switch(this.resizeAxis.toLowerCase()){
                case "xy" :
                    this._resizeX = this._resizeY = true;
                    addClass("dojoxResizeNW fpResizeNW");
                    break;
                case "x" :
                    this._resizeX = true;
                    addClass("dojoxResizeW fpResizeW");
                    break;
                case "y" :
                    this._resizeY = true;
                    addClass("dojoxResizeN fpResizeN");
                    break;
            }
        },

        _beginSizing: function(/*Event*/ e){
            if(this._isSizing){ return; }

            connect.publish(this.startTopic, [ this ]);
            this.targetWidget = manager.byId(this.targetId);

            this.targetDomNode = this.targetWidget ? this.targetWidget.domNode : dom.byId(this.targetId);
            if(this.targetContainer){ this.targetDomNode = this.targetContainer; }
            if(!this.targetDomNode){ return; }

            if(!this.activeResize){
                var c = domGeom.position(this.targetDomNode, true);
                this._resizeHelper.resize({l: c.x, t: c.y, w: c.w, h: c.h});
                this._resizeHelper.show();
                if(!this.isLeftToRight()){
                    this._resizeHelper.startPosition = {l: c.x, t: c.y};
                }
            }

            this._isSizing = true;
            this.startPoint  = { x:e.clientX, y:e.clientY };

            var style = domStyle.getComputedStyle(this.targetDomNode),
                borderModel = domGeom.boxModel==='border-model',
                padborder = borderModel?{w:0,h:0}:domGeom.getPadBorderExtents(this.targetDomNode, style),
                margin = domGeom.getMarginExtents(this.targetDomNode, style),
                mb;
            mb = this.startSize = {
                // w: domStyle.get(this.targetDomNode, 'width', style),
                // h: domStyle.get(this.targetDomNode, 'height', style),
                // fix issue when import dojox.css3.fx
                w: domStyle.get(this.targetDomNode, 'width'),
                h: domStyle.get(this.targetDomNode, 'height'),
                pbw: padborder.w, pbh: padborder.h,
                mw: margin.w, mh: margin.h};
            if(!this.isLeftToRight() && domStyle.get(this.targetDomNode, "position") == "absolute"){
                var p = domGeom.position(this.targetDomNode, true);
                this.startPosition = {l: p.x, t: p.y};
            }

            this._pconnects = [
                connect.connect(winBase.doc, touch.move, this, "_updateSizing"),
                connect.connect(winBase.doc, touch.release, this, "_endSizing")
            ];

            event.stop(e);
        },

        _updateSizing: function(/*Event*/ e){
            if(this.activeResize){
                this._changeSizing(e);
            }else{
                var tmp = this._getNewCoords(e, 'border', this._resizeHelper.startPosition);
                if(tmp === false){ return; }
                this._resizeHelper.resize(tmp);
            }
            e.preventDefault();
        },

        _getNewCoords: function(/* Event */ e, /* String */ box, /* Object */startPosition){
            try{
                if(!e.clientX  || !e.clientY){ return false; }
            }catch(e){
                return false;
            }
            this._activeResizeLastEvent = e;

            var dx = (this.isLeftToRight()?1:-1) * (this.startPoint.x - e.clientX),
                dy = this.startPoint.y - e.clientY,
                newW = this.startSize.w - (this._resizeX ? dx : 0),
                newH = this.startSize.h - (this._resizeY ? dy : 0),
                r = this._checkConstraints(newW, newH)
                ;

            startPosition = (startPosition || this.startPosition);
            if(startPosition && this._resizeX){
                r.l = startPosition.l + dx;
                if(r.w != newW){
                    r.l += (newW - r.w);
                }
                r.t = startPosition.t;
            }

            switch(box){
                case 'margin':
                    r.w += this.startSize.mw;
                    r.h += this.startSize.mh;
                case "border":
                    r.w += this.startSize.pbw;
                    r.h += this.startSize.pbh;
                    break;
            }

            return r; // Object
        },

        _checkConstraints: function(newW, newH){
            if(this.minSize){
                var tm = this.minSize;
                if(newW < tm.w){
                    newW = tm.w;
                }
                if(newH < tm.h){
                    newH = tm.h;
                }
            }

            if(this.constrainMax && this.maxSize){
                var ms = this.maxSize;
                if(newW > ms.w){
                    newW = ms.w;
                }
                if(newH > ms.h){
                    newH = ms.h;
                }
            }

            if(this.fixedAspect){
                var w = this.startSize.w, h = this.startSize.h,
                    delta = w * newH - h * newW;
                if(delta<0){
                    newW = newH * w / h;
                }else if(delta>0){
                    newH = newW * h / w;
                }
            }

            return { w: newW, h: newH }; // Object
        },

        _changeSizing: function(/*Event*/ e){
            var isWidget = this.targetWidget && lang.isFunction(this.targetWidget.resize),
                tmp = this._getNewCoords(e, isWidget && 'margin');
            if(tmp === false){ return; }

            if(isWidget){
                this.targetWidget.resize(tmp);
            }else{
                if(this.animateSizing){
                    var anim = coreFx[this.animateMethod]([
                        baseFx.animateProperty({
                            node: this.targetDomNode,
                            properties: {
                                width: { start: this.startSize.w, end: tmp.w }
                            },
                            duration: this.animateDuration
                        }),
                        baseFx.animateProperty({
                            node: this.targetDomNode,
                            properties: {
                                height: { start: this.startSize.h, end: tmp.h }
                            },
                            duration: this.animateDuration
                        })
                    ]);
                    anim.play();
                }else{
                    domStyle.set(this.targetDomNode,{
                        width: tmp.w + "px",
                        height: tmp.h + "px"
                    });
                }
            }
            this.targetSize = tmp;
            if(this.intermediateChanges){
                this.onResize(e);
            }
        },

        _endSizing: function(/*Event*/ e){
            array.forEach(this._pconnects, connect.disconnect);
            var pub = lang.partial(connect.publish, this.endTopic, [ this ]);
            if(!this.activeResize){
                this._resizeHelper.hide();
                this._changeSizing(e);
                setTimeout(pub, this.animateDuration + 15);
            }else{
                pub();
            }
            this._isSizing = false;
            this.onResize(e);
        },

        _getTargetSizeAttr: function(){
            return this.targetSize;
        },

        _setTargetSizeAttr: function(size){
            this.targetSize = size;
        },

        onResize: function(e){
            var portletItemWidget = this.getParent();
            //
            // FlipCardItem is not in any of widget, stand alone condition
            //
            if ( !portletItemWidget.findGridContainer )
            	return;
            var gridContainer = portletItemWidget.findGridContainer(),
                targetSize = this.targetSize,
                gridGeom = {},
                resizedColumn = null;
            var resizeColumnWidth = function( ){
                gridContainer.columnPreservedWidth = 0;
                array.forEach(gridContainer._grid, function(column){

                    if ( dom.isDescendant( portletItemWidget.domNode, column.node ) ){
                        resizedColumn = column;
                        column.columnWidthPercentage = ( targetSize.w + 20)*100/gridGeom.w;
                        column.columnResized = true;
                        gridContainer.columnResizedWidth = column.columnWidthPercentage;
                    }
                    else{
                        var columnGeom = domGeom.position(column.node);
                        column.columnWidthPercentage = (columnGeom.w + 20)*100/gridGeom.w;
                        column.columnResized = false;
                        gridContainer.columnPreservedWidth += column.columnWidthPercentage;
                    }
                });


                array.forEach(gridContainer._grid, function(column){
                    if(column.columnResized){
                        domStyle.set(column.node, {
                            width: column.columnWidthPercentage + "%"
                        });
                    }else{
                        domStyle.set(column.node, {
                            width: (100-gridContainer.columnResizedWidth)*column.columnWidthPercentage/gridContainer.columnPreservedWidth + "%"
                        });
                    }
                    array.forEach(column.node.childNodes, function(itemNode){

                    }, this);
                });

                gridContainer.onResizeHandleEnd(e, gridGeom);

            };

            var resizeItemHeight = function(){
                var children = [], totalHeight = gridGeom.h - 34 - 24;
                var reservedHeight = totalHeight - targetSize.h - 20, originalHeight = 0;
                var aa = query(".portletItem", resizedColumn.node);
                aa.forEach(function(item){
                    if ( portletItemWidget.domNode != item){
                        children.push(item);
                        originalHeight += domGeom.position(item).h + 20;
                    }
                });

                array.forEach( children, function( child ){
                    var height =  domGeom.position(child).h;
                    domStyle.set( child, {
                        height: ( height / originalHeight * reservedHeight -20 )+ "px"
                    });
                });

            };

            if ( gridContainer ){
                gridGeom = domGeom.position(gridContainer.domNode);
                resizeColumnWidth();
                portletItemWidget.resize();
                //resizeItemHeight();
            }
        }
    });

    return _FlipCardResize;
});