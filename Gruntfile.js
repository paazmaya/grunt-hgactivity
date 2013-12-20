'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    eslint: {
      options: {
        config: 'eslint.json'
      },
      target: [ 'Gruntfile.js', 'tasks/*.js' ]
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask( 'default', [ 'test' ] );
  grunt.registerTask( 'test', [ 'eslint' ] );
};
