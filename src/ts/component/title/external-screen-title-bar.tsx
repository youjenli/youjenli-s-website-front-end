import * as React from 'react';
import { isNotBlank } from '../../service/validator';
import { MenuItem } from '../../model/global-vars';
import SiteName from './site-name';
import {loadMenuItems} from './menu-items-loader';
import ExternalScreenSearchBar from './external-screen-search-bar';
import HintOfFeaturedLink from './hint-of-featured-link';
import base64EncodedTitle from './site-name-2_5x_base64';
import * as terms from './terms';

interface ExternalScreenTitleBarProps {
    viewportWidth:number;
    aspectRatio:number;
    baseZIndex:number;
}

interface ExternalScreenTitleBarState {
    isSearchBarFocused:boolean;
    statusOfHints:boolean[];
}

export default class ExternalScreenTitleBar extends React.Component<ExternalScreenTitleBarProps, ExternalScreenTitleBarState> {
    constructor(props){
        super(props);
        this.toggleSearchBarState = this.toggleSearchBarState.bind(this);
        this.menuItems = loadMenuItems();
        this.toggleStateOfHint = this.toggleStateOfHint.bind(this);
        let statusOfHints = this.menuItems.map(() => { return false; });
        this.state = {
            isSearchBarFocused:false,
            statusOfHints:statusOfHints
        };
    }
    menuItems:MenuItem[];
    toggleSearchBarState() {
        this.setState({
            isSearchBarFocused:!this.state.isSearchBarFocused
        })
    }
    toggleStateOfHint(idx:number) {
        const newStatus = this.state.statusOfHints;
        this.state.statusOfHints[idx] = !this.state.statusOfHints[idx];
        this.setState({
            statusOfHints:newStatus
        });
    }
    render() {
        /*
         根據稍早取得的顯示寬度和螢幕長寬比例套用規則算出標題、功能連結、提示訊息、搜尋欄位的字體大小。
        */
       let headerHeight:number;
       let siteNameFontSize:number, siteNameTopPosition:number, siteNameLeftPosition:number;
       let featuredLinkFontSize:number, featureHintFontSize:number, marginRightOfFeaturedLink:number;
       let topOfgroupOfFeaturedLink:number;
       let searchHintFontSize:number, searchBarWidth:number, searchBarHeight:number, searchBarTop:number,
            searchFieldBorderRadius:number;

       if (this.props.viewportWidth >= 1440) {//最大螢幕
            siteNameFontSize = this.props.viewportWidth / 62;
            headerHeight = 2.1 * siteNameFontSize;
            featuredLinkFontSize = this.props.viewportWidth / 67;
            featureHintFontSize = (this.props.viewportWidth + 1920)/240;
            searchHintFontSize = this.props.viewportWidth / 90;
            searchFieldBorderRadius = 10;
            searchBarHeight = (0.11 * this.props.viewportWidth + 1.6) / 5;
            searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);
        } else {//小螢幕或水平大行動裝置
            if (this.props.aspectRatio > 0.7) { //4:3 螢幕
                siteNameFontSize = this.props.viewportWidth / 50;
                headerHeight = 2.045 * siteNameFontSize;
                featuredLinkFontSize = this.props.viewportWidth / 57.6;
                featureHintFontSize = (this.props.viewportWidth + 1472)/208;
                searchHintFontSize = (this.props.viewportWidth + 432) / 104;                
                searchBarHeight = (3 * this.props.viewportWidth + 2336)/208;
                searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);
            } else if (this.props.aspectRatio > 0.6) {//16:10 螢幕
                siteNameFontSize = this.props.viewportWidth / 53.3;
                headerHeight = 2.075 * siteNameFontSize;
                featuredLinkFontSize = this.props.viewportWidth / 60;
                featureHintFontSize = (this.props.viewportWidth + 1680) / 208;
                searchHintFontSize = (this.props.viewportWidth + 1888) / 208;                
                searchBarHeight = (3 * this.props.viewportWidth + 2336)/208;
                searchBarWidth = 12.5 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);
            } else {//16:9 螢幕
                siteNameFontSize = this.props.viewportWidth / 57.6;
                headerHeight = 2.02 * siteNameFontSize;
                featuredLinkFontSize = this.props.viewportWidth / 62.6;
                featureHintFontSize = (this.props.viewportWidth + 1472) / 208;
                searchHintFontSize = 14;
                searchBarHeight = (2.6 * this.props.viewportWidth + 7737.6) / 416;
                searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);
            }
            searchFieldBorderRadius = 8;
        }
        siteNameLeftPosition = siteNameFontSize;
        siteNameTopPosition = (headerHeight - siteNameFontSize)/2
        searchBarTop = (headerHeight - searchBarHeight) / 2;
        marginRightOfFeaturedLink = featuredLinkFontSize * 2;
        topOfgroupOfFeaturedLink = (searchBarHeight - featuredLinkFontSize) / 2;

        const headerCtxStyle = {
            zIndex:this.props.baseZIndex + 1
        }
        const headerBarStyle = {
            height:headerHeight + "px"
        };
        const styleOfFeaturedLink = {
            marginRight:marginRightOfFeaturedLink + "px",
            fontSize:featuredLinkFontSize + "px"
        }
        const styleOfgroupOfFeaturedLink = {
            top:topOfgroupOfFeaturedLink + "px"
        }

        let navMenuItems = this.menuItems.map((item, idx) => {
            let charactersOfMenuItem = 0;
            /* 在想到更好的方法處理提示訊息的對齊問題之前，
               暫時先用這種相對不嚴謹的規則實現重要連結的中文字、英文字元數之計算作業 */
            for (let i = 0 ; i < item.name.length ; i ++) {
                charactersOfMenuItem += item.name.charCodeAt(i) < 256 ? 1 : 2;
            }
            return (
                <a className="featuredLink" key={idx} style={styleOfFeaturedLink} data-navigo
                    onMouseEnter={() => this.toggleStateOfHint(idx)}
                    onMouseLeave={() => this.toggleStateOfHint(idx)}
                    href={item.url} >{item.name}
                    { this.state.statusOfHints[idx] && isNotBlank(item.hint) ?
                        <HintOfFeaturedLink  fontSizeOfFeaturedLink={featuredLinkFontSize} 
                            charactersInFeaturedLink={charactersOfMenuItem} 
                            hint={item.hint} fontSizeOfHint={featureHintFontSize} />
                    : null }
                </a>
            );
        });

        return (
            <div id="header-ctx" style={headerCtxStyle}>
                <header id="header-bar" style={headerBarStyle}>
                    <SiteName name={terms.siteName} base64EncodedTitle={base64EncodedTitle}
                        fontSize={siteNameFontSize} top={siteNameTopPosition} left={siteNameLeftPosition} />
                    <ExternalScreenSearchBar width={searchBarWidth} height={searchBarHeight} 
                        top={searchBarTop} right={siteNameFontSize} borderRadius={searchFieldBorderRadius}
                        fontSizeOfFeaturedLink={featuredLinkFontSize} fontSizeOfSearchHint={searchHintFontSize}
                        toggleSearchBarState={this.toggleSearchBarState}>
                       <nav id="groupOfFeaturedLinks" style={styleOfgroupOfFeaturedLink}>
                            {navMenuItems}
                        </nav> 
                    </ExternalScreenSearchBar>
                </header>
            </div>
        );
    }
}