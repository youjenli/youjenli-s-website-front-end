import * as React from 'react';
import { Post } from '../../model/posts';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import PostInfo from '../template/post-info';
import Gist from './gist';
import PostBackgroundOnExternalScreen from '../template/es-postBg';
import { loadPrism } from '../../service/runtime-script-loader';

interface PropsOfLargeExternalScreenPostPage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    post:Post;
}

export default class LargeExternalScreenPostPage extends React.Component<PropsOfLargeExternalScreenPostPage> {
    constructor(props) {
        super(props);
        this.backgroundRef = React.createRef();
    }
    backgroundRef;
    onMount = () => {};
    componentDidMount(){
        this.onMount();
    }
    render() {
        const post = this.props.post;
        const maxWidthOfTitle = (this.props.viewportWidth >= 1657 ? this.props.viewportWidth * 0.618 : 1024 );
        const fontSizeOfTitle = maxWidthOfTitle / 22.8;
        const heightOfImg = maxWidthOfTitle * 0.6;
        const title = {
            name:post.title,
            maxWidth:maxWidthOfTitle,
            fontSize:fontSizeOfTitle
        };
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.props.post.content, 'text/html');
        const tocElement = doc.getElementById('toc');
        let toc = null;
        if (tocElement) {
            tocElement.parentElement.removeChild(tocElement);
            const widthOfToc = maxWidthOfTitle * 0.382;
            const fontSizeOfTocItems = widthOfToc / 20;
            const paddingLeftRightOfToc = fontSizeOfTocItems;
            const fontSizeOfTitleOfToc = (widthOfToc - 2 * fontSizeOfTocItems) / 16;
            toc = {
                width:widthOfToc,
                title:{
                    fontSize:fontSizeOfTitleOfToc,
                    marginTopBottom:fontSizeOfTitleOfToc * 0.75,
                },
                item:{
                    fontSize:fontSizeOfTocItems
                },
                paddingLeftRight:paddingLeftRightOfToc,
                content:tocElement.innerHTML
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

        const widthOfPostBg = 0.764 * this.props.viewportWidth;
        const marginTopOfPostContent = this.props.remFontSize * 2;
        const marginBottomOfPostContent = this.props.remFontSize * 2;
        const paddingLeftRightOfPosgBg = (widthOfPostBg - maxWidthOfTitle) / 2;
        const marginBottomOfPostBg = this.props.remFontSize * 2;
        const contentOfPost = {
            margin:{
                top:marginTopOfPostContent,
                bottom:marginBottomOfPostContent
            },
            post:doc.body.innerHTML
        }
        const settingsOfMessageBoard = {
            id:`${this.props.post.type}-${this.props.post.id}`,
            title:this.props.post.title,
        }

        if (post.thumbnail) {
            let postBgElement = null;
            const paddingOfPostBg = {
                top:0.382 * heightOfImg,
                leftRight:paddingLeftRightOfPosgBg
            }

            if (this.props.post.gist) {
                postBgElement = (
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="les"
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                        toc={toc} content={contentOfPost} comment={settingsOfMessageBoard} ref={this.backgroundRef} >
                        <Gist content={this.props.post.gist} />
                    </PostBackgroundOnExternalScreen>
                );
            } else {
                postBgElement = (
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="les"
                                width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                                toc={toc} content={contentOfPost}  comment={settingsOfMessageBoard} ref={this.backgroundRef} />
                );
            }
            //設定內容的 post 屬性。
            contentOfPost['post'] = doc.body.innerHTML;

            /* 接下來要準備 post-header 的內容 */
            const titleBg = {
                paddingBottom:heightOfImg * 0.618/* 注意，不用加上發佈資訊的下沿，那部分由 postInfo 的樣式來設定 */
            };
            /* 如果畫面上有照片那要為 post info 加上 padding bottom 以便使 post info 跟圖片或裝飾線保持距離 */
            
            let styleOfImg = {
                height:`${heightOfImg}px`
            }
            return (
                <React.Fragment>
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                        titleBg={titleBg} title={title} appendDecorationLine={false}>
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified} marginBottomOfLastItem='2em'
                            estimatedReadingTimes={this.props.post.estimatedReadingTimes} />
                        <img src={post.thumbnail.url} style={styleOfImg} />
                    </DefaultHeaderOfArticle>
                    {postBgElement}
                </React.Fragment>
            );
        } else {
            let titleBg = {
                paddingBottom:0
            };
            let paddingOfPostBg = {
                top:0,
                leftRight:paddingLeftRightOfPosgBg
            };
            let postHeader = null
            if (this.props.post.gist) {
                postHeader = (
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                        titleBg={titleBg} title={title} appendDecorationLine={true}>
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified} estimatedReadingTimes={this.props.post.estimatedReadingTimes}/>
                        <Gist content={this.props.post.gist} />
                    </DefaultHeaderOfArticle>
                ); 
            } else {
                postHeader = (
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                        titleBg={titleBg} title={title} appendDecorationLine={true}>
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified} marginBottomOfLastItem='2em'
                            estimatedReadingTimes={this.props.post.estimatedReadingTimes} />
                    </DefaultHeaderOfArticle>
                );
            }

            return (
                <React.Fragment>
                    {postHeader}
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex}  className="les" 
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg} 
                        toc={toc} content={contentOfPost} comment={settingsOfMessageBoard} ref={this.backgroundRef} />
                </React.Fragment>
            );
        }
    }
}