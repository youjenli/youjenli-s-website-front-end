import * as React from 'react';
import DefaultRecentPostWithoutImg from '../recentPosts/default-recent-post-without-img';
import ExternalScreenRecentPostWithImg from '../recentPosts/es-recent-post-with-img';
import {Post} from '../../../model/post';

interface PropsOfLargeExternalScreenRecentPosts {
    estimatedWidthOfContainer:number;
    baseZIndex:number;
    remFontSize:number;
    posts:Post[];
    marginTopOfPost:number;
}

export default class LargeExternalScreenRecentPosts extends React.Component<PropsOfLargeExternalScreenRecentPosts> {
    render() {
        const widthOfExternalScreenRecentPost = 414;
        const minHeightOfExternalScreenRecentPost = 318;
        const fontSizeOfDateAndTitle = 22;
        const marginLeftRightOfPost = fontSizeOfDateAndTitle * 0.5;  
        const paddingOfRPWithImg = this.props.remFontSize * 0.5;
        let reactElementsOfPosts = this.props.posts.map((post) => {
            if (post.imageUrl) {
                const fontSizeOfPostProps = 16;
                const postProps = {
                    fontSize:fontSizeOfPostProps,
                    marginTop:fontSizeOfPostProps * 0.5
                }
                const title = {
                    name:post.title,
                    marginTopMarginBottom:fontSizeOfDateAndTitle * 0.5,
                    fontSize:fontSizeOfDateAndTitle
                }
                                                        
                return (
                    <ExternalScreenRecentPostWithImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        minHeight={minHeightOfExternalScreenRecentPost} marginTop={this.props.marginTopOfPost} 
                        marginLeftRight={marginLeftRightOfPost} padding={paddingOfRPWithImg} imgUrl={post.imageUrl} 
                        postProps={postProps} date={post.date} categories={post.categories} title={title} />
                );
            } else {
                const fontSizeOfCategoriesAndTags = 14;
                const marginTopLeftRightOfPostInfoBar = this.props.remFontSize * 0.5;
                const marginOfPost = {
                    top:this.props.marginTopOfPost,
                    leftRight:marginLeftRightOfPost
                }
                const postInfoBar = {
                    margin:{
                        top:marginTopLeftRightOfPostInfoBar,
                        right:marginTopLeftRightOfPostInfoBar,
                        left:marginTopLeftRightOfPostInfoBar,
                    },
                    padding:{
                        top:marginTopLeftRightOfPostInfoBar,
                        left:marginTopLeftRightOfPostInfoBar,
                        right:marginTopLeftRightOfPostInfoBar,
                        bottom:fontSizeOfCategoriesAndTags * 0.75
                    },
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
                }

                const fontSizeOfExcerpt = 18;
                const excerpt = {
                    fontSize:fontSizeOfExcerpt,
                    margin:{
                        top:fontSizeOfExcerpt,
                        leftRight:this.props.remFontSize,
                        bottom:this.props.remFontSize * 0.5
                    },
                    zIndexOfReadArticle:this.props.baseZIndex + 1,
                    content:post.excerpt
                };
                return (
                    <DefaultRecentPostWithoutImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        minHeight={minHeightOfExternalScreenRecentPost} margin={marginOfPost} 
                        postInfoBar={postInfoBar} excerpt={excerpt}/>
                );
            }
        });
        
        let estimatedNumberOfPostsInARow = Math.floor(
            (this.props.estimatedWidthOfContainer - 2 * marginLeftRightOfPost) 
                / (widthOfExternalScreenRecentPost + 2 * marginLeftRightOfPost)
        );

        const remainedPostsInTheLastRowOfPosts = this.props.posts.length % estimatedNumberOfPostsInARow;
        let numberOfPlaceHoldingPosts = 0;
        if (remainedPostsInTheLastRowOfPosts > 0) {
            numberOfPlaceHoldingPosts = estimatedNumberOfPostsInARow - remainedPostsInTheLastRowOfPosts;
        }

        const styleOfPlaceHolder = {
            width:`${widthOfExternalScreenRecentPost}px`,
            height:`${minHeightOfExternalScreenRecentPost}px`,
            margin:`${this.props.marginTopOfPost}px ${marginLeftRightOfPost}px 0 ${marginLeftRightOfPost}px`,
            minHeight:`${minHeightOfExternalScreenRecentPost}px`,
            backgroundColor:'transparent'
        };      
        let keysForPlaceHoldingPost = -1;
        for (let i = 0 ; i < numberOfPlaceHoldingPosts ; i++, keysForPlaceHoldingPost --) {
            reactElementsOfPosts.push((<div style={styleOfPlaceHolder} key={keysForPlaceHoldingPost}></div>));
        }

        const styleOfPostCtnr = {
            marginTop:`${-1 * this.props.marginTopOfPost}px`,
            padding:`0 ${marginLeftRightOfPost}px`
        }

        return (
            <div id="post-ctnr" style={styleOfPostCtnr}>
                {reactElementsOfPosts}
            </div>
        );
    }
}