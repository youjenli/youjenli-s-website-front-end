import * as React from 'react';
import {CategoryOfPost, TagOfPost} from '../../../model/post';
import {CategoryIcon, TagIcon, PublishIcon} from '../../home/recentPosts/icons';
import * as terms from '../../home/recentPosts/terms';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';

interface PropsOfSmartPhonePostHeaderWithImg {
    title:{
        name:string;
        fontSize:number;
    };
    postInfo:{
        fontSize:number;
        categories?:CategoryOfPost[];
        tags?:TagOfPost[];
        date:Date;
        modified:Date;
        wordCount:number;
    };
    img:{
        url:string;
        height:number;
    }
}

export default class SmartPhonePostHeaderWithImg extends React.Component<PropsOfSmartPhonePostHeaderWithImg> {
    render() {
        const styleOfPostHeader = {
            fontSize:`${this.props.title.fontSize}px`
        };
        const postInfo = {
            fontSize:`${this.props.postInfo.fontSize}px`,
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

        const publishInfoElement = (
            <div className="publishInfo" style={postInfo}>
                <PublishIcon/><span>
                    {terms.published}&nbsp;{this.props.postInfo.date.getFullYear()}/{publishMonth}/{publishDay}
                    {lastUpdate}{msgAboutWordCount}
                </span>
            </div>);
                
        const styleOfImg = {
            height:`${this.props.img.height}px`
        };       

        return (
            <div id="post-header" style={styleOfPostHeader} className="sp">
                <div className="titleBg">
                    <div className="title">{this.props.title.name}</div>
                    <img style={styleOfImg} src={this.props.img.url}/>
                    <div className="categories" style={postInfo}><CategoryIcon/>{categories}</div>
                    <div className="tags" style={postInfo}><TagIcon />{tags}</div>
                    {publishInfoElement}                    
                </div>
            </div>                         
        );        
    }
}

