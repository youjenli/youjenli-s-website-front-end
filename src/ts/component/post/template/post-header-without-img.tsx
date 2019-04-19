import * as React from 'react';
import {CategoryOfPost, TagOfPost} from '../../../model/post';
import {CategoryIcon, TagIcon, PublishIcon} from '../../home/recentPosts/icons';
import * as terms from '../../home/recentPosts/terms';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';

interface PropsOfPostHeaderWithoutImgOnExternalScreen {
    baseZIndex:number;
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
        date:Date;
        modified:Date;
        wordCount:number;
        paddingBottom:string;
    }
}

export default class PostHeaderWithoutImgOnExternalScreen extends React.Component<PropsOfPostHeaderWithoutImgOnExternalScreen> {
    render() {
        const styleOfPostHeader = {
            fontSize:`${this.props.title.fontSize}px`,
        }
        const styleOfTitleBg = {
            paddingBottom:`${this.props.titleBg.paddingBottom}px`,
            zIndex:this.props.baseZIndex + 2
        }
        const styleOfPostInfo = {
            width:`${this.props.title.maxWidth}px`,
            paddingBottom:this.props.postInfo.paddingBottom
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

        const styleOfDec = {
            zIndex:this.props.baseZIndex + 1
        }
        const decoration = <div id="post-dec" style={styleOfDec}></div>;
       
        return (
            <div id="post-header" style={styleOfPostHeader}>
                <div id="titleBg" style={styleOfTitleBg}>
                    <div className="postInfo" style={styleOfPostInfo}>
                        <div className="title">{this.props.title.name}</div>
                        <div className="categories"><CategoryIcon/>{categories}</div>
                        <div className="tags"><TagIcon />{tags}</div>
                        {publishInfoElement}
                        {this.props.children}
                    </div>
                </div>
                {decoration}
            </div>             
        );
    }    
}