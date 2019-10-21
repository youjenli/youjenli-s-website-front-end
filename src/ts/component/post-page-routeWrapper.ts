import axios from 'axios';
import { renderPost, routeEventHandlers as routeEventHandlersOfPost, createResultHandlerOfSinglePostFetching } from './post/routeHandler';
import { routeHandlerOfPage, routeEventHandlersOfPage, createResultHandlerOfPageFetching } from './page/routeHandler';
import { renderHomePage, routeEventHandlers as routeEventHandlerOfHome, queryParametersOfHome } from './home/routeHandler';
import { isNotBlank } from '../service/validator';
import { TypeOfContent } from '../model/general-types';
import { router } from '../service/router';
import * as terms from './terms';
import { fetchPosts, ConfigurationOfFetching as ConfigurationOfPostFetching, } from '../service/post-fetcher';
import { fetchPages, ConfigurationOfFetching as ConfigurationOfPageFetching } from '../service/page-fetcher';

/*
    這個套件的功能是用來幫 route 辨識文章和專頁的 slug。

    wordpress 會藉由根路徑的 post slug 和 page slug 揭露存取路徑，
    但客戶端要發送非同步請求取得文章時，沒辦法知道到底該路徑的資源是 post 還是 page，
    偏偏 wordpress rest api 的 post、page api 是分開的；若客戶端不知道是哪種資源就只能分別發送請求去找找看，這滿浪費時間的。
    為解決這個問題，我想到的辦法是在此建立一套紀錄給其他載入 post 或 page 連結的模組記錄各連結對應的資源類型，
    稍後當使用者請求這些連結時，此模組就可以透過全域變數和這裡的紀錄判斷要交給哪個模組存取頁面資料。
*/

const registryOfPostAndPage = [];

export function addTypeOfPostOrPage(slug:string, type:TypeOfContent):void {
    if (isNotBlank(slug) && type) {
        registryOfPostAndPage[slug] = type;
    }
}

let routeEventHandler = null;
let routeHandler = null;

const setRouteEventHandlerOfHomeAsRouteHandler = () => {
    const path = router.lastRouteResolved().url;
    routeEventHandler = {
        before:routeEventHandlerOfHome.before,
        leave:routeEventHandlerOfHome.leave
    }
    routeHandler = () => {
        const query = `${queryParametersOfHome.ERROR_MSG}=${terms.systemDoesNotServeContentCorrespondingToProvidedPath(path)}`;
        renderHomePage(query);
    }
}

const searchAndSetTheTypeOfPublication = (slug:string):Promise<void> => {
    const cancelTokenOfPostFetching = axios.CancelToken.source();
    const cancelTokenOfPageFetching = axios.CancelToken.source();
    const configOfPostFetching:ConfigurationOfPostFetching = {
        slug:slug,
        cancelToken:cancelTokenOfPostFetching.token
    }
    const configOfPageFetching:ConfigurationOfPageFetching = {
        slug:slug,
        cancelToken:cancelTokenOfPageFetching.token
    }
    /*
        註： 根據以下實驗，請不用擔心如果請求完成後，執行後續作業時才被中斷會怎麼辦。
        axios 既不會打斷 then 函式的作業，也不會觸發 promise 的 catch 函式。
        https://codepen.io/youjenli/pen/QWWKwEG?editors=0011
    */
    
    return Promise.all([
                fetchPosts(configOfPostFetching)
                    .then(createResultHandlerOfSinglePostFetching({ 
                                doIfResultIsNotEmpty:() => {
                                    routeEventHandler = routeEventHandlersOfPost;
                                    routeHandler = renderPost;
                                    cancelTokenOfPageFetching.cancel();
                                }
                            })
                    )
                    .catch(thrown => {
                        /* 
                           不是管跳到 catch 的原因是請求被取消，或是查詢異常的情況，通通都先使 promise 恢復正常。
                           這樣若請求是被取消，則後續步驟一樣可以得知發表物的形態。
                           相對地，若請求是查詢異常，則先回復 promise，讓後續步驟等等看另一個請求會不會找到東西。
                           要是最後兩個請求都要嘛故障，不然是沒查到東西，那才斷定為查不到發表物的型態。
                        */
                        return thrown;
                    }),
                fetchPages(configOfPageFetching)
                    .then(createResultHandlerOfPageFetching({
                                doIfResultIsNotEmpty:() => {
                                    routeEventHandler = routeEventHandlersOfPage;
                                    routeHandler = routeHandlerOfPage;
                                    cancelTokenOfPostFetching.cancel();
                                }
                            })
                    )
                    .catch(thrown => {
                        if (!axios.isCancel(thrown)) {
                            /* 
                               不是管跳到 catch 的原因是請求被取消，或是查詢異常的情況，通通都先使 promise 恢復正常。
                               這樣若請求是被取消，則後續步驟一樣可以得知發表物的形態。
                               相對地，若請求是查詢異常，則先回復 promise，讓後續步驟等等看另一個請求會不會找到東西。
                               要是最後兩個請求都要嘛故障，不然是沒查到東西，那才斷定為查不到發表物的型態。
                            */
                            return thrown;
                        }
                    })
            ]).then(() => {
                if (routeEventHandler === null) {
                    setRouteEventHandlerOfHomeAsRouteHandler();
                }
            })
}

