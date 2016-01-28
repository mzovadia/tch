module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            release: {
                files: {
                    'public/js/app.min.js' : [
                        'public/js/vendor/*.js',
                        'public/js/app.js',
                        '!public/js/**/_*.js'
                    ]
                }
            }
        },
         
        cssmin: {
            release: {
                files: {
                    'public/assets/css/main.min.css': [
                        'public/assets/css/**/*.css',
                        '!public/assets/css/main.min.css',
                        '!public/assets/css/**/_*.css'
                    ]
                }
            }
        },

        less: {
            release: {
                files: {
                    'public/assets/css/main.css': 'public/assets/less/main.less'
                }
            }
        },

        watch: {
            less: {
                files: ['public/assets/less/**/*.less'],
                tasks: ['less']
            },

            docs: {
                files: ['docs/index.md'],
                tasks: ['markdown']
            }
        },

        markdown: {
            docs: {
                files: {
                    'docs/index.html': 'docs/index.md'
                },
                options: {
                    template: 'docs/template.jst'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-markdown');
    

    grunt.registerTask('compile', ['uglify', 'less', 'cssmin']);
    grunt.registerTask('dev', ['watch:less']);
    grunt.registerTask('docs', ['watch:docs']);
};