import * as React from 'react';
//使用模板之前一定要載入 react 套件，否則 tsc 會報錯。
import * as ReactDOM from 'react-dom';
import { HelloWorld } from './component/helloworld'; 

ReactDOM.render(<HelloWorld />, 
    document.getElementById("react-root"));