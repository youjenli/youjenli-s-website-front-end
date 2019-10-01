import Axios from 'axios';
import { convertGMTDateToLocalDate } from './formatters';
import { PageEntity } from '../model/wp-rest-api';
import { ResultOfFetching } from '../model/general-types';
import { Page } from '../model/posts';
import { isNotBlank } from './validator';
import * as terms from './terms';
import { fetchMedia } from './media-fetcher';
import { CustomFields } from '../model/wp-rest-api';
import { isNum } from '../service/validator';

export interface ConfigurationOfFetching {
    page?:number;
    id?:number;
    slug?:string;
    per_page?:number;
    include?:number[];
}

export function fetchPages(params:ConfigurationOfFetching):Promise<ResultOfFetching<Page>> {
    const reqConfig = {
        params:{}
    };
    if (params) {
        if (params.id) {
            reqConfig.params['id'] = params.id;
        }

        if (isNotBlank(params.slug)) {
            reqConfig.params['slug'] = params.slug;
        }
        
        reqConfig.params['page'] = params.page || 1;
        
        if (params.per_page) {
            reqConfig.params['per_page'] = params.per_page;
        }
    
        if (Array.isArray(params.include)) {
            reqConfig.params['include'] = params.include.toString();
        }
    }

    return  new Promise((resolve, reject) => {
        Axios.get<PageEntity[]>('/wp-json/wp/v2/pages', reqConfig)
                .then((responseOfQueryOfPage) => {
                    if (responseOfQueryOfPage && responseOfQueryOfPage.status == 200) {
                        let isComplete = true;
                        if (Array.isArray(responseOfQueryOfPage.data) && responseOfQueryOfPage.data.length > 0) {
                            let rawDataOfPage = responseOfQueryOfPage.data[0];
                            const estimatedReadingTimes = rawDataOfPage.meta[CustomFields.EstimatedReadingTimes];
                            let model:Page = {
                                type:rawDataOfPage.type,
                                id:rawDataOfPage.id,
                                title:rawDataOfPage.title.rendered,
                                slug:rawDataOfPage.slug,
                                date:convertGMTDateToLocalDate(new Date(rawDataOfPage.date_gmt)),
                                modified:convertGMTDateToLocalDate(new Date(rawDataOfPage.modified_gmt)),
                                url:rawDataOfPage.link,
                                excerpt:rawDataOfPage.excerpt.rendered,
                                content:rawDataOfPage.content.rendered,
                                estimatedReadingTimes:isNum(estimatedReadingTimes) && estimatedReadingTimes > 0 ? estimatedReadingTimes : 0
                            };

                            const additionalPromises = [];
                            if (rawDataOfPage.featured_media) {
                                additionalPromises.push(
                                    fetchMedia({include:[rawDataOfPage.featured_media]})
                                        .then(result => {
                                            if (result) {
                                                if (result.status == 200) {
                                                    if (result.data && result.data.length > 0) {
                                                        const rawDataOfImage = result.data[0];
                                                        model['thumbnail'] = {
                                                            url:rawDataOfImage.link,
                                                            caption:rawDataOfImage.caption.rendered
                                                        }
                                                    } else {
                                                        /* 查不到資料、回傳資料毀損 => 藉由 null 指示資料有缺漏。 */
                                                        model['thumbnail'] = null;
                                                        isComplete = false;
                                                    }
                                                } else {
                                                    /* 請求不順利 => 藉由 null 指示資料有缺漏。 */
                                                    model['thumbnail'] = null;
                                                    isComplete = false;
                                                }
                                            } else {
                                                //todo
                                            }
                                        })
                                        .catch(error => {
                                            /*
                                              請求過程發生問題。這種情況下不打算做什麼，只藉由 null 註明該欄位資料有缺失
                                            */
                                            model['thumbnail'] = null;
                                            isComplete = false;
                                            return error;
                                        })
                                );
                            }
                            if (rawDataOfPage.parent && rawDataOfPage.parent > 0) {
                                const reqConfigForParentPage = {
                                    params:{
                                        include:[rawDataOfPage.parent].toString()
                                    }
                                }
                                additionalPromises.push(
                                    Axios.get<PageEntity[]>('/wp-json/wp/v2/pages', reqConfigForParentPage)
                                        .then(result => {
                                            if (result.status == 200) {
                                                if (result.data && result.data.length > 0) {
                                                    //如果有查到父頁面，則為 model 補充父頁面的資訊。
                                                    const rawDataOfParentPage = result.data[0];
                                                    model['parent'] = {
                                                        title:rawDataOfParentPage.title.rendered,
                                                        url:rawDataOfParentPage.link,
                                                        slug:rawDataOfParentPage.slug
                                                    }
                                                } else {
                                                    //資料毀損或找不到父頁面，則把父頁面標記為 null
                                                    model['parent'] = null;
                                                    isComplete = false;
                                                }
                                            } else {
                                                /*
                                                  請求不順利 => 藉由 null 指示資料有缺漏。
                                                */
                                                model['parent'] = null;
                                                isComplete = false;
                                            }
                                        })
                                        .catch(error => {
                                            /*
                                              請求過程發生問題。這種情況下不打算做什麼，只藉由 null 註明該欄位資料有缺失
                                            */
                                            model['parent'] = null;
                                            isComplete = false;
                                            return error;
                                        })
                                );
                            }
                            return Promise.all(additionalPromises)
                                     .then(() => {
                                         resolve({
                                             modelObjs:[model],
                                             response:responseOfQueryOfPage,
                                             isComplete:isComplete
                                         });
                                     });
                        } else {
                            //查無此專頁，回報空資料集
                            resolve({
                                modelObjs:[],
                                response:responseOfQueryOfPage,
                                isComplete:isComplete
                            });
                        }
                    } else {
                        /* 因為在開發時無法判斷什麼情況導致 axios 不送回任何物件，或著請求成功，但結果卻不是 200，
                           所以暫時先按照 Axios Promise Catch 的回傳格式送請求資訊給此函式的使用者
                         */
                        reject({
                            request:responseOfQueryOfPage.request,
                            response:responseOfQueryOfPage,
                            message:terms.theResponseStatusCodeIsNot200(terms.pageInWP),
                            config:responseOfQueryOfPage.config
                        });
                    }
                })
                .catch((error) => {
                    //查詢作業失敗，回報給 fetchPages 函式的使用者
                    reject(error);
                });
    });
}

