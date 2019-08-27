import * as React from 'react';
import MobilePostHeader from '../template/mobile-header-of-article';
import * as terms from './terms';
import * as generalTerms from '../template/terms';
import { MetaDataOfPost } from '../../model/posts';
import {Tag} from '../../model/terms';
import {Pagination} from '../../model/pagination';
import {InformationOfTag} from './tagInfo';
import { PostsAmongParticularTaxonomy } from '../../component/template/posts-among-particular-taxonomy';
import {DefaultRouteBasedNavbar} from '../search-result/template/route-based-nav-bar';
import { LinksOfPagination } from '../search-result/template/route-based-pagination';

interface PropsOfPageOfTagOnTabletScreen {
    viewportWidth:number;
    baseZIndex:number;
    remFontSize:number;
    tag:Tag;
    numberOfResults:number;
    pageContent:MetaDataOfPost[];
    pagination:Pagination;
}

export default class PageOfTagOnTabletScreen extends React.Component<PropsOfPageOfTagOnTabletScreen> {
    render() {
        const vw = this.props.viewportWidth;
        const maxWidthOfTitle = vw - 2 * this.props.remFontSize;
        const fontSizeOfTitle = (5 * vw + 1688) / 148;
        const title = {
            name:terms.titleOfPageOfTag(this.props.tag.name),
            fontSize:fontSizeOfTitle,
            maxWidth:maxWidthOfTitle
        };

        const styleOfInfoOfCategory = {
            fontSize:`${(vw + 1936) / 148}px`
        }

        const decorationLine = {
            height:fontSizeOfTitle / 3
        }

        let tagInfo = null, results = null, paginationField = null;


        if (this.props.pagination && this.props.pagination.totalPages > 0) {
            const heightOfDirectionIcon = 44;
            const fontSizeOfPageIndexes = (vw + 4492)/197;

            paginationField =
                <DefaultRouteBasedNavbar totalPages={this.props.pagination.totalPages} 
                    currentPage={this.props.pagination.currentPage} baseUrl={this.props.pagination.baseUrl}
                    heightOfDirectionIcon={heightOfDirectionIcon} fontSizeOfPageIndexes={fontSizeOfPageIndexes} >
                        <LinksOfPagination pagination={this.props.pagination} />
                </DefaultRouteBasedNavbar>
        }

        if (this.props.pageContent === null) {
            tagInfo = <InformationOfTag tag={this.props.tag} style={styleOfInfoOfCategory} />;
            
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
            tagInfo = 
                <InformationOfTag tag={this.props.tag} style={styleOfInfoOfCategory} 
                    numberOfPostsMarkedByThisTag={this.props.numberOfResults} />;
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
                    <div style={styleOfNoPostUnderThisCategory} className="noPost">{terms.noPostMarkedByThisTag}</div>;
            }
        }

        return (
            <React.Fragment>
                <MobilePostHeader className="tb" baseZIndex={this.props.baseZIndex} 
                    title={title} decorationLine={decorationLine} >
                    {tagInfo}
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