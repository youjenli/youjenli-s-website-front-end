import * as React from 'react';
import * as terms from './slogan/terms';
import {MetaDataOfPost} from '../../model/posts';
import SloganOnExternalScreen from './slogan/external-screen-slogan';
import ListOfRecentPostsOnLargeExternalScreen from './listOfPosts/large-external-screen';
import {DisposableWidget} from './error-and-warning/disposable-widget';

interface PropsOfHomeOf16To10LargeExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    posts:MetaDataOfPost[];
    errorMsg:string[];
    onWidgetOfErrorMsgDismissed?:() => void;
}

export default class HomeOf16To10LargeExternalScreen extends React.Component<PropsOfHomeOf16To10LargeExternalScreen> {
    render() {
        const marginLeftRightOfBgOfPostsInPercent = 2.5;
        const portraitWidth = 0.4 * this.props.viewportWidth;
        const portraitHeight = portraitWidth * 10 / 16;
        const distanceBetweenTheTopsOfL1bgAndPortrait = portraitHeight * 0.19;
        const distanceBetweenTheBottomsOfL1bgAndPortrait = 0.102 * portraitHeight;
        const leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.066;
        const topShiftOfMyPic_basedOnUpperBG = (2.1 * this.props.viewportWidth - 472)/40;
        const paddingLeftOfPicAndGtPanelCtnr = leftShiftOfL1bg_basedOnPortrait * 2;
        const l2bgHeight = topShiftOfMyPic_basedOnUpperBG + 0.5 * portraitHeight; 
        const l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.88 * portraitWidth;        
        const l1bgHeight =  (portraitHeight - distanceBetweenTheTopsOfL1bgAndPortrait) + distanceBetweenTheBottomsOfL1bgAndPortrait;
        const fontSizeOfGreetings = portraitHeight / 6.5;
        const widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
        const marginLeftOfGtPanel = ((-0.104 * fontSizeOfGreetings + 27.4433) / 18.47) * fontSizeOfGreetings;
        const marginTopOfGtPanel = ( portraitHeight * 0.5 - 2/* 也就是 greeting 的行數 */ * fontSizeOfGreetings ) / 2;
        const socialMediaLinkWidth = fontSizeOfGreetings * 3/4;
        const marginRightOfSocialMediaLink = 0.5 * socialMediaLinkWidth;        
        const fontSizeOfWelcomeMsg = widthOfGreetings * 1.1 / terms.welcomeMsg.length;
        const marginLeftOfDescPanel = paddingLeftOfPicAndGtPanelCtnr + portraitWidth;
        const paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
        const marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
        const fontSizeOfDesc = this.props.viewportWidth / 80;
        const paddingBottomOfDescPanel = fontSizeOfDesc;
        const marginRightOfToolIcon = (this.props.viewportWidth + 1440) / 96;
        const heightOfTallToolIcon = 1.165 * distanceBetweenTheBottomsOfL1bgAndPortrait;
        const heightOfShortToolIcon = (0.064 * this.props.viewportWidth + 297.12) / 480 * distanceBetweenTheBottomsOfL1bgAndPortrait;
        const leftShiftOfIconChain_basedOnDescPanel = marginLeftOfGtPanel;
        const bottomShiftOfIconChain_basedOnDescPanel = -1 * heightOfTallToolIcon * 1.5;
        const distanceFromTopOfBgOfPosts = portraitHeight * 0.5 + distanceBetweenTheBottomsOfL1bgAndPortrait * 2;
        
        let disposableWidget = null;
        if (this.props.errorMsg.length > 0) {
            const styleOfWidget = {
                fontSize:`${(5.5 * this.props.viewportWidth + 1920) / 480}px`,
                padding:`1px ${this.props.viewportWidth * marginLeftRightOfBgOfPostsInPercent / 100}px`
            }
            disposableWidget = 
                <DisposableWidget style={styleOfWidget} msg={this.props.errorMsg} shouldFlashAfterMount={true}
                    onDismissed={this.props.onWidgetOfErrorMsgDismissed}/>;
        }

        const l2bg = {
            height:l2bgHeight,
            picAndGtCtnr:{
                topShift:topShiftOfMyPic_basedOnUpperBG,
                paddingLeft:paddingLeftOfPicAndGtPanelCtnr
            },
            portrait:{
                imgUrl:'img/portrait-16-10th.png',
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
                    <ListOfRecentPostsOnLargeExternalScreen estimatedWidthOfContainer={estimatedWidthOfContainer}
                        baseZIndex={this.props.baseZIndex + 10} remFontSize={18} posts={this.props.posts}
                        marginTopOfPost={distanceBetweenTheBottomsOfL1bgAndPortrait} />
                </SloganOnExternalScreen>
            </React.Fragment>            
        );
    }
}