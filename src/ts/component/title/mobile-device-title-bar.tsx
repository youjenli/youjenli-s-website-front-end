import * as React from 'react';
import SiteName from './site-name';
import base64EncodedTitle from './site-name-2_5x_base64';
import MobileDeviceSearchBar from './mobile-device-search-bar';
import { calculateViewPortHeight } from '../../service/dimensionsCalculator';
import { isStickyPositionSupported } from '../../service/featureDetection';
import debounce from '../../service/debounce';
import * as terms from './terms';

interface MobileDeviceTitleBarProps {
    viewportWidth:number;
}

interface MobileDeviceTitleBarState {
    isMenuOpened:boolean;
    shouldTitleBeSticky:boolean;
}

export default class MobileDeviceTitleBar extends 
    React.Component<MobileDeviceTitleBarProps, MobileDeviceTitleBarState> {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpened:false,
            shouldTitleBeSticky:false
        };
        this.toggleMenuState = this.toggleMenuState.bind(this);
    }
    headerHeight:number
    onWindowScroll
    toggleMenuState() {
        this.setState({isMenuOpened:!this.state.isMenuOpened});
        const reactRoot:HTMLElement = document.querySelector('#react-root');
        reactRoot.classList.toggle('trim');
    }
    componentDidMount() {
        if (!isStickyPositionSupported()) {
            this.onWindowScroll = debounce(()=>{
                this.setState({
                    shouldTitleBeSticky:(window.scrollY >= this.headerHeight)
                });
            }, 150);
            window.addEventListener('scroll', this.onWindowScroll);
        }        
    }
    componentWillUnmount() {
        if (!isStickyPositionSupported()) {
            window.removeEventListener('scroll', this.onWindowScroll);
        }        
        const reactRoot:HTMLElement = document.querySelector('#react-root');
        reactRoot.classList.remove('trim');
    }
    render(){
        let fontSizeOfSiteName, siteNameTopPosition, siteNameLeftPosition;
        let menuButtonBarWidth, menuButtonBarHeight, menuButtonBarTransformOrigin, menuButtonBarBorderRadius;
        let topShiftOfMenuButton, rightShiftOfMenuButton, spaceBetweenTwoBars;
        let topShiftOfMenu, maxHeightOfMenu, spaceBetweenMenuAndContent;
        let searchBarWidth, searchBarHeight, fontSizeOfSearchHint, searchIconWidth, searchIconHeight;
        let spaceBetweenMenuItems;
        let iconWidth, spaceBetweenIconAndLink, fontSizeOfFeatureLink;
        let flexBasisOfSocialMediaGrp;
        let styleOfSelfIntroduction, styleOfCatagoryOfArticles, styleOfAboutThisSite, styleOfSocialMediaGrp;
        let styleOfLinkIcon, styleOfSocialMediaBtn;

        const remFontSize = ( this.props.viewportWidth > 432 ? 18 : 16);
        if (this.props.viewportWidth > 640 ) {//平板
            fontSizeOfSiteName = ((Math.log10(this.props.viewportWidth/640)/1.6) + 1) * 28;
            this.headerHeight = fontSizeOfSiteName * 1.933;
            siteNameTopPosition = (this.headerHeight - fontSizeOfSiteName)/2
            siteNameLeftPosition = (this.props.viewportWidth - fontSizeOfSiteName * terms.siteName.length) / 2;
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
            flexBasisOfSocialMediaGrp = 50;
            styleOfSelfIntroduction = {
                padding:`${spaceBetweenMenuItems}px 0`
            };
            styleOfCatagoryOfArticles = Object.assign({}, styleOfSelfIntroduction);
            styleOfCatagoryOfArticles['paddingLeft'] = `${spaceBetweenMenuItems}px`;
            styleOfCatagoryOfArticles['borderLeft'] = `1px`;
            styleOfAboutThisSite = {
                paddingTop:`${spaceBetweenMenuItems}px`
            };
        } else {//套用手機的佈局規則
            spaceBetweenMenuItems = remFontSize * 0.5;
            //圖示寬度要移到這邊，這樣手機版的邏輯區域才可以判斷是否要把 social media grp 展到第三層。
            iconWidth = 42;
            //選單同一列第一項元素的樣式表要移到這邊，這樣才可以給第二項元素引用
            styleOfSelfIntroduction = {
                padding:`${spaceBetweenMenuItems}px 0`
            };
            if (this.props.viewportWidth > 432) { //顯示寬度超過 432 即視為手機水平模式
                fontSizeOfSiteName = 28;
                this.headerHeight = fontSizeOfSiteName * 1.933;
                siteNameTopPosition = (this.headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = remFontSize;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.4 * fontSizeOfSiteName;
                searchBarWidth = (21 * this.props.viewportWidth + 11520) / 52;
                fontSizeOfSearchHint = 24;
                //選單同一列第二項元素的樣式表要移到這邊，這樣才能減少重覆判斷
                styleOfCatagoryOfArticles = Object.assign({}, styleOfSelfIntroduction);
                styleOfCatagoryOfArticles['paddingLeft'] = `${spaceBetweenMenuItems}px`;
                styleOfCatagoryOfArticles['borderLeft'] = `1px`;
                if (iconWidth * 4 + remFontSize * 0.5 * 3 < searchBarWidth * 0.5) {
                    styleOfAboutThisSite = {
                        paddingTop:`${spaceBetweenMenuItems}px`
                    };
                    flexBasisOfSocialMediaGrp = 50;
                } else {
                    styleOfCatagoryOfArticles['borderBottom'] = `1px`;
                    styleOfAboutThisSite = Object.assign({}, styleOfSelfIntroduction);
                    flexBasisOfSocialMediaGrp = 100;
                }              
            } else {//顯示寬度小於 432 即視為手機垂直模式
                fontSizeOfSiteName = (this.props.viewportWidth + 352) / 28;
                this.headerHeight = (-0.14 * this.props.viewportWidth + 292.32) / 112;
                siteNameTopPosition = (this.headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = remFontSize;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.5 * fontSizeOfSiteName;
                searchBarWidth = this.props.viewportWidth - 2 * remFontSize;
                fontSizeOfSearchHint = (this.props.viewportWidth * 3 + 48) / 56;
                flexBasisOfSocialMediaGrp = 100;
                styleOfCatagoryOfArticles = styleOfSelfIntroduction;
                styleOfAboutThisSite = styleOfSelfIntroduction;
            }
            searchBarHeight = 53;
            searchIconWidth = 42;
            searchIconHeight = 38;
            fontSizeOfFeatureLink = 24;
            spaceBetweenIconAndLink = fontSizeOfFeatureLink * 1.5;
        }
        topShiftOfMenu = this.headerHeight;
        maxHeightOfMenu = calculateViewPortHeight() - this.headerHeight;
        spaceBetweenMenuAndContent = remFontSize;
        menuButtonBarHeight = menuButtonBarWidth / 10;
        spaceBetweenTwoBars = 2 * menuButtonBarHeight;
        menuButtonBarTransformOrigin = Math.round((
            (menuButtonBarWidth - (spaceBetweenTwoBars + menuButtonBarHeight) * Math.sqrt(2)) 
            / (2 * menuButtonBarWidth)
          )*100);
        menuButtonBarBorderRadius = Math.round(menuButtonBarWidth * 0.057);
        topShiftOfMenuButton = (this.headerHeight - 2 * menuButtonBarHeight - 3 * spaceBetweenTwoBars )/2;

        let classesOfHeaderCtx = "";
        if (this.state.isMenuOpened) {
            classesOfHeaderCtx = classesOfHeaderCtx + "menuOpened ";
        }
        if (!isStickyPositionSupported() && this.state.shouldTitleBeSticky) {
            classesOfHeaderCtx = classesOfHeaderCtx + "sticky";
        }

        const headerStyle = {
            height:this.headerHeight
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
        
        styleOfLinkIcon = {
            marginRight:`${spaceBetweenIconAndLink}px`,
            width:`${iconWidth}px`
        };
      
        styleOfSocialMediaBtn = {
            width:`${iconWidth}px`
        }

        styleOfSocialMediaGrp = Object.assign({}, styleOfSelfIntroduction);
        styleOfSocialMediaGrp['flexBasis'] =`${flexBasisOfSocialMediaGrp}%`;

        return (
            <React.Fragment>
            { (!isStickyPositionSupported() && this.state.shouldTitleBeSticky) ?
                <div id="header-plhdr" style={headerStyle}></div> 
            : null }
            <div id="header-ctx" className={classesOfHeaderCtx}>
                <header id="header-bar" style={headerStyle}>
                   <SiteName name={terms.siteName} base64EncodedTitle={base64EncodedTitle}
                       fontSize={fontSizeOfSiteName} top={siteNameTopPosition} left={siteNameLeftPosition} />
                   <span className="menuBtn" style={menuBtnStyle}
                        onClick={this.toggleMenuState} onTouchStart={this.toggleMenuState}>                  
                           <div className={"upper bar " + (this.state.isMenuOpened ? "rotate":"")} style={upperBarStyle} ></div>
                           <div className={"lower bar " + (this.state.isMenuOpened ? "rotate":"")}  style={lowerBarStyle} ></div>
                   </span>
                </header>
                { this.state.isMenuOpened ?
                    <React.Fragment>
                        <div id="shadow" style={styleOfShadow} onClick={this.toggleMenuState}
                            onTouchStart={this.toggleMenuState} ></div>
                        <div className="menu" style={styleOfMenu}>
                            <nav className="content" style={styleOfMenuContent}>
                                <MobileDeviceSearchBar searchBarHeight={searchBarHeight} searchBarWidth={searchBarWidth}
                                     fontSizeOfSearchHint={fontSizeOfSearchHint} marginBottom={spaceBetweenMenuItems}
                                     searchIconWidth={searchIconWidth} searchIconHeight={searchIconHeight} />
                                <a className="link" style={styleOfSelfIntroduction} id="cv">
                                    <img className="icon" style={styleOfLinkIcon} src="/img/curriculum-vitae.svg" />{terms.selfIntroduction}</a>
                                <a className="link" style={styleOfCatagoryOfArticles} id="catagory">
                                    <img className="icon" style={styleOfLinkIcon} src="/img/terms-catagory.svg" />{terms.catagoryOfArticles}</a>
                                <a className="link" style={styleOfAboutThisSite} id="about">
                                    <img className="icon" style={styleOfLinkIcon} src="/img/programming-code.svg" />{terms.aboutThisSite}</a>
                                <div id="socialMediaGrp" className="link"  style={styleOfSocialMediaGrp}>
                                    <img style={styleOfSocialMediaBtn} className="media" src="/img/facebook-icon-link.svg" title={terms.facebookIconTitle} 
                                        alt={terms.facebookIconAlt}/>
                                    <img style={styleOfSocialMediaBtn} className="media" src="/img/github-icon-link.svg" title={terms.githubIconTitle} 
                                        alt={terms.githubIconAlt}/>
                                    <img style={styleOfSocialMediaBtn} className="media" src="/img/stack_overflow-icon-link.svg" title={terms.stackOverflowIconTitle}
                                        alt={terms.stackOverflowIconAlt} />
                                    <img style={styleOfSocialMediaBtn} className="media" src="/img/youtube-icon-link.svg" title={terms.youtubeIconTitle} 
                                        alt={terms.youtubeIconAlt} />
                                </div> 
                            </nav>
                        </div>    
                    </React.Fragment>                    
                : null }                
            </div>
            </React.Fragment>
        );
    }
}