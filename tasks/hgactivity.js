/*
 * grunt-hgactivity
 * https://github.com/paazmaya/grunt-hgactivity
 *
 * Copyright (c) 2013 Juga Paazmaya <olavic@gmail.com>
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('hgactivity', 'Repository activity', function() {
    var path = require('path');
    
    // Default options which will be extended with user defined
    var options = this.options({
      split: 'none', // 'none', 'authors', 'files', 'branches', 'directories',
      filenamePrefix: 'activity-',
      width: 800,
      height: 600,
      datemin: '', // yyyy-mm-dd, if left empty, will use all available time
      datemax: '', // yyyy-mm-dd
      interval: '1w', // int followed by: m = months, w = weeks, d = days, h = hours
      uselines: true,
      showtags: false,
      imagetitle: '', // prefix which will be followed by the split if not none and time span
      cwindow: 2
    });
    

    // Command line arguments for 'hg activity'
    var args = [];
    
    // Options that can be used as such and prepended with --
    ['split', 'width', 'height', 'height', 'cwindow'].forEach(function (key) {
      if (options.hasOwnProperty(key)) {
        args.push('--' + key);
        args.push(options[key]);
      }
    });
    
    // Boolean options
    ['uselines', 'showtags'].forEach(function (key) {
      if (options.hasOwnProperty(key) && options[key] === true) {
        args.push('--' + key);
      }
    });
    
    // Get the age of the repository for time span and interval building
    //grunt.util.spawn('hg');
    
    // Time span for each picture. This is the only option that triggers multiple image generation
    if (options.interval !== '') {
      var span = options.interval.substr(-1);
      console.log('span: ' + span);
      var counter = parseInt(options.interval);
      console.log('counter: ' + counter);
    }
    else {
      // Use possible dates as such and only for one picture
      ['datemin', 'datemax'].forEach(function (key) {
        if (options.hasOwnProperty(key) && options[key] !== '') {
          args.push('--' + key);
          args.push(options[key]);
        }
      });
    }
    
    args.push('--filename');
    args.push(filenamePrefix + (options.split !== 'none' ? options.split : '') + '.png');
    
    console.dir(args);
  });

};
