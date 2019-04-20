import * as React from 'react';
import {CategoryOfPost, TagOfPost} from '../../../model/post';
import {CategoryIcon, TagIcon, PublishIcon} from '../../home/recentPosts/icons';
import * as terms from '../../home/recentPosts/terms';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';

interface PropsOfDefaultPostHeaderWithImg {
    baseZIndex:number;
    className:string;
    titleBg:{
        paddingBottom:number;
    }
    title:{
        name:string;
        maxWidth:number;
        fontSize:number;
    }
    postInfo:{
        categories?:CategoryOfPost[];
        tags?:TagOfPost[];
        date:Date,
        modified:Date,
        wordCount:number
        paddingBottomInEM:number;
    }
    img:{
        height:number;
        url:string;    
    }
}

export default class DefaultPostHeaderWithImg extends React.Component<PropsOfDefaultPostHeaderWithImg> {
    render() {
        const styleOfPostHeader = {
            fontSize:`${this.props.title.fontSize}px`,
            zIndex:this.props.baseZIndex
        }
        const styleOfTitleBg = {
            paddingBottom:`${this.props.titleBg.paddingBottom}px`
        }
        const styleOfPostInfo = {
            width:`${this.props.title.maxWidth}px`,
            paddingBottom:`${this.props.postInfo.paddingBottomInEM}em`
        }
        let categories;
        if (this.props.postInfo.categories && this.props.postInfo.categories.length > 0) {
            categories = this.props.postInfo.categories.map(
                (category, idx, array) => {
                return (
                    <span key={idx}><a className="category">{category.name}</a>
                      { idx != array.length - 1 ? '﹒' : null }</span>);
            });
        } else {
            categories = (<span className="noData" key={0}>{terms.postWasNotCategorized}</span>);
        }

        let tags;
        if (this.props.postInfo.tags && this.props.postInfo.tags.length > 0) {
            tags = this.props.postInfo.tags.map((tag, idx, array) => {
                return (<span key={idx}><a className="tag">{tag.name}</a>
                    { idx != array.length - 1 ? '﹒' : null }</span>);
            });
        } else {
            tags = (<span className="noData" key={0}>{terms.postWasNotTagged}</span>);
        }

        const publishMonth = formatMonthOrDayTo2Digits(this.props.postInfo.date.getMonth());
        const publishDay = formatMonthOrDayTo2Digits(this.props.postInfo.date.getDate());
        
        let lastUpdate = null;
        if (this.props.postInfo.modified) {
            const modifiedMonth = formatMonthOrDayTo2Digits(this.props.postInfo.modified.getMonth());
            const modifiedDay = formatMonthOrDayTo2Digits(this.props.postInfo.modified.getDate());
            lastUpdate = `${terms.clauseSeparater}${terms.lastModified} ${this.props.postInfo.modified.getFullYear()}/${modifiedMonth}/${modifiedDay}`;
        }
        let msgAboutWordCount = `${terms.clauseSeparater}${terms.wordCount} ${this.props.postInfo.wordCount} ${terms.unitOfWord}${terms.period}`;

        const publishInfoElement = (
            <div className="publishInfo">
                <PublishIcon/><span>
                    {terms.published}&nbsp;{this.props.postInfo.date.getFullYear()}/{publishMonth}/{publishDay}
                    {lastUpdate}{msgAboutWordCount}
                </span>
            </div>);
        
        const styleOfImg = {
            width:`${this.props.title.maxWidth}px`,
            height:`${this.props.img.height}px`
        }
       
        return (
            <div id="post-header" className={this.props.className} style={styleOfPostHeader}>
                <div id="titleBg" style={styleOfTitleBg}>
                    <div className="postInfo" style={styleOfPostInfo}>
                        <div className="title">{this.props.title.name}</div>
                        <div className="categories"><CategoryIcon/>{categories}</div>
                        <div className="tags"><TagIcon />{tags}</div>
                        {publishInfoElement}
                        <img style={styleOfImg} src={this.props.img.url}/>
                    </div>
                </div>
            </div>             
        );
    }    
}