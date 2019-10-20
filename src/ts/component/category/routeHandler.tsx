/// <reference path="../../model/global-vars.d.ts"/>
import * as pg from '../../model/pagination';
import {router} from '../../service/router';
import { reactRoot } from '../../index';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MetaDataOfPost} from '../../model/posts';
import {Category} from '../../model/terms';
import GenericCategory from './generic';
import { convertGMTDateToLocalDate } from '../../service/formatters';
import { isNotBlank, isObject } from '../../service/validator';
import { fetchCategories, fetchNodesInCategoryTree } from '../../service/category-fetcher';
import { fetchPosts } from '../../service/post-fetcher';
import * as terms from './terms';
import * as generalTerms from '../terms';
import { TypesOfCachedItem, addRecord, getRecord, deleteRecord } from '../../service/cache-of-pagination';
import { addTypeOfPostOrPage } from '../post-page-routeWrapper';
import PageTitle from '../page-title';
import { renderHomePage, routeEventHandlers as routeEventHandlerOfHome, queryParametersOfHome } from '../home/routeHandler';
import { removePageIndicatorFromUrl } from '../../model/pagination';

const DEFAULT_POSTS_PER_PAGE = 10;
let postsPerPage = 10;
let taxonomy:Category = null;
let postsShouldBeRendered:MetaDataOfPost[] = null;
let foundPosts = 0;
let pagination:pg.Pagination = null;

const renderThePageOfCategory = () => {
    postsShouldBeRendered.forEach(post => {
        addTypeOfPostOrPage(post.slug, post.type);
    });
    ReactDOM.render(
        <React.Fragment>
           <PageTitle name={terms.titleOfPageOfCategory(taxonomy.name)} />
           <GenericCategory category={taxonomy} numberOfResults={foundPosts}
                pageContent={postsShouldBeRendered} pagination={pagination} />
        </React.Fragment>,
        reactRoot, () => {
            router.updatePageLinks();
        }
    )
}

const defaultEventHandlers = {
    after:() => {},
    leave:() => {}
};

export const routeEventHandlersOfCategory = defaultEventHandlers;

const resetStateOfHandler = () => {
    postsShouldBeRendered = null;
    taxonomy = null;
    foundPosts = 0;
    postsPerPage = DEFAULT_POSTS_PER_PAGE;
    pagination = null;
    routeEventHandlersOfCategory.after = defaultEventHandlers.after;
    routeEventHandlersOfCategory.leave = defaultEventHandlers.leave;
}

const displayHomePageWithErrorMsg = (errorMsg:string) => {
    new Promise((resolve) => {
        //先執行 before 函式
        routeEventHandlerOfHome.before(resolve);
    }).then(() => {
        /* 待 before 函式執行完畢，接著更新此 route 的 after 和 leave hook，然後產生首頁畫面 */
        routeEventHandlersOfCategory.after = routeEventHandlerOfHome.after;
        routeEventHandlersOfCategory.leave = routeEventHandlerOfHome.leave;
        const query = `${queryParametersOfHome.ERROR_MSG}=${encodeURIComponent(errorMsg)}`;
        renderHomePage(query);
    });
}

