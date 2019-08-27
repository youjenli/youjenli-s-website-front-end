import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import * as generalTerms from '../template/terms';
import { MetaDataOfPost } from '../../model/posts';
import { Category } from '../../model/terms';
import { Pagination } from '../../model/pagination';
import {InformationOfCategory} from './categoryInfo';
import { PostsAmongParticularTaxonomy } from '../../component/template/posts-among-particular-taxonomy';
import {DefaultRouteBasedNavbar } from '../search-result/template/route-based-nav-bar';
import { LinksOfPagination } from '../search-result/template/route-based-pagination';

interface PropsOfPageOfCategoryOnTabletScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    category:Category;
    numberOfResults:number;
    pageContent:MetaDataOfPost[];
    pagination:Pagination;
}

export default class PageOfCategoryOnTabletScreen extends React.Component<PropsOfPageOfCategoryOnTabletScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (5 * vw + 1688) / 148;
        const title = {
            name:terms.titleOfPageOfCategory(this.props.category.name),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const styleOfInfoOfCategory = {
            fontSize:`${(vw + 1936) / 148}px`
        }

        const decorationLine = {
            height:fontSizeOfTitle / 3
        }

        let categoryInfo = null, results = null, paginationField = null;

        if (this.props.pagination && this.props.pagination.totalPages > 0) {
            const heightOfDirectionIcon = 44;
            const fontSizeOfPageIndexes = (vw + 4492)/197;
            
            paginationField = 
                <DefaultRouteBasedNavbar baseUrl={this.props.pagination.baseUrl}
                    currentPage={this.props.pagination.currentPage} totalPages={this.props.pagination.totalPages} 
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} >
                        <LinksOfPagination pagination={this.props.pagination} />
                </DefaultRouteBasedNavbar>;
        }

        if (this.props.pageContent === null) {
            categoryInfo = <InformationOfCategory style={styleOfInfoOfCategory} category={this.props.category} />;

            const styleOfPostsFetchingFailed = {
                fontSize:`${(3 * vw + 2050) / 197}px`
            }

            results = 
                <React.Fragment>
                    <div style={styleOfPostsFetchingFailed} className="noPost">
                        {generalTerms.cannotFetchPostsInsideThePageYouHaveRequested}</div>
                    {paginationField}
                </React.Fragment>;
        } else {
            categoryInfo =
                <InformationOfCategory style={styleOfInfoOfCategory} category={this.props.category} 
                    numberOfPostsSubjectToThisCategory={this.props.numberOfResults} />;
            if (this.props.numberOfResults > 0) {
                const gapBetweenTwoPosts = (0.5 * vw + 115) * this.props.remFontSize / 430;
                const widthOfPost = (maxWidthOfTitle - gapBetweenTwoPosts) / 2;
                const fontSizeOfTitleOfPost = (vw + 2708) / 193;
                const gapBetweenDateAndTitle = (3 * fontSizeOfTitleOfPost - 40) / 2;
                const settingsOfPost = {
                    paddingLeftRight:(0.5 * vw + 709) * this.props.remFontSize / 788,
                    fontSizeOfDate:(vw + 2322) / 193,
                    gapBetweenDateAndTitle:gapBetweenDateAndTitle,
                    fontSizeOfTitle:fontSizeOfTitleOfPost
                }
                
                results = 
                    <React.Fragment>
                        <PostsAmongParticularTaxonomy pageContent={this.props.pageContent} width={widthOfPost} numberOfPostInARow={2} 
                            post={settingsOfPost} />
                        {paginationField}
                    </React.Fragment>
            } else {
                const styleOfNoPostUnderThisCategory = {
                    fontSize:`${(3 * vw + 2050) / 197}px`
                }
    
                results = 
                    <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostUnderThisCategory}</div>;
            }
        }

        return (
            <React.Fragment>
                <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    {categoryInfo}
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