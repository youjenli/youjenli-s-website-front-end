import * as React from 'react';
import * as terms from './slogan/terms';

interface PropsOfHomeOfTablet {
    viewportWidth:number;
    baseZIndex:number;
}

export default class HomeOfTablet extends React.Component<PropsOfHomeOfTablet> {
    render() {
        const remFontSize = 18;
        const widthOfPortrait = this.props.viewportWidth * 0.54;
        const heightOfPortrait = widthOfPortrait * 0.6
        const distanceBetweenTheLeftOfL1BgAndViewportLeft = remFontSize * 1.25;
        const distanceBetweenTheTopsOfPortraitAndL2bg = (this.props.viewportWidth + 6848)/192
        const paddingOfL2bg = {
            top:distanceBetweenTheTopsOfPortraitAndL2bg,
            left:remFontSize * 2.66,
            right:distanceBetweenTheLeftOfL1BgAndViewportLeft
        };
        const leftShiftOfL1bg_basedOnPortrait = remFontSize * 1.4;
        const distanceBetweenBottomsOfL1bgAndPortrait = leftShiftOfL1bg_basedOnPortrait;
        const topShfitOfL1bg_basedOnPortrait = heightOfPortrait * 0.22;
        const distanceBetweenRightEdgesOfL1bgAndPortrait = widthOfPortrait * 0.2;
        const widthOfL1bg = (widthOfPortrait - distanceBetweenRightEdgesOfL1bgAndPortrait) + leftShiftOfL1bg_basedOnPortrait;
        const heightOfL1bg = (heightOfPortrait - topShfitOfL1bg_basedOnPortrait) + distanceBetweenBottomsOfL1bgAndPortrait;
        const fontSizeOfGreetings = heightOfPortrait / 7;
        const marginTopOfGreetings = (0.5 * heightOfPortrait - fontSizeOfGreetings * 2) / 2;
        const distanceBetweenGreetingsAndPortrait = 0.82 * fontSizeOfGreetings;
        const paddingLeftOFDescPanel = 
            distanceBetweenTheLeftOfL1BgAndViewportLeft + leftShiftOfL1bg_basedOnPortrait 
            + widthOfPortrait + distanceBetweenGreetingsAndPortrait;
        const paddingRightOfDescPanel = distanceBetweenTheLeftOfL1BgAndViewportLeft;
        const fontSizeOfWelMsg = (this.props.viewportWidth - paddingLeftOFDescPanel - paddingRightOfDescPanel) / terms.welcomeMsg.length;
        const paddingTopOfDescPanel = (0.09 * this.props.viewportWidth + 195.84) * fontSizeOfWelMsg /384;
        let fontSizeOfDesc = (this.props.viewportWidth - paddingLeftOFDescPanel - paddingRightOfDescPanel) / 17;
        if (fontSizeOfDesc < 14) {
            fontSizeOfDesc = 14;
        }
        const minHeightOfDescPanel = 0.5 * heightOfPortrait + distanceBetweenBottomsOfL1bgAndPortrait
                + 1.4 * remFontSize;
        
        const styleOfL2bg = {
            height:`${distanceBetweenTheTopsOfPortraitAndL2bg + 0.5 * heightOfPortrait}px`,
            padding:`${paddingOfL2bg.top}px ${paddingOfL2bg.right}px 0 ${paddingOfL2bg.left}px`,
            zIndex:this.props.baseZIndex + 2
        }
        const styleOfPortrait = {
            width:`${widthOfPortrait}px`,
            height:`${heightOfPortrait}`,
            zIndex:this.props.baseZIndex + 5
        }
        const styleOfL1bg = {
            width:`${widthOfL1bg}px`,
            height:`${heightOfL1bg}px`,
            top:`${topShfitOfL1bg_basedOnPortrait}px`,
            left:`${-1 * leftShiftOfL1bg_basedOnPortrait}px`,
            zIndex:this.props.baseZIndex + 4
        }

        const styleOfGreetings = {
            marginTop:`${marginTopOfGreetings}px`,
            marginLeft:`${distanceBetweenGreetingsAndPortrait}px`,
            fontSize:`${fontSizeOfGreetings}px`
        }

        const styleOfDescPanel = {
            padding:`${paddingTopOfDescPanel}px ${paddingRightOfDescPanel}px ${paddingTopOfDescPanel}px ${paddingLeftOFDescPanel}px`,
            minHeight:`${minHeightOfDescPanel}px`,
            zIndex:this.props.baseZIndex + 1
        }

        const styleOfWelMsg = {
            fontSize:`${fontSizeOfWelMsg}px`,
            marginBottom:`${paddingTopOfDescPanel}px`
        }

        const styleOfDesc = {
            fontSize:`${fontSizeOfDesc}px`
        }

        return (
            <React.Fragment>
                <div id="slogan" className="tb">
                    <div className="l2bg" style={styleOfL2bg}>
                        <div className="myPic">
                            <img src="img/portrait-5-3rd.png" className="portrait" style={styleOfPortrait}/>
                            <div className="l1bg" style={styleOfL1bg}></div>
                        </div>
                        <div className="greetings" style={styleOfGreetings}>{terms.greetingMsg}<br />{terms.myName}</div>
                    </div>
                    <div className="descPanel" style={styleOfDescPanel}>
                        <div className="welcome" style={styleOfWelMsg}>{terms.welcomeMsg}</div>
                        <div className="desc" style={styleOfDesc}>{terms.desc}</div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}