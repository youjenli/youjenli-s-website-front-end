import * as React from 'react';
import * as terms from './terms';
import * as icon from '../socialMedia/icons';

interface ExternalScreenSloganProps {
    viewportWidth:number;
}

export default class ExternalScreenSlogan extends React.Component<ExternalScreenSloganProps> {
    render() {
        const remFontSize = 18;
        let portraitWidth, portraitHeight, topShiftOfMyPic_basedOnUpperBG, leftShiftOfMyPic_basedOnUpperBG;
        let l2bgHeight;
        let l1bgWidth, l1bgHeight, leftShiftOfL1bg_basedOnPortrait, topShiftOfL1bg_basedOnPortrait;
        let fontSizeOfGreetings, leftShiftOfGreetings_basedOnUpperBG, topShiftOfGreetings_basedOnUpperBG;
        let socialMediaLinkWidth, spaceBetweenSocialMediaLinks; //social media links 可以跟上面歡迎句包在同一格
        let widthOfGtPanel;
        let descPanelWidth, leftShiftOfDescPanel_basedOnUpperBG;
        let paddingTopOfDescPanel, paddingRightOfDescPanel, paddingBottomOfDescPanel, paddingLeftOfDescPanel;
        let fontSizeOfWelcomeMsg, marginBottomOfWelcomeMsg;
        let fontSizeOfDesc;
        let widthOfBgOfPosts, heightOfBgOfPosts, paddingTopOfBgOfPosts, 
            paddingLeftAndRightOfBackgroundOfPosts;
        let rowsOfArticle;
        let articlesInARow, spaceBetweenDifferentRow, heightOfRecentPost, widthOfRecentPost;

        if (this.props.viewportWidth > 1440) {
            widthOfBgOfPosts = this.props.viewportWidth * 0.96;
            portraitWidth = 0.4 * this.props.viewportWidth;
            portraitHeight = portraitWidth * 10 / 16;
            topShiftOfL1bg_basedOnPortrait = portraitHeight * 0.19;
            leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.065;
            topShiftOfMyPic_basedOnUpperBG = (2.1 * this.props.viewportWidth - 472)/40;
            leftShiftOfMyPic_basedOnUpperBG = ( this.props.viewportWidth - widthOfBgOfPosts) / 2 + 2 * leftShiftOfL1bg_basedOnPortrait;
            l2bgHeight = topShiftOfMyPic_basedOnUpperBG + 0.5 * portraitHeight; 
            l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.88 * portraitWidth;
            l1bgHeight =  (portraitHeight - topShiftOfL1bg_basedOnPortrait) + 0.102 * portraitHeight;

            fontSizeOfGreetings = portraitHeight / 6.5;
            topShiftOfGreetings_basedOnUpperBG = topShiftOfMyPic_basedOnUpperBG + ( portraitHeight / 2 - 2 * fontSizeOfGreetings ) / 2;
            const spaceBetweenMyPicAndGreetings = ((-0.104 * fontSizeOfGreetings + 27.4433) / 18.47) * fontSizeOfGreetings;
            leftShiftOfGreetings_basedOnUpperBG = leftShiftOfMyPic_basedOnUpperBG + portraitWidth 
                + spaceBetweenMyPicAndGreetings;
            socialMediaLinkWidth = fontSizeOfGreetings * 3/4;
            spaceBetweenSocialMediaLinks = 0.5 * socialMediaLinkWidth;
            widthOfGtPanel = widthOfBgOfPosts - 3 * leftShiftOfL1bg_basedOnPortrait 
                - portraitWidth - leftShiftOfGreetings_basedOnUpperBG;
            descPanelWidth = widthOfBgOfPosts - 3 * leftShiftOfL1bg_basedOnPortrait - portraitWidth;
            leftShiftOfDescPanel_basedOnUpperBG = leftShiftOfMyPic_basedOnUpperBG + portraitWidth;
            paddingLeftOfDescPanel = spaceBetweenMyPicAndGreetings;
            paddingRightOfDescPanel = paddingLeftOfDescPanel;
            fontSizeOfWelcomeMsg = (descPanelWidth - 2 * spaceBetweenMyPicAndGreetings) / 11;
            paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
            marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
            fontSizeOfDesc = this.props.viewportWidth / 80;
            paddingBottomOfDescPanel = fontSizeOfDesc;

            let heightOfTallToolIcon = 7 * this.props.viewportWidth / 240;
            let heightOfShortToolIcon = (this.props.viewportWidth - 240) /40;
            let leftShiftOfIconChain = spaceBetweenMyPicAndGreetings;
            let topShiftOfIconChain_baseOnDescPanel = 0.5 * heightOfTallToolIcon;
            let spaceBetweenToolIcon = (this.props.viewportWidth + 1440) / 96;

            paddingTopOfBgOfPosts = portraitHeight * 0.5 + 2 * topShiftOfL1bg_basedOnPortrait;
            heightOfRecentPost = 318;
            widthOfRecentPost = 414;
            rowsOfArticle = 1;//todo
            heightOfBgOfPosts = paddingTopOfBgOfPosts + 318 * (rowsOfArticle - 1) +  + 9 + 396;
            spaceBetweenDifferentRow = topShiftOfL1bg_basedOnPortrait;
            let spaceBetweenArticlesInARow = remFontSize;
            articlesInARow = Math.floor(
                (widthOfBgOfPosts - spaceBetweenArticlesInARow) / (widthOfRecentPost + spaceBetweenArticlesInARow)
            );
            paddingLeftAndRightOfBackgroundOfPosts =
            (widthOfBgOfPosts - articlesInARow * widthOfRecentPost - (articlesInARow + 1) * spaceBetweenArticlesInARow) / 2;
        } else {
            return (
                <React.Fragment>Todo</React.Fragment>
            );
        }

        const styleOfL2bg = {
            height:`${l2bgHeight}px`
        };
        const styleOfMyPic = {
            top:`${topShiftOfMyPic_basedOnUpperBG}px`,
            left:`${leftShiftOfMyPic_basedOnUpperBG}px`
        };
        const portraitStyle = {
            width:`${portraitWidth}px`,
            height:`${portraitHeight}px`
        };
        const styleOfL1bg = {
            width:`${l1bgWidth}px`,
            height:`${l1bgHeight}px`,
            left:`${-1 * leftShiftOfL1bg_basedOnPortrait}px`,
            top:`${topShiftOfL1bg_basedOnPortrait}px`
        }
        const styleOfGtPanel = {
            width:`${widthOfGtPanel}px`,//todo 數值不太對勁
            top:`${topShiftOfGreetings_basedOnUpperBG}px`,
            left:`${leftShiftOfGreetings_basedOnUpperBG}px`
        }
        const styleOfGreetings = {
            fontSize:`${fontSizeOfGreetings}px`,
            width:`${terms.myName.length * fontSizeOfGreetings}px`
        }
        const styleOfSMGrp = {
            width:`${socialMediaLinkWidth * 4 + spaceBetweenSocialMediaLinks * 3}px`
        }
        const styleOfSMIcon = {
            width:`${socialMediaLinkWidth}px`
        }
        const styleOfDescPanel = {
            width:`${descPanelWidth}px`,//todo 數值不太對勁
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
            padding:`${paddingTopOfBgOfPosts}px ${paddingLeftAndRightOfBackgroundOfPosts}px 0 ${paddingLeftAndRightOfBackgroundOfPosts}px`
        };
        
        return (
            <main id="home">
                <section className="l2bg" style={styleOfL2bg}>
                    <div className="myPic" style={styleOfMyPic}>
                        <div className="l1bg" style={styleOfL1bg}></div>
                        <img className="portrait" style={portraitStyle} src="img/portrait-es-large-16-10th.png" />
                    </div>
                    <div className="gtPanel" style={styleOfGtPanel}>
                        <h1 className="greetings" style={styleOfGreetings}>
                            {terms.greetingMsg}<br />{terms.myName}</h1>
                        <div className="socialMediaGrp" style={styleOfSMGrp}>
                            <icon.FaceBookIcon style={styleOfSMIcon} />
                            <icon.GithubIcon style={styleOfSMIcon} />
                            <icon.StackOverflowIcon style={styleOfSMIcon} />
                            <icon.YoutubeIcon style={styleOfSMIcon} />
                        </div>                    
                    </div>
                    <div className="descPanel" style={styleOfDescPanel}>
                        <h2 className="welcome" style={styleOfWelMsg}>{terms.welcomeMsg}</h2>
                        <p className="desc" style={styleOfDesc}>{terms.desc}</p>
                        <div className="toolChain"></div>
                    </div>
                </section>
                <section className="bgOfPosts" style={styleOfPostsOfBg}>
                    {this.props.children}
                </section>
            </main>
        );
    }
}