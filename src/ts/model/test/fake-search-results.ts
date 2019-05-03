import {SummaryOfResultsOfSearch} from '../search-results';
import {listOfMetaDataOfFakePosts, plentyOfFakeCategories, plentyOfFakeTags} from './fake-meta-of-posts-for-test';

export const fakeSearchResults:SummaryOfResultsOfSearch = {
    query:'諸葛亮舌戰群儒',
    posts:{
        currentPageNumber:2,
        pageContent:listOfMetaDataOfFakePosts.slice(3, 6),
        numberOfPages:3,
        numberOfResults:listOfMetaDataOfFakePosts.length
    },
    categories:{
        currentPageNumber:1,
        pageContent:plentyOfFakeCategories.slice(0, 22),
        numberOfPages:2,
        numberOfResults:plentyOfFakeCategories.length
    },
    tags:{
        currentPageNumber:2,
        pageContent:plentyOfFakeTags.slice(22, plentyOfFakeTags.length),
        numberOfPages:2,
        numberOfResults:plentyOfFakeTags.length
    }    
}

export const fakeNothingFoundSearchResults:SummaryOfResultsOfSearch = {
    query:'查無任何資料',
    posts:{
        currentPageNumber:0,
        pageContent:[],
        numberOfPages:0,
        numberOfResults:0
    },
    categories:{
        currentPageNumber:0,
        pageContent:[],
        numberOfPages:0,
        numberOfResults:0
    },
    tags:{
        currentPageNumber:0,
        pageContent:[],
        numberOfPages:0,
        numberOfResults:0
    }
}