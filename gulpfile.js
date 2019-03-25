const gulp = require('gulp');
const del = require('del');
const tsify = require('tsify');
const browserify = require('browserify');
const source = require('vinyl-source-stream'); // 將 browserify 處理好的檔案轉換回 gulp 接受的 vinyl 檔案格式
const es = require('event-stream');
const rename = require("gulp-rename");
const print = require('gulp-print').default;
// gulp-webserver 已經四年沒有更新了，現在 jetbrains 好像接手開發這專案，最後更新時間是四個月前。
const connect = require('gulp-connect');

const srcRoot = './src';
const distRoot = './dist'; //輸出建置成品的路徑

//清空輸出打包成品的資料夾
const cleanTask = 'clean';
gulp.task(cleanTask, gulp.series(
    function () {
        return del(distRoot);
    }
));

const tsEntryFiles = ['src/ts/index.ts'];
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

function bundleJS(done) {
    const tasks = tsEntryFiles.map(function (entryFile) {
        return browserify({ //browserify 會一併打包專案的依賴函式庫 , 也就是 React 和 ReactDOM
                basedir: '.',
                debug: true, //是否包含 sourcemap
                entries: entryFile, //要打包的 js 檔起始點
                cache: {},
                packageCache: {}
            })
            .plugin(tsify, //使用 tsify 呼叫 typescript 轉譯器轉譯 typescript 原始碼
                transpileConfig
            ).bundle() //實際開始打包, 輸出成 node.js stream
            .pipe(source(entryFile)) // 透過 vinyl-source-stream 轉換前面的建置成果為 gulp 可輸出的串流
            .pipe(rename({ //此處若不改名的話, 處理後會輸出 ts 而不是 js
                dirname: '',
                extname: '.bundle.js'
            }))
            .pipe(print(filePath => `Generate bundle js file : ${filePath}`))
            .pipe(gulp.dest(distRoot));
    });
    /* 
    因為上面的可能有非同步的作業，所以要使用 gulp 提供給函式的 callback--也就是這裡的 done 通知 gulp 建置作業已完成，
    否則會跳出下列這樣的錯誤訊息：
    [22:10:27] Generate bundle js file : index.bundle.js
    [22:10:27] The following tasks did not complete: prepareJS, bundleJS
    [22:10:27] Did you forget to signal async completion?
    
    欲了解詳情可參閱以下連結：
    https://gulpjs.com/docs/en/api/series 
    */
    es.merge.apply(null, tasks);
    done();
}

const prepareJSTask = 'prepareJS';
gulp.task(prepareJSTask, gulp.series(cleanTask, bundleJS));

const prepareHtmlTask = 'prepareHTML';
function copyHTMLFiles() {
    return gulp.src(srcRoot + '/html/**/*.html')
        .pipe(print(filePath => `Copy html file ${filePath} to distination folder.`))
        .pipe(gulp.dest(distRoot));
}
gulp.task(prepareHtmlTask, gulp.series(cleanTask, copyHTMLFiles));

const defaultTasks = gulp.series(
    cleanTask, gulp.parallel(bundleJS, copyHTMLFiles)
);
gulp.task('default', defaultTasks);

const runDevServerTask = 'serve';
gulp.task(runDevServerTask, gulp.series(defaultTasks, function (done) {
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