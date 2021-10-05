

let projectFolder = "dist";
let sourceFolder = "src";

let path = {
  build: {
    html: projectFolder + "/",
    css: projectFolder + "/css/",
    js: projectFolder + "/js/",
    img: projectFolder + "/img/",
    fonts: projectFolder + "/fonts/",
    icons: projectFolder + "/icons/"
  },
  src: {
    html: sourceFolder + "/*.html",
    css: sourceFolder + "/scss/style.scss",
    js: sourceFolder + "/js/script.js",
    img: sourceFolder + "/img/**/*.{jpp,png, svg,gif,ico,webp}",
    fonts: sourceFolder + "/fonts/*.ttf",
    icons: sourceFolder + "/icons/*.svg",
  },
  watch: {
    html: sourceFolder + "/**/*.html",
    css: sourceFolder + "/scss/**/*.scss",
    js: sourceFolder + "/js/**/*.js",
    img: sourceFolder + "/img/**/*.{jpp,png, svg,gif,ico,webp}",
    fonts: sourceFolder + "/fonts/*.ttf",
    icons: sourceFolder + "/icons/*.svg",
  },
  clean: "./" + projectFolder + "/",
};

let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  del = require("del"),
  scss = require("gulp-sass")(require("sass")),
  autoPrefixer = require("gulp-autoprefixer"),
  cleanCss =require("gulp-clean-css"),
  rename  = require('gulp-rename'),  
  svgSprite = require('gulp-svg-sprite'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2');

// functions -----------------------//
function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + projectFolder + "/",
    },
    port: 3000,
    notify: false,
  });
}
function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      }).on("error", scss.logError)
    )
    .pipe(
      autoPrefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(rename({
      extname:".min.css"
       })
    )
    .pipe(cleanCss())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}
function js() {
  return src(path.src.js)
  .pipe(dest(path.build.js))
  .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}
function icons() {
  return src(path.src.icons).pipe(
    svgSprite({
      mode: {
        mode: {
          stack: {
            sprite: "../icons/sprite.svg",
          },
        },
      },
    })
  )
}
 function fonts(){
   src(path.src.fonts)
   .pipe(ttf2woff())
   .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
   .pipe(ttf2woff2())
   .pipe(dest((path.build.fonts)));
 };

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.img], icons);

}

function clean(params) {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, icons, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.fonts = fonts;
exports.icons = icons;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
