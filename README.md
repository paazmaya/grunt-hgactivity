# grunt-hgactivity

> Visualise activity in Mercurial repository

Provides a Grunt task that runs the command `hg activity` with the given options.
This task can be configured to split the activity graphic based on the given time span.

The project that this task is used, should use [Mercurial](http://mercurial.selenic.com/) as
its version control system and the current user should have
[the Activity Extension](http://mercurial.selenic.com/wiki/ActivityExtension) installed.

[![Build Status](https://semaphoreci.com/api/v1/paazmaya/grunt-hgactivity/branches/master/shields_badge.svg)](https://semaphoreci.com/paazmaya/grunt-hgactivity)
[![Dependency Status](https://img.shields.io/gemnasium/paazmaya/grunt-hgactivity.svg?style=flat-square)](https://gemnasium.com/paazmaya/grunt-hgactivity)
[![Code Climate](https://img.shields.io/codeclimate/github/paazmaya/grunt-hgactivity.svg?style=flat-square)](https://codeclimate.com/github/paazmaya/grunt-hgactivity)
[![Built with Grunt](http://img.shields.io/badge/Grunt-1.0-blue.svg?style=flat-square)](http://gruntjs.com/)
[![Analytics](https://ga-beacon.appspot.com/UA-2643697-15/grunt-hgactivity/index?flat)](https://github.com/igrigorik/ga-beacon)

## Getting Started

This plugin requires [Grunt](http://gruntjs.com/) `~1.0` and [Node.js](https://nodejs.org/en/)
version to be minimum of `6.9.5`, which is the Long Term Support (LTS) version, and
[Mercurial](http://mercurial.selenic.com/) with
[`activity` extension](http://mercurial.selenic.com/wiki/ActivityExtension) to be installed.

Add this to your project's `Gruntfile.js` configuration:

```js
grunt.loadNpmTasks('grunt-hgactivity');
```

Then add `grunt-hgactivity` to your "package.json" dependencies. This can be done with:

```js
npm install grunt-hgactivity --save-dev
```

Or by manually editing the "package.json" by adding the following line inside `devDependencies` object:

```js
  "grunt-hgactivity": "^0.3.0"
```

Later on it would be possible to install the plugin with the command `npm install`

It can be updated with the command `npm update`, in case there is a newer version in the NPM repository.

The name to use in your own task definitions is `hgactivity`.


## Documentation

Add an entry to your "Gruntfile.js", within the `initConfig` object.
Current values shown are the defaults.

```js
  ...

  hgactivity: {
    main: {
      options: {
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
      }
    }
  }

  ...
```

To run it:

```js
grunt hgactivity
```

### Multiple targets

It can be configured to have multiple targets, for example like this:

```js
hgactivity: {
  quartal: {
    options: {
      split: ['none', 'files', 'directories'],
      filenamePrefix: 'quartal',
      width: 1200,
      height: 800,
      imagetitle: 'Quartal ',
      interval: '3m',
      iterations: 20,
      datemax: '2013-06-31'
    }
  },
  yearly: {
    options: {
      split: ['authors'],
      filenamePrefix: 'yearly',
      width: 1200,
      height: 800,
      imagetitle: 'Yearly ',
      interval: '1y',
      iterations: 12,
      datemax: '2013-12-31'
    }
  },
  all: {
    options: {
      split: ['none'],
      filenamePrefix: 'all',
      width: 1600,
      height: 1400,
      imagetitle: 'All time',
      interval: null,
      uselines: false,
      showtags: true
    }
  }
}
```

Now to run a specific task, the following command can be used:

```js
grunt hgactivity:yearly
```

## Dependencies

 * [Mercurial version control system](http://mercurial.selenic.com/)
 * [Activity extension for Mercurial](http://mercurial.selenic.com/wiki/ActivityExtension)
 * [moment for internal date handling](http://momentjs.com/)

### Activity Mercurial plugin troubleshooting for Windows

Easiest way to fullfill the dependencies for the
[Hg Activity Plugin](http://labs.freehackers.org/projects/hgactivity/wiki), is to
install the [Scipy-stack](http://www.lfd.uci.edu/~gohlke/pythonlibs/#scipy-stack "Scipy-stack (experimental) is a meta package that contains numpy-MKL, scipy, matplotlib, ipython, pandas, sympy, nose and many of their dependencies (dateutil, setuptools, gmpy, Pillow, pygments, pyreadline, pytz, statsmodels, tornado").

It might also be needed to manually edit the plugin code in order for it to find its requirements.
Open the `activity/__init__.py` file and add the following lines on the top:

```python
import sys
sys.path.append(r'C:\\Python27\\Lib\\site-packages')
sys.path.append(r'C:\\Python27\\Lib')
```

## Version history

* `v0.3.0` (2017-07)
  - Minimum Node.js version lifted from `4.2.0` to `6.9.5`
* `v0.2.0` (2016-08-11)
  - Grunt.js `v1.0.0` and onward
  - Dependencies are sure :tophat: up to date
  - Use shared ESLint configuration and use ESLint directly without the Grunt.js plugin
* `v0.1.6` (2016-02-15)
  - Dependency updates
  - Gotta have at least Node.js versions `4.2.0` (LTS)
* `v0.1.5` (2015-01-06)
  - Dependencies updated and Moment API changes
* `v0.1.4` (2014-08-23)
  - Dependencies updated
* `v0.1.3` (2013-12-20)
  - Grunt migrated to 0.4.2 (which was trivial as changing version number)
  - ESLint instead of JSHint
* `v0.1.2` (2013-07-24)
  - Failed to update version numbers in previous tagged release
* `v0.1.1` (2013-07-24)
  - Removed 'hours' time span option
* `v0.1.0` (2013-07-23)
  - Initial release

## Contributing

["A Beginner's Guide to Open Source: The Best Advice for Making your First Contribution"](http://hf.heidilabs.com/blog/a-beginners-guide-to-open-source-making-your-first-contribution).

[Also there is a blog post about "45 Github Issues Dos and Don’ts"](https://davidwalsh.name/45-github-issues-dos-donts).

Linting is done with [ESLint](http://eslint.org) and can be executed with `npm run lint`.
There should be no errors appearing after any JavaScript file changes.

## License

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>

Licensed under the [MIT license](LICENSE).
