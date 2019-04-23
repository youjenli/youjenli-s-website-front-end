import * as React from 'react';
import * as terms from './slogan/terms';
import {MetaOfPost} from '../../model/post';
import SloganOnExternalScreen from './slogan/external-screen-slogan';
import ListOfRecentPostsOnLargeExternalScreen from './listOfPosts/large-external-screen';

interface PropsOfHomeOf16To9LargeExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    posts:MetaOfPost[];
}

export default class HomeOf16To9LargeExternalScreen extends React.Component<PropsOfHomeOf16To9LargeExternalScreen> {
    render() {
        const marginLeftRightOfBgOfPostsInPercent = 2.5;
        const portraitWidth = 0.4 * this.props.viewportWidth;
        const portraitHeight = portraitWidth * 9 / 16;
        const distanceBetweenTheTopsOfL1bgAndPortrait = portraitHeight * 0.19;
        const distanceBetweenTheBottomsOfL1bgAndPortrait = 0.095 * portraitHeight;
        const leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.055;
        const topShiftOfMyPic_basedOnUpperBG = (19 * this.props.viewportWidth - 480)/480;
        const paddingLeftOfPicAndGtPanelCtnr = leftShiftOfL1bg_basedOnPortrait * 2;
        const l2bgHeight = (73 * this.props.viewportWidth + 480)/480; 
        const l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.86 * portraitWidth;
        const l1bgHeight =  (portraitHeight - distanceBetweenTheTopsOfL1bgAndPortrait) + distanceBetweenTheBottomsOfL1bgAndPortrait;
        const fontSizeOfGreetings = portraitHeight / 7;
        const widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
        const marginLeftOfGtPanel = 1.5 * fontSizeOfGreetings;
        const marginTopOfGtPanel = ( portraitHeight * 0.5 - 2/* 也就是 greeting 的行數 */ * fontSizeOfGreetings ) / 2;
        const socialMediaLinkWidth = fontSizeOfGreetings * 7/8;
        const marginRightOfSocialMediaLink = 0.5 * socialMediaLinkWidth;
        const fontSizeOfWelcomeMsg = widthOfGreetings * 1.2 / terms.welcomeMsg.length;
        const marginLeftOfDescPanel = paddingLeftOfPicAndGtPanelCtnr + portraitWidth;
        const paddingTopOfDescPanel = 0.5 * fontSizeOfWelcomeMsg;
        const marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
        const fontSizeOfDesc = this.props.viewportWidth / 80;
        const paddingBottomOfDescPanel = fontSizeOfDesc;
        const marginRightOfToolIcon = (this.props.viewportWidth + 1440) / 96;
        const heightOfTallToolIcon = (-0.119 * this.props.viewportWidth + 837.12) / 480 * distanceBetweenTheBottomsOfL1bgAndPortrait;
        const heightOfShortToolIcon = 0.972 * distanceBetweenTheBottomsOfL1bgAndPortrait;
        const leftShiftOfIconChain_basedOnDescPanel = marginLeftOfGtPanel;
        const bottomShiftOfIconChain_basedOnDescPanel = -1 * heightOfTallToolIcon * 1.5;
        const distanceFromTopOfBgOfPosts = portraitHeight * 0.5 + distanceBetweenTheBottomsOfL1bgAndPortrait * 2;
        
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
            <SloganOnExternalScreen viewportWidth={this.props.viewportWidth} l2bg={l2bg} descPanel={descPanel}
                bgOfPost={bgOfPost} baseZIndex={this.props.baseZIndex + 1}>
                <ListOfRecentPostsOnLargeExternalScreen estimatedWidthOfContainer={estimatedWidthOfContainer}
                    baseZIndex={this.props.baseZIndex + 10} remFontSize={18} posts={this.props.posts}
                    marginTopOfPost={distanceBetweenTheBottomsOfL1bgAndPortrait} />
            </SloganOnExternalScreen>
        );
    }
}