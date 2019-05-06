import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import { TagOfPost } from '../../model/post';
import { AnswerOfQueryPostsByTaxonomy } from '../../model/search-results';
import {InformationOfTag} from './tagInfo';
import {SearchResultsOfPost} from '../search-result/template/search-results-of-post';
import DefaultNavbarOnPageOfSearchResults from '../search-result/template/nav-bar';

interface PropsOfPageOfTagOnTabletScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    answer:AnswerOfQueryPostsByTaxonomy<TagOfPost>;
}

export default class PageOfTagOnTabletScreen extends React.Component<PropsOfPageOfTagOnTabletScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const answer = this.props.answer;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (5 * vw + 1688) / 148;
        const title = {
            name:terms.titleOfPageOfTag(this.props.answer.taxonomy.name),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const styleOfInfoOfCategory = {
            fontSize:`${(vw + 1936) / 148}px`
        }

        const decorationLine = {
            height:fontSizeOfTitle / 3
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
                <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostMarkedByThisTag}</div>;
        }           

        return (
            <React.Fragment>
                <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    <InformationOfTag tag={answer.taxonomy} numberOfPostsMarkedByThisTag={answer.results.numberOfResults} 
                        style={styleOfInfoOfCategory} />
                </MobilePostHeader>
                <ContentOfTaxonomyOnTablet remFontSize={this.props.remFontSize} >
                    {results}
                </ContentOfTaxonomyOnTablet>
            </React.Fragment>
        );
    }
}

export class ContentOfTaxonomyOnTablet extends React.Component<{remFontSize:number}> {
    render() {
        const styleOfPostBg = {
            paddingTop:`${this.props.remFontSize * 1.5}px`,
            paddingLeft:`${this.props.remFontSize}px`,
            paddingRight:`${this.props.remFontSize}px`
        }

        return (
            <div id="postBg" style={styleOfPostBg} className="tb categoryP">
                {this.props.children}
            </div>
        );
    }
}