export const generalHooksForPostAndPage = {
    before:(done, params) => {
        //先判斷究竟是哪一種資源
        new Promise<TypeOfContent>((resolve) => {
            if (Array.isArray(window.wp.completePosts)) {
                routeEventHandler = routeEventHandlersOfPost;
                routeHandler = renderPost;
                resolve();
            } else if (Array.isArray(window.wp.completePages)) {
                routeEventHandler = routeEventHandlersOfPage;
                routeHandler = routeHandlerOfPage;
                resolve();
            } else if (isNotBlank(params.slug)) {
                if (isNotBlank(registryOfPostAndPage[params.slug])) {
                    switch (registryOfPostAndPage[params.slug]) {
                        case TypeOfContent.Post:
                            routeEventHandler = routeEventHandlersOfPost;
                            routeHandler = renderPost;
                            resolve();
                            break;
                        case TypeOfContent.Page:
                            routeEventHandler = routeEventHandlersOfPage;
                            routeHandler = routeHandlerOfPage;
                            resolve();
                            break;
                        default://有 slug 的註冊紀錄，但內容型態不正確，則再次查詢特定文章或頁面。
                            return searchAndSetTheTypeOfPublication(params.slug);
                            /*
                                註：這次加入這個處理案例的原因是怕自己漏掉導致這種情況的情境。
                                目前具體來說還不清楚到底什麼情會導致 post-slug 列表有紀錄但型態不正確。
                            */
                    }
                } else {//無此 slug 的註冊紀錄，於是分別向文章或頁面查詢功能找詢看看。
                    return searchAndSetTheTypeOfPublication(params.slug);
                    /*
                        註：照理說前端執行 post-page-routeWrapper 模組的前提是從頁面上點選文章或頁面的連結，
                        而前端若已產生這些內容的連結，那到時照理說文章或頁面的模組也應該已經向 post-slug 列表登記內容的型態，
                        因此不該因為找不到型態而跑到這個 else 區域。
                        但我擔心自己還有什麼情況沒有考慮到，因此還是為這種情況實作發表內容型態的查找功能。
                    */
                }
            } else {
                /* 
                   進入這區塊的情況是使用者沒有提供文章或專頁的索引字串。

                   因為目前沒有規劃分類與標籤的封存頁，所以這裡要直接呈現首頁內容並告訴使用者無此頁面。
                */
               setRouteEventHandlerOfHomeAsRouteHandler();
               resolve();
            }
        })
        .then(() => {
            //接著根據前一步委派對應模組的結果執行對應的 hook。
            routeEventHandler.before(done, params);
        })
    },
    leave:() => {
        routeEventHandler.leave();
        routeEventHandler = null;
        routeHandler = null;
    }
}

export const generalHandlerForPostAndPage = (params) => {
    routeHandler(params);
}