import { isNum } from "../../../service/validator";

export let postWasNotCategorized = '未分類';
export let postWasNotTagged = '未標記';
export let cannotFoundTaxonomies = '因故暫時查不到這部分資訊，請稍後再試或聯絡系統管理員。';
export let parentPageDoesNotExist = '此專頁沒有母分頁';
export let readArticle = '...閱讀文章';
export let published = '發佈於';
export let lastModified = '最後更新於';
export let infoSeparater = '．';
export let postDoesNotHaveExcerpt = '不好意思，這篇文章沒有摘抄哦～';
export let clauseSeparater = '，';
export let period = '。';
export function estimatedReadingTimes(mins:number):string {
    if (isNum(mins)) {
        return `估計需要 ${mins} 分鐘閱讀`;
    } else {
        return '';
    }
};
export function learnMoreAboutThisArticle(nameOfArticle:string) {
    return `閱讀 ${nameOfArticle} 的內容`;
}