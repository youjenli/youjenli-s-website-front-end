import * as React from 'react';
import { createUrlForPage } from '../../../model/pagination';
import * as terms from '../terms';
import * as directions from './direction';

interface PropsOfRouteBasedNavbar {
    currentPage:number;
    totalPages:number;
    baseUrl:string;
    heightOfDirectionIcon:number;
    fontSizeOfPageIndexes:number;
    margin?:{
        top?:number;
        bottom?:number;
    }
}

export class RouteBasedNavbarForNarrowDevices extends React.Component<PropsOfRouteBasedNavbar> {
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
        let hrefOfLeftDirection = null, hrefOfRightDirection = null;
        let additionalClassNameOfPrevNav = '', additionalClassNameOfNextNav = '';
        if (this.props.currentPage == 1) {
            additionalClassNameOfPrevNav = ' hidden';
        } else {
            hrefOfLeftDirection = createUrlForPage(this.props.baseUrl, this.props.currentPage - 1);
        }

        if (this.props.currentPage == this.props.totalPages) {
            additionalClassNameOfNextNav = ' hidden';
        } else {
            hrefOfRightDirection = createUrlForPage(this.props.baseUrl, this.props.currentPage + 1);
        }

        return ( 
            <nav className="navbar" style={styleOfNavbar}>
                <span className={"nav prev" + additionalClassNameOfPrevNav}>
                    <a href={hrefOfLeftDirection} ><directions.LeftDirection style={styleOfDirection}/></a></span>
                <span className="indexes">{this.props.children}</span>
                <span className={"nav next" + additionalClassNameOfNextNav}>
                    <a href={hrefOfRightDirection} ><directions.RightDirection style={styleOfDirection}/></a></span>
            </nav>
        );
    }
}

export class DefaultRouteBasedNavbar extends React.Component<PropsOfRouteBasedNavbar> {
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
        let hrefOfLeftDirection = null, hrefOfRightDirection = null;
        let additionalClassNameOfPrevNav = '', additionalClassNameOfNextNav = '';
        if (this.props.currentPage == 1) {
            additionalClassNameOfPrevNav = ' hidden';
            
        } else {
            hrefOfLeftDirection = createUrlForPage(this.props.baseUrl, this.props.currentPage - 1);
        }

        if (this.props.currentPage == this.props.totalPages) {
            additionalClassNameOfNextNav = ' hidden';
        } else {
            hrefOfRightDirection = createUrlForPage(this.props.baseUrl, this.props.currentPage + 1);
        }

        return ( 
            <nav className="navbar" style={styleOfNavbar}>
                <span className={"nav prev" + additionalClassNameOfPrevNav}>
                    <a href={hrefOfLeftDirection} data-navigo>
                        <directions.LeftDirection style={styleOfDirection}/>{terms.previousPage}</a></span>
                <span className="indexes">{this.props.children}</span>
                <span className={"nav next" + additionalClassNameOfNextNav}>
                    <a href={hrefOfRightDirection} data-navigo>{terms.nextPage}
                        <directions.RightDirection style={styleOfDirection}/></a></span>
            </nav>
        );
    }
}