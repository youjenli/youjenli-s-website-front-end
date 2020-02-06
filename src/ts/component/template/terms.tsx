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

export class WelcomeToLeaveYourComment extends React.Component<{style?:React.CSSProperties}> {
    render() {
        return (
            <div style={this.props.style}>
                為讓您不必申請本站帳號即可留言討論，本站委由 <a href="https://disqus.com/">Disqus</a> 提供以下留言功能。歡迎發表心得感想與意見！
            </div>
        );
    }
}


export let neitherTheDataNorTheSlugOfPublicationIsAvailable = '未按正確格式提供資訊給系統載入文章。';

export let thereforeYouWillBeRedirectToTheHomePage = '故導向至本站首頁';

export let titleIsUnavailable = '（無標題）';
export let excerptIsUnavailable = '（無摘抄）';