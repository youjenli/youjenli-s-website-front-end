/* 此頁程式負責的事務
   對應路徑與路徑處理函式
*/
/*
    因為 Navigo 是以 UMD 模組格式輸出，而裡面 commonjs 的部分又是以 Navigo 建構函式取代 commonjs 預設 export 物件，
    所以 TypeScript 型態定義檔要採用 export = module 的方式輸出。這使得我們要用下面的方法載入 Navigo 模組。
*/
import router from './router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HomePage from './component/home';
import LongArticle from './component/placeholdingText';

const routeToHome = () => {
    ReactDOM.render(
        <HomePage>
            <LongArticle />
            <LongArticle />
            <LongArticle />
        </HomePage>,
        document.getElementById('react-root')
    );
}

router.on({
       '/':routeToHome,
       '/index.html':routeToHome
    })
    .resolve();