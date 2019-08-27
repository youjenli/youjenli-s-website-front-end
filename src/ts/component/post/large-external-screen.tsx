import * as React from 'react';
import { Post } from '../../model/posts';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import PostInfo from '../template/post-info';
import Subject from './subject';
import PostBackgroundOnExternalScreen from '../template/es-postBg';
import * as Countable from 'countable';

interface PropsOfLargeExternalScreenPostPage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    post:Post;
}

export default class LargeExternalScreenPostPage extends React.Component<PropsOfLargeExternalScreenPostPage> {
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
        let subjectElement = doc.getElementsByClassName('subject')[0];
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

        if (post.thumbnail) {
            let postBgElement = null;
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
            
            if (subjectElement) {
                subjectElement.parentElement.removeChild(subjectElement);
                postBgElement = (
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="les"
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                        toc={toc} content={contentOfPost}>
                        <Subject content={subjectElement.innerHTML}/>
                    </PostBackgroundOnExternalScreen>
                );
            } else {
                postBgElement = (<PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="les"
                            width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                toc={toc} content={contentOfPost} />);
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
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified}
                            wordCount={countingResult.characters} marginBottomOfLastItem='2em' />                      
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
            if (subjectElement) {
                subjectElement.parentElement.removeChild(subjectElement);//todo 似乎沒有移乾淨。

                let countingResult:Countable.CountingResult;
                Countable.count(doc.body.innerHTML, counter => {
                    countingResult = counter;
                });
                
                postHeader = (
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                        titleBg={titleBg} title={title} appendDecorationLine={true}>
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified}
                            wordCount={countingResult.characters}/>
                        <Subject content={subjectElement.innerHTML}/>
                    </DefaultHeaderOfArticle>
                ); 
            } else {
                let countingResult:Countable.CountingResult;
                Countable.count(doc.body.innerHTML, counter => {
                    countingResult = counter;
                });

                postHeader = (
                    <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                        titleBg={titleBg} title={title} appendDecorationLine={true}>
                        <PostInfo categories={this.props.post.categories} tags={this.props.post.tags}
                            date={this.props.post.date} modified={this.props.post.modified}
                            wordCount={countingResult.characters} marginBottomOfLastItem='2em' />
                    </DefaultHeaderOfArticle>
                );
            }

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
                    {postHeader}
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex}  className="les" 
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg} 
                        toc={toc} content={contentOfPost}/>
                </React.Fragment>
            );
        }
    }
}