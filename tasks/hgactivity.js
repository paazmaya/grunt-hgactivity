/**
 * grunt-hgactivity
 * https://github.com/paazmaya/grunt-hgactivity
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license.
 */

'use strict';

const moment = require('moment');

// The format expected by 'hg activity'
const dateFormat = 'YYYY-MM-DD';

// moment.js keywords
const timeWords = {
  y: 'years',
  m: 'months', // default
  w: 'weeks',
  d: 'days'
};

module.exports = function hgactivity(grunt) {

  const hasOwnProperty = Object.prototype.hasOwnProperty;

  grunt.registerMultiTask('hgactivity', 'Repository activity', function register() {
    const args = ['activity']; // Command line arguments for 'hg activity'
    const dates = []; // Collection of dates used as delimiters of each time span, if interval used
    const commands = []; // List of commands that are finally called

    const done = this.async();

    // Default options which will be extended with user defined
    const options = this.options({
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

    // Options that can be used as such and prepended with --
    ['width', 'height', 'cwindow'].forEach(function asisEach(key) {
      if (hasOwnProperty.call(options, key)) {
        args.push('--' + key);
        args.push(options[key]);
      }
    });

    // Boolean options
    ['uselines', 'showtags'].forEach(function boolEach(key) {
      if (hasOwnProperty.call(options, key) && options[key] === true) {
        args.push('--' + key);
      }
    });

    // Time span for each picture. This is the only option that triggers multiple image generation
    const handleInterval = function handleInterval() {
      let span = options.interval.substr(-1);
      if (!hasOwnProperty.call(timeWords, span)) {
        span = 'm';
      }

      const counter = parseInt(options.interval, 10);

      // Start from today if date max is missing...
      if (options.datemax === '') {
        // Use today
        options.datemax = moment().format(dateFormat);
      }

      /*
      FIXME: Belongs somewhere else...
      if (options.datemin === '') {
        // Use 6 months ago
        options.datemin = moment().subtract(6, 'M').format(dateFormat);
      }
      */

      const max = moment(options.datemax, dateFormat);
      dates.push(options.datemax);
      for (let i = 0; i < options.iterations; i++) {
        const before = max.subtract(counter, timeWords[span]).format(dateFormat);
        dates.push(before);
      }
    };

    if (typeof options.interval === 'string' && options.interval !== '') {
      handleInterval();
    }
    else {
      // Use possible dates as such and only for one time span
      ['datemin', 'datemax'].forEach(function dateEach(key) {
        if (hasOwnProperty.call(options, key) && options[key] !== '') {
          args.push('--' + key);
          args.push(options[key]);
        }
      });
    }

    const splitEach = function splitEach(split) {
      const divider = split !== 'none' ?
        '_' + split :
        '';
      const filename = options.filenamePrefix + divider;
      const title = (options.imagetitle.length > 0 ?
        options.imagetitle :
        '') +
        (split !== 'none' ?
        split :
        '');

      // Need at least one pair of dates
      if (dates.length > 1) {
        for (let i = 0; i < dates.length - 1; i++) {
          const startDate = dates[i + 1]; // TODO: add a day to avoid overlapping
          const endDate = dates[i];
          commands.push(args.concat(
            '--split', split,
            '--datemin', startDate, '--datemax', endDate,
            '--filename', filename + '_' + startDate + '_' + endDate + '.png',
            '--imagetitle', '"' + title + ': ' + startDate + ' - ' + endDate + '"'
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
    };

    // The amount of split options defines the amount of outer loops.
    // Inner loop count depends of the time span and interval.
    options.split.forEach(splitEach);

    const looper = function looper(argus, next) {

      grunt.log.writeln('hg ' + argus.join(' '));

      grunt.util.spawn({
        cmd: 'hg',
        args: argus
      }, function handler(error, result, code) {
        if (error) {
          throw error;
        }
        grunt.log.writeln(result.stdout);
        grunt.log.writeln(result.stderr);
        grunt.log.writeln(code + ' - ' + result);
        if (code !== 0) {
          grunt.warn(String(code));
        }
        else {
          next.call(this);
        }
      });
    };

    const next = function next() {
      if (commands.length > 0) {
        looper(commands.pop(), next);
      }
      else {
        done();
      }
    };

    // Start looping.
    next();
  });

};
