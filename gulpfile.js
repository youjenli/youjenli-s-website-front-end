const gulp = require('gulp');
const clean = require('gulp-clean');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const GulpSSH = require('gulp-ssh');
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const uglify = require('gulp-uglify');
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
const FtpClient = require('ftp');
const fsPromises = require('fs').promises;
const dateFormat = require('dateformat');
const del = require('del');
/*
  因為 Linux 上面要安裝其他套件才能解壓縮 zip 檔，所以後來改用 tar 和 gz 來封裝場景。
*/
const upath = require('upath');
const _ = require('lodash');

const buildSettings = require('./build-settings');
const srcFolder = 'src';
const distFolder = 'dist'; //輸出建置成品的路徑
const pathOfNewArchives = 'archives';//存放場景壓檔案的目錄
const webPageArtifacts = ['**/*.php', '**/*.html'];
const cssArtifacts = ['**/*.css', '**/*.css.map'];
const jsArtifacts = [`**/*.js`, `**/*.js.map`];
const nameOfImgAssets = ['*.png', '*.svg', '*.jpeg'].map(filePattern => upath.join('img', filePattern));
const themeName = _.isObjectLike(buildSettings.theme) && _.isString(buildSettings.theme.name) && buildSettings.theme.name !== '' ?
                    buildSettings.theme.name : 'youjenli'
const prefixOfArchive = `wp-${themeName}-theme`;

function doNothing(done){ done(); }

function removeHtmlArtifact() {
    return gulp.src(
                    webPageArtifacts.map(filePattern => upath.join(distFolder, filePattern)), {read:false})
                .pipe(clean());
}

function removeJSArtifact() {
    return gulp.src(
                    jsArtifacts.map(filePattern => upath.join(distFolder, filePattern)), {read:false})
                .pipe(clean());
}

function removeCSSArtifact(){
    return gulp.src(cssArtifacts.map(filePattern => upath.join(distFolder, filePattern)), {read:false})
                .pipe(clean());
}

function removeImgArtifact() {
    return gulp.src(nameOfImgAssets.map(srcFiles => upath.join(distFolder, srcFiles)), {
                        read:false,
                        //註：加入 allowEmpty 以免 gulp 因為讀不到目錄而報錯
                        allowEmpty:true
                    })
                .pipe(clean());
}

gulp.task('cleanArchives', function cleanArchives() {
        return gulp.src(upath.join(pathOfNewArchives, `${prefixOfArchive}*.tar.gz`), {read:false})
                   .pipe(clean());
});

//清空輸出打包成品的資料夾
gulp.task('clean', gulp.parallel(removeHtmlArtifact, removeCSSArtifact, removeImgArtifact, removeJSArtifact));

