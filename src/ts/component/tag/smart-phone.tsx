import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import { TagOfPost } from '../../model/post';
import { AnswerOfQueryPostsByTaxonomy } from '../../model/search-results';
import {InformationOfTag} from './tagInfo';
import {SearchResultsOfPost} from '../search-result/template/search-results-of-post';
import {NavbarOnPageOfSearchResultsInNarrowDevices} from '../search-result/template/nav-bar';

interface PropsOfPageOfCategoryOnSmartPhone {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    answer:AnswerOfQueryPostsByTaxonomy<TagOfPost>;
}

export default class PageOfTagOnSmartPhone extends React.Component<PropsOfPageOfCategoryOnSmartPhone> {
    render() {
        const vw = this.props.viewportWidth;
        const answer = this.props.answer;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (vw + 1024) / 56;
        const title = {
            name:terms.titleOfPageOfTag(this.props.answer.taxonomy.name),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const styleOfInfoOfCategory = {
            fontSize:`${(vw + 464)/56}px`
        }

        const decorationLine = {
            height:fontSizeOfTitle / 3
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
                <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostMarkedByThisTag}</div>;
        }
        

        return (
            <React.Fragment>
                <MobilePostHeader className="sp" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    <InformationOfTag tag={answer.taxonomy} numberOfPostsMarkedByThisTag={answer.results.numberOfResults} 
                        style={styleOfInfoOfCategory} />
                </MobilePostHeader>
                <ContentOfTaxonomyOnSmartPhone remFontSize={this.props.remFontSize}>
                    {results}
                </ContentOfTaxonomyOnSmartPhone>
            </React.Fragment>
        );
    }
}

export class ContentOfTaxonomyOnSmartPhone extends React.Component<{remFontSize:number}> {
    render() {
        const styleOfPostBg = {
            fontSize:this.props.remFontSize,
            paddingTop:`${this.props.remFontSize * 1.5}px`,
            paddingLeft:`${this.props.remFontSize}px`,
            paddingRight:`${this.props.remFontSize}px`
        }

        return (
            <div id="postBg" style={styleOfPostBg} className="sp categoryP">
                {this.props.children}
            </div>
        );
    }
}