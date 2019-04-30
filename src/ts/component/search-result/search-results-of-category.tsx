import * as React from 'react';
import {ResultsOfSearch} from '../../model/search-results';
import {CategoryOfPost} from '../../model/post';
import * as directions from './direction';
import * as terms from './terms';
import * as icons from '../home/recentPosts/icons';
import {KhakiDecorationOfCategory, GreenDecorationOfCategory} from './decorations';

interface PropsOfCategoryOnPageOfSearchResults {
    category:CategoryOfPost;
    width:number;
    bgColor:string;
    fontSizeOfName?:number;
    fontSizeOfDesc?:number;
}

export class CategoryOnPageOfSearchResults extends React.Component<PropsOfCategoryOnPageOfSearchResults> {
    render() {
        let description = this.props.category.description;
        if (!description) {
            description = terms.categoryDoesNotHaveDesc;
        }

        const styleOfContent = {
            backgroundColor:this.props.bgColor
        }

        let styleOfCategory = null;
        if (this.props.fontSizeOfName) {
            styleOfCategory = {
                fontSize:`${this.props.fontSizeOfName}px`,
                width:`${this.props.width}px`
            };
        }
        let styleOfDesc = null;
        if (this.props.fontSizeOfDesc) {
            styleOfDesc = {
                fontSize:`${this.props.fontSizeOfDesc}px`
            }
        }

        return (
            <div className="category" style={styleOfCategory}>
                <div className="content" style={styleOfContent}>
                    <div className="name"><a>{this.props.category.name}</a></div>
                    <div className="desc" style={styleOfDesc}>{description}</div>
                </div>                
                {this.props.children}
            </div>
        );
    }
}

interface PropsOfSearchResultsOfCategory {
    inquire:string;
    results:ResultsOfSearch<CategoryOfPost>;
    width:number;
    numberOfCategoriesInARow:number;
    fontSizeOfHeading:number;
    fontSizeOfCategoryName?:number;
    fontSizeOfDesc?:number;
    heightOfDirectionIcon:number;
    fontSizeOfPageIndexes?:number;
}

export class SearchResultsOfCategory extends React.Component<PropsOfSearchResultsOfCategory> {
    render() {
        const styleOfHeading = {
            fontSize:`${this.props.fontSizeOfHeading}px`
        }

        /* 要提供字體樣式給 results 區塊，這樣才能用 nagetive margin 使最後一列下面的 margin 符合設計 */
        const styleOfResults = {
            fontSize:`${this.props.fontSizeOfCategoryName}px`
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
            
            const categories = [];
            const styleOfDecoration = {
                width:`${this.props.width + 2}px`
                /* 寬度要加上 2px 的原因是這樣才能跟文字區域吻合在一起。 */
            }

            const pageContent = this.props.results.pageContent;

            for (let i = 0 ; i < pageContent.length ; i ++) {
                if (i % this.props.numberOfCategoriesInARow % 2 == 0) {
                    categories[i] = 
                        <CategoryOnPageOfSearchResults bgColor={'#FEECB8'} width={this.props.width} category={pageContent[i]} key={i}
                            fontSizeOfName={this.props.fontSizeOfCategoryName} fontSizeOfDesc={this.props.fontSizeOfDesc}>
                            <KhakiDecorationOfCategory style={styleOfDecoration}/>
                        </CategoryOnPageOfSearchResults>;
                } else {
                    categories[i] =
                        <CategoryOnPageOfSearchResults bgColor={'#DBFFB4'} width={this.props.width}  category={pageContent[i]} key={i}
                            fontSizeOfName={this.props.fontSizeOfCategoryName} fontSizeOfDesc={this.props.fontSizeOfDesc}>
                            <GreenDecorationOfCategory style={styleOfDecoration}/>
                        </CategoryOnPageOfSearchResults>;
                }
            }

            const lastIndexOfPlaceHoldingItems = pageContent.length 
                    + this.props.numberOfCategoriesInARow - (pageContent.length % this.props.numberOfCategoriesInARow);//佔位元素的數量
            const styleOfPlaceHoldingItem = {
                width:`${this.props.width}px`
            }
            for (let j = pageContent.length ; j < lastIndexOfPlaceHoldingItems ; j ++ ) {
                categories[j] = 
                    <div style={styleOfPlaceHoldingItem}>&nbsp;</div>
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
                        {categories}
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
                <div className="results noData">{terms.generateCategoriesNotFoundNotificationMsg(this.props.inquire)}</div>
            )
        }

        return (
            <section className="categories">
                <h3 className="heading" style={styleOfHeading}><icons.CategoryIcon />{terms.headingOfSearchResultsOfCategories}</h3>
                {content}
            </section>
        );
    }
}