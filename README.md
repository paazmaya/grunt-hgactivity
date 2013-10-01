# grunt-hgactivity

Provides a Grunt task that runs the command 'hg activity' with the given options.
This task can be configured to split the activity graphic based on the given time span.

The project that this task is used, should use [Mercurial](http://mercurial.selenic.com/) as 
its version control system and the current user should have
[the Activity Extension](http://mercurial.selenic.com/wiki/ActivityExtension) installed.

[![Dependency Status](https://gemnasium.com/paazmaya/grunt-hgactivity.png)](https://gemnasium.com/paazmaya/grunt-hgactivity)

## Getting Started

Add this to your project's `Gruntfile.js` gruntfile:
```js
grunt.loadNpmTasks('grunt-hgactivity');
```

Then add "grunt-hgactivity" to your package.json dependencies. This can be done with:
```js
npm install grunt-hgactivity --save-dev
```
Or by manually editing the "package.json" by adding the following line inside `devDependencies` object:
```js
  "grunt-hgactivity": "~0.1.2"
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
        datemin: '', // yyyy-mm-dd, if left empty, will use all available time
        datemax: '', // yyyy-mm-dd
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

  
## Changelog

 * 2013-07-24   v0.1.2    Failed to update version numbers in previous tagged release
 * 2013-07-24   v0.1.1    Removed 'hours' time span option
 * 2013-07-23   v0.1.0    Initial release


## License

Copyright (c) 2013 Juga Paazmaya <olavic@gmail.com>

Licensed under the MIT license.
