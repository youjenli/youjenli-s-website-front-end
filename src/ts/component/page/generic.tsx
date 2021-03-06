import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import LargeExternalScreenPage from './large-external-screen';
import ExternalScreenPage from './external-screen';
import TabletPage from './tablet';
import SmartPhonePage from './smart-phone';
import { Page as PageModel, ParsedPage } from '../../model/posts';
import * as terms from '../post/terms';
import { loadPrism } from '../../service/runtime-script-loader';

interface PropsOfGenericPage {
    page:PageModel
}

interface StateOfGenericPage {
    viewportWidth:number;
    viewportHeight:number;    
}

export default class GenericPage extends React.Component<PropsOfGenericPage, StateOfGenericPage> {
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
    render() {
        const baseZIndex = 100;
        const vw = this.state.viewportWidth
        if (vw > 1440) {
            return (
                <div id="page" className="bg">
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <LargeExternalScreenPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={baseZIndex} remFontSize={18} page={this.props.page} />
                </div>
            );
        } else if (vw > 1060) {
            return (
                <div id="page" className="bg">
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <ExternalScreenPage viewportWidth={this.state.viewportWidth} 
                        baseZIndex={baseZIndex} remFontSize={18} page={this.props.page} />
                </div>
            );
        } else {//套用行動裝置的佈局規則

            /*
                註: 必須把行動裝置的目錄提早至這個階段解析，否則一旦餵給主要內容的塗層元件後，將不便產生目錄結構給標題列
             */
            const parser = new DOMParser();
            const doc:Document = parser.parseFromString(this.props.page.content, 'text/html');
            if (doc) {
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
                            <React.Fragment>
                                <div className="title" style={styleOfTocTitle}>{terms.titleOfToc}</div>
                                <div className="sap"></div>
                                <ol className="content" dangerouslySetInnerHTML={{__html:toc.innerHTML}}></ol>
                            </React.Fragment>
                        );
                    } else {
                        const styleOfTocItem = {
                            fontSize:`${(1.3 * vw + 60) / 28}px`
                        }
                        tocElement = (
                            <React.Fragment>
                                <div className="title">{terms.titleOfToc}</div>
                                <div className="sap"></div>
                                <ol className="content" style={styleOfTocItem} dangerouslySetInnerHTML={{__html:toc.innerHTML}}></ol>
                            </React.Fragment>
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

                const page = this.props.page;
                const parsedPage:ParsedPage = Object.assign({ dom:doc }, page);

                if (vw > 432) {
                    const remFontSize = 18;
                    const widthOfContent = this.state.viewportWidth - 2 * remFontSize;
                    const slideshows = doc.querySelectorAll('.slideshow');
                    if (slideshows.length > 0) {
                        const widthOfSlideshow = widthOfContent;
                        const heightOfSlideshow = widthOfSlideshow * 0.75;
                        slideshows.forEach(slideshow => {
                            slideshow.setAttribute('width', `${widthOfSlideshow}px`);
                            slideshow.setAttribute('height', `${heightOfSlideshow}px`);
                        });
                    }

                    return (
                        <div id="page" className="bg mbl">
                            <MobileDeviceTitleBar  className="tb" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} >
                                {tocElement}
                            </MobileDeviceTitleBar>
                            <TabletPage viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} remFontSize={remFontSize}
                                page={parsedPage} />
                        </div>
                    );
                } else {
                    const remFontSize = 16;
                    const maxWidthOfContent = this.state.viewportWidth - 2 * remFontSize;
                    const ytvideos = doc.querySelectorAll('.ytvideo');
                    if (ytvideos.length > 0) {
                        const ytvideoWidth = maxWidthOfContent;
                        const ytvideoHeight = this.state.viewportWidth * 0.6;
                        ytvideos.forEach(ytvideo => {
                            ytvideo.setAttribute('width', `${ytvideoWidth.toString()}px`);
                            ytvideo.setAttribute('height', `${ytvideoHeight.toString()}px`);
                        });
                    }

                    const slideshows = doc.querySelectorAll('.slideshow');
                    if (slideshows.length > 0) {
                        const widthOfSlideshow = maxWidthOfContent;
                        const heightOfSlideshow = widthOfSlideshow * 0.75;
                        slideshows.forEach(slideshow => {
                            slideshow.setAttribute('width', `${widthOfSlideshow.toString()}px`);
                            slideshow.setAttribute('height', `${heightOfSlideshow.toString()}px`);
                        });
                    }

                    return (
                        <div id="page" className="bg mbl">
                            <MobileDeviceTitleBar className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} >
                                {tocElement}
                            </MobileDeviceTitleBar>
                            <SmartPhonePage viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} remFontSize={remFontSize}
                                page={parsedPage} />
                        </div>
                    );
                }
            }// end if(doc)    
        }//行動裝置的佈局規則
    }
}