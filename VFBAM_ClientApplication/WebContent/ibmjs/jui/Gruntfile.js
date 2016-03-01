"use strict";

module.exports = function (grunt) {

	// A temporary directory used by amdserialize to output the processed modules.
	var tmpdir = "./tmp/";

	// The final output directory.
	var outdir = "./out/";

	// The grunt.config property populated by amdserialize, containing the
	// list of files to include in the layer.
	var outprop = "amdoutput";
	
	var allI18nFiles = expandFiles( "i18n/*.js" );
	// var jquery_ui = expandFiles('jquery-ui/ui/jquery-ui.js')
	// console.log(allI18nFiles);

// console.log(grunt.file.expandMapping( "jquery-ui/ui/i18n/*.js"  ));
	function expandFiles( files ) {
		return grunt.util._.pluck( grunt.file.expandMapping( files ), "src" ).map(function( values ) {
			return values[ 0 ];
		});
	}

	// console.log(allI18nFiles);
	
	grunt.initConfig({
		build: {
			all: {
				dest: "release/ui/jquery-ui-a11y.js",
				minimum: [
					// 'core',	
					// "selector"
					// "hello",
					// "selector"
				],
				// Exclude specified modules if the module matching the key is removed
				removeWith: {
					ajax: [ "manipulation/_evalUrl", "event/ajax" ],
					callbacks: [ "deferred" ],
					css: [ "effects", "dimensions", "offset" ],
					sizzle: [ "css/hiddenVisibleSelectors", "effects/animatedSelector" ]
				}
			}
		},
		
		concat: {
			//i18n for dialog
			i18n: {
				options: {
					//banner: createBanner( allI18nFiles )
				},
				src: allI18nFiles,
				dest: "release/ui/i18n/jquery.ui.dialog.js"
			},
			
			//i18n for datepicker
			jquery_i18n: {
				options: {
				},
				src: ['jquery-ui/ui/i18n/jquery-ui-i18n.js'],
				dest: "release/ui/i18n/jquery.ui.datepicker.js"
			},
			
			//concat jquery_ui to jui
			jquery_ui: {
				options: {
				},
				src: ['jquery-ui/ui/jquery-ui.js'],
				dest: "release/ui/jquery-ui.js"
			}
		},
		
		uglify: {
			main: {
				files: {
					"release/ui/jquery-ui-a11y.min.js": [ "release/ui/jquery-ui-a11y.js" ]
				},
				options: {
					preserveComments: false,
					sourceMap: false,
					sourceMapName: "dist/jquery-ui-a11y.min.map",
					report: "min",
					beautify: {
						"ascii_only": true
					},
					// banner: "/*! jQuery v<%= pkg.version %> | " +
					// 	"(c) 2005, <%= grunt.template.today('yyyy') %> jQuery Foundation, Inc. | " +
					// 	"jquery.org/license */",
					compress: {
						"hoist_funs": false,
						loops: false,
						unused: false
					}
				}
			},
			
			i18n: {
				files: {
					"release/ui/i18n/jquery.ui.dialog.min.js": ['release/ui/i18n/jquery.ui.dialog.js'],
					"release/ui/i18n/jquery.ui.datepicker.min.js": ['release/ui/i18n/jquery.ui.datepicker.js']
				},
				options:{
				}
			},
			
			jquery_ui: {
				files: {
					"release/ui/jquery-ui.min.js": ['release/ui/jquery-ui.js']
				},
				options:{
				}
			}
		},
		// The loader config should go here.
		amdloader: {
			// Here goes the config for the amd plugins build process.
			config: {
				// baseUrl: "/",
				// paths: {
				//     "hello": "hello"
				// },
				// text should be replace by the module id of text plugin
				text: {
					inlineText: true
				},
				// i18n should be replace by the module id of i18n plugin
				i18n: {
					localesList: ["fr"]
				}
			}
		},

		// Copy the plugin files to the real output directory.
		copy: {
			image: {
				expand: true,
				cwd: 'themes/less/',
				src: [
					'images/*',
					'dthink.css',
					'dthink-a11y.css',
					'dthink-rtl.css',
					'dthink.less',
					'blue-theme.less'
				],
				// flatten: true,
				dest: 'release/themes/dthink'
			},
		},
		// The common build config
		amdbuild: {
			// dir is the output directory.
			dir: tmpdir,

			// List of plugins that the build should not try to resolve at build time.
			runtimePlugins: [],

			// List of layers to build.
			layers: [{
				name: "layerName",
				include: [
					'hello'
					// Modules and layers listed here, and their dependencies, will be added to the layer.
				],
				includeShallow: [
					// Only the modules listed here (ie. NOT their dependencies) will be added to the layer.
				],
				exclude: [
					// Modules and layers listed here, and their dependencies, will NOT be in the layer.
				],
				excludeShallow: [
					// Only the modules listed here (ie. NOT their dependencies)  will NOT be in the layer.
				]
			}]
		},

		// Config to allow concat to generate the layer.
		// concat: {
			// options: {
				// // banner: "<%= " + outprop + ".header%>"
			// },
			// dist: {
				// src: "<%= " + outprop + ".modules.abs %>",
				// dest: outdir + "<%= " + outprop + ".layerPath %>"
				// // src: ['hello.js', 'hello1.js'],
				// // dest: outdir + "build.js"
			// }
		// },


		// Erase temp directory and previous build
		clean: {
			erase: [outdir],
			finish: [tmpdir]
		}
	});


	// The main build task.
	grunt.registerTask("amdbuild", function (amdloader) {
		var name = this.name,
			layers = grunt.config(name).layers;

		layers.forEach(function (layer) {
			grunt.task.run("amddepsscan:" + layer.name + ":" + name + ":" + amdloader);
			grunt.task.run("amdserialize:" + layer.name + ":" + name + ":" + outprop);
			grunt.task.run("concat");
			grunt.task.run("copy");
		});
	});


	// Load the plugin that provides the "amd" task.
	require( "load-grunt-tasks" )( grunt );

	grunt.loadNpmTasks("grunt-amd-build");
	grunt.loadTasks( "build/task" );

	// Load vendor plugins.
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask( "js", [
		"build:*:*", 
		"concat:jquery_ui", 
		"concat:i18n", 
		"concat:jquery_i18n"
	]);
	grunt.registerTask( "css", ["copy"] );

	// Default task.
	grunt.registerTask("default", ["js", "css", "uglify"]);
};