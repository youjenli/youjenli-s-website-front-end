import * as React from 'react';
import {ResultsOfSearch} from '../../../model/search-results';
import * as termsOfPost from '../../home/recentPosts/terms';
import {MetaOfPost } from '../../../model/post';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';
import { CategoryIcon, TagIcon } from '../../home/recentPosts/icons';

interface PropsOfPostOnPageOfSearchResults {
    post:MetaOfPost;
    width?:number;
    paddingLeftRight?:number;
    date:{
        fontSize?:number;
        marginRight?:number;
    }
    title?:{
        fontSize?:number;
    }
    postInfo?:{
        fontSize?:number;
        marginRightOfIcon?:number;
    }
    excerpt?:{
        fontSize?:number;
    }
}

export class PostOnPageOfSearchResults extends React.Component<PropsOfPostOnPageOfSearchResults> {
    render() {
        let styleOfPost = {};
        if (this.props.width) {
            styleOfPost['width'] =`${this.props.width}px`;
        }
        if (this.props.paddingLeftRight) {
            styleOfPost['paddingLeft'] = `${this.props.paddingLeftRight}px`,
            styleOfPost['paddingRight'] = `${this.props.paddingLeftRight}px`
        }

        const month = formatMonthOrDayTo2Digits(this.props.post.date.getMonth());
        const day = formatMonthOrDayTo2Digits(this.props.post.date.getDate());

        let styleOfDate = {};
        if (this.props.date.fontSize) {
            styleOfDate['fontSize'] = `${this.props.date.fontSize}px`;
        }
        if (this.props.date.marginRight) {
            styleOfDate['marginRight'] = `${this.props.date.marginRight}px`;
        }

        let styleOfTitle = {};
        if (this.props.title && this.props.title.fontSize) {
            styleOfTitle['fontSize'] = `${this.props.title.fontSize}px`;
        }

        let styleOfPostInfo = {}, styleOfIcon = {};
        if (this.props.postInfo) {
            if (this.props.postInfo.fontSize) {
                styleOfPostInfo['fontSize'] = `${this.props.postInfo.fontSize}px`;
            }
            if (this.props.postInfo.marginRightOfIcon) {
                styleOfIcon['marginRight'] = `${this.props.postInfo.marginRightOfIcon}px`;
            }
        }

        let categoriesElement = null;
        if (this.props.post.categories && this.props.post.categories.length > 0) {
            categoriesElement = 
                <div className="categories" style={styleOfPostInfo}>
                    <CategoryIcon style={styleOfIcon}/><span>
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
                    <CategoryIcon style={styleOfIcon}/><span className="noData">{termsOfPost.postWasNotCategorized}</span></div>
        }

        let tagsElement = null;
        if (this.props.post.tags && this.props.post.tags.length > 0) {
            tagsElement = 
                <div className="tags" style={styleOfPostInfo}>
                    <TagIcon style={styleOfIcon}/><span>
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
                    <TagIcon style={styleOfIcon}/><span className="noData">{termsOfPost.postWasNotTagged}</span></div>
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
    results:ResultsOfSearch<MetaOfPost>;
    width?:number;
    paddingLeftRight?:number;
    numberOfPostInARow:number;
    fontSizeOfDate:number;
    gapBetweenDateAndTitle?:number;
    fontSizeOfTitle:number;
    gapBetweenIconAndCategories?:number;
}

export class SearchResultsOfPost extends React.Component<PropsOfSearchResultsOfPost> {
    render() {       
        let settingsOfDate = {
            fontSize:this.props.fontSizeOfDate,
            marginRight:this.props.gapBetweenDateAndTitle
        }
        
        let settingsOfPostInfo = {
            marginRightOfIcon:this.props.gapBetweenIconAndCategories
        }
        const posts = [];
        this.props.results.pageContent.forEach((post, idx) => {
            posts.push(
                <PostOnPageOfSearchResults key={idx} post={post} width={this.props.width} paddingLeftRight={this.props.paddingLeftRight}
                    date={settingsOfDate} title={{fontSize:this.props.fontSizeOfTitle}} postInfo={settingsOfPostInfo } />
            );
        });

        const leftOverItemsAtTheLastRow = this.props.results.pageContent.length % this.props.numberOfPostInARow;
        if (leftOverItemsAtTheLastRow > 0) {
            const numberOfItemsInBlockOfResults = this.props.results.pageContent.length 
                    + this.props.numberOfPostInARow - leftOverItemsAtTheLastRow;
            const styleOfPlaceHoldingItem = {
                width:`${this.props.width}px`
            }
            for (let j = this.props.results.pageContent.length ; j < numberOfItemsInBlockOfResults ; j ++ ) {
                posts[j] = 
                    <div key={j} style={styleOfPlaceHoldingItem}>&nbsp;</div>
            }           
        }
        return <div className="results">{posts}</div>;
    }
}

