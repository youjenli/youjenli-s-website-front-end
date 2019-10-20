import {router} from '../../service/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { reactRoot } from '../../index';
import { fetchTags } from '../..//service/tag-fetcher';
import { fetchPosts } from '../../service/post-fetcher';
import * as pg from '../../model/pagination';
import { convertGMTDateToLocalDate } from '../../service/formatters';
import { MetaDataOfPost } from '../../model/posts';
import {Tag} from '../../model/terms';
import GenericTag from './generic';
import * as terms from './terms';
import * as generalTerms from '../terms';
import { TypesOfCachedItem, addRecord, getRecord, deleteRecord } from '../../service/cache-of-pagination';
import { addTypeOfPostOrPage } from '../post-page-routeWrapper';
import { isNotBlank, isObject } from '../../service/validator';
import PageTitle from '../page-title';
import { renderHomePage, routeEventHandlers as routeEventHandlersOfHome, queryParametersOfHome } from '../home/routeHandler';

const DEFAULT_POSTS_PER_PAGE = 10;
let postsPerPage = 0;
let tagShouldBeDisplayed:Tag = null;
let postsShouldBeRendered:MetaDataOfPost[] = null;
let foundPosts:number = 0;
let pagination:pg.Pagination = null;

const resetStateOfHandler = () => {
    postsShouldBeRendered = null;
    tagShouldBeDisplayed = null;
    foundPosts = 0;
    postsPerPage = DEFAULT_POSTS_PER_PAGE;
    pagination = null;
}

const defaultHandlerOfTag = () => {
    postsShouldBeRendered.forEach(post => {
        addTypeOfPostOrPage(post.slug, post.type);
    });
    ReactDOM.render(
        <React.Fragment>
            <PageTitle name={terms.titleOfPageOfTag(tagShouldBeDisplayed.name)} />
            <GenericTag tag={tagShouldBeDisplayed} numberOfResults={foundPosts}
                pageContent={postsShouldBeRendered} pagination={pagination} />
        </React.Fragment>,
        reactRoot, () => {
            router.updatePageLinks();
        }
    )
}

export let routeHandlerOfTag = defaultHandlerOfTag;

const displayHomePageWithErrorMsg = (done, errorMsg:string) => {
    routeEventHandlersOfTag.after = routeEventHandlersOfHome.after;
    routeEventHandlersOfTag.leave = () => {
        routeEventHandlersOfHome.leave();
        
        //記得還原本來的路由設定
        routeEventHandlersOfTag = defaultEventHandlers
        routeHandlerOfTag = defaultHandlerOfTag;
    }
    routeHandlerOfTag = () => {
        const query = 
            `${queryParametersOfHome.ERROR_MSG}=${errorMsg}`;
        renderHomePage(query);
    }
    
    routeEventHandlersOfHome.before(done);
}

