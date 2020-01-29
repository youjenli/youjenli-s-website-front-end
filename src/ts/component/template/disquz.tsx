/// <reference path="../../model/global-vars.d.ts"/>
import * as React from 'react';
import { isNotBlank } from '../../service/validator';
import { router } from '../../service/router';

interface PropsOfDisquzMessageBoard {
    id:string;
    url?:string;
    title?:string;
    categoryId?:string;
}

export default class DisquzMessageBoard extends React.Component<PropsOfDisquzMessageBoard> {
    constructor(props) {
        super(props);
        if (isNotBlank(window.wp.disquz.shortName)) {
            this.shouldLoadForum = true;
        }
    }
    shouldLoadForum = false;
    componentDidMount() {
        if (this.shouldLoadForum) {
            const props = this.props;
            window['disquz_config'] = function() {
                this.page.identifier = props.id;
                if (isNotBlank(props.title)) {
                    this.page.title = props.title;
                }
                if (isNotBlank(props.url)) {
                    this.page.url = props.url;
                } else {
                    this.page.url = router.lastRouteResolved().url;
                }
                if (isNotBlank(props.categoryId)) {
                    this.page.category_id = props.categoryId;
                }
            }
    
            var d = document, s = d.createElement('script');
            s.src = `https://${window.wp.disquz.shortName}.disqus.com/embed.js`;
            s.setAttribute('data-timestamp', Date.parse(new Date().toString()).toString());
            /*
                data-timestamp 參數要填寫以 milliseconds 計算的時間，
                但因為有些瀏覽器仍不支援 Date 的 valueOf 參數，所以要用以下相對較早支援的語法來強制轉換。
                Date.parse(new Date().toString()).toString()
                欲了解其他可行做法，可參考：
                https://codepen.io/youjenli/pen/KKKwRwY?editors=1011
            */
            (d.head || d.body).appendChild(s);
        }
    }
    render() {
        if (this.shouldLoadForum) {
            const styleOfDisquz = {
                marginBottom:'2em'
            }
            return (
                <React.Fragment>
                    <noscript>
                        Please enable JavaScript to view the 
                        <a href="https://disqus.com/?ref_noscript" rel="nofollow">
                            comments powered by Disqus.
                        </a>
                    </noscript>
                    <div id="disqus_thread" style={styleOfDisquz}></div>
                </React.Fragment>
            );
        } else {
            return null;
        }
    }
}