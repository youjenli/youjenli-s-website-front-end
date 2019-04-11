import * as React from 'react';
import * as terms from './terms';
import * as socialMediaTerms from '../socialMedia/terms';
import * as icon from '../socialMedia/icons';
import * as logo from './logo';

interface PropsOfExternalScreenSlogan {
    viewportWidth:number;
    l2bg:{
        height:number;
        portrait:{
            width:number;
            height:number;
            topShift:number;
            leftShift:number;
            l1bg:{
                width:number;
                height:number;
                topShift:number;
                leftShift:number;
            }
        },
        gtPanel:{
            width:number;
            topShift:number;
            leftShift:number;
            greetings:{
                fontSize:number;
                width:number;
            };
            sm:{
                width:number;
                height:number;
                marginRight:number;
            }
        }        
    }
    descPanel:{
        width:number;
        leftShift:number;
        topShift:number;
        padding:{
            top:number;
            right:number;
            bottom:number;
            left:number;
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
        width:number;
        paddingTop:number;
    }
    baseZIndex:number;
}

export default class SloganOfExternalScreen extends React.Component<PropsOfExternalScreenSlogan> {
    render() {
        
        const styleOfL2bg = {
            height:`${this.props.l2bg.height}px`,
            zIndex:this.props.baseZIndex + 3
        };
        const styleOfMyPic = {
            width:`${this.props.l2bg.portrait.width}px`,
            height:`${this.props.l2bg.portrait.height}px`,
            top:`${this.props.l2bg.portrait.topShift}px`,
            left:`${this.props.l2bg.portrait.leftShift}px`
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
            width:`${this.props.l2bg.gtPanel.width}px`,
            top:`${this.props.l2bg.gtPanel.topShift}px`,
            left:`${this.props.l2bg.gtPanel.leftShift}px`
        }
        const styleOfGreetings = {
            fontSize:`${this.props.l2bg.gtPanel.greetings.fontSize}px`,
            width:`${this.props.l2bg.gtPanel.greetings.width}px`
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
            width:`${this.props.descPanel.width}px`,
            top:`${this.props.descPanel.topShift}px`,
            left:`${this.props.descPanel.leftShift}px`,
            padding:`${paddingOfDescPanel.top}px ${paddingOfDescPanel.right}px ${paddingOfDescPanel.bottom}px ${paddingOfDescPanel.left}px`,
            zIndex:this.props.baseZIndex + 2
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
        const spaceBetweenPortraitAndGtPanel = this.props.l2bg.gtPanel.leftShift 
                - (this.props.l2bg.portrait.leftShift + this.props.l2bg.portrait.width);
        const styleOfIconChain = {
            left:`${spaceBetweenPortraitAndGtPanel}px`,
            bottom:`${-1 * this.props.descPanel.iconChain.icon.tall.height * 1.5}px`
        }

        const styleOfPostsOfBg = {
            width:`${this.props.bgOfPost.width}px`,
            paddingTop:`${this.props.bgOfPost.paddingTop}px`,
            zIndex:this.props.baseZIndex + 1
        };
        
        return (
            <main id="main" className="es">
                <section className="l2bg" style={styleOfL2bg}>
                    <div className="myPic" style={styleOfMyPic}>
                        <div className="l1bg" style={styleOfL1bg}></div>
                        <img className="portrait" style={portraitStyle} src="img/portrait-es-large-16-10th.png" />
                    </div>
                    <div className="gtPanel" style={styleOfGtPanel}>
                        <h1 className="greetings" style={styleOfGreetings}>
                            {terms.greetingMsg}<br />{terms.myName}</h1>
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
                </section>
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
                <section className="bgOfPosts" style={styleOfPostsOfBg}>
                    {this.props.children}
                </section>
            </main>
        );
    }
}