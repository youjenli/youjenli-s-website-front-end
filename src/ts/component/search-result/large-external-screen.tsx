import * as React from 'react';
import { DataOfSearchResults } from '../../model/search-results';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import {SearchResultsOfPost} from  './search-results-of-post';
import {SearchResultsOfCategory} from './search-results-of-category';
import {SearchResultsOfTag} from './search-results-of-tags'

interface PropsOfLargeExternalScreenPageOfSearchResults {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    results:DataOfSearchResults;
}

export default class LargeExternalScreenPageOfSearchResults extends React.Component<PropsOfLargeExternalScreenPageOfSearchResults> {
    render() {
        const results = this.props.results;
        const maxWidthOfTitle = (this.props.viewportWidth >= 1657 ? this.props.viewportWidth * 0.618 : 1024 );
        const fontSizeOfTitle = maxWidthOfTitle / 22.8;
        
        const title = {
            name:terms.createTitleOfPageOfSearchResults(results.inquire),
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
            padding:`1px ${paddingLeftRightOfPostBg}px`,/* 上下要加 1px 的 padding 免得 margin 頂出去 */
            marginBottom:`${marginBottomOfPostBg}px`
        }

        const styleOfPostContent = {
            marginTop:`${marginTopOfPostContent}px`,
            marginBottom:`${marginBottomOfPostContent}px`
        }

        const widthOfPost = (maxWidthOfTitle - 2* this.props.remFontSize) / 2;
        const vw = this.props.viewportWidth;
        const fontSizeOfHeading = (vw + 2560) /112;
        const fontSizeOfDateOfPost = (vw + 7936) / 448;
        const fontSizeOfTitleOfPost = (vw + 8832) / 448;
        const heightOfDirectionIcon = (-1 * vw + 10880) / 224;
        const fontSizeOfPageIndexes = (-1 * vw + 13568) / 448;

        const categoryAndTagPerRow = Math.floor((maxWidthOfTitle - 18/*分類名稱左右間隔 1rem */) / 154 /* 分類名稱最小寬度 + 1rem */);      
        const widthOfCategoryAndTag = (maxWidthOfTitle - (categoryAndTagPerRow - 1) * 18) / categoryAndTagPerRow;
        const fontSizeOfName = widthOfCategoryAndTag / 7;
        const fontSizeOfDesc = widthOfCategoryAndTag / 9;

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <div className="summary">{terms.createSummaryOfSearchResults(results.posts.totalNumberOfResults,
                            results.categories.totalNumberOfResults, results.tags.totalNumberOfResults)}</div>
                </DefaultHeaderOfArticle>
                <div id="postBg" className="les search" style={styleOfPostBg}>
                    <div className="content" style={styleOfPostContent}>
                        <p id="types-and-taxo">{terms.typesOfSearchResult}</p>
                        <p id="introduction">{terms.introductionOfTypesOfSearchResult}</p>
                        <SearchResultsOfPost inquire={this.props.results.inquire} results={this.props.results.posts}
                            width={widthOfPost} numberOfPostInARow={2} fontSizeOfHeading={fontSizeOfHeading} 
                            fontSizeOfDate={fontSizeOfDateOfPost} fontSizeOfTitle={fontSizeOfTitleOfPost} 
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
                </div>
            </React.Fragment>
        );
    }
}