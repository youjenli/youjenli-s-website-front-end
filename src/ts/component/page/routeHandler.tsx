import {reactRoot} from '../../index';
import {router} from '../../service/router';
import { isNotBlank, isFunc, isObject } from '../../service/validator';
import { Page } from '../../model/posts';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GenericPage from './generic';
import { fetchPages, ConfigurationOfFetching } from '../../service/page-fetcher';
import { TypesOfCachedItem, addRecord, getRecord } from '../../service/cache-of-pagination';
import { addTypeOfPostOrPage } from '../post-page-routeWrapper';
import * as terms from '../template/terms';
import PageTitle from '../page-title';
import { ResultOfFetching } from '../../model/general-types';
import { renderHomePage, routeEventHandlers as routeEventHandlersOfHome, queryParametersOfHome } from '../home/routeHandler';

let pageShouldBeRendered:Page = null;
let isProgressAbnormal:boolean = false;

const defaultRouteHandler = () => {
    addTypeOfPostOrPage(pageShouldBeRendered.slug, pageShouldBeRendered.type);
    if (pageShouldBeRendered != null) {
        ReactDOM.render(
            <React.Fragment>
                <PageTitle name={pageShouldBeRendered.title} />
                <GenericPage page={pageShouldBeRendered} />
            </React.Fragment>,
            reactRoot,() => {
                router.updatePageLinks();
            }
        );
    }
    /*
        為什麼這裡只處理 pageShouldBeRendered 存在的狀況？
        因為前一階段 (before) 可能會找不到資料，進而導向其他路徑，使這階段拿不到文章的資訊，
        因此只在 pageShouldBeRendered 存在的情況下去產生畫面，其他狀況就讓它過去。
    */
}

let renderHomePageWithErrorMsg = null;

export let routeHandlerOfPage = () => {
    if (isProgressAbnormal && isFunc(renderHomePageWithErrorMsg)) {
        renderHomePageWithErrorMsg();
    } else {
        defaultRouteHandler();
    }
};

export const createResultHandlerOfPageFetching = (
                cb:{ doIfResultIsNotEmpty?:(result:ResultOfFetching<Page>) => void,
                     doIfResultIsEmpty?:(result:ResultOfFetching<Page>) => void }) => {
    return (result:ResultOfFetching<Page>) => {
        if (result.modelObjs.length > 0) {
            pageShouldBeRendered = result.modelObjs[0];

            //再來處理快取問題。
            if (result.isComplete) {
                addRecord(TypesOfCachedItem.Page, result.modelObjs[0].slug, result.modelObjs[0]);
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
export const routeEventHandlersOfPage = {
    before: function (done, params) {

        pageShouldBeRendered = null;
        if (Array.isArray(window.wp.completePages) && window.wp.completePages.length > 0) {//若文章資訊已經與網頁一起送到
            //只呈現第一筆資料，照理說也應該只會有一筆。
            const firstPage = window.wp.completePages[0];

            pageShouldBeRendered = firstPage;
            addRecord(TypesOfCachedItem.Page, firstPage.slug, firstPage);

            delete window.wp.completePages;
            delete window.wp.pagination;
            done();
        } else {//需要抓取文章
            /*
                因為 post-slug wrapper 會先檢查 slug 是否為空，所以這邊不需要再檢查。
                如果頁面內容不是跟隨網頁來，那這裡就一定有 slug。
            */
            const record = getRecord(TypesOfCachedItem.Page, params.slug);
            if (record) {
                pageShouldBeRendered = record;
                done();
            } else {
                //查無此頁的快取紀錄
                const config:ConfigurationOfFetching = {
                    slug:decodeURIComponent(params.slug)
                    /*
                        註：因為 navigo 不會將參數內容解碼，所以這邊要先將 slug 解碼，否則後續請求作業之參數會引用到亂碼。
                    */
                }
                fetchPages(config)
                    .then(createResultHandlerOfPageFetching({
                                doIfResultIsNotEmpty:() => { done(); },
                                doIfResultIsEmpty:() => {
                                    /* 查無文章時，呈現首頁並通報異常。 */
                                    prepareToPresentHomePageWithErrorMessage(done,
                                        `${terms.thePublicationYouArelookingForDoesNotExist(router.lastRouteResolved().url)}${terms.thereforeYouWillBeRedirectToTheHomePage}`)
                                }
                            })
                    )
                    .catch(() => {
                        prepareToPresentHomePageWithErrorMessage(done,
                            terms.failedToLoadThePage(router.lastRouteResolved().url))
                    });
            }
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
            pageShouldBeRendered = null;
        }
        renderHomePageWithErrorMsg = null;
        isProgressAbnormal = false;
    }
};