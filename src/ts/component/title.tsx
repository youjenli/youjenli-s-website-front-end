/// <reference types="react"/>
import * as React from 'react';

interface TitleBarState {
    isSearchBarFocused:boolean;
}

export class TitleBar extends React.Component<{}, TitleBarState> {
    constructor(props){
        super(props);
        this.state = {
            isSearchBarFocused:false
        };
        this.toggleSearchBarState = this.toggleSearchBarState.bind(this);
    }
    toggleSearchBarState() {
        this.setState({
            isSearchBarFocused:!this.state.isSearchBarFocused
        })
    }
    render() {
        /*
            取得顯示寬度、螢幕長寬比例
            根據顯示寬度和螢幕長寬比例套用規則算出標題、功能連結、提示訊息、搜尋欄位的字體大小。
        */
       const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
       const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
       let siteNameFontSize, featureLinkFontSize, featureHintFontSize, searchHintFontSize;
       let headerHeight;
       let searchBarWidth, searchBarHeight;

        if (viewportWidth >= 1440) {//最大螢幕
            siteNameFontSize = viewportWidth / 62;
            featureLinkFontSize = viewportWidth / 67;
            featureHintFontSize = (viewportWidth + 1920)/240;
            searchHintFontSize = viewportWidth / 90;
            headerHeight = 2.1 * siteNameFontSize;
            searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);
            searchBarHeight = (0.11 * viewportWidth + 1.6) / 5;
        } else if (viewportWidth >= 1024) {//小螢幕或水平大行動裝置
            const aspectRatio = viewportHeight / viewportWidth;
            if (aspectRatio > 0.7) { //4:3 螢幕
                siteNameFontSize = viewportWidth / 50;
                featureLinkFontSize = viewportWidth / 57.6;
                featureHintFontSize = (viewportWidth + 1472)/208;
                searchHintFontSize = (viewportWidth + 432) / 104;
                headerHeight = 2.045 * siteNameFontSize;
                searchBarWidth = 12.5 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);
                searchBarHeight = (3 * viewportWidth + 2336)/208
            } else if (aspectRatio > 0.6) {//16:10 螢幕
                siteNameFontSize = viewportWidth / 53.3;
                featureLinkFontSize = viewportWidth / 60;
                featureHintFontSize = (viewportWidth + 1680) / 208;
                searchHintFontSize = (viewportWidth + 1888) / 208;
                headerHeight = 2.075 * siteNameFontSize;
                searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);
                searchBarHeight = (3 * viewportWidth + 2336)/208
            } else {//16:9 螢幕
                siteNameFontSize = viewportWidth / 57.6;
                featureLinkFontSize = viewportWidth / 62.6;
                featureHintFontSize = (viewportWidth + 1472) / 208;
                searchHintFontSize = 14;
                headerHeight = 2.02 * siteNameFontSize;
                searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);
                searchBarHeight = (2.6 * viewportWidth + 7737.6) / 416
            }            
        } else {//行動裝置或垂直的大行動裝置

        }

        const siteNameStyle = {
            fontSize:siteNameFontSize + "px"
        }
        const headerBarStyle = {
            height:headerHeight + "px"
        };
        return (
            <header id="header-bar" style={headerBarStyle}>
                <span id="site-name" style={siteNameStyle}>祐任的個人網站</span>
                <nav>
                    <span className="featureLink">自我介紹</span>
                    <span className="featureLink">文章分類</span>
                    <span className="featureLink">關於這網站</span>
                </nav>
                <SearchBar width={searchBarWidth + "px"} height={searchBarHeight + "px"} 
                    toggleSearchBarState={this.toggleSearchBarState}/>
             
            </header>
        );
    }
}

interface SearchBarProps {
    width:string;
    height:string;
    toggleSearchBarState:() => void;
}

class SearchBar extends React.Component<SearchBarProps> {
    constructor(props){
        super(props);
    }
    render() {
        const searchBarStyle = {
            width:this.props.width,
            height:this.props.height
        }
        return (
            <input id="search-bar" style={searchBarStyle}  type="text" 
                    onFocus={this.props.toggleSearchBarState}
                    onBlur={this.props.toggleSearchBarState} />
        );
    }    
}