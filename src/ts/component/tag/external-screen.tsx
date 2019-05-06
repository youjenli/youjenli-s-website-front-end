import * as React from 'react';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import { TagOfPost } from '../../model/post';
import { AnswerOfQueryPostsByTaxonomy } from '../../model/search-results';
import {InformationOfTag} from './tagInfo';
import {SearchResultsOfPost} from '../search-result/template/search-results-of-post';
import DefaultNavbarOnPageOfSearchResults from '../search-result/template/nav-bar';
import {ContentOfTaxonomyOnExternalScreen} from '../category/external-screen';

interface PropsOfPageOfTagOnExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    answer:AnswerOfQueryPostsByTaxonomy<TagOfPost>;
}

export default class PageOfTagOnExternalScreen extends React.Component<PropsOfPageOfTagOnExternalScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const answer = this.props.answer;
        let maxWidthOfTitle = 1024;
        const title = {
            name:terms.titleOfPageOfTag(answer.taxonomy.name),
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
                <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostMarkedByThisTag}</div>;
        }     

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <InformationOfTag tag={answer.taxonomy} numberOfPostsMarkedByThisTag={answer.results.numberOfResults} />
                </DefaultHeaderOfArticle>
                <ContentOfTaxonomyOnExternalScreen viewportWidth={this.props.viewportWidth} remFontSize={this.props.remFontSize} 
                    maxWidthOfTitle={maxWidthOfTitle} >
                    {results}
                </ContentOfTaxonomyOnExternalScreen>
            </React.Fragment>
        );
    }
}