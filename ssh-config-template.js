const fs = require('fs');
const os = require('os');

/*
    這是提供 ssh 連線資訊給 gulp-ssh 套件的設定檔案。
    https://github.com/teambition/gulp-ssh

    gulp-ssh 依賴 nodejs 平台 ssh2 套件建立連線，因此可以直接向 ssh2 了解可調校的設定和選項。
    https://github.com/mscdex/ssh2#client-methods
*/
module.exports = {
    host:'localhost',
    prt:22,
    username:'account',
    /* 注意，
        似乎是因為 nodejs ssh2 套件只能讀取以 pem 格式儲存的私鑰，然而 mac mojave 上面新版 OpenSSH 的 ssh-keygen 預設用來儲存金鑰的格式不是 pem 格式，
        所以這裡提供給 gulp-ssh 的金鑰必須以 PEM 格式保存，否則會導致它呼叫 ssh2 時拋出 
        Error: Cannot parse privateKey: Unsupported key format 的錯誤訊息。 
        欲了解狀況可參閱以下文件:
        https://serverfault.com/questions/939909/ssh-keygen-does-not-create-rsa-private-key/941893#941893?newreg=141e245aa38c4458a5551228ae101e66
    */
    privateKey:fs.readFileSync(`/Users/${os.userInfo().username}/.ssh/id_rsa`),
    passphrase:'passphrase'
};