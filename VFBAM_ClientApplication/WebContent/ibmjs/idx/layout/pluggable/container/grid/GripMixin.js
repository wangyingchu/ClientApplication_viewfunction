/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/_base/window",
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/dom-class"
],function( declare, winUtil, array, connect, domClass){
	/**
	 * This Mixin is for hasResizableColumns == true, then the Grips are created between
	 * every column in Grid Layout
	 */
	return {


        // hasResizableColumns: Boolean
        //		whether the grid container can be resized in column way
        hasResizableColumns: false,

       _createGrip: function(/*Integer*/ index){
            var dropZone = this._grid[index],
                grip = domConstruct.create("div", { 'class': "gridContainerGrip fpGridContainerGrip" }, this.domNode);
            dropZone.grip = grip;
            dropZone.gripHandler = [
                this.connect(grip, touch.over, function(e){
                    var gridContainerGripShow = false;
                    for(var i = 0; i < this._grid.length - 1; i++){
                        if(domClass.contains(this._grid[i].grip, "gridContainerGripShow")){
                            gridContainerGripShow = true;
                            break;
                        }
                    }
                    if(!gridContainerGripShow){
                        domClass.replace(e.target, "gridContainerGripShow", "gridContainerGrip");
                    }
                })[0],
                this.connect(grip, touch.out, function(e){
                    if(!this._isResized){
                        domClass.replace(e.target, "gridContainerGrip", "gridContainerGripShow");
                    }
                })[0],
                this.connect(grip, touch.press, "_resizeColumnOn")[0],
                this.connect(grip, "ondblclick", "_onGripDbClick")[0]
            ];
        },

        _placeGrips: function(){
            var gripWidth, height, left = 0, grip;
            //var scroll = this.domNode.style.overflowY;

            array.forEach(this._grid, function(dropZone){
                if(dropZone.grip){
                    grip = dropZone.grip;
                    if(!gripWidth){
                        gripWidth = grip.offsetWidth / 2;
                    }

                    left += domGeom.getMarginBox(dropZone.node).w;

                    domStyle.set(grip, "left", (left - gripWidth) + "px");
                    if(!height){
                        height = domGeom.getContentBox(this.gridNode).h;
                    }
                    if(height > 0){
                        domStyle.set(grip, "height", height + "px");
                    }
                }
            }, this);
        },

        _onGripDbClick: function(){
            this._updateColumnsWidth(this._dragManager);
            this.resize();
        },

        onResizeHandleEnd: function(e, size){
            //Stub function
        },

        _resizeColumnOn: function(/*Event*/e){
            this._activeGrip = e.target;
            this._initX = e.pageX;
            e.preventDefault();

            winUtil.body().style.cursor = "ew-resize";

            this._isResized = true;

            var tabSize = [];
            var grid;
            var i;

            for(i = 0; i < this._grid.length; i++){
                tabSize[i] = domGeom.getContentBox(this._grid[i].node).w;
            }

            this._oldTabSize = tabSize;

            for(i = 0; i < this._grid.length; i++){
                grid = this._grid[i];
                if(this._activeGrip == grid.grip){
                    this._currentColumn = grid.node;
                    this._currentColumnWidth = tabSize[i];
                    this._nextColumn = this._grid[i + 1].node;
                    this._nextColumnWidth = tabSize[i + 1];
                }
                grid.node.style.width = tabSize[i] + "px";
            }

            // calculate the minWidh of all children for current and next column
            var calculateChildMinWidth = function(childNodes, minChild){
                var width = 0;
                var childMinWidth = 0;

                array.forEach(childNodes, function(child){
                    if(child.nodeType == 1){
                        var objectStyle = domStyle.getComputedStyle(child);
                        var minWidth = (has("ie")) ? minChild : parseInt(objectStyle.minWidth);

                        childMinWidth = minWidth +
                            parseInt(objectStyle.marginLeft) +
                            parseInt(objectStyle.marginRight);

                        if(width < childMinWidth){
                            width = childMinWidth;
                        }
                    }
                });
                return width;
            };
            var currentColumnMinWidth = calculateChildMinWidth(this._currentColumn.childNodes, this.minChildWidth);

            var nextColumnMinWidth = calculateChildMinWidth(this._nextColumn.childNodes, this.minChildWidth);

            var minPix = Math.round((domGeom.getMarginBox(this.gridContainerTable).w * this.minColWidth) / 100);

            this._currentMinCol = currentColumnMinWidth;
            this._nextMinCol = nextColumnMinWidth;

            if(minPix > this._currentMinCol){
                this._currentMinCol = minPix;
            }
            if(minPix > this._nextMinCol){
                this._nextMinCol = minPix;
            }
            this._connectResizeColumnMove = connect.connect(winUtil.doc, touch.move, this, "_resizeColumnMove");
            this._connectOnGripMouseUp = connect.connect(winUtil.doc, touch.release, this, "_onGripMouseUp");
        },

        _onGripMouseUp: function(){
            winUtil.body().style.cursor = "default";

            connect.disconnect(this._connectResizeColumnMove);
            connect.disconnect(this._connectOnGripMouseUp);

            this._connectOnGripMouseUp = this._connectResizeColumnMove = null;

            if(this._activeGrip){
                domClass.replace(this._activeGrip, "gridContainerGrip", "gridContainerGripShow");
            }

            this._isResized = false;
        },

        _resizeColumnMove: function(/*Event*/e){
            e.preventDefault();
            if(!this._connectResizeColumnOff){
                connect.disconnect(this._connectOnGripMouseUp);
                this._connectOnGripMouseUp = null;
                this._connectResizeColumnOff = connect.connect(winUtil.doc, touch.release, this, "_resizeColumnOff");
            }

            var d = e.pageX - this._initX;
            if(d == 0){ return; }

            if(!(this._currentColumnWidth + d < this._currentMinCol ||
                this._nextColumnWidth - d < this._nextMinCol)){

                this._currentColumnWidth += d;
                this._nextColumnWidth -= d;
                this._initX = e.pageX;
                this._activeGrip.style.left = parseInt(this._activeGrip.style.left) + d + "px";

                if(this.liveResizeColumns){
                    this._currentColumn.style["width"] = this._currentColumnWidth + "px";
                    this._nextColumn.style["width"] = this._nextColumnWidth + "px";
                    this.resize();
                }
            }
        },

        _resizeColumnOff: function(/*Event*/e){
            winUtil.body().style.cursor = "default";

            connect.disconnect(this._connectResizeColumnMove);
            connect.disconnect(this._connectResizeColumnOff);

            this._connectResizeColumnOff = this._connectResizeColumnMove = null;

            if(!this.liveResizeColumns){
                this._currentColumn.style["width"] = this._currentColumnWidth + "px";
                this._nextColumn.style["width"] = this._nextColumnWidth + "px";
                //this.resize();
            }

            var tabSize = [],
                testSize = [],
                tabWidth = this.gridContainerTable.clientWidth,
                node,
                update = false,
                i;

            for(i = 0; i < this._grid.length; i++){
                node = this._grid[i].node;
                if(has("ie")){
                    tabSize[i] = domGeom.getMarginBox(node).w;
                    testSize[i] = domGeom.getContentBox(node).w;
                }
                else{
                    tabSize[i] = domGeom.getContentBox(node).w;
                    testSize = tabSize;
                }
            }

            for(i = 0; i < testSize.length; i++){
                if(testSize[i] != this._oldTabSize[i]){
                    update = true;
                    break;
                }
            }

            if(update){
                var mul = has("ie") ? 100 : 10000;
                for(i = 0; i < this._grid.length; i++){
                    this._grid[i].node.style.width = Math.round((100 * mul * tabSize[i]) / tabWidth) / mul + "%";
                }
                this.resize();
            }

            if(this._activeGrip){
                domClass.replace(this._activeGrip, "gridContainerGrip", "gridContainerGripShow");
            }

            this._isResized = false;
        }
	};
});