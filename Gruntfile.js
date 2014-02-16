module.exports = function(grunt) {

  var config = require('load-grunt-config')(grunt, {
    configPath: 'tasks/options',
    init: false
  });

  grunt.loadTasks('tasks');

  this.registerTask('default', ['build']);

  // Build a new version of the library
  this.registerTask('build', 'Builds a distributable version of <%= cfg.name %>', [
    'clean',
    'transpile:amd',
    'concat:browser',
    'browser:distNoVersion',
    'concat:deps',
    'jshint',
    'uglify:browserNoVersion'
  ]);

  config.env = process.env;
  config.pkg = grunt.file.readJSON('package.json');

  // Load custom tasks from NPM
  grunt.loadNpmTasks('grunt-contrib-watch');

  // init the config
  grunt.initConfig(config);
};
