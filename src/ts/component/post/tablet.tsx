import * as React from 'react';
import { ParsedPost } from '../../model/post';
import MobilePostHeader from '../template/mobile-header-of-article';
import PostInfo from '../template/post-info';
import Subject from './subject';
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
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
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

        if (this.props.post.imageUrl) {
            const heightOfImg = maxWidthOfTitle * 0.6;
            const styleOfImg = {
                height:`${heightOfImg}px`
            }

            const paddingBottomOfTitleBg = heightOfImg * 0.618;

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
                    <div id="postBg" style={styleOfPostBg} className="tb post">
                        <Subject styleOfContent={styleOfSubjectContent} styleOfHint={styleOfSubjectHint} content={subjectElement.innerHTML}/>
                        <div dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}} ></div>
                    </div>;
            } else {
                const styleOfPostBg = {
                    paddingTop:heightOfImg * 0.382 + this.props.remFontSize * 1.5
                }

                postCtnrElement = 
                    <div id="postBg" style={styleOfPostBg} className="tb post" dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}}>
                    </div>;
            }
            
            return (
                <React.Fragment>
                    <MobilePostHeader baseZIndex={this.props.baseZIndex} className="tb" title={title} paddingBottom={paddingBottomOfTitleBg} >
                        <PostInfo categories={post.categories} tags={post.tags} date={post.date} modified={post.modified} 
                            wordCount={countingResult.characters} marginBottomOfLastItem={`${fontSizeOfPostInfo * 1.5}px`} >
                            <img src={post.imageUrl} style={styleOfImg} />
                        </PostInfo>                        
                    </MobilePostHeader>                    
                    {postCtnrElement}                        
                </React.Fragment>
            );
        } else {
            const decorationLine = {
                height:fontSizeOfTitle / 3
            }
            const styleOfPostBg = {
                paddingTop:this.props.remFontSize * 1.5
            }
            
            let postHeaderElement = null;
            if (subjectElement) {
                
                const styleOfSubjectContent = {
                    fontSize:`${fontSizeOfSubjectContent}px`,
                    margin:`${fontSizeOfSubjectHint * 1.5}px 0`
                }
                const styleOfSubjectHint = {
                    fontSize:`${fontSizeOfSubjectHint}px`
                }
                postHeaderElement = 
                    <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                        title={title} decorationLine={decorationLine} >
                        <PostInfo categories={post.categories} tags={post.tags} date={post.date} modified={post.modified} 
                            wordCount={countingResult.characters} marginBottomOfLastItem={'0px'} />
                        <Subject styleOfContent={styleOfSubjectContent} styleOfHint={styleOfSubjectHint} 
                                    content={subjectElement.innerHTML}/>
                    </MobilePostHeader>
            } else {
                postHeaderElement = 
                    <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                        title={title} decorationLine={decorationLine} >
                        <PostInfo categories={post.categories} tags={post.tags} date={post.date} modified={post.modified} 
                    wordCount={countingResult.characters} marginBottomOfLastItem={`${fontSizeOfPostInfo * 1.5}px`} />
                    </MobilePostHeader>;
            }

            return (
                <React.Fragment>
                    {postHeaderElement}    
                    <div id="postBg" style={styleOfPostBg} className="tb post" dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}}>
                    </div>
                </React.Fragment>
            );
        }
    }
}