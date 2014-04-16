/**
 * grunt-hgactivity
 * https://github.com/paazmaya/grunt-hgactivity
 *
 * Copyright (c) Juga Paazmaya <olavic@gmail.com>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    eslint: {
      options: {
        config: 'eslint.json',
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
