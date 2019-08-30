import {Category, Tag} from './terms';
import {Pagination} from './pagination';
import {TypeOfContent} from './general-types';
import {Post, Page} from './posts';

export type FoundPublication = FoundPost | FoundPage;

export interface ResultOfQuery<T extends FoundPost | FoundPage | Category | Tag | FoundPublication> {
    numberOfResults:number;
    pageContent:T[];
    pagination:Pagination;
}

export interface ResultOfSearch {
    query:string;
    publications:ResultOfQuery<FoundPublication>;
    categories:ResultOfQuery<Category>;
    tags:ResultOfQuery<Tag>;
}

export interface CacheRecordOfResultOfSearch {
    query:string;
    publications:{
        foundPublications:number;
        pageContent:{
            [page:number]:FoundPublication[]
        },
        pagination:{
            baseUrl?:string;
            endSize:number;
            midSize:number;
            totalPages:number;
            itemsPerPage?:number;
            lastVisitedPage:number;
        }
    },
    categories:{
        foundCategories:number;
        pageContent:{
            [page:number]:Category[]
        },
        pagination:{
            endSize:number;
            midSize:number;
            totalPages:number;
            itemsPerPage?:number;
            lastVisitedPage:number;
        }
    },
    tags:{
        foundTags:number;
        pageContent:{
            [page:number]:Tag[]
        },
        pagination:{
            endSize:number;
            midSize:number;
            totalPages:number;
            itemsPerPage?:number;
            lastVisitedPage:number;
        }
    }
}

export interface FoundPost extends Post {
    type:TypeOfContent.Post
}

export interface FoundPage extends Page {
    type:TypeOfContent.Page
}