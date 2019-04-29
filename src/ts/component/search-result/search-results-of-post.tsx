import * as React from 'react';
import {ResultsOfSearch} from '../../model/search-results';
import * as icons from '../home/recentPosts/icons';
import * as directions from './direction';
import * as terms from './terms';
import * as termsOfPost from '../home/recentPosts/terms';
import {MetaOfPost } from '../../model/post';
import {formatMonthOrDayTo2Digits} from '../../service/date-formatter';
import { CategoryIcon, TagIcon } from '../home/recentPosts/icons';

interface PropsOfPostOnPageOfSearchResults {
    post:MetaOfPost;
    width:number;
    date:{
        fontSize?:number;
    }
    title?:{
        fontSize?:number;
    }
    postInfo?:{
        fontSize?:number;
    }
    excerpt?:{
        fontSize?:number;
    }
}

export class PostOnPageOfSearchResults extends React.Component<PropsOfPostOnPageOfSearchResults> {
    render() {
        const styleOfPost = {
            width:`${this.props.width}px`
        }

        const month = formatMonthOrDayTo2Digits(this.props.post.date.getMonth());
        const day = formatMonthOrDayTo2Digits(this.props.post.date.getDate());

        let styleOfDate = {};
        if (this.props.date.fontSize) {
            styleOfDate['fontSize'] = `${this.props.date.fontSize}px`;
        }

        let styleOfTitle = {};
        if (this.props.title && this.props.title.fontSize) {
            styleOfTitle['fontSize'] = `${this.props.title.fontSize}px`;
        }

        let styleOfPostInfo = {};
        if (this.props.postInfo && this.props.postInfo.fontSize) {
            styleOfPostInfo['fontSize'] = `${this.props.postInfo.fontSize}px`;
        }

        let categoriesElement = null;
        if (this.props.post.categories && this.props.post.categories.length > 0) {
            categoriesElement = 
                <div className="categories" style={styleOfPostInfo}>
                    <CategoryIcon /><span>
                    {this.props.post.categories.map((item, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {idx > 0 ? '．' : null}<a>{item.name}</a>
                            </React.Fragment>
                        );                        
                    })}</span>
                </div>;
        } else {
            categoriesElement = 
                <div className="categories" style={styleOfPostInfo}>
                    <CategoryIcon /><span className="noData">{termsOfPost.postWasNotCategorized}</span></div>
        }

        let tagsElement = null;
        if (this.props.post.tags && this.props.post.tags.length > 0) {
            tagsElement = 
                <div className="tags" style={styleOfPostInfo}>
                    <TagIcon /><span>
                    {this.props.post.tags.map((item, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {idx > 0 ? '．' : null}<a>{item.name}</a>
                            </React.Fragment>
                        );
                    })}</span>
                </div>;
        } else {
            tagsElement =
                <div className="tags" style={styleOfPostInfo}>
                    <TagIcon /><span className="noData">{termsOfPost.postWasNotTagged}</span></div>
        }

        const styleOfExcerpt = {};
        if(this.props.excerpt && this.props.excerpt.fontSize) {
            styleOfExcerpt['fontSize'] = `${this.props.excerpt.fontSize}px`
        }

        return (
            <article className="post" style={styleOfPost}>
                <div className="titleBar">
                    <div className="date" style={styleOfDate}>
                        {this.props.post.date.getFullYear()}<br />{month}.{day}
                    </div>
                    <a className="title" style={styleOfTitle}>{this.props.post.title}</a>
                </div>
                {categoriesElement}
                {tagsElement}
                <div className="excerpt" style={styleOfExcerpt}>{this.props.post.excerpt || ''}</div>
            </article>
        );
    }
}

interface PropsOfSearchResultsOfPost {
    inquire:string;
    results:ResultsOfSearch<MetaOfPost>;
    width:number;
    fontSizeOfHeading:number;
    fontSizeOfDate:number;
    fontSizeOfTitle:number;
    heightOfDirectionIcon:number;
    fontSizeOfPageIndexes:number;
}

