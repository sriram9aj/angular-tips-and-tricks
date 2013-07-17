'use strict';

var path = require('path');

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
      html2js: {
        options: {
          base: ".",
          module: "templates"
        },
        main: {
          src: "templates/*",
          dest: "templates.js"
        }
      }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-html2js');
    
    grunt.registerTask('default', ['html2js']);
};