import * as React from 'react';
import ExternalScreenRecentPostWithoutImg from './es-recent-post-without-img';
import ExternalScreenRecentPostWithImg from './es-recent-post-with-img';
import {Post} from '../../model/post';

interface PropsOfExternalScreenRecentPosts {
    viewportWidth:number;
    remFontSize:number;
    posts:Post[];
    baseZIndex:number;
}

export default class ExternalScreenRecentPosts extends React.Component<PropsOfExternalScreenRecentPosts> {
    render() {
        let reactElementsOfPosts = null;
        if (this.props.viewportWidth > 1440) {
            const width = 414;
            const minHeight = 318;
            reactElementsOfPosts = this.props.posts.map((post) => {
                if (post.imageUrl) {
                    const padding = this.props.remFontSize * 0.5;
                    const fontSizeOfPostProps = 16;
                    const marginTopOfPostProps = fontSizeOfPostProps * 0.5;
                    const postProps = {
                        fontSize:fontSizeOfPostProps,
                        marginTop:marginTopOfPostProps
                    }

                    const fontSizeOfTitle = 22;
                    const title = {
                        name:post.title,
                        marginTopMarginBottom:fontSizeOfTitle * 0.5,
                        fontSize:fontSizeOfTitle
                    }
                                                            
                    return (
                        <ExternalScreenRecentPostWithImg width={width} minHeight={minHeight} padding={padding} imgUrl={post.imageUrl}
                            postProps={postProps} date={post.date} categories={post.categories} title={title} />
                    );
                } else {
                    const fontSizeOfDateAndTitle = 22;
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
                        <ExternalScreenRecentPostWithoutImg width={width} minHeight={minHeight}
                            postInfoBar={postInfoBar} excerpt={excerpt}/>
                    );
                }
            });
        } else {
            const width = 396;
            const minHeight = 306;
            const padding = this.props.remFontSize * 0.75;
            reactElementsOfPosts = this.props.posts.map((post) => {
                if (post.imageUrl) {
                    const fontSizeOfPostProps = 14;                
                    const postProps = {
                        fontSize:fontSizeOfPostProps,
                        marginTop:fontSizeOfPostProps * 0.75
                    }
                    
                    const fontSizeOfTitle = 20;
                    const title = {
                        name:post.title,
                        marginTopMarginBottom:fontSizeOfTitle * 0.5,
                        fontSize:fontSizeOfTitle
                    };
                    return (
                        <ExternalScreenRecentPostWithImg width={width} minHeight={minHeight} padding={padding}
                            imgUrl={post.imageUrl} postProps={postProps} date={post.date}
                            categories={post.categories} title={title}/>
                    );  
                } else {
                    const fontSizeOfDateAndTitle = 20;
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
                        <ExternalScreenRecentPostWithoutImg width={width} minHeight={minHeight}
                            postInfoBar={postInfoBar} excerpt={excerpt}/>
                    );
                }
            });//end of this.props.posts.map
        }
        return (
            <React.Fragment>
                {reactElementsOfPosts}
            </React.Fragment>
        );
    }
}