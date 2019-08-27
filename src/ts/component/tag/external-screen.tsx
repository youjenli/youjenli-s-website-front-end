import * as React from 'react';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import * as generalTerms from '../template/terms';
import { MetaDataOfPost } from '../../model/posts';
import {Tag} from '../../model/terms';
import {Pagination} from '../../model/pagination';
import {InformationOfTag} from './tagInfo';
import { PostsAmongParticularTaxonomy } from '../../component/template/posts-among-particular-taxonomy';
import {DefaultRouteBasedNavbar} from '../search-result/template/route-based-nav-bar';
import {ContentOfTaxonomyOnExternalScreen} from '../category/external-screen';
import { LinksOfPagination } from '../search-result/template/route-based-pagination';

interface PropsOfPageOfTagOnExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    tag:Tag;
    numberOfResults:number;
    pageContent:MetaDataOfPost[];
    pagination:Pagination;
}

export default class PageOfTagOnExternalScreen extends React.Component<PropsOfPageOfTagOnExternalScreen> {
    render() {
        const vw = this.props.viewportWidth;
        let maxWidthOfTitle = 1024;
        const title = {
            name:terms.titleOfPageOfTag(this.props.tag.name),
            maxWidth:maxWidthOfTitle,
        };     
           
        let titleBg = {
            paddingBottom:0
        };

        let tagInfo = null, results = null, paginationField = null;
        if (this.props.pagination && this.props.pagination.totalPages > 0) {
            const heightOfDirectionIcon = (-1 * vw + 10880) / 224;
            const fontSizeOfPageIndexes = (-1 * vw + 13568) / 448;

            paginationField = 
                <DefaultRouteBasedNavbar totalPages={this.props.pagination.totalPages} 
                    currentPage={this.props.pagination.currentPage} baseUrl={this.props.pagination.baseUrl} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} >
                        <LinksOfPagination pagination={this.props.pagination} />
                </DefaultRouteBasedNavbar>;
        }

        if (this.props.pageContent === null ) {
            tagInfo = <InformationOfTag tag={this.props.tag} />;
            
            const styleOfPostsFetchingFailed = {
                fontSize:`${(vw + 4800) / 224}px`
            }

            results = 
                <React.Fragment>
                    <div style={styleOfPostsFetchingFailed} className="noPost">
                        {generalTerms.cannotFetchPostsInsideThePageYouHaveRequested}</div>
                    {paginationField}
                </React.Fragment>;

        } else {
            tagInfo = 
                <InformationOfTag tag={this.props.tag} numberOfPostsMarkedByThisTag={this.props.numberOfResults} />;
            if (this.props.numberOfResults > 0) {
                const widthOfPost = (maxWidthOfTitle - 2* this.props.remFontSize) / 2;
                const settingsOfPost = {
                    fontSizeOfDate:(vw + 7936) / 448,
                    fontSizeOfTitle:(vw + 8832) / 448
                }
    
                results = 
                    <React.Fragment>
                        <PostsAmongParticularTaxonomy pageContent={this.props.pageContent} width={widthOfPost}
                            numberOfPostInARow={2} post={settingsOfPost} />
                        {paginationField}
                    </React.Fragment>
            } else {
                const styleOfNoPostUnderThisCategory = {
                    fontSize:`${(vw + 4800) / 224}px`
                }
    
                results = 
                    <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostMarkedByThisTag}</div>;
            }
        }

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    {tagInfo}
                </DefaultHeaderOfArticle>
                <ContentOfTaxonomyOnExternalScreen viewportWidth={this.props.viewportWidth} remFontSize={this.props.remFontSize} 
                    maxWidthOfTitle={maxWidthOfTitle} >
                    {results}
                </ContentOfTaxonomyOnExternalScreen>
            </React.Fragment>
        );
    }
}