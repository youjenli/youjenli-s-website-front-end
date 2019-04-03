import * as React from 'react';
import SiteName from './site-name';

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
        let fontSizeOfSiteName;
        let headerHeight;
        let siteNameTopPosition, siteNameLeftPosition;
        let menuButtonBarWidth, menuButtonBarHeight, menuButtonBarTransformOrigin, menuButtonBarBorderRadius;
        let topShiftOfMenuButton, rightShiftOfMenuButton;
        let spaceBetweenTwoBars;
        
        if (this.props.viewportWidth > 1024) {
            //todo 拋出例外
        } else if (this.props.viewportWidth > 640 ) {//平板
            fontSizeOfSiteName = ((Math.log10(this.props.viewportWidth/640)/1.6) + 1) * 28;
            headerHeight = fontSizeOfSiteName * 1.933;
            siteNameTopPosition = (headerHeight - fontSizeOfSiteName)/2
            siteNameLeftPosition = 18 * 1;//todo 標錯了 解決需要標題寬度才能推 left shift 的問題
            rightShiftOfMenuButton = 18 * 1;
            menuButtonBarWidth = 1.4 * fontSizeOfSiteName;
        } else {//手機的情況
            if (window.innerWidth >= window.innerHeight) { //水平模式
                fontSizeOfSiteName = 28;
                headerHeight = fontSizeOfSiteName * 1.933;
                siteNameTopPosition = (headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = 18 * 1;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.4 * fontSizeOfSiteName;
            } else {//垂直模式
                fontSizeOfSiteName = (this.props.viewportWidth + 352) / 28;
                headerHeight = (-0.14 * this.props.viewportWidth + 292.32) / 112;
                siteNameTopPosition = (headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = 16 * 1;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.5 * fontSizeOfSiteName;
            }
        }
       
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
        const classNamesOfBar = "bar " + (this.state.isMenuOpened ? "open": "");

        return (
            <header id="header-bar" style={headerStyle}>
                <SiteName fontSize={fontSizeOfSiteName} top={siteNameTopPosition} left={siteNameLeftPosition} />

                <span id="menuBtn" style={menuBtnStyle} onClick={this.toggleMenuState}
                    onTouchStart={this.toggleMenuState}>
                    <div className={"upper " + classNamesOfBar} style={upperBarStyle}></div>
                    <div className={"lower " + classNamesOfBar} style={lowerBarStyle}></div>
                </span>
            </header>
        )
    }
}