'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	inject = require('gulp-inject'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	runSequence = require('run-sequence'),
	htmlmin = require('gulp-htmlmin'),
	plumber = require("gulp-plumber"),
	babel = require('gulp-babel'),
	nodemon = require('gulp-nodemon'),
	ts = require('gulp-typescript');;


var config = require('../config');
const tsProject = ts.createProject('tsconfig.json');


/*
 **	Elimina 'dist/'
 */
gulp.task( config.clean.name, function () {
	return gulp.src( config.clean.src, {read: false})
		.pipe( plumber() )
		.pipe(clean());
});

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

/*
**	Compila SASS.
*/
gulp.task( config.sass.name, function () {
	gulp.src( config.pipi.src )
	.pipe( gulp.dest( config.sass.dest ));

	return gulp.src( config.sass.src )
	.pipe( plumber() )
	.pipe( sourcemaps.init())
	.pipe( sass( { outputStyle: 'compressed'} ).on('error', sass.logError))
	.pipe( sourcemaps.write('maps'))
	.pipe( gulp.dest( config.sass.dest ));
});

/*
**	Mueve fuentes tipografia, font-awesome, bootstrap.
*/
gulp.task( config.fonts.name, function(){
	gulp.src( config.fonts.src )
	.pipe( gulp.dest( config.fonts.dest ));

	return gulp.src( config.fonts.src )
	.pipe( gulp.dest( config.fonts.dest ));

});


gulp.task( config.fonts.name, function(){
	gulp.src( config.fontawesome.src )
	.pipe( gulp.dest( config.fontawesome.dest ));

	return gulp.src( config.fonts.src )
	.pipe( gulp.dest( config.fonts.dest ));

});

/*
**	Mueve assets imagenes, videos, json, etc.
*/
gulp.task( config.assets.name, function(){

	gulp.src( config.assets.src )
	.pipe(gulp.dest( config.assets.dest ));

	return gulp.src( config.accessassets.src )
	.pipe(gulp.dest( config.accessassets.dest ));

});

/*
**	Mueve, concatena y ofusca archivos de vendor en node_modules.
*/
gulp.task( config.vendors.name, function(){

 	return gulp.src( config.vendors.src )
		.pipe( plumber() )
		.pipe( sourcemaps.init())
		.pipe( concat( config.vendors.outputName ))
		.pipe( sourcemaps.write("."))
		.pipe( gulp.dest( config.vendors.dest ));

});

/*
**	Mueve y concatena archivos de angular en app.
*/
gulp.task( config.appjs.name, function(){

  	return gulp.src( config.appjs.src )
	.pipe( plumber() )
	.pipe( sourcemaps.init())
	.pipe( babel() )
	.pipe( concat( config.appjs.outputName ))
	.pipe( sourcemaps.write("."))
	.pipe( gulp.dest( config.appjs.dest ));

});

/*
 **	Mueve server.js.
 */
gulp.task( config.server.name, function(){

	return gulp.src( config.server.src )
		.pipe( plumber() )
		.pipe( sourcemaps.init())
		.pipe( babel() )
		.pipe( sourcemaps.write("."))
		.pipe( gulp.dest( config.server.dest ));

});

/*
 **	Mueve y concatena archivos de node en server.
 */
gulp.task( config.nodejs.name, [config.server.name], function(){

	return gulp.src( config.nodejs.src )
		.pipe( plumber() )
		.pipe( sourcemaps.init())
		.pipe( babel() )
		.pipe( sourcemaps.write("."))
		.pipe( gulp.dest( config.nodejs.dest ));

});

/*
**	Injecta los archivos minificados de css y js en el index.
*/
gulp.task( config.inject.name, [config.html.name], function () {

  	var target = gulp.src( config.inject.target );
  	var sources = gulp.src( config.inject.src, config.inject.read);

  	return target.pipe(inject(sources, {
		addRootSlash: false,
		ignorePath: config.inject.dest
	}, {relative: true}))
	.pipe( gulp.dest( config.inject.dest ));

});

