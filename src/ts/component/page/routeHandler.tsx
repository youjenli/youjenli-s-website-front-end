import {reactRoot} from '../../index';
import {router} from '../../service/router';
import { isNotBlank, isFunc, isObject } from '../../service/validator';
import { Page } from '../../model/posts';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GenericPage from './generic';
import { fetchPages, ConfigurationOfFetching } from '../../service/page-fetcher';
import { navigateToHomeWithErrorMessage } from '../../index';
import { TypesOfCachedItem, addRecord, getRecord } from '../../service/cache-of-pagination';
import { addTypeOfPostOrPage } from '../post-page-routeWrapper';
import * as terms from '../template/terms';
import PageTitle from '../page-title';
import { ResultOfFetching } from '../../model/general-types';

let pageShouldBeRendered:Page = null;

export function renderPage() {
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

/*
  實驗發現 wordpress 的 rest api 沒有引入文章、專頁的分頁功能。
  當使用者發送請求給伺服器時，伺服器會一口氣回傳整篇文章…包含文章裡面的分頁點。
  因此既然我要採用非同步請求取得文章，那這個分頁功能就無法完整實作，乾脆就不採用分頁機制囉。
*/

export const routeEventHandlers = {
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
        } else if (isNotBlank(params.slug)) {//抓取文章

            const record = getRecord(TypesOfCachedItem.Page, params.slug);
            if (record) {
                pageShouldBeRendered = record;
                done();
            } else {
                //查無此頁的快取紀錄
                const config:ConfigurationOfFetching = {
                    slug:decodeURIComponent(params.slug)
                    /*
                        注意，不曉得是 xmlhttprequest 或是 axios 設計的緣故，開發者不需要事先為查詢參數編碼，
                        只要直接遞交參數內容給請求設定即可，因此這邊要先把來自伺服器或非同步請求的已編碼 slug 解碼。
                    */
                }
                fetchPages(config)
                    .then(createResultHandlerOfPageFetching({
                                doIfResultIsNotEmpty:() => { done(); },
                                doIfResultIsEmpty:() => {
                                    /* 查無文章時，導向首頁並通報異常。 */
                                    navigateToHomeWithErrorMessage(`${terms.thePublicationYouArelookingForDoesNotExist(router.lastRouteResolved().url)}${terms.thereforeYouWillBeRedirectToTheHomePage}`);
                                }
                            })
                    )
                    .catch(() => {
                        navigateToHomeWithErrorMessage(terms.failedToLoadThePage(router.lastRouteResolved().url));
                    })
            }
        } else {
            /* 既沒有從伺服器來的文章，又沒有客戶端要請求的文章匿稱時，導向首頁並通報異常。
            */
            navigateToHomeWithErrorMessage(`${terms.neitherTheDataNorTheSlugOfPublicationIsAvailable}${terms.thereforeYouWillBeRedirectToTheHomePage}`);
        }
    },
    leave: function() {
        //移除已配置的資源
        pageShouldBeRendered = null;
    }
};