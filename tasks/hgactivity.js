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
      interval: '1m', // int followed by: m = months, w = weeks, d = days, h = hours
      iterations: 10, // number of iterations the interval should be useds
      uselines: true,
      showtags: false,
      imagetitle: '', // prefix which will be followed by the split if not none and time span
      cwindow: 2
    });
    console.dir(options);

    // Command line arguments for 'hg activity'
    var args = ['activity'];
    
    // Options that can be used as such and prepended with --
    ['width', 'height', 'cwindow'].forEach(function (key) {
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
    
    var dates = [];
    
    // Time span for each picture. This is the only option that triggers multiple image generation
    if (options.interval !== '') {
      var span = options.interval.substr(-1);
      console.log('span: ' + span);
      var counter = parseInt(options.interval, 10);
      console.log('counter: ' + counter);
      
      // Start from today if date max is missing...
      if (options.datemax === '') {
        // Use today
        options.datemax = moment().format(dateFormat);
      }
      console.log('options.datemax: ' + options.datemax);
      
      var max = moment(options.datemax, dateFormat);
      var timeWord = 'months'; // default
      
      for (var i = 0; i < options.iterations; i++) {
        var before = max.subtract(timeWord, counter).format(dateFormat);
        dates.push(before);
      }
      console.log('dates: ' + dates.join(', '));
      
      //console.log('options.datemin: ' + options.datemin);
      
      // For now, require the min and max dates, thus this will work.
      //var min = moment(options.datemin, dateFormat);
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
    
    // Build the commands
    var commands = [];
    
    // The amount of split options defines the amount of outer loops.
    // Inner loop count depends of the time span and interval.
    options.split.forEach(function (split) {
      var filename = options.filenamePrefix + (split !== 'none' ? split + '-' : '');
     
      for (var i = 0; i < dates.length - 1; i++) {
        var hgArgs = args.concat('--filename', (filename + i + '.png'),
          '--datemin', dates[i], '--datemax', dates[i + 1]);
        commands.push(hgArgs);
      }
    });
    
    console.log('commands.length: ' + commands.length);
    
    var next = function () {
      if (commands.length > 0) {
        looper(commands.pop());
      }
      else {
        done();
      }
    };
    
    
    var looper = function (args) {
        
      console.log('hg ' + args.join(' '));
    
      var child = grunt.util.spawn({
        cmd: 'hg',
        args: args
      }, function (error, result, code) {
        console.dir(result);
        if (error) {
          throw error;
        }
        grunt.log.writeln(code + '' + result);
        if (code !== 0) {
          return grunt.warn(String(code));
        }
        next();
      });
    };
    
    // Start looping.
    next();
  });

};
