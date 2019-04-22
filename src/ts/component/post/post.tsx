import * as React from 'react';
import { calculateViewPortWidth, calculateViewPortHeight } from '../../service/dimensionsCalculator';
import ExternalScreenTitleBar from '../title/external-screen-title-bar';
import MobileDeviceTitleBar from '../title/mobile-device-title-bar';
import LargeExternalScreenPostPage from './large-external-screen';
import ExternaScreenPostPage from './external-screen';
import TabletPostPage from './tablet';
import {Post, ParsedPost} from '../../model/post';
import * as terms from './terms';

interface PropsOfPostPage {
    post:Post;
}

interface StateOfPostPage {
    viewportWidth:number;
    viewportHeight:number;    
}

export default class PostPage extends React.Component<PropsOfPostPage, StateOfPostPage> {
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
    render () {
        const headerBaseZIndex = 100;
        const vw = this.state.viewportWidth
        if (vw > 1440) {
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={headerBaseZIndex} />
                    <LargeExternalScreenPostPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={headerBaseZIndex - 10} remFontSize={18} post={this.props.post}/>
                </React.Fragment>
            );
        } else if (vw > 1060) {
            return (
                <React.Fragment>
                    <ExternalScreenTitleBar viewportWidth={this.state.viewportWidth}
                        aspectRatio={this.state.viewportHeight / this.state.viewportWidth} 
                        baseZIndex={headerBaseZIndex} />
                    <ExternaScreenPostPage viewportWidth={this.state.viewportWidth}
                        baseZIndex={headerBaseZIndex - 10} remFontSize={18} post={this.props.post}/>
                </React.Fragment>
            );
        } else {
            if (vw > 432) {//套用平板的佈局規則
                /*
                    註: 必須把行動裝置的目錄提早至這個階段解析，否則一旦餵給主要內容的塗層元件後，將不便產生目錄結構給標題列
                */
                const parser = new DOMParser();
                const doc:Document = parser.parseFromString(this.props.post.content, 'text/html');               
                if (doc) {
                    const post = this.props.post;
                    const parsedPost:ParsedPost = {
                        id:post.id,
                        urlOfPost:post.urlOfPost,
                        date:post.date,
                        modified:post.modified,
                        categories:post.categories,
                        tags:post.tags,
                        title:post.title,
                        imageUrl:post.imageUrl,
                        excerpt:post.excerpt,
                        dom:doc
                    };
                    /*
                      註: 還是不明白為什麼想在 this.props.post 上面附加屬性，
                      或是用 object.create 搬移屬性到另一個物件再加入新屬性的方法無法通過 tsc 對 parsedPost 型態的檢查。
                      前者還可以說是 tsc 型態判讀能力不夠，但後者就很難理解了。
                    */
                    const toc = doc.getElementById('toc');
                    let tocElement = null;
                    if (toc) {
                        toc.parentElement.removeChild(toc);
                        const fontSizeOfTocTitle = (0.9 * vw + 499.2) / 37;
                        const styleOfTocTitle = {
                            fontSize:`${fontSizeOfTocTitle}px`,
                            marginBottom:`0.5em`
                        }
                        const styleOfToc = {
                            paddingTop:`${fontSizeOfTocTitle * 0.5}px`
                        }
                        tocElement = (
                            <div id="toc" style={styleOfToc}>
                                <div className="title" style={styleOfTocTitle}>{terms.titleOfToc}</div>
                                <div className="sap"></div>
                                <ol className="content" dangerouslySetInnerHTML={{__html:toc.innerHTML}}></ol>
                            </div>
                        );
                    }
                    return (
                        <React.Fragment>
                            <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex}>
                                {tocElement}
                            </MobileDeviceTitleBar>
                            <TabletPostPage viewportWidth={this.state.viewportWidth}
                                baseZIndex={headerBaseZIndex - 10} remFontSize={18} post={parsedPost}/>
                        </React.Fragment>
                    );              
                } else {//todo 處理解析失敗的狀況。

                }
            } else {//套用手機的佈局規則
                return (
                    <React.Fragment>
                        <MobileDeviceTitleBar viewportWidth={this.state.viewportWidth} baseZIndex={headerBaseZIndex} />
                    </React.Fragment>
                )
            }
        }
    }
}