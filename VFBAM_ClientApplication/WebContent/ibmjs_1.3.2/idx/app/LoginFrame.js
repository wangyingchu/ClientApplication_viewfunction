/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or 
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/keys",
        "dojo/aspect",
        "dojo/Deferred",
        "dojo/when",
        "dojo/promise/Promise",
        "dojo/promise/all",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/focus",
        "dojo/query",
        "dojo/dom-style",
        "../string",
        "../resources",
        "dojo/text!./templates/LoginFrame.html",
        "dijit/form/Form",
        "dijit/form/Button",
        "dijit/form/ValidationTextBox",
        "idx/form/TextBox",
        "idx/widget/Dialog",
        "dojo/i18n!./nls/LoginFrame",
        "dojo/i18n!idx/widget/nls/ModalDialog",
        "dojo/i18n!idx/widget/nls/base",
        "dojo/i18n!./nls/base",
        "dojo/i18n!../nls/base"
        ],
        function(dDeclare,					// (dojo/_base/declare)
				 dLang,						// (dojo/_base/lang)
				 dKeys,                     // (dojo/keys)
				 dAspect,					// (dojo/aspect)
				 dDeferred,					// (dojo/Deferred)
				 dWhen,						// (dojo/when)
				 dPromise,					// (dojo/promise/Promise)
				 dPromiseAll,				// (dojo/promise/all)
		         dWidget,					// (dijit/_Widget)
		         dTemplatedMixin,			// (dijit/_TemplatedMixin)
		         dWidgetsInTemplateMixin,	// (dijit/_WidgetsInTemplateMixin)
		         dFocus,					// (dijit/focus)
		         dQuery,					// (dojo/query)
		         dDomStyle,					// (dojo/dom-style) for (dDomStyle.set)
		         iString,					// (idx/string)
		         iResources,				// (idx/resources)
		         templateText)				// (dojo/text!./templates/LoginFrame.html) 
{
	
	/**
	 * @name idx.app.LoginFrame
	 * @class The LoginFrame provides the standard login screen.
	 * @augments dijit._Widget
	 * @augments dijit._TemplatedMixin
	 * 
	 */
return dDeclare("idx.app.LoginFrame", [dWidget,dTemplatedMixin,dWidgetsInTemplateMixin],
		  /**@lends idx.app.LoginFrame#*/		
{
  /**
   * @private
   */
  baseClass: "idxLoginFrame",

  /**
   * The path to the widget template for the dijit._TemplatedMixin base class.
   * 
   * @private
   * @constant
   * @type String
   */
  templateString: templateText,
 
  /** 
   * Allow users to add other components (e.g. hidden fields) under password field
   * 
   * @private
   */
  isContainer: true,
  
  /**
   * The name to assign to the form used by LoginFrame.
   * @default ""
   */
  formName: "",
  
  /**
   * The action for the form.  This defaults to empty-string.  If specified
   * as a non-empty value, this URL is submitted on a hidden iframe in the 
   * LoginFrame widget.  This form submission is needed by some browsers to 
   * cause credentials to be remembered for later auto-completion/auto-fill
   * functionality.  Even though submission occurs you can still handle login
   * via the JavaScript handler. See the "onSubmit" function for how to cancel
   * this submission as well.  If this URL is left blank then no submission is
   * done and auto-complete/auto-fill functionality and-or password vault 
   * extensions/plugins may not function properly.
   */
  formAction: "",
 
  /**
   * The target window/frame for the form submission if the formActio is configured
   * and actual HTML form submission will occur.  By default, the form taget is set
   * to empty-string ("") which is a special value which indicates that a hidden 
   * iframe that is part of the widget should be used as the target.  The hidden 
   * iframe is handy for triggering the browser and extensions/plugins to remember 
   * the credentials for auto-fill of the form at a later date.
   * <p>
   * Alternatively, you can set this to values like "_self", "_parent", "_top", 
   * "_blank" or the name of any frame or window.  Use "_self" if your login frame
   * is a stand-alone page that submits and retrieves the application afer login in
   * order to replace the current page wiht a new page.
   */
  formTarget: "",
  
  /**
   * Title to be displayed above the login form.
   * @public
   * @field
   * @type String
   * @default "Login"
   */
  loginTitle: "",
  
  /**
   * Subtitle to be displayed immediately beneath {@link idx.app.LoginFrame#loginTitle}
   * @public
   * @field
   * @type String
   * @default "Please enter your information"
   */
  loginSubTitle: "",
  
  /**
   * The character sequence to use as a label separator.  Typically a colon (":") in the en_us locale. 
   * @public
   * @field
   * @type String
   * @default ":"
   */
  labelSeparator: "",
  
  /**
   * @private
   */
  _setFormActionAttr: function(value) {
  	this.formAction = value;
  	this._form.set("action", value);
  },
  
  /**
   * @private
   */
  _setFormTargetAttr: function(value) {
  	this.formTarget = value;
  	if (iString.nullTrim(value)) {
  		this._form.set("target", value);
  	} else {
  		this._form.set("target", this._hiddenFrame.name);
  	}
  },
  
  /**
   * @private
   */
  _setLabelSeparatorAttr: function(value) {
	this.labelSeparator = value;
	var separator = this.labelSeparator;
	if (this.domNode) {
		dQuery(".idxLoginSeparator", this.domNode).forEach(function (node,index,nodeList) {
			node.innerHTML = separator;
		});
	}
  },
  
  /**
   * Label that corresponds to the first text field in the form.
   * @public
   * @field
   * @type String
   * @default "User name"
   */
  labelUserName: "",
  
  /**
   * The form field name assigned to the user name field.
   * @default "username"
   */
  userFieldName: "username",
  
  /**
   * Label that corresponds to the second text field in the form.
   * @public
   * @field
   * @type String
   * @default "Password"
   */
  labelPassword: "",

  /**
   * The form field name assigned to the password field.
   * @default "password"
   */
  passwordFieldName: "password",
  
  /**
   * Sets whether or not the user field will allow auto-complete.  Use a boolean value of true
   * to activate auto-complete for user field and a value of false to deactivate it.  NOTE: activating
   * auto-complete can make your application less secure.
   *
   * @default false
   */
  userAutoComplete: false,
  
  /**
   * Sets whether or not the password field will allow auto-complete.  Use a boolean value of true
   * to activate auto-complete for password field and a value of false to deactivate it.  NOTE: activating
   * auto-complete can make your application less secure.
   *
   * @default false
   */
  passwordAutoComplete: false,
  
  /**
   * Map the label attributes.
   * @private
   */
  attributeMap: dLang.delegate(dWidget.prototype.attributeMap, {
		inactivityMessage: {node: "inactivityMessageNode", type: "innerHTML"},
		loginTitle: {node: "loginTitleNode", type: "innerHTML"},
		loginSubTitle: {node: "loginSubtitleNode", type: "innerHTML"},
		loginCopyright: {node: "copyrightNode", type: "innerHTML"}
  }),
  
  /**
   * Constructor.
   */
  constructor: function() {
  	this._allowingSubmit = false;
  	this._userAutoComplete = "off";
  	this._pwdAutoComplete = "off";
  },

  /**
   *
   * @private
   */
  _setLabelUserNameAttr: function(value) {
  	this.labelUserName = value;
  	var sep = iString.nullTrim(this.labelSeparator);
  	if (iString.nullTrim(value)) this.loginUserName.set("label", value + (sep?sep:""));
  	else this.loginUserName.set("label", "");
  },
  
  /**
   * @private
   */
  _setUserFieldNameAttr: function(value) {
  	this.userFieldName = value;
  	if (iString.nullTrim(value)) this.loginUserName.set("name", value);
  	else this.loginUserName.set("name", "username");
  },
  
  /**
   *
   * @private
   */
  _setLabelPasswordAttr: function(value) {
  	this.labelPassword = value;
  	var sep = iString.nullTrim(this.labelSeparator);
  	if (iString.nullTrim(value)) this.loginPassword.set("label", value + (sep?sep:""));
  	else this.loginPassword.set("label", "");
  },
  
  /**
   * @private
   */
  _setPasswordFieldNameAttr: function(value) {
  	this.passwordFieldName = value;
  	if (iString.nullTrim(value)) this.loginPassword.set("name", value);
  	else this.loginPassword.set("name", "password");
  },
  
  /**
   * @private
   */
  _setUserAutoCompleteAttr: function(value) {
  	this.userAutoComplete = value;
  	this._userAutoComplete = (value) ? "on" : "off";
  	if (this.loginUserName) this.loginUserName.set("autocomplete", this._userAutoComplete);
  },
  
  /**
   * @private
   */
  _setPasswordAutoCompleteAttr: function(value) {
  	this.passwordAutoComplete = value;
  	this._pwdAutoComplete = (value) ? "on" : "off";
  	if (this.loginPassword) this.loginPassword.set("autocomplete", this._pwdAutoComplete);
  },
  
  /**
   * Informational message to be displayed directly above the form's buttons.
   * 
   * @type String
   * @default Please note, after some time of inactivity, the system will sign you out automatically and ask you to sign in again.
   */
  inactivityMessage: "",
  
  /**
   * Copyright statement to be displayed below the form.
   * 
   * @type String
   */
  loginCopyright: "",
  
  /**
   * Label to be displayed on the submission/login button.
   * 
   * @type String
   * @default Login
   */
  labelSubmitButton: "",
  
  /**
   * 
   */
  _setLabelSubmitButtonAttr: function(value) {
	  this.labelSubmitButton = value;
	  this.loginButton.set("label", this.labelSubmitButton);
  },
  
  /**
   * Error message to be displayed when required input
   * user name or password is empty or blank.
   * @type String
   * @default A valid value has not been entered in both required fields."
   */
  invalidMessage: "",
  
  /**
   * Error message dialog title when login button clicked 
   * with invalid username or password.
   * @public
   * @field
   * @type String
   * @default Invalid Login Attempt."
   */
  invalidMessageTitle: "",
  
  /**
   * @private
   * @function
   */
  _setInvalidMessageAttr: function(value) {
  	this.invalidMessage = value;
  	this.loginUserName.set("invalidMessage", this.invalidMessage);
  	this.loginUserName.set("missingMessage", this.invalidMessage);
  	this.loginPassword.set("invalidMessage", this.invalidMessage);
  	this.loginPassword.set("missingMessage", this.invalidMessage);
	this.invalidMessageNode.innerHTML = this.invalidMessage;
  },
  
  /**
   * @private
   * @function
   */
  _setInvalidMessageTitleAttr: function(value) {
	  this.invalidMessageTitle = value;
	  this.invalidLoginDialog.set("title", this.invalidMessageTitle);	  
  },
  
  /**
   * Error dialog OK button label
   * @type String
   * @default "OK" 
   */
  labelOkButton: "",
  
  /**
   * @private
   * @function
   */
  _setLabelOkButtonAttr: function(value) {
	  this.labelOkButton = value;
	  this.dialogOKButton.set("label", value);
  },
  
  /**
   * Regular expression for user name and password 
   * validation that user can override.
   * @type String
   * @default  ".*" 
   */
  regExp: ".*", // to restrict to numbers,letters and underscore, use "[\w]+"
  
  /**
   * Message to be displayed on the cancel button.
   * 
   * @type String
   * @default Cancel
   */
  labelCancelButton: "",
  
  /**
   * @private
   * @function
   */
  _setLabelCancelButtonAttr: function(value) {
	  this.labelCancelButton = value;
	  this.cancelButton.set("label", this.labelCancelButton);
  },
  
  /**
   * Specifies whether this LoginFrame should include a Cancel button
   * @public
   * @field
   * @type boolean
   * @default false
   */
  showCancelButton: false,

  /**
   * @private
   * @function
   */
  _setShowCancelButtonAttr: function(b)
  {
      if(b)
      {
          dDomStyle.set(this.cancelButton.domNode,{visibility:"visible",display:"inline"});
      }
      else
      {
          dDomStyle.set(this.cancelButton.domNode,{visibility:"hidden",display:"none"});
      }
  },

  postMixInProperties: function() {
	this.inherited(arguments);

	var resources = iResources.getResources("idx/app/LoginFrame", this.lang);
	if(!this.loginTitle){
		this.loginTitle = resources.loginTitle;
	}
	if(!this.labelUserName){
		this.labelUserName = resources.labelUserName;
	}
	if(!this.labelPassword){
		this.labelPassword = resources.labelPassword;
	}
	if(!this.labelSubmitButton){
		this.labelSubmitButton = resources.loginTitle;
	}
	if(!this.invalidMessage){
		this.invalidMessage = resources.invalidMessage;
	}
	if(!this.invalidMessageTitle){
		this.invalidMessageTitle = resources.invalidMessageTitle;
	}
	resources = iResources.getResources("idx/widget/ModalDialog", this.lang);
	if(!this.labelOkButton){
		this.labelOkButton = resources.executeButtonLabel;
	}
	if(!this.labelCancelButton){
		this.labelCancelButton = resources.cancelButtonLabel;
	}
	if(!this.labelSeparator){
		this.labelSeparator = iResources.getLabelFieldSeparator("idx/app/LoginFrame", this.lang);
	}
  },

  postCreate: function() {
	this.connect(this.loginUserName.domNode, "onkeypress", this._onKeyPress);
	this.connect(this.loginUserName, "onFocus", this._onUserFieldFocus);
	this.connect(this.loginUserName.focusNode, "onfocus", this._onUserFieldFocus);
	this.connect(this.loginPassword.domNode, "onkeypress", this._onKeyPress);
	this.connect(this.loginPassword, "onFocus", this._onPasswordFieldFocus);
	this.connect(this.loginPassword.focusNode, "onfocus", this._onPasswordFieldFocus);
  },
  
  startup: function() {
  	this.inherited(arguments);
  	
  	var sep = iString.nullTrim(this.labelSeparator);
  	
  	this.loginUserName.set("label", this.labelUserName + (sep?sep:""));
  	this.loginPassword.set("label", this.labelPassword + (sep?sep:""));
  	this.loginUserName.set("invalidMessage", this.invalidMessage);
  	this.loginUserName.set("missingMessage", this.invalidMessage);
  	this.loginPassword.set("invalidMessage", this.invalidMessage);
  	this.loginPassword.set("missingMessage", this.invalidMessage);
  },
  
  _onUserFieldFocus: function() {
  	this._lastFocus = this.loginUserName;
  },
  
  _onPasswordFieldFocus: function() {
  	this._lastFocus = this.loginPassword;
  },
  
  onFocus: function() {
  	this.inherited(arguments);
  	if (this._lastFocus) {
  		this._lastFocus.focus();
  		this._lastFocus = null;
  	} else {
  		this.loginUserName.focus();
  	}
  },
  
  /**
   * Handle enter key pressed in username or password fields
   */
  _onKeyPress: function(e) {
	 
	 this.inherited(arguments);
	 if(e && e.keyCode && e.keyCode == dKeys.ENTER) {
		 this._onSubmitClick(e);
	 }
  },

  /**
   * Prevent form submission.
   */
  _onFormSubmit: function() {
  	if (this._allowingSubmit) {
  		this._allowingSubmit = false;
  		return true;
  	} else {
  		return false;
  	}
  },
  
  /**
   * Called when login button pressed
   * Calls user 'onSubmit' method after
   * trimming fields. Displays error message
   * if fields invalid.
   * @private
   * @function
   * @param {Event} e
   */
  _onSubmitClick: function(/*Event*/ e)
  {
  	  var lastFocus = this._lastFocus;
	  // Do some validation here before continuing 
	  // Trim fields and display error dialog if invalid
	  // Caller could have specified their own regExp for additional validation
	  var name = this.loginUserName.value;
	  if(name && name != "") {
		  name = name.replace(/^\s+|\s+$/g, '');
		  this.loginUserName.set("value",name) ; // remove leading/trailing blanks
	  }
	  var pwd  = this.loginPassword.value;
	  if(pwd && pwd != "") {
		  pwd = pwd.replace(/^\s+|\s+$/g, '');
		  this.loginPassword.set("value",pwd) ; // remove leading/trailing blanks
	  }
  
	  //force validation to show error icon if invalid (in case user hasn't already clicked in and out of field defect #5876)
	  var isPasswordValid = this.loginPassword.isValid();
      
	  var isUserNameValid = this.loginUserName.isValid();
	  
	  this.loginPassword.focus();
	  this.loginUserName.focus();
	  
	  if( !isUserNameValid || !isPasswordValid ) {
	    // focus the button to trigger the validation tooltips to fade out
	  	this.loginButton.focus();
	  	
		// show the dialog  	
  		this.invalidLoginDialog.show();
		var dialogHandle = null;
		
		// wait for dialog to close to revalidate the form and focus the first bad field
		var self = this;
		dialogHandle = dAspect.after(this.invalidLoginDialog, "onHide", function() {
		   if( !isPasswordValid ) {
    			//note: validate() wouldn't update styling if field was not in focus, so forcing focus to field first
    			self.loginPassword.focus();
      			self.loginPassword.validate(false);
  	   		}
  	   		if( !isUserNameValid ) {
  	   			self.loginUserName.focus();
      			self.loginUserName.validate(false);
    	   	}
      	   	if (dialogHandle) dialogHandle.remove();
	  	});
	  } else {
	  	var d = this.onSubmit(this.loginUserName.value,this.loginPassword.value,this.loginForm);
	  	var self = this;
	  	dWhen(d, function() {
	  		var submitForm = false;
	  		if ((d == true) || (d == false)) {
	  			submitForm = d;
	  		} else if ((d instanceof dDeferred) || (d instanceof dPromise)) {
	  			submitForm = d.isResolved(); 
	  		} else {
	  			submitForm = true;
	  		}
	  		
	  		if ((submitForm)&&(iString.nullTrim(self.formAction))) {
	  			self._allowingSubmit = true;
	  			self._form.submit();
	  			self._allowingSubmit = false;
	  		}
	  	});
	  }
	  lastFocus.focus();
  },

  /**
   * Callback function when the end-user clicks the submit/login button. Users of this class
   * should override this function to provide intended submission behavior.  If this function
   * returns true (the default) then the form is form is submitted to a hidden iframe.  To 
   * cancel form submission you can return false or alternative return a dojo/Deferred that
   * if "resolved" will trigger form submission, but if "rejected" or "cancelled" will prevent
   * form submission.  Form submission only occurs if the "formAction" attribute is non-empty.
   *
   * @public
   * @function
   * @param {String} username The username that was entered
   * @param {String} password The password that was entered
   */
  onSubmit: function(/*String*/ username, /*String*/ password)
  {
  	return true;
  },
  
  /**
   * @private
   * @function
   */
  _onCancelClick: function(/*Event*/ e)
  {	  
	  return this.onCancel();
  },
  
  /**
   *  Callback function when the end-user clicks the cancel button.  Users of this class should
   *  override this function to provide intended cancel behavior
   * @public
   * @function
   */
  onCancel: function()
  {

  }
});
});
