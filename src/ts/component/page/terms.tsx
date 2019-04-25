import * as React from 'react';

interface PropsOfLinkOfParent {
    name:string;
    url:string;
}

export class LinkOfParent extends React.Component<PropsOfLinkOfParent> {
    render() {
        return (<span>{"<<"}<a href={this.props.url}>{this.props.name}</a>{">> 的子文章。"}</span>);
    }
}
