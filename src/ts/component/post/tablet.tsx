import * as React from 'react';
import { ParsedPost } from '../../model/post';
import TabletPostHeaderWithImg from './template/tablet-post-header-with-img';
import MobilePostHeaderWithoutImg from './template/mobile-post-header-without-img';
import Subject from './template/subject';
import * as Countable from 'countable';

interface PropsOfTabletPostPage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    post:ParsedPost;
}

export default class TabletPostPage extends React.Component<PropsOfTabletPostPage> {
    render() {
        const post = this.props.post, vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (5 * vw + 1688) / 148;
        const title = {
            name:this.props.post.title,
            fontSize:fontSizeOfTitle
        };
        const fontSizeOfPostInfo = (vw + 1936)/148;

        let subjectElement = this.props.post.dom.getElementsByClassName('subject')[0];
        let fontSizeOfSubjectHint = null, fontSizeOfSubjectContent;
        if (subjectElement) {
            subjectElement.parentElement.removeChild(subjectElement);
            fontSizeOfSubjectHint = (vw + 1936)/148;
            fontSizeOfSubjectContent = (vw + 1640)/148;            
        }
                
        let countingResult:Countable.CountingResult = null;
        Countable.count(this.props.post.dom.body.innerHTML, counter => {
            countingResult = counter;
        });
        const postInfo = {
            fontSize:fontSizeOfPostInfo,
            categories:post.categories,
            tags:post.tags,
            date:post.date,
            modified:post.modified,
            wordCount:countingResult.characters
        };

        if (this.props.post.imageUrl) {
            const heightOfImg = maxWidthOfTitle * 0.6;
            const img = {
                url:post.imageUrl,
                height:heightOfImg
            }
            const paddingBottomOfPostHeader = heightOfImg * 0.618;
            const styleOfTitleBg = {
                paddingBottom:fontSizeOfPostInfo * 1.5
            };

            let postCtnrElement = null;
            if (subjectElement) {
                const marginTopBottomOfSubject = fontSizeOfSubjectHint * 1.5;
                const styleOfPostBg = {
                    paddingTop:heightOfImg * 0.382
                }
                const styleOfSubjectContent = {
                    fontSize:`${fontSizeOfSubjectContent}px`,
                    margin:`${marginTopBottomOfSubject}px 0`
                }
                const styleOfSubjectHint = {
                    fontSize:`${fontSizeOfSubjectHint}px`
                }

                postCtnrElement = 
                    <div id="postBg" style={styleOfPostBg} className="tb">
                        <Subject styleOfContent={styleOfSubjectContent} styleOfHint={styleOfSubjectHint} content={subjectElement.innerHTML}/>
                        <div dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}} ></div>
                    </div>;
            } else {
                const styleOfPostBg = {
                    paddingTop:heightOfImg * 0.382 + this.props.remFontSize * 1.5
                }

                postCtnrElement = 
                    <div id="postBg" style={styleOfPostBg} className="tb" dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}}>
                    </div>;
            }
            return (
                <React.Fragment>
                    <TabletPostHeaderWithImg className="tb" title={title} titleBg={styleOfTitleBg}
                        paddingBottom={paddingBottomOfPostHeader} postInfo={postInfo} img={img} />
                    {postCtnrElement}                        
                </React.Fragment>
            );
        } else {
            const heightOfDecoration = fontSizeOfTitle / 3;
            const styleOfPostBg = {
                paddingTop:this.props.remFontSize * 1.5
            }
            
            let postHeaderElement = null;
            if (subjectElement) {
                const paddingBottomOfPostHeader = fontSizeOfSubjectHint * 1.5;
                const styleOfSubjectContent = {
                    fontSize:`${fontSizeOfSubjectContent}px`,
                    marginTop:`${fontSizeOfSubjectHint}px`
                }
                const styleOfSubjectHint = {
                    fontSize:`${fontSizeOfSubjectHint}px`
                }
                postHeaderElement = 
                    <MobilePostHeaderWithoutImg baseZIndex={this.props.baseZIndex} 
                        className="tb" paddingBottom={paddingBottomOfPostHeader} 
                        title={title} postInfo={postInfo} heightOfDecoration={heightOfDecoration}>
                            <Subject styleOfContent={styleOfSubjectContent} styleOfHint={styleOfSubjectHint} 
                                        content={subjectElement.innerHTML}/>
                    </MobilePostHeaderWithoutImg>;
            } else {
                const paddingBottomOfPostHeader = fontSizeOfPostInfo * 1.5;

                postHeaderElement = 
                    <MobilePostHeaderWithoutImg baseZIndex={this.props.baseZIndex} 
                        className="tb" title={title} paddingBottom={paddingBottomOfPostHeader} 
                        postInfo={postInfo} heightOfDecoration={heightOfDecoration} />;
            }

            return (
                <React.Fragment>
                    {postHeaderElement}    
                    <div id="postBg" style={styleOfPostBg} className="tb" dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}}>
                    </div>
                </React.Fragment>
            );
        }
    }
}