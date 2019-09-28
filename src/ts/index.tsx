/// <reference path="./model/global-vars.d.ts"/>
/* 此頁程式負責的事務
   對應路徑與路徑處理函式
*/
import { router } from './service/router';
import { placeHolderForPage, pageIndicator, removePageIndicatorFromUrl } from './model/pagination';
import { queryParametersOfHome } from './component/home/routeHandler';
import * as termsOfCategory from './component/category/terms';
import { renderHomePage, routeEventHandlers as routeEventHandlersOfHome } from './component/home/routeHandler';
import { renderArchiveOfCategory } from './component/category/routeHandler';
import { renderArchiveOfTag, routeEventHandlersOfTag } from './component/tag/routerHandler';
import { generalHooksForPostAndPage, generalHandlerForPostAndPage } from './component/post-page-routeWrapper';
import { renderResultOfSearch, routeEventHandlers as routeEventHandlersOfSearch } from './component/search-result/routeHandler';
import { isNum } from './service/validator';

export const reactRoot = document.getElementById('react-root');

/*
  注意，不管未來是否需要在 index.tsx 處理模組路徑問題，都應該在這個模組載入 pagination 模組。
  這樣它才能早在其他頁面模組取得分頁列的資訊並刪除分頁設定之前就先保留分頁介面的設定。
*/
const paginationPath = pageIndicator.replace(placeHolderForPage, ':page');

const generalHandlerOfCategory = (params) => {
    let paramsOfCategory = {};
    let route = router.lastRouteResolved().url;
    route = removePageIndicatorFromUrl(route);
    let slugs = route.split('/').slice(1);//因為 navigo 會在路徑開頭加上「/」導致分拆之後第一個元素必為空字串，所以要彈出開頭第一個元素
    let filteredSlugs = slugs.filter( token => token !== '' );
    if (filteredSlugs.length == slugs.length && filteredSlugs.length >= 2) {
        /*
          當解析出來的元串組都沒有空白的部分，而且長度超過基準路徑的階層數（b c 也是 category 那樣一層），此時路徑格式正確。
          接下來要繼續解析其他參數
        */
        paramsOfCategory['slug'] = filteredSlugs.pop();
        if (params && isNum(params['page'])) {
            paramsOfCategory['page'] = parseInt(params['page']);
        } else {
            paramsOfCategory['page'] = 1;
        }
        
        renderArchiveOfCategory(paramsOfCategory);
    } else {
        /* 若路徑格式不正確，則轉發往首頁 */
        navigateToHomeWithErrorMessage(termsOfCategory.invalidPathForArchiveOfCategory(router.lastRouteResolved().url));
    }
};

router
    .on(`category/*/${paginationPath}`, generalHandlerOfCategory)
    .on(`category/*`, generalHandlerOfCategory)
    .on(`tag/:slug`, renderArchiveOfTag, routeEventHandlersOfTag)
    .on(`tag/:slug/${paginationPath}`, renderArchiveOfTag, routeEventHandlersOfTag)
    .on(`search/:keyword`, renderResultOfSearch, routeEventHandlersOfSearch)
    .on(`search/:keyword/${paginationPath}`, renderResultOfSearch, routeEventHandlersOfSearch)
    .on(':slug', generalHandlerForPostAndPage, generalHooksForPostAndPage)
    .on(`:slug/${paginationPath}`, generalHandlerForPostAndPage, generalHooksForPostAndPage)
    /*
       重要注意事項：
       像這樣把 paginationPath 放在根路徑的路由一定要擺在最後，
       否則 navigo 會提早把結尾是分頁路徑，但是整體而言來說並不是根路徑的請求委派給這部分函式處理，而且他還會漏接參數。
       例如：navigo 會將發送到 search/:keyword/page/2 的請求委派給 routeEventHandlersOfHome 和 renderHomePage 處理，
       然後請求參數只包括 page:2，而沒有 keyword。
    */
    .on(`${paginationPath}`, renderHomePage, routeEventHandlersOfHome)
    /*
      實驗發現如果想要指定根路徑的 route，那就要透過「/」來表達，而不能只填寫 ''，否則會變成萬用 route 的設定。
      另外，因為 navigo 會在根路徑以外的路徑前面加上「/」，所以表達根路徑以外的路徑時，開頭不用加上「/」，
      也不需要在產生 navigo 實例的時候在 root (host name) 後面加上「/」，否則 navigo 會重覆為路徑加上斜線，導致問題。
    */
    .on('/', renderHomePage, routeEventHandlersOfHome)
    .on(renderHomePage, routeEventHandlersOfHome)
    .resolve();

export function performSearch(keyword:string, page:number) {
    /*
       註: 據了解，雖然 Navigo 的 navigate 函式在拿 route 去更新瀏覽器的歷史狀態之前不會特別編碼連結，
       但是似乎因為瀏覽器的歷史紀錄 API 接到路徑之後會自動編碼的關係，所以實際運作發現這邊不用手動編碼路徑，
       否則當路徑有部分中文字時，反而會導致瀏覽器自動編碼後的連結與原本的目標連結不同。
    */
    let route = `search/${keyword}/`;
    if (page) {
        route += paginationPath.replace(placeHolderForPage, page.toString());
    }
    router.navigate(route);
}

export function navigateToHomeWithErrorMessage(msg:string):void {
    const queryStr = `${queryParametersOfHome.ERROR_MSG}=${encodeURI(msg)}`;
    if (queryStr.length >= 2048) {
        /*
            如果錯誤訊息太長，則保留適當的長度並去掉多餘訊息。
        */
        queryStr.substring(0, 2048);
    }
    router.navigate(`/?${queryStr}`);
}