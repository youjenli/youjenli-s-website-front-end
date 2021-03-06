const fs = require('fs');
const os = require('os');
const upath = require('upath');

/*
    之所以把所有建置設定集中在此檔案，原因是我一直無法簡單的餵代表建置模式的作業系統環境變數給 gulp 程序，
    這樣乾脆把所有設定整理到同一個檔案，統一在此調整設定。
*/
const hostName = 'localhost';
const jsFolderRelativeToThemeRoot = 'js';
const cssFolderRelativeToThemeRoot = 'css';
const pathOfPrismComponents = upath.join(jsFolderRelativeToThemeRoot, 'prism-components');
const prismLanguageBundles = fs.readdirSync('src/js/prism-components')
    .map(fileName => {
        return {
            entryFiles: ['src/js/prism-components/' + fileName],
            outputFileName: fileName,
            pathRelativeToThemeRoot: pathOfPrismComponents
        };
    });
const nameOfMainCssSrcFile = 'style.scss';
const nameOfMainCssOutputFile = upath.basename(nameOfMainCssSrcFile, '.scss') + '.css';
const nameOfMainJsEntryFile = 'index.js';
const pathOfMainJsOutputFile = upath.join(jsFolderRelativeToThemeRoot, nameOfMainJsEntryFile);

const nameOfPrismCssFile = 'prism.css';
const nameOfPrismJsFile = 'prism.js';
const pathOfPrismJsSrcFile = upath.join(jsFolderRelativeToThemeRoot, nameOfPrismJsFile);
const pathOfPrismCssSrcFile = upath.join(cssFolderRelativeToThemeRoot, nameOfPrismCssFile);

