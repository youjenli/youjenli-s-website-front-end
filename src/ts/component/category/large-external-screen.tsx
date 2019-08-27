import * as React from 'react';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import { Pagination } from '../../model/pagination';
import * as terms from './terms';
import * as generalTerms from '../template/terms';
import { MetaDataOfPost } from '../../model/posts';
import {Category} from '../../model/terms';
import { PostsAmongParticularTaxonomy } from '../../component/template/posts-among-particular-taxonomy';
import {DefaultRouteBasedNavbar} from '../search-result/template/route-based-nav-bar';
import {InformationOfCategory} from './categoryInfo';
import { LinksOfPagination } from '../search-result/template/route-based-pagination';

interface PropsOfPageOfCategoryOnLargeExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    category:Category;
    numberOfResults:number;
    pageContent:MetaDataOfPost[];
    pagination:Pagination;
}

export default class PageOfCategoryOnLargeExternalScreen extends React.Component<PropsOfPageOfCategoryOnLargeExternalScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = (this.props.viewportWidth >= 1657 ? this.props.viewportWidth * 0.618 : 1024 );
        const fontSizeOfTitle = maxWidthOfTitle / 22.8;
        
        const title = {
            name:terms.titleOfPageOfCategory(this.props.category.name),
            maxWidth:maxWidthOfTitle,
            fontSize:fontSizeOfTitle
        };
        
        let titleBg = {
            paddingBottom:0
        };

        let categoryInfo = null, results = null, paginationField = null;
        
        if (this.props.pagination && this.props.pagination.totalPages > 0) {
            const heightOfDirectionIcon = (-1 * vw + 10880) / 224;
            const fontSizeOfPageIndexes = (-1 * vw + 13568) / 448;

            paginationField =
                <DefaultRouteBasedNavbar baseUrl={this.props.pagination.baseUrl}
                    currentPage={this.props.pagination.currentPage} totalPages={this.props.pagination.totalPages} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} >
                        <LinksOfPagination pagination={this.props.pagination} />
                </DefaultRouteBasedNavbar>
        }

        if (this.props.pageContent === null) {
            categoryInfo = <InformationOfCategory category={this.props.category} />;

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
            categoryInfo = <InformationOfCategory category={this.props.category} 
                numberOfPostsSubjectToThisCategory={this.props.numberOfResults}/>
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
                    <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostUnderThisCategory}</div>
            }
        }

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="les"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    {categoryInfo}
                </DefaultHeaderOfArticle>
                <ContentOfTaxonomyOnLargeExternalScreen viewportWidth={this.props.viewportWidth} remFontSize={this.props.remFontSize} 
                    maxWidthOfTitle={maxWidthOfTitle}>
                    {results}
                </ContentOfTaxonomyOnLargeExternalScreen>
            </React.Fragment>
        );        
    }
}

interface PropsOfContentOfTaxonomyOnLargeExternalScreen {
    viewportWidth:number;
    remFontSize:number;
    maxWidthOfTitle:number;
}

export class ContentOfTaxonomyOnLargeExternalScreen extends React.Component<PropsOfContentOfTaxonomyOnLargeExternalScreen> {
    render () {

        const widthOfPostBg = 0.764 * this.props.viewportWidth;
        const marginTopOfPostContent = this.props.remFontSize * 2;
        const marginBottomOfPostContent = this.props.remFontSize * 2;
        const paddingLeftRightOfPostBg = (widthOfPostBg - this.props.maxWidthOfTitle) / 2;        
        const marginBottomOfPostBg = this.props.remFontSize * 2;   

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

        return (
            <div id="postBg" className="les categoryP" style={styleOfPostBg}>
                <div className="content" style={styleOfPostContent}>
                    {this.props.children}
                </div>                    
            </div>
        );
    }
}