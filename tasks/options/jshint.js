module.exports = {
  options: {
    'jshintrc': '.jshintrc'
  },
  output: {
    src: ['lib/<%= pkg.name %>/**/*.js', 'lib/<%= pkg.name %>.js']
  }
};
