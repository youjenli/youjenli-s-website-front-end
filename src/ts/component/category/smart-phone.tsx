import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import { CategoryOfPost } from '../../model/post';
import { AnswerOfQueryPostsByTaxonomy } from '../../model/search-results';
import {InformationOfCategory} from './categoryInfo';
import {SearchResultsOfPost} from '../search-result/template/search-results-of-post';
import {NavbarOnPageOfSearchResultsInNarrowDevices} from '../search-result/template/nav-bar';

interface PropsOfPageOfCategoryOnSmartPhone {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    answer:AnswerOfQueryPostsByTaxonomy<CategoryOfPost>;
}

export default class PageOfCategoryOnSmartPhone extends React.Component<PropsOfPageOfCategoryOnSmartPhone> {
    render() {
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (vw + 1024) / 56;
        const title = {
            name:terms.titleOfPageOfCategory(this.props.answer.taxonomy.name),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const styleOfInfoOfCategory = {
            fontSize:`${(vw + 464)/56}px`
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
            const fontSizeOfTitleOfPost = (vw + 2772) / 153;
            const gapBetweenDateAndTitle = 4 * fontSizeOfTitleOfPost - 70;
            const settingsOfPost = {
                paddingLeftRightOfPost:(0.5 * vw - 5) * this.props.remFontSize / 310,
                fontSizeOfDate:(vw + 2466) / 153,
                gapBetweenDateAndTitle:gapBetweenDateAndTitle,
                fontSizeOfTitle:fontSizeOfTitleOfPost,
                gapBetweenIconAndCategories:(vw - 10) * 14 /* 分類與標籤字體大小 */ / 620
            }
            const pageSelectHandler = () => {};//todo  

            const heightOfDirectionIcon = (vw + 796)/31;
            const fontSizeOfPageIndexes = 26;
            
            results = 
                <React.Fragment>
                    <SearchResultsOfPost results={this.props.answer.results} numberOfPostInARow={1} 
                        post={settingsOfPost} />
                    <NavbarOnPageOfSearchResultsInNarrowDevices results={this.props.answer.results} onPageSelect={pageSelectHandler} 
                        heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                </React.Fragment>
        } else {
            const styleOfNoPostUnderThisCategory = {
                fontSize:`${(vw + 2470) / 155}px`
            }

            results = 
                <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostUnderThisCategory}</div>;
        }
        

        return (
            <React.Fragment>
                <MobilePostHeader className="sp" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    <InformationOfCategory style={styleOfInfoOfCategory} category={this.props.answer.taxonomy} 
                        numberOfCategoriesSubjectToThisCategory={this.props.answer.results.numberOfResults} />
                </MobilePostHeader>
                <div id="postBg" style={styleOfPostBg} className="sp categoryP">
                    {results}
                </div>
            </React.Fragment>
        );
    }
}