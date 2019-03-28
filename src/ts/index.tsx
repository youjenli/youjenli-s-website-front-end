/// <reference path="../../node_modules/countable/index.d.ts" />
import * as React from 'react';
//使用模板之前一定要載入 react 套件，否則 tsc 會報錯。
import * as ReactDOM from 'react-dom';
import { HelloWorld } from './component/helloworld'; 
import * as Countable from 'countable';
import { AxiosResponse } from 'axios';
import fetchResource from './axios-example';
/*
雖然 Prism 透過全域變數提供模組，照以下 typescript 官方文件的說法，應該使用 declare 關鍵字搭配 namespace 定義較為洽當，
但是 @types/prismjs 卻是用許多 export 輸出 Prism 模組對外曝露的接口，因此這裡要用下面這種語法才能順利載入 Prism 到 TypeScript。
 */
import * as Prism from 'prismjs';
/*
Prism 的語言模組之擴充方式是到目前所在的領域去找 Prism 變數並為其加掛功能，也就是它一樣要透過全域變數完成。
因此載入的做法是直接執行模組檔案，不需要再取為任何變數或名稱。
*/
import '../../node_modules/prismjs/components/prism-java';

import '../../node_modules/prismjs/plugins/line-numbers/prism-line-numbers';

ReactDOM.render(<HelloWorld />, 
    document.getElementById("react-root"));

Countable.count(document.getElementById('headline'), (counter) => {
    document.getElementById('word-count')
        .innerHTML =`標題共有: ${counter.characters} 字，${counter.characters} 字元`;
});

fetchResource()
.then(function(response : AxiosResponse){
    document.getElementById('axios-demo').innerHTML = JSON.stringify(response.data);
})
.catch((err) => {
    document.getElementById('axios-demo').innerHTML = err;
});

Prism.highlightElement(document.getElementById('prismjs-demo'));