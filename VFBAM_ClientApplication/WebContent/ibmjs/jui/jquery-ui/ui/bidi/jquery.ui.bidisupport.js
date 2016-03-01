(function($){
	//----------------------------
	// General bidi functionality
	//----------------------------	
	$.ui.dialog.bidi_const = {
		LRE : '\u202A',
		PDF : '\u202C',
		RLE : '\u202B'
	};
	
	function enforceTextDirWithUcc ( text, textDir ) {
		// summary:
		//		Wraps text by UCC (Unicode control characters) according to textDir
		// text:
		//		The text to be wrapped.
		// textDir:
		//		The requested direction.		
		// description:
		//		There's a dir attribute problem with some widgets. In some of them (e.g. menu, accordion) 
		//		defining the dir attribute in different direction then the GUI orientation, will change the alignment of the text
		//      - this doesn't follow the bidi standards (static text should be aligned following GUI direction). 
		//		Therefore the only solution is to use UCC (Unicode control characters) to display the text in correct orientation.
		// 		(the original text is kept within the widget for cases where direction is changed again)
		var dir = textDir == "auto" ? checkContextual( text ) : textDir;
		return ( dir == 'ltr' ? $.ui.dialog.bidi_const.LRE : $.ui.dialog.bidi_const.RLE ) + text + $.ui.dialog.bidi_const.PDF;
	};
	
	function checkContextual ( text ) {
		// summary:
		//		Finds the first strong (directional) character, return ltr if isLatin
		//		or rtl if isBidiChar.

		// look for strong (directional) characters
		var fdc = /[A-Za-z\u05d0-\u065f\u066a-\u06ef\u06fa-\u07ff\ufb1d-\ufdff\ufe70-\ufefc]/.exec( text );
		// if found return the direction that defined by the character, else return widgets dir as defult.
		return fdc ? ( fdc[0] <= 'z' ? 'ltr' : 'rtl' ) : 'ltr';
	};
	
	//----------------------------
	// handle accordion widget
	//----------------------------
	$.ui.accordion.bidisupport =
	{
		textDir: function( element, textDir ) {
		
			// get textDir attribute
			var _textDir = '';
			if ( textDir )
				_textDir = textDir;
			else
				_textDir = $( element ).accordion( "option", "textDir" );
				
			if  ( _textDir != 'ltr' && _textDir != 'rtl' && _textDir != 'auto' )
				return;

			// set text direction for all accordion's tabs
			var items = $( element ).find( "[role='tab']" )
			.contents()
			.filter( function() {
				return this.nodeType === 3;
			});
			var textValue = "", originalText = "", bidiTextValue = "";
			items.each( function( index, item ) {
				textValue = $( item ).text();
				originalText = $( item )[ 0 ].parentNode.getAttribute( "originalText" );
				bidiTextValue = enforceTextDirWithUcc( originalText || textValue, _textDir );
				$( item )[ 0 ].data = bidiTextValue;
				if ( !originalText )
					$( item )[ 0 ].parentNode.setAttribute( "originalText" , textValue );
			})
		}
	};

	//----------------------------
	// handle button widget
	//----------------------------
	$.ui.button.bidisupport =
	{
		textDir: function( element, textDir ) {
		
			// get textDir attribute
			var _textDir = '';
			if ( textDir )
				_textDir = textDir;
			else
				_textDir = $( element ).button( "option", "textDir" );
				
			if  ( _textDir != 'ltr' && _textDir != 'rtl' && _textDir != 'auto' )
				return;

			// set button label direction
			var label = $( element ).button( "option", "label" );
			var dir = _textDir == "auto" ? checkContextual( label ) : _textDir;
			$( element ).find( ".ui-button-text" ).attr( 'dir', dir );
		}
	};

	//----------------------------
	// handle buttonset widget
	//----------------------------
	$.ui.buttonset.bidisupport =
	{
		textDir: function( element, textDir ) {
			// get textDir attribute
			var _textDir = '';
			if ( textDir )
				_textDir = textDir;
			else
				_textDir = $( element ).buttonset( "option", "textDir" );
				
			if  ( _textDir != 'ltr' && _textDir != 'rtl' && _textDir != 'auto' )
				return;

			$( element ).buttonset().find( "label[for]" ).find( 'span' )	
				.each( function( index, item ) {
					dir = _textDir == "auto" ? checkContextual( $( item ).text() ) : _textDir;
					$( item ).attr( 'dir', dir );						
				})	
		}
	};

	//----------------------------
	// handle menu widget
	//----------------------------
	$.ui.menu.bidisupport =
	{
		textDir: function( element, textDir ) {
			// get textDir attribute
			var _textDir = '';
			if ( textDir )
				_textDir = textDir;
			else
				_textDir = $( element ).menu( "option", "textDir" );
				
			if  ( _textDir != 'ltr' && _textDir != 'rtl' && _textDir != 'auto' )
				return;

			var textValue = "", originalText = "", bidiTextValue = "";
			var items = $( element ).find( "[role='menuitem']" )
			.contents()
			.filter(function() {
				return this.nodeType === 3;
			});
			items.each( function( index, item ) {
				textValue = $( item )[ 0 ].data;
				originalText = $( item )[ 0 ].parentNode.getAttribute( "originalText" );
				bidiTextValue = enforceTextDirWithUcc( originalText || textValue, _textDir );

				$( item )[ 0 ].data = bidiTextValue;
				if ( !originalText )
					$( item )[ 0 ].parentNode.setAttribute( "originalText" , textValue );
			})
		}
	};

	//----------------------------
	// handle tooltip widget
	//----------------------------
	$.ui.tooltip.bidisupport =
	{
		textDir: function( element, textDir ) {
			// get textDir attribute
			var _textDir = '';
			if ( textDir )
				_textDir = textDir;
			else
				_textDir = $( element ).tooltip( "option", "textDir" );
				
			if  ( _textDir != 'ltr' && _textDir != 'rtl' && _textDir != 'auto' )
				return;

			var toolTipText="", bidiToolTipText="", originalText="";
			// check if a content was declared for the element
			var content = $( element ).tooltip( "option", "content" );

			if ( typeof( content ) == "function" ) {
				// content was not declared for this element. The tooltip text must be searched for
				var items = $( element ).tooltip( "option", "items" );
				if ( items.indexOf( "title" ) >= 0 ) {
					// content is kept in the default [title] attribute
					var elements = $( element[0] ).find( "[title]" );
					if ( elements.length == 0 ) {
						originalText = elements.context.getAttribute( "originalText" );
						toolTipText = elements.context.title;
						bidiToolTipText = enforceTextDirWithUcc( originalText || toolTipText, _textDir );
						elements.context.title = bidiToolTipText;
						if ( !originalText )
							elements.context.setAttribute( "originalText" , toolTipText );
					}
					else {
						elements.each( function( index, item ) {
							originalText = $( item )[ 0 ].getAttribute( "originalText" );
							toolTipText  = $( item )[ 0 ].title;
							bidiToolTipText = enforceTextDirWithUcc( originalText || toolTipText, _textDir );
							$( item )[ 0 ].title = bidiToolTipText;
							if ( !originalText )
								$( item )[ 0 ].setAttribute( "originalText" , toolTipText );
						})
					}
				}
			}
			else if ( typeof( content ) == "string" ) {
				// content was declared for this element
				originalText = $( element )[ 0 ].getAttribute( "originalText" );
				bidiToolTipText = enforceTextDirWithUcc( originalText || content, _textDir );
				$( element ).tooltip( "option", "content", bidiToolTipText );
				if ( !originalText )
					$( element )[ 0 ].setAttribute( "originalText" , content );
			}
		}
	};

	//----------------------------
	// handle tabs widget
	//----------------------------
	$.ui.tabs.bidisupport =
	{
		textDir: function( element, textDir ) {
			// get textDir attribute
			var _textDir = '';
			if ( textDir )
				_textDir = textDir;
			else
				_textDir = $( element ).tabs( "option", "textDir" );
				
			if  ( _textDir != 'ltr' && _textDir != 'rtl' && _textDir != 'auto' )
				return;

			// get tab's labels
			var items = $( element ).find( "[role='presentation']" )
			.contents()
			.filter(function() {
				return this.nodeType === 3;
			});
			// set text direction for all tab's labels
			var textValue="", bidiTextValue="", originalText="";
			items.each( function( index, item ) {
				// both are identical
				textValue = $( item ).text();
				originalText = $( item )[ 0 ].parentNode.getAttribute( "originalText" );
				bidiTextValue = enforceTextDirWithUcc( originalText || textValue, _textDir );

				$( item )[ 0 ].data = bidiTextValue;
				if ( !originalText )
					$( item )[ 0 ].parentNode.setAttribute( "originalText", textValue );
			})
		}
	};

	//----------------------------
	// handle dialog widget
	//----------------------------
	$.ui.dialog.bidisupport =
	{
		textDir: function( element, textDir ) {
			// get textDir attribute
			var _textDir = '';
			if ( textDir )
				_textDir = textDir;
			else
				_textDir = $( element ).dialog( "option", "textDir" );
			
			if  ( _textDir != 'ltr' && _textDir != 'rtl' && _textDir != 'auto' )
				return;

			// get title text
			var textValue = $( element ).dialog( "option", "title" );
			// set title text direction
			var titleElement = $( element[ 0 ].parentNode ).find( ".ui-dialog-title" );
			var originalText = titleElement[ 0 ].getAttribute( "originalText" );
			var bidiTextValue = enforceTextDirWithUcc( originalText || textValue, _textDir );	

			titleElement[ 0 ].textContent = bidiTextValue;
			if ( !originalText )
				titleElement[ 0 ].setAttribute( "originalText" , textValue );

			// get buttons text
			var buttons = $( element[ 0 ].parentNode ).find( ".ui-button-text" );
			// set buttons text direction
			var dir = "";
			buttons.each( function( index, item ) {
				textValue = item.textContent.replace( /\n/g, '' ).trim();
				if ( textValue ) {
					dir = _textDir == "auto" ? checkContextual( textValue ) : _textDir;
					item.setAttribute( "dir", dir );
				}
			})

			// get close text
			var closeText = $( element ).dialog( "option", "closeText" );
			// set close text direction
			dir = _textDir == "auto" ? checkContextual( closeText ) : _textDir;
			$( element[ 0 ].parentNode ).find( ".ui-dialog-titlebar-close" ).attr( "dir", dir );
		}
	};
	
    $.fn.setTextDir = function( textDir ) {
		if (textDir == undefined)
			return;
		
		if ( $( this.selector ).data( 'ui-accordion' ) ) {
			$.ui.accordion.bidisupport.textDir( this, textDir );
		}
		else if ( $( this.selector ).data( 'ui-button' ) ) {
			$.ui.button.bidisupport.textDir( this, textDir );
		}
		else if ( $( this.selector ).data( 'ui-buttonset' ) ) {
			$.ui.buttonset.bidisupport.textDir( this, textDir );
		}
		else if ( $( this.selector ).data( 'ui-menu' ) ) {
			$.ui.menu.bidisupport.textDir( this, textDir );
		}
		else if ( $( this.selector ).data( 'ui-tooltip' ) ) {
			$.ui.tooltip.bidisupport.textDir( this, textDir );
		}		
		else if ( $( this.selector ).data( 'ui-tabs' ) ) {
			$.ui.tabs.bidisupport.textDir( this, textDir );
		}		
		else if ( $( this.selector ).data( 'ui-dialog' ) ) {
			$.ui.dialog.bidisupport.textDir( this, textDir );
		}
    };	
}( jQuery ));