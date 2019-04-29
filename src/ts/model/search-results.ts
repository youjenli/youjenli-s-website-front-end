import {MetaOfPost, CategoryOfPost, TagOfPost} from './post';

export interface ResultsOfSearch<T> {
    currentPageNumber:number;
    totalNumberOfPages:number;
    totalNumberOfResults:number;
    pageContent:T[];
}

export interface DataOfSearchResults {
    inquire:string;
    posts:ResultsOfSearch<MetaOfPost>;
    categories:ResultsOfSearch<CategoryOfPost>;
    tags:ResultsOfSearch<TagOfPost>;
}
