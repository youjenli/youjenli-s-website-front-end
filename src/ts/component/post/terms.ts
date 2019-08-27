export let titleOfToc = '章節目錄';
export let titleOfSubject = '本文主旨';
export let theFormatOfSlugOfPostIsInvalid = '文章的網址暱稱格式錯誤，請提供正確的暱稱。';

export let unableToLoadSubsequentContent = 
            `<hr style="border-top:2px dashed #4f3707;"/>
            <h3 style="color:black;">很遺憾的通知您，系統未能順利載入此文章後續的內容。請稍後再重新載入本頁。</h3>`;

export function thePostYouArelookingForDoesNotExist(path:string):string {
    return `未找到對應您提供的路徑「${path}」之文章。`;
}

export let thereforeYouWillBeRedirectToTheHomePage = '因此重新導向至本站首頁';

export let neitherPostDataNorSlugOfPostIsAvailable = '未按正確格式提供資訊給系統載入文章。';