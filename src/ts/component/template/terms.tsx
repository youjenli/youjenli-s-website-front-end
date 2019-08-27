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