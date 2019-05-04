import {AnswerOfQueryPostsByTaxonomy} from '../search-results';
import {CategoryOfPost, MetaOfPost} from '../post';
import {ResultsOfSearch} from '../search-results';
import {listOfMetaDataOfFakePosts} from './fake-meta-of-posts-for-test';

export const fakeParentCategory:CategoryOfPost = {
    id:2,
    name:'母分類名稱',
    url:'https://www.google.com.tw',
    description:'母分類名稱的敘述'
}

export const fakeCategory:CategoryOfPost = {
    id:3,
    name:'測試用的分類名稱',
    url:'https://www.google.com.tw',
    description:'有關這項分類名稱的敘述',
    parent:fakeParentCategory
}

export const fakeCategoryWithoutDesc:CategoryOfPost = {
    id:4,
    name:'測試用的分類名稱',
    url:'https://www.google.com.tw'
}

export const fakeResultsOfsearch:ResultsOfSearch<MetaOfPost> = {
    currentPageNumber:2,
    pageContent:listOfMetaDataOfFakePosts.slice(3, 6),
    numberOfPages:3,
    numberOfResults:listOfMetaDataOfFakePosts.length
}

export const fakeResultsOfsearch_noPost:ResultsOfSearch<MetaOfPost> = {
    currentPageNumber:0,
    pageContent:[],
    numberOfPages:0,
    numberOfResults:0
}

export const fakeAnswerOfQueryPostsByTaxonomy:AnswerOfQueryPostsByTaxonomy<CategoryOfPost> = 
    {
        taxonomy:fakeCategory,
        results:fakeResultsOfsearch
    }

export const fakeAnswerOfQueryPostsByTaxonomyWithoutDesc:AnswerOfQueryPostsByTaxonomy<CategoryOfPost> = 
    {
        taxonomy:fakeCategoryWithoutDesc,
        results:fakeResultsOfsearch
    }

export const fakeAnswerOfQueryPostsByTaxonomyWithoutAnyPost:AnswerOfQueryPostsByTaxonomy<CategoryOfPost> = 
    {
        taxonomy:fakeCategory,
        results:fakeResultsOfsearch_noPost
    }