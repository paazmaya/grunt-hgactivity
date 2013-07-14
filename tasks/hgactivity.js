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
    var moment = require('moment'),
      dateFormat = 'YYYY-MM-DD';
    
    var done = this.async();
    
    // Default options which will be extended with user defined
    var options = this.options({
      split: ['none'], // 'none', 'authors', 'files', 'branches', 'directories',
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
    var args = ['activity'];
    
    // Options that can be used as such and prepended with --
    ['width', 'height', 'height', 'cwindow'].forEach(function (key) {
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
    /* Save for later...
    grunt.util.spawn({
      cmd: 'hg',
      args: []
    }, function (error, result, code) {
    });
    */
    
    var loops =  1;
    
    // Time span for each picture. This is the only option that triggers multiple image generation
    if (options.interval !== '') {
      var span = options.interval.substr(-1);
      console.log('span: ' + span);
      var counter = parseInt(options.interval);
      console.log('counter: ' + counter);
      
      // For now, require the min and max dates, thus this will work.
      var max = moment(options.datemax, dateFormat);
      var min = moment(options.datemin, dateFormat);
      var timeWord = 'months'; // default
      loops = Math.ceil(min.diff(max, timeWord, true) / counter);
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
    
    console.dir(args);
    
    // The amount of split options defines the amount of outer loops.
    // Inner loop count depends of the time span and interval.
    options.split.forEach(function (split) {
      var filename = options.filenamePrefix + (split !== 'none' ? split : '');
     
      
      // Inner loop based on time span
      for (var i = 0; i < loops; i++) {
        var arguments = args.concat('--filename', filename + '-' + i + '.png');
      
        var child = grunt.util.spawn({
          cmd: 'hg',
          args: arguments
        }, function (error, result, code) {
          console.dir(result);
          if (error) {
            throw error;
          }
          grunt.log.writeln(code + '' + result);
          if (code !== 0) {
            return grunt.warn(String(code));
          }
        });
      }
    });
    
    
  });

};
