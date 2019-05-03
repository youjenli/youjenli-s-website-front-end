import * as React from 'react';
import { SummaryOfResultsOfSearch } from '../../model/search-results';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import {SearchResultsOfPost} from  './template/search-results-of-post';
import {SearchResultsOfCategory} from './template/search-results-of-category';
import {SearchResultsOfTag} from './template/search-results-of-tags'
import * as icons from '../home/recentPosts/icons';
import DefaultNavbarOnPageOfSearchResults from './template/nav-bar';

interface PropsOfExternalScreenPageOfSearchResults {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    results:SummaryOfResultsOfSearch;
}

export default class ExternalScreenPageOfSearchResults extends React.Component<PropsOfExternalScreenPageOfSearchResults> {
    render() {
        const vw = this.props.viewportWidth;
        const results = this.props.results;
        let maxWidthOfTitle = 1024;
        const title = {
            name:terms.createTitleOfPageOfSearchResults(results.query),
            maxWidth:maxWidthOfTitle,
        };

        let widthOfPostBg = this.props.viewportWidth * 0.382 + 632.832;
        let marginTopOfPostContent = this.props.remFontSize * 1.5;    
        let marginBottomOfPostContent = this.props.remFontSize * 1.5;
        let marginBottomOfPostBg = this.props.remFontSize * 2;/*數值缺規格，待確認 */        
        let paddingLeftRightOfPosgBg = (widthOfPostBg - maxWidthOfTitle) / 2;        
           
        let titleBg = {
            paddingBottom:0
        };
        
        const styleOfPostBg = {
            width:`${widthOfPostBg}px`,
            paddingLeft:`${paddingLeftRightOfPosgBg}px`,
            paddingRight:`${paddingLeftRightOfPosgBg}px`,
            marginBottom:`${marginBottomOfPostBg}px`
        }

        const styleOfPostContent = {
            marginTop:`${marginTopOfPostContent}px`,
            marginBottom:`${marginBottomOfPostContent}px`
        }
        
        const styleOfHeading = {
            fontSize:`${(this.props.viewportWidth + 2560)/112}px`
        }
    
        const styleOfNothingFoundInQuery = {
            fontSize:`${(vw + 7936) / 448}px`
        }
        const heightOfDirectionIcon = (-1 * vw + 10880) / 224;
        const fontSizeOfPageIndexes = (-1 * vw + 13568) / 448;

        let posts = null, navbarOfPosts = null;
        if (this.props.results.posts.numberOfPages > 0) {
            const widthOfPost = (maxWidthOfTitle - 2* this.props.remFontSize) / 2;
            const settingsOfPost = {
                fontSizeOfDate:(vw + 7936) / 448,
                fontSizeOfTitle:(vw + 8832) / 448
            }
            posts = <SearchResultsOfPost results={this.props.results.posts} width={widthOfPost} 
                        numberOfPostInARow={2} post={settingsOfPost} />
            const pageSelectHandler = () => {};//todo        
            navbarOfPosts = 
                <DefaultNavbarOnPageOfSearchResults results={this.props.results.posts} onPageSelect={pageSelectHandler} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
        } else {
            posts = 
                <div className="noData" style={styleOfNothingFoundInQuery}>
                    {terms.generatePostsNotFoundNotificationMsg(this.props.results.query)}</div>;
        }

        const categoryAndTagPerRow = Math.floor((maxWidthOfTitle - 18/*分類名稱左右間隔 1rem */) / 154 /* 分類名稱最小寬度 + 1rem */);      
        const widthOfCategoryAndTag = (maxWidthOfTitle - (categoryAndTagPerRow - 1) * 18) / categoryAndTagPerRow;
        const fontSizeOfName = widthOfCategoryAndTag / 7;
        const fontSizeOfDesc = widthOfCategoryAndTag / 9;

        let categories = null, navbarOfCategories = null;
        if (this.props.results.categories.pageContent.length > 0) {
            categories = <SearchResultsOfCategory results={this.props.results.categories} width={widthOfCategoryAndTag}
                            numberOfCategoriesInARow={categoryAndTagPerRow} fontSizeOfCategoryName={fontSizeOfName}
                            fontSizeOfDesc={fontSizeOfDesc} />
            const pageSelectHandler = () => {};//todo
            navbarOfCategories = 
                <DefaultNavbarOnPageOfSearchResults results={this.props.results.categories} onPageSelect={pageSelectHandler} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes}/>
        } else {
            categories = 
                <div className="noData" style={styleOfNothingFoundInQuery}>
                    {terms.generateCategoriesNotFoundNotificationMsg(this.props.results.query)}</div>;
        }
        
        let tags = null, navbarOfTags = null;
        if(this.props.results.tags.pageContent.length > 0) {
            tags = <SearchResultsOfTag results={this.props.results.tags} width={widthOfCategoryAndTag}
                    numberOfTagsInARow={categoryAndTagPerRow} fontSizeOfTagName={fontSizeOfName}
                    fontSizeOfDesc={fontSizeOfDesc} />
            const pageSelectHandler = () => {};//todo
            navbarOfTags =
                <DefaultNavbarOnPageOfSearchResults results={this.props.results.tags} onPageSelect={pageSelectHandler} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
        } else {
            tags = <div className="noData" style={styleOfNothingFoundInQuery}>
                        {terms.generateTagsNotFoundNotificationMsg(this.props.results.query)}</div>
        }

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <div className="summary">{terms.createSummaryOfSearchResults(results.posts.numberOfResults,
                            results.categories.numberOfResults, results.tags.numberOfResults)}</div>
                </DefaultHeaderOfArticle>
                <div id="postBg" className="es search" style={styleOfPostBg}>
                    <div className="content" style={styleOfPostContent}>
                        <p id="types-and-taxo">{terms.typesOfSearchResult}</p>
                        <p id="introduction">{terms.introductionOfTypesOfSearchResult}</p>
                        <section className="posts">
                            <h3 className="heading" style={styleOfHeading}>
                                <icons.ArticleIcon />{terms.headingOfSearchResultsOfPosts}</h3>
                            {posts}
                            {navbarOfPosts}
                        </section>
                        <section className="categories">
                            <h3 className="heading" style={styleOfHeading}>
                                <icons.CategoryIcon />{terms.headingOfSearchResultsOfCategories}</h3>
                            {categories}
                            {navbarOfCategories}
                        </section>
                        <section className="tags">
                            <h3 className="heading" style={styleOfHeading}>
                                <icons.TagIcon />{terms.headingOfSearchResultsOfTags}</h3>
                            {tags}
                            {navbarOfTags}
                        </section>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}