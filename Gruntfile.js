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
            }
        },
        open: {
            server: {
                url: 'http://localhost:3000'
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
                'Gruntfile.js',
                '<%= qing.app %>/{,*/}*.js'
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
            less: {
                options: {
                    banner: "",
                    process: function (src, filepath) {
                        return src;
                    }
                },
                src: ['<%= qing.app %>/common/**/*.less',
                    '<%= qing.app %>/product/**/*.less',
                    '<%= qing.app %>/design/**/*.less'],
                dest: '<%= qing.dist %>/less/qing/qing.less'
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
                        src: ['main.less'],
                        dest: '<%= qing.dist %>/css/',
                        ext: '.css'
                    }
                ]
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
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
                command: 'supervisor demo/app.js'
//                command: 'node demo/app.js'
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
        'watch' ,
        'livereload'
    ]);

    grunt.registerTask('release', [
        'default',
//        'karma', should fix unit test
        'ngmin',
        'uglify',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'build'
//        'jshint',
//        'build'
    ]);
};
