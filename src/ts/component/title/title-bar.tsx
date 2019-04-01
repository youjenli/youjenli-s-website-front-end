import * as React from 'react';
import SiteName from './site-name';
import SearchBar from './search-bar';
import HintOfFeatureLink from './hint-of-feature-link';

interface TitleBarState {
    isSearchBarFocused:boolean;
    showHintOfSelfIntroduction:boolean;
    showHintOfCatagoryOfArticles:boolean;
    showHintOfAboutThisSite:boolean;
    viewportWidth:number;
    viewportHeight:number;
}

let headerHeight:number = null;
let siteNameFontSize:number = null;
let siteNameTopPosition:number = null;
let siteNameLeftPosition:number = null;
let featureLinkFontSize:number = null;
let featureHintFontSize:number = null;
let featureLinkMarginRight:number = null;
let groupOfFeatureLinkTop:number = null;
let searchHintFontSize:number = null;
let searchBarWidth:number = null;
let searchBarHeight:number = null;
let searchBarTop:number = null;

let selfIntroduction = '自我介紹';
let hintOfSelfIntroduction = '公開的簡單自我介紹，說說自己的學經歷、情感、志向、嗜好與興趣。';
let catagoryOfArticles = '文章分類';
let hintOfCatagoryOfArticles = '列出這個網站的文章類型，讓您一目了然。';
let aboutThisSite = '關於這網站';
let hintOfAboutThisSite = '說明用來開發這個網站的工具、網站架構與感謝名單。';

