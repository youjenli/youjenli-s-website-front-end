import * as React from 'react';
import ExternalScreenRecentPostWithoutImg from './es-recent-post-without-img';
import ExternalScreenRecentPostWithImg from './es-recent-post-with-img';
import {Post} from '../../model/post';

interface PropsOfLargeExternalScreenRecentPosts {
    baseZIndex:number;
    remFontSize:number;
    numberOfPostsInARow:number;
    posts:Post[];
}

export const widthOfExternalScreenRecentPost = 414;
export const minHeightOfExternalScreenRecentPost = 318;
const fontSizeOfDateAndTitle = 22;
const marginTopOfPost = fontSizeOfDateAndTitle;
export const marginLeftRightOfPost = fontSizeOfDateAndTitle * 0.5;
export class LargeExternalScreenRecentPosts extends React.Component<PropsOfLargeExternalScreenRecentPosts> {
    render() {
        let reactElementsOfPosts = this.props.posts.map((post) => {
            if (post.imageUrl) {
                const padding = this.props.remFontSize * 0.5;
                const fontSizeOfPostProps = 16;
                const marginTopOfPostProps = fontSizeOfPostProps * 0.5;
                const postProps = {
                    fontSize:fontSizeOfPostProps,
                    marginTop:marginTopOfPostProps
                }
                const title = {
                    name:post.title,
                    marginTopMarginBottom:fontSizeOfDateAndTitle * 0.5,
                    fontSize:fontSizeOfDateAndTitle
                }
                                                        
                return (
                    <ExternalScreenRecentPostWithImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        minHeight={minHeightOfExternalScreenRecentPost} marginTop={marginTopOfPost} 
                        marginLeftRight={marginLeftRightOfPost} padding={padding} imgUrl={post.imageUrl} 
                        postProps={postProps} date={post.date} categories={post.categories} title={title} />
                );
            } else {
                const fontSizeOfCategoriesAndTags = 14;
                const postInfoBar = {
                    marginTopRightLeft:this.props.remFontSize * 0.5,
                    paddingTopRightLeft:this.props.remFontSize * 0.5,
                    paddingBottom:fontSizeOfCategoriesAndTags * 0.75,
                    titleBar:{
                        date:post.date,
                        titleName:post.title,
                        fontSizeOfDateAndTitle:fontSizeOfDateAndTitle,           
                        marginRightOfDate:fontSizeOfDateAndTitle * 0.5,            
                        marginBottom:fontSizeOfDateAndTitle * 0.5
                    },
                    categories:post.categories,
                    tags:post.tags,
                    marginRightOfIconOfCategoriesAndTags:fontSizeOfCategoriesAndTags,
                    fontSizeOfCategoriesAndTags:fontSizeOfCategoriesAndTags,
                    marginTopOfTags:fontSizeOfCategoriesAndTags * 0.75
                };
                const fontSizeOfExcerpt = 18;
                const excerpt = {
                    fontSize:fontSizeOfExcerpt,
                    leftRightMargin:this.props.remFontSize,
                    bottomMargin:this.props.remFontSize * 0.5,
                    zIndexOfReadArticle:this.props.baseZIndex + 1,
                    content:post.excerpt
                };
                return (
                    <ExternalScreenRecentPostWithoutImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        minHeight={minHeightOfExternalScreenRecentPost} marginTop={marginTopOfPost}
                        marginLeftRight={marginLeftRightOfPost} postInfoBar={postInfoBar} excerpt={excerpt}/>
                );
            }
        });
        const remainedPostsInTheLastRowOfPosts = this.props.posts.length % this.props.numberOfPostsInARow;
        let numberOfPlaceHoldingPosts = 0;
        if (remainedPostsInTheLastRowOfPosts > 0) {
            numberOfPlaceHoldingPosts = this.props.numberOfPostsInARow - remainedPostsInTheLastRowOfPosts;
        }
        let keysForPlaceHoldingPost = -1;
        for (let i = 0 ; i < numberOfPlaceHoldingPosts ; i++, keysForPlaceHoldingPost --) {
            reactElementsOfPosts.push(<PlaceHoldingLargeExternalScreenRecentPosts key={keysForPlaceHoldingPost}/>);
        }
        const styleOfRecentPostContainer = {
            padding:`0 ${marginLeftRightOfPost}px`,
            marginTop:`${-1 * marginTopOfPost}px`
        };
        return (
            <div id="rp-ctnr" style={styleOfRecentPostContainer}>{reactElementsOfPosts}</div>
        )
    }
}

export class PlaceHoldingLargeExternalScreenRecentPosts extends React.Component {
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