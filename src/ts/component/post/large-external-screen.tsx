import * as React from 'react';
import { Post } from '../../model/post';
import PostHeaderWithImgOnExternalScreen from './template/es-post-header-with-img';
import PostHeaderWithoutImgOnExternalScreen from './template/es-post-header-without-img';
import PostBackgroundOnExternalScreen from './template/es-postBg';
import Subject from './template/subject';
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
                    fontSize:fontSizeOfTocItems,
                    margin:{
                        topBottom:fontSizeOfTocItems * 0.8,
                        left:fontSizeOfTocItems,
                    }
                },
                paddingLeftRight:paddingLeftRightOfToc,
                content:tocElement.innerHTML
            }
        }
        
        const widthOfPostBg = 0.764 * this.props.viewportWidth;
        const marginBottomOfPostBg = this.props.remFontSize * 2;
        const marginTopOfPostContent = this.props.remFontSize * 2;
        const paddingLeftRightOfPosgBg = (widthOfPostBg - maxWidthOfTitle) / 2;
        const paddingBottomPostBg = this.props.remFontSize * 2;
                
        if (post.imageUrl) {
            
            let postBg = null;
            if (subjectElement) {
                subjectElement.parentElement.removeChild(subjectElement);
                const paddingOfPostBg = {
                    top:0.382 * heightOfImg,
                    leftRight:paddingLeftRightOfPosgBg,
                    bottom:paddingBottomPostBg
                }
                postBg = (
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="les"
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                        toc={toc} contentOfPost={doc.body.innerHTML}>
                        <Subject content={subjectElement.innerHTML}/>
                    </PostBackgroundOnExternalScreen>
                );
            } else {
                const paddingOfPostBg = {
                    top:0.382 * heightOfImg + marginTopOfPostContent,
                    leftRight:paddingLeftRightOfPosgBg,
                    bottom:paddingBottomPostBg
                }
                postBg = <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="les"
                            width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg}
                            toc={toc} contentOfPost={doc.body.innerHTML}/>;
            }
            let countingResult:Countable.CountingResult;
            Countable.count(doc.body.innerHTML, counter => {
                countingResult = counter;
            });
            const titleBg = {
                paddingBottom:heightOfImg * 0.618/* 注意，不用加上發佈資訊的下沿，那部分由 postInfo 的樣式來設定 */
            };
            /* 如果畫面上有照片那要為 post info 加上 padding bottom 以便使 post info 跟圖片或裝飾線保持距離 */
            let postInfo = {
                categories:this.props.post.categories,
                tags:this.props.post.tags,
                date:this.props.post.date,
                modified:this.props.post.modified,
                wordCount:countingResult.characters,
                paddingBottomInEM:0.75
            };
            let img = {
                url:post.imageUrl,
                height:heightOfImg
            }
            return (
                <React.Fragment>
                    <PostHeaderWithImgOnExternalScreen baseZIndex={this.props.remFontSize + 1} titleBg={titleBg} title={title}
                         className="les" postInfo={postInfo} img={img} />
                    {postBg}
                </React.Fragment>
            );
        } else {
            let titleBg = {
                paddingBottom:0
            };
            let paddingOfPostBg = {
                top:marginTopOfPostContent,
                leftRight:paddingLeftRightOfPosgBg,
                bottom:paddingBottomPostBg
            };            
            let postHeader = null
            if (subjectElement) {
                subjectElement.parentElement.removeChild(subjectElement);

                let countingResult:Countable.CountingResult;
                Countable.count(doc.body.innerHTML, counter => {
                    countingResult = counter;
                });

                let postInfo = {
                    categories:this.props.post.categories,
                    tags:this.props.post.tags,
                    date:this.props.post.date,
                    modified:this.props.post.modified,
                    wordCount:countingResult.characters,
                    paddingBottom:'0.9375vw'
                };
                postHeader = (
                    <PostHeaderWithoutImgOnExternalScreen baseZIndex={this.props.remFontSize + 1}  className="les"
                        titleBg={titleBg} title={title} postInfo={postInfo}>
                        <Subject content={subjectElement.innerHTML}/>
                    </PostHeaderWithoutImgOnExternalScreen>
                ); 
            } else {
                let countingResult:Countable.CountingResult;
                Countable.count(doc.body.innerHTML, counter => {
                    countingResult = counter;
                });

                let postInfo = {
                    categories:this.props.post.categories,
                    tags:this.props.post.tags,
                    date:this.props.post.date,
                    modified:this.props.post.modified,
                    wordCount:countingResult.characters,
                    paddingBottom:'1em'
                };
                postHeader = (
                    <PostHeaderWithoutImgOnExternalScreen baseZIndex={this.props.remFontSize + 1} className="les"
                        titleBg={titleBg} title={title} postInfo={postInfo} />
                );
            }

            return (
                <React.Fragment>
                    {postHeader}
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex}  className="les" 
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg} 
                        toc={toc} contentOfPost={doc.body.innerHTML}/>
                </React.Fragment>
            );
        }
    }
}