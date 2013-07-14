"use strict";

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: [ "Gruntfile.js", "tasks/*.js" ],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    watch: {
      files: "<%= jshint.files %>",
      tasks: "default"
    }
  });

  grunt.loadTasks("tasks");

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask( "default", [ "jshint" ] );
};
