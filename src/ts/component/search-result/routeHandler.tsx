import { router } from '../../service/router';
import { queryParametersOfHome } from '../home/routeHandler';
import { getPagination } from '../../model/pagination';
import { reactRoot } from '../../index';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GenericSearchResults from './generic';
import { search, searchCategory, searchTag, searchPublications } from '../../service/search';
import { ResultOfSearch, CacheRecordOfResultOfSearch } from '../../model/search-results';
import * as terms from './terms';
import { TypesOfCachedItem, addRecord, getRecord } from '../../service/cache-of-pagination';
import { ConfigurationOfPublicationFetching } from '../../service/search';
import { ConfigurationOfFetching as ConfigurationOfCategoryFetching } from '../../service/category-fetcher';
import { ConfigurationOfFetching as ConfigurationOfTagFetching } from '../../service/tag-fetcher';

let DEFAULT_PUBLICATIONS_PER_PAGE = 10;
let DEFAULT_TAXONOMIES_PER_PAGE = 14;
let resultOfSearch:ResultOfSearch = null;

export type PageClickedHandler = (page:number) => void;

const onPageOfFoundCategoriesChanged:PageClickedHandler = (page:number):void => {
    if (resultOfSearch && resultOfSearch.categories.pagination) {
        const record = getRecord(TypesOfCachedItem.Search, resultOfSearch.query);
        if (record.categories.pageContent[page]) {
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
        } else {
            const perPage = !isNaN(resultOfSearch.categories.pagination.itemsPerPage) ? 
                resultOfSearch.categories.pagination.itemsPerPage : DEFAULT_TAXONOMIES_PER_PAGE;
            searchCategory({
                page:page,
                includeParent:false,
                per_page:perPage,
                search:resultOfSearch.query
            }, null)
            .then(result => {
                const record = getRecord(TypesOfCachedItem.Search, resultOfSearch.query);

                resultOfSearch.categories = result;
                //拿快取中可重複利用的資訊填充給接下來要塗層的頁面使用
                resultOfSearch.categories.pagination.endSize = record.publications.pagination.endSize;
                resultOfSearch.categories.pagination.midSize = record.publications.pagination.midSize;
                resultOfSearch.categories.pagination.itemsPerPage = perPage;
                /*
                    接下來要根據查詢到的結果總數判斷快取是否過期並執行對應的管理作業。
                */
                if (result.numberOfResults === record.categories.foundCategories) {
                    //快取沒過期
                    record.categories.pageContent[page] = result.pageContent;
                    record.categories.pagination.lastVisitedPage = result.pagination.currentPage;
                } else {
                    //快取過期
                    record.publications = {
                        foundPublications:result.numberOfResults,
                        pageContent:{
                            [page]:result.pageContent
                        },
                        pagination:{
                            endSize:record.categories.pagination.endSize,
                            midSize:record.categories.pagination.midSize,
                            totalPages:result.pagination.totalPages,
                            itemsPerPage:perPage,
                            lastVisitedPage:result.pagination.currentPage
                        }
                    };
                }
            })
            .catch(() => {
                /* 將此頁內容標記為有缺漏，讓畫面元件呈現合適的內容給使用者
                 */
                resultOfSearch.categories.pageContent = null;
            });
        }
        renderResultOfSearch();
    } else {
        /*
          狀態異常，導向首頁並說明狀況
        */
        const route = 
            `home?${queryParametersOfHome.ERROR_MSG}=${terms.paginationOfTaxonomiesAreMalfunctioning(terms.Taxonomy.category)}`;
        router.navigate(route);
    }
}

