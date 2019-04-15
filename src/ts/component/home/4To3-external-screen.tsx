import * as React from 'react';
import * as terms from './slogan/terms';
import {Post} from '../../model/post';
import SloganOnExternalScreen from './slogan/external-screen-slogan';
import ListOfRecentPostsOnExternalScreen from './listOfPosts/external-screen';

interface PropsOfHomeOf4To3ExternalScreen {
    viewportWidth:number;
    baseZIndex:number;
    posts:Post[];
}

export default class HomeOf4To3ExternalScreen extends React.Component<PropsOfHomeOf4To3ExternalScreen> {
    render() {
        const marginLeftRightOfBgOfPostsInPercent = 3;
        const portraitWidth = 0.38 * this.props.viewportWidth;
        const portraitHeight = portraitWidth * 3 / 4;
        const distanceBetweenTheTopsOfL1bgAndPortrait = portraitHeight * 0.2;
        const distanceBetweenTheBottomOfL1bgAndPortrait = 0.106 * portraitHeight;
        const leftShiftOfL1bg_basedOnPortrait = portraitWidth * 0.0877;
        const topShiftOfMyPic_basedOnUpperBG = (17 * this.props.viewportWidth + 2144)/416;
        const paddingLeftOfPicAndGtPanelCtnr = leftShiftOfL1bg_basedOnPortrait * 2;
        const l2bgHeight = topShiftOfMyPic_basedOnUpperBG + 0.5 * portraitHeight; 
        const l1bgWidth = leftShiftOfL1bg_basedOnPortrait + 0.81 * portraitWidth;        
        const l1bgHeight =  (portraitHeight - distanceBetweenTheTopsOfL1bgAndPortrait) + distanceBetweenTheBottomOfL1bgAndPortrait;
        const fontSizeOfGreetings = portraitHeight / 7;
        const widthOfGreetings = terms.myName.length * fontSizeOfGreetings;
        const marginLeftOfGtPanel = ((-0.036 * fontSizeOfGreetings + 20.15982) / 17.19) * fontSizeOfGreetings;
        const marginTopOfGtPanel = ( portraitHeight * 0.5 - 2/* 也就是 greeting 的行數 */ * fontSizeOfGreetings ) / 2;
        const socialMediaLinkHeight = (-0.187 * this.props.viewportWidth + 553) / 416 * fontSizeOfGreetings;
        const marginRightOfSocialMediaLink = (0.236 * this.props.viewportWidth - 183.84) / 416 * socialMediaLinkHeight;
        const fontSizeOfWelcomeMsg = widthOfGreetings * 1.05 / terms.welcomeMsg.length;
        const marginLeftOfDescPanel = paddingLeftOfPicAndGtPanelCtnr + portraitWidth;
        const paddingTopOfDescPanel = (-0.25 * this.props.viewportWidth + 568)/416 * fontSizeOfWelcomeMsg;
        const marginBottomOfWelcomeMsg = paddingTopOfDescPanel;
        const fontSizeOfDesc = (3 * this.props.viewportWidth - 160) / 208;
        const paddingBottomOfDescPanel = (this.props.viewportWidth - 192)/832 * fontSizeOfDesc;
        const marginRightOfToolIcon = (15 * this.props.viewportWidth - 9244.48) / 416;
        const heightOfTallToolIcon = (-0.168 * this.props.viewportWidth + 668.32) / 416 * distanceBetweenTheBottomOfL1bgAndPortrait;
        const heightOfShortToolIcon = (-0.2 * this.props.viewportWidth + 611.1) / 416 * distanceBetweenTheBottomOfL1bgAndPortrait;
        const leftShiftOfIconChain_basedOnDescPanel = marginLeftOfGtPanel;
        const bottomShiftOfIconChain_basedOnDescPanel = -1 * ((0.25 * this.props.viewportWidth + 56)/416 + 1) * heightOfTallToolIcon;
        const distanceFromTopOfBgOfPosts = portraitHeight * 0.5 + distanceBetweenTheBottomOfL1bgAndPortrait * 2;
        
        const l2bg = {
            height:l2bgHeight,
            picAndGtCtnr:{
                topShift:topShiftOfMyPic_basedOnUpperBG,
                paddingLeft:paddingLeftOfPicAndGtPanelCtnr
            },
            portrait:{
                imgUrl:"img/portrait-4-3rd.png",
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
                    width:socialMediaLinkHeight,
                    height:socialMediaLinkHeight,
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
            <SloganOnExternalScreen viewportWidth={this.props.viewportWidth} l2bg={l2bg} descPanel={descPanel}
                bgOfPost={bgOfPost} baseZIndex={this.props.baseZIndex + 1}>
                <ListOfRecentPostsOnExternalScreen estimatedWidthOfContainer={estimatedWidthOfContainer}
                    baseZIndex={this.props.baseZIndex + 10} remFontSize={18} posts={this.props.posts}
                    marginTopOfPost={distanceBetweenTheBottomOfL1bgAndPortrait} />
            </SloganOnExternalScreen>
        );
    }
}