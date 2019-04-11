import * as React from 'react';
import * as terms from './slogan/terms';
import {Post} from '../model/post';
import SloganOfExternalScreen from './slogan/external-screen-slogan';
import {widthOfExternalScreenRecentPost, marginLeftRightOfPost, LargeExternalScreenRecentPosts} 
    from './recentPosts/large-external-screen-recent-post';

interface PropsOfHomeOnLargeExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    posts:Post[];
}

export default class HomeOnLargeExternalScreen extends React.Component<PropsOfHomeOnLargeExternalScreen> {
    render() {       
        const widthOfBgOfPosts = this.props.viewportWidth * 0.96;
        console.log(widthOfBgOfPosts);//todo
        const portraitWidth = 0.4 * this.props.viewportWidth;
        console.log(portraitWidth);
        const portraitHeight = portraitWidth * 10 / 16;
        const topShiftOfL1bg_basedOnPortrait = portraitHeight * 0.19;
        const leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.065;
        console.log(leftShiftOfL1bg_basedOnPortrait);//todo
        const topShiftOfMyPic_basedOnUpperBG = (2.1 * this.props.viewportWidth - 472)/40;
        const leftShiftOfMyPic_basedOnUpperBG = ( this.props.viewportWidth - widthOfBgOfPosts) / 2 
            + 2 * leftShiftOfL1bg_basedOnPortrait;
        const l2bgHeight = topShiftOfMyPic_basedOnUpperBG + 0.5 * portraitHeight; 
        const l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.88 * portraitWidth;
        const distanceBetweenTheBottomOfL1bgAndPortrait = 0.102 * portraitHeight;
        const l1bgHeight =  (portraitHeight - topShiftOfL1bg_basedOnPortrait) + distanceBetweenTheBottomOfL1bgAndPortrait;
        const fontSizeOfGreetings = portraitHeight / 6.5;
        const topShiftOfGreetings_basedOnUpperBG = topShiftOfMyPic_basedOnUpperBG + ( portraitHeight / 2 - 2 * fontSizeOfGreetings ) / 2;
        
        const spaceBetweenMyPicAndGreetings = ((-0.104 * fontSizeOfGreetings + 27.4433) / 18.47) * fontSizeOfGreetings;
        const leftShiftOfGreetings_basedOnUpperBG = leftShiftOfMyPic_basedOnUpperBG + portraitWidth 
            + spaceBetweenMyPicAndGreetings;
        const widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
        const socialMediaLinkWidth = fontSizeOfGreetings * 3/4;
        const marginRightOfSocialMediaLink = 0.5 * socialMediaLinkWidth;
        const widthOfGtPanel = widthOfBgOfPosts - 3 * leftShiftOfL1bg_basedOnPortrait 
            - portraitWidth - spaceBetweenMyPicAndGreetings;
        const descPanelWidth = widthOfBgOfPosts - 3 * leftShiftOfL1bg_basedOnPortrait - portraitWidth;
        console.log(`descPanelWidth : ${descPanelWidth}px`);//todo
        const leftShiftOfDescPanel_basedOnUpperBG = leftShiftOfMyPic_basedOnUpperBG + portraitWidth;
        const paddingLeftOfDescPanel = spaceBetweenMyPicAndGreetings;
        const paddingRightOfDescPanel = paddingLeftOfDescPanel;
        const fontSizeOfWelcomeMsg = widthOfGreetings * 1.1 / terms.welcomeMsg.length;
        const paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
        const marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
        const fontSizeOfDesc = this.props.viewportWidth / 80;
        const paddingBottomOfDescPanel = fontSizeOfDesc;
        const marginRightOfToolIcon = (this.props.viewportWidth + 1440) / 96;
        const heightOfTallToolIcon = 7 * this.props.viewportWidth / 240;
        const heightOfShortToolIcon = (this.props.viewportWidth - 240) /40;
        const leftShiftOfIconChain_basedOnDescPanel = spaceBetweenMyPicAndGreetings;
        const bottomShiftOfIconChain_basedOnDescPanel = -1 * heightOfTallToolIcon * 1.5;
        const paddingTopOfBgOfPosts = portraitHeight * 0.5 + 2 * distanceBetweenTheBottomOfL1bgAndPortrait;

        const l2bg = {
            height:l2bgHeight,
            portrait:{
                width:portraitWidth,
                height:portraitHeight,
                topShift:topShiftOfMyPic_basedOnUpperBG,
                leftShift:leftShiftOfMyPic_basedOnUpperBG,
                l1bg:{
                    width:l1bgWidth,
                    height:l1bgHeight,
                    topShift:topShiftOfL1bg_basedOnPortrait,
                    leftShift:leftShiftOfL1bg_basedOnPortrait
                }
            },
            gtPanel:{
                width:widthOfGtPanel,
                topShift:topShiftOfGreetings_basedOnUpperBG,
                leftShift:leftShiftOfGreetings_basedOnUpperBG,
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
            width:descPanelWidth,
            leftShift:leftShiftOfDescPanel_basedOnUpperBG,
            topShift:l2bgHeight,
            padding:{
                top:paddingTopOfDescPanel,
                right:paddingRightOfDescPanel,
                bottom:paddingBottomOfDescPanel,
                left:paddingLeftOfDescPanel
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
            width:widthOfBgOfPosts,
            paddingTop:paddingTopOfBgOfPosts
        };

        let numberOfPostsInARow = Math.floor(
            (widthOfBgOfPosts - 2 * marginLeftRightOfPost) / (widthOfExternalScreenRecentPost + 2 * marginLeftRightOfPost)
        );

        return (
            <SloganOfExternalScreen viewportWidth={this.props.viewportWidth} l2bg={l2bg} descPanel={descPanel}
                bgOfPost={bgOfPost} baseZIndex={this.props.baseZIndex + 1}>
                <LargeExternalScreenRecentPosts baseZIndex={this.props.baseZIndex + 10} remFontSize={18} 
                    numberOfPostsInARow={numberOfPostsInARow} posts={this.props.posts}/>
            </SloganOfExternalScreen>
        );
    }
}