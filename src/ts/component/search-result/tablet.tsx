import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import { DataOfSearchResults } from '../../model/search-results';
import {SearchResultsOfPost} from  './search-results-of-post';
import {SearchResultsOfCategory} from './search-results-of-category';
import {SearchResultsOfTag} from './search-results-of-tags'

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

        const fontSizeOfHeading = (4*vw + 2130) / 155;
        const gapBetweenTwoPosts = (0.5 * vw + 115) * this.props.remFontSize / 430;
        const widthOfPost = (maxWidthOfTitle - gapBetweenTwoPosts) / 2;
        const fontSizeOfDateOfPost = (vw + 2322) / 193;
        const fontSizeOfTitleOfPost = (vw + 2708) / 193;
        const gapBetweenDateAndTitle = (3 * fontSizeOfTitleOfPost - 40) / 2;//todo
        const paddingLeftRightOfPost = (0.5 * vw + 709) * this.props.remFontSize / 788;
        const heightOfDirectionIcon = 44;
        const fontSizeOfPageIndexes = (vw + 4492)/197;
        const categoryAndTagPerRow = 
            Math.floor((maxWidthOfTitle - this.props.remFontSize/*分類名稱左右間隔 1rem */) / (136 + this.props.remFontSize) /* 分類名稱最小寬度 + 1rem */);      
        const widthOfCategoryAndTag = (maxWidthOfTitle - (categoryAndTagPerRow - 1) * 18) / categoryAndTagPerRow;
        const fontSizeOfName = widthOfCategoryAndTag / 7;
        const fontSizeOfDesc = widthOfCategoryAndTag / 9;

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
                    <SearchResultsOfPost inquire={this.props.results.inquire} results={this.props.results.posts}
                        width={widthOfPost} numberOfPostInARow={2} paddingLeftRight={paddingLeftRightOfPost} 
                        fontSizeOfHeading={fontSizeOfHeading} fontSizeOfDate={fontSizeOfDateOfPost} 
                        gapBetweenDateAndTitle={gapBetweenDateAndTitle} fontSizeOfTitle={fontSizeOfTitleOfPost} 
                        heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                    <SearchResultsOfCategory inquire={this.props.results.inquire} results={this.props.results.categories}
                        width={widthOfCategoryAndTag} numberOfCategoriesInARow={categoryAndTagPerRow} fontSizeOfHeading={fontSizeOfHeading} 
                        fontSizeOfCategoryName={fontSizeOfName} fontSizeOfDesc={fontSizeOfDesc}
                        heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes}/>
                    <SearchResultsOfTag inquire={this.props.results.inquire} width={widthOfCategoryAndTag} 
                        numberOfTagsInARow={categoryAndTagPerRow} results={this.props.results.tags}
                        fontSizeOfHeading={fontSizeOfHeading} fontSizeOfTagName={fontSizeOfName} fontSizeOfDesc={fontSizeOfDesc}
                        heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                </div>
            </React.Fragment>
        );
    }
}