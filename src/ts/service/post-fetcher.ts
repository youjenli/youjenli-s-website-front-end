import Axios from 'axios';
import { convertGMTDateToLocalDate } from './formatters';
import * as terms from './terms';
import { PostEntity, CategoryEntityInEmbedContext, TagEntityInEmbedContext } from '../model/wp-rest-api';
import { ResultOfFetching } from '../model/general-types';
import { fetchMedia } from '../service/media-fetcher';
import { Post } from '../model/posts';
import { isNotBlank } from './validator';
import { CustomFields } from '../model/wp-rest-api';
import { isNum } from '../service/validator';

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
    if (params) {
        if (isNotBlank(params.slug)) {
            reqConfig.params['slug'] = params.slug;
        }
        
        if (Array.isArray(params.include) && params.include) {
            reqConfig.params['include'] = params.include.toString()
        }

        reqConfig.params['page'] = params.page || 1;

        if (Array.isArray(params.categories)) {
            reqConfig.params['categories'] = params.categories.toString();
        }
    
        if (Array.isArray(params.tags)) {
            reqConfig.params['tags'] = params.tags.toString();
        }

        if (params.per_page) {
            reqConfig.params['per_page'] = params.per_page;
        }

        if (isNotBlank(params.search)) {
            reqConfig.params['search'] = params.search;
        }
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
                        if (responseOfQueryOfFrontPage && responseOfQueryOfFrontPage.status == 200) {
                            let isComplete = true;
                            if (Array.isArray(responseOfQueryOfFrontPage.data) && responseOfQueryOfFrontPage.data.length > 0) {
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
                                        type:post.type,
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
                                    /*
                                     * 如果此發文的記錄中沒有主旨，則 custom-field-gist 欄位會是空字串。
                                       為避免這種情況造成後續步驟的問題，這邊要依據此欄位是否為空來建立對應的內容。
                                     */
                                    if (isNotBlank(post.meta[CustomFields.Gist])) {
                                        metaDataOfPost['gist'] = post.meta[CustomFields.Gist];
                                    }

                                    const estimatedReadingTimes = post.meta[CustomFields.EstimatedReadingTimes];
                                    if (isNum(estimatedReadingTimes) && estimatedReadingTimes > 0 ) {
                                        metaDataOfPost['estimatedReadingTimes'] = estimatedReadingTimes;
                                    } else {
                                        metaDataOfPost['estimatedReadingTimes'] = 0;
                                    }

                                    if (post.comment_status === 'open') {
                                        metaDataOfPost['commentPermitted'] = true;
                                    } else {
                                        metaDataOfPost['commentPermitted'] = false;
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
                                    if (post.featured_media && post.featured_media > 0) {
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
                                            include:categoriesAppearedInFrontPage.toString(),
                                            per_page:categoriesAppearedInFrontPage.length
                                        }
                                    }
                                    const promiseOfCategoryReq = 
                                        Axios.get<CategoryEntityInEmbedContext[]>('/wp-json/wp/v2/categories', config)
                                             .then(response => {
                                                 if (response && response.status == 200) {
                                                     if (response.data.length > 0 ) {
                                                        const mappingsOfCatIdAndCat = {};
                                                        for ( let i = 0 ; i < response.data.length ; i ++) {
                                                            mappingsOfCatIdAndCat[response.data[i].id] = response.data[i];
                                                        }
                                                        for ( let j = 0 ; j < postsWaitingForDataOfCategories.length ; j ++) {
                                                            const post = postsWaitingForDataOfCategories[j];
                                                            post.categories = post.categories.map((catId) => {//todo 半殘
                                                                const category = mappingsOfCatIdAndCat[catId];
                                                                return {
                                                                    id:category.id,
                                                                    name:category.name,
                                                                    url:category.link,
                                                                    description:category.description
                                                                };
                                                            });
                                                        }//整合 category 資訊結束
                                                     } else {
                                                        //處理應該要有資料，卻查不到的狀況：填充 null 到 categories 欄位以利顯示
                                                        isComplete = false;
                                                        for (let k = 0 ; k < postsWaitingForDataOfCategories.length ; k ++) {
                                                            const post = postsWaitingForDataOfCategories[k];
                                                            post.categories = null;
                                                        }
                                                     }
                                                 } else {
                                                     /* 
                                                         這裡包含 response 是 null，以及連線成功，但狀態碼卻不是 200 的狀況。
                                                     */
                                                    isComplete = false;
                                                     for (let k = 0 ; k < postsWaitingForDataOfCategories.length ; k ++) {
                                                         const post = postsWaitingForDataOfCategories[k];
                                                         post.categories = null;
                                                     }
                                                 }
                                             }).catch(error => {
                                                    isComplete = false;
                                                    for (let k = 0 ; k < postsWaitingForDataOfCategories.length ; k ++) {
                                                        const post = postsWaitingForDataOfCategories[k];
                                                        post.categories = null;
                                                    }
                                                    return error;
                                             });
                                    additionalRequests.push(promiseOfCategoryReq);
                                }
                            
                                if (tagsAppearedInFrontPage.length > 0) {
                                    const config ={ 
                                        params:{
                                            context:'embed',
                                            include:tagsAppearedInFrontPage.toString(),
                                            per_page:tagsAppearedInFrontPage.length
                                        }
                                    }
                                    const promiseOfTagReq = 
                                        Axios.get<TagEntityInEmbedContext[]>('/wp-json/wp/v2/tags', config)
                                            .then((response) => {
                                                    if (response && response.status == 200) {
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
                                                            isComplete = false;
                                                            for (let m = 0 ; m < postsWaitingForDataOfTags.length ; m ++) {
                                                                const post = postsWaitingForDataOfTags[m];
                                                                post.tags = null;
                                                            }
                                                        }
                                                    } else {
                                                        /* 
                                                            這裡包含 response 是 null，以及連線成功，但狀態碼卻不是 200 的狀況。
                                                        */
                                                        isComplete = false;
                                                        for (let m = 0 ; m < postsWaitingForDataOfTags.length ; m ++) {
                                                            const post = postsWaitingForDataOfTags[m];
                                                            post.tags = null;
                                                        }
                                                    }
                                            }).catch(error => {
                                                isComplete = false;
                                                for (let m = 0 ; m < postsWaitingForDataOfTags.length ; m ++) {
                                                    const post = postsWaitingForDataOfTags[m];
                                                    post.tags = null;
                                                }
                                                return error;
                                            });
                                    additionalRequests.push(promiseOfTagReq);
                                }

                            
                                if (featuredMediaAppearedInFrontPage.length > 0) {
                                    const promiseOfFeaturedMediaReq = 
                                            fetchMedia({
                                                    include:featuredMediaAppearedInFrontPage,
                                                    per_page:featuredMediaAppearedInFrontPage.length
                                                })
                                                .then((response) => {
                                                    if (response && response.status == 200) {
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
                                                            isComplete = false;
                                                            Object.values(mappingsOfFeaturedMediaIdAndPost).forEach((posts) => {
                                                                posts.forEach((post) => {
                                                                    post.thumbnail = null;
                                                                });
                                                            });
                                                        }
                                                    } else {
                                                        /*
                                                            照理說不該發生，但還是處理一下沒有回應物件，以及回應狀態碼不是 200 的狀況。
                                                         */
                                                        isComplete = false;
                                                        Object.values(mappingsOfFeaturedMediaIdAndPost).forEach((posts) => {
                                                            posts.forEach((post) => {
                                                                post.thumbnail = null;
                                                            });
                                                        });
                                                    }
                                                }).catch(error => {
                                                    isComplete = false;
                                                    Object.values(mappingsOfFeaturedMediaIdAndPost).forEach((posts) => {
                                                        posts.forEach((post) => {
                                                            post.thumbnail = null;
                                                        });
                                                    });
                                                    return error;
                                                });
                                    additionalRequests.push(promiseOfFeaturedMediaReq);
                                }

                                Promise.all(additionalRequests)
                                       .then(() => {
                                           resolve({
                                               modelObjs:<Post[]>dataOfPosts,
                                               response:responseOfQueryOfFrontPage,
                                               isComplete:isComplete
                                           });
                                       });
                            } else {
                                resolve({
                                    modelObjs:[],
                                    response:responseOfQueryOfFrontPage,
                                    isComplete:isComplete
                                });
                            }
                        } else {
                            /* 
                               因為在開發時無法判斷什麼情況導致 axios 不送回任何物件，或著請求成功，但結果卻不是 200，
                               所以暫時先按照 Axios Promise Catch 的回傳格式送請求資訊給此函式的使用者。
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