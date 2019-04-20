import * as React from 'react';
import { Post } from '../../model/post';
import DefaultPostHeaderWithImg from './template/es-post-header-with-img';
import DefaultPostHeaderWithoutImg from './template/es-post-header-without-img';
import PostBackgroundOnExternalScreen from './template/es-postBg';
import Subject from './template/subject';
import * as Countable from 'countable';

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
        let marginBottomOfPostBg = this.props.remFontSize * 2;/*數值缺規格，待確認 */
        let widthOfPostBg = this.props.viewportWidth * 0.382 + 632.832;
        let paddingLeftRightOfPosgBg = (widthOfPostBg - maxWidthOfTitle) / 2;
        let paddingBottomPostBg = this.props.remFontSize * 1.5;
        const fontSizeOfTitle = 45;
        const title = {
            name:post.title,
            maxWidth:maxWidthOfTitle,
            fontSize:fontSizeOfTitle
        };
        const heightOfImg = maxWidthOfTitle * 0.6;
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.props.post.content, 'text/html');
        let subjectElement = doc.getElementsByClassName('subject')[0];
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
                    fontSize:fontSizeOfTocItems,
                    margin:{
                        topBottom:fontSizeOfTocItems * 0.6,
                        left:fontSizeOfTocItems,
                    }
                },
                paddingLeftRight:paddingLeftRightOfToc,
                content:tocElement.innerHTML
            }
        }
                
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
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="es"
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
                postBg = <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="es"
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
                    <DefaultPostHeaderWithImg baseZIndex={this.props.remFontSize + 1} className="es"
                        titleBg={titleBg} title={title} postInfo={postInfo} img={img} />
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
                    paddingBottom:'30px'
                };
                postHeader = (
                    <DefaultPostHeaderWithoutImg baseZIndex={this.props.remFontSize + 1} className="es"
                        titleBg={titleBg} title={title} postInfo={postInfo}>
                        <Subject content={subjectElement.innerHTML}/>
                    </DefaultPostHeaderWithoutImg>
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
                    <DefaultPostHeaderWithoutImg baseZIndex={this.props.remFontSize + 1} className="es"
                        titleBg={titleBg} title={title} postInfo={postInfo} />
                );
            }

            return (
                <React.Fragment>
                    {postHeader}
                    <PostBackgroundOnExternalScreen baseZIndex={this.props.baseZIndex} className="es"
                        width={widthOfPostBg} padding={paddingOfPostBg} marginBottom={marginBottomOfPostBg} 
                        toc={toc} contentOfPost={doc.body.innerHTML}/>
                </React.Fragment>
            );
        }
    }
}