import * as React from 'react';
import * as terms from './terms';
import { isNum } from '../../../service/validator';
import { isFontSupported } from '../../../service/featureDetection';

interface PropsOfGreetingMessage {
    fontSize:number;
    marginTop?:number;//為行動裝置增加的設定
}

export default class GreetingMessage extends React.Component<PropsOfGreetingMessage> {
    constructor(props) {
        super(props);
        
        /*
            為了解瀏覽器是否支援歡迎句要用的字體，
            我要把特定字串安置到螢幕上看不見之處再量測寬度，然後比對寬度是否和事先預設的數值相同。
            若相同則視為存在，否則調整 fontSupported 參數讓後序步驟以 png 圖片替換文字。
        */
       this.fontSupported = isFontSupported('Yuppy TC', 'Arial');
    }
    fontSupported = false;
    render() {
        const style = {};
        if (isNum(this.props.marginTop)) {
            style['marginTop'] = `${this.props.marginTop}px`;
            /*
                註: 不知道為什麼，行動版網頁招呼句和上面圖片之間的空格不能透過替圖片加 margin-bottom 產生，這種 margin 會崩塌掉。
                因此這邊只好藉由此元件提供 margin-top 參數給行動版網頁設定以產生間距。
            */
        }

        if (this.fontSupported) {
            style['fontSize'] = `${this.props.fontSize}px`;
            style['fontWeight'] = 100;
            return (
                <h1 className="greetings" style={style}>{terms.greetingMsg}&#13;&#10;{terms.myName}</h1>
            )
        } else {
            const styleOfLine = {
                padding:`${0.15 * this.props.fontSize / 2}px 0`,
                /* 0.15 的來源: 預設有 1.15 倍行高，扣掉 1 倍行高之後剩下 0.15 倍分給上下 padding。 */
                height:`${this.props.fontSize}px`
            }
            return (
                <div className="greetings" style={style}>
                    <img src="img/hello.png" style={styleOfLine} alt="您好~" /><img src="img/i-am-youjenli.png" style={styleOfLine} alt="我是李祐任！" />
                </div>
            )
        }
    }
}