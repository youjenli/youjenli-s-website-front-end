import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import LargeExternalScreenPage from './large-external-screen';
import ExternalScreenPage from './external-screen';
import TabletPage from './tablet';
import SmartPhonePage from './smart-phone';
import { Page as PageModel, ParsedPage } from '../../model/page';
import * as terms from '../post/terms';

interface PropsOfPage {
    page:PageModel
}

interface StateOfPage {
    viewportWidth:number;
    viewportHeight:number;    
}

export default class Page extends React.Component<PropsOfPage, StateOfPage> {
    constructor(props){
        super(props);
        this.calculateViewPortDimensions = this.calculateViewPortDimensions.bind(this);
        this.state = {
            viewportWidth:calculateViewPortWidth(),
            viewportHeight:calculateViewPortHeight()
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.calculateViewPortDimensions);
        window.addEventListener('orientationchange', this.calculateViewPortDimensions);
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
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <LargeExternalScreenPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={baseZIndex} remFontSize={18} page={this.props.page} />
                </React.Fragment>
            );
        } else if (vw > 1060) {
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={baseZIndex + 20} />
                    <ExternalScreenPage viewportWidth={this.state.viewportWidth} 
                        baseZIndex={baseZIndex} remFontSize={18} page={this.props.page} />
                </React.Fragment>
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
                
                const page = this.props.page;
                const parsedPage:ParsedPage = {
                    title:page.title,
                    id:page.id,
                    date:page.date,
                    modified:page.modified,
                    imageUrl:page.imageUrl,
                    excerpt:page.excerpt,
                    dom:doc
                };
                if (page.parent) {
                    parsedPage['parent'] = {
                        title:page.parent.title,
                        url:page.parent.url
                    }
                }
                /*
                  註: 還是不明白為什麼想在 this.props.post 上面附加屬性，
                  或是用 object.create 搬移屬性到另一個物件再加入新屬性的方法無法通過 tsc 對 parsedPost 型態的檢查。
                  前者還可以說是 tsc 型態判讀能力不夠，但後者就很難理解了。
                */

                if (vw > 432) {
                    return (
                        <React.Fragment>
                            <MobileDeviceTitleBar  className="tb" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} >
                                {tocElement}
                            </MobileDeviceTitleBar>
                            <TabletPage viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} remFontSize={18}
                                page={parsedPage} />
                        </React.Fragment>
                    );
                } else {
                    return (
                        <React.Fragment>
                            <MobileDeviceTitleBar className="sp" viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex + 20} >
                                {tocElement}
                            </MobileDeviceTitleBar>
                            <SmartPhonePage viewportWidth={this.state.viewportWidth} baseZIndex={baseZIndex} remFontSize={16} 
                                page={parsedPage} />
                        </React.Fragment>
                    );
                }
            }// end if(doc)    
        }//行動裝置的佈局規則
    }
}