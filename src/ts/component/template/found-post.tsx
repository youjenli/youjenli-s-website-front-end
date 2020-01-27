import * as React from 'react';
import {MetaDataOfPost} from '../../model/posts';
import * as termsOfPost from '../home/recentPosts/terms';
import * as termsOfSearchResults from '../search-result/terms';
import * as terms from './terms';
import {formatMonthOrDayTo2Digits} from '../../service/formatters';
import { CategoryIcon, TagIcon } from './icons';
import {isNotBlank} from '../../service/validator';

interface PropsOfTemplateFoundPost {
    post:MetaDataOfPost;
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

export class TemplateOfFoundPost extends React.Component<PropsOfTemplateFoundPost> {
    render() {
        let styleOfPost = {};
        if (this.props.width) {
            styleOfPost['width'] =`${this.props.width}px`;
        }
        if (this.props.paddingLeftRight) {
            styleOfPost['paddingLeft'] = `${this.props.paddingLeftRight}px`;
            styleOfPost['paddingRight'] = `${this.props.paddingLeftRight}px`;
        }

        const month = formatMonthOrDayTo2Digits(this.props.post.date.getMonth() + 1);
        const day = formatMonthOrDayTo2Digits(this.props.post.date.getDate());

        let styleOfDate = {};
        if (this.props.date.fontSize) {
            styleOfDate['fontSize'] = `${this.props.date.fontSize}px`;
        }
        if (this.props.date.marginRight) {
            styleOfDate['marginRight'] = `${this.props.date.marginRight}px`;
        }

        let titleText = null, classesOfTitle = 'title';
        if (isNotBlank(this.props.post.title)) {
            titleText = this.props.post.title;
        } else {
            titleText = terms.titleIsUnavailable;
            classesOfTitle += ' blank';
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
        if (this.props.post.categories === null) {
            categoriesElement = 
                <div className="categories" style={styleOfPostInfo}>
                    <CategoryIcon style={styleOfIcon}/>
                    <span className="dataNotFound">{termsOfPost.cannotFoundTaxonomies}</span>
                </div>;
        } else if (this.props.post.categories.length > 0) {
            categoriesElement = 
            <div className="categories" style={styleOfPostInfo}>
                <CategoryIcon style={styleOfIcon}/><span>
                {this.props.post.categories.map((item, idx) => {
                    return (
                        <React.Fragment key={idx}>
                            {idx > 0 ? '．' : null}
                            <a href={item.url} title={termsOfSearchResults.learnMoreAboutThisTaxonomy(termsOfSearchResults.Taxonomy.category, item.name)} data-navigo>{item.name}</a>
                        </React.Fragment>
                    );
                })}</span>
            </div>;
        } else {
            categoriesElement = 
                <div className="categories" style={styleOfPostInfo}>
                    <CategoryIcon style={styleOfIcon}/><span className="noData">{termsOfPost.postWasNotCategorized}</span></div>;
        }
        
        let tagsElement = null;
        if (this.props.post.tags === null) {
            tagsElement = 
                <div className="tags" style={styleOfPostInfo}>
                    <TagIcon style={styleOfIcon}/>
                    <span className="dataNotFound">{termsOfPost.cannotFoundTaxonomies}</span>
                </div>;
        } else if (this.props.post.tags.length > 0 ) {
            tagsElement = 
                <div className="tags" style={styleOfPostInfo}>
                    <TagIcon style={styleOfIcon}/><span>
                    {this.props.post.tags.map((item, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {idx > 0 ? '．' : null}
                                <a href={item.url} title={termsOfSearchResults.learnMoreAboutThisTaxonomy(termsOfSearchResults.Taxonomy.tag, item.name)} data-navigo>
                                    {item.name}</a>
                            </React.Fragment>
                        );
                    })}</span>
                </div>;
        } else {
            tagsElement =
                <div className="tags" style={styleOfPostInfo}>
                    <TagIcon style={styleOfIcon}/><span className="noData">{termsOfPost.postWasNotTagged}</span></div>;
        }

        const styleOfExcerpt = {};
        if(this.props.excerpt && this.props.excerpt.fontSize) {
            styleOfExcerpt['fontSize'] = `${this.props.excerpt.fontSize}px`
        }

        let excerpt = null;
        if (isNotBlank(this.props.post.excerpt)) {
            excerpt = this.props.post.excerpt;
        } else {
            excerpt = terms.excerptIsUnavailable;
        }

        const learnMoreAboutThisArticle = termsOfPost.learnMoreAboutThisArticle(this.props.post.title);
        return (
            <article className="post" style={styleOfPost}>
                <div className="titleBar">
                    <div className="date" style={styleOfDate}>
                        {this.props.post.date.getFullYear()}<br />{month}.{day}
                    </div>
                    <a className={classesOfTitle} style={styleOfTitle} href={this.props.post.url} title={learnMoreAboutThisArticle} data-navigo>
                        {titleText}</a>
                </div>
                {categoriesElement}
                {tagsElement}
                <div className="excerpt" style={styleOfExcerpt}>
                    <a href={this.props.post.url} title={learnMoreAboutThisArticle} data-navigo>{excerpt}</a></div>
            </article>
        );
    }
}