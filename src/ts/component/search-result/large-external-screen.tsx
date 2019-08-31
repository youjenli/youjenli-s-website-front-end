import * as React from 'react';
import { ResultOfSearch } from '../../model/search-results';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import {PublicationsAmongSearchResult} from  './template/publications-among-search-result';
import {SearchResultsOfCategory} from './template/categories-among-search-result';
import {SearchResultsOfTag} from './template/tags-among-search-result';
import * as icons from '../template/icons';
import {DefaultRouteBasedNavbar } from './template/route-based-nav-bar';
import {LinksOfPagination} from './template/route-based-pagination';
import {PageClickedHandler} from './routeHandler';
import { HandlersOfPagination } from './template/handler-based-pagination';
import { DefaultHandlerBasedNavbar } from './template/handler-based-nav-bar';

interface PropsOfLargeExternalScreenPageOfSearchResults {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    results:ResultOfSearch;
    onPageOfFoundCategoriesChanged:PageClickedHandler;
    onPageOfFoundTagsChanged:PageClickedHandler;
}

export default class LargeExternalScreenPageOfSearchResults extends React.Component<PropsOfLargeExternalScreenPageOfSearchResults> {
    render() {
        const vw = this.props.viewportWidth;
        const results = this.props.results;
        const maxWidthOfTitle = (this.props.viewportWidth >= 1657 ? this.props.viewportWidth * 0.618 : 1024 );
        const fontSizeOfTitle = maxWidthOfTitle / 22.8;
        
        const title = {
            name:terms.createTitleOfPageOfSearchResults(results.query),
            maxWidth:maxWidthOfTitle,
            fontSize:fontSizeOfTitle
        };
        
        const widthOfPostBg = 0.764 * this.props.viewportWidth;
        const marginTopOfPostContent = this.props.remFontSize * 2;
        const marginBottomOfPostContent = this.props.remFontSize * 2;
        const paddingLeftRightOfPostBg = (widthOfPostBg - maxWidthOfTitle) / 2;        
        const marginBottomOfPostBg = this.props.remFontSize * 2;       

        let titleBg = {
            paddingBottom:0
        };
        const styleOfPostBg = {
            width:`${widthOfPostBg}px`,
            paddingLeft:`${paddingLeftRightOfPostBg}px`,
            paddingRight:`${paddingLeftRightOfPostBg}px`,
            marginBottom:`${marginBottomOfPostBg}px`
        }

        const styleOfPostContent = {
            marginTop:`${marginTopOfPostContent}px`,
            marginBottom:`${marginBottomOfPostContent}px`
        }
        
        const styleOfHeading = {
            fontSize:`${(vw + 2560) /112}px`
        }
        let styleOfNothingFoundInQuery = {
            fontSize:`${(vw + 7936) / 448}px`
        }
        const heightOfDirectionIcon = (-1 * vw + 10880) / 224;
        const fontSizeOfPageIndexes = (-1 * vw + 13568) / 448;

        let posts = null, navbarOfPosts = null;
        if (this.props.results.publications.pageContent === null) {
            posts = <div className="noData">{terms.didnotSuccessfullyObtainThisPartOfResult}</div>;
        } else if (this.props.results.publications.pageContent.length > 0) {
            const widthOfPost = (maxWidthOfTitle - 2* this.props.remFontSize) / 2;
            const settingsOfPost = {
                fontSizeOfDate:(vw + 7936) / 448,
                fontSizeOfTitle:(vw + 8832) / 448
            }
            posts = <PublicationsAmongSearchResult pageContent={this.props.results.publications.pageContent} width={widthOfPost} 
                        numberOfPostInARow={2} post={settingsOfPost} />
            navbarOfPosts = 
                <DefaultRouteBasedNavbar currentPage={this.props.results.publications.pagination.currentPage} 
                    totalPages={this.props.results.publications.pagination.totalPages} baseUrl={this.props.results.publications.pagination.baseUrl}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} >
                        <LinksOfPagination pagination={this.props.results.publications.pagination} />
                </DefaultRouteBasedNavbar>
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
        if (this.props.results.categories.pageContent === null) {
            categories = <div className="noData">{terms.didnotSuccessfullyObtainThisPartOfResult}</div>;
        } else if (this.props.results.categories.pageContent.length > 0) {
            categories = <SearchResultsOfCategory results={this.props.results.categories} width={widthOfCategoryAndTag}
                            numberOfCategoriesInARow={categoryAndTagPerRow} fontSizeOfCategoryName={fontSizeOfName}
                            fontSizeOfDesc={fontSizeOfDesc} />
            navbarOfCategories = 
                <DefaultHandlerBasedNavbar currentPage={this.props.results.categories.pagination.currentPage} 
                    totalPages={this.props.results.categories.pagination.totalPages}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes}
                    onPageClicked={this.props.onPageOfFoundCategoriesChanged} >
                        <HandlersOfPagination pagination={this.props.results.categories.pagination} 
                            onPageClicked={this.props.onPageOfFoundCategoriesChanged} />
                </DefaultHandlerBasedNavbar>
        } else {
            categories = 
                <div className="noData" style={styleOfNothingFoundInQuery}>
                    {terms.generateCategoriesNotFoundNotificationMsg(this.props.results.query)}</div>;
        }
        
        let tags = null, navbarOfTags = null;
        if (this.props.results.tags.pageContent === null) {
            tags = <div className="noData">{terms.didnotSuccessfullyObtainThisPartOfResult}</div>;
        } else if (this.props.results.tags.pageContent.length > 0) {
            tags = <SearchResultsOfTag results={this.props.results.tags} width={widthOfCategoryAndTag}
                    numberOfTagsInARow={categoryAndTagPerRow} fontSizeOfTagName={fontSizeOfName}
                    fontSizeOfDesc={fontSizeOfDesc} />
            navbarOfTags =
                <DefaultHandlerBasedNavbar currentPage={this.props.results.tags.pagination.currentPage} 
                    totalPages={this.props.results.tags.pagination.totalPages} onPageClicked={this.props.onPageOfFoundTagsChanged}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} >
                        <HandlersOfPagination pagination={this.props.results.tags.pagination}
                            onPageClicked={this.props.onPageOfFoundTagsChanged} />
                </DefaultHandlerBasedNavbar>
        } else {
            tags = <div className="noData" style={styleOfNothingFoundInQuery}>
                        {terms.generateTagsNotFoundNotificationMsg(this.props.results.query)}</div>
        }

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <div className="summary">{terms.createSummaryOfSearchResults(results.publications.numberOfResults,
                            results.categories.numberOfResults, results.tags.numberOfResults)}</div>
                </DefaultHeaderOfArticle>
                <div id="postBg" className="les search" style={styleOfPostBg}>
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