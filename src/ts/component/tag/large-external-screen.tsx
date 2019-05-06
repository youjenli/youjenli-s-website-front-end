import * as React from 'react';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import { TagOfPost } from '../../model/post';
import { AnswerOfQueryPostsByTaxonomy } from '../../model/search-results';
import {InformationOfTag} from './tagInfo';
import {SearchResultsOfPost} from '../search-result/template/search-results-of-post';
import DefaultNavbarOnPageOfSearchResults from '../search-result/template/nav-bar';
import {ContentOfTaxonomyOnLargeExternalScreen} from '../category/large-external-screen';

interface PropsOfPageOfTagOnLargeExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    answer:AnswerOfQueryPostsByTaxonomy<TagOfPost>;
}

export default class PageOfTagOnLargeExternalScreen extends React.Component<PropsOfPageOfTagOnLargeExternalScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = (this.props.viewportWidth >= 1657 ? this.props.viewportWidth * 0.618 : 1024 );
        const fontSizeOfTitle = maxWidthOfTitle / 22.8;
        
        const title = {
            name:terms.titleOfPageOfTag(this.props.answer.taxonomy.name),
            maxWidth:maxWidthOfTitle,
            fontSize:fontSizeOfTitle
        };
        
        let titleBg = {
            paddingBottom:0
        };

        let results = null;
        if (this.props.answer.results.numberOfResults > 0) {
            const widthOfPost = (maxWidthOfTitle - 2 * this.props.remFontSize) / 2;
            const settingsOfPost = {
                fontSizeOfDate:(vw + 7936) / 448,
                fontSizeOfTitle:(vw + 8832) / 448
            }
            const heightOfDirectionIcon = (-1 * vw + 10880) / 224;
            const fontSizeOfPageIndexes = (-1 * vw + 13568) / 448;
            const pageSelectHandler = () => {};//todo

            results = 
                <React.Fragment>
                    <SearchResultsOfPost results={this.props.answer.results} width={widthOfPost}
                        numberOfPostInARow={2} post={settingsOfPost} />
                    <DefaultNavbarOnPageOfSearchResults results={this.props.answer.results} onPageSelect={pageSelectHandler} 
                        heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} />
                </React.Fragment>
        } else {
            const styleOfNoPostUnderThisTag = {
                fontSize:`${(vw + 4800) / 224}px`
            }

            results = 
                <div style={styleOfNoPostUnderThisTag} className="noPost">{terms.noPostMarkedByThisTag}</div>
        }

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    <InformationOfTag tag={this.props.answer.taxonomy} 
                        numberOfPostsMarkedByThisTag={this.props.answer.results.numberOfResults} /> 
               </DefaultHeaderOfArticle>
                <ContentOfTaxonomyOnLargeExternalScreen viewportWidth={this.props.viewportWidth} remFontSize={this.props.remFontSize} 
                    maxWidthOfTitle={maxWidthOfTitle}>
                    {results}
                </ContentOfTaxonomyOnLargeExternalScreen>
            </React.Fragment>
        );        
    }
}