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
      interval: '3m', // int followed by: y = years, m = months, w = weeks, d = days, h = hours
      iterations: 4, // number of iterations the interval should be useds
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

    var dates = [];
    
    // moment.js keywords
    var timeWords = {
      y: 'years',
      m: 'months', // default
      w: 'weeks',
      d: 'days',
      h: 'hours'
    };

    // Time span for each picture. This is the only option that triggers multiple image generation
    if (options.interval !== '') {
      var span = options.interval.substr(-1);
      console.log('span: ' + span);
      if (!timeWords.hasOwnProperty(span)) {
        span = 'm';
      }

      var counter = parseInt(options.interval, 10);
      console.log('counter: ' + counter);

      // Start from today if date max is missing...
      if (options.datemax === '') {
        // Use today
        options.datemax = moment().format(dateFormat);
      }
      
      // How about datemin?

      var max = moment(options.datemax, dateFormat);
      dates.push(options.datemax);
      for (var i = 0; i < options.iterations; i++) {
        var before = max.subtract(timeWords[span], counter).format(dateFormat);
        dates.push(before);
      }
    }
    else {
      // Use possible dates as such and only for one time span
      ['datemin', 'datemax'].forEach(function (key) {
        if (options.hasOwnProperty(key) && options[key] !== '') {
          args.push('--' + key);
          args.push(options[key]);
        }
      });
    }

    // Build the commands
    var commands = [];

    // The amount of split options defines the amount of outer loops.
    // Inner loop count depends of the time span and interval.
    options.split.forEach(function (split) {
      var filename = options.filenamePrefix + (split !== 'none' ? split + '-' : '');

      for (var i = 0; i < dates.length - 1; i++) {
        var hgArgs = args.concat(
          '--datemin', dates[i + 1], '--datemax', dates[i],
          '--filename', (filename + i + '.png')
        );
        commands.push(hgArgs);
      }
    });

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
        if (error) {
          //throw error;
        }
        grunt.log.writeln(result.stdout);
        grunt.log.writeln(result.stderr);
        grunt.log.writeln(code + ' - ' + result);
        if (code !== 0) {
          //return grunt.warn(String(code));
        }
        next();
      });
    };

    // Start looping.
    next();
  });

};