const onPageOfFoundTagsChanged:PageClickedHandler = (page:number):void => {
    if (resultOfSearch && resultOfSearch.tags.pagination) {
        const record = getRecord(TypesOfCachedItem.Search, resultOfSearch.query);
        if (record.tags.pageContent[page]) {
            //快取中有紀錄，從裡面拿資料
            resultOfSearch.tags = {
                numberOfResults:record.tags.foundCategories,
                pageContent:record.tags.pageContent[page],
                pagination:{
                    endSize:record.tags.pagination.endSize,
                    midSize:record.tags.pagination.midSize,
                    totalPages:record.tags.pagination.totalPages,
                    currentPage:page,
                    itemsPerPage:record.tags.pagination.itemsPerPage
                }
            }
        } else {
            const perPage = !isNaN(resultOfSearch.tags.pagination.itemsPerPage) ? 
                resultOfSearch.tags.pagination.itemsPerPage : DEFAULT_TAXONOMIES_PER_PAGE;
            searchTag({
                page:page,
                per_page:perPage,
                search:resultOfSearch.query
            }, null)
            .then(result => {
                const record = getRecord(TypesOfCachedItem.Search, resultOfSearch.query);

                resultOfSearch.tags = result;
                //拿快取中的資訊填充給接下來要塗層的頁面使用
                resultOfSearch.tags.pagination.endSize = record.tags.pagination.endSize;
                resultOfSearch.tags.pagination.midSize = record.tags.pagination.midSize;
                resultOfSearch.tags.pagination.itemsPerPage = perPage;
                /*
                    接下來要根據查詢到的結果總數判斷快取是否過期並執行對應的管理作業。
                */
                if (result.numberOfResults === record.publications.foundPublications) {
                    //快取沒過期
                    record.publications.pageContent[page] = result.pageContent;
                    record.publications.lastVisitedPage = resultOfSearch.tags.pagination.currentPage;
                } else {
                    //快取過期
                    record.publications = {
                        foundTags:result.numberOfResults,
                        pageContent:{
                            [page]:result.pageContent
                        },
                        pagination:{
                            endSize:record.tags.pagination.endSize,
                            midSize:record.tags.pagination.midSize,
                            totalPages:result.pagination.totalPages,
                            itemsPerPage:perPage,
                            lastVisitedPage:resultOfSearch.tags.pagination.currentPage
                        }
                    };
                }
            })
            .catch(() => {
                /* 將此頁內容標記為有缺漏，讓畫面元件呈現合適的內容給使用者
                 */
                resultOfSearch.tags.pageContent = null;
            });
        }
        renderResultOfSearch();
    } else {
        /*
          狀態異常，導向首頁並說明狀況
        */
        const route = 
              `home?${queryParametersOfHome.ERROR_MSG}=${terms.paginationOfTaxonomiesAreMalfunctioning(terms.Taxonomy.tag)}`;
        router.navigate(route);
    }
}

export const renderResultOfSearch = () => {
    ReactDOM.render(
        <GenericSearchResults result={resultOfSearch}
            onPageOfFoundCategoriesChanged={onPageOfFoundCategoriesChanged} 
            onPageOfFoundTagsChanged={onPageOfFoundTagsChanged} />,
        reactRoot,
        () => { router.updatePageLinks(); }
    );
}

