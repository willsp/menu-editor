/* global require, module */
/* jshint camelcase: false */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                smarttabs: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            app: {
                src: 'app/js/{,*/}*.js'
            }
        },
        less: {
            build: {
                src: 'app/css/style.less',
                dest: 'app/css/style.css'
            }
        },
        csslint: {
            build: {
                src: ['app/css/*.css']
            }
        },
        connect: {
            options: {
                port: 9000
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'app/')
                        ];
                    }
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            less: {
                files: '<%= less.build.src %>',
                tasks: ['less']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/css/{,*/}*.css',
                    'app/js/{,*/}*.js',
                    'app/libs/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        open: {
            build: {
                path: 'http://localhost:9000'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['jshint', 'less:build', 'csslint']);
    grunt.registerTask('serve', ['default', 'connect', 'open', 'watch']);
};

