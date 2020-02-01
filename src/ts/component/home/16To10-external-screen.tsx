/// <reference path="../../model/global-vars.d.ts"/>
import * as React from 'react';
import * as terms from './slogan/terms';
import {MetaDataOfPost} from '../../model/posts';
import SloganOnExternalScreen from './slogan/external-screen-slogan';
import ListOfRecentPostsOnExternalScreen from './listOfPosts/external-screen';
import {DisposableWidget} from './error-and-warning/disposable-widget';

interface PropsOfHomeOf16To10ExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    posts:MetaDataOfPost[];
    errorMsg:string[];
    onWidgetOfErrorMsgDismissed?:() => void;
}

export default class HomeOf16To10ExternalScreen extends React.Component<PropsOfHomeOf16To10ExternalScreen> {
    render() {
        const marginLeftRightOfBgOfPostsInPercent = 3;
        const portraitWidth = 0.38 * this.props.viewportWidth;
        const portraitHeight = portraitWidth * 10 / 16;
        const distanceBetweenTheTopsOfL1bgAndPortrait = portraitHeight * 0.228;
        const distanceBetweenTheBottomsOfL1bgAndPortrait = 0.117 * portraitHeight;
        const leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.073;
        const topShiftOfMyPic_basedOnUpperBG = (3 * this.props.viewportWidth + 1712)/104;
        const paddingLeftOfPicAndGtPanelCtnr = leftShiftOfL1bg_basedOnPortrait * 2;
        const l2bgHeight = topShiftOfMyPic_basedOnUpperBG + 0.5 * portraitHeight; 
        const l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.8374 * portraitWidth;        
        const l1bgHeight =  (portraitHeight - distanceBetweenTheTopsOfL1bgAndPortrait) + distanceBetweenTheBottomsOfL1bgAndPortrait;
        const fontSizeOfGreetings = portraitHeight / 6.5;
        const widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
        const marginLeftOfGtPanel = ((-0.012 * fontSizeOfGreetings + 20.34456) / 15.2) * fontSizeOfGreetings;
        const marginTopOfGtPanel = ( portraitHeight * 0.5 - 2/* 也就是 greeting 的行數 */ * fontSizeOfGreetings ) / 2;
        const socialMediaLinkWidth = (-0.1 * this.props.viewportWidth + 476.8) / 416 * fontSizeOfGreetings;
        const marginRightOfSocialMediaLink = 10;
        const fontSizeOfWelcomeMsg = widthOfGreetings * 1.195 / terms.welcomeMsg.length;
        const marginLeftOfDescPanel = paddingLeftOfPicAndGtPanelCtnr + portraitWidth;
        const paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
        const marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
        const fontSizeOfDesc = (this.props.viewportWidth + 432) / 104;
        const paddingBottomOfDescPanel = fontSizeOfDesc;
        const marginRightOfToolIcon = (5 * this.props.viewportWidth - 960) / 208;
        const heightOfTallToolIcon = (-0.165 * this.props.viewportWidth + 684.8) / 416 * distanceBetweenTheBottomsOfL1bgAndPortrait;
        const heightOfShortToolIcon = (-0.25 * this.props.viewportWidth + 672) / 416 * distanceBetweenTheBottomsOfL1bgAndPortrait;
        const leftShiftOfIconChain_basedOnDescPanel = marginLeftOfGtPanel;
        const bottomShiftOfIconChain_basedOnDescPanel = -1 * heightOfTallToolIcon 
                * ((0.1 * this.props.viewportWidth + 105.6) / 416 + 1);
        const distanceFromTopOfBgOfPosts = portraitHeight * 0.5 + distanceBetweenTheBottomsOfL1bgAndPortrait * 2;
        
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
                imgUrl:window.wp.themeUrl + 'img/portrait-16-10th.png',
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