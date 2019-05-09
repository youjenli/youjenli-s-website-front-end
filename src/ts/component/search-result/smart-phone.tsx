import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import { SummaryOfResultsOfSearch } from '../../model/search-results';
import {SearchResultsOfPost} from  './template/search-results-of-post';
import {SearchResultsOfCategory} from './template/search-results-of-category';
import {SearchResultsOfTag} from './template/search-results-of-tags';
import * as icons from '../template/icons';
import {NavbarOnPageOfSearchResultsInNarrowDevices} from './template/nav-bar';

interface PropsOfSmartPhonePageOfSearchResults {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    results:SummaryOfResultsOfSearch;
}

export default class SmartPhonePageOfSearchResults extends React.Component<PropsOfSmartPhonePageOfSearchResults> {
    render() {
        const results = this.props.results;
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (2 * vw + 3080) / 155;
        const title = {
            name:terms.createTitleOfPageOfSearchResults(results.query),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const decorationLine = {
            height:fontSizeOfTitle / 3
        }

        const styleOfSummary = {
            fontSize:`${(vw+1850)/155}px`
        }
        
        const styleOfPostBg = {
            fontSize:`${this.props.remFontSize}px`,
            paddingLeft:`${this.props.remFontSize}px`,
            paddingRight:`${this.props.remFontSize}px`
        }       

        const fontSizeOfGuide = (2*vw + 1530)/155;
        const styleOfTypesAndTaxo = {
            fontSize:`${fontSizeOfGuide}px`
        }       
        
        const styleOfIntroduction = {
            marginBottom:`${(vw + 310) * this.props.remFontSize /620}px`,
            fontSize:`${fontSizeOfGuide}px`
        }

        const styleOfHeading = {
            fontSize:`${(4*vw + 2130) / 155}px`,
            margin:`${(vw + 300) * this.props.remFontSize / 620}px 0`
        }      
        
        let styleOfNothingFoundInQuery = {
            fontSize:`${(2 * vw + 1840) / 155}px`
        }

        const heightOfDirectionIcon = (vw + 796)/31;
        const fontSizeOfPageIndexes = 26;

        let posts = null, navbarOfPosts = null;
        if (this.props.results.posts.numberOfPages > 0) {
            const fontSizeOfTitleOfPost = (vw + 2772) / 153;
            const gapBetweenDateAndTitle = 4 * fontSizeOfTitleOfPost - 70;
            const settingsOfPost = {
                paddingLeftRightOfPost:(0.5 * vw - 5) * this.props.remFontSize / 310,
                fontSizeOfDate:(vw + 2466) / 153,
                gapBetweenDateAndTitle:gapBetweenDateAndTitle,
                fontSizeOfTitle:fontSizeOfTitleOfPost,
                gapBetweenIconAndCategories:(vw - 10) * 14 /* 分類與標籤字體大小 */ / 620
            }
            posts = <SearchResultsOfPost results={this.props.results.posts} numberOfPostInARow={1} 
                       post={settingsOfPost} />
            const pageSelectHandler = () => {};//todo        
            navbarOfPosts = 
                <NavbarOnPageOfSearchResultsInNarrowDevices results={this.props.results.posts} onPageSelect={pageSelectHandler} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
        } else {
            posts = 
                <div className="noData" style={styleOfNothingFoundInQuery}>
                    {terms.generatePostsNotFoundNotificationMsg(this.props.results.query)}</div>;
        }

        const categoryAndTagPerRow =
            Math.floor((vw - this.props.remFontSize/*分類名稱左右間隔 1rem */) / (136 + this.props.remFontSize) /* 分類名稱最小寬度 + 1rem */);      
        const widthOfCategoryAndTag = (maxWidthOfTitle - (categoryAndTagPerRow - 1) * this.props.remFontSize) / categoryAndTagPerRow;
        const fontSizeOfName = widthOfCategoryAndTag / 7;
        const fontSizeOfDesc = widthOfCategoryAndTag / 9;

        let categories = null, navbarOfCategories = null;
        if (this.props.results.categories.pageContent.length > 0) {
            categories = <SearchResultsOfCategory results={this.props.results.categories} width={widthOfCategoryAndTag}
                            numberOfCategoriesInARow={categoryAndTagPerRow} fontSizeOfCategoryName={fontSizeOfName}
                            fontSizeOfDesc={fontSizeOfDesc} />
            const pageSelectHandler = () => {};//todo
            navbarOfCategories = 
                <NavbarOnPageOfSearchResultsInNarrowDevices results={this.props.results.categories} onPageSelect={pageSelectHandler} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
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
                <NavbarOnPageOfSearchResultsInNarrowDevices results={this.props.results.tags} onPageSelect={pageSelectHandler} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
        } else {
            tags = <div className="noData" style={styleOfNothingFoundInQuery}>
                        {terms.generateTagsNotFoundNotificationMsg(this.props.results.query)}</div>
        }

        return (
            <React.Fragment>
                <MobilePostHeader className="sp" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    <div style={styleOfSummary} className="summary">{
                        terms.createSummaryOfSearchResults(results.posts.numberOfResults,
                        results.categories.numberOfResults, results.tags.numberOfResults)}</div>
                </MobilePostHeader>
                <div id="postBg" style={styleOfPostBg} className="sp search">
                    <p id="types-and-taxo" style={styleOfTypesAndTaxo}>{terms.typesOfSearchResult}</p>
                    <p id="introduction" style={styleOfIntroduction}>{terms.introductionOfTypesOfSearchResult}</p>
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