import { router } from '../../service/router';
import { navigateToHomeWithErrorMessage } from '../../index';
import { getPagination, getBaseUrl, defaultEndSize, defaultMidSize } from '../../model/pagination';
import { reactRoot } from '../../index';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GenericSearchResults from './generic';
import { search, searchPublications } from '../../service/search';
import { fetchCategories, ConfigurationOfFetching as ConfigurationOfCategoriesFetching } from '../../service/category-fetcher';
import { fetchTags } from '../../service/tag-fetcher';
import { ResultOfFetching } from '../../model/general-types';
import { Category, Tag } from '../../model/terms';
import { CacheRecordOfResultOfSearch } from '../../model/search-results';
import * as terms from './terms';
import { TypesOfCachedItem, addRecord, getRecord } from '../../service/cache-of-pagination';
import { ConfigurationOfPublicationFetching } from '../../service/search';
import { ConfigurationOfFetching as ConfigurationOfCategoryFetching } from '../../service/category-fetcher';
import { ConfigurationOfFetching as ConfigurationOfTagFetching } from '../../service/tag-fetcher';
import { addTypeOfPostOrPage } from '../post-page-routeWrapper';
import { isNum } from '../../service/validator';
import { ResultOfSearch } from '../../model/search-results';
import { TypeOfContent } from '../../model/general-types';
import { FoundPublication } from '../../model/search-results';
import PageTitle from '../page-title';

let DEFAULT_PUBLICATIONS_PER_PAGE = 10;
let DEFAULT_TAXONOMIES_PER_PAGE = 14;
let resultOfSearch:ResultOfSearch = null;

export type PageClickedHandler = (page:number) => void;

function loadFoundCategoriesFromCache(record:CacheRecordOfResultOfSearch, page:number):void {
    //快取中有紀錄，從裡面拿資料
    resultOfSearch.categories = {
        numberOfResults:record.categories.foundCategories,
        pageContent:record.categories.pageContent[page],
        pagination:{
            endSize:record.categories.pagination.endSize,
            midSize:record.categories.pagination.midSize,
            totalPages:record.categories.pagination.totalPages,
            currentPage:page,
            itemsPerPage:record.categories.pagination.itemsPerPage
        }
    }
    record.categories.pagination.lastVisitedPage = page;
}

function fetchCategoriesAndHandleResult(config:ConfigurationOfCategoriesFetching):Promise<ResultOfFetching<Category>> {
    if (!isNum(config.page)) {
        config.page = 1;
    }
    if (!isNum(config.per_page)) {
        config.per_page = DEFAULT_TAXONOMIES_PER_PAGE;
    }
    return fetchCategories(config)
                .then(result => {
                    const record = getRecord(TypesOfCachedItem.Search, resultOfSearch.query);

                    const numberOfCategoriesFound = result.response.headers['x-wp-total'];
                    const totalPages = result.response.headers['x-wp-totalpages'];
                    resultOfSearch.categories = {
                        numberOfResults:numberOfCategoriesFound,
                        pageContent:result.modelObjs,
                        pagination:{
                            endSize:record.categories.pagination.endSize,
                            midSize:record.categories.pagination.midSize,
                            totalPages:totalPages,
                            currentPage:config.page,
                            itemsPerPage:config.per_page
                        }
                    }
                
                    /*
                        接下來要根據查詢到的結果總數判斷快取是否過期並執行對應的管理作業。
                    */
                    if (numberOfCategoriesFound === record.categories.foundCategories) {
                        //伺服器上的記錄狀態沒變，斷定快取沒過期
                        if (result.isComplete) {
                            record.categories.pageContent[config.page] = result.modelObjs;
                            record.categories.pagination.lastVisitedPage = config.page;
                        }
                        /*
                          註：若此處發現資料不完整的話，那就不加入本地快取，等下次請求時再拿拿看了。
                        */
                    } else {
                        //伺服器上的記錄狀態有變，斷定快取過期，這表示要更新本地快取紀錄
                        record.categories.foundCategories = numberOfCategoriesFound;
                        record.categories.pageContent = {}
                        //根據分頁是否完整，決定要不要加入快取。
                        if (result.isComplete) {
                            record.categories.pageContent[config.page] = result.modelObjs;
                        }
                        record.categories.pagination = {
                            endSize:record.categories.pagination.endSize,
                            midSize:record.categories.pagination.midSize,
                            totalPages:totalPages,
                            itemsPerPage:config.per_page,
                            lastVisitedPage:config.page
                        }
                    }
                    return result;
                });
}

