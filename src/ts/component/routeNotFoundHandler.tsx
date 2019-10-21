import { renderHomePage, routeEventHandlers as routeEventHandlerOfHome, queryParametersOfHome } from './home/routeHandler';
import { router } from '../service/router';
import * as terms from './terms';

export const eventHandlersOfExceptionFlow = routeEventHandlerOfHome;

export const routeNotFoundHandler = () => {
    const path = router.lastRouteResolved().url;
    const query = `${queryParametersOfHome.ERROR_MSG}=${encodeURIComponent(terms.pageNotFound + ' ' + terms.systemDoesNotServeContentCorrespondingToProvidedPath(path))}`;
    /*
        註：這邊的請求參數一定要編碼。這是因為 renderHomePage 處理函式會解請求參數的編碼。
        至於 renderHomePage 要解請求參數編碼的原因是──似乎因為瀏覽器的歷史紀錄 API 收到路徑之後會自動編碼的關係，
        所以實驗發現當使用者令 navigo 導向特定路徑時，處理函式會接到編碼後的請求參數，因此一定要解碼才能使用。
    */
    renderHomePage(query);
};