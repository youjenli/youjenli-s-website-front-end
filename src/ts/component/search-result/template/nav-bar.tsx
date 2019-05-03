import * as React from 'react';
import {ResultsOfSearch} from '../../../model/search-results';
import {MetaOfPost, CategoryOfPost, TagOfPost} from '../../../model/post';
import * as terms from '../terms';
import * as directions from './direction';

interface PropsOfDefaultNavbarOnPageOfSearchResults {
    results:ResultsOfSearch<MetaOfPost | CategoryOfPost | TagOfPost>;
    onPageSelect:(pageNumber:number) => void;
    heightOfDirectionIcon:number;
    fontSizeOfPageIndexes:number;
    margin?:{
        top?:number;
        bottom?:number;
    }
}

export class NavbarOnPageOfSearchResultsInNarrowDevices extends React.Component<PropsOfDefaultNavbarOnPageOfSearchResults> {
    render() {
        let pages = [];
        const current = this.props.results.currentPageNumber;
        const total = this.props.results.numberOfPages;

        if (current > 3) {
            pages.push(<a key={1} onClick={() => { this.props.onPageSelect(1) }}>{1}</a>);
            pages.push(<span key={2}>…</span>);
            pages.push(<a key={current -1} onClick={() => { this.props.onPageSelect(current -1) }}>{current -1}</a>);
            pages.push(<span className="current" key={current}><a>{current}</a></span>);
        } else {
            for (let i = 1 ; i <= current ; i ++) {
                if (i == current) {
                    pages.push(<span className="current" key={i}><a>{i}</a></span>);
                } else {
                    pages.push(<a key={i} onClick={() => { this.props.onPageSelect(i) }}>{i}</a>);
                }
            }
        }

        if (total - 2 > current) {
            pages.push(<a key={current+1} onClick={() => { this.props.onPageSelect(current+1) }}>{current+1}</a>);
            pages.push(<span key={current+2}>…</span>);
            pages.push(<a key={total} onClick={() => { this.props.onPageSelect(total) }}>{total}</a>);
        } else if (total - 2 == current) {
            pages.push(<a key={current+1} onClick={() => { this.props.onPageSelect(current+1) }}>{current+1}</a>);
            pages.push(<a key={total} onClick={() => { this.props.onPageSelect(total) }}>{total}</a>);
        } else {
            for (let i = current + 1 ; i <= total ; i ++) {
                pages.push(<a key={i} onClick={() => { this.props.onPageSelect(i) }}>{i}</a>);
            }
        }

        const styleOfNavbar = {
            fontSize:`${this.props.fontSizeOfPageIndexes}px`
        }
        
        if (this.props.margin) {
            if (this.props.margin.top){
                styleOfNavbar['marginTop'] = `${this.props.margin.top}px`;
            }
            if (this.props.margin.bottom) {
                styleOfNavbar['marginBottom'] = `${this.props.margin.bottom}px`;
            }
        }

        const styleOfDirection = {
            height:`${this.props.heightOfDirectionIcon}px`
        }

        /* 不知道為什麼，無法直接給 nav 套用 visibility:hidden 樣式，於是只好使用改變類別名稱以套用樣式的做法 */
        let additionalClassNameOfPrevNav = '', additionalClassNameOfNextNav = '';
        if (this.props.results.currentPageNumber == 1) {
            additionalClassNameOfPrevNav = ' hidden';
        }
        if (this.props.results.currentPageNumber == this.props.results.numberOfPages) {
            additionalClassNameOfNextNav = ' hidden';
        }

        return ( 
            <nav className="navbar" style={styleOfNavbar}>
                <span className={"nav prev" + additionalClassNameOfPrevNav}>
                    <directions.LeftDirection style={styleOfDirection}/></span>
                <span className="indexes">{pages}</span>
                <span className={"nav next" + additionalClassNameOfNextNav}>
                    <directions.RightDirection style={styleOfDirection}/></span>
            </nav>
        );
    }
}

export default class DefaultNavbarOnPageOfSearchResults extends React.Component<PropsOfDefaultNavbarOnPageOfSearchResults> {
    render() {
        let pages = [];
        if (this.props.results.numberOfPages <= 10) {
            for (let i = 1 ; i <= this.props.results.numberOfPages ; i ++) {
                if (i == this.props.results.currentPageNumber) {
                    pages.push(<span className="current" key={i}><a>{i}</a></span>);
                } else {
                    pages.push(<a key={i} onClick={() => { this.props.onPageSelect(i) }}>{i}</a>);
                }
            }
        } else {
            let foundCurrentPage = false;
            let loopEnd = 3;
            const current = this.props.results.currentPageNumber;
            const total = this.props.results.numberOfPages;
            for (let i = 1 ; i <= loopEnd ; i ++) {
                if (i == current) {
                    pages.push(<a className="current" key={i}>{i}</a>);
                    loopEnd = i + 3;
                    foundCurrentPage = true;
                } else {
                    pages.push(<a key={i} onClick={() => { this.props.onPageSelect(i) }}>{i}</a>);
                }
            }
            pages.push(<span key={loopEnd + 1}>…</span>)
            if (!foundCurrentPage) {
                let start = (current - 2 > loopEnd ? current - 2 : loopEnd + 1 );
                let stop = (current + 2 < total - 2 ? current + 2 : total - 3 );
                for (let j = start ; j <= stop ; j ++) {
                    if (j == current) {
                        pages.push(<a className="current" key={j}>{j}</a>);
                    } else {
                        pages.push(<a key={j} onClick={() => { this.props.onPageSelect(j) }}>{j}</a>);
                    }
                }
                if (stop < total - 3) {
                    pages.push(<span key={stop + 1}>…</span>);
                }
            } else {
                for (let k = total - 2 ; k <= total ; k ++) {
                    pages.push(<a key={k} onClick={() => { this.props.onPageSelect(k) }}>{k}</a>);
                }
            }
        }

        const styleOfNavbar = {
            fontSize:`${this.props.fontSizeOfPageIndexes}px`
        }

        if (this.props.margin) {
            if (this.props.margin.top){
                styleOfNavbar['marginTop'] = `${this.props.margin.top}px`;
            }
            if (this.props.margin.bottom) {
                styleOfNavbar['marginBottom'] = `${this.props.margin.bottom}px`;
            }
        }

        const styleOfDirection = {
            height:`${this.props.heightOfDirectionIcon}px`
        }

        /* 不知道為什麼，無法直接給 nav 套用 visibility:hidden 樣式，於是只好使用改變類別名稱以套用樣式的做法 */
        let additionalClassNameOfPrevNav = '', additionalClassNameOfNextNav = '';
        if (this.props.results.currentPageNumber == 1) {
            additionalClassNameOfPrevNav = ' hidden';
        }
        if (this.props.results.currentPageNumber == this.props.results.numberOfPages) {
            additionalClassNameOfNextNav = ' hidden';
        }

        return ( 
            <nav className="navbar" style={styleOfNavbar}>
                <span className={"nav prev" + additionalClassNameOfPrevNav}>
                    <directions.LeftDirection style={styleOfDirection}/>{terms.previousPage}</span>
                <span className="indexes">{pages}</span>
                <span className={"nav next" + additionalClassNameOfNextNav}>
                    {terms.nextPage}<directions.RightDirection style={styleOfDirection}/></span>
            </nav>
        );
    }
}