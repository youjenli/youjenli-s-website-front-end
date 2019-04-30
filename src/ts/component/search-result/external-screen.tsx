import * as React from 'react';
import { DataOfSearchResults } from '../../model/search-results';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import {SearchResultsOfPost} from  './search-results-of-post';
import {SearchResultsOfCategory} from './search-results-of-category';
import {SearchResultsOfTag} from './search-results-of-tags'

interface PropsOfExternalScreenPageOfSearchResults {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    results:DataOfSearchResults;
}

export default class ExternalScreenPageOfSearchResults extends React.Component<PropsOfExternalScreenPageOfSearchResults> {
    render() {
        const vw = this.props.viewportWidth;
        const results = this.props.results;
        let maxWidthOfTitle = 1024;
        let marginTopOfPostContent = this.props.remFontSize * 1.5;    
        let marginBottomOfPostContent = this.props.remFontSize * 1.5;
        let marginBottomOfPostBg = this.props.remFontSize * 2;/*數值缺規格，待確認 */
        let widthOfPostBg = this.props.viewportWidth * 0.382 + 632.832;
        let paddingLeftRightOfPosgBg = (widthOfPostBg - maxWidthOfTitle) / 2;        
        const title = {
            name:terms.createTitleOfPageOfSearchResults(results.inquire),
            maxWidth:maxWidthOfTitle,
        };
            
        let titleBg = {
            paddingBottom:0
        };
        
        const styleOfPostBg = {
            width:`${widthOfPostBg}px`,
            padding:`1px ${paddingLeftRightOfPosgBg}px`,
            marginBottom:`${marginBottomOfPostBg}px`
        }

        const widthOfPost = (maxWidthOfTitle - 2* this.props.remFontSize) / 2;
        const fontSizeOfHeading = (this.props.viewportWidth + 2560)/112;
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
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <div className="summary">{terms.createSummaryOfSearchResults(results.posts.totalNumberOfResults,
                            results.categories.totalNumberOfResults, results.tags.totalNumberOfResults)}</div>
                </DefaultHeaderOfArticle>
                <div id="postBg" className="es" style={styleOfPostBg}>
                    <div className="content search">
                        <p id="types-and-taxo">{terms.typesOfSearchResult}</p>
                        <p id="introduction">{terms.introductionOfTypesOfSearchResult}</p>
                        <SearchResultsOfPost inquire={this.props.results.inquire} results={this.props.results.posts}
                            width={widthOfPost} fontSizeOfHeading={fontSizeOfHeading} fontSizeOfDate={fontSizeOfDateOfPost} 
                            fontSizeOfTitle={fontSizeOfTitleOfPost} heightOfDirectionIcon={heightOfDirectionIcon} 
                            fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                        <SearchResultsOfCategory inquire={this.props.results.inquire} results={this.props.results.categories}
                            width={widthOfCategoryAndTag} numberOfTagsInARow={categoryAndTagPerRow} fontSizeOfHeading={fontSizeOfHeading} 
                            fontSizeOfCategoryName={fontSizeOfName} fontSizeOfDesc={fontSizeOfDesc}
                            heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes}/>
                        <SearchResultsOfTag inquire={this.props.results.inquire} widthOfTag={widthOfCategoryAndTag} 
                            numberOfTagsInARow={categoryAndTagPerRow} results={this.props.results.tags}
                            fontSizeOfHeading={fontSizeOfHeading} fontSizeOfTagName={fontSizeOfName} fontSizeOfDesc={fontSizeOfDesc}
                            heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}