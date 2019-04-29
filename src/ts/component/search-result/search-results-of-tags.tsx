import * as React from 'react';
import {ResultsOfSearch} from '../../model/search-results';
import {TagOfPost} from '../../model/post';
import * as directions from './direction';
import * as terms from './terms';
import * as icons from '../home/recentPosts/icons';
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
    inquire:string;
    results:ResultsOfSearch<TagOfPost>;
    widthOfTag:number;
    numberOfTagsInARow:number;
    fontSizeOfHeading:number;
    fontSizeOfTagName?:number;
    fontSizeOfDesc?:number;
    heightOfDirectionIcon:number;
    fontSizeOfPageIndexes?:number;
}

export class SearchResultsOfTag extends React.Component<PropsOfSearchResultsOfTag> {
    render() {
        const styleOfHeading = {
            fontSize:`${this.props.fontSizeOfHeading}px`
        }

        /* 要提供字體樣式給 results 區塊，這樣才能用 nagetive margin 使最後一列下面的 margin 符合設計 */
        const styleOfResults = {
            fontSize:`${this.props.fontSizeOfTagName}px`
        }

        let content = null;
        if (this.props.results.pageContent.length > 0) {
            let pages = [], pageIndexes = null;
            if (this.props.results.totalNumberOfPages <= 10) {
                for (let i = 1 ; i <= this.props.results.totalNumberOfPages ; i ++) {
                    if (i == this.props.results.currentPageNumber) {
                        pages.push(<span className="current" key={i}><a>{i}</a></span>);
                    } else {
                        pages.push(<a key={i}>{i}</a>);
                    }
                }
            } else {
                let foundCurrentPage = false;
                let loopEnd = 3;
                const current = this.props.results.currentPageNumber;
                const total = this.props.results.totalNumberOfPages;
                for (let i = 1 ; i <= loopEnd ; i ++) {
                    if (i == current) {
                        pages.push(<a className="current" key={i}>{i}</a>);
                        loopEnd = i + 3;
                        foundCurrentPage = true;
                    } else {
                        pages.push(<a key={i}>{i}</a>);
                    }
                }
                pages.push(<span key={loopEnd + 1}>…</span>);

                if (!foundCurrentPage) {
                    let start = (current - 2 > loopEnd ? current - 2 : loopEnd + 1 );
                    let stop = (current + 2 < total - 2 ? current + 2 : total - 3 );
                    for (let j = start ; j <= stop ; j ++) {
                        if (j == current) {
                            pages.push(<a className="current" key={j}>{j}</a>);
                        } else {
                            pages.push(<a key={j}>{j}</a>);
                        }
                    }
                    if (stop < total - 3) {
                        pages.push(<span key={stop + 1}>…</span>);
                    }
                } else {
                    for (let k = total - 2 ; k <= total ; k ++) {
                        pages.push(<a key={k}>{k}</a>);
                    }
                }
            }
            pageIndexes = 
                <span className="indexes">{pages}</span>;

            const styleOfNavBar = {
                fontSize:`${this.props.fontSizeOfPageIndexes}px`
            }            

            const styleOfDirection = {
                height:`${this.props.heightOfDirectionIcon}px`
            }
            
            const blurOfShadow = 1.8;
            const widthOfDecoration = this.props.widthOfTag + 2 * blurOfShadow;
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
                        <TagOnPageOfSearchResults additionalClassesOnContent="blue" width={this.props.widthOfTag} 
                           topShiftOfContent={topShiftOfContent} tag={pageContent[i]} key={i}
                           fontSizeOfName={this.props.fontSizeOfTagName} fontSizeOfDesc={this.props.fontSizeOfDesc}>
                           <BlueDecorationOfTag style={styleOfDecoration}/>
                        </TagOnPageOfSearchResults>;
                } else {
                    tags[i] = 
                        <TagOnPageOfSearchResults additionalClassesOnContent="red" width={this.props.widthOfTag} 
                        topShiftOfContent={topShiftOfContent} tag={pageContent[i]} key={i}
                           fontSizeOfName={this.props.fontSizeOfTagName} fontSizeOfDesc={this.props.fontSizeOfDesc}>
                           <RedDecorationOfTag style={styleOfDecoration}/>
                        </TagOnPageOfSearchResults>;
                }
            }
            
            /* 不知道為什麼，無法直接給 nav 套用 visibility:hidden 樣式，於是只好使用改變類別名稱以套用樣式的做法 */
            let additionalClassNameOfPrevNav = '', additionalClassNameOfNextNav = '';
            if (this.props.results.currentPageNumber == 1) {
                additionalClassNameOfPrevNav = ' hidden';
            }
            if (this.props.results.currentPageNumber == this.props.results.totalNumberOfPages) {
                additionalClassNameOfNextNav = ' hidden';
            }

            content = (
                <React.Fragment>
                    <div className="results" style={styleOfResults}>
                        {tags}
                    </div>
                    <nav className="navbar" style={styleOfNavBar}>
                        <span className={"nav" + additionalClassNameOfPrevNav}><directions.LeftDirection style={styleOfDirection}/>{terms.previousPage}</span>
                        {pageIndexes}
                        <span className={"nav" + additionalClassNameOfNextNav}>{terms.nextPage}<directions.RightDirection style={styleOfDirection}/></span>
                    </nav>
                </React.Fragment>
            )
        } else {
            content = (
                <div className="results">{terms.generateTagsNotFoundNotificationMsg(this.props.inquire)}</div>
            )
        }

        return (
            <section className="tags">
                <h3 className="heading" style={styleOfHeading}><icons.TagIcon />{terms.headingOfSearchResultsOfTags}</h3>
                {content}
            </section>
        );
    }
}