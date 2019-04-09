const fs = require('fs');
const path = require('path');

function readdirAsync(targetPath) {
    return new Promise(function(resolve, reject){
        fs.readdir(targetPath, {withFileTypes: true} ,(err, files) => {
            //先判斷第二個參數是不是陣列。如果不是，那就意謂執行出錯了，要立刻傳送錯誤訊息給 Promise
            if (Array.isArray(files)) {
                if (files.length <= 0) {
                    // 讀取資料夾，結果發現沒有內容時，回傳空的陣列。
                    resolve([]);
                } else {
                    // 有內容的情況下，進一步根據內容的性質判斷要怎麼處置。
                    Promise.all(files.map((fileDirent) => {
                        const filePath = path.join(targetPath, fileDirent.name);
                        if (fileDirent.isDirectory()) {
                            //是資料夾，就繼續讀取其內容
                            return readdirAsync(filePath);
                        } else {
                            //不是資料夾，就回傳結果
                            return new Promise((ok, err) => {
                                ok([filePath]);
                            });                        
                        }
                    })).then((values) => {
                        const result = [];
                        values.forEach((value) => {
                            // 一一從有內容的陣列讀出內容並合併結果。
                            if (value.length > 0) {
                                value.forEach((content) => {
                                    result.push(content);
                                });                            
                            }
                        });
                        resolve(result);
                    });
                }
            } else {
               reject(err);
            }            
        });
    });
}

exports = readdirAsync;