let transpileTsTask, bundleJsTask, prepareCssTask, prepareHtmlTask;
if (!_.isObjectLike(buildSettings.build)) {
    console.log('Build configuration of html, css and JavaScript does not exist.');
    console.log('Therefore a function that does nothing will be used as the transpileTs task, the prepareCss task and the prepareHtml task.');
    transpileTsTask = doNothing;
    bundleJsTask = doNothing;
    prepareCssTask = doNothing;
    prepareHtmlTask = doNothing;
} else {
    const build = buildSettings.build;
    if (_.isObjectLike(build.ts)) {
        if (_.isArray(build.ts.bundles) && !build.ts.bundles.length <= 0) {
            const srcMapShouldBeIncluded = build.ts.sourceMap === true ? true : false;
            const jsShouldBeUglified = build.ts.uglify === true ? true : false;

            let doUglifyTask = function(transpile) { return transpile; }
            if (jsShouldBeUglified) {
                if (srcMapShouldBeIncluded) {
                    doUglifyTask = function(transpile) {
                        return  transpile.pipe(sourcemaps.init({loadMaps: true}))
                                          /*
                                             改成可以建置多個 bundle 以後，我試了解種設定都無法令 gulp-minify 產生 js 壓縮檔，
                                             因此決定改用 TypeScript 官方和 gulp 官方推薦的 gulp-uglify 來負責壓縮 js 檔案。

                                             https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
                                          */
                                          .pipe(uglify())
                                          /*
                                             改成可以建置多個 bundle 以後，我發現除非 sourcemaps.write 改為不帶參數，
                                             也就是直接將 source map 寫到 js 檔案中，否則不管怎麼調整 sourcemaps 設定，
                                             它都不會輸出 source map 檔案。這狀況的原因不明，但既然可以減少瀏覽器發送一個請求，
                                             那似乎也不壞，就這樣做吧。
                                          */
                                          .pipe(sourcemaps.write())
                    };
                } else {
                    doUglifyTask = function(transpile) {
                        return transpile.pipe(uglify());
                    }
                }
            }

            const transpileTypeScriptSrcTasks = build.ts.bundles.map((bundle, idx) => {
                if (_.isEmpty(bundle.fileName)) {
                    console.log(`The TypeScript source code transpile settings located at the order ${idx + 1} does not have a name.`);
                    console.log('Therefore a function that does nothing will be used as the bundle task for this bundle.');
                    return doNothing;
                }
                if (!_.isArray(bundle.entryFiles) || bundle.entryFiles.length <= 0) {
                    console.log(`The TypeScript source code transpile settings located at the order ${idx + 1} does not have entry files.`);
                    console.log('Therefore a function that does nothing will be used as the bundle task for this bundle.');
                    return doNothing;
                }
                
                function createTsConfig(obj) {
                    let tsConfig = null;
                    if (_.isPlainObject(obj)) {
                        tsConfig = obj;
                        /*因為 tsify 接收參數的格式在 compilerOptions 的部分比 tsconfig 高一層, 
                            所以下面要把 tsconfig 的 compilerOptions 往外提出來
                        */
                        if (obj.hasOwnProperty('compilerOptions')) {
                            const compilerOptions = obj.compilerOptions;
                            delete obj.compilerOptions;
                            tsConfig = Object.assign(obj, compilerOptions);
                        }
                    } else {
                        tsConfig = {
                            "compilerOptions": {
                                "lib":["dom", "es6"],
                                "target":"es5",
                                "jsx":"react"
                            }
                        };
                    }
                    return tsConfig;
                }
                /*
                    先前改用 gulp-typescript 的原因是原本使用的 browserify 的方法在 gulp 4.0 沒辦法正常使用。
                    但是後來發現 gulp-typescript 沒辦法解決 js 檔案的整併問題，那得引入其他擴充套件來解決。
                    後來還是回頭研究 browserify ，這才發現搭配 gulp 3.0 使用的 event-stream 已停止維護，
                    而且 browserify 根本不需要透過 event-stream 整併所有 js 檔案的內容，只要照下面的方式設定並調用對應的擴充套件即可。
                    欲了解詳情可參閱以下使用說明
                    https://github.com/browserify/browserify#usage
                */
                let pathWherebundleResides = bundle.pathRelativeToThemeRoot;
                if (!_.isString(pathWherebundleResides)) {
                    pathWherebundleResides = '';
                }

                let excludedAmbientModule = [];
                if ( _.isArray(bundle.excludeAmbientModule) ||
                        (_.isString(bundle.excludeAmbientModule) && !_.isEmpty(bundle.excludeAmbientModule) ) ) {
                    excludedAmbientModule = bundle.excludeAmbientModule;
                }

                const createBundle = () => {
                        let bundleTask = browserify({//browserify 會一併打包專案的依賴函式庫 , 也就是 React 和 ReactDOM
                                                basedir: '.',
                                                entries: bundle.entryFiles,
                                                cache:{},
                                                packageCache:{},
                                                debug:srcMapShouldBeIncluded  //是否包含 sourcemap
                                            })
                                            .plugin(tsify, createTsConfig(bundle.tsConfig))
                                            /*
                                                external 的用途是向 browserify 指示不要一併打包的「專案外部」依賴套件。
                                                引入這項作業的目的是讓前端可以視情況載入 prismjs。
                                                
                                                欲了解 external 可參閱
                                                https://stackoverflow.com/questions/29222745/how-do-i-exclude-the-requirereact-from-my-browserified-bundle
                                                或是 browserify 的官方文件
                                                https://github.com/browserify/browserify#usage

                                                注意，雖然這邊不管是否要排除特定模組的做法對於不需排除的模組而言毫無必要，
                                                但之所以這樣做的原因是我在開發過程中發現若不一氣喝成地呼叫 browserify 的函式，
                                                那麼後面 doUglify 執行時就會找不到 browserify 的 pipe 函式，具體原因不明，
                                                因此只好採用這種做法。
                                            */
                                            .external(excludedAmbientModule)
                                            .bundle()
                                            /*  為了運用 gulp 建立程式檔案，這裡使用 vinyl-source-stream 將 browserify 輸出的串流轉成可交給 gulp 輸出為檔案的格式。
                                                source 裡面指定要輸出的檔名即可，不用像過去一樣引用其他輸入的原始碼檔名。
                                                欲了解詳情可參閱 https://www.typescriptlang.org/docs/handbook/gulp.html
                                            */
                                            .pipe(source(bundle.fileName))
                                            .pipe(buffer());
                        return doUglifyTask(bundleTask)
                                    .pipe(gulp.dest(upath.join(distFolder, pathWherebundleResides)));
                };//end bundleTask
                Object.defineProperty(createBundle, 'name', 
                        {
                            value:`Prepare ${bundle.fileName}.`,
                            writable: false
                        });
                return createBundle;
            });

            /*
                雖然轉譯 ts 的作業可以同時並行，但實際執行發現會引發 JavaScript heap out of memory 錯誤，
                因此最後決定採用 series 函式依序處理這些作業。
            */
            transpileTsTask = gulp.series(transpileTypeScriptSrcTasks);
        } else {
            console.log('The transpile settings of TypeScript source code is blank');
            console.log('Therefore a function that does nothing will be used as the transpileTs task.');
            transpileTsTask = doNothing;
        }
    } else {
        console.log('Transpile configuration of TypeScript source code does not exist.');
        console.log('Therefore a function that does nothing will be used as the transpileTs task.');
        transpileTsTask = doNothing;
    }

    if (_.isObjectLike(build.js)) {
        if (_.isArray(build.js.bundles) && !build.js.bundles.length <= 0) {
            const srcMapShouldBeIncluded = build.js.sourceMap === true ? true : false;
            const jsShouldBeUglified = build.js.uglify === true ? true : false;

            let doUglifyTask = function(browserify) { return browserify; }
            if (jsShouldBeUglified) {
                if (srcMapShouldBeIncluded) {
                    doUglifyTask = function(broserify) {
                        return  broserify.pipe(sourcemaps.init({loadMaps: true}))
                                          /*
                                             改成可以建置多個 bundle 以後，我試了解種設定都無法令 gulp-minify 產生 js 壓縮檔，
                                             因此決定改用 TypeScript 官方和 gulp 官方推薦的 gulp-uglify 來負責壓縮 js 檔案。

                                             https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
                                          */
                                          .pipe(uglify())
                                          /*
                                             改成可以建置多個 bundle 以後，我發現除非 sourcemaps.write 改為不帶參數，
                                             也就是直接將 source map 寫到 js 檔案中，否則不管怎麼調整 sourcemaps 設定，
                                             它都不會輸出 source map 檔案。這狀況的原因不明，但既然可以減少瀏覽器發送一個請求，
                                             那似乎也不壞，就這樣做吧。
                                          */
                                          .pipe(sourcemaps.write())
                    };
                } else {
                    doUglifyTask = function(transpile) {
                        return transpile.pipe(uglify());
                    }
                }
            }

            const bundleTasks = build.js.bundles.map((bundle, idx) => {
                if (_.isEmpty(bundle.fileName)) {
                    console.log(`The JavaScript source code bundle settings located at the order ${idx + 1} does not have a name.`);
                    console.log('Therefore a function that does nothing will be used as the bundle task for this bundle.');
                    return doNothing;
                }
                if (!_.isArray(bundle.entryFiles) || bundle.entryFiles.length <= 0) {
                    console.log(`The JavaScript source code bundle settings located at the order ${idx + 1} does not have entry files.`);
                    console.log('Therefore a function that does nothing will be used as the bundle task for this bundle.');
                    return doNothing;
                }

                let pathWherebundleResides = bundle.pathRelativeToThemeRoot;
                if (!_.isString(pathWherebundleResides)) {
                    pathWherebundleResides = '';
                }

                const bundleTask = () => {
                    const task = browserify({//browserify 會一併打包專案的依賴函式庫 , 也就是 React 和 ReactDOM
                                            basedir: '.',
                                            entries: bundle.entryFiles,
                                            cache:{},
                                            packageCache:{},
                                            debug:srcMapShouldBeIncluded  //是否包含 sourcemap
                                        })
                                        .bundle()
                                        /*  為了運用 gulp 建立程式檔案，這裡使用 vinyl-source-stream 將 browserify 輸出的串流轉成可交給 gulp 輸出為檔案的格式。
                                            source 裡面指定要輸出的檔名即可，不用像過去一樣引用其他輸入的原始碼檔名。
                                            欲了解詳情可參閱 https://www.typescriptlang.org/docs/handbook/gulp.html
                                        */
                                        .pipe(source(bundle.fileName))
                                        .pipe(buffer());
                        return doUglifyTask(task)
                                    .pipe(gulp.dest(upath.join(distFolder, pathWherebundleResides)));
                };//end bundleTask
                Object.defineProperty(bundleTask, 'name', 
                        {
                            value:`Prepare ${bundle.fileName}.`,
                            writable: false
                        });
                return bundleTask;
            });

            /*
                雖然產生 js 檔的作業可以同時並行，但實際執行發現會引發 JavaScript heap out of memory 錯誤，
                因此最後決定採用 series 函式依序處理這些作業。
            */
            bundleJsTask = gulp.series(bundleTasks);
        } else {
            console.log('The bundle settings of JavaScript source code is blank');
            console.log('Therefore a function that does nothing will be used as the bundleJs task.');
            bundleJsTask = doNothing;
        }
    }

    if (_.isObjectLike(build.css)) {
        function createPrepareCssTask() {
            if (_.isArray(build.css.bundles) && !build.css.bundles.length <= 0) {
                const srcMapShouldBeIncluded = build.css.sourceMap === true ? true : false;
                let bundleTasks = null;
                if (srcMapShouldBeIncluded) {
                    bundleTasks = build.css.bundles.map((bundle, idx) => {
                        if (_.isEmpty(bundle.entryFile)) {
                            console.log(`The CSS bundle settings located at the order ${idx + 1} does not specify it's entry file.`);
                            console.log('Therefore a function that does nothing will be used as the bundle task for this bundle.');
                            return doNothing;
                        }
    
                        let cleanCSSConfig = bundle.cleanCSSConfig;
                        if (!_.isPlainObject(cleanCSSConfig)) {
                            cleanCSSConfig = {
                                "format":"beautify",
                                "inline":["local"],
                                "level":1,
                                "sourceMap":srcMapShouldBeIncluded
                            };
                        }

                        let pathWherebundleResides = bundle.pathRelativeToThemeRoot;
                        if (!_.isString(pathWherebundleResides)) {
                            pathWherebundleResides = '';
                        }

                        const bundleCss = () => {
                            return gulp.src(bundle.entryFile, {base:srcFolder})
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
                                       .pipe(
                                           gulp.dest(upath.join(distFolder, pathWherebundleResides))
                                        );
                        }
                        return bundleCss;
                    });
                } else {
                    bundleTasks = build.css.bundles.map((bundle, idx) => {
                        if (_.isEmpty(bundle.entryFile)) {
                            console.log(`The CSS bundle settings located at the order ${idx + 1} does not specify it's entry file.`);
                            console.log('Therefore a function that does nothing will be used as the bundle task for this bundle.');
                            return doNothing;
                        }
    
                        let cleanCSSConfig = bundle.cleanCSSConfig;
                        if (!_.isPlainObject(cleanCSSConfig)) {
                            cleanCSSConfig = {
                                "format":"beautify",
                                "inline":["local"],
                                "level":1,
                                "sourceMap":srcMapShouldBeIncluded
                            };
                        }

                        let pathWherebundleResides = bundle.pathRelativeToThemeRoot;
                        if (!_.isString(pathWherebundleResides)) {
                            pathWherebundleResides = '';
                        }

                        const bundleCss = () => {
                            return gulp.src(bundle.entryFile, {base:srcFolder})
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
                                       .pipe(
                                            gulp.dest(upath.join(distFolder, pathWherebundleResides))
                                        );
                        }
                        return bundleCss;
                    });
                }
                return gulp.series(removeJSArtifact, gulp.parallel(bundleTasks));
            } else {
                console.log('The build settings of CSS is blank');
                console.log('Therefore a function that does nothing will be used as the prepareCss task.');
                return doNothing;
            }
        }

        prepareCssTask = gulp.series(removeCSSArtifact, createPrepareCssTask());
    } else {
        console.log('Build configuration of CSS does not exist.');
        console.log('Therefore a function that does nothing will be used as the transpileTs task.');
        prepareCssTask = doNothing;
    }

    if (_.isPlainObject(build.html) && _.isPlainObject(build.html.variableSubstitution)) {
        const htmlSrcRoot = upath.join(srcFolder, 'html');
        const pathOfHtmlSrcFiles = ['**/*.php', '**/*.html'].map(filePattern => upath.join(htmlSrcRoot, filePattern));

        function copyHtmlFilesTask(){
            /*
              這邊之所以要排除 general-header.php 的原因是我們稍後要根據建置模式產生對應的樣板內容
            */
            return gulp.src(pathOfHtmlSrcFiles, { base: htmlSrcRoot})
                       .pipe(gulp.dest(distFolder));
        }

        const parallelTasks = Object.keys(build.html.variableSubstitution).map(function(key) {
            if (_.isPlainObject(build.html.variableSubstitution[key])) {
                return () => {
                    return gulp.src(upath.join(distFolder, key), {base:distFolder})
                               .pipe(template(build.html.variableSubstitution[key]))
                               .pipe(gulp.dest(distFolder));
                }
            } else {
                return (done) => { done() };
            }
        });
        const variableSubstitutionTask = gulp.parallel(...parallelTasks);
        prepareHtmlTask = gulp.series(removeHtmlArtifact, gulp.series(copyHtmlFilesTask, variableSubstitutionTask));
    } else {
        console.log('Missing the variable substitution settings for prepareHtml task.');
        console.log('Therefore a function that does nothing will be used as the prepareHtml task.');
        prepareHtmlTask = doNothing;
    }
}

