import * as React from 'react';
import DefaultRecentPostWithoutImg from '../recentPosts/default-without-img';
import MobileRecentPostWithImg from '../recentPosts/mobile-default-with-img';
import {MetaDataOfPost} from '../../../model/posts';
import { addRegistryOfPostOrPage } from '../../post-page-routeWrapper';
import { TypesOfContent } from '../../../model/types-of-content';

interface PropsOfListOfRecentPostsOnTablet {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    posts:MetaDataOfPost[];
}

export default class ListOfRecentPostsOnTablet extends React.Component<PropsOfListOfRecentPostsOnTablet> {
    render() {
        const widthOfRecentPost = (this.props.viewportWidth - 3 * this.props.remFontSize) / 2;
        const marginTopBottomOfPost = this.props.remFontSize * 0.5;
        const marginOfPost =  {
            top:marginTopBottomOfPost,
            leftRight:0,
            bottom:marginTopBottomOfPost
        };
        let postElements = this.props.posts.map((post) => {

            //要記得在 index.tsx 的紀錄中註冊此發文頁，這樣它才有辦法在接到請求的時候委派合適的模組取得並呈現對應內容
            addRegistryOfPostOrPage(post.slug, TypesOfContent.Post);

            if (post.thumbnail != null) {
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
                        imgUrl={post.thumbnail.url} urlOfPost={post.url}/>
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
                    content:post.excerpt,
                    urlOfPost:post.url
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