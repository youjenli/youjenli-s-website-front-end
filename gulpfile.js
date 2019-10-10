const gulp = require('gulp');
const del = require('del');
const clean = require('gulp-clean');
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cleanCSS = require('gulp-clean-css');
const flatten = require('gulp-flatten');
/*
  雖然 gulp-template 背後使用的樣板引擎 Lodash/Underscore 似乎不是目前 js 社群評價最好的樣板，
  但我還是選用它，原因是 gulp-template 的說明簡單易懂，而且剛好可以簡單的解決我的問題。
*/
const template = require('gulp-template');
const dateFormat = require('dateformat');
/*
  因為 Linux 上面要安裝其他套件才能解壓縮 zip 檔，所以後來改用 tar 和 gz 來封裝場景。
*/
const tar = require('gulp-tar');
const untar = require('gulp-untar');
const gzip = require('gulp-gzip');
const gunzip = require('gulp-gunzip');
const GulpSSH = require('gulp-ssh');
const path = require('path');
const _ = require('lodash');

const srcRoot = path.join(__dirname, 'src');
const distRoot = path.join(__dirname, 'dist'); //輸出建置成品的路徑
const jsBundleName = 'index';
const jsArtifacts = [`**/${jsBundleName}.js`, `**/${jsBundleName}.js.map`];
const nameOfhtmlSrcFile = ['**/*.php', '**/*.html'];
const cssArtifacts = ['**/*.css', '**/*.css.map'];
const nameOfImgAssets = ['*.png', '*.svg', '*.jpeg'].map(filePattern => path.join('img', filePattern));

const buildSettings = require('./build-settings');
const deploymentConfig = _.isPlainObject(buildSettings.deploy) ? buildSettings.deploy : {} ;
const prefixOfArchive = `wp-${deploymentConfig.nameOfTheme ? deploymentConfig.nameOfTheme : 'youjenli' }-theme`;

function removeHtmlArtifact() {
    return gulp.src(
                    nameOfhtmlSrcFile.map(filePattern => path.join(distRoot, filePattern)), {read:false})
                .pipe(clean());
}
function removeJSArtifact() {
    return gulp.src(
                    jsArtifacts.map(filePattern => path.join(distRoot, filePattern)), {read:false})
                .pipe(clean());
}

const removeCSSArtifactTask = gulp.series(function removeCSSArtifact(){
    return gulp.src(cssArtifacts.map(filePattern => path.join(distRoot, filePattern)), {read:false})
                .pipe(clean());
});

function removeImgArtifact() {
    return gulp.src(nameOfImgAssets.map(srcFiles => path.join(distRoot, srcFiles)), {
                        read:false,
                         //註：加入 allowEmpty 以免 gulp 因為讀不到目錄而報錯
                         allowEmpty:true
                    })
                .pipe(clean());
}

//清空輸出打包成品的資料夾
const cleanTask = gulp.series(removeHtmlArtifact, removeJSArtifact, removeCSSArtifactTask, removeImgArtifact);
gulp.task('clean', cleanTask);

gulp.task('cleanArchives', gulp.series(function cleanArchivesTask(){
    return gulp.src(path.join(distRoot, `${prefixOfArchive}*.zip`), {read:false})
                .pipe(clean());
}));

const tsEntryFiles = ['src/ts/index.tsx'];
let tsConfig = null;
if (_.isPlainObject(buildSettings.build.js) && _.isPlainObject(buildSettings.build.js.tsConfig)) {
    tsConfig = buildSettings.build.js.tsConfig;
} else {
    tsConfig = {
        "compilerOptions": {
            "lib":["dom", "es6"],
            "target":"es5",
            "jsx":"react"
        }
    };
}

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

