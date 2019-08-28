import * as React from 'react';
import * as terms from './terms';

interface PropsOfSloganOnTable {
    viewportWidth:number;
}

/*
  註: SloganOnTable 是首頁元件的特例
  因為它的設計相對單純，所以實作時我不像其他尺吋的首頁把產生規格的程式與塗層的程式分拆至 xxx-screen 與 slogan 兩部分，
  而是直接在 slogan 裡面產生規格並塗層。
*/

export default class SloganOnTablet extends React.Component<PropsOfSloganOnTable> {
    render() {

        const remFontSize = 18;
        const paddingTopOfL2bg = (this.props.viewportWidth + 6848) / 192
        const paddingLeftOfL2bg = remFontSize * 2.66;
        const paddingRightOfL2bg = remFontSize * 1.25;
        const widthOfPic = this.props.viewportWidth * 0.54;
        const heightOfPic = widthOfPic * 0.6;
        const halfOfTheHeightOfPic = 0.5 * heightOfPic;

        const styleOfL2bg = {
            paddingTop:`${paddingTopOfL2bg}px`,
            paddingLeft:`${paddingLeftOfL2bg}px`,
            paddingRight:`${paddingRightOfL2bg}px`,
            height:`${halfOfTheHeightOfPic + paddingTopOfL2bg}px`,
        }

        const styleOfMyPic = {
            width:`${widthOfPic}px`,
            height:`${heightOfPic}px`
        }

        const fontSizeOfGreetings = heightOfPic / 7;
        const marginLeftOfGtPanel = 0.82 * fontSizeOfGreetings;
        const styleOfGtPanel = {
            marginLeft:`${marginLeftOfGtPanel}px`,
            height:`${halfOfTheHeightOfPic}px`
        }

        const styleOfGreetings = {
            fontSize:`${fontSizeOfGreetings}px`
        }

        const shiftOfL1bg = 1.4 * remFontSize;
        const heightOfL1bg = shiftOfL1bg + 0.78 * heightOfPic;
        const widthOfL1bg = shiftOfL1bg + 0.8 * widthOfPic;
        const styleOfL1bg = {
            left:`${-shiftOfL1bg}px`,
            bottom:`${-shiftOfL1bg}px`,
            width:`${widthOfL1bg}px`,
            height:`${heightOfL1bg}px`,
        }

        const heightOfDescPanel = halfOfTheHeightOfPic + shiftOfL1bg + 1.4 * remFontSize;
        const paddingLeftOfDescPanel = paddingLeftOfL2bg + widthOfPic + marginLeftOfGtPanel;
        const maxWidthOfWelMsg = this.props.viewportWidth - paddingLeftOfDescPanel - paddingRightOfL2bg;
        const fontSizeOfWelMsg = maxWidthOfWelMsg / terms.welcomeMsg.length;
        const marginTopBottomOfWelMsg = (0.09 * remFontSize + 195.84) * fontSizeOfWelMsg / 384;
        const styleOfDescPanel ={
            minHeight:`${heightOfDescPanel}px`,
            padding:`${marginTopBottomOfWelMsg}px ${paddingRightOfL2bg}px 0 ${paddingLeftOfDescPanel}px`,
        }

        const styleOfWelMsg = {
            fontSize:`${fontSizeOfWelMsg}px`,
            marginBottom:`${marginTopBottomOfWelMsg}px`
        }

        let fontSizeOfDesc = maxWidthOfWelMsg / 17;
        if (fontSizeOfDesc < 14) {
            fontSizeOfDesc = 14;
        }
        const styleOfDesc = {
            fontSize:`${fontSizeOfDesc}px`
        }

        return (
            <div id="slogan" className="tb">
                <section className="l2bg" style={styleOfL2bg}>
                    <div className="picAndGtCtnr">
                        <div className="myPic" style={styleOfMyPic}>
                            <div className="l1bg" style={styleOfL1bg}></div>
                            <img className="portrait" src="img/portrait-5-3rd.png" />
                        </div>
                        <div className="gtPanel" style={styleOfGtPanel}>
                            <h1 className="greetings" style={styleOfGreetings}>
                                {terms.greetingMsg}<br />{terms.myName}</h1>
                        </div>
                    </div>                    
                </section>
                <section className="descPanel" style={styleOfDescPanel}>
                    <div className="welcome" style={styleOfWelMsg}>{terms.welcomeMsg}</div>
                    <div className="desc" style={styleOfDesc}>{terms.desc}</div>
                </section>
            </div>
        );
    }
}