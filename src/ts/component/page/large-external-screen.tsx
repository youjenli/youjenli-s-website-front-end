import * as React from 'react';
import { Page } from '../../model/page';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import PostBackgroundOnExternalScreen from '../template/es-postBg';
import { PublishInfo } from '../template/post-info';
import {CategoryIcon} from '../home/recentPosts/icons';
import * as Countable from 'countable';
import {LinkOfParent} from './terms';

interface PropsOfLargeExternalScreenPage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    page:Page;
}

export default class LargeExternalScreenPage extends React.Component<PropsOfLargeExternalScreenPage> {
    render() {
        const page = this.props.page;
        const maxWidthOfTitle = (this.props.viewportWidth >= 1657 ? this.props.viewportWidth * 0.618 : 1024 );
        const fontSizeOfTitle = maxWidthOfTitle / 22.8;
        const heightOfImg = maxWidthOfTitle * 0.6;
        const title = {
            name:page.title,
            maxWidth:maxWidthOfTitle,
            fontSize:fontSizeOfTitle
        };
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.props.page.content, 'text/html');
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
        
        const widthOfPostBg = 0.764 * this.props.viewportWidth;
        const marginTopOfPostContent = this.props.remFontSize * 2;
        const marginBottomOfPostContent = this.props.remFontSize * 2;
        const paddingLeftRightOfPosgBg = (widthOfPostBg - maxWidthOfTitle) / 2;        
        const marginBottomOfPostBg = this.props.remFontSize * 2;       

        let parentInfoElement = null;
        if (this.props.page.parent) {
            parentInfoElement = 
                <div className="parent">
                    <CategoryIcon />
                    <LinkOfParent name={this.props.page.parent.title} url={this.props.page.parent.url} />
                </div>;
        }

        if (page.imageUrl) {
            const paddingOfPostBg = {
                top:0.382 * heightOfImg,
                leftRight:paddingLeftRightOfPosgBg
            }
            //要在 subject 元素從節點樹上移除之後才可以設定發文內容的樣式，否則內容會出錯。
            const contentOfPost = {
                margin:{
                    top:marginTopOfPostContent,
                    bottom:marginBottomOfPostContent
                },
                post:null //先不擺內容，等接下來可能要移除 subject 的作業結束後再回頭設定此屬性。
            }

            //設定內容的 post 屬性。
            contentOfPost['post'] = doc.body.innerHTML;

            /* 接下來要準備 post-header 的內容 */
            let countingResult:Countable.CountingResult;
            Countable.count(doc.body.innerHTML, counter => {
                countingResult = counter;
            });
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
                        {parentInfoElement}
                        <PublishInfo date={page.date} modified={page.modified} wordCount={countingResult.characters} 
                            marginBottom={"1.5em"} />                        
                        <img src={page.imageUrl} style={styleOfImg} />
                    </DefaultHeaderOfArticle>
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="les"
                            width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                            toc={toc} content={contentOfPost} />
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

            let countingResult:Countable.CountingResult;
            Countable.count(doc.body.innerHTML, counter => {
                countingResult = counter;
            });
            
            //要在 subject 元素從節點樹上移除之後才可以設定發文內容的樣式，否則內容會出錯。
            const contentOfPost = {
                margin:{
                    top:marginTopOfPostContent,
                    bottom:marginBottomOfPostContent
                },
                post:doc.body.innerHTML
            }

            return (
                <React.Fragment>
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                        titleBg={titleBg} title={title} appendDecorationLine={true}>
                        {parentInfoElement}
                        <PublishInfo date={page.date} modified={page.modified} wordCount={countingResult.characters} 
                            marginBottom={"1.5em"} />                        
                    </DefaultHeaderOfArticle>
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex}  className="les" 
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg} 
                        toc={toc} content={contentOfPost}/>
                </React.Fragment>
            );
        }
    }
}