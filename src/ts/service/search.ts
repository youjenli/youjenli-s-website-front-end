import Axios from 'axios';
import { fetchCategories } from './category-fetcher';
import { fetchTags } from './tag-fetcher';
import { FoundPublication} from '../model/search-results';
import { Tag, Category } from '../model/terms';
import { FoundEntityInBothViewAndEmbedContext } from '../model/wp-rest-api';
import { TypeOfContent, ResultOfFetching } from '../model/general-types';
import { fetchPosts } from './post-fetcher';
import { fetchPages } from './page-fetcher';
import { theResponseStatusCodeOfSearchIsNot200 } from './terms';
import { isNotBlank } from '../service/validator';

export interface ConfigurationOfPublicationFetching {
    search:string,
    per_page?:number,
    page?:number
}

export function searchPublications(config:ConfigurationOfPublicationFetching):
        Promise<ResultOfFetching<FoundPublication>> {
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
        
        return new Promise<ResultOfFetching<FoundPublication>>((resolve, reject) => {
                       Axios.get<FoundEntityInBothViewAndEmbedContext[]>('/wp-json/wp/v2/search', reqConfigOfPosts)
                            .then(responseOfSearch => {
                                if (responseOfSearch.status == 200) {
                                    let isComplete = true;
                                    const postsWaitingToFetch = {};
                                    const pagesWaitingToFetch = {};
                                    const foundPublications = responseOfSearch.data.map(pub => {
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
                                             .then(responseOfFetching => {
                                                 if (responseOfFetching.modelObjs.length > 0) {
                                                     const posts = responseOfFetching.modelObjs;
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
                                                 */
                                                 isComplete = false;
                                                 for (let key in keysOfPostsWaitingToFetch) {//todo 作法待評估，給這麼殘的資料是否有意義？
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
                                             .then(responseOfFetching => {
                                                 if (responseOfFetching.modelObjs.length > 0) {
                                                     const pages = responseOfFetching.modelObjs;
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
                                                 */
                                                 isComplete = false;
                                                 for (let key in keysOfPagesWaitingToFetch) {//todo 作法待評估，給這麼殘的資料是否有意義？
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
                                    Promise.all<ResultOfFetching<FoundPublication>>(promises)
                                           .then(() => {
                                               resolve({
                                                   modelObjs:foundPublications as FoundPublication[],
                                                   response:responseOfSearch,
                                                   isComplete:isComplete
                                               });
                                           });
                                } else {
                                    reject({
                                       request:responseOfSearch.request,
                                       response:responseOfSearch,
                                       message:theResponseStatusCodeOfSearchIsNot200(),
                                       config:responseOfSearch.config
                                   });
                                }
                            })
                            .catch(error => reject(error))//拋出例外，讓這部分搜尋結果套用預設值
                   });
}

interface ConfigurationOfSearch {
    keyword:string;
    pageOfPublications?:number;
    pageOfTaxonomies?:number;
    publicationsPerPage?:number;
    taxonomiesPerPage?:number;
}

type ResultOfSearch = {
    query:string;
    publications:ResultOfFetching<FoundPublication>;
    categories:ResultOfFetching<Category>;
    tags:ResultOfFetching<Tag>;
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
            page:config.pageOfPublications,
            per_page:config.publicationsPerPage
        }
        reqConfigOfTaxonomy = {
            search:config.keyword,
            page:config.pageOfTaxonomies,
            per_page:config.taxonomiesPerPage
        }
    } else {
        //todo reject
    }

    /*
      以下是所有資料的預設值。
      為了在部分請求失敗的情況下仍可提供一部分資訊給使用者，因此這裡的欄位才會都有預設值。
    */
    const resultOfSearch:ResultOfSearch = {
        query:config.keyword,
        publications:{
            modelObjs:null,
            response:null,
            isComplete:false
        },
        categories:{
            modelObjs:null,
            response:null,
            isComplete:false
        },
        tags:{
            modelObjs:null,
            response:null,
            isComplete:false
        }
    };

    return Promise.all([
                        searchPublications(reqConfigOfPosts)
                            .then(result => {
                                resultOfSearch['publications'] = result;
                            })
                            .catch(error => {
                                if (error && error.response) {
                                    resultOfSearch.publications.response = error.response;
                                }
                                return error;
                            }),
                        fetchCategories(reqConfigOfTaxonomy)
                            .then(result => {
                                resultOfSearch['categories'] = result;
                            })
                            .catch(error => {
                                if (error && error.response) {
                                    resultOfSearch.categories.response = error.response;
                                }
                                return error;
                            }),
                        fetchTags(reqConfigOfTaxonomy)
                            .then(result => {
                                resultOfSearch['tags'] = result;
                            })
                            .catch(error => {
                                if (error && error.response) {
                                    resultOfSearch.tags.response = error.response;
                                }
                                return error;
                            }),
                    ])
                    .then(() => {
                        return resultOfSearch;
                    });
}