const onPageOfFoundCategoriesChanged:PageClickedHandler = (page:number):void => {
    if (resultOfSearch && resultOfSearch.categories.pagination) {
        const record = getRecord(TypesOfCachedItem.Search, resultOfSearch.query);
        if (record.categories.pageContent[page]) {
            //快取中有紀錄，從裡面拿資料
            loadFoundCategoriesFromCache(record, page);
            renderResultOfSearch();
        } else {
            fetchCategoriesAndHandleResult({
                page:page,
                includeParent:false,
                per_page:resultOfSearch.categories.pagination.itemsPerPage,
                search:resultOfSearch.query
            })
            .catch(() => {
                /* 將此頁內容標記為有缺漏，讓畫面元件呈現合適的內容給使用者
                 */
                resultOfSearch.categories.pageContent = null;
            })
            .finally(() => {
                renderResultOfSearch();
            });
        }
    } else {
        /*
          狀態異常，導向首頁並說明狀況
        */
        navigateToHomeWithErrorMessage(terms.paginationOfTaxonomiesAreMalfunctioning(terms.Taxonomy.category));
    }
}

function loadFoundTagsFromCache(record:CacheRecordOfResultOfSearch, page:number):void {
    resultOfSearch.tags = {
        numberOfResults:record.tags.foundTags,
        pageContent:record.tags.pageContent[page],
        pagination:{
            endSize:record.tags.pagination.endSize,
            midSize:record.tags.pagination.midSize,
            totalPages:record.tags.pagination.totalPages,
            currentPage:page,
            itemsPerPage:record.tags.pagination.itemsPerPage,
        }
    }

    record.tags.pagination.lastVisitedPage = page;
}

function fetchTagsAndHandleResult(config:ConfigurationOfTagFetching):Promise<ResultOfFetching<Tag>> {
    if (!isNum(config.page)) {
        config.page = 1;
    }
    if (!isNum(config.per_page)) {
        config.per_page = DEFAULT_TAXONOMIES_PER_PAGE;
    }
    return fetchTags(config)
            .then(result => {
                const record = getRecord(TypesOfCachedItem.Search, resultOfSearch.query);
            
                const numberOfTagsFound = result.response.headers['x-wp-total'];
                const totalPages = result.response.headers['x-wp-totalpages'];
                resultOfSearch.tags = {
                    numberOfResults:numberOfTagsFound,
                    pageContent:result.modelObjs,
                    pagination:{
                        endSize:record.tags.pagination.endSize,
                        midSize:record.tags.pagination.midSize,
                        totalPages:totalPages,
                        currentPage:config.page,
                        itemsPerPage:config.per_page
                    }
                }
            
                /*
                    接下來要根據查詢到的結果總數判斷快取是否過期並執行對應的管理作業。
                */
                if (numberOfTagsFound === record.tags.foundTags) {
                    //伺服器上的記錄狀態沒變，斷定快取沒過期
                    if (result.isComplete) {
                        record.tags.pageContent[config.page] = result.modelObjs;
                        record.tags.pagination.lastVisitedPage = config.page;
                    }
                    /*
                      註：若此處發現資料不完整的話，那就不加入本地快取，等下次請求時再拿拿看了。
                    */
                } else {
                    //伺服器上的記錄狀態有變，斷定快取過期，這表示要更新本地快取紀錄
                    record.tags.foundTags = numberOfTagsFound;
                    record.tags.pageContent = {}
                    //根據分頁是否完整，決定要不要加入快取。
                    if (result.isComplete) {
                        record.tags.pageContent[config.page] = result.modelObjs;
                    }
                    record.tags.pagination = {
                        endSize:record.tags.pagination.endSize,
                        midSize:record.tags.pagination.midSize,
                        totalPages:totalPages,
                        itemsPerPage:config.per_page,
                        lastVisitedPage:config.page
                    }
                }
                return result;
            });
}

