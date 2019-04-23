import * as React from 'react';
import { ParsedPost } from '../../model/post';
import SmartphoneHeaderWithImg from './template/smart-phone-post-header-with-img';
import MobilePostHeaderWithoutImg from './template/mobile-post-header-without-img';
import Subject from './template/subject';
import * as Countable from 'countable';

interface PropsOfSmartPhonePostPage {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    post:ParsedPost;
}

export default class SmartPhonePostPage extends React.Component<PropsOfSmartPhonePostPage> {
    render() {
        const post = this.props.post, vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (vw + 1024) / 56;
        const title = {
            name:this.props.post.title,
            fontSize:fontSizeOfTitle
        };
        const fontSizeOfPostInfo = (vw + 464)/56;
        
        let subjectElement = this.props.post.dom.getElementsByClassName('subject')[0];
        let fontSizeOfSubjectHint = null, fontSizeOfSubjectContent = null;
        if (subjectElement) {
            subjectElement.parentElement.removeChild(subjectElement);
            fontSizeOfSubjectHint = 16;
            fontSizeOfSubjectContent = 14;
        }
                
        let countingResult:Countable.CountingResult = null;
        Countable.count(this.props.post.dom.body.innerHTML, counter => {
            countingResult = counter;
        });

        if (this.props.post.imageUrl) {
            const heightOfImg = maxWidthOfTitle * 0.6;
            const img = {
                url:post.imageUrl,
                height:heightOfImg
            }
            const postInfo = {
                fontSize:fontSizeOfPostInfo,
                categories:post.categories,
                tags:post.tags,
                date:post.date,
                modified:post.modified,
                wordCount:countingResult.characters
            };

            let postCtnrElement = null;
            if (subjectElement) {
                const marginTopBottomOfSubject = fontSizeOfSubjectHint * 1.5;
                
                const styleOfSubjectContent = {
                    fontSize:`${fontSizeOfSubjectContent}px`,
                    margin:`${marginTopBottomOfSubject}px 0`
                }
                const styleOfSubjectHint = {
                    fontSize:`${fontSizeOfSubjectHint}px`
                }

                postCtnrElement = 
                    <div id="postBg" className="sp">
                        <Subject styleOfContent={styleOfSubjectContent} styleOfHint={styleOfSubjectHint} content={subjectElement.innerHTML}/>
                        <div dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}} ></div>
                    </div>;
            } else {
                postCtnrElement = 
                    <div id="postBg" className="sp" dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}}>
                    </div>;
            }
 
            return (
                <React.Fragment>
                    <SmartphoneHeaderWithImg title={title} postInfo={postInfo} img={img} />
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
                const postInfo = {
                    fontSize:fontSizeOfPostInfo,
                    categories:post.categories,
                    tags:post.tags,
                    date:post.date,
                    modified:post.modified,
                    wordCount:countingResult.characters,
                    marginBottomOfLastItem:0
                };
                const styleOfSubjectContent = {
                    fontSize:`${fontSizeOfSubjectContent}px`,
                    margin:`${fontSizeOfSubjectHint * 1.5}px 0`
                }
                const styleOfSubjectHint = {
                    fontSize:`${fontSizeOfSubjectHint}px`
                }
                postHeaderElement = 
                    <MobilePostHeaderWithoutImg baseZIndex={this.props.baseZIndex} className="sp"
                        title={title} postInfo={postInfo} heightOfDecoration={heightOfDecoration}>
                            <Subject styleOfContent={styleOfSubjectContent} styleOfHint={styleOfSubjectHint} 
                                        content={subjectElement.innerHTML}/>
                    </MobilePostHeaderWithoutImg>;
            } else {
                const postInfo = {
                    fontSize:fontSizeOfPostInfo,
                    categories:post.categories,
                    tags:post.tags,
                    date:post.date,
                    modified:post.modified,
                    wordCount:countingResult.characters,
                    marginBottomOfLastItem:fontSizeOfPostInfo * 1.5
                };

                postHeaderElement = 
                    <MobilePostHeaderWithoutImg baseZIndex={this.props.baseZIndex} className="sp" title={title}
                        postInfo={postInfo} heightOfDecoration={heightOfDecoration} />;
            }

            return (
                <React.Fragment>
                    {postHeaderElement}    
                    <div id="postBg" style={styleOfPostBg} className="sp" dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}}>
                    </div>
                </React.Fragment>
            );
        }
    }
}