import * as React from 'react';
import DefaultRecentPostWithoutImg from '../recentPosts/default-without-img';
import MobileRecentPostWithImg from '../recentPosts/mobile-default-with-img';
import {MetaDataOfPost} from '../../../model/posts';

interface PropsOfListOf9To16RecentPostsOnSmartPhone {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    posts:MetaDataOfPost[];
}

export default class ListOf9To16RecentPostsOnSmartPhone extends React.Component<PropsOfListOf9To16RecentPostsOnSmartPhone> {
    render() {
        const widthOfRecentPost = this.props.viewportWidth - this.props.remFontSize;
        const marginTopBottomOfPost = this.props.remFontSize * 0.5;
        const marginOfPost =  {
            top:marginTopBottomOfPost,
            leftRight:0,
            bottom:marginTopBottomOfPost
        };
        let postElements = this.props.posts.map((post) => {

            if (post.thumbnail != null) {
                const fontSizeOfDateAndTitle = widthOfRecentPost / 18;
                const marginTopBottomOfTitle = fontSizeOfDateAndTitle * 0.75;
                const marginLeftRightOfTitle = this.props.remFontSize * 0.5;
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
                const paddingOfPost = {
                    top:paddingTopOfPost,
                    leftRight:marginLeftRightOfTitle,
                    bottom:marginLeftRightOfTitle
                };
                const fontSizeOfPostProps = 14;
                const postProps = {
                    fontSize:fontSizeOfPostProps,
                    marginBottom:fontSizeOfPostProps * 0.75
                }
                return (
                    <MobileRecentPostWithImg key={post.id} width={widthOfRecentPost} margin={marginOfPost} padding={paddingOfPost}
                        title={title} postProps={postProps} date={post.date} categories={post.categories} 
                        imgUrl={post.thumbnail.url} urlOfPost={post.url} />
                );
            } else {
                const marginTopRightLeftOfPostInfoBar = this.props.remFontSize * 0.5;
                const fontSizeOfTitleBar = 20;
                const marginBottomOfTitleBar = fontSizeOfTitleBar * 0.75;
                const fontSizeOfCategoriesAndTags = 14;
                const marginTopBottomOfTags = fontSizeOfCategoriesAndTags * 0.7;
                const postInfoBar = {
                    margin:{
                        top:marginTopRightLeftOfPostInfoBar,
                        right:marginTopRightLeftOfPostInfoBar,
                        left:marginTopRightLeftOfPostInfoBar,
                        bottom:0
                    },
                    padding:{
                        top:marginTopRightLeftOfPostInfoBar,
                        left:marginTopRightLeftOfPostInfoBar,
                        right:marginTopRightLeftOfPostInfoBar,
                        bottom:marginTopBottomOfTags
                    },
                    titleBar:{
                        date:post.date,
                        titleName:post.title,
                        fontSizeOfDateAndTitle:fontSizeOfTitleBar,
                        marginRightOfDate:this.props.remFontSize * 0.5,
                        marginBottom:marginBottomOfTitleBar
                    },
                    categories:post.categories,
                    tags:post.tags,
                    marginRightOfIconOfCategoriesAndTags:fontSizeOfCategoriesAndTags,
                    fontSizeOfCategoriesAndTags:fontSizeOfCategoriesAndTags,
                    marginTopOfTags:marginTopBottomOfTags
                }
                const fontSizeOfExcerpt = 16;
                const marginLeftRightBottom = fontSizeOfExcerpt;
                const excerpt = {
                    fontSize:fontSizeOfExcerpt,
                    margin:{
                        top:fontSizeOfExcerpt * 0.5,
                        leftRight:marginLeftRightBottom,
                        bottom:marginLeftRightBottom
                    },        
                    zIndexOfReadArticle:this.props.baseZIndex + 1,
                    content:post.excerpt,
                    urlOfPost:post.url
                };
                
                return (
                    <DefaultRecentPostWithoutImg key={post.id} width={widthOfRecentPost} margin={marginOfPost} 
                        postInfoBar={postInfoBar} excerpt={excerpt} />
                );
            }
        });//end of this.props.posts.map

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