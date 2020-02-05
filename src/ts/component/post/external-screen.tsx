import * as React from 'react';
import { Post } from '../../model/posts';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import PostInfo from '../template/post-info';
import PostBackgroundOnExternalScreen from '../template/es-postBg';
import Gist from './gist';
import { trailingSlashIt } from '../../service/formatters';
import { isNotBlank } from '../../service/validator';
import * as Prism from 'prismjs';

interface PropsOfExternalScreenPostPage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    post:Post;
}

export default class ExternalScreenPostPage extends React.Component<PropsOfExternalScreenPostPage> {
    render() {
        const post = this.props.post;
        let maxWidthOfTitle = 1024;
        let marginTopOfPostContent = this.props.remFontSize * 1.5;    
        let marginBottomOfPostContent = this.props.remFontSize * 1.5;
        let marginBottomOfPostBg = this.props.remFontSize * 2;/*數值缺規格，待確認 */
        let widthOfPostBg = this.props.viewportWidth * 0.382 + 632.832;
        let paddingLeftRightOfPosgBg = (widthOfPostBg - maxWidthOfTitle) / 2;
        const title = {
            name:post.title,
            maxWidth:maxWidthOfTitle
        };
        
        const heightOfImg = maxWidthOfTitle * 0.6;
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.props.post.content, 'text/html');
        const contentOfPost = {
            margin:{
                top:marginTopOfPostContent,
                bottom:marginBottomOfPostContent
            },
            post:doc.body.innerHTML
        }
        const tocElement = doc.getElementById('toc');
        let toc = null;
        if (tocElement) {
            tocElement.parentElement.removeChild(tocElement);
            const widthOfToc = 391;
            const fontSizeOfTocItems = 17.8;
            const paddingLeftRightOfToc = fontSizeOfTocItems;        
            const fontSizeOfTitleOfToc = 29.6;
            toc = {
                width:widthOfToc,
                title:{
                    fontSize:fontSizeOfTitleOfToc,
                    marginTopBottom:fontSizeOfTitleOfToc * 0.5,
                },
                item:{
                    fontSize:fontSizeOfTocItems
                },
                paddingLeftRight:paddingLeftRightOfToc,
                content:tocElement.innerHTML
            }
        }

        let loadPrismJs = null;
        const codeBlocks = document.querySelectorAll("code[class*='language-']");
        if (codeBlocks.length >= 0 && Prism == undefined) {
            let pathOfJsSrc = 'js';
            if (isNotBlank(window.wp.pathOfJsSrcFiles)) {
                pathOfJsSrc = window.wp.pathOfJsSrcFiles;
            }
            loadPrismJs = (<script src={trailingSlashIt(pathOfJsSrc) + "prism.js"}></script>);
        }

        const settingsOfMessageBoard = {
            id:`${this.props.post.type}-${this.props.post.id}`,
            title:this.props.post.title
        }

        if (post.thumbnail) {
            
            let postBg = null;
            const paddingOfPostBg = {
                top:0.382 * heightOfImg,
                leftRight:paddingLeftRightOfPosgBg
            }

            if (this.props.post.gist) {
                postBg = (
                    <React.Fragment>
                        <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="es"
                            width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                            toc={toc} content={contentOfPost}  comment={settingsOfMessageBoard} >
                            <Gist content={this.props.post.gist}/>
                        </PostBackgroundOnExternalScreen>
                        {loadPrismJs}
                    </React.Fragment>
                );
            } else {
                postBg = (
                    <React.Fragment>
                        <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="es"
                            width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                            toc={toc} content={contentOfPost} comment={settingsOfMessageBoard} />
                        {loadPrismJs}
                    </React.Fragment>
                );
            }
            //設定內容的 post 屬性。
            contentOfPost['post'] = doc.body.innerHTML;

            //接下來要開始準備 post-header 的內容
            const titleBg = {
                paddingBottom:heightOfImg * 0.618/* 注意，不用加上發佈資訊的下沿，那部分由 postInfo 的樣式來設定 */
            };
            /* 如果畫面上有照片那要為 post info 加上 padding bottom 以便使 post info 跟圖片或裝飾線保持距離 */

            let styleOfImg = {
                height:`${heightOfImg}px`
            }
            return (
                <React.Fragment>
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                        titleBg={titleBg} title={title} appendDecorationLine={false}>
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified}
                            marginBottomOfLastItem='1.5em' estimatedReadingTimes={this.props.post.estimatedReadingTimes}/>
                        <img src={post.thumbnail.url} style={styleOfImg} />
                    </DefaultHeaderOfArticle>
                    {postBg}
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
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                        titleBg={titleBg} title={title} appendDecorationLine={true}>
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified} 
                            marginBottomOfLastItem='0px'  estimatedReadingTimes={this.props.post.estimatedReadingTimes}/>
                        <Gist content={this.props.post.gist} />
                    </DefaultHeaderOfArticle>
                ); 
            } else {
                postHeader = (
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                        titleBg={titleBg} title={title} appendDecorationLine={true}>
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified}
                            marginBottomOfLastItem='1.5em' estimatedReadingTimes={this.props.post.estimatedReadingTimes}/>
                    </DefaultHeaderOfArticle>
                );
            }

            return (
                <React.Fragment>
                    {postHeader}
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="es"
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg} 
                        toc={toc} content={contentOfPost}  comment={settingsOfMessageBoard} />
                    {loadPrismJs}
                </React.Fragment>
            );
        }
    }
}