import * as React from 'react';
import {ResultsOfSearch} from '../../../model/search-results';
import {TagOfPost} from '../../../model/post';
import * as terms from '../terms';
import {BlueDecorationOfTag, RedDecorationOfTag} from './decorations';

interface PropsOfTagOnPageOfSearchResults {
    tag:TagOfPost;
    additionalClassesOnContent?:string;
    width:number;
    topShiftOfContent:number;//這個數字是要把 content 區域往上拉以便蓋掉上面 svg 陰影的距離。
    fontSizeOfName?:number;
    fontSizeOfDesc?:number;
}

export class TagOnPageOfSearchResults extends React.Component<PropsOfTagOnPageOfSearchResults> {
    render() {
        let className = 'content';
        if (this.props.additionalClassesOnContent) {
            className = className + ' ' + this.props.additionalClassesOnContent;
        }

        let description = this.props.tag.description;
        if (!description) {
            description = terms.tagDoesNotHaveDesc;
        }

        let styleOfTag = null;
        if (this.props.fontSizeOfName) {
            styleOfTag = {
                fontSize:`${this.props.fontSizeOfName}px`,
                width:`${this.props.width}px`
            };
        }

        const styleOfContent = {
            top:this.props.topShiftOfContent
        }

        let styleOfDesc = null;
        if (this.props.fontSizeOfDesc) {
            styleOfDesc = {
                fontSize:`${this.props.fontSizeOfDesc}px`
            }
        }

        return (
            <div className="tag" style={styleOfTag}>
                {this.props.children}
                <div className={className} style={styleOfContent}>
                    <div className="name"><a>{this.props.tag.name}</a></div>
                    <div className="desc" style={styleOfDesc}>{description}</div>  
                </div>
            </div>
        );
    }
}

interface PropsOfSearchResultsOfTag {
    results:ResultsOfSearch<TagOfPost>;
    width:number;
    numberOfTagsInARow:number;
    fontSizeOfTagName?:number;
    fontSizeOfDesc?:number;
}

export class SearchResultsOfTag extends React.Component<PropsOfSearchResultsOfTag> {
    render() {

        const blurOfShadow = 1.8;
        const widthOfDecoration = this.props.width + 2 * blurOfShadow;
        /* 寬度要加上 2倍陰影的原因是這樣才能跟文字區域無縫接軌在一起。*/
        const styleOfDecoration = {
            width:`${widthOfDecoration}px`,
            left:`${-1 * blurOfShadow}px`                
        }
        const topShiftOfContent = -1 * Math.round(widthOfDecoration * 10 * 3 / 78) / 10;
                /* 3 / 78 是標籤圖示寬度的一半與圓環底下的距離之比值。 
                    Math.round 裡面 x 10，外面 / 10 的原因是希望計算要精準到小數第一位。
                */
        const tags = [];
        const pageContent = this.props.results.pageContent;
        for (let i = 0 ; i < pageContent.length ; i ++) {
            if (i % this.props.numberOfTagsInARow % 2 == 0) { 
                tags[i] = 
                    <TagOnPageOfSearchResults additionalClassesOnContent="blue" width={this.props.width} 
                       topShiftOfContent={topShiftOfContent} tag={pageContent[i]} key={i}
                       fontSizeOfName={this.props.fontSizeOfTagName} fontSizeOfDesc={this.props.fontSizeOfDesc}>
                       <BlueDecorationOfTag style={styleOfDecoration}/>
                    </TagOnPageOfSearchResults>;
            } else {
                tags[i] = 
                    <TagOnPageOfSearchResults additionalClassesOnContent="red" width={this.props.width} 
                    topShiftOfContent={topShiftOfContent} tag={pageContent[i]} key={i}
                       fontSizeOfName={this.props.fontSizeOfTagName} fontSizeOfDesc={this.props.fontSizeOfDesc}>
                       <RedDecorationOfTag style={styleOfDecoration}/>
                    </TagOnPageOfSearchResults>;
            }
        }
        const leftOverItemsAtTheLastRow = pageContent.length % this.props.numberOfTagsInARow;
        if (leftOverItemsAtTheLastRow > 0) {
            const numberOfItemsInBlockOfResults = pageContent.length 
                + this.props.numberOfTagsInARow - leftOverItemsAtTheLastRow;
            const styleOfPlaceHoldingItem = {
                width:`${this.props.width}px`
            }
            for (let j = pageContent.length ; j < numberOfItemsInBlockOfResults ; j ++ ) {
                tags[j] = 
                    <div key={j} style={styleOfPlaceHoldingItem}>&nbsp;</div>
            }
        }

        return <React.Fragment>{tags}</React.Fragment>;
    }
}