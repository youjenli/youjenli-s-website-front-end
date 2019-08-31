export function createTitleOfPageOfSearchResults(inquire:string):string {
    return `查詢「${inquire}」的結果`
};

export function createSummaryOfSearchResults(postsCount:number, categoriesCount:number, tagsCount:number):string {
    return `共找到 ${postsCount} 篇網誌、${categoriesCount} 項分類、${tagsCount} 個標籤。`
}

export let typesOfSearchResult = '此搜尋功能會查找本站三大類內容，分別是「網誌」、「分類」、「標籤」。';
export let introductionOfTypesOfSearchResult = `
「網誌」是我用來記錄自己在某個時間點的心得與感受。舉凡學習筆記、教學、經驗分享、體驗...都會以網誌的形式保存。
寫好網誌後，我會按照網誌的主題性質、撰文的動機「分類」文章，最後再用「標籤」提供補充額外資訊。
`;

export let categoryDoesNotHaveDesc = '此分類無說明文字。';
export let tagDoesNotHaveDesc = '此標籤無說明文字。'

export let headingOfSearchResultsOfPosts = '可能有關的網誌或專頁';
export function generatePostsNotFoundNotificationMsg(inquire:string):string {
    return `唉呀，沒有找到與「${inquire}」相關的網誌喔。`;
};
export let headingOfSearchResultsOfCategories = '可能有關的分類';
export function generateCategoriesNotFoundNotificationMsg(inquire:string):string {
    return `唉呀，沒有找到與「${inquire}」相關的分類喔。`;
}
export let headingOfSearchResultsOfTags = '可能有關的標籤';
export function generateTagsNotFoundNotificationMsg(inquire:string):string {
    return `唉呀，沒有找到與「${inquire}」相關的標籤喔。`;
}

export enum Taxonomy {
    tag = '標籤',
    category = '分類'
}

export function learnMoreAboutThisTaxonomy(taxo:Taxonomy, name:string):string {
    return `了解「${name}」${taxo}及其相關文章`;
}

export let previousPage = '前一頁';
export let nextPage = '下一頁';

export let pleaseTryAgainLaterByRefreshingThisPage = '請稍後再重新載入此頁看看。'

export function paginationOfTaxonomiesAreMalfunctioning(taxonomy:Taxonomy) {
    return `呈現${taxonomy}查詢結果的分頁功能故障，因此畫面跳至首頁。${pleaseTryAgainLaterByRefreshingThisPage}`;
}

export let didnotSuccessfullyObtainThisPartOfResult = `未順利取得這部分查詢結果，${pleaseTryAgainLaterByRefreshingThisPage}`;

