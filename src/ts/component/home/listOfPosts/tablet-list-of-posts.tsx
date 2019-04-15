import * as React from 'react';
import DefaultRecentPostWithoutImg from '../recentPosts/default-recent-post-without-img';
import MobileRecentPostWithImg from '../recentPosts/default-mobile-recent-post-with-img';
import {Post} from '../../../model/post';

interface PropsTabletRecentPosts {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    posts:Post[];
}

export default class TabletRecentPosts extends React.Component<PropsTabletRecentPosts> {
    render() {
        const widthOfRecentPost = (this.props.viewportWidth - 3 * this.props.remFontSize) / 2;
        const marginTopBottomOfPost = this.props.remFontSize * 0.5;
        const marginOfPost =  {
            top:marginTopBottomOfPost,
            leftRight:0,
            bottom:marginTopBottomOfPost
        };
        let postElements = this.props.posts.map((post) => {
            if (post.imageUrl) {
                const fontSizeOfDateAndTitle = (this.props.viewportWidth + 512) / 64;
                const marginTopBottomOfTitle = fontSizeOfDateAndTitle * 0.75;
                const paddingTopOfPost = marginTopBottomOfTitle;
                const title = {
                    name:post.title,
                    margin:{
                        top:0,
                        leftRight:0,
                        bottom:marginTopBottomOfTitle
                    },
                    fontSize:fontSizeOfDateAndTitle
                }
                const paddingLeftRightBottomOfPost = this.props.remFontSize * 0.5;
                const paddingOfPost = {
                    top:paddingTopOfPost,
                    leftRight:paddingLeftRightBottomOfPost,
                    bottom:paddingLeftRightBottomOfPost
                };
                const fontSizeOfPostProps = (this.props.viewportWidth + 704) / 96;
                const postProps = {
                    fontSize:fontSizeOfPostProps,
                    marginBottom:fontSizeOfPostProps * 0.75
                }
                return (
                    <MobileRecentPostWithImg key={post.id} width={widthOfRecentPost} margin={marginOfPost} padding={paddingOfPost}
                        title={title} postProps={postProps} date={post.date} categories={post.categories} 
                        imgUrl={post.imageUrl} />
                );
            } else {
                const marginTopRightLeftOfPostInfoBar = this.props.remFontSize * 0.5;
                const fontSizeOfTitle = (this.props.viewportWidth + 224) /48;
                const marginTopBottomOfTitleBar = fontSizeOfTitle * 0.75;
                const fontSizeOfCategoriesAndTags = (this.props.viewportWidth + 704) /96;
                const marginTopBottomOfTags = fontSizeOfCategoriesAndTags * 0.7;
                const postInfoBar = {
                    margin:{
                        top:marginTopRightLeftOfPostInfoBar,
                        right:marginTopRightLeftOfPostInfoBar,
                        left:marginTopRightLeftOfPostInfoBar,
                        bottom:0
                    },
                    padding:{
                        top:marginTopBottomOfTitleBar,
                        left:marginTopRightLeftOfPostInfoBar,
                        right:marginTopRightLeftOfPostInfoBar,
                        bottom:marginTopBottomOfTags
                    },
                    titleBar:{
                        date:post.date,
                        titleName:post.title,
                        fontSizeOfDateAndTitle:fontSizeOfTitle,
                        marginRightOfDate:fontSizeOfTitle * 0.5,
                        marginBottom:marginTopBottomOfTitleBar
                    },
                    categories:post.categories,
                    tags:post.tags,
                    marginRightOfIconOfCategoriesAndTags:fontSizeOfCategoriesAndTags,
                    fontSizeOfCategoriesAndTags:fontSizeOfCategoriesAndTags,
                    marginTopOfTags:marginTopBottomOfTags
                }
                const fontSizeOfExcerpt = (this.props.viewportWidth + 2432)/192;
                const marginLeftRightBottom = this.props.remFontSize * 0.5;
                const excerpt = {
                    fontSize:fontSizeOfExcerpt,
                    margin:{
                        top:fontSizeOfExcerpt * 0.5,
                        leftRight:marginLeftRightBottom,
                        bottom:marginLeftRightBottom
                    },        
                    zIndexOfReadArticle:this.props.baseZIndex + 1,
                    content:post.excerpt
                };
                
                return (
                    <DefaultRecentPostWithoutImg key={post.id} width={widthOfRecentPost} margin={marginOfPost} 
                        postInfoBar={postInfoBar} excerpt={excerpt} />
                ); 
            }
        });//end of this.props.posts.map
        
        const styleOfPlhdr = {
            width:`${widthOfRecentPost}px`,
            margin:`${marginOfPost.top}px ${marginOfPost.leftRight}px ${marginOfPost.bottom}px ${marginOfPost.leftRight}px`
        };
        if (postElements.length % 2 == 1) {
            postElements.push(<div key={-1} style={styleOfPlhdr}></div>);
        }

        const styleOfPostCtnr = {
            padding:`${marginTopBottomOfPost}px 0`
        }

        return (
            <div id="post-ctnr" style={styleOfPostCtnr}>
                {postElements}
            </div>
        );
    }
}