const defaultEventHandlers = {
    before:function(done, params) {
        if (isObject(params)) {
            const slug = params['slug'];
            let page = 1;
            if (isNotBlank(params['page'])) {
                page = parseInt(params['page']);
            }
            //判斷是否要另外發送請求才能取得標籤頁的資料
            if (window.wp.archive && window.wp.archive.tag) {
                resetStateOfHandler();
                tagShouldBeDisplayed = window.wp.archive.tag.taxonomy;
                postsShouldBeRendered = window.wp.archive.tag.posts;
                foundPosts = window.wp.archive.tag.foundPosts;
                postsPerPage = window.wp.archive.tag.postsPerPage;
                //轉換時間成當地時間
                postsShouldBeRendered.forEach(post => {
                    post.date = convertGMTDateToLocalDate(post.date);
                    post.modified = convertGMTDateToLocalDate(post.modified);
                    /*
                        Wordpress 把未分類的文章歸納到「未分類」這個類型，然而我不打算讓使用者在系統界面上以此分類名稱索引文章，
                        因此在了解如何在 wordpress 上面過濾未分類之前，先在這裡過濾伺服器送來的資料。
                    */
                    post.categories = post.categories.filter( category => category.name !== 'Uncategorized' );
                });
                pagination = pg.getPagination();

                //產生快取紀錄
                const contentOfRecord = {
                    pagination:{
                        endSize:pagination.endSize,
                        midSize:pagination.midSize,
                        totalPages:pagination.totalPages,
                        baseUrl:pagination.baseUrl,
                        foundPosts:foundPosts,
                        postsPerPage:postsPerPage
                    },
                    tag:window.wp.archive.tag.taxonomy,
                    pages:{}
                }
                contentOfRecord.pages[page] = window.wp.archive.tag.posts;
                addRecord(TypesOfCachedItem.Tag, slug, contentOfRecord);

                delete window.wp.archive.tag;
                delete window.wp.pagination;
                done();
            } else {
                /*
                    從快取中提出此 slug 的紀錄，然後再根據狀況決定要發送哪些請求
                */
                const record = getRecord(TypesOfCachedItem.Tag, slug);
                if (record) {
                    /*
                      快取中有紀錄，再來要看看是否已有此分頁

                      接下來要解決以下問題：
                      1. 確認伺服器上關於此標籤以及此標籤下的文章資訊是否已更新
                      2. 取得要請求的分頁資料
  
                      解決的方法是根據本地快取內的資訊發送請求去拿分頁的資料，
                      接著要是發現回傳的文章數與快取中的紀錄不同，那就視為快取的內容與伺服器的狀態已不同，因此要重新建立分頁的快取紀錄，
                      反之則假定標籤的資訊沒變，標籤底下的文章數量也沒變，接著照預訂計畫把查詢結果加到快取中並呈現新的分頁。
                
                      在開始之前先回復與發送請求相關，而且不受請求結果影響的狀態
                    */
                    if (record.pages[page] == undefined) {
                        //沒有此分頁的紀錄，那就去查吧。
                        const tag = record.tag;
                        const postsPerPageFromCache = record.pagination.postsPerPage;
                        const configOfFetchingPosts = {
                            tags:[tag.id],
                            perPage: postsPerPageFromCache,
                            page:page
                        }
                        fetchPosts(configOfFetchingPosts)
                            .then(result => {
                                const latestTotalPages = result.response.headers['x-wp-totalpages'];
                                const latestFoundPosts = result.response.headers['x-wp-total'];

                                postsShouldBeRendered = result.modelObjs;
                                foundPosts = latestFoundPosts;
                                postsPerPage = postsPerPageFromCache;

                                if (record.pagination.foundPosts == latestFoundPosts) {
                                    /*
                                      依據文章總數推估標籤底下的文章沒變，因此直接更新分頁資訊即可
                                    */
                                    pagination = {
                                        endSize:record.pagination.endSize,
                                        midSize:record.pagination.midSize,
                                        totalPages:record.pagination.totalPages,
                                        currentPage:page,
                                        baseUrl:record.pagination.baseUrl
                                    }

                                    if (result.isComplete) {
                                        //若此分頁內容有完整才把它加入快取，反之則不加入。
                                        record.pages[page] = result.modelObjs;
                                    }
                                } else {
                                    /*
                                      依據文章總數推估標籤底下的文章有變，因此要重建此標籤頁的快取紀錄
                                    */
                                   pagination = {
                                       endSize:record.pagination.endSize,
                                       midSize:record.pagination.midSize,
                                       totalPages:latestTotalPages,
                                       currentPage:page,
                                       baseUrl:record.pagination.baseUrl
                                   }
                               
                                   //接著更新快取紀錄
                                   if (result.isComplete) {
                                       record.pagination['totalPages'] = latestTotalPages;
                                       record.pagination['foundPosts'] = latestFoundPosts;
                                       record.pages = {};
                                       record.pages[page] = result.modelObjs;
                                   } else {
                                       deleteRecord(TypesOfCachedItem.Tag, slug);
                                   }
                                }
                            })
                            .catch(() => {
                                //查詢文章失敗，淨空要呈現的分頁文章並更新分頁至新的狀態。
                                postsShouldBeRendered = null;
                                pagination['currentPage'] = page;
                            })
                            .finally( () => done() );
                    } else {
                        //有分頁，直接從快取載入分頁內容
                        pagination = {
                            endSize:record.pagination.endSize,
                            midSize:record.pagination.midSize,
                            totalPages:record.pagination.totalPages,
                            currentPage:page,
                            baseUrl:record.pagination.baseUrl
                        }
                        tagShouldBeDisplayed = record.tag;
                        postsPerPage = record.pagination.postsPerPage;
                        foundPosts = record.pagination.foundPosts;
                        postsShouldBeRendered = record.pages[page];

                        done();
                    }
                } else {
                    //快取中無此標籤頁的紀錄，那就去找吧。
                    resetStateOfHandler();
                    const config = {
                        slug:decodeURIComponent(slug)
                        /*
                            注意，不曉得是 xmlhttprequest 或是 axios 設計的緣故，開發者不需要事先為查詢參數編碼，
                            只要直接遞交參數內容給請求設定即可，因此這邊要先把來自伺服器或非同步請求的已編碼 slug 解碼。
                        */
                    }
                    fetchTags(config)
                        .then(result => {
                            if (result.modelObjs.length > 0 ) {
                                    tagShouldBeDisplayed = result.modelObjs.shift();

                                    const configOfFetchingPosts = {
                                        tags:[tagShouldBeDisplayed.id],
                                        perPage: postsPerPage,
                                        page:page
                                    }
                                    fetchPosts(configOfFetchingPosts)
                                        .then(result => {

                                            const totalPages = result.response.headers['x-wp-totalpages'];
                                            const baseUrl = pg.getBaseUrl();
                                            foundPosts = result.response.headers['x-wp-total'];
                                            pagination = {
                                                endSize:pg.defaultEndSize,
                                                midSize:pg.defaultMidSize,
                                                totalPages:totalPages,
                                                currentPage:page,
                                                baseUrl:baseUrl
                                            }
                                            postsShouldBeRendered = result.modelObjs;
                                            //註：這裡不用設定 postsPerPage，因為已經在最上面重設了。

                                            //接下來產生快取紀錄
                                            if (result.isComplete) {
                                                const contentOfRecord = {
                                                    pagination:{
                                                        endSize:pg.defaultEndSize,
                                                        midSize:pg.defaultMidSize,
                                                        totalPages:totalPages,
                                                        baseUrl:baseUrl,
                                                        foundPosts:foundPosts,
                                                        postsPerPage:postsPerPage
                                                    },
                                                    tag:tagShouldBeDisplayed,
                                                    pages:{}
                                                }
                                                contentOfRecord.pages[page] = postsShouldBeRendered;
                                                addRecord(TypesOfCachedItem.Tag, slug, contentOfRecord);
                                            }
                                        })
                                        .catch(() => {
                                            //雖然有查到標籤，但查詢文章卻失敗
                                            postsShouldBeRendered = null;
                                            pagination = {
                                                endSize:pg.defaultEndSize,
                                                midSize:pg.defaultMidSize,
                                                totalPages:0,
                                                currentPage:page,
                                                baseUrl:pg.getBaseUrl()
                                            }
                                            foundPosts = 0;
                                        })
                                        .finally(() => done() );
                            } else {
                                //查無此標籤，呈現首頁內容。
                                displayHomePageWithErrorMsg(done,
                                    terms.cannotFindATagCorrespondingRelatedToGivenPath(router.lastRouteResolved().url))
                            }
                        })
                        .catch(() => {
                            //查詢標籤作業失敗，呈現首頁內容。
                            displayHomePageWithErrorMsg(done,
                                terms.didNotSuccessfullyGetTheTagCorrespondingToGivenPath(router.lastRouteResolved().url))
                        });
                }
            }
        } else {
            /*
                因為沒有提供標籤的 slug，所以調整後續掛勾和處理函式，然後展示首頁內容 todo 搬函式的位置
            */
            displayHomePageWithErrorMsg(done,
                encodeURIComponent(generalTerms.systemDoesNotServeContentCorrespondingToProvidedPath(router.lastRouteResolved().url)));
        }
    },
    after:() => {},
    leave:() => {}
}//defaultEventHandlers 結束

export let routeEventHandlersOfTag = defaultEventHandlers;