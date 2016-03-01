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
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/sniff",
    "dojo/dom-attr",
    "dojo/NodeList",
    "dojo/query",
    "dojo/keys",
    "dojo/_base/event",
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/registry",
    "dijit/_base/focus",
    "./_AreaManager",
    "./_DropIndicator",
    "./_OverDropMode",
    "./_AutoScroll",
    "dojo/text!../templates/GridContainer.html"
],function( lang, declare, connect, winUtil, array, domConstruct, domClass,domGeom, has, domAttr, NodeList, query, keys, events,
		_LayoutWidget, _TemplatedMixin, registry, baseFocus, _AreaManager, _DropIndicator, _OverDropMode, _AutoScroll, gridTemplate){
	/**
	 * 
	 */
    var _GridContainerLite = declare([_LayoutWidget, _TemplatedMixin], {
        autoRefresh: true,
        templateString: gridTemplate,
        dragHandleClass: "dojoxDragHandle",
        nbZones: 1,
        doLayout: true,
        isAutoOrganized: true,
        acceptTypes: ["Portlet", "ContentPane"],
        colWidths: "",
        editDisabled: false,

        constructor: function(/*Object*/props, /*DOMNode*/node){
            this.acceptTypes = (props || {}).acceptTypes || ["Portlet", "ContentPane", "text"];
            this._disabled = true;
        },

        postCreate: function(){
            this.inherited(arguments);
            this._grid = [];

            this._createCells();

            //Fix defect 13991, subscribe to specific topic
            this.subscribe("/dojox/mdnd/drop/" + this.id, "resizeChildAfterDrop");
            this.subscribe("/dojox/mdnd/drag/start/" + this.id, "resizeChildAfterDragStart");

            this._dragManager = _AreaManager.areaManager();
            this._dragManager.autoRefresh = this.autoRefresh;

            this._dragManager.dragHandleClass = this.dragHandleClass;

            if(this.doLayout){
                this._border = {
                    h: has("ie") ? domGeom.getBorderExtents(this.gridContainerTable).h : 0,
                    w: (has("ie") == 6) ? 1 : 0
                };
            }else{
                domStyle.set(this.domNode, "overflowY", "hidden");
                domStyle.set(this.gridContainerTable, "height", "auto");
            }
        },

        startup: function(){
            if(this._started){ return; }
            if(this.isAutoOrganized){
                this._organizeChildren();
            }
            else{
                //this._organizeChildrenManually();
            }
            array.forEach(this.getChildren(), function(child){
                child.startup();
            });

            if(this._isShown()){
                this.enableDnd();
            }
            this.inherited(arguments);
        },

        resizeChildAfterDrop: function(/*Node*/node, /*Object*/targetArea, /*Integer*/indexChild){
            if(this._disabled){
                return false;
            }
            
            var targetColumnNode = targetArea.node;
            if(registry.getEnclosingWidget(targetColumnNode) == this){
                //evans comment 20140724

                var widget = registry.byNode(node);
                if(widget.resize && lang.isFunction(widget.resize)){
                    widget.resize();
                }
                
                // Defect 13978 reset previous column item position
                var previousColumn = widget.get("column"),
                	previousColumnNode = this._grid[previousColumn].node;
                if(previousColumnNode != targetColumnNode){
                	this.resetPositionInColumn(previousColumn);
                }
                
                var column = parseInt(domAttr.get(node.parentNode, "columnIndex"))
                widget.set("column", column);
                this.resetPositionInColumn(column);

                return true;
            }
            return false;
        },
        
        // function for reset position in a single column
        resetPositionInColumn: function(/*Column*/column){
        	var node = this._grid[column].node
        	if(node){
        		var position = 0, 
        			posNode = node.firstChild;
            	if(posNode){
            		var pWidget = registry.byNode(posNode);
                	pWidget.set("position", position);
                	while(posNode.nextSibling){
                		position++;
                		posNode = posNode.nextSibling;
                        pWidget = registry.byNode(posNode);
                        pWidget.set("position", position);
                    }
            	}
        	}
    	},

        resizeChildAfterDragStart: function(/*Node*/node, /*Object*/sourceArea, /*Integer*/indexChild){
            if(this._disabled){
                return false;
            }
            if(registry.getEnclosingWidget(sourceArea.node) == this){
                this._draggedNode = node;
                if(this.doLayout){
                    /*domGeom.setMarginBox(this.gridContainerTable, {
                        h: domGeom.getContentBox(this.gridContainerDiv).h - this._border.h
                    });*/
                }
                return true;
            }
            return false;
        },

        getChildren: function(){

            var children = new NodeList();
            array.forEach(this._grid, function(dropZone){
                query("> [widgetId]", dropZone.node).map(registry.byNode).forEach(function(item){
                    children.push(item);
                });
            });
            return children;	// Array
        },

        _isShown: function(){
            if("open" in this){		// for TitlePane, etc.
                return this.open;		// Boolean
            }
            else{
                var node = this.domNode;
                return (node.style.display != 'none') && (node.style.visibility != 'hidden') && !domClass.contains(node, "dijitHidden"); // Boolean
            }
        },
        /**
         * remove layout logic
         */
        layout: function(){

            array.forEach(this.getChildren(), function(widget){
                if(widget.resize && lang.isFunction(widget.resize)){
                    widget.resize();
                }
            });
        },

        onShow: function(){
            if(this._disabled){
                this.enableDnd();
            }
        },

        onHide: function(){
            if(!this._disabled){
                this.disableDnd();
            }
        },

        _createCells: function(){
            if(this.nbZones === 0){ this.nbZones = 1; }
            var accept = this.acceptTypes.join(","),
                i = 0;

            var widths = this._computeColWidth();

            while(i < this.nbZones){
                this._grid.push({
                    node: domConstruct.create("div", {
                        'class': "gridContainerZone fpGridContainerZone",
                        accept: accept,
                        id: this.id + "_dz" + i,
                        columnIndex: i,
                        style: {
                            'width': widths[i] + "%"
                        }
                    }, this.gridNode)
                });
                i++;
            }
        },

        _getZonesAttr: function(){
            return query(".gridContainerZone",  this.containerNode);
        },

        enableDnd: function(){
            if(this.editDisabled){return;}
            var m = this._dragManager;
            array.forEach(this._grid, function(dropZone){
                m.registerByNode(dropZone.node);
            });
            m._dropMode.updateAreas(m._areaList);
            this._disabled = false;
        },

        disableDnd: function(){
            if(this.editDisabled){return;}
            var m = this._dragManager;
            array.forEach(this._grid, function(dropZone){
                m.unregister(dropZone.node);
            });
            m._dropMode.updateAreas(m._areaList);
            this._disabled = true;
        },

        _organizeChildren: function(){
            // var children = _GridContainerLite.superclass.getChildren.call(this);
            var children = this.getChildren();
            var numZones = this.nbZones,
                numPerZone = Math.floor(children.length / numZones),
                mod = children.length % numZones,
                i = 0;
            
            //Defect 13978 remove children first in case mis-calc item position
            for(var x = 0; x < children.length; x++){
            	var p = children[x].domNode.parentNode;
            	if(p){
            		p.removeChild(children[x].domNode);
            	}
            }            
            
            for(var z = 0; z < numZones; z++){
                for(var r = 0; r < numPerZone; r++){
                    this._insertChild(children[i], z);
                    i++;
                }
                if(mod > 0){
                    try{
                        this._insertChild(children[i], z);
                        i++;
                    }
                    catch(e){
                        console.error("Unable to insert child in GridContainer", e);
                    }
                    mod--;
                }
                else if(numPerZone === 0){
                    break;	// Optimization
                }
				//Defect 13978 reset each column's item position
				this.resetPositionInColumn(z);
            }
        },

        _organizeChildrenManually: function (){
            // var children = _GridContainerLite.superclass.getChildren.call(this);
            var children = this.getChildren();
            var	length = children.length,
                child;
            for(var i = 0; i < length; i++){
                child = children[i];
                try{
                    this._insertChild(child, child.column - 1);
                }
                catch(e){
                    console.error("Unable to insert child in GridContainer", e);
                }
            }
        },

        _insertChild: function(/*Widget*/child, /*Integer*/column, /*Integer?*/p){
            var zone = this._grid[column].node,
                length = zone.childNodes.length,
                position = p;
            if(typeof position === "undefined" || position > length){
                position = length;
            }
            //position re-caculation
            var childPosArray = [];
            array.forEach(zone.childNodes, function(node){
                var cWidget = registry.byNode(node);
                var pos = cWidget.get("position");
                if(pos < -1 || pos == undefined){
                    pos = position;
                }
                childPosArray.push(pos);
            });
            childPosArray.push(position);
            childPosArray.sort();
            p = array.indexOf(childPosArray, position);

            if(this._disabled){
                domConstruct.place(child.domNode, zone, p);
                domAttr.set(child.domNode, "tabIndex", "0");
            }
            else{
                if(!child.dragRestriction){
                    this._dragManager.addDragItem(zone, child.domNode, p, true);
                }
                else{
                    domConstruct.place(child.domNode, zone, p);
                    domAttr.set(child.domNode, "tabIndex", "0");
                }
            }
            child.set("column", column);
            child.set("position", position);
            return child; // Widget
        },

        removeChild: function(/*Widget*/ widget){
            if(this._disabled){
                this.inherited(arguments);
            }
            else{
                if(widget.domNode){
                    this._dragManager.removeDragItem(widget.domNode.parentNode, widget.domNode);
                }
            }
        },

        addChild: function(/*Object*/child, /*Integer?*/column, /*Integer?*/p){
            child.domNode.id = child.id;
            _GridContainerLite.superclass.addChild.call(this, child, 0);
            if(column < 0 || column === undefined){ column = 0; }
            if(p <= 0){ p = 0; }
            try{
                return this._insertChild(child, column, p);
            }
            catch(e){
                console.error("Unable to insert child in GridContainer", e);
            }
            return null; 	// Widget
        },

        _setColWidthsAttr: function(value){
            this.colWidths = lang.isString(value) ? value.split(",") : (lang.isArray(value) ? value : [value]);

            if(this._started){
                this._updateColumnsWidth();
            }
        },

        _updateColumnsWidth: function(/*Object*/ manager){
            var length = this._grid.length;

            var widths = this._computeColWidth();

            // Set the widths of each node
            for (var i = 0; i < length; i++){
                this._grid[i].node.style.width = widths[i] + "%";
            }
        },

        _computeColWidth: function(){
            var origWidths = this.colWidths || [];
            var widths = [];
            var colWidth;
            var widthSum = 0;
            var i;

            // Calculate the widths of each column.
            for(i = 0; i < this.nbZones; i++){
                if(widths.length < origWidths.length){
                    widthSum += origWidths[i] * 1;
                    widths.push(origWidths[i]);
                }else{
                    if(!colWidth){
                        colWidth = (100 - widthSum)/(this.nbZones - i);

                        if(colWidth < 0){
                            colWidth = 100 / this.nbZones;
                        }
                    }
                    widths.push(colWidth);
                    widthSum += colWidth * 1;
                }
            }

            if(widthSum > 100){
                var divisor = 100 / widthSum;
                for(i = 0; i < widths.length; i++){
                    widths[i] *= divisor;
                }
            }
            return widths;
        },

        _selectFocus: function(/*Event*/event){
            if(this._disabled){ return; }
            var key = event.keyCode,
                k = keys,
                zone = null,
                cFocus = baseFocus.getFocus(),
                focusNode = cFocus.node,
                m = this._dragManager,
                found,
                i,
                j,
                r,
                children,
                area,
                widget;
            if(focusNode == this.containerNode){
                area = this.gridNode.childNodes;
                switch(key){
                    case k.DOWN_ARROW:
                    case k.RIGHT_ARROW:
                        found = false;
                        for(i = 0; i < area.length; i++){
                            children = area[i].childNodes;
                            for(j = 0; j < children.length; j++){
                                zone = children[j];
                                if(zone !== null && zone.style.display != "none"){
                                    focus.focus(zone);
                                    events.stop(event);
                                    found = true;
                                    break;
                                }
                            }
                            if(found){ break };
                        }
                        break;
                    case k.UP_ARROW:
                    case k.LEFT_ARROW:
                        area = this.gridNode.childNodes;
                        found = false;
                        for(i = area.length-1; i >= 0 ; i--){
                            children = area[i].childNodes;
                            for(j = children.length; j >= 0; j--){
                                zone = children[j];
                                if(zone !== null && zone.style.display != "none"){
                                    focus.focus(zone);
                                    events.stop(event);
                                    found = true;
                                    break;
                                }
                            }
                            if(found){ break };
                        }
                        break;
                }
            }else{
                if(focusNode && (focusNode.parentNode.parentNode == this.gridNode)){
                    var child = (key == k.UP_ARROW || key == k.LEFT_ARROW) ? "lastChild" : "firstChild";
                    var pos = (key == k.UP_ARROW || key == k.LEFT_ARROW) ? "previousSibling" : "nextSibling";
                    switch(key){
                        case k.UP_ARROW:
                        case k.DOWN_ARROW:
                            events.stop(event);
                            found = false;
                            var focusTemp = focusNode;
                            while(!found){
                                children = focusTemp.parentNode.childNodes;
                                var num = 0;
                                for(i = 0; i < children.length; i++){
                                    if(children[i].style.display != "none"){ num++; }
                                    if(num > 1){ break; }
                                }
                                if(num == 1){ return; }
                                if(focusTemp[pos] === null){
                                    zone = focusTemp.parentNode[child];
                                }
                                else{
                                    zone = focusTemp[pos];
                                }
                                if(zone.style.display === "none"){
                                    focusTemp = zone;
                                }
                                else{
                                    found = true;
                                }
                            }
                            if(event.shiftKey){
                                var parent = focusNode.parentNode;
                                for(i = 0; i < this.gridNode.childNodes.length; i++){
                                    if(parent == this.gridNode.childNodes[i]){
                                        break;
                                    }
                                }
                                children = this.gridNode.childNodes[i].childNodes;
                                for(j = 0; j < children.length; j++){
                                    if(zone == children[j]){
                                        break;
                                    }
                                }
                                if(has("mozilla") || has("webkit")){ i--; }

                                widget = registry.byNode(focusNode);
                                if(!widget.dragRestriction){
                                    r = m.removeDragItem(parent, focusNode);
                                    this.addChild(widget, i, j);
                                    domAttr.set(focusNode, "tabIndex", "0");
                                    focus.focus(focusNode);
                                }
                                else{
                                    topic.publish("/dojox/layout/gridContainer/moveRestriction", this);
                                }
                            }
                            else{
                                focus.focus(zone);
                            }
                            break;
                        case k.RIGHT_ARROW:
                        case k.LEFT_ARROW:
                            events.stop(event);
                            if(event.shiftKey){
                                var z = 0;
                                if(focusNode.parentNode[pos] === null){
                                    if(has("ie") && key == k.LEFT_ARROW){
                                        z = this.gridNode.childNodes.length-1;
                                    }
                                }
                                else if(focusNode.parentNode[pos].nodeType == 3){
                                    z = this.gridNode.childNodes.length - 2;
                                }
                                else{
                                    for(i = 0; i < this.gridNode.childNodes.length; i++){
                                        if(focusNode.parentNode[pos] == this.gridNode.childNodes[i]){
                                            break;
                                        }
                                        z++;
                                    }
                                    if(has("mozilla") || has("webkit")){ z--; }
                                }
                                widget = registry.byNode(focusNode);
                                var _dndType = focusNode.getAttribute("dndtype");
                                if(_dndType === null){
                                    //check if it's a dijit object
                                    if(widget && widget.dndType){
                                        _dndType = widget.dndType.split(/\s*,\s*/);
                                    }
                                    else{
                                        _dndType = ["text"];
                                    }
                                }
                                else{
                                    _dndType = _dndType.split(/\s*,\s*/);
                                }
                                var accept = false;
                                for(i = 0; i < this.acceptTypes.length; i++){
                                    for(j = 0; j < _dndType.length; j++){
                                        if(_dndType[j] == this.acceptTypes[i]){
                                            accept = true;
                                            break;
                                        }
                                    }
                                }
                                if(accept && !widget.dragRestriction){
                                    var parentSource = focusNode.parentNode,
                                        place = 0;
                                    if(k.LEFT_ARROW == key){
                                        var t = z;
                                        if(has("mozilla") || has("webkit")){ t = z + 1; }
                                        place = this.gridNode.childNodes[t].childNodes.length;
                                    }
                                    // delete of manager :
                                    r = m.removeDragItem(parentSource, focusNode);
                                    this.addChild(widget, z, place);
                                    domAttr.set(r, "tabIndex", "0");
                                    focus.focus(r);
                                }
                                else{
                                    topic.publish("/dojox/layout/gridContainer/moveRestriction", this);
                                }
                            }
                            else{
                                var node = focusNode.parentNode;
                                while(zone === null){
                                    if(node[pos] !== null && node[pos].nodeType !== 3){
                                        node = node[pos];
                                    }
                                    else{
                                        if(pos === "previousSibling"){
                                            node = node.parentNode.childNodes[node.parentNode.childNodes.length-1];
                                        }
                                        else{
                                            node = node.parentNode.childNodes[has("ie") ? 0 : 1];
                                        }
                                    }
                                    zone = node[child];
                                    if(zone && zone.style.display == "none"){
                                        // check that all elements are not hidden
                                        children = zone.parentNode.childNodes;
                                        var childToSelect = null;
                                        if(pos == "previousSibling"){
                                            for(i = children.length-1; i >= 0; i--){
                                                if(children[i].style.display != "none"){
                                                    childToSelect = children[i];
                                                    break;
                                                }
                                            }
                                        }
                                        else{
                                            for(i = 0; i < children.length; i++){
                                                if(children[i].style.display != "none"){
                                                    childToSelect = children[i];
                                                    break;
                                                }
                                            }
                                        }
                                        if(!childToSelect){
                                            focusNode = zone;
                                            node = focusNode.parentNode;
                                            zone = null;
                                        }
                                        else{
                                            zone = childToSelect;
                                        }
                                    }
                                }
                                focus.focus(zone);
                            }
                            break;
                    }
                }
            }
        },

        destroy: function(){
            var m = this._dragManager;
            array.forEach(this._grid, function(dropZone){
                m.unregister(dropZone.node);
            });
            this.inherited(arguments);
        }
    });

    return _GridContainerLite;

});