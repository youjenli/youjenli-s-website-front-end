import * as React from 'react';
import { ParsedPost } from '../../model/posts';
import MobilePostHeader from '../template/mobile-header-of-article';
import PostInfo from '../template/post-info';
import Gist from './gist';

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
        const styleOfPostInfo = {
            fontSize:`${fontSizeOfPostInfo}px`
        }

        let fontSizeOfGistIndicator = null, fontSizeOfGist;
        if (this.props.post.gist) {
            fontSizeOfGistIndicator = (vw + 1936)/148;
            fontSizeOfGist = (vw + 1640)/148;
        }

        if (this.props.post.thumbnail) {
            const heightOfImg = maxWidthOfTitle * 0.6;
            const styleOfImg = {
                height:`${heightOfImg}px`
            }

            const paddingBottomOfTitleBg = heightOfImg * 0.618;

            let postCtnrElement = null;
            if (this.props.post.gist) {
                const marginTopBottomOfGist = fontSizeOfGistIndicator * 1.5;
                const styleOfPostBg = {
                    paddingTop:heightOfImg * 0.382
                }
                const styleOfGist = {
                    fontSize:`${fontSizeOfGist}px`,
                    margin:`${marginTopBottomOfGist}px 0`
                }
                const styleOfGistTitle = {
                    fontSize:`${fontSizeOfGistIndicator}px`
                }

                postCtnrElement = 
                    <div id="postBg" style={styleOfPostBg} className="tb post">
                        <Gist styleOfContent={styleOfGist} styleOfHint={styleOfGistTitle} content={this.props.post.gist}/>
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
                            styleOfPostInfo={styleOfPostInfo} marginBottomOfLastItem={`${fontSizeOfPostInfo * 1.5}px`} >
                            <img src={post.thumbnail.url} style={styleOfImg} />
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
            if (this.props.post.gist) {
                
                const styleOfGist = {
                    fontSize:`${fontSizeOfGist}px`,
                    margin:`${fontSizeOfGistIndicator * 1.5}px 0`
                }
                const styleOfGistIndicator = {
                    fontSize:`${fontSizeOfGistIndicator}px`
                }
                postHeaderElement = 
                    <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                        title={title} decorationLine={decorationLine} >
                        <PostInfo categories={post.categories} tags={post.tags} date={post.date} modified={post.modified} 
                            styleOfPostInfo={styleOfPostInfo} marginBottomOfLastItem={'0px'} />
                        <Gist styleOfContent={styleOfGist} styleOfHint={styleOfGistIndicator} 
                                    content={this.props.post.gist}/>
                    </MobilePostHeader>
            } else {
                postHeaderElement = 
                    <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                        title={title} decorationLine={decorationLine} >
                        <PostInfo categories={post.categories} tags={post.tags} date={post.date} modified={post.modified} 
                            styleOfPostInfo={styleOfPostInfo} marginBottomOfLastItem={`${fontSizeOfPostInfo * 1.5}px`} />
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