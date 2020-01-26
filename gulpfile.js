const gulp = require('gulp');
const clean = require('gulp-clean');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const GulpSSH = require('gulp-ssh');
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
const FtpClient = require('ftp');
const fsPromises = require('fs').promises;
const dateFormat = require('dateformat');
const del = require('del');
/*
  因為 Linux 上面要安裝其他套件才能解壓縮 zip 檔，所以後來改用 tar 和 gz 來封裝場景。
*/
const path = require('path');
const upath = require('upath');
const _ = require('lodash');

const buildSettings = require('./build-settings');
const srcRoot = path.join(__dirname, 'src');
const distRoot = path.join(__dirname, 'dist'); //輸出建置成品的路徑
const pathOfNewArchives = path.join(__dirname, 'archives');//存放場景壓檔案的目錄
const jsBundleName = 'index';
const patternsOfHtmlSrcFile = ['**/*.php', '**/*.html'];
const cssArtifacts = ['**/*.css', '**/*.css.map'];
const jsArtifacts = [`**/${jsBundleName}.js`, `**/${jsBundleName}.js.map`];
const nameOfImgAssets = ['*.png', '*.svg', '*.jpeg'].map(filePattern => path.join('img', filePattern));
const themeName = _.isObjectLike(buildSettings.theme) && _.isString(buildSettings.theme.name) && buildSettings.theme.name !== '' ?
                    buildSettings.theme.name : 'youjenli'
const prefixOfArchive = `wp-${themeName}-theme`;

function removeHtmlArtifact() {
    return gulp.src(
                    patternsOfHtmlSrcFile.map(filePattern => path.join(distRoot, filePattern)), {read:false})
                .pipe(clean());
}

function removeJSArtifact() {
    return gulp.src(
                    jsArtifacts.map(filePattern => path.join(distRoot, filePattern)), {read:false})
                .pipe(clean());
}

function removeCSSArtifact(){
    return gulp.src(cssArtifacts.map(filePattern => path.join(distRoot, filePattern)), {read:false})
                .pipe(clean());
}

function removeImgArtifact() {
    return gulp.src(nameOfImgAssets.map(srcFiles => path.join(distRoot, srcFiles)), {
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

const prepareCSSTask = gulp.series(removeCSSArtifact, transpileSCSS);
gulp.task('prepareCSS', prepareCSSTask);

const imgSrcFiles = nameOfImgAssets.map((img) => {
    return path.join(srcRoot, img);
});
const prepareImgTask = gulp.series(removeImgArtifact, 
    function copyImgs() {
        return gulp.src(imgSrcFiles, { base:srcRoot })
                .pipe(gulp.dest(distRoot));
    });
gulp.task('prepareImg', prepareImgTask);

const htmlSrcRoot = path.join(srcRoot, 'html');
const pathOfHtmlSrcFiles = ['**/*.php', '**/*.html'].map(filePattern => path.join(htmlSrcRoot, filePattern));
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
gulp.task('default', buildTask);

function doNothing(done){ done(); }

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
    console.log('Therefore a function that does nothing will be create for the theme deployment task.');
    deployTask = doNothing;
} else {
    switch (deploymentConfig.method) {
        case 'ssh':
        case 'ftp':
            if (!hostObjExists) {
                console.log(`Host settings for the theme deployment task was not configured.`);
                console.log('Therefore a function that does nothing will be create for the theme deployment task.');
                deployTask = doNothing;
                break;
            }
            if (!hostNameExists) {
                console.log(`Host name for the theme deployment task was not configured.`);
                console.log('Therefore a function that does nothing will be create for the theme deployment task.');
                deployTask = doNothing;
                break;
            }
        case 'ssh':
            const itemsToArchive = patternsOfHtmlSrcFile.concat(cssArtifacts).concat(jsArtifacts).concat(nameOfImgAssets)
                                                        .map(filePattern => path.join(distRoot, filePattern));
            let nameOfNewArchive = null;
            
            const packArtifact = () => {
                    const createDate = dateFormat(new Date(), "yyyy-mmdd-HHMM");
                    nameOfNewArchive = `${prefixOfArchive}-${createDate}.tar.gz`;
                    return gulp.src(itemsToArchive, {base:distRoot})
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
            
            /* 若部署目標不在本地，那就建立 SSH 連線。
             */
            const gulpSSH = new GulpSSH({
                ignoreErrors:false,
                sshConfig:Object.assign({
                    host:deploymentConfig.host.name
                }, deploymentConfig.host)
            });
            const transferArchiveToRemoteServer = () => {
                return gulp.src(path.join(pathOfNewArchives, nameOfNewArchive), {base:pathOfNewArchives})
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
            deployTask = gulp.series(packArtifact, transferArchiveToRemoteServer, extractArchiveAndDeployTheWebsite);
            break;
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
                                        const localPathOfFile = upath.join(distRoot, pathRelativeToThemeRoot);
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
            deployTask = gulp.series(uploadThemeFilesToRemoteServer);
            break;
        case 'copy':
            deployTask = function copyArtifactsToLocalPath(){
                /* 若部署目標是本地端的目錄，那直接解壓縮場景檔到目的地即可。 */
                const destPath = upath.join(deploymentConfig.path, themeName);
                return del(destPath)
                         .then(() => {
                             console.log(`Previous installation of theme in ${destPath} has been removed.`);
                             gulp.src(upath.join(distRoot, '*'), {base:distRoot})
                                 .pipe(gulp.dest(destPath));
                         });
            };
            break;
        default:
            //缺少重要設定，直接拋出異常。
            console.log('The method specified for deployment can not be recognized.');
            console.log('Therefore a function that does nothing will be create for deployment task.');
            deployTask = doNothing;
            break;
    }
}
gulp.task('deploy', deployTask);

let vscodeLaunchCOnfigTask = null;
if (!hostObjExists || !hostNameExists) {
    console.log(`Host name for the vscode launch config generation task was not configured.`);
    console.log('Therefore a function that does nothing will be create for the vscode launch config generation task.');
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