const onPageOfFoundTagsChanged:PageClickedHandler = (page:number):void => {
    if (resultOfSearch && resultOfSearch.tags.pagination) {
        const record = getRecord(TypesOfCachedItem.Search, resultOfSearch.query);
        if (record.tags.pageContent[page]) {
            //快取中有紀錄，從裡面拿資料
            loadFoundTagsFromCache(record, page);
        } else {
            fetchTagsAndHandleResult({
                page:page,
                per_page:resultOfSearch.tags.pagination.itemsPerPage,
                search:resultOfSearch.query
            })
            .catch(() => {
                /* 將此頁內容標記為有缺漏，讓畫面元件呈現合適的內容給使用者
                 */
                resultOfSearch.tags.pageContent = null;
            })
            .finally(() => {
                renderResultOfSearch();
            });
        }
    } else {
        /*
          狀態異常，導向首頁並說明狀況
        */
        navigateToHomeWithErrorMessage(terms.paginationOfTaxonomiesAreMalfunctioning(terms.Taxonomy.tag));
    }
}

export const renderResultOfSearch = () => {
    resultOfSearch.publications.pageContent.forEach(pub => {
        addTypeOfPostOrPage(pub.slug, pub.type);
    });
    ReactDOM.render(
        <React.Fragment>
            <PageTitle name={terms.createTitleOfPageOfSearchResults(resultOfSearch.query)} />
            <GenericSearchResults result={resultOfSearch}
                onPageOfFoundCategoriesChanged={onPageOfFoundCategoriesChanged} 
                onPageOfFoundTagsChanged={onPageOfFoundTagsChanged} />
        </React.Fragment>,
        reactRoot,
        () => { router.updatePageLinks(); }
    );
}

function filterOutTheUncategorizedCategory(publications:FoundPublication[]) {
    if (Array.isArray(publications)) {
        publications.forEach(publication => {
            if (publication.type == TypeOfContent.Post && Array.isArray(publication.categories)) {
                publication.categories = publication.categories.filter( category => category.name !== 'Uncategorized' );
            } else {
                return publication;
            }
        });
    }
    return publications
}

