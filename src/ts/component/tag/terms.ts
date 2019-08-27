export function titleOfPageOfTag(name:string):string {
    return `以「${name}」標籤標記的文章`;
}

export function descriptionOfTag(name:string, desc:string):string {
    return `${name}：${desc}`;
}

export const tagDoesNotHaveDescription = '此標籤沒有相關說明。';

export function countOfArticlesMarkedByThisTag(name:string, count:number):string {
    return `共有 ${count} 篇以「${name}」標記的文章。`;
};

export let noPostMarkedByThisTag = '沒有以此標籤標記的文章。'

export function cannotFindATagCorrespondingRelatedToGivenPath(path:string) {
    return `無法查詢到對應路徑「${path}」的標籤。系統重新導向至首頁。`;
}

export function didNotSuccessfullyGetTheTagCorrespondingToGivenPath(url:string) {
    return `未順利取得對應路徑「${url}」的標籤資訊，請稍後再重新嘗試。`;
}