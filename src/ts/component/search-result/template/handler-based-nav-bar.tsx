import * as React from 'react';
import * as directions from './direction';
import {PageClickedHandler} from '../routeHandler';

interface PropsOfHandlerBasedNavbar {
    currentPage:number;
    totalPages:number;
    heightOfDirectionIcon:number;
    fontSizeOfPageIndexes:number;
    margin?:{
        top?:number;
        bottom?:number;
    }
    onPageClicked:PageClickedHandler;
}

export class HandlerBasedNavbarForNarrowDevices extends React.Component<PropsOfHandlerBasedNavbar> {
    render() {
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

        let linkToPreviousPage = null, linkToNextPage = null;
        let additionalClassNameOfPrevNav = '', additionalClassNameOfNextNav = '';
        /* 不知道為什麼，無法直接給 nav 套用 visibility:hidden 樣式，於是只好使用改變類別名稱以套用樣式的做法 */
        if (this.props.currentPage == 1) {
            additionalClassNameOfPrevNav = ' hidden';
        } else {
            const pageClickedHandler = (evt: React.SyntheticEvent) => {
                evt.preventDefault();
                this.props.onPageClicked(this.props.currentPage - 1);
            }

            linkToPreviousPage = 
                <a onClick={pageClickedHandler} ><directions.LeftDirection style={styleOfDirection}/></a>;
        }

        if (this.props.currentPage == this.props.totalPages) {
            additionalClassNameOfNextNav = ' hidden';
        } else {
            const pageClickedHandler = (evt: React.SyntheticEvent) => {
                evt.preventDefault();
                this.props.onPageClicked(this.props.currentPage + 1);
            }

            linkToNextPage =
                <a onClick={pageClickedHandler} ><directions.RightDirection style={styleOfDirection}/></a>;
        }

        return ( 
            <nav className="navbar" style={styleOfNavbar}>
                <span className={"nav prev" + additionalClassNameOfPrevNav}>{linkToPreviousPage}</span>
                <span className="indexes">{this.props.children}</span>
                <span className={"nav next" + additionalClassNameOfNextNav}>{linkToNextPage}</span>
            </nav>
        );
    }
}

export class DefaultHandlerBasedNavbar extends React.Component<PropsOfHandlerBasedNavbar> {
    render() {
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

        let linkToPreviousPage = null, linkToNextPage = null;
        let additionalClassNameOfPrevNav = '', additionalClassNameOfNextNav = '';
        if (this.props.currentPage == 1) {
            additionalClassNameOfPrevNav = ' hidden';
        } else {
            const pageClickedHandler = (evt: React.SyntheticEvent) => {
                evt.preventDefault();
                this.props.onPageClicked(this.props.currentPage - 1);
            }

            linkToPreviousPage = 
                <a onClick={pageClickedHandler} ><directions.LeftDirection style={styleOfDirection}/></a>;
        }

        if (this.props.currentPage == this.props.totalPages) {
            additionalClassNameOfNextNav = ' hidden';
        } else {
            const pageClickedHandler = (evt: React.SyntheticEvent) => {
                evt.preventDefault();
                this.props.onPageClicked(this.props.currentPage + 1);
            }

            linkToNextPage =
                <a onClick={pageClickedHandler} ><directions.RightDirection style={styleOfDirection}/></a>;
        }

        return ( 
            <nav className="navbar" style={styleOfNavbar}>
                <span className={"nav prev" + additionalClassNameOfPrevNav}>{linkToPreviousPage}</span>
                <span className="indexes">{this.props.children}</span>
                <span className={"nav next" + additionalClassNameOfNextNav}>{linkToNextPage}</span>
            </nav>
        );
    }
}