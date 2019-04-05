import * as React from 'react';
import SiteName from './site-name';
import base64EncodedTitle from './site-name-2_5x_base64';
import MobileDeviceSearchBar from './mobile-device-search-bar';
import { calculateViewPortHeight } from '../../service/dimensionsCalculator';

interface MobileDeviceTitleBarProps {
    viewportWidth:number;
}

interface MobileDeviceTitleBarState {
    isMenuOpened:boolean;
}

export default class MobileDeviceTitleBar extends 
    React.Component<MobileDeviceTitleBarProps, MobileDeviceTitleBarState> {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpened:false
        };
        this.toggleMenuState = this.toggleMenuState.bind(this);
    }
    toggleMenuState() {
        this.setState({isMenuOpened:!this.state.isMenuOpened});
    }
    render(){
        const siteName = "祐任的個人網站";
        let headerHeight;
        let fontSizeOfSiteName, siteNameTopPosition, siteNameLeftPosition;
        let menuButtonBarWidth, menuButtonBarHeight, menuButtonBarTransformOrigin, menuButtonBarBorderRadius;
        let topShiftOfMenuButton, rightShiftOfMenuButton, spaceBetweenTwoBars;
        let topShiftOfMenu, maxHeightOfMenu, spaceBetweenMenuAndContent;
        let searchBarWidth, searchBarHeight, fontSizeOfSearchHint, searchIconWidth, searchIconHeight;
        let spaceBetweenMenuItems;
        let iconWidth, fontSizeOfFeatureLink, spaceBetweenIconAndLink;
        
        const remFontSize = ( this.props.viewportWidth > 432 ? 18 : 16);
        if (this.props.viewportWidth > 640 ) {//平板
            fontSizeOfSiteName = ((Math.log10(this.props.viewportWidth/640)/1.6) + 1) * 28;
            headerHeight = fontSizeOfSiteName * 1.933;
            siteNameTopPosition = (headerHeight - fontSizeOfSiteName)/2
            siteNameLeftPosition = (this.props.viewportWidth - fontSizeOfSiteName * siteName.length) / 2;
            rightShiftOfMenuButton = remFontSize;
            menuButtonBarWidth = 1.4 * fontSizeOfSiteName;
            searchBarWidth = this.props.viewportWidth * 0.75;
            fontSizeOfSearchHint = (this.props.viewportWidth + 1664) / 96;
            searchBarHeight = (fontSizeOfSearchHint * 9.5 - 16)/4;
            spaceBetweenMenuItems = remFontSize * 0.75;
            searchIconWidth = (this.props.viewportWidth + 3008) / 96;
            searchIconHeight = searchIconWidth;
            iconWidth = (this.props.viewportWidth + 1376) / 48;
            fontSizeOfFeatureLink = (this.props.viewportWidth + 896) / 64;
            spaceBetweenIconAndLink = (this.props.viewportWidth + 128) / 768 * fontSizeOfFeatureLink;
        } else {//套用手機的佈局規則
            if (this.props.viewportWidth > 432) { //顯示寬度超過 432 即視為手機水平模式
                fontSizeOfSiteName = 28;
                headerHeight = fontSizeOfSiteName * 1.933;
                siteNameTopPosition = (headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = remFontSize;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.4 * fontSizeOfSiteName;
                searchBarWidth = (21 * this.props.viewportWidth + 11520) / 52;
                fontSizeOfSearchHint = 24;
                
            } else {//顯示寬度小於 432 即視為手機垂直模式
                fontSizeOfSiteName = (this.props.viewportWidth + 352) / 28;
                headerHeight = (-0.14 * this.props.viewportWidth + 292.32) / 112;
                siteNameTopPosition = (headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = remFontSize;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.5 * fontSizeOfSiteName;
                searchBarWidth = this.props.viewportWidth - 2 * remFontSize;
                fontSizeOfSearchHint = (this.props.viewportWidth * 3 + 48) / 56;
            }
            searchBarHeight = 53;
            spaceBetweenMenuItems = remFontSize * 0.5;
            searchIconWidth = 42;
            searchIconHeight = 38;
            iconWidth = 42;
            fontSizeOfFeatureLink = 24;
            spaceBetweenIconAndLink = fontSizeOfFeatureLink * 1.5;
        }
        topShiftOfMenu = headerHeight;
        maxHeightOfMenu = calculateViewPortHeight() - headerHeight;
        spaceBetweenMenuAndContent = remFontSize;
        menuButtonBarHeight = menuButtonBarWidth / 10;
        spaceBetweenTwoBars = 2 * menuButtonBarHeight;
        menuButtonBarTransformOrigin = Math.round((
            (menuButtonBarWidth - (spaceBetweenTwoBars + menuButtonBarHeight) * Math.sqrt(2)) 
            / (2 * menuButtonBarWidth)
          )*100);
        menuButtonBarBorderRadius = Math.round(menuButtonBarWidth * 0.057);
        topShiftOfMenuButton = (headerHeight - 2 * menuButtonBarHeight - 3 * spaceBetweenTwoBars )/2;

        const headerStyle = {
            height:headerHeight
        };

        const styleOfMenuContent = {
            width:`${searchBarWidth}px`
        };

        const menuBtnStyle = {
            top:`${topShiftOfMenuButton}px`,
            right:`${rightShiftOfMenuButton}px`
        }
        const upperBarStyle = {
            width:`${menuButtonBarWidth}px`,
            height:`${menuButtonBarHeight}px`,
            marginTop:`${spaceBetweenTwoBars}px`,
            borderRadius: `${menuButtonBarBorderRadius}px`,
            transformOrigin:`${menuButtonBarTransformOrigin}% 50% 0`
        }
        const lowerBarStyle = {
            width:`${menuButtonBarWidth}px`,
            height:`${menuButtonBarHeight}px`,
            margin:`${spaceBetweenTwoBars}px 0`,
            borderRadius: `${menuButtonBarBorderRadius}px`,
            transformOrigin:`${menuButtonBarTransformOrigin}% 50% 0`
        }

        let styleOfMenu, styleOfShadow;
        if (this.state.isMenuOpened) {
            styleOfMenu = {
                top:`${topShiftOfMenu}px`,
                maxHeight:`${maxHeightOfMenu}px`,
                padding:`${spaceBetweenMenuAndContent}px 0`
            }
    
            styleOfShadow = {//畫面陰影會躲在選單後面，因此尺寸和選單相似
                top:`${topShiftOfMenu}px`,
                height:`${maxHeightOfMenu}px`
            }
        }        

        return (
            <div id="header-ctx" className={this.state.isMenuOpened ? "menuOpened":""}>
                <header id="header-bar" style={headerStyle}>
                   <SiteName name={siteName} base64EncodedTitle={base64EncodedTitle}
                       fontSize={fontSizeOfSiteName} top={siteNameTopPosition} left={siteNameLeftPosition} />
                   <span className="menuBtn" style={menuBtnStyle}
                        onClick={this.toggleMenuState} onTouchStart={this.toggleMenuState}>                  
                           <div className={"upper bar " + (this.state.isMenuOpened ? "rotate":"")} style={upperBarStyle} ></div>
                           <div className={"lower bar " + (this.state.isMenuOpened ? "rotate":"")}  style={lowerBarStyle} ></div>
                   </span>
                </header>
                { this.state.isMenuOpened ?
                    <React.Fragment>
                        <div id="shadow" style={styleOfShadow}></div>
                        <div className="menu" style={styleOfMenu}>
                            <nav className="content" style={styleOfMenuContent}>
                                <MobileDeviceSearchBar searchBarHeight={searchBarHeight} searchBarWidth={searchBarWidth}
                                     fontSizeOfSearchHint={fontSizeOfSearchHint} marginBottom={spaceBetweenMenuItems}
                                     searchIconWidth={searchIconWidth} searchIconHeight={searchIconHeight} />
                            </nav>
                        </div>    
                    </React.Fragment>                    
                : null }                
            </div>
            //todo lightbox 陰影和選單外框、標題列在選單上的陰影。
        );
    }
}