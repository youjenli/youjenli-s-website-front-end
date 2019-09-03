import * as React from 'react';
import { ResultOfSearch } from '../../model/search-results';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import {PublicationsAmongSearchResult} from  './template/publications-among-search-result';
import {TheCategoriesAmongSearchResult} from './template/categories-among-search-result';
import {TheTagsAmongSearchResult} from './template/tags-among-search-result'
import * as icons from '../template/icons';
import {DefaultRouteBasedNavbar } from './template/route-based-nav-bar';
import {LinksOfPagination} from './template/route-based-pagination';
import {PageClickedHandler} from './routeHandler';
import { HandlersOfPagination } from './template/handler-based-pagination';
import { DefaultHandlerBasedNavbar } from './template/handler-based-nav-bar';

interface PropsOfExternalScreenPageOfSearchResults {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    result:ResultOfSearch;
    onPageOfFoundCategoriesChanged:PageClickedHandler;
    onPageOfFoundTagsChanged:PageClickedHandler;
}

export default class ExternalScreenPageOfSearchResults extends React.Component<PropsOfExternalScreenPageOfSearchResults> {
    render() {
        const vw = this.props.viewportWidth;
        let maxWidthOfTitle = 1024;
        const title = {
            name:terms.createTitleOfPageOfSearchResults(this.props.result.query),
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
        if (this.props.result.publications.pageContent === null) {
            posts = <div className="noData">{terms.didnotSuccessfullyObtainThisPartOfResult}</div>;
        } else if (this.props.result.publications.pageContent.length > 0) {
            const widthOfPost = (maxWidthOfTitle - 2* this.props.remFontSize) / 2;
            const settingsOfPost = {
                fontSizeOfDate:(vw + 7936) / 448,
                fontSizeOfTitle:(vw + 8832) / 448
            }
            posts = <PublicationsAmongSearchResult pageContent={this.props.result.publications.pageContent} width={widthOfPost} 
                        numberOfPostInARow={2} post={settingsOfPost} />
            navbarOfPosts = 
                <DefaultRouteBasedNavbar currentPage={this.props.result.publications.pagination.currentPage} 
                    totalPages={this.props.result.publications.pagination.totalPages} baseUrl={this.props.result.publications.pagination.baseUrl}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} >
                        <LinksOfPagination pagination={this.props.result.publications.pagination} />
                </DefaultRouteBasedNavbar>
        } else {
            posts = 
                <div className="noData" style={styleOfNothingFoundInQuery}>
                    {terms.generatePostsNotFoundNotificationMsg(this.props.result.query)}</div>;
        }

        const categoryAndTagPerRow = Math.floor((maxWidthOfTitle - 18/*分類名稱左右間隔 1rem */) / 154 /* 分類名稱最小寬度 + 1rem */);      
        const widthOfCategoryAndTag = (maxWidthOfTitle - (categoryAndTagPerRow - 1) * 18) / categoryAndTagPerRow;
        const fontSizeOfName = widthOfCategoryAndTag / 7;
        const fontSizeOfDesc = widthOfCategoryAndTag / 9;

        let categories = null, navbarOfCategories = null;
        if (this.props.result.categories.pageContent === null) {
            categories = <div className="noData">{terms.didnotSuccessfullyObtainThisPartOfResult}</div>;
        } else if (this.props.result.categories.pageContent.length > 0) {
            categories = <TheCategoriesAmongSearchResult result={this.props.result.categories.pageContent} width={widthOfCategoryAndTag}
                            numberOfCategoriesPerRow={categoryAndTagPerRow} fontSizeOfCategoryName={fontSizeOfName}
                            fontSizeOfDesc={fontSizeOfDesc} />
            navbarOfCategories = 
                <DefaultHandlerBasedNavbar currentPage={this.props.result.categories.pagination.currentPage} 
                    totalPages={this.props.result.categories.pagination.totalPages}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes}
                    onPageClicked={this.props.onPageOfFoundCategoriesChanged} >
                        <HandlersOfPagination pagination={this.props.result.categories.pagination} 
                            onPageClicked={this.props.onPageOfFoundCategoriesChanged} />
                </DefaultHandlerBasedNavbar>
        } else {
            categories = 
                <div className="noData" style={styleOfNothingFoundInQuery}>
                    {terms.generateCategoriesNotFoundNotificationMsg(this.props.result.query)}</div>;
        }
        
        let tags = null, navbarOfTags = null;
        if (this.props.result.tags.pageContent === null) {
            tags = <div className="noData">{terms.didnotSuccessfullyObtainThisPartOfResult}</div>;
        } else if(this.props.result.tags.pageContent.length > 0) {
            tags = <TheTagsAmongSearchResult result={this.props.result.tags.pageContent} width={widthOfCategoryAndTag}
                    numberOfTagsPerRow={categoryAndTagPerRow} fontSizeOfTagName={fontSizeOfName}
                    fontSizeOfDesc={fontSizeOfDesc} />
            navbarOfTags =
                <DefaultHandlerBasedNavbar currentPage={this.props.result.tags.pagination.currentPage} 
                    totalPages={this.props.result.tags.pagination.totalPages}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} 
                    onPageClicked={this.props.onPageOfFoundTagsChanged} >
                        <HandlersOfPagination pagination={this.props.result.tags.pagination} 
                            onPageClicked={this.props.onPageOfFoundTagsChanged} />
                </DefaultHandlerBasedNavbar>
        } else {
            tags = <div className="noData" style={styleOfNothingFoundInQuery}>
                        {terms.generateTagsNotFoundNotificationMsg(this.props.result.query)}</div>
        }

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <div className="summary">{terms.createSummaryOfSearchResults(this.props.result.publications.numberOfResults,
                            this.props.result.categories.numberOfResults, this.props.result.tags.numberOfResults)}</div>
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