module.exports = {
    theme:{
        //場景的名稱
        name:'youjenli'
    },
    build:{
        css:{
            sourceMap: true, //是否為這些 css 檔案產生 source map。
            bundles:[
                {
                    entryFile:'src/css/style.scss',
                    /*
                        用來設定 CleanCSS 的資訊物件，欲了解可設定的參數請參閱 cleanCSS 原始碼網站:
                        https://github.com/jakubpawlowicz/clean-css
                    */
                    cleanCSSConfig:{
                        //適用於生產環境的設定
                        /*"inline":["local"],
                        "level":1, 
                        "sourceMap":false*/
                        //適用於開發的設定
                        "format":"beautify",
                        "inline":["local"],
                        "level":1,
                        "sourceMap":true
                    },
                    outputFileName: nameOfMainCssOutputFile,
                    pathRelativeToThemeRoot:''
                },{
                    entryFile:'src/css/prism.css',
                    cleanCSSConfig:{
                        "format":"beautify",
                        "inline":["local"],
                        "level":1,
                        "sourceMap":true
                    },
                    outputFileName: nameOfPrismCssFile,
                    pathRelativeToThemeRoot:cssFolderRelativeToThemeRoot
                }
            ]
        },
        ts:{
            sourceMap: true, //是否壓縮 js 指令稿並產生 source map
            /*
                指定要以哪些 ts 或 js 檔案作為程式執行點打包 js 應用程式。
            */
            bundles:[
                {
                    /*
                        要令 browserify 從哪些 ts 檔案開始產生前端 js 檔案。
                        要注意的是就算有多個檔案，最後他們仍會被包含在同一個 js 檔案中。
                    */
                    entryFiles:['src/ts/index.tsx'],
                    //給 typescript transpiler 的設定，格式與 tsconfig.js 相同
                    tsConfig:{
                        "compilerOptions": {
                            "lib":["dom", "es6"],
                            "target":"es5",
                            "jsx":"react"
                        }
                    },
                    excludeAmbientModule: 'prismjs',
                    outputFileName: nameOfMainJsEntryFile, //打包好的 js 檔案名稱
                    pathRelativeToThemeRoot:jsFolderRelativeToThemeRoot
                }
            ]
        },
        js:{
            uglify: true, //是否壓縮 js 指令稿
            sourceMap: true, //是否產生 source map
            /*
                指定要以哪些 ts 或 js 檔案作為程式執行點打包 js 應用程式。
            */
            bundles:[
                {
                    entryFiles: ['src/js/prism.js'],
                    outputFileName: nameOfPrismJsFile,
                    pathRelativeToThemeRoot: jsFolderRelativeToThemeRoot
                },
                ...prismLanguageBundles
            ]
        },
        html:{
            /*
                部分功能需要先替換 php 程式中的參數才可正常使用。
                以下是替換的參數內容設定:
            */
            variableSubstitution:{
                "template-parts/parameters.php": {
                    /*
                      客戶端的 navigo router 必須擁有包含通訊協定的完整 host name，因此我得透過 wordpress 的 api 輸出此資訊到客戶端
                      然而我必須在呼叫 wordpress 的 api 時，指定網站的通訊協定；在此同時，開發模式和生產模式的通訊協定又不同，
                      因此要替換此 php 指令稿當中呼叫 wordpress api 提供網站名稱的函式之參數。
                
                      檔案參數的路徑參考基準是 html 資料夾的路徑，也就是 /src/html
                    */
                    connectionProtocolOfThisSite: 'https',
                    /*
                        若要使用 disqus 留言板，那要在以下欄位提供留言板的名稱：
                    */
                    shortNameOfDisqusForum: 'youjenli-dev',
                    jsSrcFolder:jsFolderRelativeToThemeRoot, //存放 javascript 執行檔的路徑，相對於場景根路徑。
                    pathOfMainCssOutputFile: nameOfMainCssOutputFile, //主要 css 檔案的路徑，相對於場景根路徑。
                    pathOfMainJsOutputFile: pathOfMainJsOutputFile, //主要 js 檔案的路徑，相對於場景根路徑。
                    pathOfPrismJsSrcFile: pathOfPrismJsSrcFile, //prismjs 的 js 檔案路徑，相對於場景根路徑。
                    pathOfPrismCssSrcFile: pathOfPrismCssSrcFile, //prismjs 的 css 檔案路徑，相對於場景根路徑。
                }
            }
        }
    },
    //專案的部署設定
    deploy:{
        /*
            部署場景的方式，共用 ftp、ssh 和 copy 三種方式可供選擇。
            填 ftp、ssh 會分別採用這種協定部署場景到特定伺服器；填 copy 會複製場景檔案到此物件 path 屬性設定的路徑。
        */
        method:'ssh',
        /*
            此專案的建置指令稿採用 nodejs 平台 gulp-ssh2 套件建立連線。它會把這裡的參數提供給 gulp-ssh 套件。
            因此若要改變連線的運作方式，那可以參閱 gulp-ssh 或 ssh2 套件以了解可調整的設定。
            https://github.com/teambition/gulp-ssh
            https://github.com/mscdex/ssh2#client-methods
        */
        host:{
            /*要部署的目標伺服器。如果只是要透過檔案系統直接部署到本地其他資料夾，那 host 區塊可以不填任何參數，然後可以忽略其他參數。
            */ 
            name:hostName,
            //若要部署到遠端伺服器才要填寫接下來四項參數
            port:22,//ssh 或 ftp 連線的埠號
            username:'account',//ssh 或 ftp 的帳號
            /* 
               如果部署的方法是 ssh，則這裡可以填 privateKey 和 passphrase 透過金鑰認證身份
               關於 privateKey 參數的注意事項:
               1. 似乎是因為 nodejs ssh2 套件只能讀取以 pem 格式儲存的私鑰，不支援 openssh 的格式，
                  然而 mac mojave 上面新版 OpenSSH 的 ssh-keygen 預設用來儲存金鑰的格式不是 pem 格式，
                  因此這裡要提供給 gulp-ssh 的金鑰必須改以 PEM 格式保存，否則會導致它呼叫 ssh2 時拋出以下錯誤訊息: 

                  Error: Cannot parse privateKey: Unsupported key format

                  欲了解狀況可參閱以下文件:
                  https://serverfault.com/questions/939909/ssh-keygen-does-not-create-rsa-private-key/941893#941893?newreg=141e245aa38c4458a5551228ae101e66
            
               2. 若要產生 gulp-ssh 可用的金鑰，可以到以下連結下載並安裝 Mac OSX 版的 puttygen。
                  https://www.puttygen.com/
                  接著只要用以下語法就可以在產生 pem 格式的金鑰: 

                  puttygen -t rsa -b 4096 -C "註解，若在 GCP 就是登入帳號名稱" -m PEM
            
               3. 連線用的金鑰在 Mac OS 的存取權限必須為設定 600，否則系統會拒絕存取。

               4. 在 windows 上面載入 privateKey 時，可以直接用斜線表達目錄階層，不需要再透過 path 解析。
                  例：fs.readFileSync('C:/Users/user/.ssh/my-key-file'),
            */
            privateKey:fs.readFileSync(`C:/Users/${os.userInfo().username}/.ssh/id_rsa`),
            passphrase:'passphrase'
            /*
              如果連線方法是 ftp，或著以密碼認證 ssh 使用者的身份，那這裡可以藉由 password 提供密碼
            */
            //password:'****'
        },
        /*要部署場景的路徑，尾端不用加斜線。
          若只是透過檔案系統部署到本地，那這裡就可以自由填寫相對或絕對路徑。
        */
        path:'/var/www/html/projectName/wp-content/themes',
    },
    launch:{
        protocol:'https',//指定預設頁面的傳輸協定
        pages:[//列出要產生 vscode 執行設定的網頁
            {
                name:'chrome 查無此資源',
                url:`https://${hostName}/category/3345678`
            }
        ]
    }
}