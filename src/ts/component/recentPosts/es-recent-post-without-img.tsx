import * as React from 'react';
import {CategoryOfPost, TagOfPost} from '../../model/post';
import {CategoryIcon, TagIcon} from './icons';
import * as terms from './terms';
import {formatMonthOrDayTo2Digits} from '../../service/date-formatter';

interface ExternalScreenRecentPostWithoutImgProps {
    width:number;
    minHeight:number;
    postInfoBar:{
        marginTopRightLeft:number,
        paddingTopRightLeft:number,
        paddingBottom:number,
        titleBar:{
            date:Date,
            titleName:string,            
            fontSizeOfDateAndTitle:number,           
            marginRightOfDate:number,            
            marginBottom:number
        }
        categories:CategoryOfPost[],
        tags:TagOfPost[],
        marginRightOfIconOfCategoriesAndTags:number,
        fontSizeOfCategoriesAndTags:number,
        marginTopOfTags:number
    }
    excerpt:{
        fontSize:number,
        leftRightMargin:number,
        bottomMargin:number,
        zIndexOfReadArticle:number,
        content:string
    }
}

export default class ExternalScreenRecentPostWithoutImg extends React.Component<ExternalScreenRecentPostWithoutImgProps> {
    render() {
        const month = formatMonthOrDayTo2Digits(this.props.postInfoBar.titleBar.date.getMonth());
        const day = formatMonthOrDayTo2Digits(this.props.postInfoBar.titleBar.date.getDate());

        let styleOfPost = {
            width:`${this.props.width}px`,
            minHeight:`${this.props.minHeight}px`
        }
        const styleOfTitleBar = {
            fontSize:`${this.props.postInfoBar.titleBar.fontSizeOfDateAndTitle}px`,
            marginBottom:`${this.props.postInfoBar.titleBar.marginBottom}px`
        }
        const styleOfDate = {
            marginRight:`${this.props.postInfoBar.titleBar.marginRightOfDate}px`
        }
        const styleOfIcon = {
            width:`${this.props.postInfoBar.fontSizeOfCategoriesAndTags}px`,
            height:`${this.props.postInfoBar.fontSizeOfCategoriesAndTags}px`,
            marginRight:`${this.props.postInfoBar.marginRightOfIconOfCategoriesAndTags}px`
        };
        let styleOfCategories = {
            fontSize:`${this.props.postInfoBar.fontSizeOfCategoriesAndTags}px`
        }
        let categories;
        if (this.props.postInfoBar.categories.length > 0) {
            categories = this.props.postInfoBar.categories.map(
                (category, idx, array) => {
                return (<span><a className="category">{category.name}</a>
                    { idx != array.length - 1 ? 
                        '﹒' : null }
                </span>);
            });
        } else {
            categories = (<span className="noData">{terms.postWasNotCategorized}</span>);
        }

        let styleOfTags = {
            fontSize:`${this.props.postInfoBar.fontSizeOfCategoriesAndTags}px`,
            marginTop:`${this.props.postInfoBar.marginTopOfTags}px`
        };
        let tags;
        if (this.props.postInfoBar.tags.length > 0) {
            tags = this.props.postInfoBar.tags.map((tag, idx, array) => {
                return (<span><a className="tag">{tag.name}</a>
                    { idx != array.length - 1 ? 
                        '﹒' : null }
                </span>);
            });
        } else {
            tags = (<span className="noData">{terms.postWasNotTagged}</span>);
        }
        

        const p = this.props.postInfoBar.paddingTopRightLeft;
        const styleOfPostInfoBg = {
            padding:`${p}px ${p}px ${this.props.postInfoBar.paddingBottom}px ${p}px`,
            margin:`${this.props.postInfoBar.marginTopRightLeft}px ${this.props.postInfoBar.marginTopRightLeft}px 0 ${this.props.postInfoBar.marginTopRightLeft}px`
        }
        const styleOfExcerpt = {
            fontSize:`${this.props.excerpt.fontSize}px`,
            margin:`${this.props.excerpt.fontSize}px ${this.props.excerpt.leftRightMargin}px ${this.props.excerpt.bottomMargin}px ${this.props.excerpt.leftRightMargin}px`
        }
        const styleOfReadArticle = {
            right:`${this.props.excerpt.leftRightMargin}px`,
            bottom:`${this.props.excerpt.bottomMargin}px`,
            zIndex:this.props.excerpt.zIndexOfReadArticle
        }

        //要實驗 title 延長時的處理方式
        return (
            <article className="rPost plain" style={styleOfPost}>
                <div className="postInfoBg" style={styleOfPostInfoBg}>
                    <div className="titleBar" style={styleOfTitleBar}>
                        <span className="date" style={styleOfDate}>
                            {this.props.postInfoBar.titleBar.date.getFullYear()}<br />{month}.{day}</span>
                        <h3 className="title">{this.props.postInfoBar.titleBar.titleName}</h3>
                    </div>
                    <h4 style={styleOfCategories} className="categories">
                        <CategoryIcon style={styleOfIcon}/>
                        {categories}
                    </h4>
                    <h4 style={styleOfTags} className="tags">
                        <TagIcon style={styleOfIcon}/>
                        {tags}
                    </h4>
                </div>
                <p className="excerpt" 
                    style={styleOfExcerpt}>{this.props.excerpt.content}
                </p>
                <a className="read" style={styleOfReadArticle}>{terms.readArticle}</a>
            </article>
        )
    }
}