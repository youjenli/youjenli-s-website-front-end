import * as React from 'react';
import {CategoryOfPost, TagOfPost} from '../../../model/post';
import {CategoryIcon, TagIcon, PublishIcon} from '../../home/recentPosts/icons';
import * as terms from '../../home/recentPosts/terms';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';

interface PropsOfMobilePostHeaderWithoutImg {
    baseZIndex:number;
    className?:string;
    paddingBottom:number;
    title:{
        name:string;
        fontSize:number;
        marginBottom:number;
    }
    postInfo:{
        fontSize:number;
        marginBottom:number;
        categories?:CategoryOfPost[];
        tags?:TagOfPost[];
        date:Date;
        modified:Date;
        wordCount:number;
    }
    heightOfDecoration:number;
}

export default class MobilePostHeaderWithoutImg extends React.Component<PropsOfMobilePostHeaderWithoutImg> {
    render() {
        const styleOfPostHeader = {
            fontSize:`${this.props.title.fontSize}px`,
            paddingBottom:`${this.props.paddingBottom}px`,
            zIndex:this.props.baseZIndex + 2
        };
        const styleOfTitle = {
            marginBottom:`${this.props.title.marginBottom}px`
        }
        const postInfo = {
            fontSize:`${this.props.postInfo.fontSize}px`,
            marginBottom:this.props.postInfo.marginBottom
        };

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

        const styleOfPublishInfo = {
            fontSize:`${this.props.postInfo.fontSize}px`
        }

        const publishInfoElement = (
            <div className="publishInfo" style={styleOfPublishInfo}>
                <PublishIcon/><span>
                    {terms.published}&nbsp;{this.props.postInfo.date.getFullYear()}/{publishMonth}/{publishDay}
                    {lastUpdate}{msgAboutWordCount}
                </span>
            </div>);

        const styleOfDec = {
            height:`${this.props.heightOfDecoration}px`,
            zIndex:this.props.baseZIndex + 1
        };

        return (
            <React.Fragment>
                <div id="post-header" style={styleOfPostHeader} className={this.props.className}>
                    <div className="title" style={styleOfTitle}>{this.props.title.name}</div>
                    <div className="categories" style={postInfo}><CategoryIcon/>{categories}</div>
                    <div className="tags" style={postInfo}><TagIcon />{tags}</div>
                    {publishInfoElement}
                    {this.props.children}
                </div>
                <div id="post-dec" style={styleOfDec} className={this.props.className}></div>
            </React.Fragment>
        );        
    }
}

