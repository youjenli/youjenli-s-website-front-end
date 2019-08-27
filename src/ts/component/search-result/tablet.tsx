import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import { ResultOfSearch } from '../../model/search-results';
import {PublicationsAmongSearchResult} from  './template/publications-among-search-result';
import {SearchResultsOfCategory} from './template/categories-among-search-result';
import {SearchResultsOfTag} from './template/tags-among-search-result'
import * as icons from '../template/icons';
import { DefaultRouteBasedNavbar } from './template/route-based-nav-bar';
import { LinksOfPagination } from './template/route-based-pagination';
import { PageClickedHandler } from './routeHandler';
import { HandlersOfPagination } from './template/handler-based-pagination';
import { DefaultHandlerBasedNavbar } from './template/handler-based-nav-bar';

interface PropsOfTabletPageOfSearchResults {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    results:ResultOfSearch;
    onPageOfFoundCategoriesChanged:PageClickedHandler;
    onPageOfFoundTagsChanged:PageClickedHandler;
}

export default class TabletPageOfSearchResults extends React.Component<PropsOfTabletPageOfSearchResults> {
    render() {
        const results = this.props.results;
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (5 * vw + 1688) / 148;
        const title = {
            name:terms.createTitleOfPageOfSearchResults(results.query),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const decorationLine = {
            height:fontSizeOfTitle / 3
        }

        const styleOfSummary = {
            fontSize:`${(vw+1936)/148}px`
        }
        
        const styleOfPostBg = {
            paddingLeft:`${this.props.remFontSize}px`,
            paddingRight:`${this.props.remFontSize}px`
        }       

        const styleOfHeading = {
            fontSize:`${(4*vw + 2130) / 155}px`
        }
                      
        const heightOfDirectionIcon = 44;
        const fontSizeOfPageIndexes = (vw + 4492)/197;

        let posts = null, navbarOfPosts = null;
        if (this.props.results.publications.pagination.totalPages > 0) {
            const gapBetweenTwoPosts = (0.5 * vw + 115) * this.props.remFontSize / 430;
            const widthOfPost = (maxWidthOfTitle - gapBetweenTwoPosts) / 2;
            const fontSizeOfTitleOfPost = (vw + 2708) / 193;
            const gapBetweenDateAndTitle = (3 * fontSizeOfTitleOfPost - 40) / 2;
            const settingsOfPost = {
                paddingLeftRightOfPost:(0.5 * vw + 709) * this.props.remFontSize / 788,
                fontSizeOfDate:(vw + 2322) / 193,
                gapBetweenDateAndTitle:gapBetweenDateAndTitle,
                fontSizeOfTitle:fontSizeOfTitleOfPost
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
                <div className="noData">{terms.generatePostsNotFoundNotificationMsg(this.props.results.query)}</div>;
        }

        const categoryAndTagPerRow = 
            Math.floor((maxWidthOfTitle - this.props.remFontSize/*分類名稱左右間隔 1rem */) / (136 + this.props.remFontSize) /* 分類名稱最小寬度 + 1rem */);      
        const widthOfCategoryAndTag = (maxWidthOfTitle - (categoryAndTagPerRow - 1) * 18) / categoryAndTagPerRow;
        const fontSizeOfName = widthOfCategoryAndTag / 7;
        const fontSizeOfDesc = widthOfCategoryAndTag / 9;

        let categories = null, navbarOfCategories = null;
        if (this.props.results.categories.pageContent.length > 0) {
            categories = <SearchResultsOfCategory results={this.props.results.categories} width={widthOfCategoryAndTag}
                            numberOfCategoriesInARow={categoryAndTagPerRow} fontSizeOfCategoryName={fontSizeOfName}
                            fontSizeOfDesc={fontSizeOfDesc} />
            navbarOfCategories = 
                <DefaultHandlerBasedNavbar currentPage={this.props.results.categories.pagination.currentPage} 
                    totalPages={this.props.results.categories.pagination.totalPages} onPageClicked={this.props.onPageOfFoundCategoriesChanged}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes}>
                        <HandlersOfPagination pagination={this.props.results.categories.pagination}
                            onPageClicked={this.props.onPageOfFoundCategoriesChanged} />
                </DefaultHandlerBasedNavbar>
        } else {
            categories = 
                <div className="noData">{terms.generateCategoriesNotFoundNotificationMsg(this.props.results.query)}</div>;
        }
        
        let tags = null, navbarOfTags = null;
        if(this.props.results.tags.pageContent.length > 0) {
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
            tags = <div className="noData">{terms.generateTagsNotFoundNotificationMsg(this.props.results.query)}</div>
        }

        return (
            <React.Fragment>
                <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    <div style={styleOfSummary} className="summary">{
                        terms.createSummaryOfSearchResults(results.publications.numberOfResults,
                        results.categories.numberOfResults, results.tags.numberOfResults)}</div>
                </MobilePostHeader>
                <div id="postBg" style={styleOfPostBg} className="tb search">
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
            </React.Fragment>
        );
    }
}