'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    require('grunt-html2js')(grunt);
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-shell-spawn');

    // configurable paths
    var qingConfig = {
        demo: 'demo',
        app: 'src',
        dist: 'dist'
    };

    grunt.initConfig({
        qing: qingConfig,
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            less: {
                files: ['<%= qing.app %>/**/*.less', '<%= qing.app %>/less/**/*.*'],
                tasks: ['build', 'livereload']
            },
            js: {
                files: [
                    '<%= qing.app %>/**/*.html',
                    '<%= qing.app %>/**/*.js'
                ],
                tasks: ['build', 'livereload']
            },
            demo: {
                files: ['<%= qing.demo %>/public/less/*.less'],
                tasks: ['less:demo', 'livereload']
            }
        },
        open: {
            server: {
                url: 'http://localhost:3000?design'
            }
        },
        clean: {
            all: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= qing.dist %>/*',
                            '!<%= qing.dist %>/.git*',
                            '<%= qing.demo %>/public/css/qing/',
                            '<%= qing.demo %>/public/scripts/qing/'
                        ]
                    }
                ]
            },
            jstemplate: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= qing.dist %>/js/**.template.js'
                        ]
                    }
                ]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '<%= qing.app %>/**/*.js'
            ]
        },
        html2js: {
            options: {
                module: "qing.template",
                base: "<%= qing.app %>"
            },
            product: {
                src: ['<%= qing.app %>/common/**/*.html', '<%= qing.app %>/product/**/*.html'],
                dest: '<%= qing.dist%>/js/qing.product.template.js'
            },
            design: {
                src: ['<%= qing.app %>/common/**/*.html', '<%= qing.app %>/design/**/*.html'],
                dest: '<%= qing.dist%>/js/qing.design.template.js'
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
                process: function (src, filepath) {
                    return  src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            lessProduct: {
                options: {
                    banner: "",
                    process: function (src, filepath) {
                        return src;
                    }
                },
                src: ['<%= qing.app %>/product/less/main.less',
                    '<%= qing.app %>/common/less/variables.less',
                    '<%= qing.app %>/product/less/variables.less',
                    '<%= qing.app %>/common/directives/**/*.less',
                    '<%= qing.app %>/product/directives/**/*.less'
                ],
                dest: '<%= qing.dist %>/less/qing-product.less'
            },
            lessDesign: {
                options: {
                    banner: "",
                    process: function (src, filepath) {
                        return src;
                    }
                },
                src: ['<%= qing.app %>/design/less/main.less',
                    '<%= qing.app %>/common/less/variables.less',
                    '<%= qing.app %>/design/less/variables.less',
                    '<%= qing.app %>/common/directives/**/*.less',
                    '<%= qing.app %>/design/directives/**/*.less'
                ],
                dest: '<%= qing.dist %>/less/qing-design.less'
            },
            product: {
                src: ['<%= qing.app %>/product/qing.js',
                    '<%= qing.app %>/common/**/*.js',
                    '<%= qing.app %>/product/**/*.js',
                    '<%= qing.dist %>/js/qing.product.template.js'],
                dest: '<%= qing.dist %>/js/qing.product.tpl.js'
            },
            design: {
                src: ['<%= qing.app %>/design/qing.js',
                    '<%= qing.app %>/common/**/*.js',
                    '<%= qing.app %>/design/**/*.js',
                    '<%= qing.dist %>/js/qing.design.template.js'],
                dest: '<%= qing.dist %>/js/qing.design.tpl.js'
            }
        },

        copy: {
            less: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= qing.app %>/',
                        dest: '<%= qing.dist %>',
                        src: [
                            'less/**'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= qing.app %>/less/',
                        dest: '<%= qing.dist %>/css',
                        src: [
                            'fonts/**'
                        ]
                    }
                ]
            },
            demo: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= qing.dist %>/css',
                        dest: '<%= qing.demo %>/public/css/qing',
                        src: [
                            '**'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= qing.dist %>/js/',
                        dest: '<%= qing.demo %>/public/scripts/qing',
                        src: [
                            '**'
                        ]
                    }
                ]
            }
        },
        less: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= qing.dist %>/less/',
                        src: ['qing-design.less'],
                        dest: '<%= qing.dist %>/css/',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: '<%= qing.dist %>/less/',
                        src: ['qing-product.less'],
                        dest: '<%= qing.dist %>/css/',
                        ext: '.css'
                    }
                ]
            },
            demo: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= qing.demo %>/public/less/',
                        src: ['demo.less'],
                        dest: '<%= qing.demo %>/public/css/',
                        ext: '.css'
                    }
                ]
            }
        },
        karma: {
            options: {
                runnerPort: 9999,
                browsers: ['PhantomJS'],
                singleRun: true,
                reporters: 'dots',
                autoWatch: false
            },
            product: {
                configFile: 'test/config/karma.conf.product.js'
            },
            common: {
                configFile: 'test/config/karma.conf.common.js'
            },
            design: {
                configFile: 'test/config/karma.conf.design.js'
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= qing.dist %>/js',
                        src: '*.js',
                        dest: '<%= qing.dist %>/js'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= qing.dist %>/js/qing.design.min.js': [
                        '<%= qing.dist %>/js/qing.design.js'
                    ],
                    '<%= qing.dist %>/js/qing.product.min.js': [
                        '<%= qing.dist %>/js/qing.product.js'
                    ]
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= qing.dist %>/css/main.min.css': [
                        '<%= qing.dist %>/css/main.css'
                    ]
                }
            }
        },
        shell: {
            options: {
                async: true,
                stdout: true,
                stderr: true,
                failOnError: true
            },
            run: {
//                command: 'supervisor demo/app.js'
                command: 'node demo/app.js'
            }
        }
    });

    grunt.registerTask('build', [
        'clean:all',
        'html2js',
        'concat',
        'clean:jstemplate',
        'copy:less',
        'less' ,
        'copy:demo'
    ]);

    grunt.registerTask('server', [
        'build',
        'shell:run',
        'open',
        'livereload',
        'watch'
    ]);


    grunt.registerTask('test', [
        'build',
//        'jshint',
        'karma'
    ]);

    grunt.registerTask('release', [
        'test',
        'ngmin',
        'uglify',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'release'
    ]);
};
