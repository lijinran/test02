/**
 * Created by diogoxiang on 2017年6月16日19:03:35.
 * modify  : 2017年6月16日19:03:39
 * version : 0.0.1 版本
 * anthor : diogoxiang
 */
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var gulpCopy = require('gulp-copy');
const rimraf = require('rimraf');

var source = 'src/'
var dist = 'dist/';

gulp.task('minify', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src('src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(dist));

});

gulp.task('copy', function () {
    gulp.src(`${source}/common/**`)
        .pipe(gulp.dest(`${dist}/common`));

    gulp.src([`${source}/*.js`, `${source}/*.jpg`, `${source}/*.gif`])
        .pipe(gulp.dest(dist))

})

gulp.task('clean', function () {
    rimraf.sync(`${dist}/*`);
})

gulp.task('default', ['clean', 'minify', 'copy'])