import {Category, Tag} from './terms';
import {TypeOfContent} from './general-types';
import {Post, Page} from './posts';
import { Pagination } from '../model/pagination';

export interface FoundPost extends Post {
    type:TypeOfContent.Post
}

export interface FoundPage extends Page {
    type:TypeOfContent.Page
}

export type FoundPublication = FoundPost | FoundPage;

export interface ResultOfSearch {
    query:string;
    publications:{
        numberOfResults:number;
        pageContent:FoundPublication[];
        pagination:Pagination;
    }
    tags:{
        numberOfResults:number;
        pageContent:Tag[];
        pagination:Pagination;
    },
    categories:{
        numberOfResults:number;
        pageContent:Category[];
        pagination:Pagination;
    }
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