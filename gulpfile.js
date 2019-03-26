const gulp = require('gulp');
const del = require('del');
/*
    20190326 之後改用 gulp-typescript 串接 gulp 和 typescript。
    原因是原本使用 browserify 加上 tsify，最後再用 event-stream 合併結果的做法太難懂，
    而且會有難以釐清又沒有合適位置可以呼叫 done 以結束的非同步問題，這會導致最後要打包成 wordpress 套件時，經常沒包到 js 檔案。

    欲了解 gulp 整合 typescript 的方法可以參閱 typescript 官方文件
    https://www.typescriptlang.org/docs/handbook/integrating-with-build-tools.html
*/
const ts = require('gulp-typescript');
const concat = require('gulp-concat-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const print = require('gulp-print').default;
// gulp-webserver 已經四年沒有更新了，現在 jetbrains 好像接手開發這專案，最後更新時間是四個月前。
const connect = require('gulp-connect');
const dateFormat = require('dateformat');
const zip = require('gulp-zip');

const srcRoot = './src';
const distRoot = './dist'; //輸出建置成品的路徑

//清空輸出打包成品的資料夾
const cleanTask = gulp.series(function clean() {
        return del(distRoot);
    });
gulp.task('clean', cleanTask);

function prepareJSTask() {
    const config = {
        out: "index.js"
    };
    const tsConfig = require('./tsconfig.json');
    if (tsConfig.hasOwnProperty('compilerOptions')) {
        Object.assign(config, tsConfig.compilerOptions);
    }

    const result = gulp.src("src/**/*.ts").pipe(ts(config));
    return result.js.pipe(gulp.dest("dist"));
};

gulp.task('prepareJS', gulp.series(cleanTask, prepareJSTask));

function concateCSSTask(done) {
    /*
        此建置流程的設計是只讀取 ./src/css/style.css
        若開發時引入其他 css 檔案，則從 style.css 透過 css import 語法載入進來。
        這樣建置時 gulp-concat-css 就會按照 import 語法依我們要的順序整合 css 檔案。
    */
    gulp.src('./src/css/style.css')
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distRoot));
    done();
}

gulp.task('prepareCSS', gulp.series(cleanTask, concateCSSTask));

const prepareHtmlTask = 'prepareHTML';
function copyHTMLTask() {
    return gulp.src(srcRoot + '/html/**/*.html')
        .pipe(print(filePath => `Copy html file ${filePath} to distribution folder.`))
        .pipe(gulp.dest(distRoot));
}
gulp.task('prepareHTML', gulp.series(cleanTask, copyHTMLTask));

const defaultTask = gulp.series(
    cleanTask, gulp.parallel(prepareJSTask, concateCSSTask, prepareHtmlTask)
);
gulp.task('default', defaultTask);

const runDevServerTask = 'serve';
gulp.task(runDevServerTask, gulp.series(defaultTask, function (done) {
        /*return gulp.src(distRoot)
            .pipe(webserver({
                "livereload": true,
                "direcotryListing": true,
                "port": 8000,
                "fallback": "index.html"
                })
            );
        
        實測過後發現上面那樣的寫法已不再有效，改用 gulp-connect 建議的做法再加上非同步通知才可以既正確顯示執行所有任務，
        同時又不會在中斷伺服器的時候出現 gulp 錯誤訊息。
        https://www.npmjs.com/package/gulp-connect
        */

        connect.server({
            "root": ['dist'],
            "livereload": true,
            "direcotryListing": true,
            "host": "localhost",
            "port": 8000,
            "fallback": "index.html"
            });
        done();
    }
));

const archiveTask = 'archive';
gulp.task(archiveTask, gulp.series(defaultTask, function archive(){
        const createDate = dateFormat(new Date(), "yyyy-mmdd-HHMM");
        return gulp.src('./dist/*')
                .pipe(zip('wp-youjenli-website-' + createDate + '.zip'))
                .pipe(gulp.dest(distRoot));
    })
);