/*
**	Minifica el html excepto index.
*/
gulp.task( config.html.name, function() {

  return gulp.src( config.html.src )
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    .pipe(gulp.dest( config.html.dest ));

});

/*
 **	Nodemon
 */
gulp.task('start', [config.nodejs.name], function(){
	var stream = nodemon({
		exec: 'node --inspect',
		script: 'dist/server.js',
		ext: 'js',
		env: {
			'NODE_ENV': 'development',
			'user': '',
			'password': '',
			'host': '',
			'port': '3306'
		}
	});

	stream.on('crash', function(){
		console.error('Application has crashed!\n');
		stream.emit('restart', 10);  // restart the server in 10 seconds
	})
});

gulp.task('startDev', [config.nodejs.name], function(){
	var stream = nodemon({
		exec: 'node --inspect',
		script: 'dist/server.js',
		ext: 'js',
		env: {
			'NODE_ENV': 'development',
			'user': '',
			'password': '',
			'host': '',
			'port': '3306'
		}
	});

	stream.on('crash', function(){
		console.error('Application has crashed!\n');
		stream.emit('restart', 10);  // restart the server in 10 seconds
	})
});

gulp.task('startTest', [config.nodejs.name], function(){
	var stream = nodemon({
		exec: 'node --inspect',
		script: 'dist/server.js',
		ext: 'js',
		env: {
			'NODE_ENV': 'TEST',
			'user': '',
			'password': '',
			'host': '',
			'port': '3306'
		}
	});

	stream.on('crash', function(){
		console.error('Application has crashed!\n');
		stream.emit('restart', 10);  // restart the server in 10 seconds
	})
});

gulp.task('startHomo', [config.nodejs.name], function(){
	var stream = nodemon({
		exec: 'node --inspect',
		script: 'dist/server.js',
		ext: 'js',
		env: {
			'NODE_ENV': 'PREPROD',
			'user': '',
			'password': '',
			'host': '',
			'port': '3306'
		}
	});

	stream.on('crash', function(){
		console.error('Application has crashed!\n');
		stream.emit('restart', 10);  // restart the server in 10 seconds
	})
});

gulp.task('startProd', [config.nodejs.name], function(){
	var stream = nodemon({
		exec: 'node --inspect',
		script: 'dist/server.js',
		ext: 'js',
		env: {
			'NODE_ENV': 'PROD',
			'user': '',
			'password': '',
			'host': '',
			'port': '3306'
		}
	});

	stream.on('crash', function(){
		console.error('Application has crashed!\n');
		stream.emit('restart', 10);  // restart the server in 10 seconds
	})
});


gulp.task('prod', function(callback){
	runSequence(config.clean.name, ['scripts',
		config.sass.name,
		config.vendors.name,
		config.appjs.name,
		config.fonts.name,
		config.assets.name
	], config.inject.name, 'startProd', callback);
});

gulp.task('dev', function(callback){
	runSequence(config.clean.name, ['scripts',
		config.sass.name,
		config.vendors.name,
		config.appjs.name,
		config.fonts.name,
		config.assets.name
	], config.inject.name, 'startDev', callback);
});

gulp.task('tst', function(callback){
	runSequence(config.clean.name, ['scripts',
		config.sass.name,
		config.vendors.name,
		config.appjs.name,
		config.fonts.name,
		config.assets.name
	], config.inject.name, 'startTest', callback);
});

gulp.task('homo', function(callback){
	runSequence(config.clean.name, ['scripts',
		config.sass.name,
		config.vendors.name,
		config.appjs.name,
		config.fonts.name,
		config.assets.name
	], config.inject.name, 'startHomo', callback);
});

gulp.task('default', function(callback){
	runSequence(config.clean.name, ['scripts',
		config.sass.name,
		config.vendors.name,
		config.appjs.name,
		config.fonts.name,
		config.assets.name
	], config.inject.name, 'start', 'watch', callback);
});
