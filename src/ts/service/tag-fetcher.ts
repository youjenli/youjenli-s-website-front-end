import Axios from 'axios';
import { Tag } from '../model/terms';
import { TagEntityInViewContext } from '../model/wp-rest-api';
import { ResultOfFetching } from '../model/general-types';
import {isNotBlank} from './validator';
import * as terms from './terms';

export interface ConfigurationOfFetching {
    slug?:string;
    page?:number;
    per_page?:number;
    search?:string;
}

export function fetchTags(params:ConfigurationOfFetching):Promise<ResultOfFetching<Tag>> {
    
    const reqConfig = {
        params:{}
    };
    if (params) {
        if (isNotBlank(params['slug'])) {
            reqConfig.params['slug'] = params['slug'];
        }
        reqConfig.params['page'] = params['page'] || 1;

        if (params['per_page']) {
            reqConfig.params['per_page'] = params['per_page'];
        }

        if (isNotBlank(params['search'])) {
            reqConfig.params['search'] = params['search'];
        }
    }

    return new Promise<ResultOfFetching<Tag>>((resolve, reject) => {
                Axios.get<TagEntityInViewContext[]>('/wp-json/wp/v2/tags', reqConfig)
                     .then(response => {
                         if (response && response.status == 200) {
                             if (Array.isArray(response.data)) {
                                resolve({
                                    modelObjs:response.data.map<Tag>((item) => {
                                        return {
                                            id:item.id,
                                            name:item.name,
                                            slug:item.slug,
                                            url:item.link,
                                            description:item.description,
                                        };
                                    }),
                                    response:response,
                                    isComplete:true
                                });
                             } else {
                                 // axios 沒有提供資料，回報異常。
                                reject({
                                    request:response.request,
                                    response:response,
                                    message:terms.didNotFoundTheDataWhichWasSupposedToAttachedInResponse(terms.tagOfTaxonomy),
                                    config:response.config
                                });
                             }
                         } else {
                             /* 因為在開發時無法判斷到底是什麼原因導致請求會成功，但結果卻不是 200，
                                所以暫時先按照 Axios Promise Catch 的回傳格式送請求資訊給此函式的使用者
                              */
                             reject({
                                 request:response.request,
                                 response:response,
                                 message:terms.theResponseStatusCodeIsNot200(terms.tagOfTaxonomy),
                                 config:response.config
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