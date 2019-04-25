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
import HomePage from './component/home/home';
import PostPage from './component/post/post';
import Page from './component/page/page';
import {listOfFakePosts} from  './model/test/fake-posts';
import {listOfFakePages} from './model/test/fake-pages';

const reactRoot = document.getElementById('react-root');

const routeToHome = () => {
    ReactDOM.render(
        <HomePage />,
        reactRoot
    );
}

const routeToPost = (params) => {
    let postId = 0;
    if (params.id >= 0 && params.id < listOfFakePosts.length) {
        postId = params.id;
    }
    console.log(`route to post id : ${postId}`);
    ReactDOM.render(
        <PostPage post={listOfFakePosts[postId]}/>,
        reactRoot
    );
}

const routeToPage = (params) => {
    let pageId = 0;
    if (params.id >= 0 && params.id < listOfFakePosts.length) {
        pageId = params.id;
    }
    console.log(`route to page id : ${pageId}`);
    ReactDOM.render(
        <Page page={listOfFakePages[pageId]} />,
        reactRoot
    )
}

router.on({
       '/':routeToHome,
       '/index.html':routeToHome,
       '/post/:id':routeToPost,
       '/post/':routeToPost,//為開發而暫留於此
       '/post':routeToPost,//為開發而暫留於此
       '/page/:id':routeToPage,
       '/page/':routeToPage,
       '/page':routeToPage
    })
    .resolve();