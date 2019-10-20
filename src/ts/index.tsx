/// <reference path="./model/global-vars.d.ts"/>
/* 此頁程式負責的事務
   對應路徑與路徑處理函式
*/
import { router } from './service/router';
import { placeHolderForPage, pageIndicator } from './model/pagination';
import { queryParametersOfHome } from './component/home/routeHandler';
import { renderHomePage, routeEventHandlers as routeEventHandlersOfHome } from './component/home/routeHandler';
import { routeHandlerOfCategory, routeEventHandlersOfCategory } from './component/category/routeHandler';
import { routeHandlerOfTag, routeEventHandlersOfTag } from './component/tag/routerHandler';
import { generalHooksForPostAndPage, generalHandlerForPostAndPage } from './component/post-page-routeWrapper';
import { renderResultOfSearch, routeEventHandlers as routeEventHandlersOfSearch } from './component/search-result/routeHandler';
import { routeNotFoundHandler, eventHandlersOfExceptionFlow } from './component/routeNotFoundHandler';
import { isNum } from './service/validator';

export const reactRoot = document.getElementById('react-root');

/*
  注意，不管未來是否需要在 index.tsx 處理模組路徑問題，都應該在這個模組載入 pagination 模組。
  這樣它才能早在其他頁面模組取得分頁列的資訊並刪除分頁設定之前就先保留分頁介面的設定。
*/
const paginationPath = pageIndicator.replace(placeHolderForPage, ':page');

/*
    為確保後端明明找不到對應網址的內容，但前端卻在初始化的時候又另外發請求去查詢內容，
    初始化的階段勢必要讓前端執行 404 頁面預訂呈現的內容。
    然而，要是前端啟動時，只根據後端送來的回傳代碼依序呼叫 eventHandlersOfExceptionFlow 的 hook 和 routeNotFoundHandler，
    那這個處理函式將不歸 router 管，這樣 navigo 會無法適時的呼叫 eventHandlersOfExceptionFlow 的 leave hook ，
    導致系統狀態不能妥善收尾。
    因此，這邊要先使伺服器已知為 404 的路徑變成第一項路由設定，這樣才可以確保 navigo 一開始就接管系統狀態的切換作業並妥善的呈現要給 404 的畫面。
*/
if (isNum(window.wp.responseCode) && window.wp.responseCode == 404) {
    const path = window.location.pathname;
    const routerHandlerSettings = { as:'specified 404 route', uses:routeNotFoundHandler };
    router.on(path, routerHandlerSettings, 
        {
            before:eventHandlersOfExceptionFlow.before,
            after:() => {
                eventHandlersOfExceptionFlow.after();
                //重要！拿掉目前的 router 設定以免符合特定路徑在網頁初始化之後有對應的內容，但客戶端卻拒絕使用者存取。
                router.off(path, routerHandlerSettings);
            },
            leave:eventHandlersOfExceptionFlow.leave
        }
    );
}

/*
    註：
    1.要比對的路徑前面有沒有加斜線的意義不同。
    若有加斜線，則表示要比對的路徑是接續在稍早設定的根路徑之後，反之則表示只要欲導向路徑的結尾符合比對路徑結構即可。
    因此若有 A => /:slug/page/:number，B => :slug/page/:number 兩個比對路徑，
    則路徑 http://host-name/path/to/something/page/123 會符合 B 路徑，slug 的值是 something，number 的值是 123，但是不符合 A 路徑。
    路徑 C => http://host-name/something/page/123 才會符合 A，但是 C 也同時符合 B。

    2. 若有一路徑設定為 category/:slug，則當請求路徑是 category 時，navigo 不會視為符合此路徑。
    這種情況要額外建立沒有參數的路徑來導引處理函式。

    附帶一提，如果要導引的路徑以相對於根路徑的格式表達，例如 path/to/something，那前面有沒有加斜線都沒差。

    若想深入了解與實驗以上兩點，那可以參考下面的範例：
    https://codepen.io/youjenli/pen/zYYoojQ
*/
router
    .on(`/category/*/${paginationPath}`, { as:'category with page number', uses:routeHandlerOfCategory }, routeEventHandlersOfCategory)
    .on(`/category/*`, { as:'category', uses:routeHandlerOfCategory }, routeEventHandlersOfCategory)
    .on('/category', { as:'category without slug', uses:routeHandlerOfCategory }, routeEventHandlersOfCategory)
    .on(`/tag/:slug/${paginationPath}`, { as:'tag with page number', uses:routeHandlerOfTag }, routeEventHandlersOfTag)
    .on(`/tag/:slug`, { as:'tag', uses:routeHandlerOfTag }, routeEventHandlersOfTag)
    .on('/tag', { as:'tag without slug', uses:routeHandlerOfTag }, routeEventHandlersOfTag)
    .on(`/search/:keyword`, { as:'search', uses:renderResultOfSearch }, routeEventHandlersOfSearch)
    .on(`/search/:keyword/${paginationPath}`, { as:'search with page number', uses:renderResultOfSearch }, routeEventHandlersOfSearch)
    .on('/:slug', { as:'post or page', uses:generalHandlerForPostAndPage }, generalHooksForPostAndPage)
    .on(`/:slug/${paginationPath}`, { as:'post or page with page number', uses:generalHandlerForPostAndPage }, generalHooksForPostAndPage)
    .on(`/${paginationPath}`, { as:'home with page number', uses:renderHomePage }, routeEventHandlersOfHome)
    /*
      如果想要指定根路徑的 route，那就要透過「/」來表達，或是以 on(handler, hooks) 的形式表達而不能只填寫 ''，
      否則會變成萬用 route 的設定。
    */
    router.on('/', { as:'home', uses:renderHomePage }, routeEventHandlersOfHome);
    router.notFound(routeNotFoundHandler, eventHandlersOfExceptionFlow);
    //註：navigo 的 api 不支援為 not found handler 命名。

router.resolve();

export function performSearch(keyword:string, page:number) {
    /*
       註: 在我讀 Navigo 的原始碼之後發現雖然 Navigo 的 navigate 函式在拿 route 去更新瀏覽器的歷史狀態之前不會特別編碼連結，
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
    /*
       註: 這裡呼叫 navigate 的狀況與 performSearch 相同。
       雖然 Navigo 的 navigate 函式在拿 route 去更新瀏覽器的歷史狀態之前不會特別編碼連結，
       但是似乎因為瀏覽器的歷史紀錄 API 接到路徑之後會自動編碼的關係，所以實際運作發現這邊不用手動編碼路徑，
       否則當路徑有部分中文字時，反而會導致瀏覽器自動編碼後的連結與原本的目標連結不同。
    */
    const queryStr = `${queryParametersOfHome.ERROR_MSG}=${msg}`;
    if (queryStr.length >= 2048) {
        /*
            如果錯誤訊息太長，則保留適當的長度並去掉多餘訊息。
        */
        queryStr.substring(0, 2048);
    }
    router.navigate(`/?${queryStr}`);
}