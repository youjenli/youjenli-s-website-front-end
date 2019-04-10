import * as React from 'react';
import * as terms from './terms';
import * as socialMediaTerms from '../socialMedia/terms';
import * as icon from '../socialMedia/icons';
import * as logo from './logo';

interface ExternalScreenSloganProps {
    viewportWidth:number;
    baseZIndex:number;
}

export default class ExternalScreenSlogan extends React.Component<ExternalScreenSloganProps> {
    render() {
        const remFontSize = 18;
        let portraitWidth, portraitHeight, topShiftOfMyPic_basedOnUpperBG, leftShiftOfMyPic_basedOnUpperBG;
        let l2bgHeight;
        let l1bgWidth, l1bgHeight, leftShiftOfL1bg_basedOnPortrait, topShiftOfL1bg_basedOnPortrait;
        let fontSizeOfGreetings, leftShiftOfGreetings_basedOnUpperBG, topShiftOfGreetings_basedOnUpperBG, widthOfGreetings;
        let socialMediaLinkWidth, spaceBetweenSocialMediaLinks;
        let widthOfGtPanel;
        let descPanelWidth, leftShiftOfDescPanel_basedOnUpperBG;
        let paddingTopOfDescPanel, paddingRightOfDescPanel, paddingBottomOfDescPanel, paddingLeftOfDescPanel;
        let fontSizeOfWelcomeMsg, marginBottomOfWelcomeMsg;
        let fontSizeOfDesc;
        let styleOfTallToolIcon, styleOfShortToolIcon, styleOfIconChain;
        let widthOfBgOfPosts, heightOfBgOfPosts, paddingTopOfBgOfPosts, 
            paddingLeftAndRightOfBackgroundOfPosts, marginBottomOfBgOfPosts;
        let rowsOfArticle;
        let articlesInARow, spaceBetweenDifferentRow, heightOfRecentPost, widthOfRecentPost;

        if (this.props.viewportWidth > 1440) {
            widthOfBgOfPosts = this.props.viewportWidth * 0.96;
            portraitWidth = 0.4 * this.props.viewportWidth;
            portraitHeight = portraitWidth * 10 / 16;
            topShiftOfL1bg_basedOnPortrait = portraitHeight * 0.19;
            leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.065;
            topShiftOfMyPic_basedOnUpperBG = (2.1 * this.props.viewportWidth - 472)/40;
            leftShiftOfMyPic_basedOnUpperBG = ( this.props.viewportWidth - widthOfBgOfPosts) / 2 
                + 2 * leftShiftOfL1bg_basedOnPortrait;
            l2bgHeight = topShiftOfMyPic_basedOnUpperBG + 0.5 * portraitHeight; 
            l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.88 * portraitWidth;
            const distanceBetweenTheBottomOfL1bgAndPortrait = 0.102 * portraitHeight;
            l1bgHeight =  (portraitHeight - topShiftOfL1bg_basedOnPortrait) + distanceBetweenTheBottomOfL1bgAndPortrait;

            fontSizeOfGreetings = portraitHeight / 6.5;
            topShiftOfGreetings_basedOnUpperBG = topShiftOfMyPic_basedOnUpperBG + ( portraitHeight / 2 - 2 * fontSizeOfGreetings ) / 2;
            const spaceBetweenMyPicAndGreetings = ((-0.104 * fontSizeOfGreetings + 27.4433) / 18.47) * fontSizeOfGreetings;
            leftShiftOfGreetings_basedOnUpperBG = leftShiftOfMyPic_basedOnUpperBG + portraitWidth 
                + spaceBetweenMyPicAndGreetings;
            widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
            socialMediaLinkWidth = fontSizeOfGreetings * 3/4;
            spaceBetweenSocialMediaLinks = 0.5 * socialMediaLinkWidth;
            widthOfGtPanel = widthOfBgOfPosts - 3 * leftShiftOfL1bg_basedOnPortrait 
                - portraitWidth - spaceBetweenMyPicAndGreetings;
            descPanelWidth = widthOfBgOfPosts - 3 * leftShiftOfL1bg_basedOnPortrait - portraitWidth;
            leftShiftOfDescPanel_basedOnUpperBG = leftShiftOfMyPic_basedOnUpperBG + portraitWidth;
            paddingLeftOfDescPanel = spaceBetweenMyPicAndGreetings;
            paddingRightOfDescPanel = paddingLeftOfDescPanel;
            fontSizeOfWelcomeMsg = widthOfGreetings * 1.1 / terms.welcomeMsg.length; //todo (descPanelWidth - 2 * spaceBetweenMyPicAndGreetings) / 11;
            paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
            marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
            fontSizeOfDesc = this.props.viewportWidth / 80;
            paddingBottomOfDescPanel = fontSizeOfDesc;

            let heightOfTallToolIcon = 7 * this.props.viewportWidth / 240;
            styleOfTallToolIcon = {
                height:`${heightOfTallToolIcon}px`,
                marginRight:`${(this.props.viewportWidth + 1440) / 96}px`
            };
            styleOfShortToolIcon = {
                height:`${(this.props.viewportWidth - 240) /40}px`,
                marginRight:`${(this.props.viewportWidth + 1440) / 96}px`
            }
            styleOfIconChain = {
                left:`${spaceBetweenMyPicAndGreetings}px`,
                bottom:`${-1 * heightOfTallToolIcon * 1.5}px`
            }          

            paddingTopOfBgOfPosts = portraitHeight * 0.5 + 2 * distanceBetweenTheBottomOfL1bgAndPortrait;
            heightOfRecentPost = 318;
            widthOfRecentPost = 414;
            rowsOfArticle = 1;//todo
            heightOfBgOfPosts = paddingTopOfBgOfPosts + 318 * (rowsOfArticle - 1) + 9 + 238;
            spaceBetweenDifferentRow = topShiftOfL1bg_basedOnPortrait;
            let spaceBetweenArticlesInARow = remFontSize;
            articlesInARow = Math.floor(
                (widthOfBgOfPosts - spaceBetweenArticlesInARow) / (widthOfRecentPost + spaceBetweenArticlesInARow)
            );
            paddingLeftAndRightOfBackgroundOfPosts =
            (widthOfBgOfPosts - articlesInARow * widthOfRecentPost - (articlesInARow + 1) * spaceBetweenArticlesInARow) / 2;
            marginBottomOfBgOfPosts = (318 - 9 - 238) * 2;//todo 改成發文的變數
        } else {
            return (
                <React.Fragment>Todo</React.Fragment>
            );
        }

        const styleOfL2bg = {
            height:`${l2bgHeight}px`,
            zIndex:this.props.baseZIndex + 2
        };
        const styleOfMyPic = {
            width:`${portraitWidth}px`,
            height:`${portraitHeight}px`,
            top:`${topShiftOfMyPic_basedOnUpperBG}px`,
            left:`${leftShiftOfMyPic_basedOnUpperBG}px`
        };
        
        const portraitStyle = {
            width:`${portraitWidth}px`,
            height:`${portraitHeight}px`,
            zIndex:this.props.baseZIndex + 4
        };
        const styleOfL1bg = {
            width:`${l1bgWidth}px`,
            height:`${l1bgHeight}px`,
            left:`${-1 * leftShiftOfL1bg_basedOnPortrait}px`,
            top:`${topShiftOfL1bg_basedOnPortrait}px`,
            zIndex:this.props.baseZIndex + 3
        }
        const styleOfGtPanel = {
            width:`${widthOfGtPanel}px`,
            top:`${topShiftOfGreetings_basedOnUpperBG}px`,
            left:`${leftShiftOfGreetings_basedOnUpperBG}px`
        }
        const styleOfGreetings = {
            fontSize:`${fontSizeOfGreetings}px`,
            width:`${widthOfGreetings}px`
        }
        const styleOfSMGrp = {
            width:`${socialMediaLinkWidth * 4 + spaceBetweenSocialMediaLinks * 3}px`
        }
        const styleOfSMIcon = {
            width:`${socialMediaLinkWidth}px`,
            height:`${socialMediaLinkWidth}px`
        }
        const styleOfDescPanel = {
            width:`${descPanelWidth}px`,
            left:`${leftShiftOfDescPanel_basedOnUpperBG}px`,
            padding:`${paddingTopOfDescPanel}px ${paddingRightOfDescPanel}px ${paddingBottomOfDescPanel}px ${paddingLeftOfDescPanel}px`
        }
        const styleOfWelMsg = {
            fontSize:`${fontSizeOfWelcomeMsg}px`,
            marginBottom:`${marginBottomOfWelcomeMsg}px`
        }
        const styleOfDesc = {
            fontSize:`${fontSizeOfDesc}px`
        }

        const styleOfPostsOfBg = {
            width:`${widthOfBgOfPosts}px`,
            height:`${heightOfBgOfPosts}px`,
            padding:`${paddingTopOfBgOfPosts}px ${paddingLeftAndRightOfBackgroundOfPosts}px 0 ${paddingLeftAndRightOfBackgroundOfPosts}px`,
            zIndex:this.props.baseZIndex + 1,
            marginBottom:`${marginBottomOfBgOfPosts}px`
        };
        
        return (
            <main id="main" className="es">
                <section className="l2bg" style={styleOfL2bg}>
                    <div className="myPic" style={styleOfMyPic}>
                        <div className="l1bg" style={styleOfL1bg}></div>
                        <img className="portrait" style={portraitStyle} src="img/portrait-es-large-16-10th.png" />
                    </div>
                    <div className="gtPanel" style={styleOfGtPanel}>
                        <h1 className="greetings" style={styleOfGreetings}>
                            {terms.greetingMsg}<br />{terms.myName}</h1>
                        <div className="socialMediaGrp" style={styleOfSMGrp}>
                            <a href={socialMediaTerms.facebookPersonalPage} target="_blank" title={socialMediaTerms.facebookIconTitle}>
                                <icon.FaceBookIcon style={styleOfSMIcon} /></a>
                            <a href={socialMediaTerms.githubPersonalPage} target="_blank" title={socialMediaTerms.githubIconTitle}>
                                <icon.GithubIcon style={styleOfSMIcon} /></a>
                            <a href={socialMediaTerms.stackoverflowPersonalPage} target="_blank" title={socialMediaTerms.stackOverflowIconTitle}>
                                <icon.StackOverflowIcon style={styleOfSMIcon} /></a>
                            <a href={socialMediaTerms.youtubePlayList} target="_blank" title={socialMediaTerms.youtubeIconTitle}>
                                <icon.YoutubeIcon style={styleOfSMIcon} /></a>
                        </div>
                    </div>
                    <div className="descPanel" style={styleOfDescPanel}>
                        <h2 className="welcome" style={styleOfWelMsg}>{terms.welcomeMsg}</h2>
                        <p className="desc" style={styleOfDesc}>{terms.desc}</p>
                        <div className="logoChain" style={styleOfIconChain}>
                            <logo.HTMLLogo style={styleOfTallToolIcon} />
                            <logo.CSSLogo style={styleOfTallToolIcon} />
                            <logo.JavaScriptLogo style={styleOfShortToolIcon} />
                            <logo.TypeScriptLogo style={styleOfShortToolIcon} />
                            <logo.JavaLogo style={styleOfTallToolIcon} />
                            <logo.GradleLogo style={styleOfShortToolIcon} />
                            <logo.JQueryLogo style={styleOfShortToolIcon} />
                            <logo.ReactJSLogo style={styleOfShortToolIcon} />
                            <logo.SpringFoundationLogo style={styleOfTallToolIcon} />
                        </div>
                    </div>
                </section>
                <section className="bgOfPosts" style={styleOfPostsOfBg}>
                    {this.props.children}
                </section>
            </main>
        );
    }
}