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
    "dojo/_base/array",
    "dojo/_base/window",
    "dojo/touch",
    "dojo/sniff",
    "dojo/_base/event",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "./_AutoScroll"
],function(lang, declare, connect, array, winUtil, touch, has, event, dom, domStyle, domGeom, _AutoScroll){
    var _Moveable = declare([], {
        handle: null,
        skip: true,
        dragDistance: has("mobile") ? 0 : 3,

        constructor: function(/*Object*/params, /*DOMNode*/node){
            this.node = dom.byId(node);

            this.d = this.node.ownerDocument;

            if(!params){ params = {}; }
            // this.handle = params.handle ? dom.byId(params.handle) : null;
            this.handle = params.handle ? params.handle : null;
            if(!this.handle){ this.handle = this.node; }
            this.skip = params.skip;

            //multi drag handler
            if(lang.isArray(this.handle)){
                this.events = [];
                array.forEach(this.handle, function(hNode){
                    hNode = dom.byId(hNode);
                    if(hNode){
                        this.events.push(connect.connect(dom.byId(hNode), touch.press, this, "onMouseDown"));
                    }else{
                        //TODO
                    }
                }, this);
            }else{
                this.handle = dom.byId(this.handle);
                this.events = [
                    connect.connect(this.handle, touch.press, this, "onMouseDown")
                ];
            }

            if(_AutoScroll.autoScroll){
                this.autoScroll = _AutoScroll.autoScroll;
            }

        },

        isFormElement: function(/*DOMEvent*/ e){
            var t = e.target;
            if(t.nodeType == 3 /*TEXT_NODE*/){
                t = t.parentNode;
            }
            return " a button textarea input select option ".indexOf(" " + t.tagName.toLowerCase() + " ") >= 0;	// Boolean
        },

        onMouseDown: function(/*DOMEvent*/e){
            if(this._isDragging){ return;}
            if(has("mobile")){
                //TODO
            }else{
                var isLeftButton = (e.which || e.button) == 1;
                if(!isLeftButton){
                    return;
                }
            }

            if(this.skip && this.isFormElement(e)){ return; }
            if(this.autoScroll){
                this.autoScroll.setAutoScrollNode(this.node);
                this.autoScroll.setAutoScrollMaxPage();
            }
            this.events.push(connect.connect(this.d, touch.release, this, "onMouseUp"));
            this.events.push(connect.connect(this.d, touch.move, this, "onFirstMove"));
            this._selectStart = connect.connect(winUtil.body(), "onselectstart", event.stop);
            this._firstX = e.touches ? e.touches[0].clientX : e.clientX;
            this._firstY = e.touches ? e.touches[0].clientY : e.clientY;
            event.stop(e);
        },

        onFirstMove: function(/*DOMEvent*/e){
            event.stop(e);
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var clientY = e.touches ? e.touches[0].clientY : e.clientY;
            var d = (this._firstX - clientX) * (this._firstX - clientX)
                + (this._firstY - clientY) * (this._firstY - clientY);
            if(d > this.dragDistance * this.dragDistance){
                this._isDragging = true;
                connect.disconnect(this.events.pop());
                domStyle.set(this.node, "width", domGeom.getContentBox(this.node).w + "px");
                this.initOffsetDrag(e);
                this.events.push(connect.connect(this.d, touch.move, this, "onMove"));
            }
        },

        initOffsetDrag: function(/*DOMEvent*/e){
            this.offsetDrag = {
                'l': (e.touches ? e.touches[0].pageX : e.pageX),
                't': (e.touches ? e.touches[0].pageY : e.pageY)
            };
            var s = this.node.style;
            var position = domGeom.position(this.node, true);
            this.offsetDrag.l = position.x - this.offsetDrag.l;
            this.offsetDrag.t = position.y - this.offsetDrag.t;
            var coords = {
                'x': position.x,
                'y': position.y
            };
            this.size = {
                'w': position.w,
                'h': position.h
            };
            // method to catch
            this.onDragStart(this.node, coords, this.size);
        },

        onMove: function(/*DOMEvent*/e){
            event.stop(e);
            // hack to avoid too many calls to onMove in IE8 causing sometimes slowness
            if(has("ie") == 8 && new Date() - this.date < 20){
                return;
            }
            if(this.autoScroll){
                this.autoScroll.checkAutoScroll(e);
            }
            var coords = {
                'x': this.offsetDrag.l + (e.touches ? e.touches[0].pageX : e.pageX),
                'y': this.offsetDrag.t + (e.touches ? e.touches[0].pageY : e.pageY)
            };
            var s = this.node.style;
            s.left = coords.x + "px";
            s.top = coords.y + "px";

            // method to catch
            this.onDrag(this.node, coords, this.size, {'x':e.pageX, 'y':e.pageY});
            if(has("ie") == 8){
                this.date = new Date();
            }
        },

        onMouseUp: function(/*DOMEvent*/e){
            if (this._isDragging){
                event.stop(e);
                this._isDragging = false;
                if(this.autoScroll){
                    this.autoScroll.stopAutoScroll();
                }
                delete this.onMove;
                this.onDragEnd(this.node);
                this.node.focus();
            }
            connect.disconnect(this.events.pop());
            connect.disconnect(this.events.pop());
        },

        onDragStart: function(/*DOMNode*/node, /*Object*/coords, /*Object*/size){
            // tags:
            //		callback
        },

        onDragEnd: function(/*DOMNode*/node){
            // tags:
            //		callback
        },

        onDrag: function(/*DOMNode*/node, /*Object*/coords, /*Object*/size, /*Object*/mousePosition){
            // tags:
            //		callback
        },

        destroy: function(){
            array.forEach(this.events, connect.disconnect);
            this.events = this.node = null;
        }
    });
    return _Moveable;

})