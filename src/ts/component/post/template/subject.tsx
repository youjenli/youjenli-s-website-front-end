import * as React from 'react';
import * as termsOfArticle from '../terms';

interface PropsOfSubject {
    content:string
    styleOfContent?:React.CSSProperties;
    styleOfHint?:React.CSSProperties;
}

export default class Subject extends React.Component<PropsOfSubject> {
    render() {
        return(
            <fieldset className="subject" style={this.props.styleOfContent}>
                <legend style={this.props.styleOfHint}>{termsOfArticle.titleOfSubject}</legend>
                {this.props.content}
            </fieldset>
        );
    }
}