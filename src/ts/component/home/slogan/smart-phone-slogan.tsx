import * as React from 'react';
import * as terms from './terms';

interface PropsOfSloganOnSmartPhone {
    baseZIndex:number;
    marginBottom:number;
    l1bg:{
        margin:{
            top:number;
            leftRight:number;
        }
        portrait:{
            imgUrl:string;
            width:number;
            height:number;
            topShift:number;
            leftShift:number;
        }
        greetings:{
            fontSize:number;
            marginTopBottom:number;
        }
    }
    descPanel:{
        padding:{
            top:number;
            leftRight:number;
            bottom:number;
        }
        welMsg:{
            fontSize:number;
            marginBottom:number;
        }
        desc:{
            fontSize:number;
        }
    }
}

export default class SloganOnSmartPhone extends React.Component<PropsOfSloganOnSmartPhone> {
    render() {
        const ml1 = this.props.l1bg.margin;
        const styleOfL1bg = {
            margin:`${ml1.top}px ${ml1.leftRight}px 0px ${ml1.leftRight}px`,
            paddingTop:`${this.props.l1bg.portrait.height + this.props.l1bg.portrait.topShift}px`,
            paddingBottom:`${this.props.l1bg.greetings.marginTopBottom}px`,
            zIndex:this.props.baseZIndex + 2
        };
        const styleOfPortrait = {
            width:`${this.props.l1bg.portrait.width}px`,
            height:`${this.props.l1bg.portrait.height}px`,
            top:`${this.props.l1bg.portrait.topShift}px`,
            left:`${this.props.l1bg.portrait.leftShift}px`,
            zIndex:this.props.baseZIndex + 3
        }
        const styleOfGreetings = {
            fontSize:`${this.props.l1bg.greetings.fontSize}px`,
            marginTop:`${this.props.l1bg.greetings.marginTopBottom}px`
        }
        const borderRadiusOfDescPanel = 5;
        const pdp = this.props.descPanel.padding;
        const styleOfDescPanel = {
            margin:`0 ${ml1.leftRight}px`,
            padding:`${pdp.top + borderRadiusOfDescPanel}px ${pdp.leftRight}px ${pdp.bottom}px ${pdp.leftRight}px`,
            bottom:`${borderRadiusOfDescPanel}px`,
            zIndex:this.props.baseZIndex + 1
        }
        const styleOfWelMsg = {
            fontSize:`${this.props.descPanel.welMsg.fontSize}px`,
            marginBottom:`${this.props.descPanel.welMsg.marginBottom}px`
        }
        const styleOfDesc = {
            fontSize:`${this.props.descPanel.desc.fontSize}px`
        }

        return (
            <div id="slogan" className="sp">
                <div className="l2bg" style={styleOfL1bg}>
                    <img className="portrait" src={this.props.l1bg.portrait.imgUrl} style={styleOfPortrait}/>
                    <div className="greetings" style={styleOfGreetings}>{terms.greetingMsg}{terms.myName}</div>
                </div>
                <div className="descPanel" style={styleOfDescPanel}>
                    <div className="welcome" style={styleOfWelMsg}>{terms.welcomeMsg}</div>
                    <div className="desc" style={styleOfDesc}>{terms.desc}</div>
                </div>
            </div>
        );
    }
}