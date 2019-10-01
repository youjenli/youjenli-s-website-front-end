import * as React from 'react';

interface PropsOfLinkOfParent {
    name:string;
    url:string;
}

export class LinkOfParent extends React.Component<PropsOfLinkOfParent> {
    render() {
        return (<span>{"<<"}<a href={this.props.url} data-navigo>{this.props.name}</a>{">> 的子文章。"}</span>);
    }
}

export let cannotFetchPostsInsideThePageYouHaveRequested = '存取此分頁的文章失敗，請稍後再重新嘗試。';

export function failedToLoadThePage(path:string):string {
    return `很遺憾的通知您，系統未順利取得對應「${path}」的資源，請稍後再重新載入本頁。`;
}

export function thePublicationYouArelookingForDoesNotExist(path:string):string {
    return `未找到對應您提供的路徑「${path}」之文章。`;
}

export let neitherTheDataNorTheSlugOfPublicationIsAvailable = '未按正確格式提供資訊給系統載入文章。';

export let thereforeYouWillBeRedirectToTheHomePage = '故導向至本站首頁';

export let noTitle = '（無標題）';