function transpileTS() {
    /*
        先前改用 gulp-typescript 的原因是原本使用的 browserify 的方法在 gulp 4.0 沒辦法正常使用。
        但是後來發現 gulp-typescript 沒辦法解決 js 檔案的整併問題，那得引入其他擴充套件來解決。
        後來還是回頭研究 browserify ，這才發現搭配 gulp 3.0 使用的 event-stream 已停止維護，
        而且 browserify 根本不需要透過 event-stream 整併所有 js 檔案的內容，只要照下面的方式設定並調用對應的擴充套件即可。
        欲了解詳情可參閱以下使用說明
        https://github.com/browserify/browserify#usage

        註：gulp 4.0 的任務函式仍支援兩種結束方式: 1. 回傳 gulp 串流 2. 呼叫 gulp 注入給任務函式的 done 函式。
    */
    let transpile = 
            browserify({ //browserify 會一併打包專案的依賴函式庫 , 也就是 React 和 ReactDOM
                  basedir: '.',
                  entries: tsEntryFiles,
                  cache:{},
                  packageCache:{},
                  debug: _.isPlainObject(buildSettings.build.js) && buildSettings.build.js.sourceMap //是否包含 sourcemap
              })
              .plugin(tsify, transpileConfig)
              .bundle()
              //必須要使用 vinyl-source-stream 將 browserify 輸出的串流轉成可交給 gulp 輸出為檔案的格式。
              //source 裡面指定要輸出的檔名即可，不用像過去一樣引用其他輸入的原始碼檔名。
              .pipe(source(`${jsBundleName}.js`)) // 透過 vinyl-source-stream 轉換前面的建置成果為 gulp 可輸出的串流
              //這裡應該可以寫死檔名沒有關係，因為這是打包所有 js 模組的檔名。
              //欲了解詳情可參閱 https://www.typescriptlang.org/docs/handbook/gulp.html
              .pipe(buffer());

    if (_.isPlainObject(buildSettings.build.js) && buildSettings.build.js.minify == true) {
        //如果要建置生產環境的場景，那就壓縮 js 檔
        transpile = 
            transpile.pipe(minify({
                         noSource:true,
                         ext:{
                             min:'.js'
                         }
                     }))
                     .pipe(gulp.dest(distRoot)); 
    } else {
        /* 
          如果要建置開發環境的場景，那就輸出 sourcemap。
          這裡使用 gulp sourcemap 套件的方法很不循常，但這是我摸索出的有效方法。
          這足以整合 gulp、browserify 和 gulp-sourcemap。
        */
        transpile =
            transpile.pipe(sourcemaps.init({loadMaps: true}))
                     .pipe(sourcemaps.write('./'));
    }
    return transpile.pipe(gulp.dest(distRoot));
}
const prepareJSTask = gulp.series(removeJSArtifact, transpileTS);

gulp.task('prepareJS', prepareJSTask);

const cssSrcRoot = path.join(srcRoot, 'css');
let cleanCSSConfig = null;
if (_.isPlainObject(buildSettings.build.css)) {
    const retrievedValue = buildSettings.build.css.cleanCSSConfig;
    if (_.isPlainObject(retrievedValue)) {
        cleanCSSConfig = retrievedValue;
    }
} else {
    cleanCSSConfig = {
        "format":"beautify",
        "inline":["local"],
        "level":1,
        "sourceMap":true
    };
}

function transpileSCSS() {
    if (_.isPlainObject(buildSettings.build.css) && buildSettings.build.css.sourceMap == true) {
        return gulp.src([path.join(cssSrcRoot, 'style.scss')], {base:cssSrcRoot})
                    /*
                    sass() 這部分除了包含轉譯 scss，它還會利用 scss 自訂的 css import 語法機制將其他 css 檔案
                    合併到主要的 css 檔案裡，但是不包含把 css 檔案串連起來。
                    */
                   .pipe(sass())
                   .pipe(buffer())
                   /*
                     cleanCSS() 包含合併 css 檔案、簡化或壓縮 css 語法，例如使用功能相同但是更簡短的語法替代原本的 css 語法。
                   */
                  .pipe(cleanCSS(cleanCSSConfig))
                  .pipe(gulp.dest(distRoot));
    } else {
        return gulp.src([path.join(cssSrcRoot, 'style.scss')], {base:'.'})
                   .pipe(sourcemaps.init())
                   .pipe(sass())
                   .pipe(buffer())
                   .pipe(cleanCSS(cleanCSSConfig))
                   .pipe(sourcemaps.write('./'))
                   /*
                     如果以上作業的 gulp 基礎路徑不像現在一樣是「.」，那最後輸出樣式到 distRoot 時，
                     gulp 就會在 distRoot 裡面重建 . 到原始碼之間的階層，導致 gulp 後續要打包成場景時找不到樣式檔案，
                     或是讓場景無法照原先的規劃在場景根目錄找到樣式。
                     但如果把 gulp 基礎路徑設定為 cssSrcRoot，那又會導致 scss 樣式檔案在瀏覽器 debugger 裡面出現的目錄階層
                     與專案目錄和 js 原始碼目錄階層不同。
                     為解決這個問題，這邊使用 flatten 在 sourcemap 輸出之後打平路徑階層，最後才輸出至 distRoot。
                   */
                   .pipe(flatten())
                   .pipe(gulp.dest(distRoot));
    }
}