export class TitleBar extends React.Component<{}, TitleBarState> {
    constructor(props){
        super(props);
        this.state = {
            isSearchBarFocused:false,
            showHintOfAboutThisSite:false,
            showHintOfCatagoryOfArticles:false,
            showHintOfSelfIntroduction:false,
            viewportHeight:Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            viewportWidth:Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        };
        this.toggleSearchBarState = this.toggleSearchBarState.bind(this);
        this.toggleSelfIntroductionLinkHoverState = this.toggleSelfIntroductionLinkHoverState.bind(this);
        this.toggleCatagoryOfArticlesHoverState = this.toggleCatagoryOfArticlesHoverState.bind(this);
        this.toggleAboutThisSiteHoverState = this.toggleAboutThisSiteHoverState.bind(this);
        this.calculateTitleBarArguments = this.calculateTitleBarArguments.bind(this);
        this.calculateTitleBarArguments();
        const resizeHandler = function() {
            this.setState(
                {viewportHeight:Math.max(document.documentElement.clientWidth, window.innerWidth || 0)}
            );
            this.setState(
                {viewportWidth:Math.max(document.documentElement.clientWidth, window.innerWidth || 0)}
            );
        }.bind(this);
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('resize', resizeHandler);
    }    
    calculateTitleBarArguments(){
        /*
         根據稍早取得的顯示寬度和螢幕長寬比例套用規則算出標題、功能連結、提示訊息、搜尋欄位的字體大小。
        */
        if (this.state.viewportWidth >= 1440) {//最大螢幕
            siteNameFontSize = this.state.viewportWidth / 62;
            headerHeight = 2.1 * siteNameFontSize;
            featureLinkFontSize = this.state.viewportWidth / 67;
            featureHintFontSize = (this.state.viewportWidth + 1920)/240;
            searchHintFontSize = this.state.viewportWidth / 90;            
            searchBarHeight = (0.11 * this.state.viewportWidth + 1.6) / 5;            
        } else if (this.state.viewportWidth >= 1024) {//小螢幕或水平大行動裝置
            const aspectRatio = this.state.viewportHeight / this.state.viewportWidth;
            if (aspectRatio > 0.7) { //4:3 螢幕
                siteNameFontSize = this.state.viewportWidth / 50;
                headerHeight = 2.045 * siteNameFontSize;
                featureLinkFontSize = this.state.viewportWidth / 57.6;
                featureHintFontSize = (this.state.viewportWidth + 1472)/208;
                searchHintFontSize = (this.state.viewportWidth + 432) / 104;                
                searchBarHeight = (3 * this.state.viewportWidth + 2336)/208;                
            } else if (aspectRatio > 0.6) {//16:10 螢幕
                siteNameFontSize = this.state.viewportWidth / 53.3;
                headerHeight = 2.075 * siteNameFontSize;
                featureLinkFontSize = this.state.viewportWidth / 60;
                featureHintFontSize = (this.state.viewportWidth + 1680) / 208;
                searchHintFontSize = (this.state.viewportWidth + 1888) / 208;                
                searchBarHeight = (3 * this.state.viewportWidth + 2336)/208;                
            } else {//16:9 螢幕
                siteNameFontSize = this.state.viewportWidth / 57.6;
                headerHeight = 2.02 * siteNameFontSize;
                featureLinkFontSize = this.state.viewportWidth / 62.6;
                featureHintFontSize = (this.state.viewportWidth + 1472) / 208;
                searchHintFontSize = 14;
                searchBarHeight = (2.6 * this.state.viewportWidth + 7737.6) / 416;                
            }            
        } else {//行動裝置或垂直的大行動裝置
            //todo
        }
        siteNameLeftPosition = siteNameFontSize;
        siteNameTopPosition = (headerHeight - siteNameFontSize)/2
        searchBarTop = (headerHeight - searchBarHeight) / 2;
        featureLinkMarginRight = featureLinkFontSize * 2;
        groupOfFeatureLinkTop = (searchBarHeight - featureLinkFontSize) / 2;
    }
    toggleSearchBarState() {
        this.setState({
            isSearchBarFocused:!this.state.isSearchBarFocused
        })
    }
    toggleSelfIntroductionLinkHoverState() {
        this.setState({showHintOfSelfIntroduction:!this.state.showHintOfSelfIntroduction});
    }
    toggleCatagoryOfArticlesHoverState() {
        this.setState({showHintOfCatagoryOfArticles:!this.state.showHintOfCatagoryOfArticles});
    }
    toggleAboutThisSiteHoverState() {
        this.setState({showHintOfAboutThisSite:!this.state.showHintOfAboutThisSite});
    }
    render() {
        if (this.state.viewportWidth >= 1440) {//最大螢幕
            searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);         
        } else if (this.state.viewportWidth >= 1024) {//小螢幕或水平大行動裝置
            const aspectRatio = this.state.viewportHeight / this.state.viewportWidth;
            if (aspectRatio > 0.7) { //4:3 螢幕           
                searchBarWidth = 12.5 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);              
            } else if (aspectRatio > 0.6) {//16:10 螢幕
                searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);                
            } else {//16:9 螢幕
                searchBarWidth = 13 * searchHintFontSize * (this.state.isSearchBarFocused ? 1.5 : 1);          
            }
        } else {//行動裝置或垂直的大行動裝置
            //todo
        }

        const headerBarStyle = {
            height:headerHeight + "px"            
        };
        const featureLinkStyle = {
            fontSize:featureLinkFontSize + "px",
            marginRight:featureLinkMarginRight + "px"
        }
        const groupOfFeatureLinkStyle = {
            top:groupOfFeatureLinkTop + "px"            
        }

        return (
            <header id="header-bar" style={headerBarStyle}>
                <SiteName fontSize={siteNameFontSize} top={siteNameTopPosition} left={siteNameLeftPosition} />

                <SearchBar width={searchBarWidth} height={searchBarHeight} 
                    top={searchBarTop} right={siteNameFontSize}
                    fontSizeOfFeatureLink={featureLinkFontSize}
                    toggleSearchBarState={this.toggleSearchBarState}>
                   <nav id="groupOfFeatureLinks" style={groupOfFeatureLinkStyle}>
                        <a style={featureLinkStyle} className="featureLink" 
                            onMouseEnter={this.toggleSelfIntroductionLinkHoverState}
                            onMouseLeave={this.toggleSelfIntroductionLinkHoverState}
                            >{selfIntroduction}
                            { this.state.showHintOfSelfIntroduction ?
                            <HintOfFeatureLink  fontSizeOfFeatureLink={featureLinkFontSize} 
                                charactersOfFeatureLink={selfIntroduction.length} 
                                hint={hintOfSelfIntroduction} fontSizeOfHint={featureHintFontSize} />
                            : null }
                        </a>
                        <a style={featureLinkStyle} className="featureLink"
                            onMouseEnter={this.toggleCatagoryOfArticlesHoverState}
                            onMouseLeave={this.toggleCatagoryOfArticlesHoverState}
                            >{catagoryOfArticles}
                            { this.state.showHintOfCatagoryOfArticles ?
                            <HintOfFeatureLink  fontSizeOfFeatureLink={featureLinkFontSize} 
                                charactersOfFeatureLink={catagoryOfArticles.length} 
                                hint={hintOfCatagoryOfArticles} fontSizeOfHint={featureHintFontSize} />
                            : null }
                        </a>
                        <a style={featureLinkStyle} className="featureLink"
                            onMouseEnter={this.toggleAboutThisSiteHoverState}
                            onMouseLeave={this.toggleAboutThisSiteHoverState}
                            >{aboutThisSite}
                            { this.state.showHintOfAboutThisSite ?
                            <HintOfFeatureLink  fontSizeOfFeatureLink={featureLinkFontSize} 
                                charactersOfFeatureLink={aboutThisSite.length} 
                                hint={hintOfAboutThisSite} fontSizeOfHint={featureHintFontSize} />
                            : null }
                        </a>
                    </nav> 
                </SearchBar>             
            </header>
        );
    }
}