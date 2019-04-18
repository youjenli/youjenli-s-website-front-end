import * as React from 'react';
import {CategoryOfPost, TagOfPost} from '../../../model/post';
import {CategoryIcon, TagIcon, PublishIcon} from '../../home/recentPosts/icons';
import * as terms from '../../home/recentPosts/terms';
import {formatMonthOrDayTo2Digits} from '../../../service/date-formatter';
import Article from './article';
import * as Countable from 'countable';

interface PropsOfPostPageOnExternalScreen {
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
        date:Date,
        modified:Date
    }
    imgUrl?:string;
    postBg:{
        width:number;
        padding:{
            top:number;
            leftRight:number;
            bottom:number;
        }
        marginBottom:number;
    }
    marginTopOfContent:number;
    content:string;
}

interface StateOfPostPageWithImgOnLargeExternalScreen {
    wordCount:string;
}

export default class PostPageOnExternalScreen extends React.Component
    <PropsOfPostPageOnExternalScreen, StateOfPostPageWithImgOnLargeExternalScreen> {
    constructor(props) {
        super(props);
        this.state = {
            wordCount:''
        }
        this.onWordCountingComplete = this.onWordCountingComplete.bind(this);
    }
    onWordCountingComplete(result:Countable.CountingResult) {
        this.setState({
            wordCount:result.characters.toString()
        });
    }
    render() {
        const styleOfPostHeader = {
            fontSize:`${this.props.title.fontSize}px`,
            zIndex:this.props.baseZIndex + 2
        }
        const styleOfTitleBg = {
            paddingBottom:`${this.props.titleBg.paddingBottom}px`            
        }
        const styleOfPostInfo = {
            width:`${this.props.title.maxWidth}px`
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
        let msgAboutWordCount  = null;
        if (this.state.wordCount !== '') {
            msgAboutWordCount = `${terms.clauseSeparater}${terms.wordCount} ${this.state.wordCount} ${terms.unitOfWord}${terms.period}`;
        }

        const publishInfoElement = (
            <div className="publishInfo">
                <PublishIcon/><span>
                    {terms.published}&nbsp;{this.props.postInfo.date.getFullYear()}/{publishMonth}/{publishDay}
                    {lastUpdate}{msgAboutWordCount}
                </span>
            </div>);
        
        let img = null, decoration = null;
        if (this.props.imgUrl) {
            const styleOfImg = {
                width:`${this.props.title.maxWidth}px`,
                height:`${this.props.title.maxWidth * 0.6}px`
            }
            img = <img style={styleOfImg} src={this.props.imgUrl}/>;
        } else {
            decoration = <div id="post-dec"></div>;
        }

        const pp = this.props.postBg.padding;
        const styleOfPostBG = {
            width:`${this.props.postBg.width}px`,
            padding:`${pp.top}px ${pp.leftRight}px ${pp.bottom}px ${pp.leftRight}px`,
            marginBottom:`${this.props.postBg.marginBottom}px`,
            zIndex:this.props.baseZIndex + 1
        };
        
        const widthOfToc = this.props.title.maxWidth * 0.382;
        const fontSizeOfTocItems = widthOfToc / 20;
        const paddingLeftRightOfToc = fontSizeOfTocItems;        
        const fontSizeOfTitleOfToc = (widthOfToc - 2 * fontSizeOfTocItems) / 16;
        const toc = {
            title:{
                fontSize:fontSizeOfTitleOfToc,
                marginTopBottom:fontSizeOfTitleOfToc * 0.75
            },
            item:{
                fontSize:fontSizeOfTocItems,
                margin:{
                    topBottom:fontSizeOfTocItems * 0.8,
                    leftRight:fontSizeOfTocItems
                },
                descendent:{
                    marginLeft:fontSizeOfTocItems
                }
            }
        }
        
        return (
            <React.Fragment>
                <div id="post-header" style={styleOfPostHeader}>
                    <div id="titleBg" style={styleOfTitleBg}>
                        <div className="postInfo" style={styleOfPostInfo}>
                            <div className="title">{this.props.title.name}</div>
                            <div className="categories"><CategoryIcon/>{categories}</div>
                            <div className="tags"><TagIcon />{tags}</div>
                            {publishInfoElement}
                            {img}
                        </div>
                    </div>
                    {decoration}
                </div>
                <div id="postBg" style={styleOfPostBG}>
                    <Article width={widthOfToc} paddingLeftRight={paddingLeftRightOfToc} 
                        toc={toc} marginTopOfContent={this.props.marginTopOfContent} content={this.props.content} 
                        wordCountCallback={this.onWordCountingComplete} />
                </div>                
            </React.Fragment>
        );
    }    
}