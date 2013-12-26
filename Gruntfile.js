/*global module*/

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                smarttabs: true
            },
            files: ['script.js', 'Gruntfile.js', 'src/**/*.js']
        },
        less: {
            build: {
                files: {
                    'app/css/style.css': 'app/css/style.less'
                }
            }
        },
        csslint: {
            build: {
                src: ['app/css/*.css']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['jshint', 'less:build', 'csslint']);
};

