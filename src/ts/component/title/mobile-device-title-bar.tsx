/// <reference path="../../model/global-vars.d.ts"/>
import * as React from 'react';
import { isString, isNotBlank } from '../../service/validator';
import { MenuItem } from '../../model/global-vars';
import SiteName from './site-name';
import base64EncodedTitle from './site-name-2_5x_base64';
import MobileDeviceSearchBar from './mobile-device-search-bar';
import { calculateViewPortHeight } from '../../service/dimensionsCalculator';
import { isStickyPositionSupported } from '../../service/featureDetection';
import {loadMenuItems} from './menu-items-loader';
import debounce from '../../service/debounce';
import * as terms from './terms';
import * as socialMediaTerms from '../home/slogan/socialMedia/terms';
import * as icons from '../home/slogan/socialMedia/icons';
import { reactRoot } from '../../index';

interface MobileDeviceTitleBarProps {
    className:string;
    viewportWidth:number;
    baseZIndex:number;
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
        this.menuItems = loadMenuItems();
    }
    menuItems:MenuItem[]
    headerHeight:number
    onWindowScroll
    toggleMenuState() {
        this.setState({isMenuOpened:!this.state.isMenuOpened});
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
        reactRoot.classList.remove('trim');
    }
    render(){
        let fontSizeOfSiteName, siteNameTopPosition, siteNameLeftPosition;
        let menuButtonBarWidth, menuButtonBarHeight, menuButtonBarTransformOrigin, menuButtonBarBorderRadius;
        let topShiftOfMenuButton, rightShiftOfMenuButton, spaceBetweenTwoBars;
        let topShiftOfMenu, maxHeightOfMenu;
        let searchBarWidth, searchBarHeight, fontSizeOfSearchHint, searchIconWidth, searchIconHeight;
        let paddingOfMenuItems;
        const borderWidthOfLink = 1;
        let iconWidthOfFeaturedLink, spaceBetweenIconAndLink, fontSizeOfFeaturedLink;
        let commonStyleOfLinkOnMenu = null, menuItemsPerRow = 2, shouldSocialMediaGrpSpanTheWholeRow = false;
        let styleOfSocialMediaGrp = null;
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
            paddingOfMenuItems = remFontSize * 0.75;
            searchIconWidth = (this.props.viewportWidth + 3008) / 96;
            searchIconHeight = searchIconWidth;
            iconWidthOfFeaturedLink = (this.props.viewportWidth + 1376) / 48;
            fontSizeOfFeaturedLink = (this.props.viewportWidth + 896) / 64;
            spaceBetweenIconAndLink = (this.props.viewportWidth + 128) / 768 * fontSizeOfFeaturedLink;
            commonStyleOfLinkOnMenu = {
                flexBasis:'50%',
                fontSize:`${fontSizeOfFeaturedLink}px`,
            }
            styleOfSocialMediaGrp = {
                flexBasis:'50%',
                paddingTop:`${paddingOfMenuItems}px`
            }
            menuItemsPerRow = 2;
        } else {//套用手機的佈局規則
            paddingOfMenuItems = remFontSize * 0.5;
            fontSizeOfFeaturedLink = 24;
            commonStyleOfLinkOnMenu = {
                fontSize:`${fontSizeOfFeaturedLink}px`
            }
            styleOfSocialMediaGrp = {
                paddingTop:`${paddingOfMenuItems}px`
            }
            //圖示寬度要移到這邊，這樣手機版的邏輯區域才可以判斷是否要把 social media grp 展到第三層。
            iconWidthOfFeaturedLink = 42;
            if (this.props.viewportWidth > 432) { //顯示寬度超過 432 即視為手機水平模式
                fontSizeOfSiteName = 28;
                this.headerHeight = fontSizeOfSiteName * 1.933;
                siteNameTopPosition = (this.headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = remFontSize;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.4 * fontSizeOfSiteName;
                searchBarWidth = (21 * this.props.viewportWidth + 11520) / 52;
                fontSizeOfSearchHint = 24;
                commonStyleOfLinkOnMenu['flexBasis'] = '50%';
                menuItemsPerRow = 2;
                if ((searchBarWidth / 2 - 4 * iconWidthOfFeaturedLink) / 3 < iconWidthOfFeaturedLink * 0.5) {//社群網站連結區域比較窄
                    styleOfSocialMediaGrp['flexBasis'] = '100%';
                    shouldSocialMediaGrpSpanTheWholeRow = true;
                } else {//社群網站連結不會太窄
                    styleOfSocialMediaGrp['flexBasis'] = '50%';
                }
            } else {//顯示寬度小於 432 即視為手機垂直模式
                fontSizeOfSiteName = (this.props.viewportWidth + 352) / 28;
                this.headerHeight = (5 * this.props.viewportWidth + 4336) / 112;
                siteNameTopPosition = (this.headerHeight - fontSizeOfSiteName)/2
                siteNameLeftPosition = remFontSize;
                rightShiftOfMenuButton = siteNameLeftPosition;
                menuButtonBarWidth = 1.5 * fontSizeOfSiteName;
                searchBarWidth = this.props.viewportWidth - 2 * remFontSize;
                fontSizeOfSearchHint = (this.props.viewportWidth * 3 + 48) / 56;

                commonStyleOfLinkOnMenu['flexBasis'] = '100%';
                menuItemsPerRow = 1;
                styleOfSocialMediaGrp['flexBasis'] = '100%';
                shouldSocialMediaGrpSpanTheWholeRow = true;
            }
            searchBarHeight = 53;
            searchIconWidth = 42;
            searchIconHeight = 38;
            spaceBetweenIconAndLink = fontSizeOfFeaturedLink * 1.5;
        }
        topShiftOfMenu = this.headerHeight;
        maxHeightOfMenu = calculateViewPortHeight() - this.headerHeight;
        menuButtonBarHeight = menuButtonBarWidth / 10;
        spaceBetweenTwoBars = 2 * menuButtonBarHeight;
        menuButtonBarTransformOrigin = Math.round((
            (menuButtonBarWidth - (spaceBetweenTwoBars + menuButtonBarHeight) * Math.sqrt(2)) 
            / (2 * menuButtonBarWidth)
          )*100);
        menuButtonBarBorderRadius = Math.round(menuButtonBarWidth * 0.057);
        topShiftOfMenuButton = (this.headerHeight - 2 * menuButtonBarHeight - 3 * spaceBetweenTwoBars )/2;

        let classesOfHeaderCtx = this.props.className;
        if (this.state.isMenuOpened) {
            classesOfHeaderCtx = classesOfHeaderCtx + " menuOpened ";
        }
        if (!isStickyPositionSupported() && this.state.shouldTitleBeSticky) {
            classesOfHeaderCtx = classesOfHeaderCtx + " sticky";
        }
        
        const headerCtxStyle = {
            zIndex:this.props.baseZIndex + 2
        }

        const headerStyle = {
            height:this.headerHeight,
            zIndex:this.props.baseZIndex + 5
        };

        let plhdrStyle = {
            height:this.headerHeight,
            zIndex:this.props.baseZIndex + 1
        }

        const menuBtnStyle = {
            top:`${topShiftOfMenuButton}px`,
            right:`${rightShiftOfMenuButton}px`
        }

        let styleOfMenu, styleOfShadow;
        if (this.state.isMenuOpened) {
            styleOfMenu = {
                top:`${topShiftOfMenu}px`,
                maxHeight:`${maxHeightOfMenu}px`,
                zIndex:this.props.baseZIndex + 4
            }
    
            styleOfShadow = {//畫面陰影會躲在選單後面，因此尺寸和選單相似
                top:`${topShiftOfMenu}px`,
                height:`${maxHeightOfMenu}px`,
                zIndex:this.props.baseZIndex + 3
            }
        }

        const styleOfMenuContent = {
            width:`${searchBarWidth}px`,
            fontSize:`${remFontSize}px`
        };

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
        
        styleOfLinkIcon = {
            marginRight:`${spaceBetweenIconAndLink}px`,
            width:`${iconWidthOfFeaturedLink}px`
        };
      
        styleOfSocialMediaBtn = {
            width:`${iconWidthOfFeaturedLink}px`
        }

        let featuredLinks = null;
        if (this.state.isMenuOpened && this.menuItems.length > 0) {
            const arrowShape = this.props.viewportWidth <= 432 ? <ArrowShape /> : null;
            featuredLinks = [];

            const createMenuItemElement = function(dataOfItem, keyOfItem:number, styleOfItem:React.CSSProperties) {
                let id = null, additionalClass = '';
                if (isString(dataOfItem.id)) {
                    id = dataOfItem.id;
                } else {
                    additionalClass = 'others';
                }
                const urlOfIcon = isNotBlank(dataOfItem.pathOfIcon) ? dataOfItem.pathOfIcon : window.wp.themeUrl + 'img/terms-category.svg';
                return (
                    <a className={`link item ${additionalClass}`} style={styleOfItem} 
                        key={keyOfItem} href={dataOfItem.url} id={id} data-navigo>
                        <img className="icon" style={styleOfLinkIcon} src={urlOfIcon} />
                        <span>{dataOfItem.name}</span>{arrowShape}
                    </a>
                );
            }
            
            let gridItems = this.menuItems.length;
            if (!shouldSocialMediaGrpSpanTheWholeRow || menuItemsPerRow == 1) {
                /* 注意，這裡要一併考慮 menuItemsPerRow 是 1 的情況，否則最後會多產生一道連結。
                 */
                gridItems ++;
            }

            //先處理不用考慮 padding-bottom 和 border-bottom 的連結
            let styleOfFirstChild = Object.assign({}, commonStyleOfLinkOnMenu);
                styleOfFirstChild['padding'] = `${paddingOfMenuItems}px 0`;
            let styleOfChildrenWhichIsNotFirstChild = Object.assign({}, commonStyleOfLinkOnMenu);
                styleOfChildrenWhichIsNotFirstChild['borderLeft'] = `${borderWidthOfLink}px solid #979797`;
                styleOfChildrenWhichIsNotFirstChild['padding'] = 
                    `${paddingOfMenuItems}px 0 ${paddingOfMenuItems}px ${paddingOfMenuItems}px`;
            let startIndex = gridItems - menuItemsPerRow;//todo 變數名稱取得不好，要改成更貼切的
            if (startIndex < 0) {
                startIndex = 0;
            }
            const normalItems = this.menuItems.slice(0, startIndex);//todo 變數名稱取得不好，要改成更貼切的
            for (let k = 0 ; k < normalItems.length ; k ++) {
                 const item = this.menuItems[k];
                 if (k % menuItemsPerRow == 0) {
                     featuredLinks.push(
                         createMenuItemElement(item, k, styleOfFirstChild)
                     );
                 } else {
                     featuredLinks.push(
                         createMenuItemElement(item, k, styleOfChildrenWhichIsNotFirstChild)
                     );
                 }
            }
            
            /* 再來考慮最後幾道連結的處置方式。
               首先判斷是否要繼續處理，若不用的話就結束作業，不要浪費資源產生樣式設定。
             */
            if (startIndex < this.menuItems.length) {
                if (shouldSocialMediaGrpSpanTheWholeRow) {
                    /*
                       這意謂
                       1. 每一道連結都有 padding-bottom 
                       2. 若最後一列沒塞滿，那倒數第二列下面沒有東西的連結有 border-bottom
                    */
                    let styleOfChildrenWhichDoesNotHaveSiblingsBelow = null;
                    if (gridItems > menuItemsPerRow && gridItems % menuItemsPerRow > 0 ) {
                        /* 這意謂倒數第二列有些連結下面沒東西，要為他們加上 border-bottom。
                        */
                       styleOfChildrenWhichDoesNotHaveSiblingsBelow = 
                            Object.assign({}, styleOfChildrenWhichIsNotFirstChild);
                       styleOfChildrenWhichDoesNotHaveSiblingsBelow['borderBottom'] = 
                            `${borderWidthOfLink}px solid #979797`;
    
                       const demarcation = startIndex % menuItemsPerRow;
                       for (let i = startIndex ; i < this.menuItems.length ; i ++) {
                          const item = this.menuItems[i];
                          const remainder = i % menuItemsPerRow;
                          if (remainder >= demarcation) {
                            featuredLinks.push(
                                createMenuItemElement(item, i, styleOfChildrenWhichDoesNotHaveSiblingsBelow)
                            );
                          } else if (remainder == 0) {
                            featuredLinks.push(
                                createMenuItemElement(item, i, styleOfFirstChild)
                            );
                          } else {
                            featuredLinks.push(
                                createMenuItemElement(item, i, styleOfChildrenWhichIsNotFirstChild)
                            );
                          }
                       }
                    } else {
                        /* 其他情況意謂沒有連結需要加上 border-bottom，
                           因此直接套用前面準備好的樣式產生元素即可 */
                        for (let j = 0 ; j < this.menuItems.length ; j ++) {
                            const item = this.menuItems[j];
                            if (j % menuItemsPerRow == 0) {
                                featuredLinks.push(
                                    createMenuItemElement(item, j , styleOfFirstChild)
                                );
                            } else {
                                featuredLinks.push(
                                    createMenuItemElement(item, j, styleOfChildrenWhichIsNotFirstChild)
                                )
                            }
                        }
                    }
                } else {//!shouldSocialMediaGrpSpanTheWholeRow
                   const remainder = gridItems % menuItemsPerRow;
                   if (remainder > 1) {
                       /* 最後一列的一般連結和社群網站連結塞不滿最後一列，
                          那倒數第二列部分連結既有 padding-bottom，也有 border-bottom。
                          此外，最後一列連結通通沒有 padding-bottom，當然也沒有 border-bottom。
                        */
                       let styleOfChildrenWhichIsNotFirstChildInSecondLastRow = 
                            Object.assign({}, styleOfChildrenWhichIsNotFirstChild);
                           styleOfChildrenWhichIsNotFirstChildInSecondLastRow['borderBottom'] = `${borderWidthOfLink}px solid #979797`;
                       let styleOfFirstChildAtLastRow = Object.assign({}, commonStyleOfLinkOnMenu);
                           styleOfFirstChildAtLastRow['paddingTop'] = `${paddingOfMenuItems}px`;
                       let styleOfChildrenWhichIsNotFirstChildInTheLastRow = Object.assign({}, commonStyleOfLinkOnMenu);
                           styleOfChildrenWhichIsNotFirstChildInTheLastRow['padding'] = 
                                `${paddingOfMenuItems}px 0 0 ${paddingOfMenuItems}px`;
                           styleOfChildrenWhichIsNotFirstChildInTheLastRow['borderLeft'] = `${borderWidthOfLink}px solid #979797`;
                       
                       const demarcation = (startIndex + 1) % menuItemsPerRow;
                       for (let i = startIndex ; i < gridItems ; i ++) {
                            const item = this.menuItems[i];
                            const remainder = i % menuItemsPerRow;
                            if (remainder >= demarcation) {
                              featuredLinks.push(
                                  createMenuItemElement(item, i, styleOfChildrenWhichIsNotFirstChildInSecondLastRow)
                              );
                            } else if (remainder == 0) {
                              featuredLinks.push(
                                  createMenuItemElement(item, i, styleOfFirstChild)
                              );
                            } else {
                              featuredLinks.push(
                                  createMenuItemElement(item, i, styleOfChildrenWhichIsNotFirstChildInTheLastRow)
                              );
                            }
                       }
                   } else if (remainder == 1) {
                        /* 一般連結塞滿最後一列，使社群網站連結獨立到新的一列去，
                           最後一列連結除了第一個以外，其他都會有 padding-bottom 和 border-bottom。
                           至於一般連結的倒數第二列會在前面的步驟就視同一般連結來處理掉。
                        */
                        const styleOfChildrenWhichIsNotFirstChildInTheLastRow = 
                                Object.assign({}, styleOfChildrenWhichIsNotFirstChild);
                        styleOfChildrenWhichIsNotFirstChildInTheLastRow['borderBottom'] = 
                                `${borderWidthOfLink}px solid #979797`;
                        for (let j = startIndex ; j < this.menuItems.length ; j ++ ) {
                            const item = this.menuItems[j];
                            featuredLinks.push(
                                createMenuItemElement(item, j, styleOfChildrenWhichIsNotFirstChildInTheLastRow)
                            )
                        }
                   } else {//remainderOfTheLastRow = 0
                        /* 一般連結和社群網站連結剛好塞滿最後一列，
                           一般連結通通就沒有 padding-bottom，也沒有 border-bottom。
                           至於一般連結的倒數第二列會在前面的步驟就視同一般連結來處理掉。
                        */
                       const styleOfFirstChildInTheLastRow = Object.assign({}, commonStyleOfLinkOnMenu);
                       styleOfFirstChildInTheLastRow['paddingTop'] = `${paddingOfMenuItems}px`;
                       const styleOfChildrenWhichIsNotFirstChildInTheLastRow = Object.assign({}, commonStyleOfLinkOnMenu);
                       styleOfChildrenWhichIsNotFirstChildInTheLastRow['paddingTop'] = `${paddingOfMenuItems}px`;
                       styleOfChildrenWhichIsNotFirstChildInTheLastRow['borderLeft'] = `${borderWidthOfLink}px solid #979797`;
                       
                       for (let k = startIndex ; k < this.menuItems.length ; k++ ) {
                            const item = this.menuItems[k];
                            const remainder = k % menuItemsPerRow;
                            if (remainder == 0) {
                                featuredLinks.push(
                                    createMenuItemElement(item, k, styleOfFirstChildInTheLastRow)
                                )
                            } else {
                                featuredLinks.push(
                                    createMenuItemElement(item, k, styleOfChildrenWhichIsNotFirstChildInTheLastRow)
                                )
                            }
                       }
                   }
                }
            }
        }

        const tocItemClicked = (e) => {
            if (e.target.nodeName.toUpperCase() === 'A') {
                this.toggleMenuState();
                console.log('state toggled');//todo
            }
        }

        return (
            <React.Fragment>
            { (!isStickyPositionSupported() && this.state.shouldTitleBeSticky) ?
                <div id="header-plhdr" style={plhdrStyle}></div>
            : null }
            <div id="header-ctx" style={headerCtxStyle} className={classesOfHeaderCtx}>
                <header id="header-bar" style={headerStyle}>
                   <SiteName name={terms.siteName} base64EncodedTitle={base64EncodedTitle}
                       fontSize={fontSizeOfSiteName} top={siteNameTopPosition} left={siteNameLeftPosition} />
                   <span className="menuBtn" style={menuBtnStyle} onClick={this.toggleMenuState}>
                           <div className={"upper bar " + (this.state.isMenuOpened ? "rotate":"")} style={upperBarStyle} ></div>
                           <div className={"lower bar " + (this.state.isMenuOpened ? "rotate":"")}  style={lowerBarStyle} ></div>
                   </span>
                </header>
                { this.state.isMenuOpened ?
                    <React.Fragment>
                        <div id="shadow" style={styleOfShadow} onClick={this.toggleMenuState} ></div>
                        <div className="menu" style={styleOfMenu}>
                            <nav className="content" style={styleOfMenuContent}>
                                <div id="toc" onClick={tocItemClicked}>{this.props.children}</div>
                                <MobileDeviceSearchBar height={searchBarHeight} width={searchBarWidth}
                                     fontSizeOfSearchHint={fontSizeOfSearchHint}
                                     searchIconWidth={searchIconWidth} searchIconHeight={searchIconHeight} />
                                {featuredLinks}
                                <div id="socialMediaGrp" className="link"  style={styleOfSocialMediaGrp}>
                                    <a href={socialMediaTerms.facebookPersonalPage} target="_blank" title={socialMediaTerms.facebookIconTitle}>
                                        <icons.FaceBookIcon style={styleOfSocialMediaBtn} /></a>
                                    <a href={socialMediaTerms.githubPersonalPage} target="_blank" title={socialMediaTerms.githubIconTitle}>
                                        <icons.GithubIcon style={styleOfSocialMediaBtn} /></a>
                                    <a href={socialMediaTerms.stackoverflowPersonalPage} target="_blank" title={socialMediaTerms.stackOverflowIconTitle}>
                                        <icons.StackOverflowIcon style={styleOfSocialMediaBtn} /></a>
                                    <a href={socialMediaTerms.youtubePlayList} target="_blank" title={socialMediaTerms.youtubeIconTitle}>
                                        <icons.YoutubeIcon style={styleOfSocialMediaBtn} /></a>
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
                <g transform="translate(-358.000000, -74.000000)" fillRule="nonzero">
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