const prepareCSSTask = gulp.series(removeCSSArtifactTask, transpileSCSS);
gulp.task('prepareCSS', prepareCSSTask);

const imgSrcFiles = nameOfImgAssets.map((img) => {
    return path.join('src', img);
});
const prepareImgTask = gulp.series(removeImgArtifact, 
    function copyImgs() {
        return gulp.src(imgSrcFiles, { base:'src' })
                .pipe(gulp.dest(distRoot));
    });
gulp.task('prepareImg', prepareImgTask);

const htmlSrcRoot = path.join(srcRoot, 'html');

const pathOfHtmlSrcFiles = nameOfhtmlSrcFile.map(filePattern => path.join(htmlSrcRoot, filePattern));
function copyHtmlFilesTask(){
    /*
      這邊之所以要排除 general-header.php 的原因是我們稍後要根據建置模式產生對應的樣板內容
    */
    return gulp.src(pathOfHtmlSrcFiles, { base: htmlSrcRoot})
               .pipe(gulp.dest(distRoot));
}

let variableSubstitutionTask = null;
if (_.isPlainObject(buildSettings.build.html) && _.isPlainObject(buildSettings.build.html.variableSubstitution)) {
    const parallelTasks = Object.keys(buildSettings.build.html.variableSubstitution).map(function(key) {
        if (_.isPlainObject(buildSettings.build.html.variableSubstitution[key])) {
            return () => {
                return gulp.src(path.join(distRoot, key), {base:distRoot})
                           .pipe(template(buildSettings.build.html.variableSubstitution[key]))
                           .pipe(gulp.dest(distRoot));
            }
        } else {
            return (done) => { done() };
        }
    });
    variableSubstitutionTask = gulp.parallel(...parallelTasks);
} else {
    variableSubstitutionTask = (done) => { done() };
}

const prepareHtmlTask = gulp.series(removeHtmlArtifact, gulp.series(copyHtmlFilesTask, variableSubstitutionTask));

gulp.task('prepareHtml', prepareHtmlTask);

const buildTask = gulp.parallel(prepareJSTask, prepareCSSTask, prepareImgTask, prepareHtmlTask);
gulp.task('build', buildTask);

let nameOfArchive = null;

function packArtifactTask() {
    const createDate = dateFormat(new Date(), "yyyy-mmdd-HHMM");
    nameOfArchive = `${prefixOfArchive}-${createDate}.tar.gz`;

    const itemsToArchive = ['**/*.php'].concat(cssArtifacts).concat(jsArtifacts).concat(nameOfImgAssets)
                        .map(filePattern => path.join(distRoot, filePattern));

    return gulp.src(itemsToArchive, {base:distRoot})
            .pipe(tar(nameOfArchive))
            .pipe(gzip({
                append:false
                /*  
                    gulp-gzip 套件預設會在檔案名稱後面加上 .gz，因此這裡要以 append 參數指定不增加副檔名，
                    這樣才能確保 nameOfArchive 變數有完整的套件檔名給後面函式採用。
                    https://www.npmjs.com/package/gulp-gzip
                */
            }))
            .pipe(gulp.dest(distRoot));
}

const archiveTask = gulp.series(buildTask, packArtifactTask);
gulp.task('archive', archiveTask);
gulp.task('default', archiveTask);

