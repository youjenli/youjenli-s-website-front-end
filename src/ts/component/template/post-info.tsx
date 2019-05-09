import * as React from 'react';
import {CategoryOfPost, TagOfPost} from '../../model/post';
import {CategoryIcon, TagIcon, PublishIcon} from './icons';
import * as terms from '../home/recentPosts/terms';
import {formatMonthOrDayTo2Digits} from '../../service/date-formatter';

interface PropsOfPostInfo {
    categories?:CategoryOfPost[];
    tags?:TagOfPost[];
    date:Date;
    modified:Date;
    wordCount:number;
    styleOfPostInfo?:React.CSSProperties;
    marginBottomOfLastItem?:string;
}

export default class PostInfo extends React.Component<PropsOfPostInfo> {
    render() {
        let categories;
        if (this.props.categories && this.props.categories.length > 0) {
            categories = this.props.categories.map(
                (category, idx, array) => {
                return (
                    <span key={idx}><a className="category">{category.name}</a>
                      { idx != array.length - 1 ? '﹒' : null }</span>);
            });
        } else {
            categories = (<span className="noData" key={0}>{terms.postWasNotCategorized}</span>);
        }

        let tags;
        if (this.props.tags && this.props.tags.length > 0) {
            tags = this.props.tags.map((tag, idx, array) => {
                return (<span key={idx}><a className="tag">{tag.name}</a>
                    { idx != array.length - 1 ? '﹒' : null }</span>);
            });
        } else {
            tags = (<span className="noData" key={0}>{terms.postWasNotTagged}</span>);
        }

        let styleOfPublishInfo = {};
        if (this.props.marginBottomOfLastItem) {
            styleOfPublishInfo['marginBottom'] = this.props.marginBottomOfLastItem
        }

        return (
            <React.Fragment>
                <div className="postInfo" style={this.props.styleOfPostInfo}>
                    <div className="categories"><CategoryIcon/>{categories}</div>
                    <div className="tags"><TagIcon />{tags}</div>
                    <PublishInfo date={this.props.date} modified={this.props.modified} 
                        wordCount={this.props.wordCount} style={styleOfPublishInfo} />
                    {this.props.children}
                </div>                
            </React.Fragment>
        )
    }
}

interface PropsOfPublishInfo {
    date:Date;
    modified:Date;
    wordCount:number;
    style?:React.CSSProperties;
}

export class PublishInfo extends React.Component<PropsOfPublishInfo> {
    
    render() {
        const publishMonth = formatMonthOrDayTo2Digits(this.props.date.getMonth());
        const publishDay = formatMonthOrDayTo2Digits(this.props.date.getDate());
        
        let lastUpdate = null;
        if (this.props.modified) {
            const modifiedMonth = formatMonthOrDayTo2Digits(this.props.modified.getMonth());
            const modifiedDay = formatMonthOrDayTo2Digits(this.props.modified.getDate());
            lastUpdate = `${terms.clauseSeparater}${terms.lastModified} ${this.props.modified.getFullYear()}/${modifiedMonth}/${modifiedDay}`;
        }
        let msgAboutWordCount = `${terms.clauseSeparater}${terms.wordCount} ${this.props.wordCount} ${terms.unitOfWord}${terms.period}`;
            
        return (
            <div className="publishInfo" style={this.props.style}>
                <PublishIcon/><span>
                    {terms.published}&nbsp;{this.props.date.getFullYear()}/{publishMonth}/{publishDay}
                    {lastUpdate}{msgAboutWordCount}
                </span>
            </div>
        );
    }
}