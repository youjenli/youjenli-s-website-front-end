import * as React from 'react';
import * as terms from './slogan/terms';
import {Post} from '../../model/post';
import SloganOfExternalScreen from './slogan/external-screen-slogan';
import LargeExternalScreenRecentPosts from './recentPosts/large-external-screen-recent-post';

interface PropsOfHomeOfLarge16To9ExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    posts:Post[];
}

export default class HomeOfLarge16To9ExternalScreen extends React.Component<PropsOfHomeOfLarge16To9ExternalScreen> {
    render() {
        const marginLeftRightOfBgOfPostsInPercent = 2.5;
        const portraitWidth = 0.4 * this.props.viewportWidth;
        const portraitHeight = portraitWidth * 9 / 16;
        const topShiftOfL1bg_basedOnPortrait = portraitHeight * 0.19;
        const leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.055;
        const topShiftOfMyPic_basedOnUpperBG = (19 * this.props.viewportWidth - 480)/480;
        const paddingLeftOfPicAndGtPanelCtnr = leftShiftOfL1bg_basedOnPortrait * 2;
        const l2bgHeight = (73 * this.props.viewportWidth + 480)/480; 
        const l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.86 * portraitWidth;
        const distanceBetweenTheBottomOfL1bgAndPortrait = 0.095 * portraitHeight;
        const l1bgHeight =  (portraitHeight - topShiftOfL1bg_basedOnPortrait) + distanceBetweenTheBottomOfL1bgAndPortrait;
        const fontSizeOfGreetings = portraitHeight / 7;
        const widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
        const marginLeftOfGtPanel = 1.5 * fontSizeOfGreetings;
        const marginTopOfGtPanel = ( portraitHeight * 0.5 - 2/* 也就是 greeting 的行數 */ * fontSizeOfGreetings ) / 2;
        const socialMediaLinkWidth = fontSizeOfGreetings * 7/8;
        const marginRightOfSocialMediaLink = 0.5 * socialMediaLinkWidth;
        const fontSizeOfWelcomeMsg = widthOfGreetings * 1.2 / terms.welcomeMsg.length;
        const marginLeftOfDescPanel = 2 * leftShiftOfL1bg_basedOnPortrait + portraitWidth;
        const paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
        const marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
        const fontSizeOfDesc = this.props.viewportWidth / 80;
        const paddingBottomOfDescPanel = fontSizeOfDesc;
        const marginRightOfToolIcon = (this.props.viewportWidth + 1440) / 96;
        const heightOfTallToolIcon = (-0.119 * this.props.viewportWidth + 837.12) / 480 * distanceBetweenTheBottomOfL1bgAndPortrait;
        const heightOfShortToolIcon = 0.972 * distanceBetweenTheBottomOfL1bgAndPortrait;
        const leftShiftOfIconChain_basedOnDescPanel = marginLeftOfGtPanel;
        const bottomShiftOfIconChain_basedOnDescPanel = -1 * heightOfTallToolIcon * 1.5;
        const distanceFromTopOfBgOfPosts = portraitHeight * 0.5 + distanceBetweenTheBottomOfL1bgAndPortrait * 2;
        
        const l2bg = {
            height:l2bgHeight,
            picAndGtCtnr:{
                topShift:topShiftOfMyPic_basedOnUpperBG,
                paddingLeft:paddingLeftOfPicAndGtPanelCtnr
            },
            portrait:{
                imgUrl:"img/portrait-es-large-16-9th.png",
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
            margin:{
                leftRightInPercent:marginLeftRightOfBgOfPostsInPercent,
                bottom:distanceBetweenTheBottomOfL1bgAndPortrait
            },
            paddingBottom:distanceBetweenTheBottomOfL1bgAndPortrait,
            postCtnr:{
                distanceFromTopOfBgOfPosts:distanceFromTopOfBgOfPosts
            }
        };
        //這是為了讓發文元件能計算填充物而提供的
        const estimatedWidthOfContainer = this.props.viewportWidth - 2 * marginLeftRightOfBgOfPostsInPercent;

        return (
            <SloganOfExternalScreen viewportWidth={this.props.viewportWidth} l2bg={l2bg} descPanel={descPanel}
                bgOfPost={bgOfPost} baseZIndex={this.props.baseZIndex + 1}>
                <LargeExternalScreenRecentPosts estimatedWidthOfContainer={estimatedWidthOfContainer}
                    baseZIndex={this.props.baseZIndex + 10} remFontSize={18} posts={this.props.posts}
                    marginTopOfPost={distanceBetweenTheBottomOfL1bgAndPortrait} />
            </SloganOfExternalScreen>
        );
    }
}