module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
    	compass: {
    		dist: {
    			debugsass: true,
    			options: {
    				config: 'config.rb'
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

    	watch: {
    		compass: {
    			files: ['assets/src/css/{,*/}*.{scss,sass}'],
    			tasks: ['compass']
    		},

    		script: {
    			files: ['assets/src/js/**/*'],
    			tasks: ['copy:script','uglify:dist']
    		}
    	}
    });

    //register tasks

    //build
    grunt.registerTask('build', ['compass','copy:script','uglify']);

    //watch
    grunt.registerTask('w', ['watch']);
};