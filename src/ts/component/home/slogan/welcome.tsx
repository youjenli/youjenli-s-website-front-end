import * as React from 'react';
import { isFontSupported } from '../../../service/featureDetection';
import { isNum } from '../../../service/validator';
import * as terms from './terms';
import { isNumber } from 'util';

interface PropsOfWelcomeMessage {
    fontSize:number;
    marginTop?:number;
    marginBottom?:number;
}

export default class WelcomeMessage extends React.Component<PropsOfWelcomeMessage> {
    constructor(props) {
        super(props);
        
       /*
           為了解瀏覽器是否支援歡迎句要用的字體，
           我要把特定字串安置到螢幕上看不見之處再量測寬度，然後比對寬度是否和事先預設的數值相同。
           若相同則視為存在，否則調整 fontSupported 參數讓後序步驟以 png 圖片替換文字。
       */
       this.fontSupported = isFontSupported('Klee', 'Arial');
    }
    fontSupported = false;
    render() {
        const style = {};
        if (this.fontSupported) {
            style['fontSize'] = `${this.props.fontSize}px`;
            if (isNum(this.props.marginTop)) {
                style['marginTop'] = `${this.props.marginTop}px`;
            }
            if (isNum(this.props.marginBottom)) {
                style['marginBottom'] = `${this.props.marginBottom}px`;
            }
            return (
                <div className="welcome" style={style}>{terms.welcomeMsg}</div>
            )
        } else {
            if (isNum(this.props.marginTop)) {
                style['paddingTop'] = `${this.props.marginTop}px`;
            }
            if (isNum(this.props.marginBottom)) {
                style['paddingBottom'] = `${this.props.marginBottom}px`;
            }
            style['height'] = `${this.props.fontSize}px`;
            return (
                <img src="img/welcome-msg.png" alt="歡迎來到我的個人網站！" style={style} />
            )
        }
    }
}