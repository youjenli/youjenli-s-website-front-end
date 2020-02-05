/// <reference types="prismjs" />
/// <reference path="../model/global-vars.d.ts" />

import { isNotBlank } from './validator';
import { trailingSlashIt } from './formatters';
import { isFunc } from '../service/validator';

let prismHasBeenLoaded = false;

export function loadPrism(callback?:() => void) {
    if (!prismHasBeenLoaded) {
        let pathOfPrismJsSrcFile = trailingSlashIt(window.wp.themeUrl) + trailingSlashIt('js') + 'prism.js';
        if (isNotBlank(window.wp.urlOfPrismJsSrcFile)) {
            pathOfPrismJsSrcFile = window.wp.urlOfPrismJsSrcFile;
        }
        let pathOfPrismCssSrcFile = trailingSlashIt(window.wp.themeUrl) + trailingSlashIt('css') + 'prism.css';
        if (isNotBlank(window.wp.urlOfPrismCssSrcFile)) {
            pathOfPrismCssSrcFile = window.wp.urlOfPrismCssSrcFile;
        }

        const link = document.createElement('link');
        link.href = pathOfPrismCssSrcFile;
        link.rel = "stylesheet";
        const prismjsBundle = document.createElement('script');
        prismjsBundle.src = pathOfPrismJsSrcFile;
        prismjsBundle.onload = () => {
            
            //確定成功載入 prismjs 後即設定 prismjs
            const prismComponentPath = trailingSlashIt(window.wp.themeUrl) + trailingSlashIt(window.wp.jsSrcFolder) + 'prism-components/';
            window['Prism'].plugins.autoloader.languages_path = prismComponentPath;
            window['Prism'].plugins.autoloader.use_minified = false;

            prismHasBeenLoaded = true;
            if (isFunc(callback)) {
                callback();
            }
        }

        document.body.appendChild(link);
        document.body.appendChild(prismjsBundle);
    } else if (isFunc(callback)){
        callback();
    }
}