import * as React from 'react';
import { ParsedPost } from '../../model/posts';
import MobileHeaderOfArticle from '../template/mobile-header-of-article';
import PostInfo from '../template/post-info';
import Gist from './gist';
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
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };
        const fontSizeOfPostInfo = (vw + 464)/56;
        const styleOfPostInfo = {
            fontSize:`${fontSizeOfPostInfo}px`
        }
        
        let fontSizeOfGistIndicator = null, fontSizeOfGist = null;
        if (this.props.post.gist) {
            fontSizeOfGistIndicator = 16;
            fontSizeOfGist = 14;
        }
                
        let countingResult:Countable.CountingResult = null;
        Countable.count(this.props.post.dom.body.innerHTML, counter => {
            countingResult = counter;
        });

        if (this.props.post.thumbnail) {
            const heightOfImg = maxWidthOfTitle * 0.6;
            const styleOfImg = {
                height:`${heightOfImg}px`
            }

            let postCtnrElement = null;
            if (this.props.post.gist) {
                const marginTopBottomOfGist = fontSizeOfGistIndicator * 1.5;
                
                const styleOfGist = {
                    fontSize:`${fontSizeOfGist}px`,
                    margin:`${marginTopBottomOfGist}px 0`
                }
                const styleOfGistIndicator = {
                    fontSize:`${fontSizeOfGistIndicator}px`
                }

                postCtnrElement = 
                    <div id="postBg" className="sp post">
                        <Gist styleOfContent={styleOfGist} styleOfHint={styleOfGistIndicator} content={this.props.post.gist}/>
                        <div dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}} ></div>
                    </div>;
            } else {
                const styleOfPostBg = {
                    paddingTop:'1.5em'
                }
                postCtnrElement = 
                    <div id="postBg" className="sp post" style={styleOfPostBg} dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}}>
                    </div>;
            }
 
            return (
                <React.Fragment>
                    <MobileHeaderOfArticle baseZIndex={this.props.baseZIndex} title={title} className="sp">
                        <img src={post.thumbnail.url} style={styleOfImg}/>
                        <PostInfo categories={post.categories} tags={post.tags} styleOfPostInfo={styleOfPostInfo}
                            date={post.date} modified={post.modified} wordCount={countingResult.characters} />
                        </MobileHeaderOfArticle>
                    {postCtnrElement}                        
                </React.Fragment>
            );
        } else {
            const decoration = {
                height:fontSizeOfTitle / 3
            }
            const styleOfPostBg = {
                paddingTop:'1.5em'
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
                    <MobileHeaderOfArticle baseZIndex={this.props.baseZIndex} className="sp"
                        title={title} decorationLine={decoration}>
                            <PostInfo categories={post.categories} tags={post.tags} styleOfPostInfo={styleOfPostInfo}
                                date={post.date} modified={post.modified} wordCount={countingResult.characters} >
                                <Gist styleOfContent={styleOfGist} styleOfHint={styleOfGistIndicator} 
                                        content={this.props.post.gist}/>
                            </PostInfo>
                    </MobileHeaderOfArticle>;
            } else {

                postHeaderElement = 
                <MobileHeaderOfArticle baseZIndex={this.props.baseZIndex} className="sp"
                    title={title} decorationLine={decoration}>
                        <PostInfo categories={post.categories} tags={post.tags} date={post.date} modified={post.modified} 
                            wordCount={countingResult.characters}  styleOfPostInfo={styleOfPostInfo} 
                            marginBottomOfLastItem={`${fontSizeOfPostInfo * 1.5}px`}/>
                </MobileHeaderOfArticle>;
            }

            return (
                <React.Fragment>
                    {postHeaderElement}
                    <div id="postBg" style={styleOfPostBg} className="sp post" dangerouslySetInnerHTML={{__html:this.props.post.dom.body.innerHTML}}>
                    </div>
                </React.Fragment>
            );
        }
    }
}