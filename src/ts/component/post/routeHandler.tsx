/// <reference path="../../model/global-vars.d.ts"/>
import {reactRoot} from '../../index';
import {router} from '../../service/router';
import { queryParametersOfHome } from '../home/routeHandler';
import {Post} from '../../model/posts';
import { fetchPosts, ConfigurationOfFetching } from '../../service/post-fetcher';
import {isString} from '../../service/validator';
import * as terms from './terms';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GenericPost from './generic';
import { convertGMTDateToLocalDate } from '../../service/formatters';
import { TypesOfCachedItem, addRecord, getRecord } from '../../service/cache-of-pagination';

let postShouldBeRender:Post = null;

export function renderPost() {
    if (postShouldBeRender != null) {
        ReactDOM.render(
            <GenericPost post={postShouldBeRender} />,
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

/*
  實驗發現 wordpress 的 rest api 沒有引入文章、專頁的分頁功能。
  當使用者發送請求給伺服器時，伺服器會一口氣回傳整篇文章…包含文章裡面的分頁點。
  因此既然我要採用非同步請求取得文章，那這個分頁功能就無法完整實作，乾脆就不採用分頁機制囉。
*/

export const routeEventHandlers = {
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
            firstPost.categories = firstPost.categories.filter((category) => { category.name != 'Uncategorized' });
            
            postShouldBeRender = firstPost;
            addRecord(TypesOfCachedItem.Post, firstPost.slug, firstPost);
            
            delete window.wp.completePosts;
            delete window.wp.pagination;
            done();
        } else if (isString(params.slug)) {//抓取文章
            
            const record = getRecord(TypesOfCachedItem.Post, params.slug);
            if (record) {
                postShouldBeRender = record;
                done();
            } else {
                const config:ConfigurationOfFetching = {
                    slug:params.slug
                }
                fetchPosts(config)
                    .then((result) => {
                        if (result.modelObjs.length > 0) {
                            postShouldBeRender = result.modelObjs[0];
                            addRecord(TypesOfCachedItem.Post, params.slug, result.modelObjs[0]);
                        } else {
                            /* 查無文章時，導向首頁並通報異常。 */
                            //不要監聽 scroll 事件，以免發生異常。
                            const route = 
                                `home?${queryParametersOfHome.ERROR_MSG}=${terms.thePostYouArelookingForDoesNotExist(router.lastRouteResolved().url)}${terms.thereforeYouWillBeRedirectToTheHomePage}`;
                            router.navigate(route);
                        }
                        done();
                    });
            }
        } else {
            /* 既沒有從伺服器來的文章，又沒有客戶端要請求的文章匿稱時，導向首頁並通報異常。
            */
            const route = `home?${queryParametersOfHome.ERROR_MSG}=${terms.neitherPostDataNorSlugOfPostIsAvailable}${terms.thereforeYouWillBeRedirectToTheHomePage}`;
            router.navigate(route);
        }
    },
    leave: function() {
        //移除已配置的資源
        postShouldBeRender = null;
    }
};