/**
 * grunt-hgactivity
 * https://github.com/paazmaya/grunt-hgactivity
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function gruntConf(grunt) {
  require('time-grunt')(grunt); // Must be first item
  require('jit-grunt')(grunt);

  grunt.initConfig({});

  grunt.loadTasks('tasks');


  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', []);
};
