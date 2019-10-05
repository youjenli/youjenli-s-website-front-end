import * as React from 'react';
import * as terms from './terms';
import * as socialMediaTerms from './socialMedia/terms';
import * as icon from './socialMedia/icons';
import * as logo from './logo';
import Greeting from './greeting';

export interface PropsOfSloganOnExternalScreen {
    viewportWidth:number;
    l2bg:{
        height:number;
        picAndGtCtnr:{
            topShift:number;
            paddingLeft:number;
        }
        portrait:{
            imgUrl:string;
            width:number;
            height:number;
            l1bg:{
                width:number;
                height:number;
                topShift:number;
                leftShift:number;
            }
        },
        gtPanel:{
            marginTop:number;
            marginLeft:number;
            greetings:{
                fontSize:number;
            };
            sm:{
                width:number;
                height:number;
                marginRight:number;
            }
        }        
    }
    descPanel:{
        marginLeft:number;
        padding:{
            top:number;
            bottom:number;
        }
        welMsg:{
            fontSize:number;
            marginBottom:number;
        }
        desc:{
            fontSize:number;
        }
        iconChain:{
            leftShift:number;
            bottomShift:number;
            icon:{
                marginRight:number;
                tall:{
                    height:number;
                };
                short:{
                    height:number;
                }
            }                
        }            
    }
    bgOfPost:{
        margin:{
            leftRightInPercent:number;
            bottom:number;
        },
        paddingBottom:number;
        postCtnr:{
            distanceFromTopOfBgOfPosts:number;
        }
    }
    baseZIndex:number;
}

export default class SloganOnExternalScreen extends React.Component<PropsOfSloganOnExternalScreen> {
    render() {
        
        const styleOfL2bg = {
            height:`${this.props.l2bg.height}px`,
            zIndex:this.props.baseZIndex + 3
        };
        const styleOfPicAndGtCtnr = {
            top:`${this.props.l2bg.picAndGtCtnr.topShift}px`,
            marginLeft:`${this.props.bgOfPost.margin.leftRightInPercent}%`,
            marginRight:`${this.props.bgOfPost.margin.leftRightInPercent}%`,
            paddingLeft:`${this.props.l2bg.picAndGtCtnr.paddingLeft}px`
        };
        const styleOfMyPic = {
            width:`${this.props.l2bg.portrait.width}px`,
            height:`${this.props.l2bg.portrait.height}px`
            /*注意，在 pic and gt ctnr 的左邊有兩倍 l1bg leftshift 的 padding 之後，這裡就不必再有 margin */
        };
        const portraitStyle = {
            width:`${this.props.l2bg.portrait.width}px`,
            height:`${this.props.l2bg.portrait.height}px`,
            zIndex:this.props.baseZIndex + 5
        };
        const styleOfL1bg = {
            width:`${this.props.l2bg.portrait.l1bg.width}px`,
            height:`${this.props.l2bg.portrait.l1bg.height}px`,
            left:`${-1 * this.props.l2bg.portrait.l1bg.leftShift}px`,
            top:`${this.props.l2bg.portrait.l1bg.topShift}px`,
            zIndex:this.props.baseZIndex + 4
        }
        const styleOfGtPanel = {
            marginTop:`${this.props.l2bg.gtPanel.marginTop}px`,
            marginLeft:`${this.props.l2bg.gtPanel.marginLeft}px`,
            marginRight:`${this.props.l2bg.portrait.l1bg.leftShift}px`
        }
        const styleOfSMIcon = {
            width:`${this.props.l2bg.gtPanel.sm.width}px`,
            height:`${this.props.l2bg.gtPanel.sm.height}px`,
            marginRight:`${this.props.l2bg.gtPanel.sm.marginRight}px`
        }
        const styleOfSMGrp = {
            /*social media group 外框必須把最右側社群網站連結的 margin 吃掉，這樣才能實現對齊的設計 */
            marginRight:`${-1 * this.props.l2bg.gtPanel.sm.marginRight}px`
        }
        const paddingOfDescPanel = this.props.descPanel.padding;
        const styleOfDescPanel = {
            marginLeft:`${this.props.descPanel.marginLeft}px`,
            marginRight:`${this.props.l2bg.portrait.l1bg.leftShift}px`,
            padding:`${paddingOfDescPanel.top}px ${this.props.l2bg.gtPanel.marginLeft}px ${paddingOfDescPanel.bottom}px ${this.props.l2bg.gtPanel.marginLeft}px`,
            zIndex:this.props.baseZIndex + 1
        }
        const styleOfWelMsg = {
            fontSize:`${this.props.descPanel.welMsg.fontSize}px`,
            marginBottom:`${this.props.descPanel.welMsg.marginBottom}px`
        }
        const styleOfDesc = {
            fontSize:`${this.props.descPanel.desc.fontSize}px`
        }
        
        const styleOfTallToolIcon = {
            height:`${this.props.descPanel.iconChain.icon.tall.height}px`,
            marginRight:`${this.props.descPanel.iconChain.icon.marginRight}px`
        }
        const styleOfShortToolIcon = {
            height:`${this.props.descPanel.iconChain.icon.short.height}px`,
            marginRight:`${this.props.descPanel.iconChain.icon.marginRight}px`
        }
        
        const styleOfIconChain = {
            bottom:`${this.props.descPanel.iconChain.bottomShift}px`
        }

        const styleOfPostsOfBg = {
            margin:`0 ${this.props.bgOfPost.margin.leftRightInPercent}% ${this.props.bgOfPost.paddingBottom}px ${this.props.bgOfPost.margin.leftRightInPercent}%`,
            paddingBottom:`${this.props.bgOfPost.paddingBottom}px`
        };

        const styleOfPlaceHldrInBgOfPosts = {
            height:`${this.props.bgOfPost.postCtnr.distanceFromTopOfBgOfPosts}px`
        }

        return (
            <div id="slogan" className="es">
                <section className="l2bg" style={styleOfL2bg}>
                    <div className="picAndGtCtnr" style={styleOfPicAndGtCtnr}>
                        <div className="myPic" style={styleOfMyPic}>
                            <div className="l1bg" style={styleOfL1bg}></div>
                            <img className="portrait" style={portraitStyle} src={this.props.l2bg.portrait.imgUrl} />
                        </div>
                        <div className="gtPanel" style={styleOfGtPanel}>
                            <Greeting fontSize={this.props.l2bg.gtPanel.greetings.fontSize} />
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
                    </div>                    
                </section>
                <section className="bgOfPosts" style={styleOfPostsOfBg}>
                    <div className="placehlder" style={styleOfPlaceHldrInBgOfPosts}>
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
                    </div>
                    {this.props.children}
                </section>
            </div>
        );
    }
}