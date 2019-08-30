import Axios from 'axios';
import { CategoryEntityInViewContext, ResultOfFetching } from '../model/wp-rest-api';
import { Category } from '../model/terms';
import {isNotBlank} from './validator';
import * as terms from './terms';
import { isString } from 'util';

export interface ConfigurationOfFetching {
    page?:number;
    slug?:string;
    parent?:number;
    includeParent?:boolean;
    include?:number[];
    per_page?:number;
    search?:string;
}

export function fetchCategories(params:ConfigurationOfFetching):Promise<ResultOfFetching<Category>> {
    let includeParent = false;
    if (params['includeParent']) {
        includeParent = true;
    }

    const reqConfig = {
        params:{}
    };
    if (isNotBlank(params['slug'])) {
        reqConfig.params['slug'] = params['slug'];
    }
    
    reqConfig.params['page'] = params['page'] || 1;

    if (params['per_page']) {
        reqConfig.params['per_page'] = params['per_page'];
    }

    if (Array(params['parent'])) {
        reqConfig.params['parent'] = params['parent'];
    }

    if (Array.isArray(params['include'])) {
        reqConfig.params['include'] = params['include'].toString();
    }

    if (isString(params['search'])) {
        reqConfig.params['search'] = params['search'];
    }

    return new Promise<ResultOfFetching<Category>>((resolve, reject) => {
                Axios.get<CategoryEntityInViewContext[]>('/wp-json/wp/v2/categories', reqConfig)
                     .then((responseOfQueryOfTaxonomies) => {
                         if (responseOfQueryOfTaxonomies.status == 200) {
                            const result = responseOfQueryOfTaxonomies.data;
                                    
                            let postsWaitingForParent:{
                                [id:number]:Category[]
                            } = [];

                            let dataHandler = () => {
                                return result.map<Category>((item) => {
                                            const taxonomy = {
                                                id:parseInt(item.id),
                                                name:item.name,
                                                slug:item.slug,
                                                url:item.link,
                                                description:item.description
                                            };
                                            if (item.parent != 0) {//若是 0 就代表無父母分類
                                                if (Array.isArray(postsWaitingForParent[item.parent])) {
                                                    postsWaitingForParent[item.parent].push(taxonomy);
                                                } else {
                                                    postsWaitingForParent[item.parent] = [taxonomy];
                                                }
                                            }
                                            return taxonomy;
                                });
                            };
                        
                            const categories:Category[] = dataHandler();
                            if (includeParent) {
                                const idOfParentsWaitingToBeFetch = Object.keys(postsWaitingForParent).map(key => parseInt(key));
                                if (idOfParentsWaitingToBeFetch.length > 0) {//應該去拿一些母分頁回來
                                    fetchCategories({
                                        include:idOfParentsWaitingToBeFetch
                                    })
                                    .then((result) => {
                                        if (result.modelObjs.length > 0) {
                                            result.modelObjs.forEach((taxonomy) => {
                                                postsWaitingForParent[taxonomy.id].forEach((category) => {
                                                    category.parent = {
                                                        id:taxonomy.id,
                                                        name:taxonomy.name,
                                                        slug:taxonomy.slug,
                                                        url:taxonomy.url,
                                                        description:taxonomy.description
                                                    };
                                                });
                                            });
                                        } else {
                                            //意外的查不到資料，塞入填充物
                                            Object.keys(postsWaitingForParent).forEach((key) => {
                                                const index = parseInt(key);//轉型態，這樣 ts 才能辨識內容
                                                postsWaitingForParent[index].forEach((category) => {
                                                    category.parent = null;
                                                });
                                            });
                                        }
                                        resolve({
                                            modelObjs:categories,
                                            response:responseOfQueryOfTaxonomies
                                        });
                                    })
                                    .catch(() => {
                                        //無法順利查詢父母分類時，把等待中專頁拿出來填充父母專頁的欄位
                                        Object.values(postsWaitingForParent).forEach(posts => {
                                            posts.forEach(post => {
                                                post.parent = null;
                                            });
                                        });
                                        resolve({
                                            modelObjs:categories,
                                            response:responseOfQueryOfTaxonomies
                                        });
                                    });
                                }
                            }
                            resolve({
                                modelObjs:categories,
                                response:responseOfQueryOfTaxonomies
                            });
                         } else {
                             /* 因為在開發時無法判斷到底是什麼原因導致請求會成功，但結果卻不是 200，
                                所以暫時先按照 Axios Promise Catch 的回傳格式送請求資訊給此函式的使用者
                              */
                             reject({
                                 request:responseOfQueryOfTaxonomies.request,
                                 response:responseOfQueryOfTaxonomies,
                                 message:terms.theResponseStatusCodeIsNot200(terms.categoryOfTaxonomy),
                                 config:responseOfQueryOfTaxonomies.config
                             });
                         }
                     })
                     .catch(error => {
                         if (error) {
                             reject(error);
                         } else {
                             reject({
                                 request:null,
                                 response:null,
                                 message:terms.somethingSeriousHappenedDuringFetching,
                                 config:reqConfig
                             });
                         }
                     });
    });
}

function recursivelyFetchChildrenTaxonomies(parents:Category[]):Promise<Category[]> {
    return new Promise((resolve) => {
                    Promise.all(parents.map(taxonomy => {
                         return fetchCategories({parent:taxonomy.id})
                                  .catch(error => {
                                      /* 查詢請求失敗時，彙整錯誤訊息並加入空的分類名稱 */
                                      return {
                                          modelObjs:null,
                                          response:error.response
                                      };
                                  });
                         })
                    ).then(results => {
                        let validResults = results.filter(result => Array.isArray(result.modelObjs));
                        let categories:Category[] = [];
                        validResults.forEach(result => {
                            categories = categories.concat(result.modelObjs);
                        });
                        if (categories.length > 0) {
                            recursivelyFetchChildrenTaxonomies(categories)
                                .then((children) => {
                                     categories = categories.concat(children);
                                     resolve(categories);
                                });
                        } else {
                            resolve(categories);
                        }
                    });
               });
}

export function fetchNodesInCategoryTree(slugOfRootCategory:string):Promise<Category[]> {
            return fetchCategories({slug:slugOfRootCategory})
                       .then(result => {
                           if (Array.isArray(result.modelObjs) && result.modelObjs.length > 0) {
                               return recursivelyFetchChildrenTaxonomies([result.modelObjs[0]]);
                           } else {
                               return [];
                           }
                       })
                       .catch(() => {
                           /* 請求過程出現問題，直接回傳 null */
                           return null;
                       });
}