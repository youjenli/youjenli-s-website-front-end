import * as React from 'react';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import { CategoryOfPost } from '../../model/post';
import { AnswerOfQueryPostsByTaxonomy } from '../../model/search-results';
import {InformationOfCategory} from './categoryInfo';
import {SearchResultsOfPost} from '../search-result/template/search-results-of-post';
import DefaultNavbarOnPageOfSearchResults from '../search-result/template/nav-bar';

interface PropsOfPageOfCategoryOnExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    answer:AnswerOfQueryPostsByTaxonomy<CategoryOfPost>;
}

export default class PageOfCategoryOnExternalScreen extends React.Component<PropsOfPageOfCategoryOnExternalScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const answer = this.props.answer;
        let maxWidthOfTitle = 1024;
        const title = {
            name:terms.titleOfPageOfCategory(answer.taxonomy.name),
            maxWidth:maxWidthOfTitle,
        };     
           
        let titleBg = {
            paddingBottom:0
        };

        let results = null;
        if (this.props.answer.results.numberOfResults > 0) {
            const widthOfPost = (maxWidthOfTitle - 2* this.props.remFontSize) / 2;
            const settingsOfPost = {
                fontSizeOfDate:(vw + 7936) / 448,
                fontSizeOfTitle:(vw + 8832) / 448
            }
            const pageSelectHandler = () => {};//todo 

            const heightOfDirectionIcon = (-1 * vw + 10880) / 224;
            const fontSizeOfPageIndexes = (-1 * vw + 13568) / 448;

            results = 
                <React.Fragment>
                    <SearchResultsOfPost results={this.props.answer.results} width={widthOfPost}
                        numberOfPostInARow={2} post={settingsOfPost} />
                    <DefaultNavbarOnPageOfSearchResults results={this.props.answer.results} onPageSelect={pageSelectHandler} 
                        heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                </React.Fragment>
        } else {
            const styleOfNoPostUnderThisCategory = {
                fontSize:`${(vw + 4800) / 224}px`
            }

            results = 
                <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostUnderThisCategory}</div>;
        }     

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <InformationOfCategory category={answer.taxonomy} 
                        numberOfCategoriesSubjectToThisCategory={answer.results.numberOfResults} />
                </DefaultHeaderOfArticle>
                <ContentOfTaxonomyOnExternalScreen viewportWidth={this.props.viewportWidth} remFontSize={this.props.remFontSize} 
                    maxWidthOfTitle={maxWidthOfTitle} >
                    {results}
                </ContentOfTaxonomyOnExternalScreen>
            </React.Fragment>
        );
    }
}

interface PropsOfContentOfTaxonomyOnExternalScreen {
    viewportWidth:number;
    remFontSize:number;
    maxWidthOfTitle:number;
}

export class ContentOfTaxonomyOnExternalScreen extends React.Component<PropsOfContentOfTaxonomyOnExternalScreen> {
    render() {
        let widthOfPostBg = this.props.viewportWidth * 0.382 + 632.832;
        let marginTopOfPostContent = this.props.remFontSize * 1.5;    
        let marginBottomOfPostContent = this.props.remFontSize * 1.5;
        let marginBottomOfPostBg = this.props.remFontSize * 2;/*數值缺規格，待確認 */        
        let paddingLeftRightOfPosgBg = (widthOfPostBg - this.props.maxWidthOfTitle) / 2;  

        const styleOfPostBg = {
            width:`${widthOfPostBg}px`,
            paddingLeft:`${paddingLeftRightOfPosgBg}px`,
            paddingRight:`${paddingLeftRightOfPosgBg}px`,
            marginBottom:`${marginBottomOfPostBg}px`
        }

        const styleOfPostContent = {
            marginTop:`${marginTopOfPostContent}px`,
            marginBottom:`${marginBottomOfPostContent}px`
        }
        return (
            <div id="postBg" className="es categoryP" style={styleOfPostBg}>
                <div className="content" style={styleOfPostContent}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}