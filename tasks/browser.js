module.exports = function(grunt) {
  grunt.registerMultiTask('browser', 'Export the object in <%= pkg.name %> to the window', function() {
    this.files.forEach(function(f) {
      var output = ['/*!'];
      output.push(' * <%= pkg.name %> <%= pkg.version %>');
      output.push(' * <%= pkg.homepage %>');
      output.push(' * ');
      output.push(" * @copyright <%= grunt.template.today('yyyyyy') %>, <%= pkg.author %>");
      output.push(' * @license <%= pkg.name %> may be freely distributed under the <%= pkg.license %> license.');
      output.push(' */');
      output.push('(function(global) {');

      output.push.apply(output, f.src.map(grunt.file.read));

      output.push("global.<%= pkg.namespace %> = require('<%= pkg.name %>');");
      output.push('}(window));');

      grunt.file.write(f.dest, grunt.template.process(output.join('\n')));
    });
  });
};
