const fs = require('fs');
const os = require('os');

module.exports = {
    /*
        此專案的建置指令稿採用 nodejs 平台 gulp-ssh2 套件建立連線。它會把這裡的參數提供給 gulp-ssh 套件。
        因此若要改變連線的運作方式，那可以參閱 gulp-ssh 或 ssh2 套件以了解可調整的設定。
        https://github.com/teambition/gulp-ssh
        https://github.com/mscdex/ssh2#client-methods
    */
    target:{
        /*要部署的目標伺服器。如果只是要透過檔案系統直接部署到本地其他資料夾，那這裡填 local，然後可以忽略其他參數。
          只要參數值不是 local，那建置指令稿就會視為是遠端伺服器。

          之所以這樣設計，是因為 node.js 似乎沒有單一類別既可封裝遠端，又可封裝本地的位置，即便是 fs-extra 支援的 URL 物件也不適用。
          URL 物件不像傳統字串路徑一樣支援表達相對路徑。
          https://github.com/nodejs/node/issues/12682
        */ 
        host:'localhost',
        //若要部署到遠端伺服器才要填寫接下來四項參數
        port:22,
        username:'account',
        /* 注意，
            似乎是因為 nodejs ssh2 套件只能讀取以 pem 格式儲存的私鑰，然而 mac mojave 上面新版 OpenSSH 的 ssh-keygen 預設用來儲存金鑰的格式不是 pem 格式，
            所以這裡提供給 gulp-ssh 的金鑰必須以 PEM 格式保存，否則會導致它呼叫 ssh2 時拋出 
            Error: Cannot parse privateKey: Unsupported key format 的錯誤訊息。 
            欲了解狀況可參閱以下文件:
            https://serverfault.com/questions/939909/ssh-keygen-does-not-create-rsa-private-key/941893#941893?newreg=141e245aa38c4458a5551228ae101e66

            另外，windows 上面載入 privateKey 時，可以直接用斜線表達目錄階層，不需要再透過 path 解析。
            例：fs.readFileSync('C:/Users/user/.ssh/my-key-file'),
        */
        privateKey:fs.readFileSync(`/Users/${os.userInfo().username}/.ssh/id_rsa`),
        passphrase:'passphrase'
    },
    /*要部署的壓縮檔相對於建置指令稿的路徑與名稱。
      建置指令稿只有在無法從前面其他作業得到壓縮檔的名稱時，才會使用這裡的設定。
      這項設定的用途是給開發者可以在不另外打包的情況下能夠藉由這項參數指示建置指令稿部署 wordpress 場景。 */
    archive:'./dist/wp-youjenli-website.zip',
    //要部署場景的路徑。若只是透過檔案系統部署到本地，那這裡可以填寫相對或絕對路徑。
    dest:'/var/www/html',
    //場景的名稱，必填
    nameOfTheme:'helloworld'
};