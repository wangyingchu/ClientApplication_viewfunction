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
    "dojo/_base/event",
    "dojo/touch",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/sniff",
    "dijit/_Widget",
    "dijit/registry",
    "./_AutoScroll",
    "./_Moveable"
],function( lang, declare, connect, winUtil, array, event, touch, domClass, domGeom, domConstruct, query, has, _Widget, registry, _AutoScroll, _Moveable ){
    var _AreaManager = declare( [], {
        autoRefresh: true,
        areaClass: "dojoxDndArea",
        dragHandleClass: "dojoxDragHandle",

        constructor: function(){
            this._areaList = [];
            this.resizeHandler = connect.connect(winUtil.global,"onresize", this, function(){
                this._dropMode.updateAreas(this._areaList);
            });

            this._oldIndexArea = this._currentIndexArea = this._oldDropIndex = this._currentDropIndex = this._sourceIndexArea = this._sourceDropIndex = -1;
        },

        init: function(){
            this.registerByClass();
        },

        registerByNode: function(/*DOMNode*/area, /*Boolean*/notInitAreas){
            var index = this._getIndexArea(area);
            if(area && index == -1){
                var acceptType = area.getAttribute("accept");
                var accept = (acceptType) ? acceptType.split(/\s*,\s*/) : ["text"];
                var obj = {
                    'node': area,
                    'items': [],
                    'coords': {},
                    'margin': null,
                    'accept': accept,
                    'initItems': false
                };
                array.forEach(this._getChildren(area), function(item){
                    this._setMarginArea(obj, item);
                    obj.items.push(this._addMoveableItem(item));
                }, this);
                this._areaList = this._dropMode.addArea(this._areaList, obj);
                if(!notInitAreas){
                    this._dropMode.updateAreas(this._areaList);
                }
                connect.publish("/dojox/mdnd/manager/register",[area]);
            }
        },

        registerByClass: function(){
            query('.'+this.areaClass).forEach(function(area){
                this.registerByNode(area, true);
            }, this);
            this._dropMode.updateAreas(this._areaList);
        },

        unregister: function(/*DOMNode*/area){
            var index = this._getIndexArea(area);
            if(index != -1){
                array.forEach(this._areaList[index].items, function(item){
                    this._deleteMoveableItem(item);
                }, this);
                this._areaList.splice(index,1);
                // refresh target area
                this._dropMode.updateAreas(this._areaList);
                return true; // Boolean
            }
            return false; // Boolean
        },

        _addMoveableItem: function(/*DOMNode*/node){
            node.setAttribute("tabIndex", "0");
            var handle = this._searchDragHandle(node);
            var moveable = new _Moveable({ 'handle': handle, 'skip': true }, node);
            // add a css style :
            // domClass.add(handle || node, "dragHandle");
            //multi drag handler
            if(lang.isArray(handle)){
                array.forEach(handle, function(hNode){
                    hNode && domClass.add(hNode, "dragHandle");
                }, this);
            }else{
                domClass.add(handle || node, "dragHandle");
            }

            var type = node.getAttribute("dndType");
            var item = {
                'item': moveable,
                'type': type ? type.split(/\s*,\s*/) : ["text"],
                'handlers': [connect.connect(moveable, "onDragStart", this, "onDragStart")]
            }
            // connect to the uninitialize method of dijit._Widget to delete a moveable before a destruct
            if(registry && registry.byNode){
                var widget = registry.byNode(node);
                if(widget){
                    item.type = widget.dndType ? widget.dndType.split(/\s*,\s*/) : ["text"];
                    item.handlers.push(
                        connect.connect(widget, "uninitialize", this, function(){
                            this.removeDragItem(node.parentNode, moveable.node);
                        })
                    );
                }
            }
            return item; // Object
        },

        _deleteMoveableItem: function(/*Object*/ objItem){
            array.forEach(objItem.handlers, function(handler){
                connect.disconnect(handler);
            });
            var node = objItem.item.node,
                handle = this._searchDragHandle(node);
            // domClass.remove(handle || node, "dragHandle");
            //multi drag handler
            if(lang.isArray(handle)){
                array.forEach(handle, function(hNode){
                    hNode && domClass.remove(hNode, "dragHandle");
                }, this);
            }else{
                domClass.remove(handle || node, "dragHandle");
            }

            objItem.item.destroy();
        },

        _getIndexArea: function(/*DOMNode*/area){
            if(area){
                for(var i = 0; i < this._areaList.length; i++){
                    if(this._areaList[i].node === area){
                        return i;	// Integer
                    }
                }
            }
            return -1;	// Integer
        },

        _searchDragHandle: function(/*DOMNode*/node){
            if(node){
                var cssArray = this.dragHandleClass.split(' '),
                    length = cssArray.length,
                    queryCss = "";
                array.forEach(cssArray, function(css, i){
                    queryCss += "." + css;
                    if(i != length - 1){
                        queryCss += ", ";
                    }
                });
                // return query(queryCss, node)[0]; // DomNode
                return [query(queryCss, node)[0], query(queryCss, node)[1], query(queryCss, node)[2]]; // DomNode array
            }
        },

        addDragItem: function(/*DOMNode*/area, /*DOMNode*/node, /*Integer*/index, /*Boolean*/notCheckParent){
            var add = true;
            if(!notCheckParent){
                add = area && node && (node.parentNode === null || (node.parentNode && node.parentNode.nodeType !== 1));
            }
            if(add){
                var indexArea = this._getIndexArea(area);
                if(indexArea !== -1){
                    var item = this._addMoveableItem(node),
                        items = this._areaList[indexArea].items;
                    if(0 <= index && index < items.length){
                        var firstListChild = items.slice(0, index),
                            lastListChild = items.slice(index, items.length);
                        firstListChild[firstListChild.length] = item;
                        this._areaList[indexArea].items = firstListChild.concat(lastListChild);
                        area.insertBefore(node, items[index].item.node);
                    }
                    else{
                        this._areaList[indexArea].items.push(item);
                        area.appendChild(node);
                    }
                    this._setMarginArea(this._areaList[indexArea], node);
                    this._areaList[indexArea].initItems = false;
                    return true;	// Boolean
                }
            }
            return false;	// Boolean
        },

        removeDragItem: function(/*DOMNode*/area, /*DOMNode*/node){
            var index = this._getIndexArea(area);
            if(area && index !== -1){
                var items = this._areaList[index].items;
                for(var j = 0; j < items.length; j++){
                    if(items[j].item.node === node){
                        this._deleteMoveableItem(items[j]);
                        // delete item of the array
                        items.splice(j, 1);
                        return area.removeChild(node); // Object
                    }
                }
            }
            return null;
        },

        _getChildren: function(/*DOMNode*/area){
            var children = [];
            array.forEach(area.childNodes, function(child){
                // delete \n
                if(child.nodeType == 1){
                    if(registry && registry.byNode){
                        var widget = registry.byNode(child);
                        if(widget){
                            if(!widget.dragRestriction){
                                children.push(child);
                            }
                        }
                        else{
                            children.push(child);
                        }
                    }
                    else{
                        children.push(child);
                    }
                }
            });
            return children;	//Array
        },

        _setMarginArea: function(/*Object*/area,/*DOMNode*/node){
            if(area && area.margin === null && node){
                area.margin = domGeom.getMarginExtents(node);
            }
        },

        findCurrentIndexArea: function(/*Object*/coords, /*Object*/size){
            this._oldIndexArea = this._currentIndexArea;
            this._currentIndexArea = this._dropMode.getTargetArea(this._areaList, coords, this._currentIndexArea);
            if(this._currentIndexArea != this._oldIndexArea){
                if(this._oldIndexArea != -1){
                    this.onDragExit(coords, size);
                }
                if(this._currentIndexArea != -1){
                    this.onDragEnter(coords, size);
                }
            }
            return this._currentIndexArea;	//Integer
        },

        _isAccepted: function(/*Array*/ type, /*Array*/ accept){
            this._accept = false;
            for(var i = 0; i < accept.length; ++i){
                for(var j = 0; j < type.length;++j){
                    if(type[j] == accept[i]){
                        this._accept = true;
                        break;
                    }
                }
            }
        },

        onDragStart: function(/*DOMNode*/node, /*Object*/coords, /*Object*/size){
            if(this.autoRefresh){
                this._dropMode.updateAreas(this._areaList);
            }

            // Create the cover :
            var _html = (has("webkit")) ? winUtil.body() : winUtil.body().parentNode;
            if(!this._cover){
                this._cover = domConstruct.create('div', {
                    'class': "dndCover"
                });
                this._cover2 = lang.clone(this._cover);
                domClass.add(this._cover2, "dndCover2");
            }
            var h = _html.scrollHeight+"px";
            this._cover.style.height = this._cover2.style.height = h;
            winUtil.body().appendChild(this._cover);
            winUtil.body().appendChild(this._cover2);

            this._dragStartHandler = connect.connect(node.ownerDocument, "ondragstart", event, "stop");
            // to know the source
            this._sourceIndexArea = this._lastValidIndexArea = this._currentIndexArea = this._getIndexArea(node.parentNode);
            // delete the dragItem into the source area
            var sourceArea = this._areaList[this._sourceIndexArea];
            var children = sourceArea.items;
            for(var i = 0; i < children.length; i++){
                if(children[i].item.node == node){
                    this._dragItem = children[i];
                    this._dragItem.handlers.push(connect.connect(this._dragItem.item, "onDrag", this, "onDrag"));
                    this._dragItem.handlers.push(connect.connect(this._dragItem.item, "onDragEnd", this, "onDrop"));
                    children.splice(i,1);
                    this._currentDropIndex = this._sourceDropIndex = i;
                    break;
                }
            }
            var nodeRef = null;
            if(this._sourceDropIndex !== sourceArea.items.length){
                nodeRef = sourceArea.items[this._sourceDropIndex].item.node;
            }
            // IE7 OPTIMIZATION
            if(has("ie")> 7){
                // connect these events on the cover
                this._eventsIE7 = [
                    connect.connect(this._cover, touch.over, event, "stop"),
                    connect.connect(this._cover, touch.out, event, "stop"),
                    connect.connect(this._cover, touch.enter, event, "stop"),
                    connect.connect(this._cover, touch.leave, event, "stop")
                ];
            }

            var s = node.style;
            s.left = coords.x+"px";
            s.top = coords.y+"px";
            // attach the node to the cover
            if(s.position == "relative" || s.position == ""){
                s.position = "absolute"; // enforcing the absolute mode
            }
            this._cover.appendChild(node);

            this._dropIndicator.place(sourceArea.node, nodeRef, size);
            // add a style to place the _dragNode in foreground
            domClass.add(node, "dragNode");
            // A dragged node is always draggable in this source area.
            this._accept = true;
            //Fix defect 13991, publish message to specific topic
            var gridContainerId = sourceArea.node.parentNode.parentNode.parentNode.parentNode.id;
            connect.publish("/dojox/mdnd/drag/start/" + gridContainerId, [node, sourceArea, this._sourceDropIndex]);
        },

        onDragEnter: function(/*Object*/coords, /*Object*/size){
            if(this._currentIndexArea === this._sourceIndexArea){
                this._accept = true;
            }
            else{
                this._isAccepted(this._dragItem.type, this._areaList[this._currentIndexArea].accept);
            }
        },

        onDragExit: function(/*Object*/coords, /*Object*/size){
            this._accept = false;
        },

        onDrag: function(/*DOMNode*/node, /*Object*/coords, /*Object*/size, /*Object*/mousePosition){
            var coordinates = this._dropMode.getDragPoint(coords, size, mousePosition);
            this.findCurrentIndexArea(coordinates, size);
            if(this._currentIndexArea !== -1 && this._accept){
                this.placeDropIndicator(coordinates, size);
            }
        },

        placeDropIndicator: function(/*Object*/coords, /*Object*/size){
            this._oldDropIndex = this._currentDropIndex;
            // calculate all children marker (see VerticalDropMode.initItems())
            var area = this._areaList[this._currentIndexArea];
            if(!area.initItems){
                this._dropMode.initItems(area);
            }
            //get the index where the drop has to be placed.
            this._currentDropIndex = this._dropMode.getDropIndex(area, coords);
            if(!(this._currentIndexArea === this._oldIndexArea && this._oldDropIndex === this._currentDropIndex)){
                this._placeDropIndicator(size);
            }
            return this._currentDropIndex;	//Integer
        },

        _placeDropIndicator: function(/*Object*/size){
            var oldArea = this._areaList[this._lastValidIndexArea];
            var currentArea = this._areaList[this._currentIndexArea];
            //refresh the previous area after moving out the drop indicator
            this._dropMode.refreshItems(oldArea, this._oldDropIndex, size, false);
            // place dropIndicator
            var node = null;
            if(this._currentDropIndex != -1){
                node = currentArea.items[this._currentDropIndex].item.node;
            }
            this._dropIndicator.place(currentArea.node, node);
            this._lastValidIndexArea = this._currentIndexArea;
            //refresh the current area after placing the drop indicator
            this._dropMode.refreshItems(currentArea, this._currentDropIndex, size, true);
        },

        onDropCancel: function(){
            if(!this._accept){
                var index = this._getIndexArea(this._dropIndicator.node.parentNode);
                if(index != -1){
                    this._currentIndexArea = index;
                }
                else{
                    // case if the dropIndicator is in the area which has been unregistered during the drag.
                    // chose by default the first area.
                    this._currentIndexArea = 0;
                }
            }
        },

        onDrop: function(/*DOMNode*/node){
            this.onDropCancel();
            var targetArea = this._areaList[this._currentIndexArea];
            domClass.remove(node, "dragNode");
            var style = node.style;
            style.position = "relative";
            style.left = "0";
            style.top = "0";
            if(domClass.contains(node, "layoutFloating")){
                //TODO
            }else{
                style.width = "auto";
            }

            if(targetArea.node == this._dropIndicator.node.parentNode){
                targetArea.node.insertBefore(node, this._dropIndicator.node);
            }
            else{
                // case if the dropIndicator is in the area which has been unregistered during the drag.
                targetArea.node.appendChild(node);
                this._currentDropIndex = targetArea.items.length;
            }
            // add child into the new target area.
            var indexChild = this._currentDropIndex;
            if(indexChild == -1){
                indexChild = targetArea.items.length;
            }
            var children = targetArea.items;
            var firstListArea = children.slice(0, indexChild);
            var lastListArea = children.slice(indexChild, children.length);
            firstListArea[firstListArea.length] = this._dragItem;
            targetArea.items = firstListArea.concat(lastListArea);

            this._setMarginArea(targetArea, node);
            array.forEach(this._areaList, function(obj){
                obj.initItems = false;
            });
            // disconnect onDrop handler
            connect.disconnect(this._dragItem.handlers.pop());
            connect.disconnect(this._dragItem.handlers.pop());
            this._resetAfterDrop();
            // remove the cover
            if(this._cover){
                winUtil.body().removeChild(this._cover);
                winUtil.body().removeChild(this._cover2);
            }
            //Fix defect 13991, publish message to specific topic
            var gridContainerId = targetArea.node.parentNode.parentNode.parentNode.parentNode.id;
            connect.publish("/dojox/mdnd/drop/" + gridContainerId, [node, targetArea, indexChild]);
        },

        _resetAfterDrop: function(){
            this._accept = false;
            this._dragItem = null;
            this._currentDropIndex = -1;
            this._currentIndexArea = -1;
            this._oldDropIndex = -1;
            this._sourceIndexArea = -1;
            this._sourceDropIndex = -1;
            this._dropIndicator.remove();
            if(this._dragStartHandler){
                connect.disconnect(this._dragStartHandler);
            }
            if(has("ie") > 7){
                array.forEach(this._eventsIE7, connect.disconnect);
            }
        },

        destroy: function(){
            while(this._areaList.length > 0){
                if(!this.unregister(this._areaList[0].node)){
                    throw new Error("Error while destroying AreaManager");
                }
            }
            connect.disconnect(this.resizeHandler);
            this._dropIndicator.destroy();
            this._dropMode.destroy();
            if(_AutoScroll.autoScroll.autoScroll){
                _AutoScroll.autoScroll.destroy();
            }
            if(this.refreshListener){
                connect.unsubscribe(this.refreshListener);
            }
            // destroy the cover
            if(this._cover){
                domConstruct.destroy(this._cover);
                domConstruct.destroy(this._cover2);
                delete this._cover;
                delete this._cover2;
            }
        }
    });
    if(_Widget){
        lang.extend(_Widget, {
            dndType : "text"
        });
    }

    _AreaManager._areaManager = null;
    _AreaManager.areaManager = function(){
        if(!_AreaManager._areaManager){
            _AreaManager._areaManager = new _AreaManager();
        }
        return _AreaManager._areaManager;
    };

    return _AreaManager;
});