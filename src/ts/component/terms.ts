export const postInWP = '文章';
export const thumbnailOfPost = '文章的意象圖';
export const tagOfTaxonomy = '標籤';
export const categoryOfTaxonomy = '分類';

export function unableToRetrieveDataBecauseOfServerError(subject:string, info?:string):string {
    let errorMsg = `因為伺服器運作異常的綠故，無法取得${subject}資訊。請稍後再重新嘗試。`;
    if (info) {
        errorMsg += `錯誤訊息： ${info}`;
    }
    return errorMsg;
}

export const regrettablyNotifyUserAboutSevereError = '很抱歉，此頁面發生嚴重問題，因此無法提供服務。';
export const explanationOfTheSituation = '若您看到此頁面，那表示此網頁有重要功能發生嚴重問題，使它無法繼續呈現網站內容。';
export const pleaseReconnectToThisSiteLater = '麻煩您稍後再嘗試重新連線。';
export const sorryForTheInconvenience = '不好意思，造成您的不便';