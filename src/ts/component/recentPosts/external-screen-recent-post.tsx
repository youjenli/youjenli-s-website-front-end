import * as React from 'react';
import ExternalScreenRecentPostWithoutImg from './es-recent-post-without-img';
import ExternalScreenRecentPostWithImg from './es-recent-post-with-img';
import {Post} from '../../model/post';

interface PropsOfExternalScreenRecentPosts {
    baseZIndex:number;
    remFontSize:number;
    numberOfPostsInARow:number;
    posts:Post[];
}

export const widthOfExternalScreenRecentPost = 396;
export const minHeightOfExternalScreenRecentPost = 306;
const fontSizeOfDateAndTitle = 20;
const marginTopOfPost = fontSizeOfDateAndTitle;
export const marginLeftRightOfPost = fontSizeOfDateAndTitle * 0.5;
export default class ExternalScreenRecentPosts extends React.Component<PropsOfExternalScreenRecentPosts> {
    render() {
        let reactElementsOfPosts = this.props.posts.map((post) => {
            if (post.imageUrl) {
                const padding = this.props.remFontSize * 0.75;
                const fontSizeOfPostProps = 14;                
                const postProps = {
                    fontSize:fontSizeOfPostProps,
                    marginTop:fontSizeOfPostProps * 0.75
                }
                
                const title = {
                    name:post.title,
                    marginTopMarginBottom:fontSizeOfDateAndTitle * 0.5,
                    fontSize:fontSizeOfDateAndTitle
                };
                return (
                    <ExternalScreenRecentPostWithImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        minHeight={minHeightOfExternalScreenRecentPost} padding={padding} 
                        marginTop={marginTopOfPost} marginLeftRight={marginLeftRightOfPost} 
                        imgUrl={post.imageUrl} postProps={postProps} date={post.date} categories={post.categories} 
                        title={title}/>
                );
            } else {
                const fontSizeOfCategoriesAndTags = 14;
                const postInfoBar = {
                    marginTopRightLeft:this.props.remFontSize * 0.75,
                    paddingTopRightLeft:this.props.remFontSize * 0.75,
                    paddingBottom:fontSizeOfCategoriesAndTags * 0.75,
                    titleBar:{
                        date:post.date,
                        titleName:post.title,
                        fontSizeOfDateAndTitle:fontSizeOfDateAndTitle,           
                        marginRightOfDate:fontSizeOfDateAndTitle * 0.5,
                        marginBottom:this.props.remFontSize * 0.75
                    },
                    categories:post.categories,
                    tags:post.tags,
                    marginRightOfIconOfCategoriesAndTags:fontSizeOfCategoriesAndTags * 0.5,
                    fontSizeOfCategoriesAndTags:fontSizeOfCategoriesAndTags,
                    marginTopOfTags:fontSizeOfCategoriesAndTags * 0.65
                };
                
                const fontSizeOfExcerpt = 16;
                const excerpt = {
                    fontSize:fontSizeOfExcerpt,
                    marginTop:fontSizeOfExcerpt * 0.75,
                    leftRightMargin:fontSizeOfDateAndTitle,
                    bottomMargin:this.props.remFontSize * 0.75,
                    zIndexOfReadArticle:this.props.baseZIndex + 1,
                    content:post.excerpt
                }                  
                return (
                    <ExternalScreenRecentPostWithoutImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        minHeight={minHeightOfExternalScreenRecentPost} marginTop={marginTopOfPost} 
                        marginLeftRight={marginLeftRightOfPost} postInfoBar={postInfoBar} excerpt={excerpt}/>
                );
            }
        });//end of this.props.posts.map
        
        const remainedPostsInTheLastRowOfPosts = this.props.posts.length % this.props.numberOfPostsInARow;
        let numberOfPlaceHoldingPosts = 0;
        if (remainedPostsInTheLastRowOfPosts > 0) {
            numberOfPlaceHoldingPosts = this.props.numberOfPostsInARow - remainedPostsInTheLastRowOfPosts;
        }
        let keysForPlaceHoldingPost = -1;
        for (let i = 0 ; i < numberOfPlaceHoldingPosts ; i++, keysForPlaceHoldingPost --) {
            reactElementsOfPosts.push(<PlaceHoldingExternalScreenRecentPosts key={keysForPlaceHoldingPost}/>);
        }
        const styleOfPostCtnr = {
            marginTop:`${-1 * marginTopOfPost}px`,
            padding:`0 ${marginLeftRightOfPost}px`
        }

        return (
            <div id="post-ctnr" style={styleOfPostCtnr}>
                {reactElementsOfPosts}
            </div>
        );
    }
}

export class PlaceHoldingExternalScreenRecentPosts extends React.Component {
    render() {
        const style = {
            width:`${widthOfExternalScreenRecentPost}px`,
            height:`${minHeightOfExternalScreenRecentPost}px`,
            margin:`${marginTopOfPost}px ${marginLeftRightOfPost}px 0 ${marginLeftRightOfPost}px`,
            minHeight:`${minHeightOfExternalScreenRecentPost}px`,
            backgroundColor:'transparent'
        };
        return (
            <div style={style}></div>
        );
    }
}