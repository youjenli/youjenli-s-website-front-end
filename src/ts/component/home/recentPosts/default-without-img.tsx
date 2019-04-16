import * as React from 'react';
import {CategoryOfPost, TagOfPost} from '../../../model/post';
import {CategoryIcon, TagIcon} from './icons';
import * as terms from './terms';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';

interface DefaultRecentPostWithoutImgProps {
    width:number;
    margin:{
        top:number;
        leftRight:number;
        bottom:number;
    }
    postInfoBar:{
        margin:{
            top:number;
            right:number;
            left:number;
        }
        padding:{
            top:number;
            left:number;
            right:number;
            bottom:number;
        }
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
        margin:{
            top:number;
            leftRight:number;
            bottom:number;
        },        
        zIndexOfReadArticle:number,
        content:string
    }
}

export default class DefaultRecentPostWithoutImg extends React.Component<DefaultRecentPostWithoutImgProps> {
    render() {
        const month = formatMonthOrDayTo2Digits(this.props.postInfoBar.titleBar.date.getMonth());
        const day = formatMonthOrDayTo2Digits(this.props.postInfoBar.titleBar.date.getDate());

        let styleOfPost = {
            width:`${this.props.width}px`,
            margin:`${this.props.margin.top}px ${this.props.margin.leftRight}px ${this.props.margin.bottom}px ${this.props.margin.leftRight}px`
        }
        const p = this.props.postInfoBar.padding;
        const m = this.props.postInfoBar.margin;
        
        const styleOfPostInfoBg = {
            padding:`${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`,
            margin:`${m.top}px ${m.right}px 0 ${m.left}px`
        }
        const styleOfDate = {
            marginRight:`${this.props.postInfoBar.titleBar.marginRightOfDate}px`
        }
        const styleOfTitleBar = {
            fontSize:`${this.props.postInfoBar.titleBar.fontSizeOfDateAndTitle}px`,
            marginBottom:`${this.props.postInfoBar.titleBar.marginBottom}px`
        }        
        const styleOfIcon = {
            /* icon 的長寬必須透過 minWidth, minHeight 設定，否則當分類或標籤列使用 flex 來分配欄寬時，icon 的尺寸會被壓縮。
                為什麼會壓縮的原因還不是很清楚，只知道照以下這樣設定可以解決此問題。
            */
            minWidth:`${this.props.postInfoBar.fontSizeOfCategoriesAndTags}px`,
            minHeight:`${this.props.postInfoBar.fontSizeOfCategoriesAndTags}px`,
            marginRight:`${this.props.postInfoBar.marginRightOfIconOfCategoriesAndTags}px`
        };
        let styleOfCategories = {
            fontSize:`${this.props.postInfoBar.fontSizeOfCategoriesAndTags}px`
        }
        let categories;
        if (this.props.postInfoBar.categories && this.props.postInfoBar.categories.length > 0) {
            categories = this.props.postInfoBar.categories.map(
                (category, idx, array) => {
                return (<span key={idx}><a className="category">{category.name}</a>
                    { idx != array.length - 1 ? 
                        '﹒' : null }
                </span>);
            });
        } else {
            categories = (<span className="noData" key={0}>{terms.postWasNotCategorized}</span>);
        }

        let styleOfTags = {
            fontSize:`${this.props.postInfoBar.fontSizeOfCategoriesAndTags}px`,
            marginTop:`${this.props.postInfoBar.marginTopOfTags}px`
        };
        let tags;
        if (this.props.postInfoBar.tags && this.props.postInfoBar.tags.length > 0) {
            tags = this.props.postInfoBar.tags.map((tag, idx, array) => {
                return (<span key={idx}><a className="tag">{tag.name}</a>
                    { idx != array.length - 1 ? 
                        '﹒' : null }
                </span>);
            });
        } else {
            tags = (<span className="noData" key={0}>{terms.postWasNotTagged}</span>);
        }
        
        const em = this.props.excerpt.margin;
        const styleOfExcerpt = {
            fontSize:`${this.props.excerpt.fontSize}px`,
            margin:`${em.top}px ${em.leftRight}px ${em.bottom}px ${em.leftRight}px`
        }
        const e = this.props.excerpt;
        const styleOfReadArticle = {
            fontSize:`${e.fontSize}px`,
            right:`${e.margin.leftRight}px`,
            bottom:`${e.margin.bottom}px`,
            zIndex:e.zIndexOfReadArticle
        }

        //要實驗 title 延長時的處理方式
        return (
            <article className="rPost plain" style={styleOfPost}>
                <div className="postInfoBg" style={styleOfPostInfoBg}>
                    <div className="titleBar" style={styleOfTitleBar}>
                        <span className="date" style={styleOfDate}>
                            {this.props.postInfoBar.titleBar.date.getFullYear()}<br />{month}.{day}</span>
                        <span className="title">{this.props.postInfoBar.titleBar.titleName}</span>
                    </div>
                    <div style={styleOfCategories} className="categories">
                        <CategoryIcon style={styleOfIcon}/>
                        <span>{categories}</span>                        
                    </div>
                    <div style={styleOfTags} className="tags">
                        <TagIcon style={styleOfIcon}/>
                        <span>{tags}</span>
                    </div>
                </div>
                {
                    this.props.excerpt.content ?
                    <p className="excerpt" style={styleOfExcerpt}>{this.props.excerpt.content}</p> :
                    <p className="noExcerpt" style={styleOfExcerpt}>{terms.postDoesNotHaveExcerpt}</p>
                    /* 當畫面上沒有摘抄時，要顯示替代內容，否則會把繼續閱讀的連結擠上去 */
                }
                <a className="read" style={styleOfReadArticle}>{terms.readArticle}</a>
            </article>
        )
    }
}