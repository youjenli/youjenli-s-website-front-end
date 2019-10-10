import { renderPost, routeEventHandlers as routeEventHandlersOfPost } from './post/routeHandler';
import { renderPage, routeEventHandlers as routeEventHandlersOfPage } from './page/routeHandler';
import { isNotBlank } from '../service/validator';
import { TypeOfContent } from '../model/general-types';
import { navigateToHomeWithErrorMessage } from '../index';
import { router } from '../service/router';
import * as terms from './terms';

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

let currentStateOfRootSlug = null;

export const generalHooksForPostAndPage = {
    before:(done, params) => {
        //先判斷究竟是哪一種資源
        if (Array.isArray(window.wp.completePosts)) {
            currentStateOfRootSlug = TypeOfContent.Post;
        } else if (Array.isArray(window.wp.completePages)) {
            currentStateOfRootSlug = TypeOfContent.Page;
        } else if (registryOfPostAndPage[params.slug]) {
            switch (registryOfPostAndPage[params.slug]) {
                case TypeOfContent.Post:
                    currentStateOfRootSlug = TypeOfContent.Post;
                    break;
                case TypeOfContent.Page:
                    currentStateOfRootSlug = TypeOfContent.Page;
                    break;
                default:
                    const path = router.lastRouteResolved().url;
                    navigateToHomeWithErrorMessage(terms.cannotFindTheCorrespondingTypeOfPublicationWithProvidingSlug(path));
                    break;
            }
        } else {
            const path = router.lastRouteResolved().url;
            navigateToHomeWithErrorMessage(terms.cannotFindTheCorrespondingTypeOfPublicationWithProvidingSlug(path));
        }
        
        //接著根據前一步推斷的結果委派對應模組的 hook 來處理
        switch(currentStateOfRootSlug) {
            case TypeOfContent.Post:
                routeEventHandlersOfPost.before(done, params);
                break;
            case TypeOfContent.Page:
                routeEventHandlersOfPage.before(done, params);
                break;
        }
    },
    leave:() => {
        switch(currentStateOfRootSlug) {
            case TypeOfContent.Post:
                routeEventHandlersOfPost.leave();
                //要記得取消這邊登記的換頁狀態，否則未來判斷分頁可能會錯誤
                break;
            case TypeOfContent.Page:
                routeEventHandlersOfPage.leave();
                break;
        }
        currentStateOfRootSlug = null;
    }
}

export const generalHandlerForPostAndPage = () => {
    switch(currentStateOfRootSlug) {
        case TypeOfContent.Post:
            renderPost();
            break;
        case TypeOfContent.Page:
            renderPage();
            break;
    }
}