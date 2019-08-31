import Axios from 'axios';
import { fetchCategories, ConfigurationOfFetching as ConfigurationOfCategoryFetching } from './category-fetcher';
import { fetchTags, ConfigurationOfFetching as ConfigurationOfTagFetching } from './tag-fetcher';
import {ResultOfSearch, ResultOfQuery, FoundPublication} from '../model/search-results';
import { Category, Tag } from '../model/terms';
import { getBaseUrl, defaultEndSize, defaultMidSize } from '../model/pagination';
import {FoundEntityInBothViewAndEmbedContext} from '../model/wp-rest-api';
import { TypeOfContent } from '../model/general-types';
import { fetchPosts } from './post-fetcher';
import { fetchPages } from './page-fetcher';
import {theResponseStatusCodeOfSearchIsNot200} from './terms';
import {isString, isNotBlank} from '../service/validator';
import {ResultOfFetching} from '../model/wp-rest-api';
import {Term} from '../model/terms';

interface ConfigurationOfSearch {
    keyword:string;
    page?:number;
    publicationsPerPage?:number;
    taxonomiesPerPage?:number;
}

export interface ConfigurationOfPublicationFetching {
    search:string,
    per_page?:number,
    page?:number
}

export function searchPublications(config:ConfigurationOfPublicationFetching, baseUrl:string):
    Promise<ResultOfQuery<FoundPublication>> {
        const page = config.page || 1;

        const reqConfigOfPosts = {
            params:{
                page:page
            }
        }
        if (config) {
            if (isNotBlank(config.search)) {
                reqConfigOfPosts.params['search'] = config.search;
            } else {
                //todo reject
            }

            if (config.per_page) {
                reqConfigOfPosts.params['per_page'] = config.per_page;
            }
        }
        
        return new Promise<ResultOfQuery<FoundPublication>>((resolve, reject) => {
                       Axios.get<FoundEntityInBothViewAndEmbedContext[]>('/wp-json/wp/v2/search', reqConfigOfPosts)
                            .then(resultOfSearch => {
                                if (resultOfSearch.status == 200) {
                                    const postsWaitingToFetch = {};
                                    const pagesWaitingToFetch = {};
                                    const foundPublications = resultOfSearch.data.map(pub => {
                                        /*
                                            注意，在 rest 服務回傳的 json 物件裡，用來指出物件類型的屬性是 subtype 而不是 type，
                                            實作時不要搞混以免前端因為找不到部分頁面而無法正常呈現內容。詳見：
                                            https://developer.wordpress.org/rest-api/reference/search-results/
                                        */
                                        if (pub.subtype == TypeOfContent.Post) {
                                            const post = {
                                                type:TypeOfContent.Post,
                                                id:pub.id,
                                                url:pub.url,
                                                title:pub.title
                                            };
                                            postsWaitingToFetch[pub.id] = post;
                                            return post;
                                        } else if (pub.subtype == TypeOfContent.Page) {
                                            const page = {
                                                type:TypeOfContent.Page,
                                                id:pub.id,
                                                url:pub.url,
                                                title:pub.title
                                            }
                                            pagesWaitingToFetch[pub.id] = page
                                            return page;
                                        }
                                    });
                                    const promises = [];
                                    let keysOfPostsWaitingToFetch = Object.keys(postsWaitingToFetch);
                                    if (keysOfPostsWaitingToFetch.length > 0) {
                                       promises.push(
                                         fetchPosts({ include:keysOfPostsWaitingToFetch.map(id => parseInt(id))})
                                             .then(resultOfFetching => {
                                                 if (resultOfFetching.modelObjs.length > 0) {
                                                     const posts = resultOfFetching.modelObjs;
                                                     for (let post of posts) {
                                                         const pendingPost = postsWaitingToFetch[post.id];
                                                         if (pendingPost) {
                                                             Object.assign(pendingPost, post);
                                                         }
                                                     }
                                                 }
                                             })
                                             .catch(error => {
                                                 /*
                                                     若查詢文章的請求失敗，則填充目前已經查到的搜尋結果，提供不完整的資料給使用者。
                                                     todo 作法待評估，給這麼殘的資料是否有意義？
                                                 */
                                                 for (let key in keysOfPostsWaitingToFetch) {
                                                     const post = postsWaitingToFetch[key];
                                                     post.date = null;
                                                     post.modified = null;
                                                     post.slug = null;
                                                     post.excerpt = null;
                                                     post.thumbnail = null;
                                                     post.categories = null;
                                                     post.tags = null;
                                                     post.content = null;
                                                 }
                                                 return error;//使 promise 回到正常流程。
                                             })
                                       );
                                    }
                                
                                    let keysOfPagesWaitingToFetch = Object.keys(pagesWaitingToFetch);
                                    if (keysOfPagesWaitingToFetch.length > 0) {
                                       promises.push(
                                         fetchPages({ include:keysOfPagesWaitingToFetch.map(id => parseInt(id)) })
                                             .then(resultOfFetching => {
                                                 if (resultOfFetching.modelObjs.length > 0) {
                                                     const pages = resultOfFetching.modelObjs;
                                                     for (let page of pages) {
                                                         const pendingPage = pagesWaitingToFetch[page.id];
                                                         if (pendingPage) {
                                                             Object.assign(pendingPage, page);
                                                         }
                                                     }
                                                 }
                                             })
                                             .catch(error => {
                                                 /*
                                                     若查詢專頁的請求失敗，則填充目前已經查到的搜尋結果，提供不完整的資料給使用者。
                                                     todo 作法待評估，給這麼殘的資料是否有意義？
                                                 */
                                                 for (let key in keysOfPagesWaitingToFetch) {
                                                     const page = pagesWaitingToFetch[key];
                                                     page.date = null;
                                                     page.modified = null;
                                                     page.slug = null;
                                                     page.excerpt = null;
                                                     page.thumbnail = null;
                                                     page.parent = null;
                                                     page.content = null;
                                                 }
                                                 return error;//使 promise 回到正常流程。
                                             })
                                       );
                                    }
                                    Promise.all<ResultOfQuery<FoundPublication>>(promises)
                                      .then(() => {
                                          resolve({
                                              numberOfResults:resultOfSearch.headers['x-wp-total'],
                                              pageContent:foundPublications as FoundPublication[],
                                              pagination:{
                                                  baseUrl:baseUrl,
                                                  endSize:defaultEndSize,
                                                  midSize:defaultMidSize,
                                                  totalPages:resultOfSearch.headers['x-wp-totalpages'],
                                                  currentPage:page,
                                                  itemsPerPage:foundPublications.length
                                              }
                                          });
                                      });
                                } else {
                                   reject({
                                     request:resultOfSearch.request,
                                     response:resultOfSearch,
                                     message:theResponseStatusCodeOfSearchIsNot200(),
                                     config:resultOfSearch.config
                                   });
                                }
                            })
                            .catch(error => reject(error))//拋出例外，讓這部分搜尋結果套用預設值
                   });
}

