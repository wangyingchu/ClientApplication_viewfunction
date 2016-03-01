/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/Tooltip",
    "dojo/dom-class",
    "dojo/touch",
], function( declare, lang, on, Tooltip, domClass, touch){
	//Customization tooltip widget for FlipCard
	var _Tooltip = declare("_Tooltip", [Tooltip], {
		
		showDelay: 300,
		hideDelay: 500,

        onCustomerHover: function(){
            //
            // Provide Customer Event Handler
            //
            return true;
        },


        _onHover: function(/*DomNode*/ target){
            if ( lang.isFunction(this.onCustomerHover) && this.onCustomerHover() )
                this.inherited(arguments);
        },

        onCustomerUnHover: function(){
            //
            // Provide Customer Event Handler
            //
            return true;
        },


        _onUnHover: function(){
            if ( lang.isFunction(this.onCustomerUnHover) && this.onCustomerUnHover() )
                this.inherited(arguments);
        },
		
		
		
		onShow: function(){
			_Tooltip._masterTT = Tooltip._masterTT;
			if(_Tooltip._masterTT){
				domClass.add(_Tooltip._masterTT.domNode, "fcNavTooltip");
				
				if(this.hoverSignal && this.hoverSignal.remove){
					this.hoverSignal.remove();
				}
				if(this.unhoverSignal && this.unhoverSignal.remove){
					this.unhoverSignal.remove();
				}
				this.hoverSignal = on(_Tooltip._masterTT.domNode, touch.enter, lang.hitch(this, "_onHover"));
				this.unhoverSignal = on(_Tooltip._masterTT.domNode, touch.leave, lang.hitch(this, "_onUnHover"));
			}
		}
		
	});
	_Tooltip._MasterTooltip = Tooltip._MasterTooltip;
	_Tooltip.show = Tooltip.show;
	_Tooltip.hide = Tooltip.hide;
	_Tooltip.defaultPosition = ["after-centered", "before-centered"];
	
	return _Tooltip;
});