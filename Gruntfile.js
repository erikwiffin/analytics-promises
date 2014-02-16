module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      target: {
        rjsConfig: 'lib/rjs.js'
      }
    },
    requirejs: {
      compile: {
        options: {
          name: '<%= pkg.name %>',
          mainConfigFile: 'lib/rjs.js',
          out: 'build/<%= pkg.name %>.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-bower-requirejs');

  grunt.registerTask('default', ['bower', 'requirejs']);
};
