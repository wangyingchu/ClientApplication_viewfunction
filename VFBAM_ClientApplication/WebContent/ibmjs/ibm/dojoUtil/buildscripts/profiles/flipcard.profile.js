var profile = {
	basePath: "../../../",
	releaseDir: "../pluggable_ui",
	
	resourceTags: {
		copyOnly: function(filename, mid){
			return true;
		}
	},
	
	trees:[
		["../ibmjs/idx/layout/tests/resources", "./idx/layout/tests/resources", /(\/\.)|(~$)/],
		//["../ibmjs/idx/layout/nls", "./idx/layout/nls", /(?!.*FlipCard|.*CardContainer)^.*$/],
		["../ibmjs/idx/layout/nls", "./idx/layout/nls"],
		["../ibmjs/idx/layout/templates", "./idx/layout/templates", /(?!.*FlipCard|.*GridContainer|.*NavigationPane)^.*$/],
		["../ibmjs/idx/layout/tests", "./idx/layout/tests", /(?!.*test_FlipCard|.*FlipCard|.*flipcard)^.*$/],
		//["../ibmjs/idx/layout", "./idx/layout", /(?!.*FlipCard|.*CardContainer)^.*$/],
		["../ibmjs/idx/layout", "./idx/layout", /(\/\.)|(~$)/],
		["../ibmjs/idx/themes/oneui/idx/layout/images", "./idx/themes/oneui/idx/layout/images", /(\/\.)|(~$)/],
		["../ibmjs/idx/themes/oneui/idx/layout", "./idx/themes/oneui/idx/layout", /(?!.*FlipCard|.*CardContainer|layout.css)^.*$/],
		//["../ibmjs/idx/themes/oneui/idx/layout", "./idx/themes/oneui/idx/layout"],
		["../ibmjs/idx/themes/oneuidark/idx/layout/images", "./idx/themes/oneuidark/idx/layout/images", /(\/\.)|(~$)/],
        ["../ibmjs/idx/themes/oneuidark/idx/layout", "./idx/themes/oneuidark/idx/layout", /(?!.*FlipCard|.*CardContainer|layout.css)^.*$/]
 	]
 	
};


