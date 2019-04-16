import * as React from 'react';
import MobileHorizontalRecentPostWithoutImg from '../recentPosts/mobile-horizontal-without-img';
import MobileRecentPostWithImg from '../recentPosts/mobile-default-with-img';
import {Post} from '../../../model/post';

interface PropsOfListOfRecentPostsOnSmartPhone {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    posts:Post[];
}

export default class ListOfRecentPostsOnSmartPhone extends React.Component<PropsOfListOfRecentPostsOnSmartPhone> {
    render() {
        const widthOfRecentPost = this.props.viewportWidth - this.props.remFontSize;
        const marginTopBottomOfPost = this.props.remFontSize * 0.5;
        const marginOfPost =  {
            top:marginTopBottomOfPost,
            leftRight:0,
            bottom:marginTopBottomOfPost
        };
        let postElements = this.props.posts.map((post) => {
            if (post.imageUrl) {
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
                const fontSizeOfPostProps = 16;
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
                const fontSizeOfTitle = this.props.viewportWidth / 18;
                const marginTopBottomOfTitleBar = fontSizeOfTitle * 0.5;
                const fontSizeOfCategoriesAndTags = 16;
                const marginTopBottomOfTags = fontSizeOfCategoriesAndTags * 0.75;

                const postInfoBar = {
                    margin:{
                        top:marginTopRightLeftOfPostInfoBar,
                        right:marginTopRightLeftOfPostInfoBar,
                        left:marginTopRightLeftOfPostInfoBar
                    },
                    padding:{
                        top:marginTopBottomOfTitleBar,
                        left:marginTopRightLeftOfPostInfoBar,//按規格來說 left right 的 padding 與 postInfoBar 的 margin 相同。
                        right:marginTopRightLeftOfPostInfoBar,
                        bottom:marginTopBottomOfTags
                    },
                    title:{
                        titleName:post.title,
                        fontSizeOfDateAndTitle:fontSizeOfTitle,
                        marginBottom:marginTopBottomOfTitleBar
                    },                    
                    categories:post.categories,
                    tags:post.tags,
                    date:post.date,
                    modified:post.modified,
                    marginRightOfIcon:fontSizeOfCategoriesAndTags,
                    fontSizeOfCategoriesTagsAndDate:fontSizeOfCategoriesAndTags,
                    marginTopOfTags:marginTopBottomOfTags
                }
                const fontSizeOfExcerpt = 18;
                const marginTopLeftRightBottom = fontSizeOfExcerpt;
                const excerpt = {
                    fontSize:fontSizeOfExcerpt,
                    margin:{
                        top:marginTopLeftRightBottom,
                        leftRight:marginTopLeftRightBottom,
                        bottom:marginTopLeftRightBottom
                    },        
                    zIndexOfReadArticle:this.props.baseZIndex + 1,
                    content:post.excerpt
                };
                
                return (
                    <MobileHorizontalRecentPostWithoutImg key={post.id} width={widthOfRecentPost} margin={marginOfPost} 
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