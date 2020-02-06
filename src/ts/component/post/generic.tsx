import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import LargeExternalScreenPostPage from './large-external-screen';
import ExternalScreenPostPage from './external-screen';
import TabletPostPage from './tablet';
import SmartPhonePostPage from './smart-phone';
import {Post, ParsedPost} from '../../model/posts';
import * as terms from './terms';
import { loadPrism } from '../../service/runtime-script-loader';

interface PropsOfPostPage {
    post:Post;
}

interface StateOfPostPage {
    viewportWidth:number;
    viewportHeight:number;    
}

export default class GenericPost extends React.Component<PropsOfPostPage, StateOfPostPage> {
    constructor(props){
        super(props);
        this.calculateViewPortDimensions = this.calculateViewPortDimensions.bind(this);
        this.state = {
            viewportWidth:calculateViewPortWidth(),
            viewportHeight:calculateViewPortHeight()
        }
    }
    onMount = () => {}
    componentDidMount() {
        window.addEventListener('resize', this.calculateViewPortDimensions);
        window.addEventListener('orientationchange', this.calculateViewPortDimensions);
        this.onMount();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.calculateViewPortDimensions);
        window.removeEventListener('orientationchange', this.calculateViewPortDimensions);
    }
    calculateViewPortDimensions() {
        this.setState({
            viewportWidth:calculateViewPortWidth(),
            viewportHeight:calculateViewPortHeight()
        });
    }
    render () {
        const baseZIndex = 100;
        const vw = this.state.viewportWidth
        if (vw > 1440) {
            return (
                <div id="post" className="bg">
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <LargeExternalScreenPostPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={baseZIndex} remFontSize={18} post={this.props.post}/>
                </div>
            );
        } else if (vw > 1060) {
            return (
                <div id="post" className="bg">
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <ExternalScreenPostPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={baseZIndex} remFontSize={18} post={this.props.post}/>
                </div>
            );
        } else {
            /*
                註: 必須把行動裝置的目錄提早至這個階段解析，否則一旦餵給主要內容的塗層元件後，將不便產生目錄結構給標題列
             */
            const parser = new DOMParser();
            const post = this.props.post;
            const doc:Document = parser.parseFromString(post.content, 'text/html');
            if (doc) {
                const parsedPost:ParsedPost = Object.assign({ dom:doc }, post);

                /*
                  註: 還是不明白為什麼想在 this.props.post 上面附加屬性，
                  或是用 object.create 搬移屬性到另一個物件再加入新屬性的方法無法通過 tsc 對 parsedPost 型態的檢查。
                  前者還可以說是 tsc 型態判讀能力不夠，但後者就很難理解了。
                */
               //todo 修訂 menu 元件首尾 margin 的設計
                const toc = doc.getElementById('toc');
                let tocElement = null;
                if (toc) {
                    toc.parentElement.removeChild(toc);
                    if (vw > 432) {//套用平板的佈局規則
                        const fontSizeOfTocTitle = (0.9 * vw + 499.2) / 37;
                        const styleOfTocTitle = {
                            fontSize:`${fontSizeOfTocTitle}px`,
                        }
                        tocElement = (
                            <div id="toc">
                                <div className="title" style={styleOfTocTitle}>{terms.titleOfToc}</div>
                                <div className="sap"></div>
                                <ol className="content" dangerouslySetInnerHTML={{__html:toc.innerHTML}}></ol>
                            </div>
                        );
                    } else {
                        const styleOfTocItem = {
                            fontSize:`${(1.3 * vw + 60) / 28}px`
                        }
                        tocElement = (
                            <div id="toc">
                                <div className="title">{terms.titleOfToc}</div>
                                <div className="sap"></div>
                                <ol className="content" style={styleOfTocItem} dangerouslySetInnerHTML={{__html:toc.innerHTML}}></ol>
                            </div>
                        );
                    }   
                }

                const codeBlocks = doc.querySelectorAll("code[class*='language-']");
                if (codeBlocks.length > 0) {
                    this.onMount = () => {
                        loadPrism(() => {
                            /*
                                因為前面會先查查是否有附帶 language- 的類別名稱的元素，而且 prismjs 又有 highlightElement 函式，
                                所以用這函式強化找到的元素似乎是最合適、最有效率的做法，但實驗發現這項做法沒有效果。
                                雖然 prismjs 執行沒有異常，但是卻無法在使用者請求後續其他頁面的時候強化頁面內容，
                                除非使用 highlightAll 函式。
                                因此沒有充足時間查明問題源頭的情況下就暫時先用這個方法實現功能，以後有時間再仔細診斷問題吧。
                            */
                            window['Prism'].highlightAll();
                        });
                    }
                }

                if (vw > 432) {
                    return (
                        <div id="post" className="bg mbl">
                            <MobileDeviceTitleBar  className="tb" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20}>
                                {tocElement}
                            </MobileDeviceTitleBar>
                            <TabletPostPage viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex}
                                remFontSize={18} post={parsedPost} />
                        </div>
                    );
                } else {
                    return (
                        <div id="post" className="bg mbl">
                            <MobileDeviceTitleBar className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20}>
                                {tocElement}
                            </MobileDeviceTitleBar>
                            <SmartPhonePostPage viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex}
                                remFontSize={16} post={parsedPost} />
                        </div>
                    );
                }
            } else {//todo 處理解析失敗的狀況。

            }
        }
    }
}