export function thePageYouArelookingForDoesNotExist(path:string):string {
    return `未找到對應您提供的路徑「${path}」之專頁。`;
}

export let thereforeYouWillBeRedirectToTheHomePage = '故導向至本站首頁';

export let neitherPageDataNorSlugOfPageIsAvailable = '未按正確格式提供資訊給系統載入文章。';

export function failedToLoadThePage(path:string):string {
    return `很遺憾的通知您，系統未順利取得對應「${path}」的資源，請稍後再重新載入本頁。`;
}