import * as React from 'react';
import * as terms from './terms';
import { isFontSupported } from '../../service/featureDetection';

interface SiteNameProps {
    name:string,
    base64EncodedTitle:string,
    fontSize:number,
    top:number,
    left:number
}

export default class SiteName extends React.Component<SiteNameProps> {
    constructor(props) {
        super(props);

        /*
            為了解瀏覽器是否支援我要使用的字體，
            把指定字串安置到螢幕上看不見之處再量測寬度，然後比對寬度是否和事先預設的數值相同。
            若相同則視為存在，否則標記 true、false 準備以 png 替換。
            詳情可參閱此模組的樣式表以了解測試元素的樣式。
        */
       this.fontSupported = isFontSupported("'HanziPen SC', 'HanziPenSC-W5'", 'Arial');
    }
    fontSupported = false;
    render () {
        let basicStyle = {
            top:this.props.top + "px",
            left:this.props.left + "px"
        }
        if (this.fontSupported) {
            basicStyle["fontFamily"] = "'HanziPen SC', 'HanziPenSC-W5', 'Arial'";
            basicStyle["fontSize"] = `${this.props.fontSize}px`;
            return (
                <span id="site-name" style={basicStyle}>
                    <a className="backToHome" href="/" title={terms.backToHome} data-navigo>{this.props.name}</a>
                </span>
            );
        } else {
            basicStyle["height"] = `${this.props.fontSize * 1.15}px`;//1.15 是 html 文字預設的行高。
            return (
                <a id="site-name" className="backToHome" href="/" title={terms.backToHome} data-navigo>
                    <img src={this.props.base64EncodedTitle} style={basicStyle} alt={this.props.name}/></a>
            );
        }
    }
}