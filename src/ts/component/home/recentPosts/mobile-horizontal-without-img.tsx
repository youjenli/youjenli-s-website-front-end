import * as React from 'react';
import {Category, Tag} from '../../../model/terms';
import {CategoryIcon, TagIcon, PublishIcon} from '../../template/icons';
import * as terms from './terms';
import {formatMonthOrDayTo2Digits} from '../../../service/formatters';
import {isNotBlank} from '../../../service/validator';

interface MobileHorizontalRecentPostWithoutImgProps {
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
        title:{
            titleName:string,
            fontSizeOfDateAndTitle:number,
            marginBottom:number
        },
        categories:Category[],
        tags:Tag[],
        date:Date,
        modified:Date,
        marginRightOfIcon:number,
        fontSizeOfCategoriesTagsAndDate:number,
        marginTopOfTags:number,
        
    }
    excerpt:{
        fontSize:number;
        margin:{
            top:number;
            leftRight:number;
            bottom:number;
        },        
        zIndexOfReadArticle:number;
        content:string;
        urlOfPost:string;
    }
}

export default class MobileHorizontalRecentPostWithoutImg extends React.Component<MobileHorizontalRecentPostWithoutImgProps> {
    render() {

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
        const styleOfTitle = {
            fontSize:`${this.props.postInfoBar.title.fontSizeOfDateAndTitle}px`,
            marginBottom:`${this.props.postInfoBar.title.marginBottom}px`,
            display:'block' 
            /*因為桌面版無圖片近期文章的標題不需要以 block 方式呈現，
              所以這邊才為有此需求的行動版無圖片近期文章標題另外加上樣式*/
        }

        let titleText = null, classesOfTitle = 'title';
        if (isNotBlank(this.props.postInfoBar.title.titleName)) {
            titleText = this.props.postInfoBar.title.titleName;
        } else {
            titleText = terms.titleFieldIsBlank;
            classesOfTitle += ' blank';
        }

        const widthOfIcon = `${this.props.postInfoBar.fontSizeOfCategoriesTagsAndDate}px`;
        const heightOfIcon = `${this.props.postInfoBar.fontSizeOfCategoriesTagsAndDate}px`;
        const styleOfIcon = {
            /* icon 的長寬在 chrome 上面必須透過 minWidth, minHeight 設定，
               否則當分類或標籤列使用 flex 來分配欄寬時，icon 的尺寸會被壓縮。
               為什麼會壓縮的原因還不是很清楚，只知道照以下這樣設定可以解決此問題。
            */
            minWidth:widthOfIcon,
            minHeight:heightOfIcon,
            width:widthOfIcon,
            height:heightOfIcon,
            marginRight:`${this.props.postInfoBar.marginRightOfIcon}px`
        };
        let styleOfCategories = {
            fontSize:`${this.props.postInfoBar.fontSizeOfCategoriesTagsAndDate}px`
        }

        let categories = null;
        let dataOfCategories = this.props.postInfoBar.categories;
        if (dataOfCategories === null) {
            categories = <span className="dataNotFound">{terms.cannotFoundTaxonomies}</span>;
        } else if (dataOfCategories.length > 0) {
            categories = dataOfCategories.map((category, idx, array) => {
                return (
                <span key={idx}>
                    <a className="category" href={category.url} data-navigo>{category.name}</a>
                    { idx < array.length - 1 ? '．' : null }
                </span>)
            });
        } else {
            categories = (<span className="noData" key={0}>{terms.postWasNotCategorized}</span>);
        }

        let styleOfTagsAndPublishDate = {
            fontSize:`${this.props.postInfoBar.fontSizeOfCategoriesTagsAndDate}px`,
            marginTop:`${this.props.postInfoBar.marginTopOfTags}px`
        };
        
        let tags;
        if (this.props.postInfoBar.tags === null) {
            tags = <span className="dataNotFound">{terms.cannotFoundTaxonomies}</span>;
            //todo 實作這裡的異常處理方式
        } else if (this.props.postInfoBar.tags.length > 0) {
            tags = this.props.postInfoBar.tags.map((tag, idx, array) => {
                return (<span key={idx}><a className="tag" href={tag.url} data-navigo>{tag.name}</a>
                    { idx < array.length - 1 ? '．' : null }
                </span>);
            });
        } else {
            tags = (<span className="noData" key={0}>{terms.postWasNotTagged}</span>);
        }
        
        const publishMonth = formatMonthOrDayTo2Digits(this.props.postInfoBar.date.getMonth() + 1);
        const publishDay = formatMonthOrDayTo2Digits(this.props.postInfoBar.date.getDate());
        
        let lastUpdate = null;
        if (this.props.postInfoBar.modified) {
            const modifiedMonth = formatMonthOrDayTo2Digits(this.props.postInfoBar.modified.getMonth() + 1);
            const modifiedDay = formatMonthOrDayTo2Digits(this.props.postInfoBar.modified.getDate());
            lastUpdate = `${terms.infoSeparater}${terms.lastModified} ${this.props.postInfoBar.modified.getFullYear()}/${modifiedMonth}/${modifiedDay}`;
        }

        const publishInfoElement = (
            <div style={styleOfTagsAndPublishDate} className="publishInfo">
                <PublishIcon style={styleOfIcon}/><span>
                    {terms.published}&nbsp;{this.props.postInfoBar.date.getFullYear()}/{publishMonth}/{publishDay}
                    {lastUpdate}
                </span>
            </div>);

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
                    <a href={this.props.excerpt.urlOfPost} className={classesOfTitle} style={styleOfTitle} data-navigo>
                        {titleText}</a>
                    <div style={styleOfCategories} className="categories">
                        <CategoryIcon style={styleOfIcon}/>
                        <span>{categories}</span>
                    </div>
                    <div style={styleOfTagsAndPublishDate} className="tags">
                        <TagIcon style={styleOfIcon}/>
                        <span>{tags}</span>
                    </div>
                    {publishInfoElement}
                </div>
                {
                    this.props.excerpt.content ?
                    <p className="excerpt" style={styleOfExcerpt}>{this.props.excerpt.content}</p> :
                    <p className="excerpt blank" style={styleOfExcerpt}>{terms.postDoesNotHaveExcerpt}</p>
                    /* 當畫面上沒有摘抄時，要顯示替代內容，否則會把繼續閱讀的連結擠上去 */
                }
                <a className="read" href={this.props.excerpt.urlOfPost} data-navigo
                    style={styleOfReadArticle}>{terms.readArticle}</a>
            </article>
        )
    }
}