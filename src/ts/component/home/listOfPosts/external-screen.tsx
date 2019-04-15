import * as React from 'react';
import DefaultRecentPostWithoutImg from '../recentPosts/default-without-img';
import ExternalScreenRecentPostWithImg from '../recentPosts/external-screen-with-img';
import {Post} from '../../../model/post';

interface PropsOfListOfRecentPostsOnExternalScreen {
    estimatedWidthOfContainer:number;
    baseZIndex:number;
    remFontSize:number;
    posts:Post[];
    marginTopOfPost:number;
}

export default class ListOfRecentPostsOnExternalScreen extends React.Component<PropsOfListOfRecentPostsOnExternalScreen> {
    render() {
        const widthOfExternalScreenRecentPost = 396;
        const fontSizeOfDateAndTitle = 20;
        const minMarginLeftRightOfPost = fontSizeOfDateAndTitle * 0.5;
        let reactElementsOfPosts = this.props.posts.map((post) => {
            if (post.imageUrl) {
                const fontSizeOfPostProps = 14;                
                const postProps = {
                    fontSize:fontSizeOfPostProps,
                    marginTop:fontSizeOfPostProps * 0.75
                }
                const margin = {
                    top:this.props.marginTopOfPost,
                    leftRight:minMarginLeftRightOfPost,
                    bottom:0
                };
                const paddingOfRPWithImg = this.props.remFontSize * 0.75
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
                        margin={margin} padding={padding} 
                        imgUrl={post.imageUrl} postProps={postProps} date={post.date} categories={post.categories} 
                        title={title}/>
                );
            } else {
                const fontSizeOfCategoriesAndTags = 14;
                const marginTopLeftRightOfPostInfoBar = this.props.remFontSize * 0.75;
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
                        marginBottom:this.props.remFontSize * 0.75
                    },
                    categories:post.categories,
                    tags:post.tags,
                    marginRightOfIconOfCategoriesAndTags:fontSizeOfCategoriesAndTags * 0.5,
                    fontSizeOfCategoriesAndTags:fontSizeOfCategoriesAndTags,
                    marginTopOfTags:fontSizeOfCategoriesAndTags * 0.65
                }          
                const fontSizeOfExcerpt = 16;
                const excerpt = {
                    fontSize:fontSizeOfExcerpt,
                    margin:{
                        top:fontSizeOfExcerpt * 0.75,
                        leftRight:fontSizeOfDateAndTitle,
                        bottom:this.props.remFontSize * 0.75
                    },
                    zIndexOfReadArticle:this.props.baseZIndex + 1,
                    content:post.excerpt
                }                
                return (
                    <DefaultRecentPostWithoutImg key={post.id} width={widthOfExternalScreenRecentPost} 
                        margin={marginOfPost} postInfoBar={postInfoBar} excerpt={excerpt}/>
                );
            }
        });//end of this.props.posts.map
        
        let estimatedNumberOfPostsInARow = Math.floor(
            (this.props.estimatedWidthOfContainer - 2 * minMarginLeftRightOfPost) 
                / (widthOfExternalScreenRecentPost + 2 * minMarginLeftRightOfPost)
        );
        const remainedPostsInTheLastRowOfPosts = this.props.posts.length % estimatedNumberOfPostsInARow;
        let numberOfPlaceHoldingPosts = 0;
        if (remainedPostsInTheLastRowOfPosts > 0) {
            numberOfPlaceHoldingPosts = estimatedNumberOfPostsInARow - remainedPostsInTheLastRowOfPosts;
        }

        const style = {
            width:`${widthOfExternalScreenRecentPost}px`,
            margin:`${this.props.marginTopOfPost}px ${minMarginLeftRightOfPost}px 0 ${minMarginLeftRightOfPost}px`
        };
        let keysForPlaceHoldingPost = -1;
        for (let i = 0 ; i < numberOfPlaceHoldingPosts ; i++, keysForPlaceHoldingPost --) {
            reactElementsOfPosts.push((<div style={style} key={keysForPlaceHoldingPost}></div>));
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