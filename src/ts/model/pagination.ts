/// <reference path="./global-vars.d.ts"/>
import {escapeRegexCharacters, trailingSlashIt} from '../service/formatters';
import {router} from '../service/router';
import { isNotBlank } from '../service/validator';

/* 分頁連結的設定 */
export interface SettingsOfPagination {
    placeHolderForPageNumberIndicator:string;
    placeHolderForPageNumber:string;
    pageNumberIndicator:string;
}

/* 分頁的設定 */ 
export interface Pagination {
    baseUrl?:string;
    endSize:number;
    midSize:number;
    totalPages:number;
    currentPage:number;
    itemsPerPage?:number;//todo 在搜尋頁以外的頁面套用此參數。
}

/* 取得分頁佔位符號、分頁符號、填充欄位。
   以下參數是取自 wp-includes/link-template.php 的 get_pagenum_link 函式
*/
let placeHolderForPageIndicator = '%_%';
export let placeHolderForPage = '%#%';
export let pageIndicator = `page/${placeHolderForPage}`;

if (window.wp.paginationSettings) {
    const settings = window.wp.paginationSettings;
    if (isNotBlank(settings.placeHolderForPageNumberIndicator)) {
        placeHolderForPageIndicator = settings.placeHolderForPageNumberIndicator;
    }
    if (isNotBlank(settings.placeHolderForPageNumber)) {
        placeHolderForPage = settings.placeHolderForPageNumber;
    }
    if (isNotBlank(settings.pageNumberIndicator)) {
        pageIndicator = settings.pageNumberIndicator;
    }
}

//逃逸 defaultFormatOfPageIndicator 裡面的 regex 字元
const eacapedPageIndicator = escapeRegexCharacters(pageIndicator);
//把分頁格式的數值欄位以 regex 數值替代，這樣才能準備用來處理連結的正則表示式
const regexOfPageIndication = eacapedPageIndicator.replace(placeHolderForPage, '[\\d]+');

export function getBaseUrl():string {
    if (window.wp.pagination && isNotBlank(window.wp.pagination.baseUrl)) {
        return window.wp.pagination.baseUrl;
    } else {
        //從目前連結剔除分頁部分並以分頁符號的佔位字元替代
        const regex = new RegExp(regexOfPageIndication);
        let url = router.lastRouteResolved().url;
        if (regex.test(url)) {
            return url.replace(regex, placeHolderForPageIndicator);
        } else {
            return trailingSlashIt(url) + placeHolderForPageIndicator;
        }
    }
}

export function createUrlForPage(baseUrl:string, page:number):string {
    let result = null;
    if (page > 1) {
        result = baseUrl.replace(placeHolderForPageIndicator, pageIndicator);
        result = result.replace(placeHolderForPage, page.toString());
    } else {
        result = baseUrl.replace(placeHolderForPageIndicator, '');
    }
    return result;
}

//從伺服器提取分頁設定
let endSize = 3;
let midSize = 2;

if (window.wp.pagination) {
    const settings = window.wp.pagination;
    if (!isNaN(settings.endSize)) {
        endSize = settings.endSize;
    }
    if (!isNaN(settings.midSize)) {
        midSize = settings.midSize;
    }
}

export const defaultEndSize = endSize;
export const defaultMidSize = midSize;

export function getPagination():Pagination {
    let data = {
        endSize:defaultEndSize,
        midSize:defaultMidSize,
        totalPages:0,
        currentPage:0,
        baseUrl:getBaseUrl()
    };
    
    if (window.wp.pagination) {
        const settings = window.wp.pagination;
        
        if (!isNaN(settings.endSize)) {
            data['endSize'] = settings.endSize;
        }

        if (!isNaN(settings.midSize)) {
            data['midSize'] = settings.midSize;
        }

        if (!isNaN(settings.totalPages)) {
            data['totalPages'] = settings.totalPages;
        }

        if (!isNaN(settings.currentPage)) {
            data['currentPage'] = settings.currentPage;
        }
        
        if (!isNaN(settings.itemsPerPage)) {
            data['itemsPerPage'] = settings.itemsPerPage;
        }
    }

    return data;
}

export function removePageIndicatorFromUrl(url:string):string {
    if (isNotBlank(url)) {
        const regexString = '\\/' + regexOfPageIndication + '?$';
        url = url.replace(new RegExp(regexString), '');
    }
    return url;
}