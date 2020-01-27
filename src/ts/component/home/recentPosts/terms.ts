import { isNum } from "../../../service/validator";

export let titleFieldIsBlank = '（無標題）';
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
    /*
      註：產生閱讀時間的說明時，發生一個奇怪的問題，那就是不管伺服器端有沒有用 intval 處理 estimatedReadingTimes 的值，
      也不管是否先以 json_encode 處理 estimatedReadingTimes 再輸出到網頁上，
      瀏覽器這端程式執行時都會拿到型態為字串的 estimatedReadingTimes，
      因此這邊乾脆直接產生介面上的閱讀時間而不像先前一樣先辨識文章 estimatedReadingTimes 屬性的型態再決定是否產生閱讀時間說明。
    */
    return `估計需要 ${mins} 分鐘閱讀`;
};
export function learnMoreAboutThisArticle(nameOfArticle:string) {
    return `閱讀 ${nameOfArticle} 的內容`;
}