const prepareJsTask = gulp.series(removeJSArtifact, transpileTsTask, bundleJsTask);

//以下五項任務都是用來在給我視情況獨立呼叫。
gulp.task('bundleJs', gulp.series(removeJSArtifact, bundleJsTask));
gulp.task('transpileTs', gulp.series(removeJSArtifact, transpileTsTask));
gulp.task('prepareJs', prepareJsTask);
gulp.task('prepareCss', prepareCssTask);
gulp.task('prepareHtml', prepareHtmlTask);

const imgSrcFiles = nameOfImgAssets.map((img) => {
    return upath.join(srcFolder, img);
});
const prepareImgTask = gulp.series(removeImgArtifact, 
    function copyImgs() {
        return gulp.src(imgSrcFiles, { base:srcFolder })
                .pipe(gulp.dest(distFolder));
    });
gulp.task('prepareImg', prepareImgTask);

const buildTask = gulp.parallel(prepareJsTask, prepareCssTask, prepareImgTask, prepareHtmlTask);
gulp.task('build', buildTask);
gulp.task('default', buildTask);

const deploymentConfig = _.isObjectLike(buildSettings.deploy) ? buildSettings.deploy : {};
let deployTask = null;

let hostObjExists = true;
let hostNameExists = true;
if (!_.isObjectLike(deploymentConfig.host)) {
    hostObjExists = false;
} else if (!_.isString(deploymentConfig.host.name)) {
    hostNameExists = false;
}

