/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/_base/window",
    "dojo/_base/connect",
    "dojo/sniff",
    "dojo/ready"
],function( lang, declare, winUtil, connect, has, ready ){
    var _AutoScroll = declare([], {
        interval: 3,
        recursiveTimer: 10,
        marginMouse: 50,

        constructor: function(){
            this.resizeHandler = connect.connect(winUtil.global,"onresize", this, function(){
                this.getViewport();
            });
            ready(lang.hitch(this, "init"));
        },

        init: function(){
            this._html = (has("webkit"))? winUtil.body() : winUtil.body().parentNode;
            this.getViewport();
        },

        getViewport:function(){
            var d = winUtil.doc, dd = d.documentElement, w = window, b = winUtil.body();
            if(has("mozilla")){
                this._v = { 'w': dd.clientWidth, 'h': w.innerHeight };	// Object
            }
            else if(!has("opera") && w.innerWidth){
                this._v = { 'w': w.innerWidth, 'h': w.innerHeight };		// Object
            }
            else if(!has("opera") && dd && dd.clientWidth){
                this._v = { 'w': dd.clientWidth, 'h': dd.clientHeight };	// Object
            }
            else if(b.clientWidth){
                this._v = { 'w': b.clientWidth, 'h': b.clientHeight };	// Object
            }
        },

        setAutoScrollNode: function(/*Node*/node){
            this._node = node;
        },

        setAutoScrollMaxPage: function(){
            this._yMax = this._html.scrollHeight;
            this._xMax = this._html.scrollWidth;
        },

        checkAutoScroll: function(/*Event*/e){
            if(this._autoScrollActive){
                this.stopAutoScroll();
            }
            this._y = e.pageY;
            this._x = e.pageX;
            if(e.clientX < this.marginMouse){
                this._autoScrollActive = true;
                this._autoScrollLeft(e);
            }
            else if(e.clientX > this._v.w - this.marginMouse){
                this._autoScrollActive = true;
                this._autoScrollRight(e);
            }
            if(e.clientY < this.marginMouse){
                this._autoScrollActive = true;
                this._autoScrollUp(e);

            }
            else if(e.clientY > this._v.h - this.marginMouse){
                this._autoScrollActive = true;
                this._autoScrollDown();
            }
        },

        _autoScrollDown: function(){
            if(this._timer){
                clearTimeout(this._timer);
            }
            if(this._autoScrollActive && this._y + this.marginMouse < this._yMax){
                this._html.scrollTop += this.interval;
                this._node.style.top = (parseInt(this._node.style.top) + this.interval) + "px";
                this._y += this.interval;
                this._timer = setTimeout(lang.hitch(this, "_autoScrollDown"), this.recursiveTimer);
            }
        },

        _autoScrollUp: function(){
            if(this._timer){
                clearTimeout(this._timer);
            }
            if(this._autoScrollActive && this._y - this.marginMouse > 0){
                this._html.scrollTop -= this.interval;
                this._node.style.top = (parseInt(this._node.style.top) - this.interval) + "px";
                this._y -= this.interval;
                this._timer = setTimeout(lang.hitch(this, "_autoScrollUp"),this.recursiveTimer);
            }
        },

        _autoScrollRight: function(){
            if(this._timer){
                clearTimeout(this._timer);
            }
            if(this._autoScrollActive && this._x + this.marginMouse < this._xMax){
                this._html.scrollLeft += this.interval;
                this._node.style.left = (parseInt(this._node.style.left) + this.interval) + "px";
                this._x += this.interval;
                this._timer = setTimeout(lang.hitch(this, "_autoScrollRight"), this.recursiveTimer);
            }
        },

        _autoScrollLeft: function(/*Event*/e){
            if(this._timer){
                clearTimeout(this._timer);
            }
            if(this._autoScrollActive && this._x - this.marginMouse > 0){
                this._html.scrollLeft -= this.interval;
                this._node.style.left = (parseInt(this._node.style.left) - this.interval) + "px";
                this._x -= this.interval;
                this._timer = setTimeout(lang.hitch(this, "_autoScrollLeft"),this.recursiveTimer);
            }
        },

        stopAutoScroll: function(){
            if(this._timer){
                clearTimeout(this._timer);
            }
            this._autoScrollActive = false;
        },

        destroy: function(){
            connect.disconnect(this.resizeHandler);
        }
    });

    _AutoScroll.autoScroll = null;
    _AutoScroll.autoScroll = new _AutoScroll();

    return _AutoScroll;
});