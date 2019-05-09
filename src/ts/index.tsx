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
import PageOfSearchResults from './component/search-result/search-results';
import PageOfCategory from './component/category/category';
import PageOfTag from './component/tag/tag';
import {listOfFakePosts} from  './model/test/fake-posts';
import {listOfFakePages} from './model/test/fake-pages';
import {fakeSearchResults, fakeNothingFoundSearchResults, } from './model/test/fake-search-results';
import {fakeAnswerOfQueryPostsByTag, fakeAnswerOfQueryPostsByTagWithoutDesc, fakeAnswerOfQueryPostsByTagWithoutAnyPost,
        fakeAnswerOfQueryPostsByCategory, fakeAnswerOfQueryPostsByCategoryWithoutDesc, fakeAnswerOfQueryPostsByCategoryWithoutAnyPost
        } from './model/test/fake-answer-of-query-posts-by-taxonomy';
import { listOfMetaDataOfFakePosts } from './model/test/fake-meta-of-posts-for-test';

const reactRoot = document.getElementById('react-root');

const routeToHome = () => {
    const errorMsg = '未在您存取的位置 /path/to/your/uri 找到對應的資源 (http 代碼 404)，系統改以首頁替代。';
    ReactDOM.render(
        <HomePage posts={listOfMetaDataOfFakePosts} errorMsg={errorMsg}/>,
        reactRoot
    );
}

const routeToPost = (params) => {
    let postId = 0;
    if (params && params.id >= 0 && params.id < listOfFakePosts.length) {
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
    if (params && params.id >= 0 && params.id < listOfFakePosts.length) {
        pageId = params.id;
    }
    console.log(`route to page id : ${pageId}`);
    ReactDOM.render(
        <Page page={listOfFakePages[pageId]} />,
        reactRoot
    )
}

const routeToSearchResult = (params) => {
    let results = null;
    if (params && params.keyword){
        results = <PageOfSearchResults result={fakeNothingFoundSearchResults} />;
    } else {
        results = <PageOfSearchResults result={fakeSearchResults} />;
    }
    ReactDOM.render(results, reactRoot);
}

const routeToPageOfCategory = (params) => {
    let pageOfCategory = null;
    if (params && params.name) {
        if (params.name == '0') {
            pageOfCategory = <PageOfCategory answer={fakeAnswerOfQueryPostsByCategoryWithoutAnyPost} />;
        } else {
            pageOfCategory = <PageOfCategory answer={fakeAnswerOfQueryPostsByCategory}/>;    
        }        
    } else {
        pageOfCategory = <PageOfCategory answer={fakeAnswerOfQueryPostsByCategoryWithoutDesc} />;
    }
    ReactDOM.render(pageOfCategory, reactRoot);    
}

const routeToPageOfTag = (params) => {
    let pageOfTag = null;
    if (params && params.name) {
        if (params.name == '0') {
            pageOfTag = <PageOfTag answer={fakeAnswerOfQueryPostsByTagWithoutAnyPost} />;
        } else {
            pageOfTag = <PageOfTag answer={fakeAnswerOfQueryPostsByTag}/>;    
        }        
    } else {
        pageOfTag = <PageOfTag answer={fakeAnswerOfQueryPostsByTagWithoutDesc} />;
    }
    ReactDOM.render(pageOfTag, reactRoot);
}

router.on({
       '/':routeToHome,
       '/index.html':routeToHome,
       '/post/:id':routeToPost,
       '/post/':routeToPost,//為開發而暫留於此
       '/post':routeToPost,//為開發而暫留於此
       '/page/:id':routeToPage,
       '/page/':routeToPage,
       '/page':routeToPage,
       '/search':routeToSearchResult,
       '/search/:keyword':routeToSearchResult,
       '/category':routeToPageOfCategory,
       '/category/':routeToPageOfCategory,
       '/category/:name':routeToPageOfCategory,
       '/tag':routeToPageOfTag,
       '/tag/':routeToPageOfTag,
       '/tag/:name':routeToPageOfTag
    })
    .resolve();