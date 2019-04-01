import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TitleBar } from '../component/title/title-bar';

export function showHomePage(){
    return new Promise((resolve, reject) => {
        ReactDOM.render(
            <TitleBar />,
            document.getElementById('react-root'),
            () => { resolve() }
        );
    });
}