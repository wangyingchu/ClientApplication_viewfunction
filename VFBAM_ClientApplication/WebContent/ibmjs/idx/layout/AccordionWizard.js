/**
 * Licensed Materials - Property of IBM (C) Copyright IBM Corp. 2012 US Government Users Restricted Rights - Use,
 * duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/string",
	"dojo/aspect",
	"dojo/on",
	"dojo/keys",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-geometry",
	"dijit/a11y",
	"dijit/registry",
	"dijit/focus",
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/Button",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"idx/util",
	"idx/layout/ButtonBar",
	"idx/form/buttons",
	"./BorderContainer",
	"./_Wizard",
	"dojo/i18n!./nls/_Wizard",
	"dojo/text!./templates/AccordionWizard.html",
	"dojo/text!./templates/_AccordionWizardViewport.html"
], //
function(declare,
		 dArray, 
		 dLang,
		 dString,
		 dAspect,
		 dOn,
		 dKeys,
		 dDomStyle,
		 dDomClass,
		 dDomConstruct,
		 dDomAttr,
		 dDomGeometry,
		 dA11y,
		 dRegistry,
		 dFocusManager,
		 dWidget,
		 dTemplatedMixin,
		 dWidgetsInTemplateMixin,
		 dButton,
		 dStackContainer,
		 dContentPane,
		 iUtil,
		 iButtonBar,
		 iButtons,
		 iBorderContainer,
		 iWizard,
		 messages,
		 templateText,
		 viewportTemplateText) {

	/**
	 * Provides the wrapper widget for each accordion view port.
	 */
	var Viewport = declare("idx.layout._AccordionWizardViewport", [dWidget,dTemplatedMixin,dWidgetsInTemplateMixin], {
		templateString: viewportTemplateText,
		baseClass: "idxAccordionWizardViewport",
		
		/**
		 * The wizard pane to which this pane is linked.
		 */
		wizardPane: null,
		
		/**
		 * The wizard to which this instance belongs.
		 */
		wizard: null,
			
		/**
		 *
		 */
		constructor: function() {
			this._substeps = [];
			this._paneHandlesLookup = {};
			this._lastSelectedIndex = 0;
			this._stepTabs = {};
			this._stepMarkers = {};
			this._visitedMarkers = {};
			this._stepHandles = [];
		},

		/**
		 *
		 */
		getFirstWizardPane: function() {
			if (!this.wizardPane || this.wizardPane.get("disabled")) return null;
			if (!this.wizardPane.get("headingOnly")) {
				return this.wizardPane;
			}
			var index = 0;
			var substep = null;
			for (index = 0; index < this._substeps.length; index++) {
				substep = this._substeps[index];
				if (!substep.get("hidden") && !substep.get("disabled")) {
					return substep;
				}
			}
		},
		
		/**
		 *
		 */
		getVisibleSubsteps: function() {
			var result = [], index = 0, substep = null;
			for (index = 0; index < this._substeps.length; index++) {
				substep = this._substeps[index];
				if (!substep.get("hidden")) result.push(substep);
			}
			return result;
			
		},
		
		/**
		 *
		 */
		getVisibleSubstepCount: function() {
			var count = 0, index = 0, substep = null;
			for (index = 0; index < this._substeps.length; index++) {
				substep = this._substeps[index];
				if (!substep.get("hidden")) count++;
			}
			return count;
		},

		/**
		 *
		 */
		getVisibleSubstepIndex: function() {
			var found = false, vindex = -1, index = 0, substep = null, selected = this.wizard.getSelected();
			for (index = 0; index < this._substeps.length; index++) {
				substep = this._substeps[index];
				if (substep.get("hidden")) continue;
				vindex++;
				if (substep === selected) {
					found = true;
					break;
				}
			}
			return (found?vindex:-1);
		},
		
		/**
		 *
		 */
		isDisabled: function() {
			var index = 0;
			var pane = null;
			if (this.wizardPane && this.wizardPane.get("disabled")) return true;
			if (this.wizardPane && (!this.wizardPane.get("headingOnly"))) return false;
			for (index = 0; index < this._substeps.length; index++) {
				pane = this._substeps[index];
				if ((!pane.get("hidden"))&&(!pane.get("disabled"))) {
					return false;
				}
			}
			return true;
		},
		
		/**
		 *
		 */
		isHidden: function() {
			var index = 0;
			var pane = null;
			if (this.wizardPane && this.wizardPane.get("hidden")) return true;
			if (this.wizardPane && (this.wizardPane.get("headingOnly"))) {
				for (index = 0; index < this._substeps.length; index++) {
					pane = this._substeps[index];
					if (!pane.get("hidden")) {
						return false;
					}
				}
				return true;
			}
			return false;
		},
		
		/** 
		 * Sets the Wizard for this instance.  This should be set upon construction.
		 */
		_setWizardAttr: function(wizard) {
			if (this._wizardHandles) {
				dArray.forEach(this._wizardHandles, dLang.hitch(this, function(handle) {
					handle.remove();
				}));
			}
			this._wizardHandles = [];
			this.wizard = wizard;
		},
		
		/** 
		 * Sets the main WizardPane for this instance.  This should be set upon construction.
		 */
		_setWizardPaneAttr: function(wizardPane) {
			var wizardPaneHandles = null;
			if (this.wizardPane) {
				wizardPaneHandles = this._paneHandlesLookup[this.wizardPane.id];
				if (wizardPaneHandles) {
					dArray.forEach(wizardPaneHandles, dLang.hitch(this, function(handle) {
						handle.remove();
					}));
				}
			}
			
			wizardPaneHandles = [];
			this.wizardPane = wizardPane;
			if (this.wizardPane) {
				this._paneHandlesLookup[this.wizardPane.id] = wizardPaneHandles;
				this.wizardPane.placeAt(this.containerNode, "first");
				this._attachWatchers(this.wizardPane);
				this.updateSubsteps();
				this._updateDisabled(this.wizardPane);
				this._updateTitle(this.wizardPane);
				this._updateVisited(this.wizardPane);
			}
		},

		/**
		 *
		 */
		_attachWatchers: function(pane) {
			var wizardPaneHandles = this._paneHandlesLookup[pane.id];
			wizardPaneHandles.push(iUtil.watch(pane, "label", dLang.hitch(this, this._updateAttr, pane)));
			wizardPaneHandles.push(iUtil.watch(pane, "labelClass", dLang.hitch(this, this._updateAttr, pane)));
			wizardPaneHandles.push(iUtil.watch(pane, "visited", dLang.hitch(this, this._updateAttr, pane)));						
			wizardPaneHandles.push(iUtil.watch(pane, "disabled", dLang.hitch(this, this._updateAttr, pane)));						
			wizardPaneHandles.push(iUtil.watch(pane, "hidden", dLang.hitch(this, this._updateAttr, pane)));						
		},
		
		/**
		 *
		 */
		startup: function() {
			this.inherited(arguments);
			//dDomStyle.set(this.wizardPane.domNode, {width: "100%", height: "100%"});
		},
		
		/**
		 * Updates attributes that are being watched.
		 *
		 * @param attrName The name of the attribute being watched.
		 * @param oldValue The old value of the attribute.
		 * @param newValue The new value of the attribute.
		 */
		_updateAttr: function(pane, attrName, oldValue, newValue) {
			switch (attrName) {
				case "label":
					this._updateTitle(pane, oldValue);
					break;
				case "labelClass":
					this._updateLabelClass(pane, oldValue);
					break;
				case "visited":
					this._updateVisited(pane, oldValue);
					break;
				case "headingOnly":
					this._updateHeadingOnly(pane, oldValue);
					break;
				case "disabled":
					this._updateDisabled(pane, oldValue);
					break;
				case "hidden":
					this._updateHidden(pane, oldValue);
					break;
				default:
					// do nothing
			}
		},
		
		/**
		 * Updates the title for the viewport.
		 */
		_updateTitle: function(pane, oldValue) {
			if (pane === this.wizardPane) {
				var label = (this.wizardPane) ? this.wizardPane.get("label") : "";
				this.titleNode.innerHTML = label;
				this.contentTitleNode.innerHTML = label;
			} else {
			
			}
		},
		
		/**
		 * Updates the label class, setting it on the titleBarNode.
		 * This method also removes the old label class.
		 */
		_updateLabelClass: function(pane, oldValue) {
			if (pane === this.wizardPane) { 
				if (oldValue) dDomClass.remove(this.titleBarNode, oldValue);
				dDomClass.add(this.titleBarNode, this._wizardPane.get("labelClass"));
			} else {
			
			}
		},
		
		/**
		 *
		 */
		_updateHeadingOnly: function(pane, oldValue) {
			if (pane === this.wizardPane) {
				this._updateVisited(this.wizardPane);
			}
			this.updateViewport();
		},
		
		/**
		 *
		 */
		_updateDisabled: function(pane, oldValue) {
			if (this.wizardPane === pane) {
				dDomClass.toggle(this.domNode, this.baseClass + "Disabled", this.wizardPane.get("disabled"));
			}
			var stepTab = this._stepTabs[pane.id];
			if (stepTab) {
				dDomClass.toggle(stepTab, this.baseClass + "StepDisabled", pane.get("disabled"));
			}
			this._updateVisited(this.wizardPane);
			this.updateViewport();
		},
		
		/**
		 *
		 */
		_updateHidden: function(pane, oldValue) {
			this._updateVisited(this.wizardPane);
			this.updateViewport();
		},
		
		/**
		 * Updates the visited flag for the viewport.
		 */
		_updateVisited: function(pane, oldValue) {
			this._updateStepVisitedMarker(pane);
			
			// handle the main visited checkmark
			var visited = this.isVisited();
			dDomClass.toggle(this.domNode, this.baseClass + "Visited", visited);
		},
		
		isVisited: function() {
			// handle the main visited checkmark
			var visited = true;
			var index = 0;
			if (this.wizardPane.get("headingOnly")||this.wizardPane.get("visited")) {
				for (index = 0; index < this._substeps.length; index++) {
					if (this._substeps[index].get("disabled")) continue;
					if (this._substeps[index].get("hidden")) continue;
					if (!this._substeps[index].get("visited")) {
						visited = false;
						break;
					}
				}
			} else {
				visited = false;
			}
			return visited;
		},
		
		/**
		 *
		 */
		_updateStepVisitedMarker: function(step) {
			// handle the step visiited check mark
			var visitedMarker = null;
			var a11yVisitedMarker = null;
			var stepTab = this._stepTabs[step.id];
			var visited = false;
			var style = {};
			var leadingX = 0;
			var ltr = this.isLeftToRight();
			var leadingSide = (ltr ? "left" : "right");
			var dim = null;
			if (stepTab) {
				stepTab = this._stepTabs[step.id];
				visitedMarker = this._visitedMarkers[step.id];
				visited = step.get("visited");
				if (visited) {
					if (!visitedMarker) {
						visitedMarker = dDomConstruct.create(
							"div", {"role": "presentation", "class": this.baseClass + "StepVisitedMarker"}, 
							this.substepListNode, "last");
						a11yVisitedMarker = dDomConstruct.create(
							"div", {"role": "presentation", "class": this.baseClass + "StepVisitedSymbol"},
							visitedMarker, "only");
						a11yVisitedMarker.innerHTML = "\u2714";
						this._visitedMarkers[step.id] = visitedMarker;
						this._attachToStepNode(step, visitedMarker);
						
					} else {
						dDomConstruct.place(visitedMarker, this.substepListNode, "last");
						dim = dDomGeometry.getMarginBox(stepTab);
						leadingX = ((ltr) ? dim.l : (dDomGeometry.getMarginBox(this.substepListNode).w-(dim.l+dim.w)))
								   + (dim.w - dDomGeometry.getMarginBox(visitedMarker).w)/2;
									
						style[leadingSide] = leadingX + "px";
						dDomStyle.set(visitedMarker, style);
					}
					
				} else if (visitedMarker) {
					dDomConstruct.destroy(visitedMarker);
					this._visitedMarkers[step.id] = null;
				}
			}					
		},
		
		/**
		 *
		 */
		postCreate: function() {
			this.own(dOn(this.titleBarNode, "click", dLang.hitch(this,this.onTitleBarClick)));
			this.own(dOn(this.titleBarNode, "mouseover", dLang.hitch(this,this.onTitleBarMouseOver)));
			this.own(dOn(this.titleBarNode, "mouseout", dLang.hitch(this,this.onTitleBarMouseOut)));
			this.own(dOn(this.titleNode, "focus", dLang.hitch(this,this.onTitleFocus)));
			this.own(dOn(this.titleNode, "blur", dLang.hitch(this,this.onTitleBlur)));
		},
		
		/**
		 *
		 */
		onTitleBarClick: function(e) {
			this.wizard._onTitleBarClick(this, e);
		},
		
		/**
		 *
		 */
		onTitleBarMouseOver: function(e) {
			this.wizard._onTitleBarMouseOver(this, e);
		},

		/**
		 *
		 */
		onTitleBarMouseOut: function(e) {
			this.wizard._onTitleBarMouseOut(this, e);
		},		

		/**
		 *
		 */
		onTitleFocus: function(e) {
			this.wizard._onTitleFocus(this, e);
		},
		
		/**
		 *
		 */
		onTitleBlur: function(e) {
			this.wizard._onTitleBlur(this, e);
		},
		
		/**
		 *
		 */
		onStepTabFocus: function(substep, e) {
			this.wizard._onStepTabFocus(this, substep, e);
		},
		
		/**
		 *
		 */
		onStepTabBlur: function(substep, e) {
			this.wizard._onStepTabBlur(this, substep, e);
		},
		
		/**
		 *
		 */
		onStepTabClick: function(step, e) {
			if (this.wizard.isVisitedClickable && step && step.get("visited") && (!step.get("disabled"))) {
				this.wizard._activateAnimation();
				this.wizard._select(step);
				this.wizard._deactivateAnimation();
			}
		},
		
		/**
		 *
		 */
		onStepTabMouseOver: function(step) {
			var stepTab = null;
			var stepMarker = null;
			var visitedMarker = null;
			if (this.wizard.isVisitedClickable && step && step.get("visited") && (!step.get("disabled"))) {
				stepTab = this._stepTabs[step.id];
				stepMarker = this._stepMarkers[step.id];
				visitedMarker = this._visitedMarkers[step.id];
				if (stepTab) dDomStyle.set(stepTab, "cursor", "pointer");
				if (stepMarker) dDomStyle.set(stepMarker, "cursor", "pointer");
				if (visitedMarker) dDomStyle.set(visitedMarker, "cursor", "pointer");
			}		
		},
		
		/**
		 *
		 */
		onStepTabMouseOut: function(step) {
			var stepTab = null;
			if (step) {
				stepTab = this._stepTabs[step.id];
				stepMarker = this._stepMarkers[step.id];
				visitedMarker = this._visitedMarkers[step.id];
				if (stepTab) dDomStyle.set(stepTab, "cursor", "default");
				if (stepMarker) dDomStyle.set(stepMarker, "cursor", "default");
				if (visitedMarker) dDomStyle.set(visitedMarker, "cursor", "default");
			}		
		},
		
		/**
		 *
		 */
		_attachToStepNode: function(step, stepNode) {
			var stepHandles = this._stepHandles[step.id];
			if (!stepHandles) {
				stepHandles = this._stepHandles[step.id] = [];
			}
			stepHandles.push(dOn(stepNode, "click", dLang.hitch(this, this.onStepTabClick, step)));
			stepHandles.push(dOn(stepNode, "mouseover", dLang.hitch(this, this.onStepTabMouseOver, step)));
			stepHandles.push(dOn(stepNode, "mouseout", dLang.hitch(this, this.onStepTabMouseOut, step)));	
			stepHandles.push(dOn(stepNode, "focus", dLang.hitch(this, this.onStepTabFocus, step)));
			stepHandles.push(dOn(stepNode, "blur", dLang.hitch(this, this.onStepTabBlur, step)));
		},
		
		/**
		 *
		 */
		updateViewport: function(width, height, pane) {	
			if (!pane) pane = this.wizard.getSelected();
			if (!pane) return;
			var dim = ((width === undefined)||(height === undefined)) ? dDomGeometry.getMarginBox(this.contentNode) : null;
			if (width === undefined) width = dim.w;
			if (height === undefined) height = dim.h;
			
			dDomStyle.set(this.domNode, {height: height + "px"});
			if (! this._paneHandlesLookup[pane.id]) {
				dDomStyle.set(this.contentNode, {visibility: "hidden", height: height + "px", width: width + "px"});
				dDomClass.remove(this.domNode, this.baseClass + "Current");
			} else {
				dDomStyle.set(this.contentNode, {visibility: "visible", height: height + "px", width: width + "px"});			
				dDomClass.add(this.domNode, this.baseClass + "Current");
			}

			dDomStyle.set(this.contentNode, {width: width + "px", height: height + "px" });
			var titleHeight = 0, substepListHeight = 0, containerHeight = 0;
			dDomStyle.set(this.contentTitleNode, "width", width + "px");
			titleHeight = dDomGeometry.getMarginBox(this.contentTitleNode).h;
			dDomStyle.set(this.substepListNode, {top: titleHeight + "px", "width": width + "px"});
			var substepCount = 0;
			var index = 0;
			var step = null;
			for (index = 0; index < this._substeps.length; index++) {
				step = this._substeps[index];
				if (step.get("hidden")) continue;
				substepCount++;
			}
			dDomClass.toggle(this.domNode, this.baseClass + "HasSubsteps", (substepCount>0));
			
			if (substepCount > 0) {
				substepListHeight = dDomGeometry.getMarginBox(this.substepListNode).h;
			}
			containerHeight = height - titleHeight - substepListHeight;
			
			dDomStyle.set(this.containerNode, 
						  {top: (titleHeight + substepListHeight) + "px",
						   width: width + "px",
						   height: containerHeight + "px"});
			
			var steps = [];
			if (!this.wizardPane.get("headingOnly")) {
				steps.push(this.wizardPane);
			}
			steps = steps.concat(this._substeps);
			var selectedIndex = -1;
			for (index = 0; index < steps.length; index++) {
				if (steps[index] === pane) {
					selectedIndex = index;
					break;
				}
			}
			if (selectedIndex < 0) {
				for (index = 0; index < steps.length; index++) {
					if (steps[index] === this._lastSelectedPane) {
						selectedIndex = index;
						break;
					}
				}
			} else {
				this._lastSelectedPane = pane;
			}
			if (selectedIndex < 0) selectedIndex = this._lastSelectedIndex;
			else this._lastSelectedIndex = selectedIndex;
			
			var ltr = this.isLeftToRight();
			var leadingSide = (ltr ? "left" : "right");
			var trailingSide = (ltr ? "right": "left");
			var leadingX = 0;
			var stepLabel = null;
			var padExtents = null, marginExtents = null, borderExtents = null;
			var style = { width: width + "px", height: containerHeight + "px", display: "block" };
			style[trailingSide] = "auto";
			var stepID = null;
			var stepTab = null;
			var stepMarker = null;
			var visitedMarker = null;
			var marginX = 0;
			var stepMarkerX = {};
			var stepHandles = null;
			var stepDim = null;
			var refNode = this.substepListNode;
			var position = "first";
			for (stepID in this._stepTabs) {
				step = dRegistry.byId(stepID);
				if (this._paneHandlesLookup[stepID] && (!step.get("hidden"))) continue;
				stepTab = this._stepTabs[stepID];
				dDomConstruct.destroy(stepTab);
				this._stepTabs[stepID] = null;
				stepHandles = this._stepHandles[stepID];
				if (stepHandles) dArray.forEach(stepHandles, dLang.hitch(this, function(handle) {
					handle.remove();
				}));
				this._stepHandles[stepID] = null;
				stepMarker = this._stepMarkers[stepID];
				if(stepMarker) dDomConstruct.destroy(stepMarker);
				this._stepMarkers[stepID] = null;
				visitedMarker = this._visitedMarkers[stepID];
				if (visitedMarker) dDomConstruct.destroy(visitedMarker);
				this._visitedMarkers[stepID] = null;
			}
			for (index = 0; index < steps.length; index++) {
				step = steps[index];
				if (step == this.wizardPane) continue;
				if (step.get("hidden")) continue;
				stepLabel = step.get("label");
				stepTab = this._stepTabs[step.id];
				if (!stepTab) {
					stepTab = dDomConstruct.create("div", {"class": this.baseClass + "StepTab"}, refNode, position);
					this._stepTabs[step.id] = stepTab;
					this._attachToStepNode(step, stepTab);					
					stepTab.innerHTML = stepLabel;			
				} else {
					dDomConstruct.place(stepTab, refNode, position);
				}
				refNode = stepTab;
				position = "after";
			}
			for (index = (selectedIndex<0?0:selectedIndex); index < steps.length; index++) {
				step = steps[index];
				if (step.get("disabled")) {
					dDomStyle.set(step.domNode, {visibility: "hidden", display: "none"});
					continue;
				}
				style[leadingSide] = leadingX + "px";				
				stepMarkerX[step.id] = leadingX;
				leadingX += width;
				dDomStyle.set(step.domNode, style);
				if (step === pane) dDomStyle.set(step.domNode, {visibility: "visible", display: "block"});
				else dDomStyle.set(step.domNode, {visibility: "hidden", display: "block"});
			}
			leadingX = 0;
			style.visibility = "hidden";
			for (index = selectedIndex -1; index >= 0; index--) {
				step = steps[index];
				if (step.get("disabled")) {
					dDomStyle.set(step.domNode, {visibility: "hidden", display: "none"});
					continue;
				}
				leadingX -= width;
				style[leadingSide] = leadingX + "px";
				stepMarkerX[step.id] = leadingX;
				dDomStyle.set(step.domNode, style);				
			}
			style = {};
			leadingX = 0;
			for (index = 0; index < steps.length; index++) {
				step = steps[index];
				stepTab = this._stepTabs[step.id];
				if (!stepTab) continue;
				stepMarker = this._stepMarkers[step.id];
				if (!stepMarker) {
					stepMarker = dDomConstruct.create(
					    "div", {"class": this.baseClass + "StepMarker", "role": "presentation"},
						this.substepListNode, "last");
					this._stepMarkers[step.id] = stepMarker;
					this._attachToStepNode(step, stepMarker);
				}
				leadingX = stepMarkerX[step.id];
				stepDim = dDomGeometry.getMarginBox(stepTab);
				style[leadingSide] = (ltr) ? (leadingX+stepDim.l) + "px"
										: (leadingX+(dDomGeometry.getMarginBox(this.substepListNode).w-(stepDim.l+stepDim.w))) + "px";
				style.width = dDomGeometry.getContentBox(stepTab).w + "px";
				dDomStyle.set(stepMarker, style);
				
				this._updateStepVisitedMarker(step);
				dDomClass.toggle(stepTab, this.baseClass + "CurrentStep", (step === pane));
			}
		},
		
		/**
		 *
		 */
		updateSubsteps: function() {
			var index = 0;
			var mainIndex = -1;
			var lastSubstepIndex = -1;
			for (index = 0; index < this.wizard._wizardPanes.length; index++) {
				if (this.wizard._wizardPanes[index] === this.wizardPane) {
					mainIndex = index;
					break;
				}
			}
			if (mainIndex < 0) {
				throw "Failed to find wizard pane in parent wizard.  wizardPane=[ " 
					  + this.wizardPane.get("title") + " / " + this.wizardPane.get("id");
			}
			for (index = mainIndex+1; index < this.wizard._wizardPanes.length; index++) {
				if (this.wizard._wizardPanes[index].get("substep")) {
					lastSubstepIndex = index;
				} else {
					break;
				}
			}
			
			// check if the substeps are unchanged
			var substep = null;
			var handles = {};
			var substeps = [];
			var refNode = this.wizardPane.domNode;
			handles[this.wizardPane.id] = this._paneHandlesLookup[this.wizardPane.id];
			for (index = mainIndex+1; index <= lastSubstepIndex; index++) {
				substep = this.wizard._wizardPanes[index];
				substep.placeAt(refNode, "after");
				refNode = substep.domNode;
				if (this._paneHandlesLookup[substep.id]) {
					handles[substep.id] = this._paneHandlesLookup[substep.id];
				} else {
					handles[substep.id] = null;
				}
				substeps.push(substep);
			}
			// we need to orphan any substeps that are no longer substeps of this instance
			for (index = 0; index < this._substeps.length; index++) {
				substep = this._substeps[index];
				if (! (substep.id in handles)) {
					if (substep.domNode.parentNode === this.containerNode) {
						this.containerNode.removeChild(substep.domNode);
					}
					dArray.forEach(this._paneHandlesLookup[substep.id], dLang.hitch(this, function(handle) {
						handle.remove();
					}));
					this._paneHandlesLookup[substep.id] = null;
				}
			}
			this._substeps = substeps;
			this._paneHandlesLookup = handles;
			for (index = 0; index < this._substeps.length; index++) {
				substep = this._substeps[index];
				if (!this._paneHandlesLookup[substep.id]) {
					this._paneHandlesLookup[substep.id] = [];
					this._attachWatchers(substep);
				}
			}
			this._updateVisited(this.wizardPane);
		}
	});
	
	/**
	 * @name idx.layout.TOCWizard
	 * @class Provides a widget that is used to display a table of contents wizard.
	 */
	return declare("idx.layout.AccordionWizard", [iWizard], {
		baseClass: "idxAccordionWizard",
		templateString: templateText,
		widgetsInTemplate: true,
				
		/**
		 * Boolean indicating if the table of contents visited nodes are clickable.  Default is false.
		 */
		isVisitedClickable: false,

		/**
		 * The maximum number of steps to show at either side of the accordion.  If 
		 * more than this number is present as previous or next steps then they are 
		 * collapsed under a psuedo-step title indicating that there are X more.
		 * The minimum value for this attribute is 1.
		 */
		maxVisibleSteps: 3,
		
		/**
		 *
		 */
		_setMaxVisibleStepsAttr: function(value) {
			if (this.maxVisibleSteps == value) return;
			if (value < 1) throw "Cannot set AccordionWizard.maxVisibleSteps less than 1";
			this.maxVisibleSteps = value;
			if (this._started) {
				this._updateAccordion();
			}
		},
		
		/**
		 * Constructs the AccordionWizard.
		 */
		constructor: function(args, node) {
			this._viewportLookup   = {};
			this._viewports 	   = [];
			this._wizardPanes 	   = [];
			this._selectedViewport = null;
			this._selectedPane     = null;
		},
	
		/**
		 * Destroy.
		 */
		destroy: function() {
			// make sure to destroy all child widgets -- not just under container node
			var childWidgets = dRegistry.findWidgets(this.domNode);
			if (childWidgets) {
				dArray.forEach(childWidgets, function(child) {
					child.destroyRecursive();
				});
			}
			this.inherited(arguments);
		},

		/**
		 * Handles resizing the accordion wizard.
		 */
		resize: function() {
			this.inherited(arguments);
			if (this._started && this._updateDimensions) {
				if (this._updateTimeout) clearTimeout(this._updateTimeout);
				this._updateTimeout = setTimeout(dLang.hitch(this, function() {
					var dim = dDomGeometry.getMarginBox(this.domNode);
					if ((dim.w != this._updateDimensions.w) || (dim.h != this._updateDimensions.h)) {
						this._updateAccordion();
					}
					this._updateTimeout = setTimeout(dLang.hitch(this, function() {
						this._updateAccordion();
						this._updateTimeout = null;
					}),100);
					
				}), 300);
				
			}
		},
		
		/**
		 *
		 */
		postCreate: function() {
			this.focusNode = this.domNode;
			this.inherited(arguments);
			this.own(dOn(this.domNode, "focus", dLang.hitch(this, this._onDomNodeFocus)));
			this.own(dOn(this._leadingOverflowNode, "mouseover", dLang.hitch(this, this._onLeadingOverflowMouseOver)));
			this.own(dOn(this._trailingOverflowNode, "mouseover", dLang.hitch(this, this._onTrailingOverflowMouseOver)));
			this.own(dOn(this._leadingOverflowNode, "mouseout", dLang.hitch(this, this._onLeadingOverflowMouseOut)));
			this.own(dOn(this._trailingOverflowNode, "mouseout", dLang.hitch(this, this._onTrailingOverflowMouseOut)));
			this.own(dOn(this.domNode, "keydown", dLang.hitch(this, this._onKeyDown)));
			this.own(dOn(this.domNode, "keyup", dLang.hitch(this, this._onKeyUp)));
			this.own(dOn(this.domNode, "scroll", dLang.hitch(this,this.onDomNodeScroll)));
			
			var labelTextNode = document.createTextNode(this._resources.a11yLabel);
			dDomConstruct.place(labelTextNode, this._a11yLabelNode, "only");
		},

		/**
		 *
		 */
		_onDomNodeScroll: function() {
			console.log("DOM NODE SCROLLED!!!!");
		},
		
		/**
		 *
		 */
		_onDomNodeFocus: function() {
			this._a11yAnnounce(this._resources.accordionAnnouncement);
			this._a11yAnnounceCurrent(true);
		},
		
		/**
		 *
		 */
		_a11yAnnounce: function(message, append, params) {
			if (params) {
				message = dString.substitute(message, params);
			}
			var messageNode = document.createTextNode(message);
			dDomConstruct.place(messageNode, this._announceNode, (append?"last":"only"));
		},
		
		/**
		 *
		 */
		_setVisitedClickableAttr: function(value) {
			this.isVisitedClickable = value;
			dDomClass.toggle(this.domNode, this.baseClass + "VisitedClicable", this.isVisitedClickable);
		},
		
		/**
		 * Return the wizard panes.
		 * 
		 * @return An array of {@link idx.layout.WizardPane}.
		 */
		getChildren: function() {
			return this._wizardPanes.concat([]);
		},

		/**
		 * Add the wizard pane.
		 * 
		 * @param pane
		 * 		An instance of {@link idx.layout.WizardPane}.
		 */
		addChild: function(pane, index) {
			var elems = null;
			if (!pane.focusNode)  {
				elems = dA11y._getTabNavigable(pane.containerNode);
				if (elems.lowest||elems.first) pane.focusNode = (elems.lowest||elems.first);
			}
			
			// check if the wizard pane is already a child
			dArray.forEach(this._wizardPanes, dLang.hitch(this, function(child) {
				if (child === pane) {
					throw "The specified pane is already a child: " + pane.id;
				}
			}));
			
			// determine if the pane is a substep
			var substep = pane.get("substep");
			
			// resolve the index and verify the pane
			if (index !== undefined && index !== null) {
				// normalize the index
				if (index < 0) index = 0;
				if (index >= this._wizardPanes.length) index = this._wizardPanes.length;
			
				// check for "substep-first"
				if (substep && index == 0) {
					throw "Cannot add a substep as the first step: " + pane.id;
				}
				
				// check for "main step between substeps"
				if ((!substep) && (index > 0) && (index < children.length)) {
					if (children[index-1].get("substep") && children[index].get("substep")) {
						throw "Cannot add a main step between substeps: " + pane.id;
					}
				}
			}
			
			// add the wizard pane
			if (index === undefined || index === null || index == this._wizardPanes.length) {
				this._wizardPanes.push(pane);
				index = this._wizardPanes.length - 1;
			} else {
				this._wizardPanes.splice(index, 0, pane);
			}
			
			// get the preceding view port
			var prevViewport = null;
			var prevViewportIndex = -1;
			if (index < 0) {
				prevViewport = this._viewportLookup[this._wizardPanes[index-1].id];
				for (prevViewportIndex = 0; prevViewportIndex < this._viewports.length; prevViewportIndex++) {
					if (this._viewports[prevViewportIndex] === prevViewport) break;
				}
			}
			
			// determine the viewport for the wizard pane
			var viewport  = null;
			var mainPane  = (substep) ? null : pane;
			var mainIndex = (substep) ? -1 : index;
			var viewportIndex = -1;
			
			// If adding a sub-step, then set the parent on this pane.
			var child = null;
			var index = 0;
			if (substep) {
				for ( index = 0; index < this._wizardPanes.length; index++) {
					child = this._wizardPanes[index];
					if (!child.get("substep")) {
						mainPane = child;
						mainIndex = index;
						continue;
					}
					if (child === pane) {
						pane.set("parent", mainPane);
						break;
					}
				}
			}
			
			var position = null;
			var refNode  = null;
			if (mainPane === pane) {
				// we have a primay step.... create the viewport
				viewport = new Viewport({wizard: this, wizardPane: pane});
				
				// setup the lookup
				this._viewportLookup[pane.id] = viewport;
				
				if ((!prevViewport)||(prevViewportIndex<0)||(prevViewportIndex==this._viewports.length)) {
					this._viewports.push(viewport);
					viewportIndex = this._viewports.length-1;
				} else {
					viewportIndex = prevViewportIndex+1;
					this._viewports.splice(viewportIndex, 0, viewport);
				}
				
				// add the accordion pane to the interface
				position = (viewportIndex == 0) ? "first" : (index == this._viewports.length-1) ? "last" : "after";
				refNode  = (viewportIndex == 0 || index == this._viewports.length-1) 
						   ? this._accordionNode : this._viewports[viewportIndex-1].domNode;
				viewport.placeAt(refNode, position);
				viewport.startup();
				
			} else {
				// we have a substep, the viewport already exists
				viewport = this._viewportLookup[mainPane.id];
				this._viewportLookup[pane.id] = viewport;
				viewport.updateSubsteps();
			}
			this._addListeners(pane);
			if (this._started) this._updateAccordion();
			this.onAdd();
		},

		/**
		 * Returns the index of the main (non-substep) frame being shown.
		 */
		_getSelectedIndex: function() {
			var selectedViewport = this._getSelectedViewport();
			if (!selectedViewport) return -1;
			var index = 0;
			var found = false;
			for (index = 0; index < this._viewports.length; index++) {
				if (this._viewports[index] === selectedViewport) {
					found = true;
					break;
				}
			}
			if (found) return index;
			return -1;
		},

		/**
		 *
		 */
		_getVisibleViewports: function() {
			var visibleViewports = [];
			dArray.forEach(this._viewports, dLang.hitch(this, function(viewport) {
				if (!viewport.isHidden()) {
					visibleViewports.push(viewport);
				}
			}));
			return visibleViewports;	
		},

		/**
		 *
		 */
		_getVisibleViewportCount: function() {
			var count = 0, index = 0, viewport = null;
			for (index = 0; index < this._viewports.length; index++) {
				viewport = this._viewports[index];
				if (!viewport.isHidden()) {
					count++;
				}
			}
			return count;
		},
		
		/**
		 *
		 */
		_focusElement: function(node, delayed) {
			if (this._focusNode === node) return;
			delayed = (delayed || this._focusTimeout) ? true : false;
			if (this._focusTimeout) {
				clearTimeout(this._focusTimeout);
				this._focusTimeout = null;
				this._focusNode = null;
			}
			
			if (delayed) {
				this._focusNode = node;
				this._focusTimeout = setTimeout(dLang.hitch(this, function() {
					dFocusManager.focus(node);
					this._focusTimeout = null;
					this._focusNode = null;
				}), 1000);
				
			} else {
				dFocusManager.focus(node);
			}
		},
		
		/**
		 * Returns the index of the main (non-substep) frame being shown but
		 * only considering visible viewports.
		 */
		_getVisibleViewportIndex: function() {
			var selectedViewport = this._getSelectedViewport();
			if (!selectedViewport) return -1;
			var index = 0;
			var visibleIndex = -1;
			var found = false;
			for (index = 0; index < this._viewports.length; index++) {
				if (this._viewports[index].isHidden()) continue;
				visibleIndex++;
				if (this._viewports[index] === selectedViewport) {
					found = true;
					break;
				}
			}
			if (found) return visibleIndex;
			return -1;
		},
		
		/**
		 *
		 */
		_onKeyDown: function(e) {
			var c = e.keyCode, visibleViewports = null, visibleViewportIndex = 0, 
				visibleSubsteps = null, visibleSubstepIndex = -1;
			var ltr = this.isLeftToRight();
			var viewport = null, visibleViewport = null, visibleSubstep = null,
				wizardPane = null, index = 0, viewportIndex = 0, substepIndex = -1;
				
			if (e.altKey && (c == dKeys.F12)) {
				if (this._leadReview) {
					this._a11yAnnounce(this._resources.leadingReviewHelp);
				} else if (this._trailReview) {
					this._a11yAnnounce(this._resources.trailingReviewHelp);
				} else {
					this._a11yAnnounce(this._resources.accordionHelp);
				}
				
			} else if (e.altKey && (c == dKeys.SPACE || c == dKeys.ENTER)) {
				this._a11yAnnounceCurrent();
				
			} else if (e.altKey && (c == dKeys.END)) {
				this._refocus = false;
				this._buttonBar.focus();
				
			} else if (e.altKey && c == dKeys.PAGE_UP) {
				if (this._trailReview) {
					this._cancelReviewTrailing();
				}
				if (this._trailPeeking) {
					this._cancelPeekTrailing();
				}
				if (this._leadReview) {
					this._cancelReviewLeading();
					if (this._leadPeeking) this._cancelPeekLeading();
				} else {
					this._reviewLeading();
				}
				
			} else if (e.altKey && c == dKeys.PAGE_DOWN) {
				if (this._leadReview) {
					this._cancelReviewLeading();
				}
				if (this._leadPeeking) {
					this._cancelPeekLeading();
				}
				if (this._trailReview) {
					this._cancelReviewTrailing();
					if (this._trailPeeking) this._cancelPeekTrailing();
				} else {
					this._reviewTrailing();
				}
				
			} else if (c == dKeys.ESCAPE && (this._leadReview||this._trailReview)) {
				if (this._leadReview) {
					this._cancelReviewLeading();
					
				} else if (this._trailReview) {
					this._cancelReviewTrailing();
				}
				if (this._leadPeeking) {
					this._cancelPeekLeading();
				
				} else if (this._trailPeeking) {
					this._cancelPeekTrailing();
				}
				
			} else if (e.altKey &&(c == dKeys.UP_ARROW||(ltr && c == dKeys.LEFT_ARROW)||(!ltr && c == dKeys.RIGHT_ARROW))) {
				if (this._previousButton.get("disabled")) {
					this._a11yAnnounce(this._resources.previousOnFirstError);
					
				} else {
					this._onPrevious();
				}
				
			} else if (e.altKey&&(c == dKeys.DOWN_ARROW||(ltr && c == dKeys.RIGHT_ARROW)||(!ltr && c == dKeys.LEFT_ARROW))) {
				if (this._nextButton.get("disabled")) {
					if (this.getSelected().get("valid")) {
						this._a11yAnnounce(this._resources.nextOnLastError);
					} else {
						this._a11yAnnounce(this._resources.nextOnInvalidError);
					}
				} else {
					this._onNext();
				}
				
			} else if (this.isVisitedClickable
					   &&((this._focusedLeader&&e.target===this._focusedLeader.target)
						  ||(this._focusedTrailer&&e.target===this._focusedTrailer.target))
					   &&(c == dKeys.ENTER || c == dKeys.SPACE)) {
				viewport = null;
				if (this._leadReview && this._focusedLeader) {
					viewport = this._focusedLeader.viewport;
				} else if (this._trailReview && this._focusedTrailer) {
					viewport = this._focusedTrailer.viewport;
				}
				wizardPane = viewport.getFirstWizardPane();
				if (wizardPane && wizardPane.get("visited")) {
					if (this._leadReview) this._cancelReviewLeading();
					if (this._trailReview) this._cancelReviewTrailing();
					this._activateAnimation();
					this._select(wizardPane);
					this._deactivateAnimation();
				} else {
					return;
				}
			} else if ((c==dKeys.LEFT_ARROW||c==dKeys.RIGHT_ARROW||c==dKeys.UP_ARROW||c==dKeys.DOWN_ARROW)
					   &&((this._focusedLeader&&e.target===this._focusedLeader.target)
					      ||(this._focusedTrailer&&e.target===this._focusedTrailer.target))) {
						  
				visibleViewports = this._getVisibleViewports();
				visibleViewportIndex = this._getVisibleViewportIndex();
				visibleViewport = visibleViewports[visibleViewportIndex];
				visibleSubstepIndex = visibleViewport.getVisibleSubstepIndex();
				visibleSubsteps = visibleViewport.getVisibleSubsteps();
				
				if (this._focusedLeader&&e.target===this._focusedLeader.target) {
					for (index = 0; index < visibleViewports.length; index++) {
						if (visibleViewports[index] === this._focusedLeader.viewport) {
							viewportIndex = index;
							break;
						}
					}
					if (viewportIndex == visibleViewportIndex && this._focusedLeader.step !== visibleViewport.get("wizardPane")) {
						for (index = 0; index < visibleSubsteps.length; index++) {
							if (visibleSubsteps[index] === this._focusedLeader.step) {
								substepIndex = index;
								break;
							}
						}
					}
					
					if ((ltr&&c==dKeys.RIGHT_ARROW)||(!ltr&&c==dKeys.LEFT_ARROW)||(c==dKeys.DOWN_ARROW)) {
					
						if (viewportIndex < visibleViewportIndex) {
							// we are focusing on a viewport title prior to current, focus on the next one
							this._focusElement(visibleViewports[viewportIndex+1].titleNode);
							
						} else if (viewportIndex == visibleViewportIndex && (substepIndex < visibleSubstepIndex)) {
							// we are focusing on current viewport title and we have substeps on current viewport
							this._focusElement(visibleViewport._stepTabs[visibleSubsteps[substepIndex+1].id]);
							
						} else {
							// we are focusing on the last element, so loop back to first
							this._focusElement(visibleViewports[0].titleNode);
						}
						
					} else if ((ltr&&c==dKeys.LEFT_ARROW)||(!ltr&&c==dKeys.RIGHT_ARROW)||(c==dKeys.UP_ARROW)) {
					
						if (substepIndex > 0) {
							// we are focusing on a substep and we have more substeps preceding this one
							this._focusElement(visibleViewport._stepTabs[visibleSubsteps[substepIndex-1].id]);
							
						} else if (substepIndex == 0) {
							// we are on the first substep, focus the viewport title
							this._focusElement(visibleViewports[viewportIndex].titleNode);
							
						} else if (viewportIndex > 0) {
							// we are focusing on a viewport title and we have more preceding this one
							this._focusElement(visibleViewports[viewportIndex-1].titleNode);
							
						} else if (visibleSubstepIndex >= 0) {
							// we are focusing on the first element and we have substeps on the current viewport
							// so loop back to the current substep
							this._focusElement(visibleViewport._stepTabs[visibleSubsteps[visibleSubstepIndex].id]);
							
						} else {
							// we are focusing on the first element and we have no substeps so loop back to first
							// viewport title
							this._focusElement(visibleViewports[visibleViewportIndex].titleNode);
						}
					}
				} else if (this._focusedTrailer&&e.target===this._focusedTrailer.target) {
					for (index = 0; index < visibleViewports.length; index++) {
						if (visibleViewports[index] === this._focusedTrailer.viewport) {
							viewportIndex = index;
							break;
						}
					}
					if (viewportIndex == visibleViewportIndex && this._focusedTrailer.step !== visibleViewport.get("wizardPane")) {
						for (index = 0; index < visibleSubsteps.length; index++) {
							if (visibleSubsteps[index] === this._focusedTrailer.step) {
								substepIndex = index;
								break;
							}
						}
					}
					if ((ltr&&c==dKeys.RIGHT_ARROW)||(!ltr&&c==dKeys.LEFT_ARROW)||(c==dKeys.DOWN_ARROW)) {
						if ((substepIndex >= 0)&&(substepIndex<visibleSubsteps.length-1)) {
							// we are focusing a substep and its not the last
							this._focusElement(visibleViewport._stepTabs[visibleSubsteps[substepIndex+1].id]);
							
						} else if (viewportIndex < visibleViewports.length-1) {
							// we are focusing a viewport title or the last substep
							this._focusElement(visibleViewports[viewportIndex+1].titleNode);
							
						} else if (visibleSubstepIndex < visibleSubsteps.length-1) {
							// we are focusing the last element and there are substeps to loop back to
							this._focusElement(visibleViewport._stepTabs[visibleSubsteps[visibleSubstepIndex+1].id]);
							
						} else {
							// we are focusing the last element and there are no substeps
							this._focusElement(visibleViewports[visibleViewportIndex+1].titleNode);
							
						}
						
					} else if ((ltr&&c==dKeys.LEFT_ARROW)||(!ltr&&c==dKeys.RIGHT_ARROW)||(c==dKeys.UP_ARROW)) {
						if (viewportIndex > (visibleViewportIndex+1)) {
							// we are focusing a trailing viewport title with more preceding
							this._focusElement(visibleViewports[viewportIndex-1].titleNode);
							
						} else if (viewportIndex == (visibleViewportIndex+1) && (visibleSubstepIndex < visibleSubsteps.length-1)) {
							// we are focused on the last viewport title before the substeps of current viewport
							this._focusElement(visibleViewport._stepTabs[visibleSubsteps[visibleSubsteps.length-1].id]);
							
						} else if ((viewportIndex == visibleViewportIndex) && (substepIndex > 0) && (substepIndex > (visibleSubstepIndex+1))) {
							// we are focused on a substep in current viewurt
							this._focusElement(visibleViewport._stepTabs[visibleSubsteps[substepIndex-1].id]);
							
						} else if (visibleViewportIndex == visibleViewports.length-1 && (visibleSubstepIndex < visibleSubsteps.length-1) && (visibleSubsteps.length > 0)) {
							// we are on the first substep, so loop back to the last (only when viewing last viewport)
							this._focusElement(visibleViewport._stepTabs[visibleSubsteps[visibleSubsteps.length-1].id]);
							
						} else {
							// we are focused on the first element, we need to loop around to the last viewport title
							this._focusElement(visibleViewports[visibleViewports.length-1].titleNode);
						}
					}				
				} else {
					return;
				}
				
			} else {
				return;
			}			
			e.stopPropagation();
			e.preventDefault();
		},
		
		/**
		 *
		 */
		_onKeyUp: function(e) {
			return;
			var c = e.keyCode;
			var ltr = this.isLeftToRight();
			if (this._leadPeeking && (c == dKeys.PAGE_UP || !e.altKey)) {
				this._cancelPeekLeading();
				
			} else if (this._trailPeeking && (c == dKeys.PAGE_DOWN || !e.altKey)) {
				this._cancelPeekTrailing();
				
			} else {
				return;
			}			
			e.stopPropagation();
			e.preventDefault();
		},
		
		/**
		 *
		 */
		_onLeadingOverflowMouseOver: function() {
			this._peekLeading();
		},
		
		/** 
		 *
		 */
		_onLeadingOverflowMouseOut: function() {
			this._schedulePeekLeadingCancel();
		},
		
		/**
		 *
		 */
		_activateAnimation: function() {
			if (this.removeAnimateTimeout) clearTimeout(this.removeAnimateTimeout);
			var selectedViewport = this._getSelectedViewport();
			if (this._started) {
				dDomClass.add(this._accordionNode, this.baseClass + "Animating");
				if (selectedViewport) dDomClass.add(selectedViewport.domNode, selectedViewport.baseClass + "Animating");
			}		
		},
		
		/**
		 *
		 */
		_deactivateAnimation: function() {
			this.removeAnimateTimeout = setTimeout(dLang.hitch(this, function() {
				dDomClass.remove(this._accordionNode, this.baseClass + "Animating");
				dArray.forEach(this._viewports, dLang.hitch(this, function(viewport) {
					dDomClass.remove(viewport.domNode, viewport.baseClass + "Animating");
				}));
				this.removeAnimateTimeout = null;
			}), 1000);		
		},
		
		/**
		 *
		 */
		_reviewLeading: function() {
			if (this._leadReview) return;
			if (this._leadingOverflow) this._peekLeading();
			this._leadReview = true;
			var visibleViewports = this._getVisibleViewports();
			var viewportIndex = this._getVisibleViewportIndex();
			var viewport = visibleViewports[viewportIndex];
			var visibleSubsteps = viewport.getVisibleSubsteps();
			var substepIndex = viewport.getVisibleSubstepIndex();
			var index = 0;
			var stepTab = null;
			var substep = null;
			if (visibleSubsteps.length > 0) {
				for (index = 0; index <= substepIndex; index++) {
					substep = visibleSubsteps[index];
					stepTab = viewport._stepTabs[substep.id];
					dDomAttr.set(stepTab, "tabindex", "0");
				}
			}
			for (index = 0; index <= viewportIndex; index++) {
				dDomAttr.set(visibleViewports[index].titleNode, "tabindex", "0");
			}
			if ((visibleSubsteps.length>0)&&(substepIndex>=0)) {
				this._a11yAnnounce(this._resources.leadingReviewModeWithSubstepsAnnouncement, false,
								   {count: (substepIndex+1), mainCount: (viewportIndex+1)});
				substep = visibleSubsteps[substepIndex];
				stepTab = viewport._stepTabs[substep.id];
				this._focusElement(stepTab);
				
			} else {
				this._a11yAnnounce(this._resources.leadingReviewModeAnnouncement, false, {count:viewportIndex+1});
				this._focusElement(visibleViewports[viewportIndex].titleNode);
			}
			this._refocus = true;
		},
		
		/**
		 *
		 */
		_cancelReviewLeading: function() {
			if (!this._leadReview) return;
			this._leadReview = false;
			this._focusedLeader = null;
			var selectedIndex = this._getSelectedIndex();
			var viewport = this._viewports[selectedIndex];
			var visibleSubsteps = viewport.getVisibleSubsteps();
			var substepIndex = viewport.getVisibleSubstepIndex();
			for (index = 0; index <= substepIndex; index++) {
				dDomAttr.remove(viewport._stepTabs[visibleSubsteps[index].id], "tabindex");
			}
			for (index = 0; index <= selectedIndex; index++) {
				dDomAttr.remove(this._viewports[index].titleNode, "tabindex");
			}
			var selectedPane = this.getSelected();
			if (this._refocus) {
				this._focusElement(selectedPane.focusNode||this.domNode, this._leadPeeking);
				this._refocus = false;
			}		
		},

		/**
		 *
		 */
		_reviewTrailing: function() {
			if (this._trailReview) return;
			if (this._trailingOverflow) this._peekTrailing();
			var visibleViewports = this._getVisibleViewports();
			var viewportIndex = this._getVisibleViewportIndex();
			var viewport = visibleViewports[viewportIndex];
			var visibleSubsteps = viewport.getVisibleSubsteps();
			var substepIndex = viewport.getVisibleSubstepIndex();
			if ((viewportIndex == (visibleViewports.length-1))
				&& ((visibleSubsteps.length == 0)||(substepIndex == (visibleSubsteps.length-1)))) {
				this._a11yAnnounce(this._resources.trailingReviewOnLastError);
				return;
			}
			
			this._trailReview = true;
			var index = 0;
			var stepTab = null;
			if (visibleSubsteps.length > 0) {
				for (index = substepIndex+1; index < visibleSubsteps.length; index++) {
					stepTab = viewport._stepTabs[visibleSubsteps[index].id];
					dDomAttr.set(stepTab, "tabindex", "0");
				}
			}
			for (index = viewportIndex+1; index < visibleViewports.length; index++) {
				dDomAttr.set(visibleViewports[index].titleNode, "tabindex", "0");
			}
			if ((visibleSubsteps.length>0)&&(substepIndex<(visibleSubsteps.length-1))) {
				this._a11yAnnounce(this._resources.trailingReviewModeWithSubstepsAnnouncement, false,
								   {count: (visibleSubsteps.length-substepIndex-1),
									mainCount: (visibleViewports.length-viewportIndex-1)});
				this._focusElement(viewport._stepTabs[visibleSubsteps[substepIndex+1].id]);
								
			} else {
				this._a11yAnnounce(this._resources.trailingReviewModeAnnouncement, false, {count: (visibleViewports.length-viewportIndex-1)});
				this._focusElement(visibleViewports[viewportIndex+1].titleNode);				
			}
			this._refocus = true;
		},
		
		/**
		 *
		 */
		_cancelReviewTrailing: function() {
			if (!this._trailReview) return;
			this._trailReview = false;
			this._focusedTrailer = null;
			var selectedIndex = this._getSelectedIndex();
			var viewport = this._viewports[selectedIndex];
			var visibleSubsteps = viewport.getVisibleSubsteps();
			var substepIndex = viewport.getVisibleSubstepIndex();
			for (index = substepIndex+1; index < visibleSubsteps.length; index++) {
				dDomAttr.remove(viewport._stepTabs[visibleSubsteps[index].id], "tabindex");
			}
			for (index = selectedIndex+1; index < this._viewports.length; index++) {
				dDomAttr.remove(this._viewports[index].titleNode, "tabindex");
			}
			var selectedPane = this.getSelected();
			if (this._refocus) {
				this._focusElement(selectedPane.focusNode||this.domNode, this._trailPeeking);
				this._refocus = false;
			}		
		},
		
		/**
		 *
		 */
		_peekLeading: function() {
			if (this._cancelPeekLeadingTimer) {
				clearTimeout(this._cancelPeekLeadingTimer);
				this._cancelPeekLeadingTimer = null;
			}
			if (this._leadPeeking) return;
			if (!this._leadingOverflow) return;
			this._activateAnimation();
			this._leadPeeking = true;
			dDomClass.add(this.domNode, this.baseClass + "PeekLeading");
			
			var index = 0;
			var selectedPane = this.getSelected();
			var visibleViewports = this._getVisibleViewports();
			var selectedViewport = this._getSelectedViewport();
			var viewportCount = visibleViewports.length;
			var visibleIndex = this._getVisibleViewportIndex();
			if (visibleIndex < 0) return;
			var leadingX = dDomGeometry.getMarginBox(this._leadingOverflowNode).w;
			var viewport = null;
			var ltr = this.isLeftToRight();
			var leadingSide = (ltr ? "left" : "right");
			var trailingSide = (ltr ? "right": "left");
			var style = {};
			var dim = null;
			
			for (index = 0; index <= visibleIndex; index++) {
				// get the next viewport
				viewport = visibleViewports[index];
				
				style[leadingSide] = leadingX + "px";
				dim = dDomGeometry.getMarginBox(viewport.titleBarNode);
				leadingX += dim.w;
				dDomStyle.set(viewport.domNode, style);
			}
			
			this._deactivateAnimation();
		},
		
		/**
		 *
		 */
		_schedulePeekLeadingCancel: function() {
			this._cancelPeekLeadingTimer = setTimeout(dLang.hitch(this, this._cancelPeekLeading), 500);
		},

		/**
		 *
		 */
		_cancelPeekLeading: function() {
			if (this._leadReview) this._cancelReviewLeading();
			if (this._leadPeeking) {
				this._activateAnimation();
				this._leadPeeking = false;
				dDomClass.remove(this.domNode, this.baseClass + "PeekLeading");
				var index = 0;
				this._updateAccordion();
				this._deactivateAnimation();
				this._cancelPeekLeadingTimer = null;
			}
		},
		
		/**
		 *
		 */
		_onTrailingOverflowMouseOver: function() {
			this._peekTrailing();
		},
		
		/** 
		 *
		 */
		_onTrailingOverflowMouseOut: function() {
			this._schedulePeekTrailingCancel();
		},
		
		/**
		 *
		 */
		_peekTrailing: function() {
			if (this._cancelPeekTrailingTimer) {
				clearTimeout(this._cancelPeekTrailingTimer);
				this._cancelPeekTrailingTimer = null;
			}
			if (this._trailPeeking) return;
			if (!this._trailingOverflow) return;
			this._activateAnimation();
			this._trailPeeking = true;
			dDomClass.add(this.domNode, this.baseClass + "PeekTrailing");
			
			var index = 0;
			var selectedPane = this.getSelected();
			var selectedViewport = this._getSelectedViewport();
			var visibleViewports = this._getVisibleViewports();
			var viewportCount = visibleViewports.length;
			var visibleIndex = this._getVisibleViewportIndex();
			if (visibleIndex < 0) return;
			var trailingX = dDomGeometry.getMarginBox(this._accordionNode).w 
							- dDomGeometry.getMarginBox(this._trailingOverflowNode).w;
			var viewport = null;
			var ltr = this.isLeftToRight();
			var leadingSide = (ltr ? "left" : "right");
			var trailingSide = (ltr ? "right": "left");
			var style = {};
			var dim = null;
			
			for (index = visibleViewports.length-1; index > visibleIndex; index--) {
				// get the next viewport
				viewport = visibleViewports[index];
				dim = dDomGeometry.getMarginBox(viewport.titleBarNode);
				trailingX -= dim.w;
				style[leadingSide] = trailingX + "px";
				dDomStyle.set(viewport.domNode, style);
			}
			this._deactivateAnimation();
		},
		
		/**
		 *
		 */
		_schedulePeekTrailingCancel: function() {
			this._cancelPeekTrailingTimer = setTimeout(dLang.hitch(this, this._cancelPeekTrailing), 500);
		},
		
		/**
		 *
		 */
		_cancelPeekTrailing: function() {
			if (this._trailReview) this._cancelReviewTrailing();
			if (this._trailPeeking) {
				this._activateAnimation();
				this._trailPeeking = false;
				dDomClass.remove(this.domNode, this.baseClass + "PeekTrailing");
				var index = 0;
				this._updateAccordion();
				this._deactivateAnimation();
			}
		},
		
		/**
		 *
		 */
		_onTitleBarMouseOver: function(viewport, event) {
			var wizardPane = viewport.getFirstWizardPane();
			if (this.isVisitedClickable && wizardPane && wizardPane.get("visited")) {
				dDomStyle.set(viewport.titleBarNode, "cursor", "pointer");
			}
			var index = 0;
			var found = false;
			for (index = 0; index < this._viewports.length; index++) {
				if (viewport === this._viewports[index]) {
					found = true;
					break;
				}
			}
			if (!found) return;
			var selectedIndex = this._getSelectedIndex();
			if ((index <= selectedIndex) && (this._leadPeeking)) {
				this._peekLeading();
			}
			if ((index > selectedIndex) && (this._trailPeeking)) {
				this._peekTrailing();
			}
		},
		
		/** 
		 *
		 */
		_onTitleBarMouseOut: function(viewport, event) {
			dDomStyle.set(viewport.titleBarNode, "cursor", "default");
			var index = 0;
			var found = false;
			for (index = 0; index < this._viewports.length; index++) {
				if (viewport === this._viewports[index]) {
					found = true;
					break;
				}
			}
			if (!found) return;
			var selectedIndex = this._getSelectedIndex();
			if ((index <= selectedIndex) && (this._leadPeeking)) {
				this._schedulePeekLeadingCancel();
			}
			if ((index > selectedIndex) && (this._trailPeeking)) {
				this._schedulePeekTrailingCancel();
			}
		},
		
		/**
		 *
		 */
		_onStepTabFocus: function(viewport, substep, event) {
			var clickable = (this.isVisitedClickable && substep && substep.get("visited"));
			var index = 0;
			var found = false;
			var prevFocused = (this._focusedLeader||this._focusedTrailer);
			var visibleViewports = this._getVisibleViewports();
			for (index = 0; index < visibleViewports.length; index++) {
				if (viewport === visibleViewports[index]) {
					found = true;
					break;
				}
			}
			if (!found) return;
			var focusedViewportIndex = index;
			var visibleViewportIndex = this._getVisibleViewportIndex();
			
			// ensure the focus event is coming from the visible viewport
			if (focusedViewportIndex != visibleViewportIndex) return;
			var visibleSubsteps = viewport.getVisibleSubsteps();
			found = false;
			for (index = 0; index < visibleSubsteps.length; index++) {
				if (substep === visibleSubsteps[index]) {
					found = true;
					break;
				}
			}
			if (!found) return;
			var focusedSubstepIndex = index;
			var visibleSubstepIndex = viewport.getVisibleSubstepIndex();
			
			if ((focusedSubstepIndex <= visibleSubstepIndex) && (this._leadReview)) {
				this._focusedLeader = {viewport: viewport, step: substep, target: event.target};
				this._peekLeading();
			}
			if ((focusedSubstepIndex > visibleSubstepIndex) && (this._trailReview)) {
				this._focusedTrailer = {viewport: viewport, step: substep, target: event.target};
				this._peekTrailing();
			}
			if (this._leadReview || this._trailReview) {
				this._a11yAnnounce(this._resources.reviewSubstepAnnouncement, (prevFocused?false:true),
								   {index: (focusedSubstepIndex+1),
									count: visibleSubsteps.length,
									title: substep.get("label"),
									mainIndex: (focusedViewportIndex+1),
									mainCount: visibleViewports.length,
									mainTitle: viewport.get("wizardPane").get("label")});
				visited = substep.get("visited");
				if (visibleSubstepIndex == focusedSubstepIndex) {
					this._a11yAnnounce(this._resources.reviewSubstepCurrentAnnouncement, true);
				}
				if (visited) {
					this._a11yAnnounce(this._resources.reviewSubstepVisitedAnnouncement, true);
				} else {
					this._a11yAnnounce(this._resources.reviewSubstepUnvisitedAnnouncement, true);
				}
				if (substep.get("disabled")) {
					this._a11yAnnounce(this._resources.reviewSubstepDisabledAnnouncement, true);
				} else {
					if (this.isVisitedClickable && visited) {
						this._a11yAnnounce(this._resources.reviewSubstepClickAnnouncement, true);
					}
				}
			}		
		},
		
		/**
		 *
		 */
		_onStepTabBlur: function(viewport, substep, event) {
			var index = 0;
			var found = false;
			var visibleViewports = this._getVisibleViewports();
			
			for (index = 0; index < visibleViewports.length; index++) {
				if (viewport === visibleViewports[index]) {
					found = true;
					break;
				}
			}
			if (!found) return;
			var visibleViewportIndex = this._getVisibleViewportIndex();
			var viewportIndex = index;
			
			if (viewportIndex != visibleViewportIndex) return;
			
			var visibleSubstepIndex = viewport.getVisibleSubstepIndex();
			var visibleSubsteps = viewport.getVisibleSubsteps();
			found = false;
			for (index = 0; index < visibleSubsteps.length; index++) {
				if (substep === visibleSubsteps[index]) {
					found = true;
					break;
				}
			}
			if (!found) return;
			var substepIndex = index;
			
			if ((substepIndex <= visibleSubstepIndex) && (this._leadReview)) {
				// check if the blur/focus events are coming in expected order
				if (this._focusedLeader && this._focusedLeader.step === substep) {
					// the leader losing focus is the last one to receive an onFocus event
					this._focusedLeader = null;
					this._schedulePeekLeadingCancel();
				}
			}
			
			if ((substepIndex > visibleSubstepIndex) && (this._trailReview)) {
				// check if the blur/focus events are coming in expected order
				if (this._focusedTrailer && this._focusedTrailer.step === substep) {
					// the trailer losing focus is the last one to receive an onFocus event
					this._focusedTrailer = null;
					this._schedulePeekTrailingCancel();
				}
			}		
		},
		
		/**
		 *
		 */
		_onTitleFocus: function(viewport, event) {
			var wizardPane = viewport.getFirstWizardPane();
			var clickable = (this.isVisitedClickable && wizardPane && wizardPane.get("visited"));
			var index = 0;
			var found = false;
			var visited = false, firstPane = null;
			var visibleViewports = this._getVisibleViewports();
			var prevFocused = (this._focusedLeader||this._focusedTrailer);
			for (index = 0; index < visibleViewports.length; index++) {
				if (viewport === visibleViewports[index]) {
					found = true;
					break;
				}
			}
			var focusedIndex = index;
			if (!found) return;
			var visibleIndex = this._getVisibleViewportIndex();
			if ((index <= visibleIndex) && (this._leadReview)) {
				this._focusedLeader = {viewport:viewport,step:viewport.get("wizardPane"),target:event.target};
				this._peekLeading();
			}
			if ((index > visibleIndex) && (this._trailReview)) {
				this._focusedTrailer = {viewport:viewport,step:viewport.get("wizardPane"),target:event.target};
				this._peekTrailing();
			}
			if (this._leadReview || this._trailReview) {
				this._a11yAnnounce(this._resources.reviewStepAnnouncement, (prevFocused?false:true),
								   {index: (focusedIndex+1),
									count: visibleViewports.length,
									title: viewport.get("wizardPane").get("label")});
				visited = viewport.isVisited();
				firstPane = viewport.getFirstWizardPane();
				if (visibleIndex == focusedIndex) {
					this._a11yAnnounce(this._resources.reviewStepCurrentAnnouncement, true);
				}
				if (visited) {
					this._a11yAnnounce(this._resources.reviewStepVisitedAnnouncement, true);
				} else {
					if (firstPane && firstPane.get("visited")) {
						this._a11yAnnounce(this._resources.reviewStepStartedAnnouncement, true);
					} else {
						this._a11yAnnounce(this._resources.reviewStepUnvisitedAnnouncement, true);
					}
				}
				if (viewport.isDisabled()) {
					this._a11yAnnounce(this._resources.reviewStepDisabledAnnouncement, true);
				} else {
					if (this.isVisitedClickable && (visited || (firstPane && firstPane.get("visited")))) {
						if (viewport.getVisibleSubstepCount() == 0) {
							this._a11yAnnounce(this._resources.reviewStepClickAnnouncement, true);
						} else {
							this._a11yAnnounce(this._resources.reviewParentStepClickAnnouncement, true);
						}
					}
				}
			}
		},
		
		/** 
		 *
		 */
		_onTitleBlur: function(viewport, event) {
			var index = 0;
			var found = false;
			for (index = 0; index < this._viewports.length; index++) {
				if (viewport === this._viewports[index]) {
					found = true;
					break;
				}
			}
			if (!found) return;
			var selectedIndex = this._getSelectedIndex();
			if ((index <= selectedIndex) && (this._leadReview)) {
				// check if the blur/focus events are coming in expected order
				if (this._focusedLeader && this._focusedLeader.step === viewport.get("wizardPane")) {
					// the leader losing focus is the last one to receive an onFocus event
					this._focusedLeader = null;
					this._schedulePeekLeadingCancel();
				}
			}
			if ((index > selectedIndex) && (this._trailReview)) {
				// check if the blur/focus events are coming in expected order
				if (this._focusedTrailer && this._focusedTrailer.step === viewport.get("wizardPane")) {
					// the trailer losing focus is the last one to receive an onFocus event
					this._focusedTrailer = null;
					this._schedulePeekTrailingCancel();
				}
			}
		},
		
		/**
		 *
		 */
		_onTitleBarClick: function(viewport, event) {
			var wizardPane = viewport.getFirstWizardPane();
			if (wizardPane && wizardPane.get("visited") && this.isVisitedClickable) {
				this._activateAnimation();
				this._select(wizardPane);
				this._deactivateAnimation();
			}
		},
		
		/**
		 * Updates the accordion to show the propert viewport and optionally substep.
		 *
		 */
		_updateAccordion: function() {
			// turn off animation during resize operations
			if (this._updating) return;
			if (this._leadPeaking) this._cancelPeekLeading();
			if (this._trailPeaking) this._cancelPeekTrailing();
			this._updating = true;
			var index = 0;
			var selectedPane = this.getSelected();
			var selectedViewport = this._getSelectedViewport();
			var visibleViewports = [];
			dArray.forEach(this._viewports, dLang.hitch(this, function(viewport) {
				if (viewport.isHidden()) {
					dDomStyle.set(viewport.domNode, {display: "none", visibility: "hidden"});
				} else {
					dDomStyle.set(viewport.domNode, {display: "block", visibility: "visible"});
					visibleViewports.push(viewport);
				}
			}));
			var viewportCount = visibleViewports.length;
			var visibleIndex = this._getVisibleViewportIndex();
			if (visibleIndex < 0) throw "Attempt to select hidden pane: " + selectedPane.id;
			var minLeading = (visibleIndex - this.maxVisibleSteps) < 0 ? 0 : (visibleIndex - this.maxVisibleSteps + 1);
			var maxLeading = visibleIndex;
			var minTrailing = (visibleIndex + 1) >= viewportCount ? viewportCount : visibleIndex + 1;
			var maxTrailing = (minTrailing + this.maxVisibleSteps - 1) >= viewportCount ? viewportCount - 1 : minTrailing + this.maxVisibleSteps - 1;
			var leadingX = 0;
			var leadingMargin = 0;
			var trailingMargin = 0;
			var viewport = null;
			var ltr = this.isLeftToRight();
			var leadingSide = (ltr ? "left" : "right");
			var trailingSide = (ltr ? "right": "left");
			var style = null;
			// adjust for hidden viewports
			for (index = minLeading; index <= maxLeading; index++) {
				viewport = visibleViewports[index];
				leadingMargin += dDomGeometry.getMarginBox(viewport.titleBarNode).w;				
			}
			for (index = minTrailing; index <= maxTrailing; index++) {
				viewport = visibleViewports[index];
				trailingMargin += dDomGeometry.getMarginBox(viewport.titleBarNode).w;				
			}
			
			var dim = dDomGeometry.getContentBox(this._accordionNode);
			var trailingX = dim.w - trailingMargin;
			
			// TODO: account for padding and margin
			var contentWidth = dim.w - leadingMargin - trailingMargin;
			var contentHeight = dim.h;
			
			var moreMessage = null;
			if (minLeading == 0 && this._leadingOverflowNode) {
				dDomStyle.set(this._leadingOverflowNode, {"visibility": "hidden", "display": "none"});
				this._leadingOverflow = false;
			}
			if (maxTrailing == (viewportCount-1) && this._trailingOverflowNode) {
				dDomStyle.set(this._trailingOverflowNode, {"visibility": "hidden", "display": "none"});
				this._trailingOverflow = false;
			}
			for (index = 0; index < visibleViewports.length; index++) {
				// get the next viewport
				viewport = visibleViewports[index];
				
				style = { visibility: "visible", display: "block" };
				
				if (index < minLeading) {
					style[leadingSide] = "0px";
					style[trailingSide] = trailingMargin + "px";
					dDomStyle.set(viewport.domNode, style);
					dDomClass.add(viewport.domNode, viewport.baseClass + "Leading");
					dDomClass.remove(viewport.domNode, viewport.baseClass + "Trailing");
					viewport.updateViewport(contentWidth, contentHeight, selectedPane);
					continue;
				}
				if (index >= minLeading && index <= maxLeading) {
					style[leadingSide] = leadingX + "px";
					style[trailingSide] = trailingMargin + "px";
					dim = dDomGeometry.getMarginBox(viewport.titleBarNode);
					dDomStyle.set(viewport.domNode, style);
					if (index == visibleIndex) {
						viewport.updateViewport(contentWidth, contentHeight, selectedPane);
						visibleWidth = dDomGeometry.getMarginBox(viewport.domNode).w;
						dDomClass.remove(viewport.domNode, [viewport.baseClass + "Leading", viewport.baseClass + "Trailing"]);
					} else {
						viewport.updateViewport(contentWidth, contentHeight, selectedPane);
						dDomClass.add(viewport.domNode, viewport.baseClass + "Leading");
						dDomClass.remove(viewport.domNode, viewport.baseClass + "Trailing");
					}
					
					// overlay the first title bar for overflow if needed
					if (minLeading > 0 && index == minLeading) {
						moreMessage = dString.substitute(messages.leadingOverflowLabel, {count: "" + (minLeading+1)});
						this._leadingOverflowLabelNode.innerHTML = moreMessage;
						dDomStyle.set(this._leadingOverflowNode,
									  { "visibility": "visible",
										"display": "block",
									    "z-index": "100",
										"width": dim.w + "px"
									  });
						this._leadingOverflow = true;
					}
					
					leadingX += dim.w;
					continue;
				}
				if (index >= minTrailing && index <= maxTrailing) {
					dim = dDomGeometry.getMarginBox(viewport.titleBarNode);
					style[leadingSide] = trailingX + "px";
					style[trailingSide] = "auto";
					style["width"] = (visibleWidth + dim.w) + "px";
					dDomStyle.set(viewport.domNode, style);
					dDomClass.remove(viewport.domNode, viewport.baseClass + "Leading");
					dDomClass.add(viewport.domNode, viewport.baseClass + "Trailing");
					viewport.updateViewport(contentWidth, contentHeight, selectedPane);
					
					// overlay the last title bar for overflow if needed
					if (index == maxTrailing && maxTrailing < (viewportCount-1)) {
						moreMessage = dString.substitute(messages.trailingOverflowLabel, {count: "" + (viewportCount-maxTrailing)});
						this._trailingOverflowLabelNode.innerHTML = moreMessage;
						dDomStyle.set(this._trailingOverflowNode, trailingSide, "0px");
						dDomStyle.set(this._trailingOverflowNode,
									  { "visibility": "visible",
										"display": "block",
										"width": dim.w + "px"
									  });
						this._trailingOverflow = true;
					} 
					trailingX += dim.w;
					continue;
				}
				if (index > maxTrailing) {
					dim = dDomGeometry.getMarginBox(viewport.titleBarNode);
					style[leadingSide] = trailingX + "px";
					style["width"] = (visibleWidth + dim.w) + "px";
					style[trailingSide] = "auto";
					dDomStyle.set(viewport.domNode, style);
					dDomClass.remove(viewport.domNode, viewport.baseClass + "Leading");
					dDomClass.add(viewport.domNode, viewport.baseClass + "Trailing");
					viewport.updateViewport(contentWidth, contentHeight, selectedPane);
				}
			}
			// turn animation back on
			this._updateDimensions = dDomGeometry.getContentBox(this.domNode);
			this._updating = false;
		},
		
		/**
		 * @private Remove the pane.
		 */
		_remove: function(pane) {
			if (!pane) return;
			var wizardPaneID = pane.id;
			var viewport = this._viewportLookup[wizardPaneID];
			if (!viewport) return;
			var index = 0;
			var foundIndex = -1;
			var currentPane = null;
			var selected = this.getSelected();
			var mainPane = (viewport.get("wizardPane") === pane);
			if (selected === pane) {
				selected = this.getPrevious();
				if (!selected) selected = this.getNext();
			} else {
				selected = null;
			}
			
			for (index = 0; index < this._wizardPanes.length; index++) {
				currentPane = this._wizardPanes[index];
				if (pane === currentPane) {
					foundIndex = index;
					break;
				}
			}
			
			if (foundIndex<0) throw "Wizard pane not found: " + pane.id;
			this._viewportLookup[pane.id] = null;
			delete this._viewportLookup[pane.id];
			this._wizardPanes.splice(foundIndex, 1);
			if (mainPane) {
				foundIndex = -1;
				for (index = 0; index < this._viewports.length; index++) {
					if (this._viewports[index] === viewport) {
						foundIndex = index;
						break;
					}
				}
				if (foundIndex<0) throw "Wizard pane viewport not found: " + pane.id;
				this._viewports.splice(foundIndex, 1);
				
				viewport.containerNode.removeChild(pane.domNode);
				viewport.destroy();
			} else {
				viewport.updateSubsteps();
			}
			if (selected) {
				this._select(selected);
			}
			this._updateAccordion();
		},

		/**
		 * Returns a reference to the currently selected viewport.
		 */
		_getSelectedViewport: function() {
			if (this._selectedViewport) return this._selectedViewport;
			var selectedPane = this.getSelected();
			if (!selectedPane) return null;
			if (this._selectedViewport) return this._selectedViewport;
			this._selectedViewport = this._viewportLookup[selectedPane.id];
			return this._selectedViewport;
		},
		
		/**
		 * Return the selected WizardPane.
		 * 
		 * @return An instance of {@link idx.layout.WizardPane}.
		 */
		getSelected: function() {
			if (this._selectedPane) {
				if (!this._selectedViewport) this._selectedViewport = this._viewportLookup[this._selectedPane.id];
			}
			
			return this._selectedPane;
		},

		/**
		 * @private Called when the user clicks the next button.
		 * @private Called when the user clicks the next button.
		 */
		_onNext: function() {
			this.next();
		},
		
		/**
		 * Show the next WizardPane.
		 */
		next: function() {
			this._activateAnimation();

			var nextPane = this.getNext();
			if (!nextPane) return;
			var selectedPane = this.getSelected();
			if (selectedPane && nextPane != selectedPane) {
				selectedPane.onNext();
				selectedPane.set("visited", true);
			}
			this._select(nextPane);

			this._deactivateAnimation();
		},

		/**
		 * @private Called when the user clicks the previous button.  Show the previous WizardPane.
		 */
		_onPrevious: function() {
			this._activateAnimation();
			var prevPane = this.getPrevious();
			var selectedPane = this.getSelected();
			if (selectedPane && prevPane != selectedPane) {
				selectedPane.onPrevious();
			}
			this._select(prevPane);
			this._deactivateAnimation();
		},

		/**
		 *
		 */
		_a11yAnnounceCurrent: function(append) {
			var selectedPane = this.getSelected(), selectedViewport = this._getSelectedViewport();
			var message = this._resources.currentMainStepAnnouncement;
			this._a11yAnnounce(message, append, 
							  {index: (this._getVisibleViewportIndex() + 1), 
							   count: this._getVisibleViewportCount(), 
							   title: selectedViewport.get("wizardPane").get("label")});
							   
			if (selectedPane.get("substep")) {
				message = this._resources.currentSubstepAnnouncement;
				this._a11yAnnounce(message, true,
					{index: (selectedViewport.getVisibleSubstepIndex()+1),
					 count: selectedViewport.getVisibleSubstepCount(),
					 title: selectedPane.get("label")});
			}
		},
		
		/**
		 * @private Select the pane and enable the buttons.
		 */
		_select: function(pane) {
			var currentSelection = this.getSelected();
			if (pane && pane !== currentSelection && pane.isSelectable()) {
				this._selectedPane = pane;
				this._selectedViewport = this._viewportLookup[pane.id];
				this._updateAccordion();
				if (pane && currentSelection) {
					this._focusElement(pane.focusNode||this.domNode, true);
					this._a11yAnnounce(this._resources.stepChangeAnnouncment);
				}
				pane.onSelect();
				this.onSelect(pane);
				this._enableButtons();
			}
		},
		
		/**
		 * @private Called when the finish button is selected.
		 */
		_onFinish: function() {
			this.onFinish(this.getChildren(), this.getSelected());
		},

		/**
		 * @private Called when the save button is selected.
		 */
		_onSave: function() {
			this.onSave(this.getChildren(), this.getSelected());
		},

		/**
		 * @private Called when the cancel button is selected.
		 */
		_onCancel: function() {
			this.onCancel(this.getChildren(), this.getSelected());
		},

		/**
		 * @private Return a boolean indicating if the stackContainer has the pane.
		 */
		_containsPane: function(pane) {
			var children = this.getChildren();
			for ( var i = 0; i < children.length; i++) {
				if (children[i] == pane) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * Return the next WizardPane.
		 * 		 
		 * @param pane
		 * 		An instance of {@link idx.layout.WizardPane}.
		 * @return An instance of {@link idx.layout.WizardPane}.
		 */
		getNext: function(pane) {
			if (!pane) {
				pane = this.getSelected();
			}
			// If the pane indicated its next, then return it.
			if (pane && pane.next) {
				return pane.next;
			}
			var returnNext = false;
			var children = this.getChildren();
			for ( var i = 0; i < children.length; i++) {
				var child = children[i];
				if (child.isSelectable()) {
					if (!pane || returnNext) {
						return child;
					} else if (child == pane) {
						returnNext = true;
					}
				}
			}
			return null;
		},

		/**
		 * Return the previous WizardPane.
		 * 		 
		 * @param pane
		 * 		An instance of {@link idx.layout.WizardPane}.
		 * @return An instance of {@link idx.layout.WizardPane}.
		 */
		getPrevious: function(pane) {
			if (!pane) {
				pane = this.getSelected();
			}
			var previous = null;
			var children = this.getChildren();
			var index = 0;
			var child = null;
			for ( index = 0; index < children.length; index++) {
				child = children[index];
				if (child.isSelectable()) {
					if (child === pane) {
						return previous;
					}
					previous = child;
				}
			}
			return null;
		},


		//---------------------- BREAK POINT
		
		/** @lends idx.layout.TOCWizard.prototype */
		/**
		 * Destroy.
		 */
		destroy: function() {
			this.inherited(arguments);
		},

		/**
		 * Startup.
		 */
		startup: function() {
			var started = this._started;
			this.inherited(arguments);
			if (!started) {
				this._addWizardListeners();
			}
			this._borderContainer.resize();
		},
		
		/**
		 * @private Adds wizard listeners.
		 */
		_addWizardListeners: function() {			
			this.own(dAspect.after(this, "onRemove", dLang.hitch(this, function() {
				this._updateAccordion();
			}), true));
			
			this.own(dAspect.after(this, "onAdd", dLang.hitch(this, function() {
				this._updateAccordion();
			}), true));
		}

	});
});
