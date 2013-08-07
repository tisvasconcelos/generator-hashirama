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
    			tasks: ['copy:script','uglify:dist']
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
    grunt.registerTask('build', ['compass','copy:script','uglify']);
    grunt.registerTask('b', ['compass','copy:script','uglify']);

    //watch
    grunt.registerTask('w', ['watch:compass','watch:script']);
};