//先檢查參數是否正確
if (!_.isString(deploymentConfig.path)) {
    console.log('Target path for the theme deployment task was not configured.');
    console.log('Therefore a function that does nothing will be used as the theme deployment task.');
    deployTask = doNothing;
} else {
    const createDeployTask = () => {
        if (deploymentConfig.method == 'ssh' || deploymentConfig.method == 'ftp') {
            if (!hostObjExists) {
                console.log(`Host settings for the theme deployment task was not configured.`);
                console.log('Therefore a function that does nothing will be used as the theme deployment task.');
                return doNothing;
            }
            if (!hostNameExists) {
                console.log(`Host name for the theme deployment task was not configured.`);
                console.log('Therefore a function that does nothing will be used as the theme deployment task.');
                return doNothing;
            }
        }
        
        switch (deploymentConfig.method) {
            case 'ssh':
                const itemsToArchive = webPageArtifacts.concat(cssArtifacts).concat(jsArtifacts).concat(nameOfImgAssets)
                                                            .map(filePattern => upath.join(distFolder, filePattern));
                let nameOfNewArchive = null;
                
                const packArtifact = () => {
                        const createDate = dateFormat(new Date(), "yyyy-mmdd-HHMM");
                        nameOfNewArchive = `${prefixOfArchive}-${createDate}.tar.gz`;
                        return gulp.src(itemsToArchive, {base:distFolder})
                                   .pipe(tar(nameOfNewArchive))
                                   .pipe(gzip({
                                       append:false
                                       /*  
                                           gulp-gzip 套件預設會在檔案名稱後面加上 .gz，因此這裡要以 append 參數指定不增加副檔名，
                                           這樣才能確保 nameOfArchive 變數有完整的套件檔名給後面函式採用。
                                           https://www.npmjs.com/package/gulp-gzip
                                       */
                                   }))
                                   .pipe(gulp.dest(pathOfNewArchives));
                }

                const gulpSSH = new GulpSSH({
                    ignoreErrors:false,
                    sshConfig:Object.assign({
                        host:deploymentConfig.host.name
                    }, deploymentConfig.host)
                });
                const transferArchiveToRemoteServer = () => {
                    return gulp.src(upath.join(pathOfNewArchives, nameOfNewArchive), {base:pathOfNewArchives})
                                .pipe(gulpSSH.dest('/tmp'));
                }
                const extractArchiveAndDeployTheWebsite = () => {
                    let pathOfTheme = `/tmp/${themeName}`;
                    let pathOfArchiveOnRemoteHost = `/tmp/${nameOfNewArchive}`;
                    return gulpSSH.exec([
                        `rm -rf ${pathOfTheme}`,
                        `mkdir ${pathOfTheme}`,
                        `tar -zxf ${pathOfArchiveOnRemoteHost} -C ${pathOfTheme}`,
                        `sudo rm -rf ${deploymentConfig.path}/${themeName}`,
                        `sudo cp -r ${pathOfTheme} ${deploymentConfig.path}`,
                        `rm -rf ${pathOfTheme}`,
                        `rm ${pathOfArchiveOnRemoteHost}`
                    ]);
                };
                return gulp.series(packArtifact, transferArchiveToRemoteServer, extractArchiveAndDeployTheWebsite);
            case 'ftp':
                const uploadThemeFilesToRemoteServer = () => {
                    /*
                        這邊 ftp 客戶端是採用 node-ftp 套件
                        https://www.npmjs.com/package/ftp
        
                        之所以沒有採用 promise-ftp 的原因是實作完成後發現程式使用的 event listener 竟然超出 node.js 上限，
                        而且建置作業還會卡在部署步驟無法正常結束，因此最後以下列做法完成此功能。
                    */
                    const settings = {
                        host:deploymentConfig.host.name,
                        port:deploymentConfig.host.port | 21,
                        secure:true,
                        secureOptions:{
                            /*
                                根據以下連結的資料可知新版 node.js 建立 TLS 連線時，會檢查網站的 ip 是否在伺服器安全憑證的 security alternative names 清單上面。
                                然而，因為我的伺服器沒有綁固定 ip，而是交由主機服務商動態指派 ip 並藉由其 dns 服務引導我的網域之請求，
                                所以伺服器 ip 極有可能不在主機服務商替我申請的 SSL 憑證上面。
                                為解決這個問題，我們必須在 node-ftp 套件 connect 函式的參數欄位 secureOptions 設定 node.js TLS 套件的設定，
                                指定 rejectUnauthorized 為 false，這樣才能正常連到遠端 ftp 伺服器。
                                https://stackoverflow.com/questions/31861109/tls-what-exactly-does-rejectunauthorized-mean-for-me
                            */
                            rejectUnauthorized:false
                        },
                        user:deploymentConfig.host.username,
                        password:deploymentConfig.host.password
                    };
                    const client = new FtpClient();
                    return new Promise((outerResolve, outerReject) => {
                                client.on('ready', () => {
                                    let remoteThemeFolder = upath.join(deploymentConfig.path, themeName);
                                    if (remoteThemeFolder.substring(0, 1) != '/') {
                                        remoteThemeFolder = '/' + remoteThemeFolder;
                                    }
                                    /*
                                        先透過 ftp 的 cwd 指令檢查要部署場景的目錄是否存在。
                                        若存在的話就先刪除，接著再部署場景。
                                    */
                                    new Promise(resolve => {
                                        client.cwd(remoteThemeFolder, error => {
                                            if (error) {
                                                //原本的目錄應該不存在，因此不需要刪除。
                                                resolve();
                                            } else {
                                                console.log('The theme folder already exists. It will be deleted before deployment of the new theme.');
                                                client.rmdir(remoteThemeFolder, true, error => {
                                                    if (error) {
                                                        const msg = `Can not remove remote theme folder ${remoteThemeFolder} before deploy. ${error}`;
                                                        client.end();
                                                        outerReject(msg);
                                                    } else {
                                                        console.log(`Successfully removed theme folder ${remoteThemeFolder} on the remote ftp server.`);
                                                        resolve();
                                                    }
                                                });
                                            }
                                        });
                                    }).then(() => {
                                        const transferFilesToRemoteRecursivelyAndSynchronized = (pathRelativeToThemeRoot) => {
                                            const localPathOfFile = upath.join(distFolder, pathRelativeToThemeRoot);
                                            const pathOfFileOnRemoteServer = upath.toUnix(upath.join(remoteThemeFolder, pathRelativeToThemeRoot));
                                            return fsPromises.stat(localPathOfFile)
                                                             .then(stat => {
                                                                    return new Promise((resolve, reject) => {
                                                                            if (stat.isDirectory()) {
                                                                                client.mkdir(pathOfFileOnRemoteServer, true, error => {
                                                                                    if (error) {
                                                                                        const msg = `Can not create directory ${pathOfFileOnRemoteServer} on the remote ftp server. ${error} `;
                                                                                        reject(msg);
                                                                                    } else {
                                                                                        console.log(`Folder ${pathOfFileOnRemoteServer} on the remote ftp server has been created successfully.`);
                                                                                        fsPromises.readdir(localPathOfFile)
                                                                                                  .then(files => {
                                                                                                      Promise.all(
                                                                                                                 files.map(file => {
                                                                                                                     return transferFilesToRemoteRecursivelyAndSynchronized(upath.join(pathRelativeToThemeRoot, file));
                                                                                                                 })
                                                                                                             ).then(() => {
                                                                                                                 resolve();
                                                                                                             });
                                                                                                  })
                                                                                                  .catch(error => {
                                                                                                      const msg = `Can not get the list of files in ${localPathOfFile}. ${error}`;
                                                                                                      reject(msg);
                                                                                                  });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                client.put(localPathOfFile, pathOfFileOnRemoteServer, error => {
                                                                                    if (error) {
                                                                                        const msg = `Can not transfer file ${localPathOfFile} to ${pathOfFileOnRemoteServer} on the remote ftp server.`;
                                                                                        reject(msg);
                                                                                    } else {
                                                                                        console.log(`File ${localPathOfFile} has been successfully transfered to ${pathOfFileOnRemoteServer} on the remote ftp server.`);
                                                                                        resolve();
                                                                                    }
                                                                                });
                                                                            }
                                                                    });
                                                             })
                                                             .catch(error => {
                                                                 const msg = `Can not get the stats of ${localPathOfFile}. ${error}`;
                                                                 throw msg;
                                                             });
                                        };
                                        transferFilesToRemoteRecursivelyAndSynchronized('.')
                                            .finally(() => {
                                                client.end();
                                            })
                                            .then(() => {
                                                outerResolve();
                                            })
                                            .catch(error => {
                                                const msg = `Fail to transfer your theme to remote ftp server. Root cause: ${error}`;
                                                outerReject(msg);
                                            });
                                    });//刪除目標資料匣之後的 then 函式
                                });
                                client.on('error', error => {
                                    const msg = `Can not connect to remote ftp server, error code ${error}. Connection settings : ${settings}`;
                                    outerReject(msg);
                                })
                                client.connect(settings);
                            });
                }
                return gulp.series(uploadThemeFilesToRemoteServer);
            case 'copy':
                return function copyArtifactsToLocalPath(){
                    /* 若部署目標是本地端的目錄，那直接解壓縮場景檔到目的地即可。 */
                    const destPath = upath.join(deploymentConfig.path, themeName);
                    return del(destPath)
                             .then(() => {
                                 console.log(`Previous installation of theme in ${destPath} has been removed.`);
                                 gulp.src(upath.join(distFolder, '*'), {base:distFolder})
                                     .pipe(gulp.dest(destPath));
                             });
                };
            default:
                //缺少重要設定，直接拋出異常。
                console.log('The method specified for deployment can not be recognized.');
                console.log('Therefore a function that does nothing will be used as deployment task.');
                return doNothing;
        }
    }
    deployTask = createDeployTask();
}
gulp.task('deploy', deployTask);

let vscodeLaunchCOnfigTask = null;
if (!hostObjExists || !hostNameExists) {
    console.log(`Host name for the vscode launch config generation task was not configured.`);
    console.log('Therefore a function that does nothing will be used as the vscode launch config generation task.');
    vscodeLaunchCOnfigTask = doNothing;
} else {
    let pages = null, protocol = 'https';
    if (_.isObjectLike(buildSettings.launch)){
        if (_.isArray(buildSettings.launch.pages)) {
            pages = buildSettings.launch.pages;
        }
        if (_.isString(buildSettings.launch.protocol) && buildSettings.launch.protocol != '') {
            protocol = buildSettings.launch.protocol;
        }
    }
    const createVscodeLaunchConfigGenerator = require('./gulpfile-vscode-launch-config');
    vscodeLaunchCOnfigTask = createVscodeLaunchConfigGenerator(`${protocol}://${deploymentConfig.host.name}`, themeName, pages);
}
gulp.task('vscodeLaunchConfig', vscodeLaunchCOnfigTask);

const jsSrcFiles = [upath.join(srcFolder, 'js/**/*.js')];
const tsSrcFiles = [upath.join(srcFolder, 'ts/**/*.ts'), upath.join(srcFolder, 'ts/**/*.tsx')];
const cssSrcFiles = [upath.join(srcFolder, 'css/**/*.css'), upath.join(srcFolder,  'css/**/*.scss')];
/*
  注意，雖然前面程式的路徑都已經改由 path 產生以便適應 windows 工作環境，
  但是因為這邊 gulp watch 只接受 unix-like 系統格式的路徑，所以這邊不需要透過 path 重新產生路徑。
  */
function monitorSrcAndRebuildTask() {
        gulp.watch(pathOfHtmlSrcFiles, prepareHtmlTask),
        gulp.watch(cssSrcFiles, prepareCSSTask),
        gulp.watch(jsSrcFiles, bundleJsTask)
        gulp.watch(tsSrcFiles, transpileTsTask),
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