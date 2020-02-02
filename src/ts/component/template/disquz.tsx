/// <reference path="../../model/global-vars.d.ts"/>
import * as React from 'react';
import { isNotBlank } from '../../service/validator';
import { router } from '../../service/router';
import { WelcomeToLeaveYourComment } from './terms';

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
            /*
                雖然整合說明上指示提供參數的方法是
                var disqus_config = function () {
                    // Replace PAGE_URL with your page's canonical URL variable
                    this.page.url = PAGE_URL;

                    // Replace PAGE_IDENTIFIER with your page's unique identifier variable
                    this.page.identifier = PAGE_IDENTIFIER; 
                };
                https://help.disqus.com/en/articles/1717112-universal-embed-code

                但實際使用發現還是要註冊 disquz_config 函式才有用。
            */
            window['disquz_config'] = function (){
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
    
            const d = document, s = d.createElement('script');
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
            const styleOfDisquzBlock = {
                margin:'1em 0', 
                fontSize:'1.15em',
                color:'#232323',
                fontWeight:600
            }
            const styleOfDisquz = {
                marginBottom:'2em'
            }
            return (
                <React.Fragment>
                    <hr />
                    <div style={styleOfDisquzBlock}>
                        <WelcomeToLeaveYourComment />
                    </div>
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