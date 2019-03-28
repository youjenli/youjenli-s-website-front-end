/*
    因為 Navigo 是以 UMD 模組格式輸出，而裡面 commonjs 的部分又是以 Navigo 建構函式取代 commonjs 預設 export 物件，
    所以 TypeScript 型態定義檔要採用 export = module 的方式輸出。這使得我們要用下面的方法載入 Navigo 模組。
*/
import Navigo = require('navigo');
import * as React from 'react';
//使用模板之前一定要載入 react 套件，否則 tsc 會報錯。
import * as ReactDOM from 'react-dom';
import { HelloWorld } from './component/helloworld'; 

let root = null;
const router = new Navigo(root);
window.addEventListener('DOMContentLoaded', () => {
    router.on('/hello', () => {
        ReactDOM.render(
            <HelloWorld />,
            document.getElementById("react-root")
        );
    }).resolve();
    router.navigate('/hello');
});