export const routeEventHandlers = {
    before:(done, params) => {

        let page = 1;
        if (!isNaN(params['page'])) {
            page = params['page'];
        }
        if (window.wp.search) {
            const search = window.wp.search;
            const pg = getPagination();
            
            resultOfSearch = {
                query:search.query,
                publications:{
                    numberOfResults:search.publications.totalItems,
                    pageContent:search.publications.itemsInCurrentPage,
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
                        searchPublications(config, baseUrl)
                            .then(result => {
                                resultOfSearch.publications = result;
                                //拿快取中可重複利用的資訊填充給接下來要塗層的頁面使用
                                resultOfSearch.publications.pagination.endSize = record.publications.pagination.endSize;
                                resultOfSearch.publications.pagination.midSize = record.publications.pagination.midSize;
                                resultOfSearch.publications.pagination.itemsPerPage = publicationsPerPage;

                                /*
                                    接下來要根據查詢到的結果總數判斷快取是否過期並執行對應的管理作業。
                                */
                                if (result.numberOfResults === record.publications.foundPublications) {
                                    //快取沒過期
                                    record.publications.pageContent[page] = result.pageContent;
                                    record.publications.pagination.lastVisitedPage = pageOfFoundPublicationsToAccess;
                                } else {
                                    //快取過期
                                    record.publications = {
                                        foundPublications:result.numberOfResults,
                                        pageContent:{
                                            [page]:result.pageContent
                                        },
                                        pagination:{
                                            baseUrl:baseUrl,
                                            endSize:record.publications.pagination.endSize,
                                            midSize:record.publications.pagination.midSize,
                                            totalPages:result.pagination.totalPages,
                                            itemsPerPage:publicationsPerPage,
                                            lastVisitedPage:pageOfFoundPublicationsToAccess
                                        }
                                    };
                                }
                            })
                    );
                }

                let pageOfFoundCategoriesToAccess = record.categories.pagination.lastVisitedPage || page;
                if (pageOfFoundCategoriesToAccess > record.categories.pagination.totalPages) {
                    pageOfFoundCategoriesToAccess = 1;
                }
                if (record.categories.pageContent[pageOfFoundCategoriesToAccess]) {
                    resultOfSearch['categories'] = {
                        numberOfResults:record.categories.foundCategories,
                        pageContent:record.categories.pageContent[pageOfFoundCategoriesToAccess],
                        pagination:{
                            endSize:record.categories.pagination.endSize,
                            midSize:record.categories.pagination.midSize,
                            totalPages:record.categories.pagination.totalPages,
                            currentPage:pageOfFoundCategoriesToAccess,
                            itemsPerPage:record.categories.pagination.itemsPerPage
                        }
                    }

                    record.categories.pagination.lastVisitedPage = pageOfFoundCategoriesToAccess;
                } else {
                    //沒有找到欲檢視頁面的暫存紀錄，因此要向伺服器拿
                    const categoriesPerPage = record.publications.pagination.itemsPerPage || DEFAULT_TAXONOMIES_PER_PAGE;
                    const config:ConfigurationOfCategoryFetching = {
                        search:keyword,
                        per_page:categoriesPerPage,
                        page:pageOfFoundCategoriesToAccess
                    }

                    tasksAwaitedToBeExecute.push(
                        searchCategory(config, null)
                            .then(result => {
                                resultOfSearch.categories = result;
                                //拿快取中可重複利用的資訊填充給接下來要塗層的頁面使用
                                resultOfSearch.categories.pagination.endSize = record.publications.pagination.endSize;
                                resultOfSearch.categories.pagination.midSize = record.publications.pagination.midSize;
                                resultOfSearch.categories.pagination.itemsPerPage = categoriesPerPage;

                                /*
                                    接下來要根據查詢到的結果總數判斷快取是否過期並執行對應的管理作業。
                                */
                                if (result.numberOfResults === record.categories.foundCategories) {
                                    //快取沒過期
                                    record.categories.pageContent[page] = result.pageContent;
                                    record.categories.pagination.lastVisitedPage = resultOfSearch.categories.pagination.currentPage;
                                } else {
                                    //快取過期
                                    record.publications = {
                                        foundPublications:result.numberOfResults,
                                        pageContent:{
                                            [page]:result.pageContent
                                        },
                                        pagination:{
                                            endSize:record.categories.pagination.endSize,
                                            midSize:record.categories.pagination.midSize,
                                            totalPages:result.pagination.totalPages,
                                            itemsPerPage:categoriesPerPage,
                                            lastVisitedPage:resultOfSearch.categories.pagination.currentPage
                                        }
                                    };
                                }
                            })
                    );
                }

                let pageOfFoundTagsToAccess = record.tags.pagination.lastVisitedPage || page;
                if (pageOfFoundTagsToAccess > record.tags.pagination.totalPages) {
                    pageOfFoundTagsToAccess = 1;
                }
                if (record.tags.pageContent[pageOfFoundTagsToAccess]) {
                    resultOfSearch['tags'] = {
                        numberOfResults:record.tags.foundTags,
                        pageContent:record.tags.pageContent[pageOfFoundTagsToAccess],
                        pagination:{
                            endSize:record.tags.pagination.endSize,
                            midSize:record.tags.pagination.midSize,
                            totalPages:record.tags.pagination.totalPages,
                            currentPage:pageOfFoundTagsToAccess,
                            itemsPerPage:record.tags.pagination.itemsPerPage,
                        }
                    }

                    record.tags.pagination.lastVisitedPage = pageOfFoundTagsToAccess;
                } else {
                    //沒有找到欲檢視頁面的暫存紀錄，因此要向伺服器拿
                    const tagsPerPage = record.tags.pagination.itemsPerPage || DEFAULT_TAXONOMIES_PER_PAGE;
                    const config:ConfigurationOfTagFetching = {
                        search:keyword,
                        per_page:tagsPerPage,
                        page:pageOfFoundTagsToAccess
                    }

                    tasksAwaitedToBeExecute.push(
                        searchTag(config, null)
                            .then(result => {
                                resultOfSearch.tags = result;

                                //拿快取中可重複利用的資訊填充給接下來要塗層的頁面使用
                                resultOfSearch.tags.pagination.endSize = record.tags.pagination.endSize;
                                resultOfSearch.tags.pagination.midSize = record.tags.pagination.midSize;
                                resultOfSearch.tags.pagination.itemsPerPage = tagsPerPage;

                                /*
                                    接下來要根據查詢到的結果總數判斷快取是否過期並執行對應的管理作業。
                                */
                                if (result.numberOfResults === record.publications.foundPublications) {
                                    //快取沒過期
                                    record.publications.pageContent[page] = result.pageContent;
                                    record.publications.lastVisitedPage = resultOfSearch.tags.pagination.currentPage;
                                } else {
                                    //快取過期
                                    record.publications = {
                                        foundTags:result.numberOfResults,
                                        pageContent:{
                                            [page]:result.pageContent
                                        },
                                        pagination:{
                                            endSize:record.tags.pagination.endSize,
                                            midSize:record.tags.pagination.midSize,
                                            totalPages:result.pagination.totalPages,
                                            itemsPerPage:tagsPerPage,
                                            lastVisitedPage:resultOfSearch.tags.pagination.currentPage
                                        }
                                    };
                                }
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
                   page:page,
                   publicationsPerPage:publicationsPerPage,
                   taxonomiesPerPage:taxonomiesPerPage
                 })
                 .then(data => {
                     resultOfSearch = data;

                     const record:CacheRecordOfResultOfSearch = {
                         query:keyword,
                         publications:{
                             foundPublications:data.publications.numberOfResults,
                             pageContent:{
                                 [page]:data.publications.pageContent
                             },
                             pagination:{
                                 baseUrl:data.publications.pagination.baseUrl,
                                 endSize:data.publications.pagination.endSize,
                                 midSize:data.publications.pagination.midSize,
                                 totalPages:data.publications.pagination.totalPages,
                                 itemsPerPage:data.publications.pagination.itemsPerPage,
                                 lastVisitedPage:page
                             }
                         },
                         categories:{
                             foundCategories:data.categories.numberOfResults,
                             pageContent:{
                                 [data.categories.pagination.currentPage]:data.categories.pageContent
                             },
                             pagination:{
                                 endSize:data.categories.pagination.endSize,
                                 midSize:data.categories.pagination.midSize,
                                 totalPages:data.categories.pagination.totalPages,
                                 itemsPerPage:data.categories.pagination.itemsPerPage,
                                 lastVisitedPage:data.categories.pagination.currentPage
                             }
                         },
                         tags:{
                             foundTags:data.tags.numberOfResults,
                             pageContent:{
                                 [data.tags.pagination.currentPage]:data.tags.pageContent
                             },
                             pagination:{
                                 endSize:data.tags.pagination.endSize,
                                 midSize:data.tags.pagination.midSize,
                                 totalPages:data.tags.pagination.totalPages,
                                 itemsPerPage:data.tags.pagination.itemsPerPage,
                                 lastVisitedPage:data.tags.pagination.currentPage
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