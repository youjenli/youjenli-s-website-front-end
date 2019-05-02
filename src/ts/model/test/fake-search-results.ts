import {DataOfSearchResults} from '../search-results';
import {listOfMetaDataOfFakePosts, plentyOfFakeCategories, plentyOfFakeTags} from './fake-meta-of-posts-for-test';

export const fakeSearchResults:DataOfSearchResults = {
    inquire:'諸葛亮舌戰群儒',
    posts:{
        currentPageNumber:1,
        pageContent:listOfMetaDataOfFakePosts.slice(0, 3),
        totalNumberOfPages:3,
        totalNumberOfResults:listOfMetaDataOfFakePosts.length
    },
    categories:{
        currentPageNumber:1,
        pageContent:plentyOfFakeCategories.slice(0, 22),
        totalNumberOfPages:2,
        totalNumberOfResults:plentyOfFakeCategories.length
    },
    tags:{
        currentPageNumber:1,
        pageContent:plentyOfFakeTags.slice(0, 22),
        totalNumberOfPages:2,
        totalNumberOfResults:plentyOfFakeTags.length
    }    
}

export const fakeNothingFoundSearchResults = {
    inquire:'查無任何資料',
    posts:{
        currentPageNumber:0,
        pageContent:[],
        totalNumberOfPages:0,
        totalNumberOfResults:0
    },
    categories:{
        currentPageNumber:0,
        pageContent:[],
        totalNumberOfPages:0,
        totalNumberOfResults:0
    },
    tags:{
        currentPageNumber:0,
        pageContent:[],
        totalNumberOfPages:0,
        totalNumberOfResults:0
    }
}