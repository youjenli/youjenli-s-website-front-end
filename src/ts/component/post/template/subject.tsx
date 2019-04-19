import * as React from 'react';
import * as termsOfArticle from '../terms';

interface PropsOfSubject {
    content:string
}

export default class Subject extends React.Component<PropsOfSubject> {
    render() {
        return(
            <fieldset className="subject">
                <legend>{termsOfArticle.titleOfSubject}</legend>
                {this.props.content}
            </fieldset>
        );
    }
}