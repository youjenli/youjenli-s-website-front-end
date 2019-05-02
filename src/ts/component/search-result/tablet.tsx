import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import { DataOfSearchResults } from '../../model/search-results';
import {SearchResultsOfPost} from  './template/search-results-of-post';
import {SearchResultsOfCategory} from './template/search-results-of-category';
import {SearchResultsOfTag} from './template/search-results-of-tags'
import * as icons from '../home/recentPosts/icons';
import DefaultNavbarOnPageOfSearchResults from './template/nav-bar';

interface PropsOfTabletPageOfSearchResults {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    results:DataOfSearchResults;
}

export default class TabletPageOfSearchResults extends React.Component<PropsOfTabletPageOfSearchResults> {
    render() {
        const results = this.props.results;
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (5 * vw + 1688) / 148;
        const title = {
            name:terms.createTitleOfPageOfSearchResults(results.inquire),
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
        if (this.props.results.posts.totalNumberOfPages > 0) {
            const gapBetweenTwoPosts = (0.5 * vw + 115) * this.props.remFontSize / 430;
            const widthOfPost = (maxWidthOfTitle - gapBetweenTwoPosts) / 2;
            const fontSizeOfDateOfPost = (vw + 2322) / 193;
            const fontSizeOfTitleOfPost = (vw + 2708) / 193;
            const gapBetweenDateAndTitle = (3 * fontSizeOfTitleOfPost - 40) / 2;//todo
            const paddingLeftRightOfPost = (0.5 * vw + 709) * this.props.remFontSize / 788;  
        
            posts = <SearchResultsOfPost results={this.props.results.posts} width={widthOfPost} paddingLeftRight={paddingLeftRightOfPost}
                        numberOfPostInARow={2} fontSizeOfDate={fontSizeOfDateOfPost} fontSizeOfTitle={fontSizeOfTitleOfPost} 
                        gapBetweenDateAndTitle={gapBetweenDateAndTitle} />
            const pageSelectHandler = () => {};//todo        
            navbarOfPosts = 
                <DefaultNavbarOnPageOfSearchResults results={this.props.results.posts} onPageSelect={pageSelectHandler} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
        } else {
            posts = 
                <div className="noData">{terms.generatePostsNotFoundNotificationMsg(this.props.results.inquire)}</div>;
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
            const pageSelectHandler = () => {};//todo
            navbarOfCategories = 
                <DefaultNavbarOnPageOfSearchResults results={this.props.results.categories} onPageSelect={pageSelectHandler} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes}/>
        } else {
            categories = 
                <div className="noData">{terms.generateCategoriesNotFoundNotificationMsg(this.props.results.inquire)}</div>;
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
            tags = <div className="noData">{terms.generateTagsNotFoundNotificationMsg(this.props.results.inquire)}</div>
        }

        return (
            <React.Fragment>
                <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    <div style={styleOfSummary} className="summary">{
                        terms.createSummaryOfSearchResults(results.posts.totalNumberOfResults,
                        results.categories.totalNumberOfResults, results.tags.totalNumberOfResults)}</div>
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