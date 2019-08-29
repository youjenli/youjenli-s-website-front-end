import Axios from 'axios';
import { convertGMTDateToLocalDate } from './formatters';
import * as terms from './terms';
import { PostEntity, CategoryEntityInEmbedContext, TagEntityInEmbedContext, ResultOfFetching } from '../model/wp-rest-api';
import { fetchMedia } from '../service/media-fetcher';
import { Post } from '../model/posts';
import {isNotBlank, isString} from './validator';

export interface ConfigurationOfFetching {
    page?:number;
    slug?:string;
    include?:number[];
    categories?:number[];
    tags?:number[];
    per_page?:number;
    search?:string;
}

export function fetchPosts(params:ConfigurationOfFetching):Promise<ResultOfFetching<Post>> {
    const reqConfig = {
        params:{}
    };
    if (isNotBlank(params.slug)) {
        reqConfig.params['slug'] = params.slug;
    } else if (Array.isArray(params.include) && params.include) {
        reqConfig.params['include'] = params.include.toString()
    }
    let targetPage = 1;
    if ((params && !isNaN(params.page))) {
        targetPage = params.page;
    }
    reqConfig.params['page'] = targetPage;
    if (Array.isArray(params.categories)) {
        reqConfig.params['categories'] = params.categories.toString();
    }
    if (Array.isArray(params.tags)) {
        reqConfig.params['tags'] = params.tags.toString();
    }
    if (!isNaN(params.per_page)) {
        reqConfig.params['per_page'] = params.per_page;
    }

    if (isString(params.search)) {
        reqConfig.params['search'] = params.search;
    }

    return new Promise<ResultOfFetching<Post>>((resolve, reject) => {
                    Axios.get<PostEntity[]>('/wp-json/wp/v2/posts', reqConfig)
                        .then((responseOfQueryOfFrontPage) => {
                        /*
                            要處理的事情
                            3. 處理 excerpt 帶有 html 格式的問題
                            https://wordpress.org/support/topic/wordpress-com-forums-support-blog-post-excerpt-in-rest-api-call/
                            4. 讀出 response header X-WP-TotalPages 的值以便傳給樣板
                            方法是取得 response.headers，做法可參考
                            https://codepen.io/youjenli/pen/BeVVgq?editors=1111
                        */
                        if (responseOfQueryOfFrontPage.status == 200) {
                            const result = responseOfQueryOfFrontPage.data;
                            let categoriesAppearedInFrontPage = [];//要查詢的分類 id 列表
                            let tagsAppearedInFrontPage = [];//要查詢的標籤 id 列表
                            let featuredMediaAppearedInFrontPage = [];//要查詢的意象圖 id 列表
                            const postsWaitingForDataOfCategories = [];//要查詢分類名稱的陣列
                            const postsWaitingForDataOfTags = [];//要查詢標籤的陣例
                            const mappingsOfFeaturedMediaIdAndPost = [];//對應 feature_media id 和一系列發表物的 map
                            let dataOfPosts = [];//最後要提供給樣板的發表物
                            for (let k = 0 ; k < result.length ; k ++) {
                                const post = result[k];
                                const metaDataOfPost = {
                                    id:post.id,
                                    url:post.link,
                                    date:convertGMTDateToLocalDate(new Date(post.date_gmt)),
                                    title:post.title.rendered,
                                    slug:post.slug,
                                    excerpt:post.excerpt.rendered,
                                    content:post.content.rendered
                                }
                                //調整時間格式
                                metaDataOfPost['date'] = convertGMTDateToLocalDate(new Date(post.date_gmt));
                                if (post.modified) {
                                    metaDataOfPost['modified'] = convertGMTDateToLocalDate(new Date(post.modified_gmt));
                                }
                                //準備分類資料
                                if (post.categories.length > 0) {
                                    /*因為暫時沒空完全搞懂 wordpress rest api 的實作方式以便加入分類名稱的資訊到上面去
                                        所以先多發一個請求來完成這項作業。
                                    */
                                   const idOfMeaningfulCategories = post.categories.filter(categoryId => categoryId !== 1);
                                   if (idOfMeaningfulCategories.length > 0) {
                                      metaDataOfPost['categories'] = idOfMeaningfulCategories;
                                      for (let j = 0 ; j < idOfMeaningfulCategories.length ; j ++) {
                                          if (!categoriesAppearedInFrontPage.includes(idOfMeaningfulCategories[j])) {
                                              categoriesAppearedInFrontPage.push(idOfMeaningfulCategories[j]);
                                          }
                                      }
                                      postsWaitingForDataOfCategories.push(metaDataOfPost);
                                   } else {
                                      metaDataOfPost['categories'] = [];
                                   }
                                } else {
                                    metaDataOfPost['categories'] = [];
                                }
                                //準備標籤資料
                                if (post.tags.length > 0) {
                                    /*因為暫時沒空完全搞懂 wordpress rest api 的實作方式以便加入標籤名稱的資訊到上面去
                                        所以先多發一個請求來完成這項作業。
                                    */
                                    metaDataOfPost['tags'] = post.tags;
                                    for (let j = 0 ; j < post.tags.length ; j ++) {
                                        if (!tagsAppearedInFrontPage.includes(post.tags[j])) {
                                            tagsAppearedInFrontPage.push(post.tags[j]);
                                        }
                                    }
                                    postsWaitingForDataOfTags.push(metaDataOfPost);
                                } else {
                                    metaDataOfPost['tags'] = [];
                                }
                                if (!isNaN(post.featured_media) && post.featured_media > 0) {
                                    featuredMediaAppearedInFrontPage.push(post.featured_media);
                                    if (Array.isArray(mappingsOfFeaturedMediaIdAndPost[post.featured_media])) {
                                        mappingsOfFeaturedMediaIdAndPost[post.featured_media].push(metaDataOfPost);
                                    } else {
                                        mappingsOfFeaturedMediaIdAndPost[post.featured_media] = [metaDataOfPost];
                                    }
                                }
                                dataOfPosts.push(metaDataOfPost);
                            }
                        
                            const additionalRequests = [];
                            if (categoriesAppearedInFrontPage.length > 0) {
                                const config ={ 
                                    params:{
                                        context:'embed',
                                        include:categoriesAppearedInFrontPage.toString()
                                    }
                                }
                                const promiseOfCategoryReq = 
                                    Axios.get<CategoryEntityInEmbedContext[]>('/wp-json/wp/v2/categories', config)
                                        .then((response) => {
                                        if (response != null) {//有送出請求且有正常回應
                                            if (response.status == 200) {
                                                if (response.data.length > 0 ) {
                                                    const mappingsOfCatIdAndCat = {};
                                                    for ( let i = 0 ; i < response.data.length ; i ++) {
                                                        mappingsOfCatIdAndCat[response.data[i].id] = response.data[i];
                                                    }
                                                    for ( let j = 0 ; j < postsWaitingForDataOfCategories.length ; j ++) {
                                                        const post = postsWaitingForDataOfCategories[j];
                                                        post.categories = post.categories.map((catId) => {
                                                            const category = mappingsOfCatIdAndCat[catId];
                                                            return {
                                                                id:category.id,
                                                                name:category.name,
                                                                url:category.link,
                                                                description:category.description
                                                            };
                                                        });
                                                    }//整合 category 資訊結束
                                                } else {//處理應該要有資料，卻查不到的狀況：填充 null 到 categories 欄位以利顯示
                                                    for (let k = 0 ; k < postsWaitingForDataOfCategories.length ; k ++) {
                                                        const post = postsWaitingForDataOfCategories[k];
                                                        post.categories = null;
                                                    }
                                                }
                                            } else {// 處理連線成功，但狀態碼卻不是 200 的狀況。
                                                for (let k = 0 ; k < postsWaitingForDataOfCategories.length ; k ++) {
                                                    const post = postsWaitingForDataOfCategories[k];
                                                    post.categories = null;
                                                }
                                            }
                                        } else {//照理說不該發生，但還是處理一下 response 是 null 的情況。
                                                for (let k = 0 ; k < postsWaitingForDataOfCategories.length ; k ++) {
                                                    const post = postsWaitingForDataOfCategories[k];
                                                    post.categories = null;
                                                }
                                        }
                                        }).catch(() => {//解析連線失敗原因並妥善處理
                                                for (let k = 0 ; k < postsWaitingForDataOfCategories.length ; k ++) {
                                                    const post = postsWaitingForDataOfCategories[k];
                                                    post.categories = null;
                                                }
                                        });
                                additionalRequests.push(promiseOfCategoryReq);
                            }
                        
                            if (tagsAppearedInFrontPage.length > 0) {
                                const config ={ 
                                    params:{
                                        context:'embed',
                                        include:tagsAppearedInFrontPage.toString()
                                    }
                                }
                                const promiseOfTagReq = 
                                    Axios.get<TagEntityInEmbedContext[]>('/wp-json/wp/v2/tags', config)
                                        .then((response) => {
                                                if (response != null) {//有送出請求且有正常回應
                                                    if (response.status == 200) {
                                                        if (response.data.length > 0 ) {
                                                            const mappingsOfTagIdAndTag = {};
                                                            for ( let i = 0 ; i < response.data.length ; i ++) {
                                                                mappingsOfTagIdAndTag[response.data[i].id] = response.data[i];
                                                            }
                                                            for ( let j = 0 ; j < postsWaitingForDataOfTags.length ; j ++) {
                                                                const post = postsWaitingForDataOfTags[j];
                                                                post.tags = post.tags.map((catId) => {
                                                                    const tag = mappingsOfTagIdAndTag[catId];
                                                                    return {
                                                                        id:tag.id,
                                                                        name:tag.name,
                                                                        url:tag.link,
                                                                        description:tag.description
                                                                    };
                                                                });
                                                            }//整合 tag 資訊結束
                                                        } else {//處理應該要有資料，卻查不到的狀況：填充 null 到 tags 欄位以利顯示。
                                                            for (let m = 0 ; m < postsWaitingForDataOfTags.length ; m ++) {
                                                                const post = postsWaitingForDataOfTags[m];
                                                                post.tags = null;
                                                            }
                                                        }
                                                    } else {// 處理連線成功，結果查詢卻失敗的狀況
                                                        for (let m = 0 ; m < postsWaitingForDataOfTags.length ; m ++) {
                                                            const post = postsWaitingForDataOfTags[m];
                                                            post.tags = null;
                                                        }
                                                    }
                                                } else {//照理說不該發生，但還是處理一下 response 是 null 的情況。
                                                    for (let m = 0 ; m < postsWaitingForDataOfTags.length ; m ++) {
                                                        const post = postsWaitingForDataOfTags[m];
                                                        post.tags = null;
                                                    }
                                                }
                                        }).catch(() => {// 解析錯誤原因並妥善處理
                                            for (let m = 0 ; m < postsWaitingForDataOfTags.length ; m ++) {
                                                const post = postsWaitingForDataOfTags[m];
                                                post.tags = null;
                                            }
                                        });
                                additionalRequests.push(promiseOfTagReq);
                            }
                            
                        
                            if (featuredMediaAppearedInFrontPage.length > 0) {
                                const promiseOfFeaturedMediaReq = 
                                        fetchMedia({include:featuredMediaAppearedInFrontPage})
                                            .then((response) => {
                                                if (response != null) {//有發送請求
                                                    if (response.status == 200) {
                                                        if (response.data.length > 0 ) {
                                                            for (let i = 0 ; i < response.data.length ; i ++) {
                                                                const media = response.data[i];
                                                                //確認媒體型態是圖片，以及確實有文章需要 thumbnail
                                                                if (/^image\/.*/.test(media.mime_type) && mappingsOfFeaturedMediaIdAndPost[media.id]) {
                                                                    mappingsOfFeaturedMediaIdAndPost[media.id].forEach((post) => {
                                                                        post.thumbnail = {
                                                                            url:media.source_url,
                                                                            caption:media.caption.rendered
                                                                        };
                                                                    });
                                                                }
                                                            }//整合媒體作業結束
                                                        } else {//處理查不到資料的狀況：填充 null 到 tags 欄位以利顯示
                                                            Object.values(mappingsOfFeaturedMediaIdAndPost).forEach((posts) => {
                                                                posts.forEach((post) => {
                                                                    post.thumbnail = null;
                                                                });
                                                            });
                                                        }
                                                    } else {
                                                        Object.values(mappingsOfFeaturedMediaIdAndPost).forEach((posts) => {
                                                            posts.forEach((post) => {
                                                                post.thumbnail = null;
                                                            });
                                                        });
                                                    }
                                                } else {//照理說不該發生，但還是處理一下 response 是 null 的情況。
                                                    Object.values(mappingsOfFeaturedMediaIdAndPost).forEach((posts) => {
                                                        posts.forEach((post) => {
                                                            post.thumbnail = null;
                                                        });
                                                    });
                                                }
                                            }).catch(() => {
                                                Object.values(mappingsOfFeaturedMediaIdAndPost).forEach((posts) => {
                                                    posts.forEach((post) => {
                                                        post.thumbnail = null;
                                                    });
                                                });
                                            });
                                additionalRequests.push(promiseOfFeaturedMediaReq);
                            }
                            
                            Promise.all(additionalRequests)
                                   .then(() => {
                                       resolve({
                                           modelObjs:<Post[]>dataOfPosts,
                                           response:responseOfQueryOfFrontPage
                                       });
                                   })
                                   .catch(() => {
                                        /*
                                          因為前面已經準備好分類、標籤、意象圖都查不到的狀況，
                                          而且後續畫面樣板也有資料殘缺時的應對方式，
                                          所以當這些請求任一者失敗時，這邊只要照常回傳發文查詢結果即可。
                                        */
                                        resolve({
                                            modelObjs:<Post[]>dataOfPosts,
                                            response:responseOfQueryOfFrontPage
                                        })
                                   });
                        } else {
                            /* 因為在開發時無法判斷到底是什麼原因導致請求會成功，但結果卻不是 200，
                               所以暫時先按照 Axios Promise Catch 的回傳格式送請求資訊給此函式的使用者
                             */
                            reject({
                                request:responseOfQueryOfFrontPage.request,
                                response:responseOfQueryOfFrontPage,
                                message:terms.theResponseStatusCodeIsNot200(terms.postInWP),
                                config:responseOfQueryOfFrontPage.config
                            });
                        }
                    })
                    .catch(error => {
                        //這種情況只把 Axios 錯誤訊息原封不動地交給此函式的使用者處理，不事先處理。
                        reject(error);
                    });
    });
}