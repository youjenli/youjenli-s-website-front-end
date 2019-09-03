export const postInWP = '文章';
export const thumbnailOfPost = '文章的意象圖';
export const pageInWP = '專頁';
export const tagOfTaxonomy = '標籤';
export const categoryOfTaxonomy = '分類';

export function theResponseStatusCodeIsNot200(postType:string):string {
    return `查詢${postType}的作業狀態碼不是 200。`;
}

export function didNotFoundTheDataWhichWasSupposedToAttachedInResponse(postType:string):string {
    return `沒有在查詢${postType}的請求回應裡找到查詢結果。`;
}

export function theResponseStatusCodeOfSearchIsNot200():string {
    return `查詢網站內容的作業狀態碼不是 200。`;
}

export const somethingSeriousHappenedDuringFetching = '存取資料的過程發生嚴重錯誤，請求資訊與回覆資訊皆損毀。';

export function unableToRetrieveDataBecauseOfServerError(subject:string, info?:string):string {
    let errorMsg = `因為伺服器運作異常的綠故，無法取得${subject}資訊。請稍後再重新嘗試。`;
    if (info) {
        errorMsg += `錯誤訊息： ${info}`;
    }
    return errorMsg;
}