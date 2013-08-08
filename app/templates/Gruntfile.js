'use strict';

var path = require('path');

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
    	compass: {
    		dist: {
    			debugsass: true,
                debugInfo: true,
    			options: {
                    sassDir: 'assets/src/css',
                    cssDir: 'assets/build/css',
                    imagesDir: 'assets/build/img',
                    relativeAssets: true,
                    lineComments: false,
                    outputStyle: 'compressed'
    			}
    		}
    	},

	    uglify: {
	        options: {
	            report: 'gzip',
	            preserveComments: false,
	            beautify: false
	        },
	        dist: {
		        files : [
					{
			            expand: true,
			            cwd: 'assets/src/js/',
			            src: ['**/*.js'], 
			            dest: 'assets/build/js/',   
			            ext: '.js'
					}
		        ]
	        }
	    },

	    copy: {
	    	script: {
	    		expand: true,
	    		cwd: 'assets/src/js',
	    		src: '**/*',
	    		dest: 'assets/build/js'
	    	}
	    },

        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            
            server: {
                options: {
                    keepalive: true
                }
            },

            livereload: {
                options:{
                    middleware: function(connect, options){
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, options.base)
                        ];
                    }
                }
            }
        },

        open: {
            server: {
                path: 'http://localhost:<%%= connect.options.port %>'
            }
        },

        concurrent: {
            server: [
                'compass'
            ]
        },
        <% if (jshint) { %>
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            ignore_warning: {
                options: {
                    '-W099': true,
                    '-W041': true
                },
                src: ['assets/src/js/app/**/*.js']
            }
        },
        <% } %><% if (jslint) { %>
        jslint: { // configure the task
            files: [ // some example files
                'assets/src/js/app/**/*.js'
            ],
            /*exclude: [
                'SRC',
            ],*/
            directives: { // example directives
            browser: true,
            devel: true,
            passfail: false, 
            ass: true, 
            bitwise: true, 
            closure: true, 
            continue: true, 
            debug: true, 
            eqeq: true, 
            es5: true, 
            evil: true, 
            forin: true, 
            newcap: true, 
            nomen: true, 
            plusplus: true, 
            regexp: true, 
            unparam: true, 
            sloppy: true, 
            stupid: true, 
            sub: true, 
            todo: true, 
            vars: true, 
            white: true,
            predef: [ // array of pre-defined globals
                '$', 'jQuery', 'Modernizr', 'ActiveXObject'
            ]
            },
            options: {
                errorsOnly: true, // only display errors
                failOnError: false, // defaults to true
                shebang: true // ignore shebang lines
            }
        },<% } %>

        clean: {
            server: '.tmp'
        },

    	watch: {
    		compass: {
    			files: ['assets/src/css/{,*/}*.{scss,sass}'],
    			tasks: ['compass:dist']
    		},

    		script: {
    			files: ['assets/src/js/**/*'],
    			tasks: [<% if (jshint) { %>'jshint',<% } %><% if (jslint) { %>'jslint',<% } %>'copy:script','uglify:dist']
    		},

            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '{,*/}*.{html,htm,php,vm}',
                    'assets/src/css/{,*/}*.{scss,sass}',
                    'assets/build/js/**/*',
                    'assets/build/css/{,*/}*.{css}',
                    'assets/build/img/{,*/}*',
                    'assets/build/fonts/{,*/}*'
                ],
                tasks: ['compass:dist']
            }
    	}
    });

    //register tasks

    //server
    grunt.registerTask('server', function (target) {
        if(target === "live" || target === "livereload"){        
            grunt.task.run([
                'clean:server',
                'concurrent:server',
                'connect:livereload',
                'open',
                'watch'
            ]);
        }else{
            grunt.task.run([
                'build',
                'clean:server',
                'concurrent:server',
                'open',
                'connect:server'
            ]);
        }
    });

    //build
    grunt.registerTask('build', [
        'compass',<% if (jshint) { %>
        'jshint',<% } %><% if (jslint) { %>
        'jslint',<% } %>
        'copy:script',
        'uglify'
    ]);
    grunt.registerTask('b', [
        'compass',<% if (jshint) { %>
        'jshint',<% } %><% if (jslint) { %>
        'jslint',<% } %>
        'copy:script',
        'uglify'
    ]);

    //watch
    grunt.registerTask('w', ['watch']);
};