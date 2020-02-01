/// <reference path="../../../model/global-vars.d.ts"/>
import * as React from 'react';
import * as terms from './terms';
import GreetingMessage from './greeting';
import WelcomeMessage from './welcome';

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
        const maxWidthOfWelMsg = this.props.viewportWidth - paddingLeftOfDescPanel - paddingRightOfL2bg - 25;
        /*
            20191005 發現畫面捲軸的寬度會影響這邊的計算結果，導致 maxWidthOfWelMsg 這個值比畫面上可分配的空間還大，
            最後使得文字被迫斷行，不符設計規格。
            為解決這個問題，這邊計算可分配空間的公式要再扣掉捲軸寬度。然而，因為我們在這一步驟時，仍無法得知捲軸寬度，
            所以我先扣掉一個比常見瀏覽器 (Chrome、Firefox) 的捲軸寬度還要更大的值，那就是 25。

            這個方法也許不夠理想，但在想到更好做法之前，暫時先這樣做。
        */
        const fontSizeOfWelMsg = Math.floor(maxWidthOfWelMsg / terms.welcomeMsg.length);
        const marginTopBottomOfWelMsg = (0.09 * remFontSize + 195.84) * fontSizeOfWelMsg / 384;
        const styleOfDescPanel ={
            minHeight:`${heightOfDescPanel}px`,
            padding:`${marginTopBottomOfWelMsg}px ${paddingRightOfL2bg}px 0 ${paddingLeftOfDescPanel}px`,
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
                        <div className="myPic">
                            <div className="l1bg" style={styleOfL1bg}></div>
                            <img className="portrait" src={window.wp.themeUrl + "img/portrait-5-3rd.png"} style={styleOfMyPic}/>
                        </div>
                        <div className="gtPanel" style={styleOfGtPanel}>
                            <GreetingMessage fontSize={fontSizeOfGreetings} />
                        </div>
                    </div>
                </section>
                <section className="descPanel" style={styleOfDescPanel}>
                    <WelcomeMessage fontSize={fontSizeOfWelMsg} marginBottom={marginTopBottomOfWelMsg} />
                    <div className="desc" style={styleOfDesc}>{terms.desc}</div>
                </section>
            </div>
        );
    }
}