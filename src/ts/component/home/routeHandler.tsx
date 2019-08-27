/// <reference path="../../model/global-vars.d.ts"/>
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { fetchPosts } from '../../service/post-fetcher';
import {MetaDataOfPost} from '../../model/posts';
import { reactRoot } from '../../index';
import GenericHomePage from './generic';
import SevereErrorPage from './severe';
import * as terms from '../terms';
import debounce from '../../service/debounce';
import {interpretQueryString} from '../../service/interpreter';
import {convertGMTDateToLocalDate} from '../../service/formatters';

let postsShouldBeRender:MetaDataOfPost[] = null;
let currentPage:number = 0;
let totalPages:number = 0;
let errorMsgShouldBeRender:string[] = null;
let shouldRegisterScrollListener = true;
let isFetching = false;

export const queryParametersOfHome = {
    ERROR_MSG:'errorMsg'
}

export function renderHomePage(params?:any, query?:string) {
    if (postsShouldBeRender != null) {
        const queryParams = interpretQueryString(query);
        if (queryParams && queryParams[queryParametersOfHome.ERROR_MSG] != null) {
            const msgList = queryParams[queryParametersOfHome.ERROR_MSG].split(',')
                                .map(param => decodeURI(param));
                                //註：實驗發現 navigo 會自動為 route 編碼而沒有設定可以改成手動，因此這邊要先解碼才能拿來使用。
            errorMsgShouldBeRender.push(...msgList);
        }
        ReactDOM.render(
            <GenericHomePage posts={postsShouldBeRender} errorMsg={errorMsgShouldBeRender} 
                onWidgetOfErrorMsgDismissed={() => { errorMsgShouldBeRender = [] /* 重置錯誤訊息的狀態 */}} />,
            reactRoot
        );
    } else {//處理最嚴重的意外情況
        ReactDOM.render(<SevereErrorPage />,reactRoot);
    }
}

const debouncedScrollEventHandler = debounce(() => {
    if (isFetching) {
        return;
    }
    if (window.scrollY > document.documentElement.scrollHeight - window.innerHeight - 100) {
         let nextPage = currentPage + 1;
         if (totalPages <= 0 /* 意味目前沒有紀錄 */ || nextPage <= totalPages  /* 要存取的頁面沒超界 */) {
            isFetching = true;
            fetchPosts({page:nextPage})
                .then((result) => {
                    if (result) {
                        if (result.modelObjs.length > 0) {
                            postsShouldBeRender = postsShouldBeRender.concat(result.modelObjs);
                            currentPage = nextPage;
                            totalPages = result.response.headers['x-wp-totalpages'];
                            renderHomePage();
                            if (currentPage == totalPages) {
                                //既然資料已全數載入，那就不用再監聽捲動事件，因此可以取消註冊捲動事件監聽器
                                window.removeEventListener('scroll', debouncedScrollEventHandler);
                                //既然資料已全數載入，那就不用再註冊捲動事件監聽器
                                shouldRegisterScrollListener = false;
                            }
                        }
                    }
                    isFetching = false;
                });
         }
    }
});

function setupStateOfHomePage() {
    postsShouldBeRender = [];
    currentPage = 0;
    totalPages = 0;
    errorMsgShouldBeRender = [];
    shouldRegisterScrollListener = true;
}

export const routeEventHandlers = {
    before: function (done, params) {
        setupStateOfHomePage();
        if (window.wp.recentPosts) {
            if (window.wp.errorMsg) {
                errorMsgShouldBeRender.push(window.wp.errorMsg);
                delete window.wp.errorMsg;
            }
            
            //執行一些在客戶端發佈資料的前置作業
            const meaningfulPosts = window.wp.recentPosts.map((post) => {
                //轉換時間格式
                post.date = convertGMTDateToLocalDate(post.date);
                post.modified = convertGMTDateToLocalDate(post.modified);
                /*
                  Wordpress 把未分類的文章歸納到「未分類」這個類型，然而我不打算讓使用者在系統界面上以此分類名稱索引文章，
                  因此在了解如何在 wordpress 上面過濾未分類之前，先在這裡過濾伺服器送來的資料。
                */
                post.categories = post.categories.filter(category => category.name !== 'Uncategorized' );
                return post;
            });
            postsShouldBeRender = meaningfulPosts;
            currentPage = window.wp.pagination.currentPage;
            totalPages = window.wp.pagination.totalPages;
            if (currentPage == totalPages) {
                shouldRegisterScrollListener = false;
            }
            delete window.wp.recentPosts;
            delete window.wp.pagination;
            done();
        } else {
            setupStateOfHomePage();
            let targetPage = 1;
            if (params && !isNaN(params.page)) {
                targetPage = params.page;
            }
            const config = {
                page:targetPage
            }
            isFetching = true;
            fetchPosts(config)
                .then((result) => {
                    if (result) {
                        if (result.modelObjs.length > 0) {
                            postsShouldBeRender = postsShouldBeRender.concat(result.modelObjs);
                            currentPage = targetPage;
                            totalPages = result.response.headers['x-wp-totalpages'];
                            if (currentPage == totalPages) {
                                shouldRegisterScrollListener = false;
                            }
                        }
                    }
                    isFetching = false;
                    done();
                })
                .catch((error) => {
                    if (error && error.response) {//如果請求有回覆，則輸出回覆訊息。
                      let cause = `${error.response.status} ${error.response.statusText}`;
                      errorMsgShouldBeRender.push(
                        terms.unableToRetrieveDataBecauseOfServerError(terms.postInWP, cause)
                      );
                    }
                    isFetching = false;
                });
        }
    },
    after: function() {
        if (shouldRegisterScrollListener) {
            window.addEventListener('scroll', debouncedScrollEventHandler);
         }
    },
    leave: function() {
        //移除此頁面的狀態
        postsShouldBeRender = null;
        currentPage = null;
        totalPages = null;
        errorMsgShouldBeRender = null;
        shouldRegisterScrollListener = null;
        isFetching = false;

        //取消監控捲動事件。
        window.removeEventListener('scroll', debouncedScrollEventHandler);
    }
};
