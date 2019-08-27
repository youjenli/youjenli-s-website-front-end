import * as React from 'react';
import DefaultHeaderOfArticle from '../template/es-header-of-article';
import * as terms from './terms';
import * as generalTerms from '../template/terms';
import { MetaDataOfPost } from '../../model/posts';
import {Category} from '../../model/terms';
import { Pagination } from '../../model/pagination';
import {InformationOfCategory} from './categoryInfo';
import { PostsAmongParticularTaxonomy } from '../../component/template/posts-among-particular-taxonomy';
import {DefaultRouteBasedNavbar } from '../search-result/template/route-based-nav-bar';
import { LinksOfPagination } from '../search-result/template/route-based-pagination';

interface PropsOfPageOfCategoryOnExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    category:Category;
    numberOfResults:number;
    pageContent:MetaDataOfPost[];
    pagination:Pagination;
}

export default class PageOfCategoryOnExternalScreen extends React.Component<PropsOfPageOfCategoryOnExternalScreen> {
    render() {
        const vw = this.props.viewportWidth;
        let maxWidthOfTitle = 1024;
        const title = {
            name:terms.titleOfPageOfCategory(this.props.category.name),
            maxWidth:maxWidthOfTitle,
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
                </DefaultRouteBasedNavbar>;
        }

        if (this.props.pageContent === null) {//這表示查詢作業異常
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
            categoryInfo = 
                <InformationOfCategory category={this.props.category} 
                    numberOfPostsSubjectToThisCategory={this.props.numberOfResults} />;
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
                    <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostUnderThisCategory}</div>;
            }
        }

        return (
            <React.Fragment>
                <DefaultHeaderOfArticle baseZIndex={this.props.remFontSize + 1} className="es"
                    titleBg={titleBg} title={title} appendDecorationLine={true}>
                    {categoryInfo}
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