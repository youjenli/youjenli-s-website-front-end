/// <reference path="../../model/global-vars.d.ts"/>
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { fetchPosts, ConfigurationOfFetching } from '../../service/post-fetcher';
import {MetaDataOfPost} from '../../model/posts';
import { reactRoot } from '../../index';
import GenericHomePage from './generic';
import SevereErrorPage from './severe';
import * as terms from '../terms';
import debounce from '../../service/debounce';
import {interpretQueryString} from '../../service/interpreter';
import {convertGMTDateToLocalDate} from '../../service/formatters';
import { addTypeOfPostOrPage } from '../post-page-routeWrapper';
import { isNum, isNotBlank } from '../../service/validator';
import PageTitle from '../page-title';

let postsPerPage = 12;
let postsShouldBeRender:MetaDataOfPost[] = null;
let currentPage:number = 0;
let totalPages:number = 0;
let errorMsgShouldBeRender:string[] = null;
let shouldRegisterScrollListener = true;
let isFetching = false;

export const queryParametersOfHome = {
    ERROR_MSG:'errorMsg'
}

export function renderHomePage(query?:any) 
        /* 這裡 query 的型態不能訂為 string，否則 tsc 會斷定它在 router 註冊的程式碼有型態問題 */ {
    if (postsShouldBeRender != null) {
        
        //整理錯誤訊息紀錄
        /*
            注意，這裡直接從此函式的第一個參數取得請求參數，原因與 navigo 的設計有關。
            當路由是 ""、"/" 或 "#" 這些根路徑時，第一個路徑參數會變得無意義，
            這種情況下 navigo 不會提供 null、undefined 等值作為此函式的第一個參數，
            而是直接以第二個參數──也就是請求字串取代第一個參數，因此這裡才要解析第一個參數。
        */
        const queryParams = interpretQueryString(query);
        if (queryParams && isNotBlank(queryParams[queryParametersOfHome.ERROR_MSG])) {
            const msgList = queryParams[queryParametersOfHome.ERROR_MSG].split(',')
                                .map(param => decodeURIComponent(param));
                            /*
                              註：在讀 Navigo 程式碼之後發現它不會自動為 route 編碼，
                              但是當它透過瀏覽器的歷史紀錄 API 更新目前網頁所在的路徑時，
                              瀏覽器的 API 會自動替網址編碼，而這邊會拿到編碼後的路徑，因此要先解碼才能拿來解讀。
                            */
            errorMsgShouldBeRender.push(...msgList);
        }

        /* 把前面 before hook 收集到的文章加入專頁和文章的註冊紀錄 */
        postsShouldBeRender.forEach(post => {
            addTypeOfPostOrPage(post.slug, post.type);
        });

        ReactDOM.render(
            <React.Fragment>
                <PageTitle />
                <GenericHomePage posts={postsShouldBeRender} errorMsg={errorMsgShouldBeRender} 
                    onWidgetOfErrorMsgDismissed={() => { errorMsgShouldBeRender = [] /* 重置錯誤訊息的狀態 */}} />
            </React.Fragment>,
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
            fetchPosts({
                    page:nextPage,
                    per_page:postsPerPage
                })
                .then((result) => {
                    /*
                        注意，因為使用者可能在觸發此頁面非同步取得最新文章的功能後立刻切換到新分頁，
                        這會導致這個函式後序程式碼的步驟拋出找不到 postsShouldBeRender 參考的錯誤。
                        解決此問題的辦法是再次檢查負責記錄 isFetching 有沒有因為 leave hook 而被設定成 false，
                        若已變成 false 就跳過後序步驟。
                    */
                    if (isFetching) {
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
                    }
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
            postsPerPage = window.wp.pagination.itemsPerPage || postsPerPage;

            if (currentPage == totalPages) {
                shouldRegisterScrollListener = false;
            }

            delete window.wp.recentPosts;
            delete window.wp.pagination;
            done();
        } else {
            setupStateOfHomePage();
            let targetPage = 1;
            if (params && isNum(params.page)) {
                targetPage = parseInt(params.page);
            }
            const config:ConfigurationOfFetching = {
                page:targetPage,
                per_page:postsPerPage
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
