import {MetaOfPost, CategoryOfPost, TagOfPost} from './post';

export interface ResultsOfSearch<T> {
    currentPageNumber:number;
    numberOfPages:number;
    numberOfResults:number;
    pageContent:T[];
}

export interface AnswerOfQueryPostsByTaxonomy<T extends CategoryOfPost | TagOfPost> {
    taxonomy:T;
    results:ResultsOfSearch<MetaOfPost>;
}

export interface SummaryOfResultsOfSearch {
    query:string;
    posts:ResultsOfSearch<MetaOfPost>;
    categories:ResultsOfSearch<CategoryOfPost>;
    tags:ResultsOfSearch<TagOfPost>;
}
