import * as React from 'react';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import { CategoryOfPost } from '../../model/post';
import { AnswerOfQueryPostsByTaxonomy } from '../../model/search-results';
import {SearchResultsOfPost} from '../search-result/template/search-results-of-post';
import DefaultNavbarOnPageOfSearchResults from '../search-result/template/nav-bar';
import {InformationOfCategory} from './categoryInfo';

interface PropsOfPageOfCategoryOnLargeExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    answer:AnswerOfQueryPostsByTaxonomy<CategoryOfPost>;
}

export default class PageOfCategoryOnLargeExternalScreen extends React.Component<PropsOfPageOfCategoryOnLargeExternalScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = (this.props.viewportWidth >= 1657 ? this.props.viewportWidth * 0.618 : 1024 );
        const fontSizeOfTitle = maxWidthOfTitle / 22.8;
        
        const title = {
            name:terms.titleOfPageOfCategory(this.props.answer.taxonomy.name),
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
            paddingLeft:`${paddingLeftRightOfPostBg}px`,
            paddingRight:`${paddingLeftRightOfPostBg}px`,
            marginBottom:`${marginBottomOfPostBg}px`
        }

        const styleOfPostContent = {
            marginTop:`${marginTopOfPostContent}px`,
            marginBottom:`${marginBottomOfPostContent}px`
        }
        
        const widthOfPost = (maxWidthOfTitle - 2* this.props.remFontSize) / 2;
        const settingsOfPost = {
            fontSizeOfDate:(vw + 7936) / 448,
            fontSizeOfTitle:(vw + 8832) / 448
        }
        const heightOfDirectionIcon = (-1 * vw + 10880) / 224;
        const fontSizeOfPageIndexes = (-1 * vw + 13568) / 448;
        const pageSelectHandler = () => {};//todo

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <InformationOfCategory category={this.props.answer.taxonomy} 
                        numberOfCategoriesSubjectToThisCategory={this.props.answer.results.numberOfResults}/>
                </DefaultHeaderOfArticle>
                <div id="postBg" className="les categoryP" style={styleOfPostBg}>
                    <div className="content" style={styleOfPostContent}>
                        <SearchResultsOfPost results={this.props.answer.results} width={widthOfPost}
                            numberOfPostInARow={2} post={settingsOfPost} />
                        <DefaultNavbarOnPageOfSearchResults results={this.props.answer.results} onPageSelect={pageSelectHandler} 
                            heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                    </div>                    
                </div>
            </React.Fragment>
        );        
    }
}