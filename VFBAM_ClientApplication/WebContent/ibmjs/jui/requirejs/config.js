require.config({
	baseUrl: "../",
	paths : {
		'jui': '../jui',
		'less': 'themes/less/less-1.4.1',
		
		/* AMD plugin */
		'text': 'requirejs/text',
	    /* jQuery */
	    'jquery': 'jquery-ui/jquery-1.10.2',
	
	    /* jQuery UI */
	    'jquery.ui.accordion': 'jquery-ui/ui/jquery.ui.accordion',
	    'jquery.ui.autocomplete': 'jquery-ui/ui/jquery.ui.autocomplete',
	    'jquery.ui.button': 'jquery-ui/ui/jquery.ui.button',
	    'jquery.ui.core': 'jquery-ui/ui/jquery.ui.core',
	    'jquery.ui.datepicker': 'jquery-ui/ui/jquery.ui.datepicker',
	    'jquery.ui.dialog': 'jquery-ui/ui/jquery.ui.dialog',
	    'jquery.ui.draggable': 'jquery-ui/ui/jquery.ui.draggable',
	    'jquery.ui.droppable': 'jquery-ui/ui/jquery.ui.droppable',
	    'jquery.ui.effect-blind': 'jquery-ui/ui/jquery.ui.effect-blind',
	    'jquery.ui.effect-bounce': 'jquery-ui/ui/jquery.ui.effect-bounce',
	    'jquery.ui.effect-clip': 'jquery-ui/ui/jquery.ui.effect-clip',
	    'jquery.ui.effect-drop': 'jquery-ui/ui/jquery.ui.effect-drop',
	    'jquery.ui.effect-explode': 'jquery-ui/ui/jquery.ui.effect-explode',
	    'jquery.ui.effect-fade': 'jquery-ui/ui/jquery.ui.effect-fade',
	    'jquery.ui.effect-fold': 'jquery-ui/ui/jquery.ui.effect-fold',
	    'jquery.ui.effect-highlight': 'jquery-ui/ui/jquery.ui.effect-highlight',
	    'jquery.ui.effect-pulsate': 'jquery-ui/ui/jquery.ui.effect-pulsate',
	    'jquery.ui.effect-scale': 'jquery-ui/ui/jquery.ui.effect-scale',
	    'jquery.ui.effect-shake': 'jquery-ui/ui/jquery.ui.effect-shake',
	    'jquery.ui.effect-slide': 'jquery-ui/ui/jquery.ui.effect-slide',
	    'jquery.ui.effect-transfer': 'jquery-ui/ui/jquery.ui.effect-transfer',
	    'jquery.ui.effect': 'jquery-ui/ui/jquery.ui.effect',
	    'jquery.ui.menu': 'jquery-ui/ui/jquery.ui.menu',
	    'jquery.ui.mouse': 'jquery-ui/ui/jquery.ui.mouse',
	    'jquery.ui.position': 'jquery-ui/ui/jquery.ui.position',
	    'jquery.ui.progressbar': 'jquery-ui/ui/jquery.ui.progressbar',
	    'jquery.ui.resizable': 'jquery-ui/ui/jquery.ui.resizable',
	    'jquery.ui.selectable': 'jquery-ui/ui/jquery.ui.selectable',
	    'jquery.ui.slider': 'jquery-ui/ui/jquery.ui.slider',
	    'jquery.ui.sortable': 'jquery-ui/ui/jquery.ui.sortable',
	    'jquery.ui.spinner': 'jquery-ui/ui/jquery.ui.spinner',
	    'jquery.ui.tabs': 'jquery-ui/ui/jquery.ui.tabs',
	    'jquery.ui.tooltip': 'jquery-ui/ui/jquery.ui.tooltip',
	    'jquery.ui.widget': 'jquery-ui/ui/jquery.ui.widget',
	
	    /* jQuery UI i18n */
	    'jquery.ui.i18n': 'jquery-ui/ui/i18n'
	}
	/*,
	shim : {
        'jquery.ui.accordion': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.autocomplete': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget',
                'jquery.ui.position',
                'jquery.ui.menu'
            ]
        },
        'jquery.ui.button': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.core': {
            deps: ['jquery']
        },
        'jquery.ui.datepicker': {
            deps: ['jquery.ui.core']
        },
        'jquery.ui.dialog': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget',
                'jquery.ui.button',
                'jquery.ui.draggable',
                'jquery.ui.mouse',
                'jquery.ui.position',
                'jquery.ui.resizable'
            ]
        },
        'jquery.ui.draggable': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.mouse',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.droppable': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.mouse',
                'jquery.ui.widget',
                'jquery.ui.draggable'
            ]
        },
        'jquery.ui.effect-blind': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-bounce': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-clip': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-drop': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-explode': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-fade': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-fold': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-highlight': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-pulsate': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-scale': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-shake': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-slide': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect-transfer': {
            deps: ['jquery.ui.effect']
        },
        'jquery.ui.effect': {
            deps: ['jquery']
        },
        'jquery.ui.menu': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget',
                'jquery.ui.position'
            ]
        },
        'jquery.ui.mouse': {
            deps: ['jquery.ui.widget']
        },
        'jquery.ui.position': {
            deps: ['jquery']
        },
        'jquery.ui.progressbar': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.resizable': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.mouse',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.selectable': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.mouse',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.slider': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.mouse',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.sortable': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.mouse',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.spinner': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget',
                'jquery.ui.button'
            ]
        },
        'jquery.ui.tabs': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget'
            ]
        },
        'jquery.ui.tooltip': {
            deps: [
                'jquery.ui.core',
                'jquery.ui.widget',
                'jquery.ui.position'
            ]
        },
        'jquery.ui.widget': {
            deps: ['jquery']
        },

        'jquery.ui.datepicker-en': {
            deps: ['jquery.ui.datepicker']
        }
    }*/
});
