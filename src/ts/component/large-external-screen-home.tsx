import * as React from 'react';
import * as terms from './slogan/terms';
import {Post} from '../model/post';
import SloganOfExternalScreen from './slogan/external-screen-slogan';
import LargeExternalScreenRecentPosts from './recentPosts/large-external-screen-recent-post';

interface PropsOfHomeOnLargeExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    posts:Post[];
}

export default class HomeOnLargeExternalScreen extends React.Component<PropsOfHomeOnLargeExternalScreen> {
    render() {
        const marginLeftRightOfBgOfPostsInPercent = 2;
        const portraitWidth = 0.4 * this.props.viewportWidth;
        const portraitHeight = portraitWidth * 10 / 16;
        const topShiftOfL1bg_basedOnPortrait = portraitHeight * 0.19;
        const leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.065;
        const topShiftOfMyPic_basedOnUpperBG = (2.1 * this.props.viewportWidth - 472)/40;
        const l2bgHeight = topShiftOfMyPic_basedOnUpperBG + 0.5 * portraitHeight; 
        const l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.88 * portraitWidth;
        const distanceBetweenTheBottomOfL1bgAndPortrait = 0.102 * portraitHeight;
        const l1bgHeight =  (portraitHeight - topShiftOfL1bg_basedOnPortrait) + distanceBetweenTheBottomOfL1bgAndPortrait;
        const fontSizeOfGreetings = portraitHeight / 6.5;
        const widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
        const marginLeftOfGtPanel = ((-0.104 * fontSizeOfGreetings + 27.4433) / 18.47) * fontSizeOfGreetings;
        const marginTopOfGtPanel = ( portraitHeight * 0.5 - 2/* 也就是 greeting 的行數 */ * fontSizeOfGreetings ) / 2;
        const socialMediaLinkWidth = fontSizeOfGreetings * 3/4;
        const marginRightOfSocialMediaLink = 0.5 * socialMediaLinkWidth;        
        const fontSizeOfWelcomeMsg = widthOfGreetings * 1.1 / terms.welcomeMsg.length;
        const marginLeftOfDescPanel = leftShiftOfL1bg_basedOnPortrait * 2 + portraitWidth;
        const paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
        const marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
        const fontSizeOfDesc = this.props.viewportWidth / 80;
        const paddingBottomOfDescPanel = fontSizeOfDesc;
        const marginRightOfToolIcon = (this.props.viewportWidth + 1440) / 96;
        const heightOfTallToolIcon = 7 * this.props.viewportWidth / 240;
        const heightOfShortToolIcon = (this.props.viewportWidth - 240) /40;
        const leftShiftOfIconChain_basedOnDescPanel = marginLeftOfGtPanel;
        const bottomShiftOfIconChain_basedOnDescPanel = -1 * heightOfTallToolIcon * 1.5;
        const marginTopOfPlaceHldrOfBgOfPosts = portraitHeight * 0.5 + distanceBetweenTheBottomOfL1bgAndPortrait * 2;
        
        const l2bg = {
            height:l2bgHeight,
            picAndGtCtnr:{
                topShift:topShiftOfMyPic_basedOnUpperBG
            },
            portrait:{
                width:portraitWidth,
                height:portraitHeight,
                l1bg:{
                    width:l1bgWidth,
                    height:l1bgHeight,
                    topShift:topShiftOfL1bg_basedOnPortrait,
                    leftShift:leftShiftOfL1bg_basedOnPortrait
                }
            },
            gtPanel:{
                marginTop:marginTopOfGtPanel,
                marginLeft:marginLeftOfGtPanel,
                greetings:{
                    fontSize:fontSizeOfGreetings,
                    width:widthOfGreetings
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
            marginLeftRightInPercent:marginLeftRightOfBgOfPostsInPercent,
            postCtnr:{
                marginTop:marginTopOfPlaceHldrOfBgOfPosts
            }
        };
        //這是為了讓發文元件能計算填充物而提供的
        const estimatedWidthOfContainer = this.props.viewportWidth - 2 * marginLeftRightOfBgOfPostsInPercent;

        return (
            <SloganOfExternalScreen viewportWidth={this.props.viewportWidth} l2bg={l2bg} descPanel={descPanel}
                bgOfPost={bgOfPost} baseZIndex={this.props.baseZIndex + 1}>
                <LargeExternalScreenRecentPosts estimatedWidthOfContainer={estimatedWidthOfContainer}
                    baseZIndex={this.props.baseZIndex + 10} remFontSize={18} posts={this.props.posts}/>
            </SloganOfExternalScreen>
        );
    }
}