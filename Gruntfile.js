/**
 * grunt-hgactivity
 * https://github.com/paazmaya/grunt-hgactivity
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (http://paazmaya.fi)
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function gruntConf(grunt) {
  require('time-grunt')(grunt); // Must be first item

  grunt.initConfig({
    eslint: {
      options: {
        config: '.eslintrc',
        format: 'stylish'
      },
      target: ['Gruntfile.js', 'tasks/*.js']
    }
  });

  grunt.loadTasks('tasks');

  require('jit-grunt')(grunt);

  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['eslint']);
};
