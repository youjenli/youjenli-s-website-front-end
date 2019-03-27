/// <reference path="../../node_modules/countable/index.d.ts" />
import * as React from 'react';
//使用模板之前一定要載入 react 套件，否則 tsc 會報錯。
import * as ReactDOM from 'react-dom';
import { HelloWorld } from './component/helloworld'; 
import * as Countable from 'countable';

ReactDOM.render(<HelloWorld />, 
    document.getElementById("react-root"));

Countable.count(document.getElementById('headline'), (counter) => {
    document.getElementById('word-count')
        .innerHTML =`標題共有: ${counter.characters} 字，${counter.characters} 字元`;
});