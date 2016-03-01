/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-style"
],function( declare, domStyle ){
    return declare(null, {
        // fixedHeaderHeight: Number
        //		height of a fixed header
        fixedHeaderHeight: 0,

        // fixedFooterHeight: Number
        //		height of a fixed footer
        fixedFooterHeight: 0,

        // isLocalFooter: Boolean
        //		footer is view-local (as opposed to application-wide)
        isLocalFooter: false,

        // scrollBar: Boolean
        //		show scroll bar or not
        scrollBar: true,

        // scrollDir: String
        //		v: vertical, h: horizontal, vh: both, f: flip
        scrollDir: "v",

        // weight: Number
        //		frictional drag
        weight: 0.6,

        // fadeScrollBar: Boolean
        fadeScrollBar: true,

        // disableFlashScrollBar: Boolean
        disableFlashScrollBar: false,

        // threshold: Number
        //		drag threshold value in pixels
        threshold: 4,

        // constraint: Boolean
        //		bounce back to the content area
        constraint: true,

        // touchNode: DOMNode
        //		a node that will have touch event handlers
        touchNode: null,

        // propagatable: Boolean
        //		let touchstart event propagate up
        propagatable: true,

        // dirLock: Boolean
        //		disable the move handler if scroll starts in the unexpected direction
        dirLock: false,

        // height: String
        //		explicitly specified height of this widget (ex. "300px")
        height: "",

        // scrollType: Number
        //		- 1: use (-webkit-)transform:translate3d(x,y,z) style, use (-webkit-)animation for slide animation
        //		- 2: use top/left style,
        //		- 3: use (-webkit-)transform:translate3d(x,y,z) style, use (-webkit-)transition for slide animation
        //		- 0: use default value (3 for Android, iOS6+, and BlackBerry; otherwise 1)
        scrollType: 0,

        // _parentPadBorderExtentsBottom: [private] Number
        //		For Tooltip.js.
        _parentPadBorderExtentsBottom: 0,

        // _moved: [private] Boolean
        //		Flag that signals if the user have moved in (one of) the scroll
        //		direction(s) since touch start (a move under the threshold is ignored).
        _moved: false,

        init: function( params ){
            this.containerNode = params["containerNode"];
            this.domNode = params["domNode"];
            this._dim = this.getDim();
        },

        getDim: function(){
            // summary:
            //		Returns various internal dimensional information needed for calculation.

            var d = {};
            // content width/height
            d.c = {h:this.containerNode.offsetHeight, w:this.containerNode.offsetWidth};

            // view width/height
            d.v = {h:this.domNode.offsetHeight, w:this.domNode.offsetWidth};

            // display width/height
            d.d = {h:d.v.h - this.fixedHeaderHeight - this.fixedFooterHeight , w:d.v.w};

            // overflowed width/height
            d.o = {h:d.c.h - d.v.h + this.fixedHeaderHeight + this.fixedFooterHeight , w:d.c.w - d.v.w};
            return d;
        },

        resetScrollBar: function(){
            // summary:
            //		Resets the scroll bar length, position, etc.
            var f = function(wrapper, bar, d, c, hd, v){
                if(!bar){ return; }
                var props = {};
                props[v ? "top" : "left"] = hd + 4 + "px"; // +4 is for top or left margin
                var t = (d - 8) <= 0 ? 1 : d - 8;
                props[v ? "height" : "width"] = t + "px";
                domStyle.set(wrapper, props);
                var l = Math.round(d * d / c); // scroll bar length
                l = Math.min(Math.max(l - 8, 5), t); // -8 is for margin for both ends
                bar.style[v ? "height" : "width"] = l + "px";
                domStyle.set(bar, {"opacity": 0.6});
            };
            var dim = this.getDim();
            f(this._scrollBarWrapperV, this._scrollBarV, dim.d.h, dim.c.h, this.fixedHeaderHeight, true);
            f(this._scrollBarWrapperH, this._scrollBarH, dim.d.w, dim.c.w, 0);

        },

        showScrollBar: function(){
            // summary:
            //		Shows the scroll bar.
            // description:
            //		This function creates the scroll bar instance if it does not
            //		exist yet, and calls resetScrollBar() to reset its length and
            //		position.

            if(!this.scrollBar){ return; }

            var dim = this._dim;
            if(this.scrollDir == "v" && dim.c.h <= dim.d.h){ return; }
            if(this.scrollDir == "h" && dim.c.w <= dim.d.w){ return; }
            if(this._v && this._h && dim.c.h <= dim.d.h && dim.c.w <= dim.d.w){ return; }

            var createBar = function(self, dir){
                var bar = self["_scrollBarNode" + dir];
                if(!bar){
                    var wrapper = domConstruct.create("div", null, self.domNode);
                    var props = { position: "absolute", overflow: "hidden" };
                    if(dir == "V"){
                        props.right = "2px";
                        props.width = "5px";
                    }else{
                        props.bottom = (self.isLocalFooter ? self.fixedFooterHeight : 0) + 2 + "px";
                        props.height = "5px";
                    }
                    domStyle.set(wrapper, props);
                    wrapper.className = "mblScrollBarWrapper";
                    self["_scrollBarWrapper"+dir] = wrapper;

                    bar = domConstruct.create("div", null, wrapper);
                    domStyle.set(bar, css3.add({
                        opacity: 0.6,
                        position: "absolute",
                        backgroundColor: "#606060",
                        fontSize: "1px",
                        MozBorderRadius: "2px",
                        zIndex: 2147483647 // max of signed 32-bit integer
                    }, {
                        borderRadius: "2px",
                        transformOrigin: "0 0"
                    }));
                    domStyle.set(bar, dir == "V" ? {width: "5px"} : {height: "5px"});
                    self["_scrollBarNode" + dir] = bar;
                }
                return bar;
            };
            if(this._v && !this._scrollBarV){
                this._scrollBarV = createBar(this, "V");
            }
            if(this._h && !this._scrollBarH){
                this._scrollBarH = createBar(this, "H");
            }
            this.resetScrollBar();
        }
    });
});