export const routeHandlerOfCategory = (params) => {
    /*
      因為 navigo 使用 regex 比對路徑的路由函式之 hooks 無法像路由函式一樣得到 regex match 的結果，
      所以此功能統一在路由函式中匯整資料並產生畫面，不像其他路由處理函式一樣藉由 hooks 收集資料。
    */
    
    //首先要解析路徑
    let route = router.lastRouteResolved().url;
    route = removePageIndicatorFromUrl(route);
    let tokens = route.split('/').slice(1);//因為 navigo 會在路徑開頭加上「/」導致分拆之後第一個元素必為空字串，所以要彈出開頭第一個元素

    //洗掉空的路徑階層
    let filteredSlugs = tokens.filter( token => token !== '' );
    if (filteredSlugs.length == tokens.length) {
        //路徑形式正確，再來要判斷內容的格式是否正確。
        if (filteredSlugs.length >= 2) {
            /*
              當解析出來的元串組都沒有空白的部分，而且長度超過基準路徑的階層數，這代表路徑格式正確，有提供分類的 slug。
              接下來要繼續解析其他參數
            */
            const slug = filteredSlugs.pop();
            let page = 1;
            if (isObject(params) && isNotBlank(params['page'])) {
                page = parseInt(params['page']);
            }

            if (window.wp.archive && window.wp.archive.category) {
                resetStateOfHandler();
                taxonomy = window.wp.archive.category.taxonomy;
                postsShouldBeRendered = window.wp.archive.category.posts;
                //處理日期格式問題並過濾分類名稱清單
                postsShouldBeRendered.forEach((post) => {
                    //轉換時間成當地時間
                    post.date = convertGMTDateToLocalDate(post.date);
                    post.modified = convertGMTDateToLocalDate(post.modified);
                    /*
                        Wordpress 把未分類的文章歸納到「未分類」這個類型，然而我不打算讓使用者在系統界面上以此分類名稱索引文章，
                        因此在了解如何在 wordpress 上面過濾未分類之前，先在這裡過濾伺服器送來的資料。
                    */
                    post.categories = post.categories.filter( category => category.name !== 'Uncategorized' );
                    /*
                      注意：原本使用 (category) => { category.name != 'Uncategorized' } 來過濾，結果竟然沒有分類通過檢查。
                      改用 category => category.name !== 'Uncategorized' 才解決這個問題。
                      之所以會這樣的原因是 filter 的處理函式有 { } 之後，裡面的每行程式碼就只是一般的運算式。
                      運算後我們必須自行以 return 回傳符合篩選條件的物件。若沒有回傳東西，那 filter 函式就會視同該元素沒有通過檢查。
                    */
                });
                postsPerPage = window.wp.archive.category.posts.length;
                foundPosts = window.wp.archive.category.foundPosts;
                pagination = pg.getPagination();
              
                const contentOfRecord = {
                    pagination:{
                        endSize:pagination.endSize,
                        midSize:pagination.midSize,
                        totalPages:pagination.totalPages,
                        baseUrl:pagination.baseUrl,
                        foundPosts:foundPosts,
                        postsPerPage:postsPerPage
                    },
                    category:window.wp.archive.category.taxonomy,
                    pages:{}
                }
                contentOfRecord.pages[pagination.currentPage] = window.wp.archive.category.posts;
                addRecord(TypesOfCachedItem.Category, slug, contentOfRecord);
              
                /*
                    刪掉伺服器提供的資料，以免後序請求無法判斷程式狀態。
                */
                delete window.wp.archive.category;
                delete window.wp.pagination;
                renderThePageOfCategory();
            } else {
                /*
                    從快取中提出此 slug 的紀錄，然後再根據狀況決定要發送哪些請求
                */
                const record = getRecord(TypesOfCachedItem.Category, slug);
                if (record) {
                    /*
                      快取中有紀錄，再來要看看是否已有此分頁
                    */
                    if (record.pages[page] == undefined) {
                        /*
                          快取中無此分頁
  
                          接下來要解決以下問題：
                          1. 確認伺服器上關於此分類以及隸屬此分類的文章資訊是否已更新
                          2. 取得要請求的分頁資料
  
                          解決的方法是根據本地快取內的資訊發送請求去拿分頁的資料，
                          接著要是發現回傳的文章數與快取中的紀錄不同，那就視為快取的內容與伺服器的狀態已不同，因此要重新建立分頁的快取紀錄，
                          反之則假定分類的資訊沒變，分類底下的子分類也沒變，
                          分類與它的子分類旗下的文章數量也沒變，然後照預訂計畫把查詢結果加到快取中並呈現新的分頁。
  
                          附帶一提，當客戶端發現回傳的文章數與快取中的紀錄不同時，
                          此分類可能不只文章數有增減，而且分類本身與它的子分類也已有變化，
                          因此照理說要重新抓此分類與其子分類的紀錄，然後還要再依此紀錄重新抓所屬的文章。
                          但因為不想在換頁的時候發送太多請求影響體驗，所以還是決定照常呈現快取中的分類給使用者看，
                          並依照快取中的子分類紀錄查詢相關文章。
                          我會在以後嘗試採用 GraphQL 時，一併研究能否妥善解決這個同步問題。
  
                          另外，以上的設計會假設伺服器在使用者發送請求的期間不會變更伺服器的路徑結構，也不會變更分頁列表的參數。
                          這樣一來，當模組要整理非同步請求的資訊給各功能模組時，就可以直接沿用先前的設定。
  
                          在開始之前先回復與發送請求相關，而且不受請求結果影響的狀態
                        */
                        taxonomy = record.category;
                        postsPerPage = record.pagination.postsPerPage;
  
                        /* 
                          在發送請求去拿分頁之前，先整理參數。
                        */
                        const children = record.category.children;
  
                        let categories:number[] = [taxonomy.id];
                        if (children) {
                            children.forEach(category => {
                                categories.push(category.id);
                            });
                        }
                   
                        fetchPosts({
                            page:page,
                            categories:categories,
                            per_page:postsPerPage
                        }).then((resultOfQueryOfPosts) => {
  
                            const latestTotalPages = parseInt(resultOfQueryOfPosts.response.headers['x-wp-totalpages']);
                            const latestFoundPosts = parseInt(resultOfQueryOfPosts.response.headers['x-wp-total']);
  
                            if (record.pagination.foundPosts == latestFoundPosts) {
                                /*
                                   檢查發現剛查到的 total posts 數量與原本的數量相同，
                                   這裡直接視為此分類頁的分頁狀態沒有變化，
                                   因此只要拿快取的資料還原此模組的狀態，然後把剛才查到的資料加入到快取中即可。
                                */
   
                                pagination = {
                                    endSize:record.pagination.endSize,
                                    midSize:record.pagination.midSize,
                                    totalPages:record.pagination.totalPages,
                                    currentPage:page,
                                    baseUrl:record.pagination.baseUrl
                                }
                                postsShouldBeRendered = resultOfQueryOfPosts.modelObjs;
                                foundPosts = latestFoundPosts;
                              
                                if (resultOfQueryOfPosts.isComplete) {
                                    //若此分頁內容有完整才把它加入快取，反之則不加入。
                                    record.pages[page] = resultOfQueryOfPosts.modelObjs;
                                }
                            } else {
                                /*
                                  若總文章數不同，那表示分頁狀態有變，這樣要先刪除舊的快取並以剛抓到的替代。
  
                                  先更新應用程式狀態
                                */
                                pagination = {
                                    endSize:record.pagination.endSize,
                                    midSize:record.pagination.midSize,
                                    totalPages:latestTotalPages,
                                    currentPage:page,
                                    baseUrl:record.pagination.baseUrl
                                }
                                /*
                                  註：此模組的 pagination 狀態之 endSize、midSize 和 baseUrl 會直接沿用先前快取中的資訊，
                                  原因寫在這個模組上面的註解中。接下來快取裡面這些設定也會沿用舊的快取設定。
                                */
                                postsShouldBeRendered = resultOfQueryOfPosts.modelObjs;
                                foundPosts = latestFoundPosts;
                              
                                //然後更新快取紀錄
                                if (resultOfQueryOfPosts.isComplete) {
                                    record.pagination['totalPages'] = latestTotalPages;
                                    record.pagination['foundPosts'] = latestFoundPosts;
                                    record.pages = {};
                                    record.pages[page] = resultOfQueryOfPosts.modelObjs;
                                } else {
                                    /*
                                      此分頁的狀態有變，而且剛才拿到的資料也不完整，
                                      這樣不但不更新快取，還要刪除暨有的快取紀錄。
                                    */
                                    deleteRecord(TypesOfCachedItem.Category, slug);
                                }
                            }
                        }).catch(() => {
                            /*請求失敗，淨空要呈現的分頁文章並更新分頁至新的狀態，
                              這樣一旦下一步丟空的文章資訊給分類頁，則分類頁的元件就會判斷要顯示暫時查無文章資訊的提示訊息。*/
                            postsShouldBeRendered = null;
                            foundPosts = 0;
                            pagination['currentPage'] = page;
                        }).finally(renderThePageOfCategory);
                    } else {
                        //快取中有此分頁，直接載入分頁內容
                        pagination = {
                            endSize:record.pagination.endSize,
                            midSize:record.pagination.midSize,
                            totalPages:record.pagination.totalPages,
                            currentPage:page,
                            baseUrl:record.pagination.baseUrl
                        }
                        foundPosts = record.pagination.foundPosts;
                        postsShouldBeRendered = record.pages[page];
                        taxonomy = record.category;
                       
                        renderThePageOfCategory();
                    }
                } else {
                    /*沒有此分類頁的分頁快取，因此從分類到文章什麼都要重新拿
                
                      查詢分類資訊和發文的方法是先查 category 取得相關資訊，
                      然後再用它的 category id 查父母類別和文章，總共發送三個請求。
                      雖然這種請求方式不是很理想，但是在我能完全搞懂 wordpress 以便構思合適做法來實現之前暫時先這樣做。
                    */
                
                    //這種情況是新的 route，因此要重置設定參數。
                    resetStateOfHandler();
                    fetchCategories({
                        slug:decodeURIComponent(slug),
                        /*
                            注意，不曉得是 xmlhttprequest 或是 axios 設計的緣故，開發者不需要事先為查詢參數編碼，
                            只要直接遞交參數內容給請求設定即可，因此這邊要先把來自伺服器或非同步請求的已編碼 slug 解碼。
                        */
                        includeParent:true
                    })
                    .then((result) => {
                        if (result.modelObjs.length > 0) {
                            taxonomy = result.modelObjs[0];//只取第一個結果
                            //查詢此分類的子分類資料
                            fetchNodesInCategoryTree(taxonomy.slug)
                                .then((categories) => {
                                    if (Array.isArray(categories)) {
                                        taxonomy.children = categories;
                                    
                                        //接著以所有的分類 id 查詢分類下的文章
                                        fetchPosts({
                                            page:page,
                                            categories:[taxonomy.id, ...categories.map(category => category.id)],
                                            per_page:postsPerPage
                                        }).then((resultOfQueryOfPosts) => {
                                        
                                            const baseUrl = pagination && isNotBlank(pagination.baseUrl) ? pagination.baseUrl : pg.getBaseUrl();
                                            const latestTotalPages = parseInt(resultOfQueryOfPosts.response.headers['x-wp-totalpages']);
                                            const latestFoundPosts = parseInt(resultOfQueryOfPosts.response.headers['x-wp-total']);
                                        
                                            //接下來先設定剛才兩個請求成功之後還未更新的應用程式狀態
                                            postsShouldBeRendered = resultOfQueryOfPosts.modelObjs;
                                            foundPosts = latestFoundPosts;
                                            pagination = {
                                                endSize:pg.defaultEndSize,
                                                midSize:pg.defaultMidSize,
                                                totalPages:latestTotalPages,
                                                currentPage:page,
                                                baseUrl:baseUrl
                                            }
                                          
                                            //最後是應用程式的快取紀錄
                                            if (resultOfQueryOfPosts.isComplete) {
                                              const contentOfRecord = {
                                                  pagination:{
                                                      endSize:pg.defaultEndSize,
                                                      midSize:pg.defaultMidSize,
                                                      totalPages:latestTotalPages,
                                                      baseUrl:baseUrl,
                                                      foundPosts:latestFoundPosts,
                                                      postsPerPage:postsPerPage
                                                  },
                                                  category:taxonomy,
                                                  pages:{}
                                              }
                                              contentOfRecord.pages[page] = resultOfQueryOfPosts.modelObjs;
                                              addRecord(TypesOfCachedItem.Category, slug, contentOfRecord);
                                            }
                                            renderThePageOfCategory();
                                        }).catch(() => {
                                            /*雖然有找到所有分類，但是查詢文章失敗，因此淨空要呈現的分頁文章並更新分頁至新的狀態，
                                              這樣一旦下一步丟空的文章資訊給分類頁，則分類頁的元件就會判斷要顯示暫時查無文章資訊的提示訊息。*/
                                            postsShouldBeRendered = null;
                                            pagination = {
                                                endSize:pg.defaultEndSize,
                                                midSize:pg.defaultMidSize,
                                                totalPages:0,
                                                currentPage:page,
                                                baseUrl:pg.getBaseUrl()
                                            }
                                            foundPosts = 0;
                                        });
                                    } else {
                                        /* 
                                            查詢子分類的過程出錯。
                                            雖然這樣仍舊可以只查詢歸到主分類下的文章，但因為使用者無法了解到底有哪些應該看到的東西沒看到，
                                            所以考量之後還是決定果斷導引到其他頁面上而不提供殘缺的查詢結果。
                                        */
                                        taxonomy = null;
                                        const errorMsg = terms.didNotSuccessfullyGetTheCategoryCorrespondingToGivenPath(router.lastRouteResolved().url)
                                                        +terms.thereforeTheHomePageIsPresentedToYou
                                                        +terms.pleaseTryAgainToAccessThisCategoryLater;
                                        displayHomePageWithErrorMsg(errorMsg);
                                    }
                                });
                        } else {
                            //查無此 slug，重新導向至首頁。
                            const errorMsg = terms.cannotFindAnyCategoryCorrespondingToGivenPath(router.lastRouteResolved().url)
                                            +terms.thereforeTheHomePageIsPresentedToYou;
                            displayHomePageWithErrorMsg(errorMsg);
                        }
                    })
                    .catch(error => {
                        //查詢分類失敗，導引至首頁
                        console.log(error.response);
                        const errorMsg = terms.didNotSuccessfullyGetTheCategoryCorrespondingToGivenPath(router.lastRouteResolved().url)
                                        +terms.thereforeTheHomePageIsPresentedToYou;
                        displayHomePageWithErrorMsg(errorMsg);
                    });
                }
          }
        } else {
            //沒有提供分類名稱，呈現首頁並提示沒有對應此路徑的內容。
            const errorMsg = generalTerms.systemDoesNotServeContentCorrespondingToProvidedPath(router.lastRouteResolved().url);
            displayHomePageWithErrorMsg(errorMsg);
        }
    } else {
        //有空的路徑階層 => 路徑格式不正確，呈現首頁並提示路徑格式不正確
        const errorMsg = terms.invalidPathForArchiveOfCategory(router.lastRouteResolved().url);
        displayHomePageWithErrorMsg(errorMsg);
    }
};