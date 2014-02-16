module.exports = {
  amd: {
    src: [
      'tmp/<%= pkg.name %>/**/*.amd.js',
      'tmp/<%= pkg.name %>.amd.js',
    ],
    dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.amd.js',
    options: {
      banner: '/**\n' +
              '  @class <%= pkg.namespace %>\n' +
              '  @module <%= pkg.namespace %>\n' +
              '  */\n'
    }
  },

  amdNoVersion: {
    src: [
      'tmp/<%= pkg.name %>/**/*.amd.js',
      'tmp/<%= pkg.name %>.amd.js',
    ],
    dest: 'dist/<%= pkg.name %>.amd.js',
    options: {
      banner: '/**\n' +
              '  @class <%= pkg.namespace %>\n' +
              '  @module <%= pkg.namespace %>\n' +
              '  */\n'
    }
  },

  deps: {
    src: ['vendor/deps/*.js'],
    dest: 'tmp/deps.amd.js'
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