/* 這個函式的用途是轉化分類和標籤的資料格式，使他們成為前端功能可接受的物件。
 */
function createResultHandlerForTaxonomy<T extends Term>(baseUrl:string, currentPage:number):
    (result:ResultOfFetching<T>) => ResultOfQuery<T> {
        return (result:ResultOfFetching<T>) => {
            const resultOfQuery:ResultOfQuery<T> = {
                numberOfResults:result.response.headers['x-wp-total'],
                pageContent:result.modelObjs,
                pagination:{
                    endSize:defaultEndSize,
                    midSize:defaultMidSize,
                    totalPages:result.response.headers['x-wp-totalpages'],
                    currentPage:currentPage
                }
            }
            if (isString(baseUrl)) {
                resultOfQuery.pagination['baseUrl'] = baseUrl;
            }

            return resultOfQuery;
        }
}

export function searchCategory(config:ConfigurationOfCategoryFetching, baseUrl:string):Promise<ResultOfQuery<Category>> {
    return fetchCategories(config)
                .then(createResultHandlerForTaxonomy(baseUrl, config.page));
}

export function searchTag(config:ConfigurationOfTagFetching, baseUrl:string):Promise<ResultOfQuery<Tag>> {
    return fetchTags(config)
                .then(createResultHandlerForTaxonomy(baseUrl, config.page));
}

export function search(config:ConfigurationOfSearch):Promise<ResultOfSearch> {

    let reqConfigOfPosts = null;
    let reqConfigOfTaxonomy = null;
    if (config) {
        /*
          注意，因為後續函式會檢查請求參數的型態，所以這邊就不再浪費運算力檢查。
        */
        reqConfigOfPosts = {
            search:config.keyword,
            page:config.page,
            per_page:config.publicationsPerPage
        }
        reqConfigOfTaxonomy = {
            search:config.keyword,
            page:1,
            per_page:config.taxonomiesPerPage
        }
    } else {
        //todo reject
    }

    /*
      先準備後序查詢要用的資訊以及資料的結構。
    */
    const baseUrl = getBaseUrl();
    /*
      以下是所有資料的預設值。
      為了在部分請求失敗的情況下仍可提供一部分資訊給使用者，因此這裡的欄位才會都有預設值。
    */
    const resultOfSearch:ResultOfSearch = {
        query:config.keyword,
        publications:{
            numberOfResults:0,
            pageContent:null,
            pagination:{
                baseUrl:baseUrl,
                endSize:defaultEndSize,
                midSize:defaultMidSize,
                totalPages:0,
                currentPage:0,
                itemsPerPage:0
            }
        },
        categories:{
            numberOfResults:0,
            pageContent:null,
            pagination:{
                endSize:defaultEndSize,
                midSize:defaultMidSize,
                totalPages:0,
                currentPage:0,
                itemsPerPage:0
            }
        },
        tags:{
            numberOfResults:0,
            pageContent:null,
            pagination:{
                endSize:defaultEndSize,
                midSize:defaultMidSize,
                totalPages:0,
                currentPage:0,
                itemsPerPage:0
            }
        }
    };

    return Promise.all([
                        searchPublications(reqConfigOfPosts, baseUrl)
                            .then(result => {
                                resultOfSearch['publications'] = result;
                            })
                            .catch(error => {return error;}),
                        searchCategory(reqConfigOfTaxonomy, baseUrl)
                            .then(result => {
                                resultOfSearch['categories'] = result;
                            })
                            .catch(error => {return error;}),
                        searchTag(reqConfigOfTaxonomy, baseUrl)
                            .then(result => {
                                resultOfSearch['tags'] = result;
                            })
                            .catch(error => {return error;}),
                    ])
                    .then(() => {
                        return resultOfSearch;
                    });
}