var cli = require('baqend/cli');
var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var mincss = require('gulp-clean-css');
var imgmin = require('gulp-imagemin');
var usemin = require('gulp-usemin');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var gulpif = require("gulp-if");
var hb = require('gulp-hb');
var postcss = require('gulp-postcss');
var yaml = require('js-yaml');

var fs = require('fs');
var runSequence = require('run-sequence');
var lrserver = require('tiny-lr')();
var express = require('express');
var livereload = require('connect-livereload');
var del = require('del');
var autoprefixer = require('autoprefixer');
var critical = require('critical').stream;

var serverport = 5000;
var livereloadport = 35728;

var server = express();
server.use(livereload({
    port: livereloadport
}));

server.use(express.static('./app'));
server.use(express.static('./.tmp'));
server.use('/node_modules', express.static('./node_modules'));

gulp.task('less', function () {
    var processors = [
        autoprefixer()
    ];

    return gulp.src('app/less/style.less')
        .pipe(less())
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(postcss(processors))
        .pipe(gulp.dest('.tmp/css'));
});

gulp.task('images', function () {
    return gulp.src('app/img/**/*')
        .pipe(gulpif(/.*\.(jpg$|png$)/, imgmin()))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('handlebars', function () {
    return gulp.src('app/tpl/*.hbs')
        .pipe(hb({
            partials: './app/tpl/partials/**/*.hbs',
            helpers: {
                ifEqual: function (v1, v2, options) {
                    if (v1 === v2) {
                        return options.fn(this);
                    }
                    return options.inverse(this);
                },
                raw: function (options) {
                    return options.fn();
                },
                template: function (options) {
                    return '<script id="' + options.hash.id + '" type="text/x-handlebars-template">' +
                        fs.readFileSync(__dirname + '/app/tpl/partials/' + options.hash.file, "utf8") +
                        '</script>';
                }
            }
        }))
        .pipe(rename(function (path) {
            path.dirname = "/";
            path.extname = ".html"
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('html', function () {
    return gulp.src('.tmp/*.html')
        .pipe(usemin({
            //need builder functions for creating pipeline steps
            //@see: https://github.com/zont/gulp-usemin/issues/150#issuecomment-222346085
            js: [function () {
                return uglify()
            }],
            css: ['concat', function () {
                return mincss()
            }]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
    return gulp.src(['node_modules/bootstrap/fonts/*'])
        .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('fonts', function () {
    return gulp.src('.tmp/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', function (cb) {
    return del([
        'dist',
        '.tmp'
    ]);
});

gulp.task('mincss', function () {
    return gulp.src('dist/css/*.css')
        .pipe(mincss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('critical', function () {
    return gulp.src('dist/*.html')
        .pipe(critical(
            {
                base: 'dist/',
                inline: true,
                css: ['dist/css/app.css'],
                minify: true,
                dimensions: [{
                    width: 320,
                    height: 480
                }, {
                    height: 900,
                    width: 1300
                }]
            })).pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('app/less/*.less', ['less']);
    gulp.watch('app/tpl/**/*.hbs', ['handlebars']);
    gulp.watch(['.tmp/**/*', 'app/img/**/*', 'app/js/**/*'], function (event) {
        var filePath = path.relative(__dirname, event.path);
        filePath = filePath.replace(/\\/g, '/');
        filePath = filePath.substring(filePath.indexOf('/'));

        console.log(filePath);
        lrserver.changed({body: {files: [filePath]}});
    });
});


gulp.task('serve', function () {
    server.listen(serverport);
    lrserver.listen(livereloadport);
});

gulp.task('dist', function (cb) {
    runSequence('clean', ['less', 'handlebars', 'copy'], ['html', 'fonts', 'images']/*,  'critical'*/, cb);
});

gulp.task('upload', function (cb) {
    var data = yaml.safeLoad(fs.readFileSync(".baqend", "utf8"));
    gutil.log(data);
    cli.account.login({username: data.username, password: data.password}).then(function () {
        return cli.deploy({app: data.app, fileDir : 'dist'});
    }).then(function () {
        gutil.log('Deployment successful');
    });
});

gulp.task('default', ['serve', 'less', 'handlebars', 'copy', 'watch']);

gulp.task('deploy', ['dist', 'upload']);