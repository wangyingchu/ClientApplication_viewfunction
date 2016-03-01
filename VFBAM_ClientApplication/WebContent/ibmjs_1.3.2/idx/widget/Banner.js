define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dijit/_Widget",
	"dijit/_Container",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/DropDownButton",
	"dijit/form/Button",
	"dijit/Menu",
	"dijit/MenuItem",
	"idx/util",
	"idx/resources",
	"dojo/text!./templates/Banner.html",
	"dojo/i18n!../nls/base",
	"dojo/i18n!../templates/nls/base",
	"dojo/i18n!../templates/nls/ConsoleLayout"
], function(dojo_declare, dojo_array, dijit_Widget, dijit_Container, dijit_TemplatedMixin, dijit_WidgetsInTemplateMixin, dijit_form_DropDownButton, dijit_form_Button, dijit_Menu, dijit_MenuItem, idx_util, idx_resources, templateString){

var placeHolder = new function() {};

/**
 * @name idx.widget.Banner
 * @class Application banner with built-in and custom links.
 * @augments dijit._Widget
 * @augments dijit._Container
 * @augments dijit._TemplatedMixin
 * @augments dijit._WidgetsInTemplateMixin
 */
return dojo_declare("idx.widget.Banner", [ dijit_Widget, dijit_Container, dijit_TemplatedMixin, dijit_WidgetsInTemplateMixin ],
/** @lends idx.widget.Banner# */
{
	/**
	 * Template string.
	 * @type String
	 * @private
	 */
	templateString: templateString,

	/**
	 * Label string for username.
	 * 
	 * @type String
	 * @default ""
	 */
	usernameLabel: "",

	/**
	 * Username.
	 * 
	 * @type String
	 * @default ""
	 */
	username: "",

	/**
	 * Label string for log out link.
	 * 
	 * @type String
	 * @default "Log out"
	 */
	logoutLabel: "",

	/**
	 * Function to call when the user clicks the log out menu item.
	 * 
	 * @type Function
	 * @default null
	 */
	logoutFunc: placeHolder,

	/**
	 * Label string for help link.
	 * 
	 * @type String
	 * @default "Help"
	 */
	helpLabel: "",

	/**
	 * Function to call when the user clicks the help button.
	 * 
	 * @type Function
	 * @default null
	 */
	helpFunc: placeHolder,

	/**
	 * Label string for about link.
	 * 
	 * @type String
	 * @default "About"
	 */
	aboutLabel: "",

	/**
	 * Function to call when the user clicks the about menu item.
	 * 
	 * @type Function
	 * @default null
	 */
	aboutFunc: placeHolder,

	/**
	 * 
	 */
	postMixInProperties: function() {
	    idx_util.nullify(this, this.params, ["helpFunc", "aboutFunc", "logoutFunc"]);
		this.inherited(arguments);
	},
	
	/**
	 * Creates a trailer section.
	 * @private as part of widget life cycle
	 */
	buildRendering: function() {
		var resources = idx_resources.getResources("idx/templates/ConsoleLayout", this.lang);
		if(!this.logoutLabel){
			this.logoutLabel = resources.logout;
		}
		if(!this.helpLabel){
			this.helpLabel = resources.help;
		}
		if(!this.aboutLabel){
			this.aboutLabel = resources.about;
		}

		this.inherited(arguments);

		this._createMenu();
	},

	/**
	 * Creates a trailer section.
	 * 
	 * @private
	 */
	_createMenu: function() {
		if (this.username) {
			var self = this;

			if (this.logoutFunc && this.logoutFunc !== placeHolder) {
				var actionMenuItem = new dijit_MenuItem({
					label: this.logoutLabel,
					onClick: this.logoutFunc
				});
				this.actionsMenu.addChild(actionMenuItem);
			}

			if (this.aboutFunc && this.aboutFunc !== placeHolder) {
				var actionMenuItem = new dijit_MenuItem({
					label: this.aboutLabel,
					onClick: this.aboutFunc
				});
				this.actionsMenu.addChild(actionMenuItem);
			}

			if (this.helpFunc && this.helpFunc !== placeHolder) {
				this.helpButton.onClick = this.helpFunc;
			}
		}
	},

	/**
	 * Adds items to the action menu drop-down.
	 * 
	 * @param {Array} actionMenusItems 
	 *				An array of dijit.MenuItem objects to add to the action menu drop-down.
	 */
	addMenuItems: function(actionMenusItems) {
		if (actionMenusItems && actionMenusItems.length > 0) {
			var self = this;

			dojo_array.forEach(actionMenusItems, function(actionMenuItem) {
				self.actionsMenu.addChild(actionMenuItem);
			});
		}
	}
});

});
