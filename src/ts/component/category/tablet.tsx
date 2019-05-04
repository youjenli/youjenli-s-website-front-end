import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import { CategoryOfPost } from '../../model/post';
import { AnswerOfQueryPostsByTaxonomy } from '../../model/search-results';
import {InformationOfCategory} from './categoryInfo';
import {SearchResultsOfPost} from '../search-result/template/search-results-of-post';
import DefaultNavbarOnPageOfSearchResults from '../search-result/template/nav-bar';

interface PropsOfPageOfCategoryOnTabletScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    answer:AnswerOfQueryPostsByTaxonomy<CategoryOfPost>;
}

export default class PageOfCategoryOnTabletScreen extends React.Component<PropsOfPageOfCategoryOnTabletScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (5 * vw + 1688) / 148;
        const title = {
            name:terms.titleOfPageOfCategory(this.props.answer.taxonomy.name),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const styleOfInfoOfCategory = {
            fontSize:`${(vw + 1936) / 148}px`
        }

        const decorationLine = {
            height:fontSizeOfTitle / 3
        }
        
        const styleOfPostBg = {
            paddingTop:`${this.props.remFontSize * 1.5}px`,
            paddingLeft:`${this.props.remFontSize}px`,
            paddingRight:`${this.props.remFontSize}px`
        }       

        let results = null;
        if (this.props.answer.results.numberOfResults > 0) {
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
            const pageSelectHandler = () => {};//todo  
            const heightOfDirectionIcon = 44;
            const fontSizeOfPageIndexes = (vw + 4492)/197;

            results = 
                <React.Fragment>
                    <SearchResultsOfPost results={this.props.answer.results} width={widthOfPost} numberOfPostInARow={2} 
                        post={settingsOfPost} />
                    <DefaultNavbarOnPageOfSearchResults results={this.props.answer.results} onPageSelect={pageSelectHandler} 
                        heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                </React.Fragment>
        } else {
            const styleOfNoPostUnderThisCategory = {
                fontSize:`${(3 * vw + 2050) / 197}px`
            }

            results = 
                <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostUnderThisCategory}</div>;
        }           

        return (
            <React.Fragment>
                <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    <InformationOfCategory style={styleOfInfoOfCategory} category={this.props.answer.taxonomy} 
                        numberOfCategoriesSubjectToThisCategory={this.props.answer.results.numberOfResults} />
                </MobilePostHeader>
                <div id="postBg" style={styleOfPostBg} className="tb categoryP">
                    {results}
                </div>
            </React.Fragment>
        );
    }
}