export const routeEventHandlers = {
    before:(done, params) => {

        let page = 1;
        if (isNum(params['page'])) {
            page = parseInt(params['page']);
        }
        if (window.wp.search) {
            const search = window.wp.search;
            const pg = getPagination();

            resultOfSearch = {
                query:search.query,
                publications:{
                    numberOfResults:search.publications.totalItems,
                    pageContent:filterOutTheUncategorizedCategory(search.publications.itemsInCurrentPage),
                    pagination:pg
                },
                categories:{
                    numberOfResults:search.categories.totalItems,
                    pageContent:search.categories.itemsInCurrentPage,
                    pagination:{
                        endSize:pg.endSize,
                        midSize:pg.midSize,
                        totalPages:search.categories.totalPages,
                        currentPage:search.categories.currentPage,
                        itemsPerPage:search.categories.itemsPerPage
                    }
                },
                tags:{
                    numberOfResults:search.tags.totalItems,
                    pageContent:search.tags.itemsInCurrentPage,
                    pagination:{
                        endSize:pg.endSize,
                        midSize:pg.midSize,
                        totalPages:search.tags.totalPages,
                        currentPage:search.tags.currentPage,
                        itemsPerPage:search.tags.itemsPerPage
                    }
                }
            };

            //再來要備分各類資訊的預設批次查詢的資料筆數
            DEFAULT_PUBLICATIONS_PER_PAGE = pg.itemsPerPage;
            DEFAULT_TAXONOMIES_PER_PAGE = search.categories.itemsPerPage;

            //接下來要把剛才拿到的資料放入暫存。
            const record:CacheRecordOfResultOfSearch = {
                query:search.query,
                publications:{
                    foundPublications:search.publications.totalItems,
                    pageContent:{
                        [page]:search.publications.itemsInCurrentPage
                    },
                    pagination:{
                        baseUrl:pg.baseUrl,
                        endSize:pg.endSize,
                        midSize:pg.midSize,
                        totalPages:pg.totalPages,
                        itemsPerPage:pg.itemsPerPage,
                        lastVisitedPage:page
                    }
                },
                categories:{
                    foundCategories:search.categories.totalItems,
                    pageContent:{
                        [search.categories.currentPage]:search.categories.itemsInCurrentPage
                    },
                    pagination:{
                        endSize:pg.endSize,
                        midSize:pg.midSize,
                        totalPages:search.categories.totalPages,
                        itemsPerPage:search.categories.itemsPerPage,
                        lastVisitedPage:search.categories.currentPage
                    }
                },
                tags:{
                    foundTags:search.tags.totalItems,
                    pageContent:{
                        [search.tags.currentPage]:search.tags.itemsInCurrentPage
                    },
                    pagination:{
                        endSize:pg.endSize,
                        midSize:pg.midSize,
                        totalPages:search.tags.totalPages,
                        itemsPerPage:search.tags.itemsPerPage,
                        lastVisitedPage:search.tags.currentPage
                    }
                }
            }
            addRecord(TypesOfCachedItem.Search, search.query, record);

            delete window.wp.search;
            delete window.wp.pagination;
            done();
        } else {
            let keyword = params['keyword'];
            const record = getRecord(TypesOfCachedItem.Search, keyword);
            if (record) {
                const tasksAwaitedToBeExecute = [];
                resultOfSearch = {
                    query:keyword,
                    publications:null,
                    categories:null,
                    tags:null
                };

                let pageOfFoundPublicationsToAccess = page;
                if (page > record.publications.pagination.totalPages) {
                    pageOfFoundPublicationsToAccess = 1;
                }
                if (record.publications.pageContent[pageOfFoundPublicationsToAccess]) {
                    //從快取中還原目前頁面上的資訊。
                    resultOfSearch['publications'] = {
                        numberOfResults:record.publications.foundPublications,
                        pageContent:record.publications.pageContent[page],
                        pagination:{
                            baseUrl:record.publications.pagination.baseUrl,
                            endSize:record.publications.pagination.endSize,
                            midSize:record.publications.pagination.midSize,
                            totalPages:record.publications.pagination.totalPages,
                            currentPage:pageOfFoundPublicationsToAccess,
                            itemsPerPage:record.publications.pagination.itemsPerPage
                        }
                    }

                    record.publications.pagination.lastVisitedPage = pageOfFoundPublicationsToAccess;
                } else {
                    //沒有找到欲檢視發文頁面的暫存紀錄，因此要向伺服器拿
                    const baseUrl = record.publications.pagination.baseUrl;
                    const publicationsPerPage = record.publications.pagination.itemsPerPage || DEFAULT_PUBLICATIONS_PER_PAGE;
                    const config:ConfigurationOfPublicationFetching = {
                        search:keyword,
                        per_page:publicationsPerPage,
                        page:pageOfFoundPublicationsToAccess
                    }
                    tasksAwaitedToBeExecute.push(
                        searchPublications(config)
                            .then(result => {
                                
                                const numberOfPublicationsFound = result.response.headers['x-wp-total'];
                                const totalPages = result.response.headers['x-wp-totalpages'];
                                resultOfSearch.publications = {
                                    numberOfResults:numberOfPublicationsFound,
                                    pageContent:filterOutTheUncategorizedCategory(result.modelObjs),
                                    pagination:{
                                        baseUrl:record.publications.pagination.baseUrl,
                                        endSize:record.publications.pagination.endSize,
                                        midSize:record.publications.pagination.midSize,
                                        totalPages:totalPages,
                                        currentPage:pageOfFoundPublicationsToAccess,
                                        itemsPerPage:publicationsPerPage
                                    }
                                }

                                /*
                                    接下來要根據查詢到的結果總數判斷快取是否過期並執行對應的管理作業。
                                */
                                if (numberOfPublicationsFound == record.publications.foundPublications) {
                                    //快取沒過期
                                    if (result.isComplete) {
                                        record.publications.pageContent[pageOfFoundPublicationsToAccess] = result.modelObjs;
                                        record.publications.pagination.lastVisitedPage = pageOfFoundPublicationsToAccess;
                                    }
                                } else {
                                    //快取過期
                                    //伺服器上的記錄狀態有變，這表示要更新本地快取紀錄
                                    record.publications.foundPublications = numberOfPublicationsFound;
                                    record.publications.pageContent = {};
                                    if (result.isComplete) {
                                        record.publications.pageContent[pageOfFoundPublicationsToAccess] = result.modelObjs;
                                    }
                                    record.publications.pagination = {
                                        baseUrl:baseUrl,
                                        endSize:record.publications.pagination.endSize,
                                        midSize:record.publications.pagination.midSize,
                                        totalPages:totalPages,
                                        itemsPerPage:publicationsPerPage,
                                        lastVisitedPage:pageOfFoundPublicationsToAccess
                                    }
                                }
                            })
                    );
                }

                let pageOfFoundCategoriesToAccess = record.categories.pagination.lastVisitedPage || page;
                if (pageOfFoundCategoriesToAccess > record.categories.pagination.totalPages) {
                    pageOfFoundCategoriesToAccess = 1;
                }
                if (record.categories.pageContent[pageOfFoundCategoriesToAccess]) {
                    loadFoundCategoriesFromCache(record, pageOfFoundCategoriesToAccess);
                } else {
                    //沒有找到欲檢視頁面的暫存紀錄，因此要向伺服器拿
                    const config:ConfigurationOfCategoryFetching = {
                        search:keyword,
                        per_page:record.categories.pagination.itemsPerPage,
                        page:pageOfFoundCategoriesToAccess,
                        includeParent:false
                    }

                    tasksAwaitedToBeExecute.push(
                        fetchCategoriesAndHandleResult(config)
                            .catch(() => {
                                /* 將此頁內容標記為有缺漏，讓畫面元件呈現合適的內容給使用者
                                 */
                                resultOfSearch.categories.pageContent = null;
                                return;
                            })
                    );
                }

                let pageOfFoundTagsToAccess = record.tags.pagination.lastVisitedPage || page;
                if (pageOfFoundTagsToAccess > record.tags.pagination.totalPages) {
                    pageOfFoundTagsToAccess = 1;
                }
                if (record.tags.pageContent[pageOfFoundTagsToAccess]) {
                    loadFoundTagsFromCache(record, pageOfFoundTagsToAccess);
                } else {
                    //沒有找到欲檢視頁面的暫存紀錄，因此要向伺服器拿
                    const config:ConfigurationOfTagFetching = {
                        search:keyword,
                        per_page:record.tags.pagination.itemsPerPage,
                        page:pageOfFoundTagsToAccess
                    }

                    tasksAwaitedToBeExecute.push(
                        fetchTagsAndHandleResult(config)
                            .catch(() => {
                                /* 將此頁內容標記為有缺漏，讓畫面元件呈現合適的內容給使用者
                                 */
                                resultOfSearch.tags.pageContent = null;
                            })
                    );
                }

                Promise.all(tasksAwaitedToBeExecute)
                       .then(() => {
                           done();
                       });
            } else {
                /*
                    查無此頁的快取紀錄，所有東西都要向伺服器拿。
                */
               let publicationsPerPage = DEFAULT_PUBLICATIONS_PER_PAGE;
               let taxonomiesPerPage = DEFAULT_TAXONOMIES_PER_PAGE;
            
               search({ 
                   keyword:keyword,
                   pageOfPublications:page,
                   pageOfTaxonomies:1,
                   publicationsPerPage:publicationsPerPage,
                   taxonomiesPerPage:taxonomiesPerPage
                 })
                 .then(data => {
                     const baseUrl = getBaseUrl();
                     resultOfSearch = {
                        query:keyword,
                        publications:{
                            numberOfResults:data.publications.response.headers['x-wp-total'],
                            pageContent:data.publications.modelObjs,
                            pagination:{
                                baseUrl:baseUrl,
                                endSize:defaultEndSize,
                                midSize:defaultMidSize,
                                totalPages:data.publications.response.headers['x-wp-totalpages'],
                                currentPage:page,
                                itemsPerPage:publicationsPerPage
                            }
                        },
                        categories:{
                            numberOfResults:data.categories.response.headers['x-wp-total'],
                            pageContent:data.categories.modelObjs,
                            pagination:{
                                endSize:defaultEndSize,
                                midSize:defaultMidSize,
                                totalPages:data.categories.response.headers['x-wp-totalpages'],
                                currentPage:1,
                                itemsPerPage:taxonomiesPerPage
                            }
                        },
                        tags:{
                            numberOfResults:data.tags.response.headers['x-wp-total'],
                            pageContent:data.tags.modelObjs,
                            pagination:{
                                endSize:defaultEndSize,
                                midSize:defaultMidSize,
                                totalPages:data.tags.response.headers['x-wp-totalpages'],
                                currentPage:1,
                                itemsPerPage:taxonomiesPerPage
                            }
                        }
                    };

                     const record:CacheRecordOfResultOfSearch = {
                         query:keyword,
                         publications:{
                             foundPublications:data.publications.response.headers['x-wp-total'],
                             pageContent:{
                                 [page]:data.publications.modelObjs,
                             },
                             pagination:{
                                 baseUrl:baseUrl,
                                 endSize:defaultEndSize,
                                 midSize:defaultMidSize,
                                 totalPages:data.publications.response.headers['x-wp-totalpages'],
                                 itemsPerPage:publicationsPerPage,
                                 lastVisitedPage:page
                             }
                         },
                         categories:{
                             foundCategories:data.categories.response.headers['x-wp-total'],
                             pageContent:{
                                 [1]:data.categories.modelObjs
                             },
                             pagination:{
                                 endSize:defaultEndSize,
                                 midSize:defaultMidSize,
                                 totalPages:data.categories.response.headers['x-wp-totalpages'],
                                 itemsPerPage:taxonomiesPerPage,
                                 lastVisitedPage:1
                             }
                         },
                         tags:{
                             foundTags:data.tags.response.headers['x-wp-total'],
                             pageContent:{
                                 [1]:data.tags.modelObjs
                             },
                             pagination:{
                                 endSize:defaultEndSize,
                                 midSize:defaultMidSize,
                                 totalPages:data.tags.response.headers['x-wp-totalpages'],
                                 itemsPerPage:taxonomiesPerPage,
                                 lastVisitedPage:1
                             }
                         }
                     }
                     addRecord(TypesOfCachedItem.Search, keyword, record);

                     done();
                 });
            }
        }
    },
    leave:() => {
        resultOfSearch = null;
    }
}