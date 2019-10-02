import * as React from 'react';
import {MetaDataOfPage} from '../../model/posts';
import * as termsOfPost from '../home/recentPosts/terms';
import * as terms from './terms';
import {formatMonthOrDayTo2Digits} from '../../service/formatters';
import {CategoryIcon} from './icons';
import {isNotBlank} from '../../service/validator';

interface PropsOfTemplateOfFoundPage {
    page:MetaDataOfPage;
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

export class TemplateOfFoundPage extends React.Component<PropsOfTemplateOfFoundPage> {
    render() {
        let styleOfPost = {};
        if (this.props.width) {
            styleOfPost['width'] =`${this.props.width}px`;
        }
        if (this.props.paddingLeftRight) {
            styleOfPost['paddingLeft'] = `${this.props.paddingLeftRight}px`;
            styleOfPost['paddingRight'] = `${this.props.paddingLeftRight}px`;
        }

        const month = formatMonthOrDayTo2Digits(this.props.page.date.getMonth());
        const day = formatMonthOrDayTo2Digits(this.props.page.date.getDate());

        let styleOfDate = {};
        if (this.props.date.fontSize) {
            styleOfDate['fontSize'] = `${this.props.date.fontSize}px`;
        }
        if (this.props.date.marginRight) {
            styleOfDate['marginRight'] = `${this.props.date.marginRight}px`;
        }

        let titleText = null, classesOfTitle = 'title';
        if (isNotBlank(this.props.page.title)) {
            titleText = this.props.page.title;
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

        let parentElement = null;
        if (this.props.page.parent) {
            parentElement = 
            <div className="parent" style={styleOfPostInfo}>
                <CategoryIcon style={styleOfIcon}/>
                <terms.LinkOfParent name={this.props.page.parent.title} url={this.props.page.parent.url} />
            </div>;
        } else if (this.props.page.parent === null) {
            parentElement = 
                <div className="parent" style={styleOfPostInfo}>
                    <CategoryIcon style={styleOfIcon}/>
                    <span className="dataNotFound">{termsOfPost.cannotFoundTaxonomies}</span>
                </div>;
        } else {// parent 是 undefined 的狀況
            parentElement = 
                <div className="parent" style={styleOfPostInfo}>
                    <CategoryIcon style={styleOfIcon}/><span className="noData">{termsOfPost.parentPageDoesNotExist}</span></div>;
        }

        const styleOfExcerpt = {};
        if(this.props.excerpt && this.props.excerpt.fontSize) {
            styleOfExcerpt['fontSize'] = `${this.props.excerpt.fontSize}px`
        }

        let excerpt = null;
        if (isNotBlank(this.props.page.excerpt)) {
            excerpt = this.props.page.excerpt;
        } else {
            excerpt = terms.excerptIsUnavailable;
        }

        const learnMoreAboutThisArticle = termsOfPost.learnMoreAboutThisArticle(this.props.page.title);
        return (
            <article className="post" style={styleOfPost}>
                <div className="titleBar">
                    <div className="date" style={styleOfDate}>
                        {this.props.page.date.getFullYear()}<br />{month}.{day}
                    </div>
                    <a className={classesOfTitle} style={styleOfTitle} href={this.props.page.url} title={learnMoreAboutThisArticle} data-navigo>
                        {titleText}</a>
                </div>
                {parentElement}
                <div className="excerpt" style={styleOfExcerpt}>
                    <a href={this.props.page.url} title={learnMoreAboutThisArticle} data-navigo>{excerpt}</a></div>
            </article>
        );
    }
}