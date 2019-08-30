import * as React from 'react';
import DefaultRecentPostWithoutImg from '../recentPosts/default-without-img';
import ExternalScreenRecentPostWithImg from '../recentPosts/external-screen-with-img';
import {MetaDataOfPost} from '../../../model/posts';

interface PropsOfListOfRecentPostsOnLargeExternalScreen {
    estimatedWidthOfContainer:number;
    baseZIndex:number;
    remFontSize:number;
    posts:MetaDataOfPost[];
    marginTopOfPost:number;
}

export default class ListOfRecentPostsOnLargeExternalScreen extends React.Component<PropsOfListOfRecentPostsOnLargeExternalScreen> {
    render() {
        const widthOfExternalScreenRecentPost = 414;
        const fontSizeOfDateAndTitle = 22;
        const minMarginLeftRightOfPost = fontSizeOfDateAndTitle * 0.5;
        let reactElementsOfPosts = this.props.posts.map((post) => {

            if (post.thumbnail != null) {
                const fontSizeOfPostProps = 16;
                const postProps = {
                    fontSize:fontSizeOfPostProps,
                    marginTop:fontSizeOfPostProps * 0.5
                }
                const margin = {
                    top:this.props.marginTopOfPost,
                    leftRight:minMarginLeftRightOfPost,
                    bottom:0
                };
                const paddingOfRPWithImg = this.props.remFontSize * 0.75;
                const padding = {
                    top:paddingOfRPWithImg,
                    leftRight:paddingOfRPWithImg
                }
                const marginTopBottomOfTitle = fontSizeOfDateAndTitle * 0.5;
                const title = {
                    name:post.title,
                    margin:{
                        top:marginTopBottomOfTitle,
                        bottom:marginTopBottomOfTitle
                    },                    
                    fontSize:fontSizeOfDateAndTitle
                }
                return (
                    <ExternalScreenRecentPostWithImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        margin={margin} padding={padding} imgUrl={post.thumbnail.url} postProps={postProps} 
                        date={post.date} categories={post.categories} title={title} urlOfPost={post.url} />
                );
            } else {
                const fontSizeOfCategoriesAndTags = 14;
                const marginTopLeftRightOfPostInfoBar = this.props.remFontSize * 0.5;
                const marginOfPost = {
                    top:this.props.marginTopOfPost,
                    leftRight:minMarginLeftRightOfPost,
                    bottom:0
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
                    content:post.excerpt,
                    urlOfPost:post.url
                };
                return (
                    <DefaultRecentPostWithoutImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        margin={marginOfPost} postInfoBar={postInfoBar} excerpt={excerpt}/>
                );
            }
        });
        
        let estimatedNumberOfPostsInARow = Math.floor(
            (this.props.estimatedWidthOfContainer - 2 * minMarginLeftRightOfPost) 
                / (widthOfExternalScreenRecentPost + 2 * minMarginLeftRightOfPost)
        );

        const remainedPostsInTheLastRowOfPosts = this.props.posts.length % estimatedNumberOfPostsInARow;
        let numberOfPlaceHoldingPosts = 0;
        if (remainedPostsInTheLastRowOfPosts > 0) {
            numberOfPlaceHoldingPosts = estimatedNumberOfPostsInARow - remainedPostsInTheLastRowOfPosts;
        }

        const styleOfPlaceHolder = {
            width:`${widthOfExternalScreenRecentPost}px`,
            margin:`${this.props.marginTopOfPost}px ${minMarginLeftRightOfPost}px 0 ${minMarginLeftRightOfPost}px`
        };      
        let keysForPlaceHoldingPost = -1;
        for (let i = 0 ; i < numberOfPlaceHoldingPosts ; i++, keysForPlaceHoldingPost --) {
            reactElementsOfPosts.push((<div style={styleOfPlaceHolder} key={keysForPlaceHoldingPost}></div>));
        }

        const styleOfPostCtnr = {
            marginTop:`${-1 * this.props.marginTopOfPost}px`,
            padding:`0 ${minMarginLeftRightOfPost}px`
        }

        return (
            <div id="post-ctnr" style={styleOfPostCtnr}>
                {reactElementsOfPosts}
            </div>
        );
    }
}