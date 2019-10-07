/// <reference path="../model/global-vars.d.ts"/>
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { isNotBlank } from '../service/validator';
import * as terms from './terms';

interface PropsOfPageTitle {
    name?:string;//網頁的標題名稱。
}

export default class PageTitle extends React.Component<PropsOfPageTitle> {
    render() {
        let siteName = terms.defaultSiteName;
        if (isNotBlank(window.wp.siteName)) {
            siteName = window.wp.siteName;
        }

        let desc = null;
        if (isNotBlank(this.props.name)) {
            desc = `${this.props.name} - ${siteName}`;
        } else {
            desc = `${siteName}`;
        }

        const title = document.getElementsByTagName('title')[0];
        return ReactDOM.createPortal(
            <React.Fragment>{desc}</React.Fragment>,
            title
        );
    }
}