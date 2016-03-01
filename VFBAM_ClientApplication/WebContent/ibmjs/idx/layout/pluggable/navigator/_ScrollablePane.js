/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define([
	"dojo/_base/declare",
	"dojox/mobile/ScrollablePane",
	"dojo/_base/connect",
	"dojo/touch",
	"dojo/has",
	"dojo/dom-style",
	"dojox/mobile/_css3",
	"dojo/on",
	"dojo/dom-geometry",
	"dojo/mouse",
	"dojo/_base/lang"
], function(declare, pane, connect, touch, has, domStyle, css3, on, domGeom, mouse, lang) {
	var _scrollPane;
	var baseClassName = "idx/layout/pluggable/navigator/_ScrollablePane";
	if (has("mobile")) {
		_scrollPane = declare(baseClassName, [pane]);
	} else {
		_scrollPane = declare(baseClassName, [pane], {
			onTouchMove: function(e) {
				// summary:
				//		override the scrolling behavior
				//		dragging the thumb up cause the navbar to scroll down
				if (this._locked) {
					return;
				}

				if (this._preventDefaultInNextTouchMove) { // #17502
					this._preventDefaultInNextTouchMove = false; // only in the first touch.move
					var enclosingWidget = registry.getEnclosingWidget(e.target);
					if (enclosingWidget && enclosingWidget.isInstanceOf(TextBoxMixin)) {
						// For touches on text widgets for which e.preventDefault() has not been
						// called in onTouchStart, call it in onTouchMove() to avoid browser scroll.
						// Not done on other elements such that for instance a native slider
						// can still handle touchmove events.
						this.propagatable ? e.preventDefault() : event.stop(e);
					}
				}

				var x = e.clientX;
				var y = e.clientY;
				var dx = x - this.touchStartX;
				var dy = y - this.touchStartY;
				// var to = {x:this.startPos.x + dx, y:this.startPos.y + dy};
				var to = {
					x: this.startPos.x - dx,
					y: this.startPos.y - dy
				};
				var dim = this._dim;

				dx = Math.abs(dx);
				dy = Math.abs(dy);
				if (this._time.length == 1) { // the first TouchMove after TouchStart
					if (this.dirLock) {
						if (this._v && !this._h && dx >= this.threshold && dx >= dy ||
							(this._h || this._f) && !this._v && dy >= this.threshold && dy >= dx) {
							this._locked = true;
							return;
						}
					}
					if (this._v && this._h) { // scrollDir="hv"
						if (dy < this.threshold &&
							dx < this.threshold) {
							return;
						}
					} else {
						if (this._v && dy < this.threshold ||
							(this._h || this._f) && dx < this.threshold) {
							return;
						}
					}
					this._moved = true;
					this.addCover();
					this.showScrollBar();
				}

				var weight = this.weight;
				if (this._v && this.constraint) {
					if (to.y > 0) { // content is below the screen area
						to.y = Math.round(to.y * weight);
					} else if (to.y < -dim.o.h) { // content is above the screen area
						if (dim.c.h < dim.d.h) { // content is shorter than display
							to.y = Math.round(to.y * weight);
						} else {
							to.y = -dim.o.h - Math.round((-dim.o.h - to.y) * weight);
						}
					}
				}
				if ((this._h || this._f) && this.constraint) {
					if (to.x > 0) {
						to.x = Math.round(to.x * weight);
					} else if (to.x < -dim.o.w) {
						if (dim.c.w < dim.d.w) {
							to.x = Math.round(to.x * weight);
						} else {
							to.x = -dim.o.w - Math.round((-dim.o.w - to.x) * weight);
						}
					}
				}
				this.scrollTo(to);

				var max = 10;
				var n = this._time.length; // # of samples
				if (n >= 2) {
					this._moved = true;
					// Check the direction of the finger move.
					// If the direction has been changed, discard the old data.
					var d0, d1;
					if (this._v && !this._h) {
						d0 = this._posY[n - 1] - this._posY[n - 2];
						d1 = y - this._posY[n - 1];
					} else if (!this._v && this._h) {
						d0 = this._posX[n - 1] - this._posX[n - 2];
						d1 = x - this._posX[n - 1];
					}
					if (d0 * d1 < 0) { // direction changed
						// leave only the latest data
						this._time = [this._time[n - 1]];
						this._posX = [this._posX[n - 1]];
						this._posY = [this._posY[n - 1]];
						n = 1;
					}
				}
				if (n == max) {
					this._time.shift();
					this._posX.shift();
					this._posY.shift();
				}
				this._time.push((new Date()).getTime() - this.startTime);
				this._posX.push(x);
				this._posY.push(y);
			},
			init: function( /*Object?*/ params) {
				// summary:
				//		change touchNode to the vertical scrollbar
				this.inherited(arguments);
				this.showScrollBar();
				connect.disconnect(this._ch[0]); //remove handler for the original touchNode
				this.touchNode = this._scrollBarWrapperV;
				this._ch.push(connect.connect(this.touchNode, touch.press, this, "onTouchStart"));
				on(this.containerNode, mouse.wheel, lang.hitch(this, "_mouseWheeled"));
				if(!this.disableTouchScroll && this.domNode.addEventListener){
					this.domNode.removeEventListener("focus", this._onFocusScroll, true);
				}
			},
			hideScrollBar: function() {

			},
			hideVerticalScrollBar: function() {
				if(this._scrollBarV){
					domStyle.set(this._scrollBarV.parentNode, "opacity", 0);
					this._scrollBarV = null;
					domStyle.set(this.containerNode, css3.add({}, {
						transform: this.makeTranslateStr({
							y: 0
						})
					}));
				}			
			},
			showScrollBar: function() {
				this._dim = this.getDim();
				this.inherited(arguments);
				if(this._scrollBarV){
					domStyle.set(this._scrollBarV.parentNode, "opacity", 1);
					if (!this.touchNode) {
						this.touchNode = this._scrollBarWrapperV;
						this._ch.push(connect.connect(this.touchNode, touch.press, this, "onTouchStart"));
					}
				}
			},
			scrollIntoView: function(/*DOMNode*/node, /*Boolean?*/alignWithTop, /*Number?*/duration){
				// summary:
				//		Override to change scroll destination position calculating.
				if(!this._v){ return; } // cannot scroll vertically

				var c = this.containerNode,
					h = this.getDim().d.h, 
					top = 0;
				var containerTop = domGeom.position(c).y;
				var nodeTop = domGeom.position(node).y;
				top = nodeTop - containerTop;
				// Calculate scroll destination position
				var y = alignWithTop ? Math.max(h - c.offsetHeight, -top) : Math.min(0, h - top - node.offsetHeight);
				// Scroll to destination position
				(duration && typeof duration === "number") ? 
					this.slideTo({y: y}, duration, "ease-out") : this.scrollTo({y: y});
			},
			_mouseWheeled: function( /*Event*/ evt) {
				// summary:
				//		Event handler for mousewheel where supported
				evt.stopPropagation();
				evt.preventDefault();
				if(!this._scrollBarV) return;
				this._bumpValue(evt.wheelDelta < 0 ? -1 : 1, true); // negative scroll acts like a decrement
			},
			_bumpValue: function(signedChange){
				var step = domStyle.get(this.domNode,'lineHeight');
				step = step ? step : 20;
				var toY = this.getPos().y + signedChange * step;
				toY = toY>0 ? 0 : Math.max(this.getDim().d.h-this.containerNode.offsetHeight, toY);
				this.scrollTo({y: toY});
			},
			scrollIntoItemNode: function(itemNode) {
				if (!this._scrollBarV) return;
				var node = itemNode;
				var nodeRect, scrollableRect;
				if (node) {
					nodeRect = node.getBoundingClientRect();
					scrollableRect = this.domNode.getBoundingClientRect();
					if (nodeRect.height < this.getDim().d.h) {
						// do not call scrollIntoView for elements with a height
						// larger than the height of scrollable's content display
						// area (it would be ergonomically harmful).

						if (nodeRect.top < (scrollableRect.top + this.fixedHeaderHeight)) {
							// scrolling towards top (to bring into the visible area an element
							// located above it).
							this.scrollIntoView(node, true);
						} else if ((nodeRect.top + nodeRect.height) >
							(scrollableRect.top + scrollableRect.height - this.fixedFooterHeight)) {
							// scrolling towards bottom (to bring into the visible area an element
							// located below it).
							this.scrollIntoView(node, false);
						} // else do nothing (the focused node is already visible)
					}
				}
			}
		});
	}
	return _scrollPane;
});