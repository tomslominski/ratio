import { src, dest, watch as watcher, series, parallel } from 'gulp';
import sass from 'gulp-dart-sass';
import cleanCss from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import del from 'del';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import fiber from 'fibers';
import fs from 'fs';
import replace from 'gulp-replace';

const clean = () => {
	return del('tmp/', {force: true});
};

const styles = () => {
	return src('src/sass/style.scss')
	.pipe(sass({fiber: fiber, includePaths: ['node_modules']}).on('error', sass.logError))
	.pipe(postcss([autoprefixer()]))
	.pipe(cleanCss())
	.pipe(dest('tmp/css'));
}

const scripts = () => {
	return src('src/js/app.js')
	.pipe(babel({presets: ['@babel/env']}))
	.pipe(terser())
	.pipe(dest('tmp/js'));
}

const inject = () => {
	return src('index.html')
	.pipe(replace(/{{\s?css\s?}}/g, () => '<style>' + fs.readFileSync('tmp/css/style.css', {encoding: 'utf8'}) + '</style>' ))
	.pipe(replace(/{{\s?js\s?}}/g, () => '<script>' + fs.readFileSync('tmp/js/app.js', {encoding: 'utf8'}) + '</script>' ))
	.pipe(dest('public/'));
}

const watchChanges = () => {
	watcher('src/sass/', series(styles, inject));
	watcher('src/js/', series(scripts, inject));
	watcher('index.html', inject);

	return Promise.resolve(false);
}

export const watch = series(clean, parallel(styles, scripts), inject, watchChanges);
export const build = series(clean, parallel(styles, scripts), inject, clean);
export default watch;
