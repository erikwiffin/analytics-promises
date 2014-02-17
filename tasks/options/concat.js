module.exports = {

  deps: {
    src: [
      'bower_components/rsvp/rsvp.js',
      'dist/<%= pkg.name %>.js'
    ],
    dest: 'dist/<%= pkg.name %>-dependencies.js'
  },

  browser: {
    src: [
      'vendor/loader.js',
      'tmp/<%= pkg.name %>/**/*.amd.js',
      'tmp/<%= pkg.name %>.amd.js'
    ],
    dest: 'tmp/<%= pkg.name %>.browser1.js',
    options: {
      banner: '/**\n' +
              '  @class <%= pkg.namespace %>\n' +
              '  @module <%= pkg.namespace %>\n' +
              '  */\n'
    }
  }
};
