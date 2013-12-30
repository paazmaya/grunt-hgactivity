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
    var moment = require('moment');
    var dateFormat = 'YYYY-MM-DD'; // The format expected by 'hg activity'
    var args = ['activity']; // Command line arguments for 'hg activity'
    var dates = []; // Collection of dates used as delimiters of each time span, if interval used
    var commands = []; // List of commands that are finally called

    var done = this.async();

    // Default options which will be extended with user defined
    var options = this.options({
      split: ['none'], // 'none', 'authors', 'files', 'branches', 'directories',
      filenamePrefix: 'activity',
      width: 800,
      height: 600,
      datemin: '', // yyyy-mm-dd, if left empty, will use 6 months ago
      datemax: '', // yyyy-mm-dd, if empty will use today
      interval: '3m', // int followed by: y = years, m = months, w = weeks, d = days
      iterations: 4, // number of iterations the interval should be useds
      uselines: true,
      showtags: false,
      imagetitle: '', // prefix which will be followed by the split if not none and time span
      cwindow: 2
    });

    // moment.js keywords
    var timeWords = {
      y: 'years',
      m: 'months', // default
      w: 'weeks',
      d: 'days'
    };

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

    // Time span for each picture. This is the only option that triggers multiple image generation
    if (typeof options.interval === 'string' && options.interval !== '') {
    
      var span = options.interval.substr(-1);
      if (!timeWords.hasOwnProperty(span)) {
        span = 'm';
      }

      var counter = parseInt(options.interval, 10);

      // Start from today if date max is missing...
      if (options.datemax === '') {
        // Use today
        options.datemax = moment().format(dateFormat);
      }

      /*
      FIXME: Belongs somewhere else...
      if (options.datemin === '') {
        // Use 6 months ago
        options.datemin = moment().subtract('M', 6).format(dateFormat);
      }
      */

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
    
    //console.log('Options after processing:');
    //console.dir(options);

    // The amount of split options defines the amount of outer loops.
    // Inner loop count depends of the time span and interval.
    options.split.forEach(function (split) {
      var filename = options.filenamePrefix + (split !== 'none' ? '_' + split : '');
      var title = (options.imagetitle.length > 0 ? options.imagetitle : '') + 
        (split !== 'none' ? split : '');

      // Need at least one pair of dates
      if (dates.length > 1) {
        for (var i = 0; i < dates.length - 1; i++) {
          var startDate = dates[i + 1]; // TODO: add a day to avoid overlapping
          var endDate = dates[i];
          commands.push(args.concat(
            '--split', split,
            '--datemin', startDate, '--datemax', endDate,
            '--filename', (filename + '_' + startDate + '_' + endDate + '.png'),
            '--imagetitle', ('"' + title + ': ' + startDate + ' - ' + endDate + '"')
          ));
        }
      }
      else {
        // Assume that there is no intervals needed, thus one per split.
        commands.push(args.concat(
          '--split', split,
          '--filename', filename + '.png',
          '--imagetitle', '"' + title + '"'
        ));
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

      grunt.log.writeln('hg ' + args.join(' '));

      grunt.util.spawn({
        cmd: 'hg',
        args: args
      }, function (error, result, code) {
        if (error) {
          throw error;
        }
        grunt.log.writeln(result.stdout);
        grunt.log.writeln(result.stderr);
        grunt.log.writeln(code + ' - ' + result);
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
