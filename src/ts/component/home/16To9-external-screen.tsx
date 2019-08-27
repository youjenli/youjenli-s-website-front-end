import * as React from 'react';
import * as terms from './slogan/terms';
import {MetaDataOfPost} from '../../model/posts';
import SloganOnExternalScreen from './slogan/external-screen-slogan';
import ListOfRecentPostsOnExternalScreen from './listOfPosts/external-screen';
import {DisposableWidget} from './error-and-warning/disposable-widget';

interface PropsOfHomeOf16To9ExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    posts:MetaDataOfPost[];
    errorMsg:string[];
    onWidgetOfErrorMsgDismissed?:() => void;
}

export default class HomeOf16To9ExternalScreen extends React.Component<PropsOfHomeOf16To9ExternalScreen> {
    render() {
        const marginLeftRightOfBgOfPostsInPercent = 3;
        const portraitWidth = 0.38 * this.props.viewportWidth;
        const portraitHeight = portraitWidth * 9 / 16;
        const distanceBetweenTheTopsOfL1bgAndPortrait = portraitHeight * 0.2;
        const distanceBetweenTheBottomsOfL1bgAndPortrait = 0.0949 * portraitHeight;
        const leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.0546;
        const topShiftOfMyPic_basedOnUpperBG = (11 * this.props.viewportWidth + 5376)/416;
        const paddingLeftOfPicAndGtPanelCtnr = leftShiftOfL1bg_basedOnPortrait * 2;
        const l2bgHeight = topShiftOfMyPic_basedOnUpperBG + 0.5 * portraitHeight; 
        const l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.86 * portraitWidth;
        const l1bgHeight =  (portraitHeight - distanceBetweenTheTopsOfL1bgAndPortrait) + distanceBetweenTheBottomsOfL1bgAndPortrait;
        const fontSizeOfGreetings = portraitHeight / 6.5;
        const widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
        const marginLeftOfGtPanel = 1.4 * fontSizeOfGreetings;
        const marginTopOfGtPanel = ( portraitHeight * 0.5 - 2/* 也就是 greeting 的行數 */ * fontSizeOfGreetings ) / 2;
        const socialMediaLinkWidth = (-0.1 * this.props.viewportWidth + 476.8) / 416 * fontSizeOfGreetings;
        const marginRightOfSocialMediaLink = (5 * this.props.viewportWidth + 1120) / 416;
        const fontSizeOfWelcomeMsg = (0.165 * this.props.viewportWidth + 276.16) * widthOfGreetings / (416 * terms.welcomeMsg.length);
        const marginLeftOfDescPanel = paddingLeftOfPicAndGtPanelCtnr + portraitWidth;
        const paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
        const marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
        const fontSizeOfDesc = (this.props.viewportWidth + 432) / 104;
        const paddingBottomOfDescPanel = fontSizeOfDesc;
        const marginRightOfToolIcon = (10 * this.props.viewportWidth - 1920) / 416;
        const heightOfTallToolIcon = (-0.479 * this.props.viewportWidth + 1203.52) * distanceBetweenTheBottomsOfL1bgAndPortrait / 416;
        const heightOfShortToolIcon = 30;
        const leftShiftOfIconChain_basedOnDescPanel = marginLeftOfGtPanel;
        const bottomShiftOfIconChain_basedOnDescPanel = -1 * heightOfTallToolIcon 
                * ((0.25 * this.props.viewportWidth - 152) / 416 + 1);
        const distanceFromTopOfBgOfPosts = portraitHeight * 0.5 + distanceBetweenTheBottomsOfL1bgAndPortrait
                *((0.434 * this.props.viewportWidth + 9.024) / 416 + 1);
        
        let disposableWidget = null;
        if (this.props.errorMsg.length > 0) {
            const styleOfWidget = {
                fontSize:`${(4.5 * this.props.viewportWidth + 2048) / 416}px`,
                padding:`1px ${this.props.viewportWidth * marginLeftRightOfBgOfPostsInPercent / 100}px`
            }
            disposableWidget = 
                <DisposableWidget style={styleOfWidget} msg={this.props.errorMsg} shouldFlashAfterMount={true}
                    onDismissed={this.props.onWidgetOfErrorMsgDismissed} />;
        }

        const l2bg = {
            height:l2bgHeight,
            picAndGtCtnr:{
                topShift:topShiftOfMyPic_basedOnUpperBG,
                paddingLeft:paddingLeftOfPicAndGtPanelCtnr
            },
            portrait:{
                imgUrl:"img/portrait-16-9th.png",
                width:portraitWidth,
                height:portraitHeight,
                l1bg:{
                    width:l1bgWidth,
                    height:l1bgHeight,
                    topShift:distanceBetweenTheTopsOfL1bgAndPortrait,
                    leftShift:leftShiftOfL1bg_basedOnPortrait
                }
            },
            gtPanel:{
                marginTop:marginTopOfGtPanel,
                marginLeft:marginLeftOfGtPanel,
                greetings:{
                    fontSize:fontSizeOfGreetings
                },
                sm:{
                    width:socialMediaLinkWidth,
                    height:socialMediaLinkWidth,
                    marginRight:marginRightOfSocialMediaLink
                }
            }
        };
        const descPanel = {
            marginLeft:marginLeftOfDescPanel,
            padding:{
                top:paddingTopOfDescPanel,
                bottom:paddingBottomOfDescPanel,
            },
            welMsg:{
                fontSize:fontSizeOfWelcomeMsg,
                marginBottom:marginBottomOfWelcomeMsg
            },
            desc:{
                fontSize:fontSizeOfDesc
            },
            iconChain:{
                leftShift:leftShiftOfIconChain_basedOnDescPanel,
                bottomShift:bottomShiftOfIconChain_basedOnDescPanel,
                icon:{
                    marginRight:marginRightOfToolIcon,
                    tall:{
                        height:heightOfTallToolIcon,
                    },
                    short:{
                        height:heightOfShortToolIcon,
                    }
                }
            }      
        }
        const bgOfPost = {
            margin:{
                leftRightInPercent:marginLeftRightOfBgOfPostsInPercent,
                bottom:distanceBetweenTheBottomsOfL1bgAndPortrait
            },
            paddingBottom:distanceBetweenTheBottomsOfL1bgAndPortrait,
            postCtnr:{
                distanceFromTopOfBgOfPosts:distanceFromTopOfBgOfPosts
            }
        };
        //這是為了讓發文元件能計算填充物而提供的
        const estimatedWidthOfContainer = this.props.viewportWidth - 2 * marginLeftRightOfBgOfPostsInPercent;

        return (
            <React.Fragment>
                {disposableWidget}
                <SloganOnExternalScreen viewportWidth={this.props.viewportWidth} l2bg={l2bg} descPanel={descPanel}
                    bgOfPost={bgOfPost} baseZIndex={this.props.baseZIndex + 1}>
                    <ListOfRecentPostsOnExternalScreen estimatedWidthOfContainer={estimatedWidthOfContainer}
                        baseZIndex={this.props.baseZIndex + 10} remFontSize={18} posts={this.props.posts}
                        marginTopOfPost={distanceBetweenTheBottomsOfL1bgAndPortrait} />
                </SloganOnExternalScreen>
            </React.Fragment>            
        );
    }
}