export class SearchResultsOfPost extends React.Component<PropsOfSearchResultsOfPost> {
    render() {
        const styleOfHeading = {
            fontSize:`${this.props.fontSizeOfHeading}px`
        }
                
        let contents = null;
        if (this.props.results.totalNumberOfPages > 0) {
            let pages = [], pageIndexes = null;
            if (this.props.results.totalNumberOfPages <= 10) {
                for (let i = 1 ; i <= this.props.results.totalNumberOfPages ; i ++) {
                    if (i == this.props.results.currentPageNumber) {
                        pages.push(<span className="current" key={i}><a>{i}</a></span>);
                    } else {
                        pages.push(<a key={i}>{i}</a>);
                    }
                }
            } else {
                let foundCurrentPage = false;
                let loopEnd = 3;
                const current = this.props.results.currentPageNumber;
                const total = this.props.results.totalNumberOfPages;
                for (let i = 1 ; i <= loopEnd ; i ++) {
                    if (i == current) {
                        pages.push(<a className="current" key={i}>{i}</a>);
                        loopEnd = i + 3;
                        foundCurrentPage = true;
                    } else {
                        pages.push(<a key={i}>{i}</a>);
                    }
                }
                pages.push(<span key={loopEnd + 1}>…</span>);

                if (!foundCurrentPage) {
                    let start = (current - 2 > loopEnd ? current - 2 : loopEnd + 1 );
                    let stop = (current + 2 < total - 2 ? current + 2 : total - 3 );
                    for (let j = start ; j <= stop ; j ++) {
                        if (j == current) {
                            pages.push(<a className="current" key={j}>{j}</a>);
                        } else {
                            pages.push(<a key={j}>{j}</a>);
                        }
                    }
                    if (stop < total - 3) {
                        pages.push(<span key={stop + 1}>…</span>);
                    }
                } else {
                    for (let k = total - 2 ; k <= total ; k ++) {
                        pages.push(<a key={k}>{k}</a>);
                    }
                }
            }
            pageIndexes = 
                <span className="indexes">{pages}</span>;

            const styleOfNavbar = {
                fontSize:`${this.props.fontSizeOfPageIndexes}px`
            }

            const styleOfDirection = {
                height:`${this.props.heightOfDirectionIcon}px`
            }

            /* 不知道為什麼，無法直接給 nav 套用 visibility:hidden 樣式，於是只好使用改變類別名稱以套用樣式的做法 */
            let additionalClassNameOfPrevNav = '', additionalClassNameOfNextNav = '';
            if (this.props.results.currentPageNumber == 1) {
                additionalClassNameOfPrevNav = ' hidden';
            }
            if (this.props.results.currentPageNumber == this.props.results.totalNumberOfPages) {
                additionalClassNameOfNextNav = ' hidden';
            }

            contents = 
                <React.Fragment>
                    <div className="results">
                        {this.props.results.pageContent.map((post, idx) => {
                            return (<PostOnPageOfSearchResults key={idx} post={post} width={this.props.width} 
                                    date={{fontSize:this.props.fontSizeOfDate}} title={{fontSize:this.props.fontSizeOfTitle}} />)
                        })}    
                    </div>
                    <nav className="navbar" style={styleOfNavbar}>
                        <span className={"nav" + additionalClassNameOfPrevNav}><directions.LeftDirection style={styleOfDirection}/>{terms.previousPage}</span>
                        {pageIndexes}
                        <span className={"nav" + additionalClassNameOfNextNav}>{terms.nextPage}<directions.RightDirection style={styleOfDirection}/></span>
                    </nav>
                </React.Fragment>
        } else {
            contents =
                <div className="results noData">{terms.generatePostsNotFoundNotificationMsg(this.props.inquire)}</div>
        }

        return (
            <section className="posts">
                <h3 className="heading" style={styleOfHeading}><icons.ArticleIcon />{terms.headingOfSearchResultsOfPosts} </h3>
                {contents}
            </section>
        );
    }
}

