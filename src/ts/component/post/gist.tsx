import * as React from 'react';
import * as termsOfArticle from './terms';

interface PropsOfGist {
    content:string
    styleOfContent?:React.CSSProperties;
    styleOfHint?:React.CSSProperties;
}

export default class Gist extends React.Component<PropsOfGist> {
    render() {
        return(
            <fieldset className="gist" style={this.props.styleOfContent}>
                <legend style={this.props.styleOfHint}>{termsOfArticle.indicatorOfGist}</legend>
                {this.props.content}
            </fieldset>
        );
    }
}