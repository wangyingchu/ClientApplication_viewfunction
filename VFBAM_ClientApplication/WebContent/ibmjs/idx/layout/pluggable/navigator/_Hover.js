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
    "dojo/_base/event",
    "dojo/mouse",
    "dojo/on"
], function(declare, lang, array, event, mouse, on){
    /**
     * Deprecated!
     * Useless, to be delete
     */
    return declare([],{
        defaultEvent: 'hover',
        subEvents: ['end'],
        _elements: null,
        interval: 100,
        sensitivity: 7,
        timeout: 200,
        cX: null,
        cY: null,
        pX: null,
        pY: null,
        /**
         *
         * @param args
         */
        constructor: function(args){
            lang.mixin(this, args);
            this.init();
        },
        /**
         *
         */
        init: function(){
            this._elements = [];

            var evt = this.defaultEvent;
            this.call = this._handle(evt);

            this._events = [evt];
            array.forEach(this.subEvents, function(subEvt){
                this[subEvt] = this._handle(evt + '.' + subEvt);
                this._events.push(evt + '.' + subEvt);
            }, this);
        },
        /**
         *
         * @param e
         * @param element
         */
        enter: function(e, element){
            event.stop(e);
            var el = this._getElement(element.target);
            if (el.hoverTimeout) { el.hoverTimeout = clearTimeout(el.hoverTimeout); }
            pX = e.pageX;
            pY = e.pageY;
            el.moveTracker = on(element.target, "mousemove", this.setCurPos);
            var _compare = lang.hitch(this, "comparePos", element.target);
            if (el.hoverStatus != 1) {
                el.hoverTimeout = setTimeout(_compare, this.interval);
            }
        },
        /**
         *
         * @param e
         * @param element
         */
        leave: function(e, element){
            event.stop(e);
            var el = this._getElement(element.target);
            el.hoverTimeout = clearTimeout(el.hoverTimeout);
            if(typeof el.moveTracker !== "undefined"){
                el.moveTracker.remove();
            }
            var _unhover = lang.hitch(this, "unhover", element.target);
            if (el.hoverStatus == 1) {
                el.hoverTimeout = setTimeout(_unhover, this.timeout);
            }
        },
        /**
         *
         * @param e
         */
        setCurPos: function(e){
            cX = e.pageX;
            cY = e.pageY;
        },
        /**
         *
         * @param currentTarget
         * @returns {*}
         */
        comparePos: function(currentTarget){
            var el = this._getElement(currentTarget);
            el.hoverTimeout = clearTimeout(el.hoverTimeout);
            if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < this.sensitivity ) {
                el.moveTracker.remove();
                el.hoverStatus = 1;
                return this.fire(currentTarget, {type: "hover"});
            } else {
                var _compare = lang.hitch(this, "comparePos", currentTarget);
                pX = cX; pY = cY;
                el.hoverTimeout = setTimeout( _compare , this.interval );
            }
        },
        /**
         *
         * @param currentTarget
         * @returns {*}
         */
        unhover: function(currentTarget){
            var el = this._getElement(currentTarget);
            el.hoverStatus = 0;
            return this.fire(currentTarget, {type: "hover.end"});
        },
        /**
         *
         * @param eventType
         * @returns {Function}
         * @private
         */
        _handle: function(/*String*/eventType){
            var self = this;
            return function(node, listener){
                var a = arguments;
                if(a.length > 2){
                    node = a[1];
                    listener = a[2];
                }
                var isNode = node && (node.nodeType || node.attachEvent || node.addEventListener);
                if(!isNode){
                    return on(node, eventType, listener);
                }else{
                    var onHandle = self._add(node, eventType, listener);
                    var signal = {
                        remove: function(){
                            onHandle.remove();
                            self._remove(node, eventType);
                        }
                    };
                    return signal;
                }
            }; // dojo/on handle
        },
        /**
         *
         * @param node
         * @param type
         * @param listener
         * @returns {*}
         * @private
         */
        _add: function(/*Dom*/node, /*String*/type, /*function*/listener){
            var element = this._getElement(node);
            if(!element){
                element = {
                    target: node,
                    data: {},
                    handles: {},
                    hoverStatus: 0,
                    hoverTimeout: null,
                    moveTracker: null
                };

                var _enter = lang.hitch(this, "_process", element, "enter");
                var _leave = lang.hitch(this, "_process", element, "leave");

                var handles = element.handles;
                handles.enter = on(node, mouse.enter, _enter);
                handles.leave = on(node, mouse.leave, _leave);
                this._elements.push(element);
            }
            element.handles[type] = !element.handles[type] ? 1 : ++element.handles[type];

            return on(node, type, listener); //handle
        },
        /**
         *
         * @param node
         * @returns {*}
         * @private
         */
        _getElement: function(/*Dom*/node){
            var i = 0, element;
            for(; i < this._elements.length; i++){
                element = this._elements[i];
                if(element.target === node){
                    return element;
                }
            }
        },
        /**
         *
         * @param element
         * @param phase
         * @param e
         * @private
         */
        _process: function(element, phase, e){
            e._locking = e._locking || {};
            if(e._locking[this.defaultEvent] || this.isLocked(e.target)){
                return;
            }
            if((e.target.tagName != "INPUT" || e.target.type == "radio" || e.target.type == "checkbox") && e.target.tagName != "TEXTAREA"){
                e.preventDefault();
            }
            e._locking[this.defaultEvent] = true;
            this[phase](e, element);
        },
        /**
         *
         * @param handles
         * @private
         */
        _cleanHandles: function(/*Object*/handles){
            for(var x in handles){
                if(handles[x].remove){
                    handles[x].remove();
                }
                delete handles[x];
            }
        },
        /**
         *
         * @param node
         * @param type
         * @private
         */
        _remove: function(/*Dom*/node, /*String*/type){
            var element = this._getElement(node);
            if(!element || !element.handles){ return; }

            element.handles[type]--;

            var handles = element.handles;
            if(!array.some(this._events, function(evt){
                return handles[evt] > 0;
            })){
                this._cleanHandles(handles);
                var i = array.indexOf(this._elements, element);
                if(i >= 0){
                    this._elements.splice(i, 1);
                }
            }
        },
        /**
         *
         * @param node
         * @param event
         */
        fire: function(node, event){
            if(!node || !event){
                return;
            }
            event.bubbles = true;
            event.cancelable = true;
            on.emit(node, event.type, event);
        },
        /**
         *
         * @param node
         */
        lock: function(/*Dom*/node){
            this._lock = node;
        },
        /**
         *
         */
        unLock: function(){
            this._lock = null;
        },
        /**
         *
         * @param node
         * @returns {*}
         */
        isLocked: function(node){
            if(!this._lock || !node){
                return false;
            }
            return this._lock !== node && dom.isDescendant(node, this._lock);
        },
        /**
         *
         */
        destroy: function(){
            array.forEach(this._elements, function(element){
                this._cleanHandles(element.handles);
            }, this);
            this._elements = null;
        }
    });
});