function generateDeployTask() {
    let pathToArchive = null;
    function validateDeploymentConfigTask(done) {
        if (!deploymentConfig) {
            throw new Error('Configuration of deployment does not exists!');
        }
        if (!deploymentConfig.target) {
            throw new Error(`Target of deployment is a mandatory setting for deployment task.`);
        }
        if (!deploymentConfig.target.host) {
            throw new Error(`Host name is a mandatory setting for deployment task.`);
        }
        if (!deploymentConfig.dest) {
            throw new Error('Destination path of archive is a mandatory setting for deployment task.');
        }
        if (!deploymentConfig.nameOfTheme) {
            throw new Error('The name of theme is a mandatory setting for deployment task.');
        }
        
        if (deploymentConfig.archive) {
            pathToArchive = deploymentConfig.archive;
        }
        /*
            如果檢查發現這次建置作業的 nameOfArchive 變數有內容，這表示這次建置作業有打包套件，
            因此就部署這個套件，不套用設定檔指定的套件。
        */
        if (nameOfArchive) {
            pathToArchive = path.join(distRoot, nameOfArchive);
        }
        
        if (!nameOfArchive) {
            throw new Error('Did not found any archive that is ready for deploy.');
        }
        done();
    }

    let copyArchive = null, extractArchiveAndDeployToServer = null;
    const targetName = deploymentConfig.target.host;
    if (targetName == 'local') {
        /* 若部署目標是本地端的目錄，那直接解壓縮場景檔到目的地即可。 */
        const destPath = path.join(deploymentConfig.dest, deploymentConfig.nameOfTheme);
        copyArchive = () => {
            return del(destPath, {force:true})
                    .then(() => {
                        gulp.src(pathToArchive)
                            .pipe(gunzip())
                            .pipe(untar())
                            .pipe(gulp.dest(destPath));
                    });
            /*註：
                gulp 允許作業回傳 promise 通知它作業結束，不一定要呼叫它會提供的 done callback
                https://gulpjs.com/docs/en/getting-started/async-completion
            */
        }
 
        extractArchiveAndDeployToServer  = function doNothing(done) { done(); }
    } else {
        /* 若部署目標不在本地，那就建立 SSH 連線。
         */
        const gulpSSH = new GulpSSH({
            ignoreErrors:false,
            sshConfig:deploymentConfig.target
        });
        copyArchive = () => {
            return gulp.src(pathToArchive)
                        .pipe(gulpSSH.dest('/tmp'));
        }
        
        extractArchiveAndDeployToServer = function extractAndMoveTheWebsite() {
            let pathOfTheme = `/tmp/${deploymentConfig.nameOfTheme}`;
            let pathOfArchiveOnRemoteHost = `/tmp/${path.basename(pathToArchive)}`;
            return gulpSSH.exec([
                `rm -rf ${pathOfTheme}`,
                `mkdir ${pathOfTheme}`,
                `tar -zxf ${pathOfArchiveOnRemoteHost} -C ${pathOfTheme}`,
                `sudo rm -rf ${deploymentConfig.dest}/${deploymentConfig.nameOfTheme}`,
                `sudo cp -r ${pathOfTheme} ${deploymentConfig.dest}`,
                `rm -rf ${pathOfTheme}`,
                `rm ${pathOfArchiveOnRemoteHost}`
            ]);
        };
    }

    return gulp.series(validateDeploymentConfigTask, copyArchive, extractArchiveAndDeployToServer);
}

const deployTask = generateDeployTask();
gulp.task('deploy', gulp.series(archiveTask, deployTask));

const tsSrcFiles = ['src/ts/**/*.ts', 'src/ts/**/*.tsx'];
const cssSrcFiles = ['src/css/**/*.css', 'src/css/**/*.scss'];
/*
  注意，雖然前面程式的路徑都已經改由 path 產生以便適應 windows 工作環境，
  但是因為這邊 gulp watch 只接受 unix-like 系統格式的路徑，所以這邊不需要透過 path 重新產生路徑。
  */

function monitorSrcAndRebuildTask() {
        gulp.watch(pathOfHtmlSrcFiles, prepareHtmlTask),
        gulp.watch(cssSrcFiles, prepareCSSTask),
        gulp.watch(tsSrcFiles, prepareJSTask),
        gulp.watch(imgSrcFiles, prepareImgTask)
};
/*
    註: 以上寫法是參考自下面網址中的範例
    https://gist.github.com/demisx/beef93591edc1521330a
    官網提供的方法--也就是先產生 watcher 再綁定事件--經實際採用後，發現在非同步的 gulp 任務之中會不如預期運作，
    檔案變動後不會觸發重新編譯，因此最後決定不再用。
    試來試去，最後發現 gulp 3 之前的做法才能滿足目前的需求。
*/
gulp.task('watch', gulp.series(monitorSrcAndRebuildTask, deployTask));