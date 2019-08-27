import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import * as generalTerms from '../template/terms';
import { MetaDataOfPost } from '../../model/posts';
import { Category } from '../../model/terms';
import { Pagination  } from '../../model/pagination';
import {InformationOfCategory} from './categoryInfo';
import { PostsAmongParticularTaxonomy } from '../../component/template/posts-among-particular-taxonomy';
import {RouteBasedNavbarForNarrowDevices} from '../search-result/template/route-based-nav-bar';
import { LinksOfPagination } from '../search-result/template/route-based-pagination';

interface PropsOfPageOfCategoryOnSmartPhone {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    category:Category;
    numberOfResults:number;
    pageContent:MetaDataOfPost[];
    pagination:Pagination;
}

export default class PageOfCategoryOnSmartPhone extends React.Component<PropsOfPageOfCategoryOnSmartPhone> {
    render() {
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (vw + 1024) / 56;
        const title = {
            name:terms.titleOfPageOfCategory(this.props.category.name),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const styleOfInfoOfCategory = {
            fontSize:`${(vw + 464)/56}px`
        }

        const decorationLine = {
            height:fontSizeOfTitle / 3
        }

        let categoryInfo = null, results = null, paginationField = null;

        if (this.props.pagination && this.props.pagination.totalPages > 0) {
            const heightOfDirectionIcon = (vw + 796)/31;
            const fontSizeOfPageIndexes = 26;
            
            paginationField = 
                <RouteBasedNavbarForNarrowDevices baseUrl={this.props.pagination.baseUrl}
                    currentPage={this.props.pagination.currentPage} totalPages={this.props.pagination.totalPages}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} >
                        <LinksOfPagination pagination={this.props.pagination} />
                </RouteBasedNavbarForNarrowDevices>
        }

        if (this.props.pageContent === null) {
            categoryInfo = <InformationOfCategory style={styleOfInfoOfCategory} category={this.props.category} />;
            
            const styleOfPostsFetchingFailed = {
                fontSize:`${(vw + 2470) / 155}px`
            }

            results = 
                <React.Fragment>
                    <div style={styleOfPostsFetchingFailed} className="noPost">
                        {generalTerms.cannotFetchPostsInsideThePageYouHaveRequested}</div>
                    {paginationField}
                </React.Fragment>;

        } else {
            categoryInfo = <InformationOfCategory style={styleOfInfoOfCategory} category={this.props.category} 
                numberOfPostsSubjectToThisCategory={this.props.numberOfResults} />
            if (this.props.numberOfResults > 0) {
                const fontSizeOfTitleOfPost = (vw + 2772) / 153;
                const gapBetweenDateAndTitle = 4 * fontSizeOfTitleOfPost - 70;
                const settingsOfPost = {
                    paddingLeftRight:(0.5 * vw - 5) * this.props.remFontSize / 310,
                    fontSizeOfDate:(vw + 2466) / 153,
                    gapBetweenDateAndTitle:gapBetweenDateAndTitle,
                    fontSizeOfTitle:fontSizeOfTitleOfPost,
                    gapBetweenIconAndCategories:(vw - 10) * 14 /* 分類與標籤字體大小 */ / 620
                }
    
                results = 
                    <React.Fragment>
                        <PostsAmongParticularTaxonomy pageContent={this.props.pageContent} numberOfPostInARow={1} 
                            post={settingsOfPost} />
                        {paginationField}
                    </React.Fragment>
            } else {
                const styleOfNoPostUnderThisCategory = {
                    fontSize:`${(vw + 2470) / 155}px`
                }
    
                results = 
                    <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostUnderThisCategory}</div>;
            }
        } 

        return (
            <React.Fragment>
                <MobilePostHeader className="sp" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    {categoryInfo}
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