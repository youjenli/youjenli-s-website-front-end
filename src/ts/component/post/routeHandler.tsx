/// <reference path="../../model/global-vars.d.ts"/>
import {reactRoot} from '../../index';
import {router} from '../../service/router';
import {Post} from '../../model/posts';
import { fetchPosts, ConfigurationOfFetching } from '../../service/post-fetcher';
import { isNotBlank, isFunc, isObject } from '../../service/validator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GenericPost from './generic';
import { convertGMTDateToLocalDate } from '../../service/formatters';
import { TypesOfCachedItem, addRecord, getRecord } from '../../service/cache-of-pagination';
import { addTypeOfPostOrPage } from '../post-page-routeWrapper';
import * as terms from '../template/terms';
import PageTitle from '../page-title';
import { ResultOfFetching } from '../../model/general-types';
import { renderHomePage, routeEventHandlers as routeEventHandlersOfHome, queryParametersOfHome } from '../home/routeHandler';

let postShouldBeRender:Post = null;
let isProgressAbnormal:boolean = false;

const defaultRouteHandler = () => {
    addTypeOfPostOrPage(postShouldBeRender.slug, postShouldBeRender.type);
    if (postShouldBeRender != null) {
        ReactDOM.render(
            <React.Fragment>
                <PageTitle name={postShouldBeRender.title} />
                <GenericPost post={postShouldBeRender} />
            </React.Fragment>,
            reactRoot,() => {
                router.updatePageLinks();
            }
        );
    }
    /*
        為什麼這裡只處理 postShouldBeRender 存在的狀況？
        因為前一階段 (before) 可能會找不到資料，進而導向其他路徑，使這階段拿不到文章的資訊，
        因此只在postShouldBeRender 存在的情況下去產生畫面，其他狀況就讓它過去。
    */
}

let renderHomePageWithErrorMsg = null;

export let routeHandlerOfPost = () => {
    if (isProgressAbnormal && isFunc(renderHomePageWithErrorMsg)) {
        renderHomePageWithErrorMsg();
    } else {
        defaultRouteHandler();
    }
};

export const createResultHandlerOfSinglePostFetching = (
                cb:{ doIfResultIsNotEmpty?:(result:ResultOfFetching<Post>) => void,
                    doIfResultIsEmpty?:(result:ResultOfFetching<Post>) => void  }) => {
    return (result:ResultOfFetching<Post>) => {
        if (result.modelObjs.length > 0) {
            postShouldBeRender = result.modelObjs[0];

            //接下來處理快取問題。
            if (result.isComplete) {
                addRecord(TypesOfCachedItem.Post, result.modelObjs[0].slug, result.modelObjs[0]);
            }
            if (isObject(cb) && isFunc(cb.doIfResultIsNotEmpty)) {
                cb.doIfResultIsNotEmpty(result);
            }
        } else if (isObject(cb) && isFunc(cb.doIfResultIsEmpty)) {
            cb.doIfResultIsEmpty(result);
        }
        return result;
    };
}

const prepareToPresentHomePageWithErrorMessage = (done, errorMsg:string) => {
    isProgressAbnormal = true;
    renderHomePageWithErrorMsg = () => {
        const query = `${queryParametersOfHome.ERROR_MSG}=${encodeURIComponent(errorMsg)}`
        /*
            註：這邊的請求參數一定要編碼。這是因為 renderHomePage 處理函式會解請求參數的編碼。
            至於 renderHomePage 要解請求參數編碼的原因是──似乎因為瀏覽器的歷史紀錄 API 收到路徑之後會自動編碼的關係，
            所以實驗發現當使用者令 navigo 導向特定路徑時，處理函式會接到編碼後的請求參數，因此一定要解碼才能使用。
        */
        renderHomePage(query);
    }
    routeEventHandlersOfHome.before(done);
}

/*
  實驗發現 wordpress 的 rest api 沒有引入文章、專頁的分頁功能。
  當使用者發送請求給伺服器時，伺服器會一口氣回傳整篇文章…包含文章裡面的分頁點。
  因此既然我要採用非同步請求取得文章，那這個分頁功能就無法完整實作，乾脆就不採用分頁機制囉。
*/
export const routeEventHandlersOfPost = {
    before: function (done, params) {

        postShouldBeRender = null;

        if (Array.isArray(window.wp.completePosts) && window.wp.completePosts.length > 0) {//若文章資訊已經與網頁一起送到
            //只呈現第一筆資料，照理說也應該只會有一筆。
            const firstPost = window.wp.completePosts[0];
            //轉換時間成當地時間
            firstPost.date = convertGMTDateToLocalDate(firstPost.date);
            firstPost.modified = convertGMTDateToLocalDate(firstPost.modified);
            /*
              Wordpress 把未分類的文章歸納到「未分類」這個類型，然而我不打算讓使用者在系統界面上以此分類名稱索引文章，
              因此在了解如何在 wordpress 上面過濾未分類之前，先在這裡過濾伺服器送來的資料。
            */
            firstPost.categories = firstPost.categories.filter( category => category.name !== 'Uncategorized' );
            
            postShouldBeRender = firstPost;
            addRecord(TypesOfCachedItem.Post, firstPost.slug, firstPost);
            
            delete window.wp.completePosts;
            delete window.wp.pagination;
            done();
        } else if (isNotBlank(params.slug)) {//抓取文章
            
            const record = getRecord(TypesOfCachedItem.Post, params.slug);
            if (record) {
                postShouldBeRender = record;
                done();
            } else {
                const config:ConfigurationOfFetching = {
                    slug:decodeURIComponent(params.slug)
                    /*
                        註：因為 navigo 不會將參數內容解碼，所以這邊要先將 slug 解碼，否則後續請求作業之參數會引用到亂碼。
                    */
                }
                fetchPosts(config)
                    .then(createResultHandlerOfSinglePostFetching({
                                doIfResultIsNotEmpty:() => { done(); },
                                doIfResultIsEmpty:()=> {
                                    /* 查無文章時，導向首頁並通報異常。 */
                                    prepareToPresentHomePageWithErrorMessage(done,
                                        `${terms.thePublicationYouArelookingForDoesNotExist(router.lastRouteResolved().url)}${terms.thereforeYouWillBeRedirectToTheHomePage}`);
                                }
                            })
                    )
                    .catch(() => {
                        prepareToPresentHomePageWithErrorMessage(done, terms.failedToLoadThePage(router.lastRouteResolved().url));
                    });
            }
        } else {
            /* 既沒有從伺服器來的文章，又沒有客戶端要請求的文章匿稱時，導向首頁並通報異常。
            */
            prepareToPresentHomePageWithErrorMessage(done, `${terms.neitherTheDataNorTheSlugOfPublicationIsAvailable}${terms.thereforeYouWillBeRedirectToTheHomePage}`);
        }
    },
    after: () => {
        if (isProgressAbnormal && isFunc(routeEventHandlersOfHome.after)) {
            routeEventHandlersOfHome.after();
        }
    },
    leave: () => {
        if (isProgressAbnormal  && isFunc(routeEventHandlersOfHome.after)) {
            routeEventHandlersOfHome.leave();
        } else {
            //移除已配置的資源
            postShouldBeRender = null;
        }
        renderHomePageWithErrorMsg = null;
        isProgressAbnormal = false;
    }
};