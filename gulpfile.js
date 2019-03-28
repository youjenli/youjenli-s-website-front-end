const gulp = require('gulp');
const del = require('del');
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const concat = require('gulp-concat-css');
const sourcemaps = require('gulp-sourcemaps');
const print = require('gulp-print').default;
//註: gulp-webserver 已經四年沒有更新了，現在 jetbrains 好像接手開發這專案並改名為 gulp-connect，最後更新時間是四個月前。
const connect = require('gulp-connect');
const dateFormat = require('dateformat');
const zip = require('gulp-zip');
const path = require('path');

const srcRoot = './src';//原始碼來源路徑
const distRoot = './dist'; //輸出建置成品的路徑

const tsEntryFiles = ['src/ts/index.tsx'];
const jsArtifact = 'index.js';
const cssEntryFiles = ['src/css/style.css'];
const cssArtifact = 'style.css';
const htmlSrcFiles = ['src/html/**/*.html'];
const htmlArtifact = '*.html';

function removeHtmlArtifact(done) {
    del(path.join(distRoot, htmlArtifact))
        .then(() => {
            done();
        });
}
function removeJSArtifact(done) {
    del(path.join(distRoot, jsArtifact))
        .then(() => {
            done();
        });
}
function removeCSSArtifact(done) {
    del(path.join(distRoot, cssArtifact))
        .then(() => {
            done();
        });
}

//清空輸出打包成品的資料夾
const cleanTask = gulp.parallel(removeHtmlArtifact, removeCSSArtifact, removeJSArtifact);
gulp.task('clean', cleanTask);

const tsConfig = require('./tsconfig.json');
/*因為 tsify 接收參數的格式在 compilerOptions 的部分比 tsconfig 高一層, 
    所以下面要把 tsconfig 的 compilerOptions 往外提出來
*/
const transpileConfig = {};
if (tsConfig.hasOwnProperty('compilerOptions')) {
    Object.assign(transpileConfig, tsConfig.compilerOptions);
    delete transpileConfig.compilerOptions;
}
//提出 compilterOption 之後就是複製其他欄位
Object.assign(transpileConfig, tsConfig);


function prepareJSTask() {
    /*
        先前改用 gulp-typescript 的原因是原本使用的 browserify 的方法在 gulp 4.0 沒辦法正常使用。
        但是後來發現 gulp-typescript 沒辦法解決 js 檔案的整併問題，那得引入其他擴充套件來解決。
        後來還是回頭研究 browserify ，這才發現搭配 gulp 3.0 使用的 event-stream 已停止維護，
        而且 browserify 根本不需要透過 event-stream 整併所有 js 檔案的內容，只要照下面的方式設定並調用對應的擴充套件即可。
        欲了解詳情可參閱以下使用說明
        https://github.com/browserify/browserify#usage
    */
    return browserify(tsEntryFiles, { //browserify 會一併打包專案的依賴函式庫 , 也就是 React 和 ReactDOM
            basedir: '.',
            debug: true //是否包含 sourcemap
    }).plugin(tsify, //使用 tsify 呼叫 typescript 轉譯器轉譯 typescript 原始碼
        transpileConfig
    ).bundle()
    //必須要使用 vinyl-source-stream 將 browserify 輸出的串流轉成可交給 gulp 輸出為檔案的格式。
    //source 裡面指定要輸出的檔名即可，不用像過去一樣引用其他輸入的原始碼檔名。
    .pipe(source(jsArtifact)) // 透過 vinyl-source-stream 轉換前面的建置成果為 gulp 可輸出的串流
    .pipe(gulp.dest(distRoot)); 

    /* gulp 4.0 的任務函式仍支持兩種結束方式: 1. 回傳 gulp 串流 2. 呼叫 gulp 注入給任務函式的 done 函式。*/
}

gulp.task('prepareJS', gulp.series(cleanTask, prepareJSTask));


function concateCSSTask(done) {
    /*
        此建置流程的設計是只讀取 ./src/css/style.css
        若開發時引入其他 css 檔案，則從 style.css 透過 css import 語法載入進來。
        這樣建置時 gulp-concat-css 就會按照 import 語法依我們要的順序整合 css 檔案。
    */
    return gulp.src(cssEntryFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distRoot));
}
gulp.task('prepareCSS', gulp.series(cleanTask, concateCSSTask));

const prepareHtmlTask = function() {
    return gulp.src(htmlSrcFiles)
        .pipe(gulp.dest(distRoot));
}
gulp.task('prepareHTML', gulp.series(cleanTask, prepareHtmlTask));

const defaultTask = gulp.series(
    cleanTask, gulp.parallel(prepareJSTask, concateCSSTask, prepareHtmlTask)
);
gulp.task('default', defaultTask);

const watchTask = function() {
            gulp.watch(htmlSrcFiles, gulp.series(removeHtmlArtifact, prepareHtmlTask)),
            gulp.watch(cssEntryFiles, gulp.series(removeCSSArtifact, concateCSSTask)),
            gulp.watch(tsEntryFiles, gulp.series(removeJSArtifact, prepareJSTask))
};
gulp.task('watch', watchTask);

const runDevServerTask = gulp.series(defaultTask, gulp.parallel(watchTask ,function runDevServer(done) {
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
    })
);
gulp.task('serve', runDevServerTask);

const archiveTask = gulp.series(cleanTask, gulp.parallel(prepareJSTask, concateCSSTask, prepareHtmlTask), 
function(){
    const createDate = dateFormat(new Date(), "yyyy-mmdd-HHMM");
    return gulp.src('./dist/*')
            .pipe(print(filePath => `Packing file ${filePath} to wordpress theme.`))
            .pipe(zip('wp-youjenli-website-' + createDate + '.zip'))
            .pipe(gulp.dest(distRoot));
});
gulp.task('archive', archiveTask);