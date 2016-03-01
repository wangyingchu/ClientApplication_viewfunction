/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/when",
    "dojo/store/Memory"
], function( lang, declare, when, Memory ){
    var _TreeStoreModel = declare( null, {

        store: null,
        idProperty: "id",
        labelAttr: "title",  //usually "name" as default
        labelType: "text",
        childrenAttr: "children",
        typeAttr: "type",

        constructor: function(/* Object */ args){
            lang.mixin(this, args);

            this.childrenAttr = this.childrenAttr || "children";

            if(!this.store){
                this.store = new Memory({
                    data: []
                });
            }

            this.store.hasChildren = lang.hitch(this, function(item){
                if(!item){return false}
                if(lang.isObject(item) || lang.isString(item)){
                    if(lang.isString(item)){
                        item = this.store.get(item);
                    }else{
                        var id = this.store.getIdentity(item);
                        item = this.store.get(id);
                    }
                    return item && item[this.childrenAttr] && item[this.childrenAttr].length;
                }
                return false;
            });
            this.store.getChildren = lang.hitch(this, function(item, options){
                if(!item){return false}
                if(lang.isObject(item) || lang.isString(item)){
                    if(lang.isString(item)){
                        item = this.store.get(item);
                    }else{
                        var id = this.store.getIdentity(item);
                        item = this.store.get(id);
                    }
                    if(item && item[this.childrenAttr]){
                        var query = null;
                        if(options && options.query){
                            query = options.query;
                        }
                        return QueryResults(SimpleQueryEngine(query, options)(item[this.childrenAttr]));
                    }else{
                        return [];
                    }
                }
                return [];
            });

        },

        destroy: function(){
            this.store = null;
        },

        hasChildren: function(/*id or item Object*/item){
            return this.store.hasChildren(item);
        },

        getRootChildren: function(/*function(items)*/ onComplete, /*function*/ onError, forceLoad){
            var res;
            when(res = this.store.query(),
                lang.hitch(this, function(items){
                    onComplete(items);
                }),
                onError
            );
        },

        getChildren: function(/*id or item Object*/item, /*function(items)*/ onComplete, /*function*/ onError, forceLoad){
            if(!item){
                onComplete([]);
            }else{
                if(lang.isObject(item) || lang.isString(item)){
                    if(lang.isString(item)){
                        item = this.store.get(item);
                    }else{
                        var id = this.store.getIdentity(item);
                        item = this.store.get(id);
                    }

                    var res = this.store.getChildren(item);

                    when(res, onComplete, onError);
                }else{
                    onComplete([]);
                }
            }
        },

        treePath: function(/*id or item Object*/item){
            var path = [];
            //TODO
            return path;
        },

        getItem: function(id){
            if(id){
                return this.store.get(id);
            }else{
                return null;
            }
        },

        isRootLevelItem: function(/* item or id */ item){
            if(lang.isObject(item) || lang.isString(item)){
                if(lang.isString(item)){
                    item = this.store.get(item);
                }else{
                    var id = this.store.getIdentity(item);
                    item = this.store.get(id);
                }
                if(item.rootLevel){
                    return true;
                }
            }
            return false;	// Boolean
        },

        isItem: function(/*===== something =====*/){
            return true;	// Boolean
        },

        getIdentity: function(/* item */ item){
            return this.store.getIdentity(item);	// Object
        },

        getLabel: function(/*dojo/data/Item*/ item){
            // summary:
            //		Get the label for an item
            return item[this.labelAttr];	// String
        }

    });

    return _TreeStoreModel;
});