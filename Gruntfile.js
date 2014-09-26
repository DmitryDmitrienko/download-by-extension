module.exports = function(grunt){
  grunt.initConfig({
    coffee: {
      options:{
        bare: false
      },
      scripts: {
        expand: true,
        flatten: true,
        cwd: 'coffee',
        src: ['*.coffee'],
        dest: 'js/',
        ext: '.js'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['coffee/*.coffee'],
        tasks: ['process']
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '/* Created by Codeant 2014 */'
        },
        files: {
          'js/extension.min.js': ['js/extension.js'],
          'js/options.min.js': ['js/options.js'],
          'js/popup.min.js': ['js/popup.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('process', ['newer:coffee', 'uglify']);
  grunt.registerTask('default', ['coffee', 'uglify', 'watch']);
};