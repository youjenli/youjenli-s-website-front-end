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
        const borderWidthOfLink = 1;
        let featureLinkIconWidth, spaceBetweenIconAndLink, fontSizeOfFeatureLink;
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
            featureLinkIconWidth = (this.props.viewportWidth + 1376) / 48;
            fontSizeOfFeatureLink = (this.props.viewportWidth + 896) / 64;
            spaceBetweenIconAndLink = (this.props.viewportWidth + 128) / 768 * fontSizeOfFeatureLink;
            const commonStyleOfFeatureLink = {
                borderTop:`${borderWidthOfLink}px solid #979797`,
                flexBasis:'50%'
            }
            styleOfSelfIntroduction = Object.assign({}, commonStyleOfFeatureLink);
            styleOfSelfIntroduction['padding'] = `${spaceBetweenMenuItems}px 0`;

            styleOfCatagoryOfArticles = Object.assign({}, styleOfSelfIntroduction);
            styleOfCatagoryOfArticles['paddingLeft'] = `${spaceBetweenMenuItems}px`;
            styleOfCatagoryOfArticles['borderLeft'] = `${borderWidthOfLink}px solid #979797`;

            styleOfAboutThisSite = Object.assign({}, commonStyleOfFeatureLink);
            styleOfAboutThisSite['paddingTop'] = `${spaceBetweenMenuItems}px`;
            
            styleOfSocialMediaGrp = Object.assign({}, styleOfAboutThisSite);
        } else {//套用手機的佈局規則
            spaceBetweenMenuItems = remFontSize * 0.5;
            const commonStyleOfFeatureLink = {
                borderTop: `${borderWidthOfLink}px solid #979797`
            };
            styleOfSelfIntroduction = Object.assign({}, commonStyleOfFeatureLink);
            styleOfSelfIntroduction['padding'] = `${spaceBetweenMenuItems}px 0`;
            
            styleOfSocialMediaGrp = Object.assign({}, commonStyleOfFeatureLink);
            styleOfSocialMediaGrp['paddingTop'] = `${spaceBetweenMenuItems}px`;
            //圖示寬度要移到這邊，這樣手機版的邏輯區域才可以判斷是否要把 social media grp 展到第三層。
            featureLinkIconWidth = 42;
            if (this.props.viewportWidth > 432) { //顯示寬度超過 432 即視為手機水平模式
                fontSizeOfSiteName = 28;
                this.headerHeight = fontSizeOfSiteName * 1.933;
                siteNameTopPosition = (this.headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = remFontSize;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.4 * fontSizeOfSiteName;
                searchBarWidth = (21 * this.props.viewportWidth + 11520) / 52;
                fontSizeOfSearchHint = 24;
                styleOfSelfIntroduction['flexBasis'] = '50%';
                styleOfCatagoryOfArticles = Object.assign({}, styleOfSelfIntroduction);
                if ((searchBarWidth / 2 - 4 * featureLinkIconWidth) / 3 < featureLinkIconWidth * 0.5) {//社群網站連結區域太窄
                    styleOfCatagoryOfArticles['borderBottom'] = `${borderWidthOfLink}px solid #979797`;
                    styleOfAboutThisSite = Object.assign({}, styleOfSelfIntroduction); 
                    styleOfSocialMediaGrp['flexBasis'] = '100%';
                } else {//社群網站連結不會太窄
                    styleOfAboutThisSite = Object.assign({}, commonStyleOfFeatureLink);
                    styleOfAboutThisSite['paddingTop'] = `${spaceBetweenMenuItems}px`;
                    styleOfAboutThisSite['flexBasis'] = '50%';
                    styleOfSocialMediaGrp['flexBasis'] = '50%';
                }
                styleOfCatagoryOfArticles['paddingLeft'] = `${spaceBetweenMenuItems}px`;
                styleOfCatagoryOfArticles['borderLeft'] = `${borderWidthOfLink}px solid #979797`;
            } else {//顯示寬度小於 432 即視為手機垂直模式
                fontSizeOfSiteName = (this.props.viewportWidth + 352) / 28;
                this.headerHeight = (5 * this.props.viewportWidth + 4336) / 112;
                siteNameTopPosition = (this.headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = remFontSize;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.5 * fontSizeOfSiteName;
                searchBarWidth = this.props.viewportWidth - 2 * remFontSize;
                fontSizeOfSearchHint = (this.props.viewportWidth * 3 + 48) / 56;
                styleOfSelfIntroduction['flexBasis'] = '100%';
                styleOfCatagoryOfArticles = styleOfSelfIntroduction;
                styleOfAboutThisSite = styleOfSelfIntroduction;
                styleOfSocialMediaGrp['flexBasis'] = '100%';          
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
            width:`${featureLinkIconWidth}px`
        };
      
        styleOfSocialMediaBtn = {
            width:`${featureLinkIconWidth}px`
        }

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
                                    <img className="icon" style={styleOfLinkIcon} src="/img/curriculum-vitae.svg" />
                                    <span>{terms.selfIntroduction}</span>{this.props.viewportWidth <= 432 ? <ArrowShape /> : null}
                                </a>
                                <a className="link" style={styleOfCatagoryOfArticles} id="catagory">
                                    <img className="icon" style={styleOfLinkIcon} src="/img/terms-catagory.svg" />
                                    <span>{terms.catagoryOfArticles}</span>{this.props.viewportWidth <= 432 ? <ArrowShape /> : null}
                                </a>
                                <a className="link" style={styleOfAboutThisSite} id="about">
                                    <img className="icon" style={styleOfLinkIcon} src="/img/programming-code.svg" />
                                    <span>{terms.aboutThisSite}</span>{this.props.viewportWidth <= 432 ? <ArrowShape /> : null}
                                </a>
                                <div id="socialMediaGrp" className="link"  style={styleOfSocialMediaGrp}>
                                    <a href={terms.facebookPersonalPage} target="_blank">
                                        <img style={styleOfSocialMediaBtn} src="/img/facebook-icon-link.svg"                                         
                                        title={terms.facebookIconTitle} alt={terms.facebookIconAlt}/></a>
                                    <a href={terms.githubPersonalPage} target="_blank">
                                        <img style={styleOfSocialMediaBtn} src="/img/github-icon-link.svg"
                                        title={terms.githubIconTitle} alt={terms.githubIconAlt}/></a>
                                    <a href={terms.stackoverflowPersonalPage} target="_blank">
                                        <img style={styleOfSocialMediaBtn} src="/img/stack_overflow-icon-link.svg"
                                        title={terms.stackOverflowIconTitle} alt={terms.stackOverflowIconAlt} /></a>
                                    <a href={terms.youtubePlayList} target="_blank">
                                        <img style={styleOfSocialMediaBtn} src="/img/youtube-icon-link.svg"
                                        title={terms.youtubeIconTitle} alt={terms.youtubeIconAlt} /></a>
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



class ArrowShape extends React.Component {
    render() {
        return (
            <svg className="arrow" width="42px" height="32px" viewBox="0 0 42 32" version="1.1">
                <g transform="translate(-358.000000, -74.000000)" fill-rule="nonzero">
                    <g transform="translate(0.000000, 70.000000)">
                        <g transform="translate(358.000000, 4.600000)">
                            <path d="M28.2823118,0.466218047 C27.7101302,-0.155406016 26.7578279,-0.155406016 26.1656399,0.466218047 C25.5934582,1.0668413 25.5934582,2.06647999 26.1656399,2.66570319 L36.8983804,13.9319393 L1.48180375,13.9319393 C0.65620832,13.9333394 0,14.622166 0,15.4887996 C0,16.3554331 0.65620832,17.0666606 1.48180375,17.0666606 L36.8983804,17.0666606 L26.1656399,28.3118959 C25.5934582,28.93352 25.5934582,29.9345588 26.1656399,30.533782 C26.7578279,31.155406 27.711464,31.155406 28.2823118,30.533782 L41.555859,16.6004426 C42.148047,15.9998193 42.148047,15.0001807 41.555859,14.4009575 L28.2823118,0.466218047 Z"></path>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}