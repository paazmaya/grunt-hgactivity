# grunt-hgactivity

Provides a Grunt task that runs the command 'hg activity' with the given options.
This task can be configured to split the activity graphic based on the given time span.

The project that this task is used, should use Mercurial as its version control system and the current user
should have [the Activity Extension](http://mercurial.selenic.com/wiki/ActivityExtension) installed.


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
  "grunt-hgactivity": "~0.1.0"
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
    }
  }

  ...
```

To run it:

```js
grunt hgactivity
```

## Dependencies

 * Mercurial version control system
 * Activity extension for Mercurial

  
## Changelog

 * 2013-07-15    v0.1.0    Initial release


## License
Copyright (c) 2013 Juga Paazmaya <olavic@gmail.com>

Licensed under the MIT license.
